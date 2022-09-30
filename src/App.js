import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Link,
  useParams
} from "react-router-dom";
import TableCoins from "./components/TableCoins";
import Home from "./components/Home/Home"
import Login from "./components/Login/Login";
import Web3 from "web3";

function App() {

  let { id } = useParams();
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [balance, setBalance] = useState(0);

  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const coinList = "/";
  const top10List = "/top10";


  const getData = async () => {
    try {
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false"
      );
      setCoins(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onLogin = async (provider) => {
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask!");
    } else if (accounts[0] !== currentAccount) {
      setCurrentAccount(accounts[0]);
      const accBalanceEth = web3.utils.fromWei(
        await web3.eth.getBalance(accounts[0]),
        "ether"
      );

      setBalance(Number(accBalanceEth).toFixed(6));
      setIsConnected(true);
    }
  };

  const onLogout = () => {
    setIsConnected(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Router>
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand m-3" href="#">CC Rankings</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to={coinList}>Coin List</Link>
            </li>
            <li className="nav-item">
             <Link className="nav-link" to={top10List}>Top 10 Coins</Link>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
              <a class="btn btn-outline-primary my-2 my-sm-0" type="submit"><img className="image" src={"https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png"} />{currentAccount}</a>
            </form>
        </div>
      </nav>
        
        <div className="container">
          <div className="row">
          {!isConnected && <Login onLogin={onLogin} onLogout={onLogout} />}
          {isConnected && (
            <Home currentAccount={currentAccount} balance={balance} />
          )}
          </div>
          <div className="row">
            <TableCoins coins={coins} search={search} />
          </div>
        </div>
    </div>
  </Router>
  );
}

export default App;
