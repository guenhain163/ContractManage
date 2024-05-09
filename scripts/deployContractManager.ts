import { toNano } from '@ton/core';
import { ContractManager } from '../wrappers/ContractManager';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const contractManager = provider.open(await ContractManager.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await contractManager.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(contractManager.address);

    console.log('List Participant', await contractManager.getListParticipant());
}
