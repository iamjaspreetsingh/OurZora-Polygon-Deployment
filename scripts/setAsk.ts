import fs from 'fs-extra';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { MediaFactory } from '../typechain/MediaFactory';
import { MarketFactory } from '../typechain/MarketFactory';
import Decimal from '../utils/Decimal';
require('dotenv').config();


async function start() {
  const args = require('minimist')(process.argv.slice(2));

  if (!args.tokenId) {
    throw new Error('--tokenId tokenId is required');
  }
  if (!args.amount) {
    throw new Error('--amount amount is required');
  }
  if (!args.sellOnShare) {
    throw new Error('--sellOnShare sellOnShare% is required');
  }

  const provider = new JsonRpcProvider(process.env.RPC_ENDPOINT);

  const wallet = new Wallet(`0x${process.env.PRIVATE_KEY}`, provider);
  
  const sharedAddressPath = `${process.cwd()}/addresses/${process.env.CHAIN_ID}.json`;
  // @ts-ignore
  const addressBook = JSON.parse(await fs.readFileSync(sharedAddressPath));

  console.log('Transacting setAsk...');
  const market = MarketFactory.connect(addressBook.market, wallet);
  const media = MediaFactory.connect(addressBook.media, wallet);
  var name=await media.name();
  var symbol=await media.symbol();
  console.log(name);
  console.log(symbol);
  let Ask = {
    amount: args.amount,
    currency:process.env.CURRENCY,
    sellOnShare: Decimal.new(args.sellOnShare)
  };

  await media.setAsk(args.tokenId,Ask);

}

start().catch((e: Error) => {
  console.error(e);
  process.exit(1);
});

