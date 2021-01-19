const ShivaToken = artifacts.require("ShivaToken.sol");

module.exports = function (deployer) {
  deployer.deploy(ShivaToken, 1000000);
};
