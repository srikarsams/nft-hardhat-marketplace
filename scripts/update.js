const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const TOKEN_ID = 1;

async function update() {
  const nftMarketplace = await ethers.getContract("NFTMarketplace");
  const basicNft = await ethers.getContract("BasicNft");
  const listing = await nftMarketplace.updateListing(
    basicNft.address,
    TOKEN_ID,
    ethers.utils.parseEther("0.2")
  );
  await listing.wait(1);
  console.log("NFT Updated!");
  if (network.config.chainId == 31337) {
    await moveBlocks(2, 1000);
  }
}

update()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
