const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const TOKEN_ID = 0;

async function buyItem() {
  const nftMarketplace = await ethers.getContract("NFTMarketplace");
  const basicNft = await ethers.getContract("BasicNft");
  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);
  const price = listing.price.toString();
  console.log(basicNft.address, "price");
  const tx = await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
    value: price,
  });
  await tx.wait(1);
  console.log("NFT Bought!");
  if (network.config.chainId == 31337) {
    await moveBlocks(2, 1000);
  }
}

buyItem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
