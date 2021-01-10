pragma solidity 0.5.1;

/// @title ShivaToken
/// @author Devesh Rawat
/// @notice  Simple Token For store values
/// @dev ERC20 Token standerd

contract ShivaToken {
    
    uint256 public totalSupply;

    constructor() public{
        totalSupply = 1000000;
    }
}