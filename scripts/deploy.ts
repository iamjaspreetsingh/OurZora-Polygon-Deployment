import fs from 'fs-extra';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { MediaFactory } from '../typechain/MediaFactory';
import { MarketFactory } from '../typechain/MarketFactory';
require('dotenv').config();

const erc721Name="OurZoraCore";
const erc721Symbol="OZC";

async function start() {
  const args = require('minimist')(process.argv.slice(2));

  const provider = new JsonRpcProvider(process.env.RPC_ENDPOINT);
  const wallet = new Wallet(`0x${process.env.PRIVATE_KEY}`, provider);
  const sharedAddressPath = `${process.cwd()}/addresses/${process.env.CHAIN_ID}.json`;
  // @ts-ignore
  const addressBook = JSON.parse(await fs.readFileSync(sharedAddressPath));
  if (addressBook.market) {
    throw new Error(
      `market already exists in address book at ${sharedAddressPath}. Please move it first so it is not overwritten`
    );
  }
  if (addressBook.media) {
    throw new Error(
      `media already exists in address book at ${sharedAddressPath}. Please move it first so it is not overwritten`
    );
  }

  console.log('Deploying Market...');
  const deployTx = await new MarketFactory(wallet).deploy();
  console.log('Deploy TX: ', deployTx.deployTransaction.hash);
  await deployTx.deployed();
  console.log('Market deployed at ', deployTx.address);
  addressBook.market = deployTx.address;

  console.log('Deploying Media...');
  const mediaDeployTx = await new MediaFactory(wallet).deploy(
    addressBook.market,
    erc721Name,
    erc721Symbol
  );
  console.log(`Deploy TX: ${mediaDeployTx.deployTransaction.hash}`);
  await mediaDeployTx.deployed();
  console.log(`Media deployed at ${mediaDeployTx.address}`);
  addressBook.media = mediaDeployTx.address;

  console.log('Configuring Market...');
  const market = MarketFactory.connect(addressBook.market, wallet);
  const tx = await market.configure(addressBook.media);
  console.log(`Market configuration tx: ${tx.hash}`);
  await tx.wait();
  console.log(`Market configured.`);

  const media = MediaFactory.connect(addressBook.media, wallet);
  var name=await media.name();
  var symbol=await media.symbol();
  console.log(name);
  console.log(symbol);

  await fs.writeFile(sharedAddressPath, JSON.stringify(addressBook, null, 2));
  console.log(`Contracts deployed and configured. ☼☽`);
}

start().catch((e: Error) => {
  console.error(e);
  process.exit(1);
});
