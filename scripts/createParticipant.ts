import { address, Address, toNano } from '@ton/core';
import { ContractManager } from '../wrappers/ContractManager';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
  const main = provider.open(await ContractManager.fromInit(11651n));

  await main.send(
    provider.sender(),
    {
      value: toNano('0.05'),
    },
    {
      $$type: 'ParticipantCreate',
      walletAddress: address("EQBGhqLAZseEqRXz4ByFPTGV7SVMlI4hrbs-Sps_Xzx01x8G"),
      name: 'Hain',
      // balance: 50n
    }
  );
}