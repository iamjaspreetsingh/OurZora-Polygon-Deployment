## Rationale

0. In addresses folder, with chain IDs contract addresses for Media & Market smart contract are present:

```
137 -> MATIC MAINNET 
80001 -> MATIC TESTNET
```

Contracts are already deployed on both testnet and mainnet, to redeploy fresh one, you need to remove it.
Configure your ```.env file```


1. Mint the new piece of Media

```
yarn mint --tokenURI tokenuri.com --metadataURI metadataoftoken.com --contentHash d497a931063d5f6f15b8a10d4cd25ea23b3611ce9b7207ea6baa2f6aea722023 --metadataHash d497a931063d5f6f15b8a10d4cd25ea23b3611ce9b7207ea6baa2f6aea722023 --creatorShare 20
```


2. View Media Info:

```
yarn mediaInfo --tokenId 11
``` 


3. Owner may set an Ask on their media. The ask serves to automatically fulfill a bid if it satisfies the parameters of the ask. This allows collectors to optionally buy a piece outright, without waiting for the owner to explicitly accept their bid. set the CURRENCY in .env file.

```
yarn setAsk --tokenId 11 --amount 50000 --sellOnShare 5
```

<!-- Approve Media Contract for CURRENCY use-->
4. Set the Bid by other account (check PRIVATE_KEY_BIDDER, BIDDER_ADDRESS, RECIPIENT_ADDRESS accordingly in .env)

```
yarn setBid --tokenId 11 --amount 40000 --sellOnShare 5
```


6. Accept Bid by owner (if not was per the Ask)

```
yarn acceptBid --tokenId 11 --amount 40000 --sellOnShare 5
```


6. Remove Ask(optional)

```
yarn removeAsk --tokenId 8
```


7. Remove Bid(optional)

```
yarn removeBid --tokenId 8
```


