var gacha = artifacts.require("./gacha.sol");

module.exports = function (deployer) {
  deployer.deploy(gacha);
};
