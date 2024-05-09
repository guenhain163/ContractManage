import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
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
        const sender = await blockchain.treasury('sender');
        const blancer = await contractManager.getBalance();
    });

});
