# Blockchain-Based Academic Certificate Verification System

## Overview

This project is a secure system designed to verify academic certificates using Blockchain technology. It prevents fake certificates and ensures authenticity, transparency, and trust.

---

## Features

- Certificate Upload & Verification System
- Blockchain Storage (Ethereum Sepolia Network)
- IPFS Storage using Pinata
- Role-Based Authentication (Admin / User)
- JWT-based Secure Login System
- Real-time Certificate Validation

---

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- MongoDB (Atlas)

### Blockchain

- Ethereum (Sepolia Testnet)
- Smart Contracts (Solidity)

### Storage

- IPFS (Pinata)

---

## Project Structure

root/
│
├── client/  
├── server/  
├── blockchain/  
└── README.md

---

## Installation & Setup

### 1. Clone the Repository

git clone https://github.com/your-username/your-repo-name.git  
cd your-repo-name

---

### 2. Install Dependencies

Frontend:
cd client  
npm install

Backend:
cd ../server  
npm install

---

### 3. Environment Variables

Server `.env`:
PORT=10000  
MONGODB_URI=your_mongodb_atlas_url  
JWT_SECRET=your_secret  
SEPOLIA_RPC_URL=your_infura_url  
PRIVATE_KEY=your_wallet_private_key  
CONTRACT_ADDRESS=your_contract_address  
PINATA_API_KEY=your_pinata_key  
PINATA_SECRET_API_KEY=your_pinata_secret  
EMAIL_USER=your_email  
EMAIL_PASS=your_app_password

Client `.env`:
VITE_API_BASE_URL=https://your-backend-url.onrender.com

---

### 4. Run Project

Backend:
cd server  
npm run dev

Frontend:
cd client  
npm run dev

---

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## Workflow

1. User uploads certificate
2. Certificate stored on IPFS
3. Hash stored on Blockchain
4. Certificate is verified using blockchain data

---

## Author

Satyam Kumar Solanki

---

## License

For academic and educational use only.
