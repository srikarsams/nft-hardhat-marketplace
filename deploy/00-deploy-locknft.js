const {
  getNamedAccounts,
  deployments,
  network,
  run,
  ethers,
} = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  // const { deploy, log } = deployments;
  // const { deployer } = await getNamedAccounts();
  // const lockNFT = await deploy("LockNFT", {
  //   from: deployer,
  //   log: true,
  //   waitConfirmations: 0,
  // });
  // await verify(lockNFT.address, []);
  // console.log("verified");
  // // 0x99C7C4b7212FA3251717BC8bF3651c335599A63b
  // const lockNFTContract = await ethers.getContract("LockNFT", deployer);
  // await lockNFTContract.mintNft();
  // const tokenCounter = await lockNFTContract.getTokenCounter();
  // console.log(tokenCounter);
  // const address = await lockNFTContract.getTokenOwner(tokenCounter);
  // console.log("token owner: ", address);
  // console.log("expectedtoken owner: ", deployer);
  // const accounts = await ethers.getSigners();
  // await lockNFTContract.whiteList(accounts[3].address);
  // console.log("address requested for whitelist:", accounts[3].address);
  // const isWhiteListed = await lockNFTContract.isWhitelisted(
  //   accounts[3].address
  // );
  // console.log("Whitelisted:", isWhiteListed);
  // await lockNFTContract.transferNFT(deployer, accounts[3].address, 1);
  // const newAddress = await lockNFTContract.getTokenOwner(tokenCounter);
  // console.log("token owner: ", newAddress);
  // console.log("expectedtoken owner: ", accounts[3].address);
  // const lockNFTContractThree = await lockNFTContract.connect(accounts[3]);
  // await lockNFTContractThree.transferNFT(accounts[3].address, deployer, 1);
  // const newAddressn = await lockNFTContract.getTokenOwner(tokenCounter);
  // console.log("token owner: ", newAddressn);
  // console.log("expectedtoken owner: ", deployer);
};
