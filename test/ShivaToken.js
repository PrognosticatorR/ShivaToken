const ShivaToken = artifacts.require("ShivaToken.sol");

contract(ShivaToken, function (accounts) {
  it("Sets total supply to the token", function () {
    return ShivaToken.deployed()
      .then((instance) => {
        tokenInstance = instance;
        return tokenInstance.totalSupply();
      })
      .then((totalSupply) => {
        let supply = totalSupply.toNumber();
        assert.equal(supply, 1000000, "set's the supply to 1 million");
      });
  });
});
