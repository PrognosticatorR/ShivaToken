pragma solidity 0.5.1;

/// @title ShivaToken
/// @author Devesh Rawat
/// @notice  Simple Token For store values
/// @dev ERC20 Token standerd

contract ShivaToken {
    
    string public name = "Shiva Token";
    string public symbol ="OM";
    string public standard = 'Shiva Token v1.0';
    uint256 public totalSupply;
    
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _initialSupply) public{
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    // Transfer
    function transfer(address _to, uint256 _value) public returns (bool success){
        // Exception if account doesn't ave enough balance
        require(balanceOf[msg.sender] >= _value);
        // Transfer tokens
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        // Transfer Event
        emit Transfer(msg.sender, _to, _value);
        // Return boolean
        return true;
    }

    // approve
    function approve(address _spender, uint256 _value) public returns (bool success){
        // allowance
        allowance[msg.sender][_spender] =  _value;
        // approve event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    // transferFrom
    function transferFrom(address _from , address _to , uint256 _value) public returns (bool success){
        // Require _from has enough tokens
        require(_value <= balanceOf[_from]);

        // Requires allowance is big enough
        require(_value <= allowance[_from][msg.sender]);

        // Change  balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        // Update allowance
        allowance[_from][msg.sender] -= _value;

        // Transfer Event
        emit Transfer(_from, _to, _value);

        // return a boolean 
        return true;
    }

    // Delegated Transfer

}   