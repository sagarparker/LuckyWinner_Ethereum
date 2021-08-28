import Web3 from 'web3';
require('dotenv').config();

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running.
  web3 = new Web3(window.ethereum);
  window.ethereum.enable()
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    process.env.infuraendpoint
  );
  web3 = new Web3(provider);
}

export default web3;