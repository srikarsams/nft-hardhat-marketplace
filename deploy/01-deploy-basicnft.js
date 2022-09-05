const { network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;
  const args = [];

  log("---------------------------------------------");
  log("Deploying Basic NFT Smartcontract...");
  const basicNftContract = await deploy("BasicNft", {
    from: deployer,
    log: true,
    args,
    waitConfirmations: networkConfig[chainId].confirmations,
  });
  log("Deployed Basic NFT Smartcontract!!!");

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying Basic NFT smart contract...");
    await verify(basicNftContract.address, args);
    log("Verified Basic NFT smart contract!!!");
  }
};

module.exports.tags = ["all", "nftmarketplace", "basicnft"];
