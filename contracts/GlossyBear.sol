// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GlossyBear is ERC721, Ownable {
    using Strings for uint256;
    uint256 public nextTokenId;
    uint256 public constant MINT_PRICE = 0.00001 ether; // Цена 0.00001
    string public apiBaseUrl;

    constructor(string memory _apiBaseUrl) ERC721("Glossy Bear 3D", "GB3D") Ownable(msg.sender) {
        apiBaseUrl = _apiBaseUrl;
    }

    function mint() public payable {
        require(msg.value >= MINT_PRICE, "Need 0.00001 ETH");
        _safeMint(msg.sender, nextTokenId++);
    }

    function setApiUrl(string memory _url) external onlyOwner { apiBaseUrl = _url; }
    function withdraw() external onlyOwner { payable(owner()).transfer(address(this).balance); }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(apiBaseUrl, "/api/metadata?id=", tokenId.toString()));
    }
}
