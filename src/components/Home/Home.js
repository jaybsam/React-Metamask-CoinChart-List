import Card from "../UI/Card/Card";
import classes from "./Home.module.css";

const Home = (props) => {
  return (
    <Card className={classes.home}>
      <h1>Welcome</h1>
      <p><a class="btn btn-outline-primary my-2 my-sm-0"><img className={classes.image} src={"https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png"} />{props.currentAccount}</a></p>
      <p>{props.balance} ETH</p>
      <a class="btn btn-primary my-2 my-sm-0">Logout</a>
    </Card>
  );
};
export default Home;
