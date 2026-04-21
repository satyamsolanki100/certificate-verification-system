const { ethers } = require("ethers");
require("dotenv").config();

// Load ABI from server folder
const abi = require("../abi/CertificateRegistry.json").abi;

// Provider + Wallet
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

module.exports = contract;
