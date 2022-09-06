const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

async function cancel() {
  const nftMarketPlace = await ethers.getContract("NFTMarketplace");
  const basicNFT = await ethers.getContract("BasicNft");

  console.log("Cancelling...");

  const cancelTx = await nftMarketPlace.cancelListing(basicNFT.address, 3);
  const cancelTxRecept = await cancelTx.wait(1);
  const tokenId = cancelTxRecept.events[0].args.tokenId;

  console.log("Canceled Listing!!");

  if (network.config.chainId === 31337) {
    await moveBlocks(2, 1000);
  }
}

cancel()
  .then(() => {
    console.log("done");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
