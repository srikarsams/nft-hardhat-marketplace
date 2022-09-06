const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

async function mintAndList() {
  const nftMarketPlace = await ethers.getContract("NFTMarketplace");
  const basicNFT = await ethers.getContract("BasicNft");

  console.log("Minting...");

  const mintTx = await basicNFT.mintNft();
  const mintTxRecept = await mintTx.wait(1);
  const tokenId = mintTxRecept.events[0].args.tokenId;

  console.log("Minted NFT!!");
  console.log("Approving NFT...");

  const approvalTx = await basicNFT.approve(nftMarketPlace.address, tokenId);
  const approvalTxRecept = await approvalTx.wait(1);

  console.log("Approved NFT...");
  console.log("Listing NFT...");

  const listTx = await nftMarketPlace.listItem(
    basicNFT.address,
    tokenId,
    ethers.utils.parseEther("0.1")
  );
  await listTx.wait(1);

  console.log("Listed NFT!!!");

  if (network.config.chainId === 31337) {
    await moveBlocks(2, 1000);
  }
}

mintAndList()
  .then(() => {
    console.log("done");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
