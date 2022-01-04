const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

var whitelistAddresses = [
    "0xEC86f9f4034011d7B38D61509110713e76504112", //ALT 3
    "0xB476128E0605666216c1851499B3af562B0CA0fe" //ALT 2
]

const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

module.exports = {
    getMerkleInfo: function (senderAddress) {
        senderAddress = keccak256(senderAddress);
        const hexProof = merkleTree.getHexProof(senderAddress);
        return hexProof;
    }
};