import { ContractManager } from '../wrappers/ContractManager';
import { NetworkProvider } from '@ton/blueprint';
import { address } from '@ton/core';

export async function run(provider: NetworkProvider) {
  const main = provider.open(await ContractManager.fromInit(11651n));

  const license = await main.getParticipant(address("EQBGhqLAZseEqRXz4ByFPTGV7SVMlI4hrbs-Sps_Xzx01x8G"))
  console.log(license)
}