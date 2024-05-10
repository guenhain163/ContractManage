import { Blockchain, SandboxContract, TreasuryContract, prettyLogTransactions, printTransactionFees } from '@ton/sandbox';
import { address, beginCell, fromNano, toNano } from '@ton/core';
import { ContractManager } from '../wrappers/ContractManager';
import '@ton/test-utils';
import { JettonDefaultWallet, TokenTransfer, TransferContact, type TransferWallet } from '../build/ContractManager/tact_JettonDefaultWallet';
import { buildOnchainMetadata } from '../utils/jetton-helpers';

const jettonParams = {
    name: "Best Practice",
    description: "This is description of Test tact jetton",
    symbol: "XXXE",
    image: "https://play-lh.googleusercontent.com/ahJtMe0vfOlAu1XJVQ6rcaGrQBgtrEZQefHy7SXB7jpijKhu1Kkox90XDuH8RmcBOXNn",
};
let content = buildOnchainMetadata(jettonParams);

describe('ContractManager', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let contractManager: SandboxContract<ContractManager>;
    let jettonWallet: SandboxContract<JettonDefaultWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');

        contractManager = blockchain.openContract(await ContractManager.fromInit(deployer.address, 0n));

        const deployResult = await contractManager.send(
            deployer.getSender(),
            {
                value: toNano('50'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: contractManager.address,
            deploy: true,
            success: true,
        });

        const playerWallet = await contractManager.getGetWalletAddress(deployer.address);
        jettonWallet = blockchain.openContract(await JettonDefaultWallet.fromAddress(playerWallet));
    });

    it("Test: whether contract deployed successfully", async () => {
        // the check is done inside beforeEach, blockchain and token are ready to use
        console.log((await contractManager.getGetJettonData()).owner);
        // console.log((await contractManager.getGetJettonData()).wallet_code);
        // console.log((await contractManager.getGetJettonData()).content);
    });

    // it('add phonebook', async () => {
    //     // the check is done inside beforeEach
    //     // blockchain and contractManager are ready to use
    //     const arrayBefore = await contractManager.getListPhonebook();
    //     console.log("arrayBefore:", arrayBefore.length);

    //     const sender = await blockchain.treasury('sender');
    //     const phonebookAddress = address("kQAlzWPgHxZFwyTS0YfsptplcsZe88VxOQ0Jd5pBf2fcGDVO");
    //     const phonebookName = 'Ly';

    //     const deployResult = await contractManager.send(
    //         sender.getSender(),
    //         {
    //             value: toNano('0.05'),
    //         },
    //         {
    //             $$type: 'PhonebookCreate',
    //             walletAddress: phonebookAddress,
    //             name: phonebookName,
    //         }
    //     );

    //     expect(deployResult.transactions).toHaveTransaction({
    //         from: sender.address,
    //         to: contractManager.address,
    //         success: true,
    //     });
    //     const arrayAfter = await contractManager.getListPhonebook();
    //     expect(arrayBefore.length).toBeLessThan(arrayAfter.length);
    //     console.log("arrayAfter:", arrayAfter.length);
    // });

    it('Transfer wallet', async () => {
        const sender = await blockchain.treasury("sender");
        const receiver = await blockchain.treasury("receiver");
        const initMintAmount = toNano(1000);
        const transferAmount = toNano(80);

        const mintMessage: TransferWallet = {
            $$type: "TransferWallet",
            amount: initMintAmount,
            receiver: sender.address,
        };
        await contractManager.send(deployer.getSender(), { value: toNano("0.25") }, mintMessage);

        const senderWalletAddress = await contractManager.getGetWalletAddress(sender.address);
        const senderWallet = blockchain.openContract(JettonDefaultWallet.fromAddress(senderWalletAddress));

        // Transfer tokens from sender's wallet to receiver's wallet // 0xf8a7ea5
        const transferMessage: TokenTransfer = {
            $$type: "TokenTransfer",
            query_id: 0n,
            amount: transferAmount,
            sender: receiver.address,
            response_destination: sender.address,
            custom_payload: null,
            forward_ton_amount: toNano("0.1"),
            forward_payload: beginCell().storeUint(0, 1).storeUint(0, 32).endCell(),
        };
        const transferResult = await senderWallet.send(sender.getSender(), { value: toNano("0.5") }, transferMessage);
        expect(transferResult.transactions).toHaveTransaction({
            from: sender.address,
            to: senderWallet.address,
            success: true,
        });
        printTransactionFees(transferResult.transactions);
        prettyLogTransactions(transferResult.transactions);

        const receiverWalletAddress = await contractManager.getGetWalletAddress(receiver.address);
        const receiverWallet = blockchain.openContract(JettonDefaultWallet.fromAddress(receiverWalletAddress));

        const senderWalletDataAfterTransfer = await senderWallet.getGetWalletData();
        const receiverWalletDataAfterTransfer = await receiverWallet.getGetWalletData();

        expect(senderWalletDataAfterTransfer.balance).toEqual(initMintAmount - transferAmount); // check that the sender transferred the right amount of tokens
        expect(receiverWalletDataAfterTransfer.balance).toEqual(transferAmount); // check that the receiver received the right amount of tokens
        const balance1 = (await receiverWallet.getGetWalletData()).balance;
        console.log(fromNano(balance1));

    });

    it('getBalance', async () => {
        // the check is done inside beforeEach
        // blockchain and contractManager are ready to use
        // const transferAmount = toNano(80);
        // console.log(transferAmount);
        // const TransferContact: TransferContact = {
        //     $$type: "TransferContact",
        //     amount: transferAmount,
        //     receiver: 'Ly',
        // };
        // await contractManager.send(deployer.getSender(), { value: toNano("0.25") }, TransferContact);

        // const walletData = await jettonWallet.getGetWalletData();
        // expect(walletData.owner).toEqualAddress(deployer.address);
        // expect(walletData.balance).toBeGreaterThanOrEqual(0);
    });
});
