`use strict`;
const ShivaToken = artifacts.require("ShivaToken.sol");

contract(ShivaToken, function (accounts) {
  var tokenInstance;
  it("initializes the contract wit the  correct values", function () {
    return ShivaToken.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return tokenInstance.name();
      })
      .then(function (name) {
        assert.equal(name, "Shiva Token", "has the correct name!");
        return tokenInstance.symbol();
      })
      .then(function (symbol) {
        assert.equal(symbol, "OM", "has correct symbol!");
        return tokenInstance.standard();
      })
      .then(function (standard) {
        assert.equal(standard, "Shiva Token v1.0", "has the correct standard!");
      });
  });
  it("allocates initial supply to the token", function () {
    return ShivaToken.deployed()
      .then((instance) => {
        tokenInstance = instance;
        return tokenInstance.totalSupply();
      })
      .then((totalSupply) => {
        let supply = totalSupply.toNumber();
        assert.equal(supply, 1000000, "set's the supply to 1 million");
        return tokenInstance.balanceOf(accounts[0]);
      })
      .then(function (adminBalance) {
        assert.equal(adminBalance.toNumber(), 1000000, "it allocates initial supply to the admin!");
      });
  });

  it("transfer tokens ", function () {
    return ShivaToken.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return tokenInstance.transfer.call(accounts[1], 78998765456789);
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(error.message.indexOf("revert") >= 0, "error message must contain revert");
        return tokenInstance.transfer
          .call(accounts[1], 250000, { from: accounts[0] })
          .then(function (success) {
            assert.equal(success, true, "it returns true");
            return tokenInstance.transfer(accounts[1], 250000, {
              from: accounts[0],
            });
          });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "triggers 1 event!");
        assert.equal(receipt.logs[0].event, "Transfer", "should be Transfer event");
        assert.equal(
          receipt.logs[0].args._from,
          accounts[0],
          "logs the account the tokens transfered from!"
        );
        assert.equal(
          receipt.logs[0].args._to,
          accounts[1],
          "logs the account the tokens transfered to!"
        );
        assert.equal(receipt.logs[0].args._value, 250000, "logs the amount of the transfer");
        return tokenInstance.balanceOf(accounts[1]);
      })
      .then(function (balance) {
        assert.equal(balance.toNumber(), 250000, "transfers the tokens to recievers accopunt");
        return tokenInstance.balanceOf(accounts[0]);
      })
      .then(function (balance) {
        assert.equal(balance.toNumber(), 750000, "deducted the amount from the sending account!");
      });
  });
});
