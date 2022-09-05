// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NFTMarketplace__PriceMustBeAboveZero();
error NFTMarketplace__NotApprovedForMarketplace(
    address nftAddress,
    uint256 tokenId
);
error NFTMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
error NFTMarketplace__NotListed(address nftAddress, uint256 tokenId);
error NFTMarketplace__NotOwner(
    address nftAddress,
    uint256 tokenId,
    address sender
);
error NFTMarketplace__PriceNotMet(
    address nftAddress,
    uint256 tokenId,
    uint256 price
);
error NFTMarketplace__NoProceeds();
error NFTMarketplace__TranferFailed(address sender, uint256 proceeds);

contract NFTMarketplace is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCancelled(
        address indexed seller,
        address indexed nftAddressed,
        uint256 tokenId
    );

    event ItemUpdated(
        address indexed seller,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 price
    );

    event WithdrawProceeds(address indexed seller, uint256 proceeds);

    // NFT Address -> tokenId -> Listing
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    // proceeds
    mapping(address => uint256) private s_proceeds;

    // =================
    // Modifiers
    // =================
    modifier notListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NFTMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address sender
    ) {
        IERC721 nft = IERC721(nftAddress);
        if (nft.ownerOf(tokenId) != sender) {
            revert NFTMarketplace__NotOwner(nftAddress, tokenId, sender);
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NFTMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    // =================
    // Main Functions
    // =================
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert NFTMarketplace__PriceMustBeAboveZero();
        }
        // Owners will still hold the NFT, and give the marketplace the approval
        // to sell the NFT for them.

        // check whether NFT contract has already appoved marketplace, if not
        // revert with an error
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NFTMarketplace__NotApprovedForMarketplace(
                nftAddress,
                tokenId
            );
        }

        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        nonReentrant
        isListed(nftAddress, tokenId)
    {
        Listing memory listing = s_listings[nftAddress][tokenId];

        // if sender has not sent enough ETH, revert with error
        if (msg.value < listing.price) {
            revert NFTMarketplace__PriceNotMet(
                nftAddress,
                tokenId,
                listing.price
            );
        }
        // increment the seller proceeds
        // why not sending proceeds to seller directly - https://fravoll.github.io/solidity-patterns/pull_over_push.html
        s_proceeds[listing.seller] = s_proceeds[listing.seller] + msg.value;
        // delete the listing
        delete (s_listings[nftAddress][tokenId]);
        // transfer the nft
        IERC721(nftAddress).safeTransferFrom(
            listing.seller,
            msg.sender,
            tokenId
        );
        emit ItemBought(msg.sender, nftAddress, tokenId, listing.price);
    }

    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete s_listings[nftAddress][tokenId];
        emit ItemCancelled(msg.sender, nftAddress, tokenId);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemUpdated(msg.sender, nftAddress, tokenId, newPrice);
    }

    function withdrawProceeds() external nonReentrant {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NFTMarketplace__NoProceeds();
        }

        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (success) {
            emit WithdrawProceeds(msg.sender, proceeds);
        } else {
            revert NFTMarketplace__TranferFailed(msg.sender, proceeds);
        }
    }

    // =================
    // Getters
    // =================

    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}
