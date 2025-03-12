// METAMASK INJECTION VERIFICATION

import { Web3 } from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // We are in browser and metamask is running
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} else {
    // We are on server *OR* user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://sepolia.infura.io/v3/cf8dd99f86d84140913c6ebf4ef25fa7'
    );
    web3 = new Web3(provider);
}


export default web3;
