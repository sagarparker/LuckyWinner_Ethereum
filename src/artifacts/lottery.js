import web3 from './web3';

const Lottery = require('./Lottery.json');

const abi             = Lottery.abi;
const contractAddress = Lottery.networks[3].address;

export default new web3.eth.Contract(abi,contractAddress);