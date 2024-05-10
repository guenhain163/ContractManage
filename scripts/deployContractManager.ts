import { toNano, type OpenedContract } from '@ton/core';
import { ContractManager } from '../wrappers/ContractManager';
import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from '../utils/jetton-helpers';

// const jettonParams = {
//     name: "Best Practice",
//     description: "This is description of Test tact jetton",
//     symbol: "XXXE",
//     image: "https://play-lh.googleusercontent.com/ahJtMe0vfOlAu1XJVQ6rcaGrQBgtrEZQefHy7SXB7jpijKhu1Kkox90XDuH8RmcBOXNn",
// };
// let content = buildOnchainMetadata(jettonParams);

export async function run(provider: NetworkProvider) {
    const senderAddress = provider.sender().address;
    let contractManager: OpenedContract<ContractManager>;
    if (senderAddress) {
        console.log(senderAddress);
        contractManager = provider.open(await ContractManager.fromInit(senderAddress, BigInt(Math.floor(Math.random() * 10000))));

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

        console.log('Balance', await contractManager.getBalance());
    } else {
        console.error("Sender address is not available");
    }
}
