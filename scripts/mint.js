const { ethers } = require("hardhat");

async function mint() {
  const nftMarketPlace = await ethers.getContract("NFTMarketplace");
  const basicNFT = await ethers.getContract("BasicNft");

  console.log("Minting...");

  const mintTx = await basicNFT.mintNft();
  const mintTxRecept = await mintTx.wait(1);
  const tokenId = mintTxRecept.events[0].args.tokenId;

  console.log(`Minted token#${tokenId}`);
}

mint()
  .then(() => {
    console.log("done");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
