'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
  try {

    // Parse the connection profile. This would be the path to the file downloaded
    // from the IBM Blockchain Platform operational console.
    const ccpPath = path.resolve(__dirname, 'connection.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Configure a wallet. This wallet must already be primed with an identity that
    // the application can use to interact with the peer node.
    const walletPath = path.resolve(__dirname, 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    // Create a new gateway, and connect to the gateway peer node(s). The identity
    // specified must already exist in the specified wallet.
    const gateway = new Gateway();
    /** enrollUser.js 에서 생성한 identity 를 이용  */
    await gateway.connect(ccp, { wallet, identity: 'user1' , discovery: {enabled: true, asLocalhost:false }});

    // Get the network channel that the smart contract is deployed to.
    const network = await gateway.getNetwork('defaultchannel');

    // Get the smart contract from the network channel.
    const contract = network.getContract('abab');  //  smart contract 이름

    // Submit the 'createCar' transaction to the smart contract, and wait for it
    // to be committed to the ledger.
    const result = await contract.submitTransaction('invoke', 'a', 'b', '1000');
    console.log('Transaction(invoke) has been submitted');
   
    const aResult = await contract.evaluateTransaction('query', 'a');
    console.log('query a result is ' + aResult.toString());

   const bResult = await contract.evaluateTransaction('query', 'b');
   console.log('query b result is ' + bResult.toString());

    await gateway.disconnect();

    } catch (error) {
      console.error(`Failed to submit transaction: ${error}`);
      process.exit(1);
    }
  }
main();
