/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-waffle');
const secrets = require('./secrets.json');

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: secrets.INFURA_URL,
      accounts: [`0x${secrets.PRIVATE_KEY}`]
    }
  }
};
