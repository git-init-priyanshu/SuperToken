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

        // Partner
        address[] public requestForPartner;
        address[] public allPartners;

        mapping(address => uint) public partnerAsk;

        constructor(uint256 _initialSupply) ERC20("SuperToken", "STK") {
            _mint(owner(), _initialSupply);
            increaseAllowance(owner(), _initialSupply);
        }

        function mintTokens(uint _amt) public onlyOwner{
            _mint(owner(), _amt);
        }

        // Check for partner
        function isPartner(address _checkAddress) public view returns (bool){
            for (uint i=0; i<allPartners.length; i++){
                if(_checkAddress == allPartners[i]){
                    return true;
                }
            }
            return false;
        }

        // Modifier to ensure only authorized partners can call a function
        modifier onlyPartner() {
            require(isPartner(msg.sender), "You are not a partner");
            _;
        }

        function askForPartnership() external {
            require(!isPartner(msg.sender),"You are already a partner");
            requestForPartner.push(msg.sender);
        }

        // Get all requests
        function getAllRequests() public view onlyOwner returns(address[] memory){
            return requestForPartner;
        }

        // Get index of element from an array
        function _getIndex(address _address) private view returns(uint,bool){
            for (uint i=0; i<requestForPartner.length; i++){
                if(_address == requestForPartner[i]){
                    return (i,true);
                }
            }
            return (0,false);
        }

        // Remove the address from the array
        function _removePartnershipRequest(address _address) private {
            // Removing the address from the array
            (uint index, bool isExists) = _getIndex(_address);
            
            require(isExists, "Invalid Address");
            // replacing the element by last element
            requestForPartner[index] = requestForPartner[requestForPartner.length -1];
            // removing the last element
            delete requestForPartner[requestForPartner.length -1];
            requestForPartner.pop();
        }

        // Admin can reject the requests
        function rejectRequest(address _address) external onlyOwner{
            require(!isPartner(_address), "No request sent by the address");

            _removePartnershipRequest(_address);
        }

        // Allows admin to add someone as a partner and allow them to issue some predetermined no. of tokens
        function addAsPartner(address _address) external onlyOwner {
            require(!isPartner(_address), "Address is already a partner");

            partnerAsk[_address] = 0;

            allPartners.push(_address);

            _removePartnershipRequest(_address);

            emit PartnerAdded(_address);
        }

        // Get all partner addresses
        function getAllPartners() public view onlyOwner returns (address[] memory) {
            return allPartners;
        }

        // Partners can ask for tokens
        function askForTokens(uint32 _tokenAmount) external onlyPartner {
            require(partnerAsk[msg.sender] == 0, "Request already pending");

            partnerAsk[msg.sender] = _tokenAmount;

            emit TokenAsked(msg.sender, _tokenAmount);
        }

        // Owner approves and transfers requested tokens to partners
        function approveTokensToPartner(address _partner) external onlyOwner {
            require(isPartner(_partner), "Not a Partner");
            require(partnerAsk[_partner] > 0, "Tokens already given");

            transfer(_partner, partnerAsk[_partner]);

            // increasing allowance of the partner
            increaseAllowance(_partner, partnerAsk[_partner]);

            // decreasing allowance of the admin
            decreaseAllowance(owner(), partnerAsk[_partner]);

            partnerAsk[_partner] = 0;

            emit ApproveToken(_partner, partnerAsk[_partner]);
        }

        // Issue tokens to a customer or partner
        function issueTokens( address _to, uint32 _tokenAmount) external {
            require(msg.sender == owner() || isPartner(msg.sender), "Not Authorized");

            transfer( _to, _tokenAmount);

            // increasing allwance of the customer
            increaseAllowance(_to, _tokenAmount);

            // decreasing allowance of the partner/admin
            decreaseAllowance(msg.sender, _tokenAmount);
        }

        // Customers use these tokens
        function useTokens(address _toSeller, uint _price, uint _amt) external {
            require(_amt == _price, "Amount should be equal to the price");

            transfer(_toSeller, _amt);

            // decreasing allowance of the customer
            decreaseAllowance(msg.sender, _amt);

            // increasing allowance of the partner/admin
            increaseAllowance(_toSeller, _amt);

            emit TokenUsed(msg.sender, _amt);
        }
    }