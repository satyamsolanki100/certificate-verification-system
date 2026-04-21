const { ethers } = require("ethers");
require("dotenv").config();

// 1. Connection Setup
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// 2. Load ABI
const abi =
  require("../../blockchain/artifacts/contracts/CertificateRegistry.sol/CertificateRegistry.json").abi;

// 3. Initialize Contract
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

// 🔍 DEBUG: Immediate Connection Check
provider
  .getNetwork()
  .then((net) => {
    console.log(`🔗 Blockchain Connected: Sepolia (ChainID: ${net.chainId})`);
  })
  .catch((err) => {
    console.error(
      "❌ Blockchain Connection Failed. Check your RPC URL and Internet.",
    );
  });

module.exports = contract;
