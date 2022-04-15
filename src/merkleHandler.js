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
    "0x27FB8A80D38F505E84873615297274c78697d575",
];
let maleAddresses = [
    "0x1531D6DdD65F6dCEdaB6fb3b2F5265d15945dFA7",
    "0x1750723695dBe141155AEB759d5bd9ccBEA755C1"
];

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

