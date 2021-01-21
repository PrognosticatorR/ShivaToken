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
        return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] }).then(function (success) {
          assert.equal(success, true, "it returns true");
          return tokenInstance.transfer(accounts[1], 250000, {
            from: accounts[0],
          });
        });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "triggers 1 event!");
        assert.equal(receipt.logs[0].event, "Transfer", "should be Transfer event");
        assert.equal(receipt.logs[0].args._from, accounts[0], "logs the account the tokens transfered from!");
        assert.equal(receipt.logs[0].args._to, accounts[1], "logs the account the tokens transfered to!");
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

  it("approves tokens for delegated", function () {
    return ShivaToken.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return tokenInstance.approve.call(accounts[1], 100);
      })
      .then(function (success) {
        assert.equal(success, true, "it returns true");
        return tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "triggers 1 event!");
        assert.equal(receipt.logs[0].event, "Approval", "should be Approval event");
        assert.equal(receipt.logs[0].args._owner, accounts[0], "logs the account the tokens transfered from!");
        assert.equal(receipt.logs[0].args._spender, accounts[1], "logs the account the tokens transfered to!");
        assert.equal(receipt.logs[0].args._value, 100, "logs the amount of the transfer");
        return tokenInstance.allowance(accounts[0], accounts[1]);
      })
      .then(function (allowance) {
        assert.equal(allowance, 100, "Sets the allowance for delegated transfer!");
      });
  });

  it("handles delegated transfers", function () {
    return ShivaToken.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return tokenInstance.approve.call(accounts[1], 100);
      })
      .then(function (success) {
        assert.equal(success, true, "it returns true");
        fromAccount = accounts[2];
        toAccount = accounts[3];
        spendingAccount = accounts[4];
        return tokenInstance.transfer(fromAccount, 1000, { from: accounts[0] });
      })
      .then(function (receipt) {
        return tokenInstance.approve(spendingAccount, 100, { from: fromAccount });
      })
      .then(function () {
        return tokenInstance.transferFrom(fromAccount, toAccount, 10000, { from: spendingAccount });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(error.message.indexOf("revert") >= 0, "cannot transfer value larger then balance!");
        return tokenInstance.transferFrom(fromAccount, toAccount, 200, { from: spendingAccount });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(error.message.indexOf("revert") >= 0, "cannot transfer value larger then approved amount!");
        return tokenInstance.transferFrom.call(fromAccount, toAccount, 100, { from: spendingAccount });
      })
      .then(function (success) {
        assert.equal(success, true);
        return tokenInstance.transferFrom(fromAccount, toAccount, 100, { from: spendingAccount });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "triggers 1 event!");
        assert.equal(receipt.logs[0].event, "Transfer", "should be Transfer event");
        assert.equal(receipt.logs[0].args._from, fromAccount, "logs the account the tokens transfered from!");
        assert.equal(receipt.logs[0].args._to, toAccount, "logs the account the tokens transfered to!");
        assert.equal(receipt.logs[0].args._value, 100, "logs the amount of the transfer");
        return tokenInstance.balanceOf(fromAccount);
      })
      .then(function (balance) {
        assert.equal(balance, 900, "deducts the amount from the sending account!");
        return tokenInstance.balanceOf(toAccount);
      })
      .then(function (balance) {
        assert.equal(balance, 100, "adds the amount to the receiving account!");
        return tokenInstance.allowance(fromAccount, spendingAccount);
      })
      .then(function (allowance) {
        assert.equal(allowance.toNumber(), 0, "deducts the amount from allowance!");
      });
  });
});
