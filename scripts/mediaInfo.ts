import fs from 'fs-extra';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { MediaFactory } from '../typechain/MediaFactory';
require('dotenv').config();

async function start() {
  const args = require('minimist')(process.argv.slice(2), {
    string: ['tokenURI', 'metadataURI', 'contentHash', 'metadataHash'],
  });

  if (!args.tokenId && args.tokenId !== 0) {
    throw new Error('--tokenId token ID is required');
  }
  
  // await require('dotenv').config({ path });
  const provider = new JsonRpcProvider(process.env.RPC_ENDPOINT);
  const wallet = new Wallet(`0x${process.env.PRIVATE_KEY}`, provider);
  const sharedAddressPath = `${process.cwd()}/addresses/${process.env.CHAIN_ID}.json`;
  // @ts-ignore
  const addressBook = JSON.parse(await fs.readFileSync(sharedAddressPath));
  if (!addressBook.media) {
    throw new Error(`Media contract has not yet been deployed`);
  }

  const media = MediaFactory.connect(addressBook.media, wallet);

  const tokenURI = await media.tokenURI(args.tokenId);
  const contentHash = await media.tokenContentHashes(args.tokenId);
  const metadataURI = await media.tokenMetadataURI(args.tokenId);
  const metadataHash = await media.tokenMetadataHashes(args.tokenId);

  console.log(`Media Information for token ${args.tokenId}`);
  console.log({ tokenURI, contentHash, metadataURI, metadataHash });
}

start().catch((e: Error) => {
  console.error(e);
  process.exit(1);
});

//yarn mediaInfo --tokenId 0