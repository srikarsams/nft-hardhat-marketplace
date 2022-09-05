const { network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const chainId = network.config.chainId;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const args = [];
  log("..........................................");
  log("Deploying NFTMarketplace contract...");
  const nftMarketplaceContract = await deploy("NFTMarketplace", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: networkConfig[chainId].confirmations,
  });
  log("Deployed NFTMarketplace contract!!!");

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying NFTMarketplace contract...");

    await verify(nftMarketplaceContract.address, args);
    log("Verified NFTMarketplace contract...");
  }
};

module.exports.tags = ["all", "nftmarketplace"];
