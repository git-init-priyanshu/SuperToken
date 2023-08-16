    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.9;

    import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";

    contract SuperToken is ERC20, Ownable {

        // Events
        event TokenTransferred(address indexed from, address indexed to, uint256 amount);
        event PartnerAdded(address indexed partner);
        event TokenAsked(address indexed by, uint amount);
        event ApproveToken(address indexed partner, uint amount);
        event TokenUsed(address indexed by, uint amount);

        // Partner struct to store partner information
        struct Partner {
            bool exists;
            uint32 pendingTokens;
        }

        // Customers and Partners mapping
        mapping(address => uint) public customers;
        mapping(address => uint) public partners;

        address[] public allPartners;

        constructor(uint256 _initialSupply) ERC20("SuperToken", "STK") {
            _mint(owner(), _initialSupply);
        }

        // Modifier to ensure only authorized partners can call a function
        modifier onlyPartner() {
            require(_isPartner(msg.sender), "You are not a partner");
            _;
        }

        // Allows admin to add someone as a partner and allow them to issue some predetermined no. of tokens
        function addAsPartner(address _address) external onlyOwner {
            require(!_isPartner(_address), "Address is already a partner");

            partners[_address] = 0;

            allPartners.push(_address);

            emit PartnerAdded(_address);
        }

        // Check for partner
        function _isPartner(address _checkAddress) private view returns (bool){
            for (uint i=0; i<allPartners.length; i++){
                if(_checkAddress == allPartners[i]){
                    return true;
                }
            }
            return false;
        }

        // Get all partner addresses
        function getAllPartners() public view returns (address[] memory) {
            return allPartners;
        }

        // Partners can ask for tokens
        function askForTokens(uint32 _tokenAmount) external onlyPartner {
            require(partners[msg.sender] == 0, "Request already pending");

            partners[msg.sender] = _tokenAmount;

            emit TokenAsked(msg.sender, _tokenAmount);
        }

        // Owner approves and transfers requested tokens to partners
        function approveTokensToPartner(address _partner) external onlyOwner {
            require(_isPartner(_partner), "Not a Partner");
            require(partners[_partner] > 0, "Tokens already given");

            _mint(_partner, partners[_partner]);
            partners[_partner] = 0;

            emit ApproveToken(_partner, partners[_partner]);
        }

        // Issue tokens to a customer or partner
        function issueTokens(address _from, address _to, uint32 _tokenAmount) external {
            require(_from == owner() || _isPartner(_from), "Not Authorized");

            _transfer(msg.sender, _to, _tokenAmount);
            customers[_to] += _tokenAmount;
        }

        // Customers use these tokens
        function useTokens(address _toSeller, uint _price, uint _amt) external {
            require(_amt == _price, "Amount should be equal to the price");

            _transfer(msg.sender, _toSeller, _amt);
            customers[msg.sender] -= _amt;

            emit TokenUsed(msg.sender, _amt);
        }
    }