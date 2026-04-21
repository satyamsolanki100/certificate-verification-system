const { ethers } = require("ethers");
require("dotenv").config();

const abi = [PASTE_ABI_HERE];

const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

module.exports = contract;
