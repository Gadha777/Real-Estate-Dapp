require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks:{
    holesky:{
      url:`https://eth-holesky.g.alchemy.com/v2/${process.env.apikey}`,
      accounts:[process.env.privatekey]
    }
  
  }
};
