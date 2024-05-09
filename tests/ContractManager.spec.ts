import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { address, toNano } from '@ton/core';
import { ContractManager } from '../wrappers/ContractManager';
import '@ton/test-utils';

describe('ContractManager', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let contractManager: SandboxContract<ContractManager>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        contractManager = blockchain.openContract(await ContractManager.fromInit(0n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await contractManager.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
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
    });

    it('getBalance', async () => {
        // the check is done inside beforeEach
        // blockchain and contractManager are ready to use
        const blancer = await contractManager.getBalance();

        expect(blancer).toEqual(0n);
    });

    it('add participant', async () => {
        // the check is done inside beforeEach
        // blockchain and contractManager are ready to use
        const sender = await blockchain.treasury('sender');
        const participantAddress = address("EQBGhqLAZseEqRXz4ByFPTGV7SVMlI4hrbs-Sps_Xzx01x8G");
        const participantName = 'Hain';
        // const participantBalance = 50n; // Assuming initial balance

        const deployResult = await contractManager.send(
            sender.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'ParticipantCreate',
                walletAddress: participantAddress,
                name: participantName,
                // balance: participantBalance,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: sender.address,
            to: contractManager.address,
            deploy: false,
            success: true,
        });

        // Verify participant addition
        // const participant = await contractManager.getParticipant(participantAddress);
        // expect(participant).not.toBeNull(); // Check participant exists
        // expect(participant?.name).toEqual(participantName);
        // expect(participant.balance).toEqual(participantBalance); // Check initial balance (if applicable)
    });

});
