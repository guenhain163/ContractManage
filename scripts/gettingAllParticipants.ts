import { ContractManager } from '../wrappers/ContractManager';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
  const main = provider.open(await ContractManager.fromInit(11651n));

  const license = await main.getListParticipant()
  console.log(license)
}