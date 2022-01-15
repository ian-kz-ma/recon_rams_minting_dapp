import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import { Provider } from "react-redux";
import "./styles/reset.css";

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

var whitelistAddresses = [
    "0xEC86f9f4034011d7B38D61509110713e76504112", //ALT 3
    "0xB476128E0605666216c1851499B3af562B0CA0fe",//ALT 2
    "0xd4255a9812E5FAb1C0907E8aA83d5df904C85872", //Mark
    "xakkadian.eth"
]

const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

export function getMerkleProof(senderAddress) {
    const hash_address = keccak256(senderAddress);
    const hexProof = merkleTree.getHexProof(hash_address);
    return hexProof;
} 

export function isWhiteListed(senderAddress) {
    const hash_address = keccak256(senderAddress);
    const hexProof = merkleTree.getHexProof(hash_address);

    if (Array.isArray(hexProof) && hexProof.length === 0){
        return false;
    }
    else{
        return true;
    }
}

