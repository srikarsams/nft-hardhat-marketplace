const networkConfig = {
  default: {
    name: "hardhat",
    confirmations: 1,
  },
  31337: {
    name: "localhost",
    confirmations: 1,
  },
  4: {
    name: "rinkeby",
    confirmations: 6,
  },
  1: {
    name: "mainnet",
    confirmations: 6,
  },
};

const developmentChains = ["hardhat", "localhost"];
const frontEndContractsFile =
  "../nextjs-moralis-nft-marketplace/constants/networkMapping.json";
const frontEndContractsFile2 =
  "../nextjs-nft-marketplace-thegraph-fcc/constants/networkMapping.json";
const frontEndAbiLocation = "../nextjs-moralis-nft-marketplace/constants/";
const frontEndAbiLocation2 =
  "../nextjs-nft-marketplace-thegraph-fcc/constants/";

module.exports = {
  networkConfig,
  developmentChains,
  frontEndContractsFile,
  frontEndContractsFile2,
  frontEndAbiLocation,
  frontEndAbiLocation2,
};
