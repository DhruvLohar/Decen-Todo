require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ganache");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    LocalGanache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      gas: 5000000,  // Set a high enough gas limit
      gasPrice: 20000000000,  // Set an appropriate gas price
    }
  }
};
