// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

error LockNFT__NotSMOwner();
error LockNFT__AddressNotWhitelisted(address to);

contract LockNFT is ERC721 {
    string public constant TOKEN_URI =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
    uint256 s_tokenCounter;
    mapping(address => bool) s_whiteListedAddressMapping;
    address immutable i_owner;

    modifier isOwner(address sender) {
        if (sender != i_owner) {
            revert LockNFT__NotSMOwner();
        }
        _;
    }

    constructor() ERC721("Lock NFT", "LKN") {
        s_tokenCounter = 0;
        i_owner = msg.sender;
    }

    function whiteList(address _address) external isOwner(msg.sender) {
        s_whiteListedAddressMapping[_address] = true;
    }

    function mintNft() public isOwner(msg.sender) {
        s_tokenCounter = s_tokenCounter + 1;
        _safeMint(msg.sender, s_tokenCounter);
    }

    function transferNFT(
        address from,
        address to,
        uint256 tokenId
    ) public {
        safeTransferFrom(from, to, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256
    ) internal view override {
        if (from != address(0) && to != address(0)) {
            if (s_whiteListedAddressMapping[to] == false && to != i_owner) {
                console.log(to);
                console.log(i_owner);
                revert LockNFT__AddressNotWhitelisted(to);
            }
        }
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getTokenOwner(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    function isWhitelisted(address _address) public view returns (bool) {
        return s_whiteListedAddressMapping[_address];
    }
}
