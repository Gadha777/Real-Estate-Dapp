# Real-Estate-Dapp
Real Estate DApp Overview This decentralized application will act as a marketplace where users can buy and sell properties. Each property will be represented as an NFT on the Ethereum blockchain, providing a secure, immutable record of ownership and transaction history.This decentralized application (DApp) automates processes like payments, ownership transfers, and property management using smart contracts, ensuring transparency and immutability.

---

## 🏗️ Features
- **Property Listings**: Add, update, and view property details.
- **Secure Transactions**: Automates payments and ownership transfers using smart contracts.
- **Ownership Records**: Maintains an immutable ledger for property ownership.
- **Decentralized Storage**: Stores property images and metadata using IPFS.
- **Search and Filter**: Easily search for properties by location, price, and other criteria.

---

## 🛠️ Technologies Used
- **Frontend**: React.js for the user interface
- **Backend**: Node.js with Express.js for API integration (optional)
- **Smart Contracts**: Solidity for Ethereum-based blockchain interaction
- **Storage**: IPFS for decentralized file storage
- **Development Tools**: Hardhat for smart contract development and testing
- **Blockchain Network**: Ethereum or compatible networks

---

## 📂 Project Structure

---

## 🚀 Setup and Installation

### Prerequisites
- Node.js (v14+)
- Hardhat
- MetaMask (or other Web3 wallets)
- An Ethereum testnet 

### Steps
1. Clone the repository:
   ```bash
   git clone <https://github.com/Gadha777/Real-Estate-Dapp>

   
2. Install dependencies:
   
   ```bash
   npm install


3. Run the React frontend:

   ```bash
   npm run dev

   ### Deploy the Smart Contract

1. **Write and Compile the Smart Contract:**
   copy the smart contract in Solidity and compile it using a framework like Hardhat.Here i deployed in holesky network get the api of holesky and put in the env file and config the hardhat config file

2. **Deploy the Contract to the Ethereum Network:**
   Hardhat to deploy the smart contract to the Ethereum network (local or testnet).

   - **With Holesky:**
     - Compile the contract: `npx hardhat compile`
     - Deploy using: `npx hardhat run scripts/deploy.js --network <network-name>

3. **Get the Deployed Contract Address and ABI:**
   After successful deployment, you will receive the contract address and ABI. Save these values as they will be required for interacting with the contract in 
       your DApp.

4. **Configure the Contract in the Project:**
   Use the contract address and ABI in your project (e.g., in a configuration file) to interact with the deployed contract.

### Set Up MetaMask

1. **Install the MetaMask Browser Extension:**
   - Go to [MetaMask](https://metamask.io) and install the extension for your preferred browser.

2. **Connect MetaMask to the Ethereum Network:**
   - Open MetaMask and connect it to the Ethereum network (either local or a testnet like Rinkeby).

3. **Import or Create an Account in MetaMask:**
   - Create a new MetaMask wallet or import an existing one. Follow the instructions provided by MetaMask.

4. **Interact with the DApp:**
   - Once MetaMask is connected to the network and the wallet is set up, you can interact with the DApp on the Ethereum blockchain.


