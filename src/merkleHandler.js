import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import { Provider } from "react-redux";
import "./styles/reset.css";

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

let femaleListAddresses = [
    "0x24B775e0d16Ed56C74E7140d0dC7e578e971107B",
    "0x1531D6DdD65F6dCEdaB6fb3b2F5265d15945dFA7"
]

let maleAddresses = [
    "0xB476128E0605666216c1851499B3af562B0CA0fe",
    "0xEC86f9f4034011d7B38D61509110713e76504112"
]


//============================FEMALE LIST==============================
const femaleLeafNodes = femaleListAddresses.map(addr => keccak256(addr));
const femaleMerkleTree = new MerkleTree(femaleLeafNodes, keccak256, { sortPairs: true });

export function getMerkleProofFemale(senderAddress) {
    const hash_address = keccak256(senderAddress);
    const hexProof = femaleMerkleTree.getHexProof(hash_address);
    return hexProof;
} 

export function isFemaleListed(senderAddress) {
    const hash_address = keccak256(senderAddress);
    const hexProof = femaleMerkleTree.getHexProof(hash_address);

    if (Array.isArray(hexProof) && hexProof.length === 0){
        return false;
    }
    else{
        return true;
    }
}

//============================MALE LIST==============================
const maleLeafNodes = maleAddresses.map(addr => keccak256(addr));
const maleMerkleTree = new MerkleTree(maleLeafNodes, keccak256, { sortPairs: true });

export function getMerkleProofMale(senderAddress) {
    const hash_address = keccak256(senderAddress);
    const hexProof = maleMerkleTree.getHexProof(hash_address);
    return hexProof;
} 

export function isMaleListed(senderAddress) {
    const hash_address = keccak256(senderAddress);
    const hexProof = maleMerkleTree.getHexProof(hash_address);

    if (Array.isArray(hexProof) && hexProof.length === 0){
        return false;
    }
    else{
        return true;
    }
}
//===================================================================

