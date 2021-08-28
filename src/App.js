import { useState,useEffect } from 'react';
import lottery  from './artifacts/lottery';
import './App.css';
import web3 from './artifacts/web3';

function App() {
  const [managerAddress,setManagerAddress] = useState('Fetching address .....');
  const [accounts,setAccounts] = useState({});
  const [players,setPlayers] = useState([]);
  const [entryValue,setEntryValue] = useState('');
  const [message,setMessage] = useState('');
  
  async function getAccountsAndPlayers(){
    let ethAccounts = await web3.eth.getAccounts();
    let lotteryPlayers = await lottery.methods.getPlayers().call()
    setAccounts(ethAccounts);
    setPlayers(lotteryPlayers);
  }

  async function getManagerAddress(){
    let managerAddress = await lottery.methods.manager().call();
    setManagerAddress(managerAddress);
  }

  let enterTheLottery = async(event)=>{
    event.preventDefault();

    setMessage('Entering the lottery, please wait for the transaction!');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(entryValue, 'ether'),
      gas : 100000
    });

    setMessage('You have entered the lottery');
  }

  let pickWinner = async() => {
    setMessage('Picking a winner, please wait for the transaction!');
    
    await lottery.methods.pickWinner().send({
      from: accounts[0],
      gas : 100000
    });

    setMessage('Winner has been picked!!!!');
  }

  useEffect(() => {
    getAccountsAndPlayers();
    getManagerAddress(); 
  },[]);
  
  return (
    <div className="App">
      <h4>LuckyWinner Lottery Manager : {managerAddress}</h4>
      <h4>No of players in the lottery : {players.length}</h4>
      <form onSubmit={enterTheLottery}>
        <input value={entryValue} onChange={(e)=>setEntryValue(e.target.value)} />
        <button type="submit">Enter the lottery</button>    
      </form>
      <button onClick={pickWinner}>Pick a winner</button>
      <h5>{message}</h5>
    </div>
  );
}

export default App;
