import logo from "./logo.svg";
import "./App.css";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
const contractAddress = "0xBd31c7eFD561317C003821e19BfceD9377FffA99";
const contractAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "addrP",
        type: "address",
      },
    ],
    name: "allow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_amountNeeded",
        type: "uint256",
      },
    ],
    name: "createProject",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addrP",
        type: "address",
      },
    ],
    name: "donate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addrP",
        type: "address",
      },
    ],
    name: "requestMoney",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "donors",
    outputs: [
      {
        internalType: "uint256",
        name: "amountDonated",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "projectDonated",
        type: "address",
      },
      {
        internalType: "address",
        name: "ownAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "projects",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "address payable",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountNeeded",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountRequested",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "amountFullfilled",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "allowed",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addrP",
        type: "address",
      },
    ],
    name: "showDonars",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

function App() {
  const [contract, setContract] = useState();
  const [name, setName] = useState();
  const [money, setMoney] = useState();
  const [amount, setAmount] = useState();
  const [projectAddr, setProjectAddr] = useState();
  const [projectAdd, setProjectAdd] = useState();
  const [addP, setAddP] = useState();
  const [donarIndex, setDonarIndex] = useState();
  const [projectIndex, setProjectIndex] = useState();
  const [allowP, setAllowP] = useState();
  const [account, setAccount] = useState();
  useEffect(() => {
    addWalletListener();
  }, []);
  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setAccount("");
      console.log("Please install MetaMask");
    }
  };
  async function connectWallet() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setContract(new ethers.Contract(contractAddress, contractAbi, signer));

    // window.ethereum.on('accountsChanged', function (accounts) {
    // Time to reload your interface with accounts[0]!
    // })
  }
  async function createProject() {
    if (contract) {
      await contract.createProject(name, amount);
    } else {
      alert("Connect to Wallet First!");
    }
  }
  async function donate() {
    if (contract) {
      try {
        const tx = await contract.donate(projectAddr, { value: money });
        tx.wait();
        alert("Successfully Donated!");
      } catch (e) {
        if (e.message.search("Project doesnot exists") != -1)
          alert("Project doesnot exists");
        else if (e.message.search("Project closed") != -1)
          alert("Project closed");
        else if (e.message.search("Cannot donate to own projects") != -1)
          alert("Cannot donate to own projects");
      }
    } else {
      alert("Connect to Wallet First!");
    }
  }
  async function withdraw() {
    if (contract) {
      try {
        const tx = await contract.withdraw();
        tx.wait();
        alert("Withdrawn successfully");
      } catch (e) {
        if (e.message.search("Donar doesnot exists") != -1)
          alert("Donar doesnot exists");
        else if (e.message.search("Project closed") != -1)
          alert("Project closed");
      }
    } else {
      alert("Connect to Wallet First!");
    }
  }
  async function requestMoney() {
    if (contract) {
      try {
        const tx = await contract.requestMoney(projectAdd);
        tx.wait();
        alert("Done");
      } catch (e) {
        if (e.message.search("Project does not exists") != -1)
          alert("Project does not exists");
        else if (e.message.search("You are not owner of project") != -1)
          alert("You are not owner of project");
        else if (e.message.search("not sufficient amount collected") != -1)
          alert("not sufficient amount collected");
      }
    } else {
      alert("Connect to wallet first");
    }
  }
  async function showDonars() {
    if (contract) {
      try {
        const x = await contract.showDonars(addP);
        alert(x);
      } catch (e) {
        if (e.message.search("Project does not exists") != -1)
          alert("Project does not exists");
        else if (e.message.search("You are not owner of project") != -1)
          alert("You are not owner of project");
      }
    } else {
      alert("Connect to Wallet First");
    }
  }
  async function getDonars() {
    if (contract) {
      try {
        const donar = await contract.donars(donarIndex);
        alert(donar);
      } catch (e) {
        alert("Invalid index");
      }
    } else {
      alert("connect wallet first!");
    }
  }
  async function getProjects() {
    if (contract) {
      try {
        const project = await contract.projects(projectIndex);
        alert(project);
      } catch (e) {
        alert("Invalid index");
      }
    } else {
      alert("Connect wallet first!");
    }
  }
  async function allow() {
    if (contract) {
      try {
        await contract.allow(allowP);
      } catch (e) {
        if (e.message.search("Project does not exists") != -1)
          alert("Project does not exists");
        else if (e.message.search("You are the owner of project") != -1)
          alert("You are the owner of project");
        else if (e.message.search("Donar doesnot exists") != -1)
          alert("Donar doesnot exists");
        else if (e.message.search("Amount not fullfilled") != -1)
          alert("Amount not fullfilled");
      }
    } else {
      alert("Connect to wallet first");
    }
  }
  const style1 = {
    paddingLeft: "800px",
    display: "inline-block",
  };
  const style2 = {
    paddingLeft: "5px",
    display: "inline-block",
  };
  const style3 = {
    marginLeft: "400px",
    marginRight: "100px",
  };
  const style4 = {
    marginLeft: "200px",
    marginRight: "100px",
  };
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/logo192.png"
              width="50"
              height="50"
              className="d-inline-block align-top"
            />{" "}
            <h1 style={style2}>CROWD FUNDING</h1>
            <h3 style={style1}>
              {account ? (
                <button>
                  {account.slice(0, 5) + "....." + account.slice(38, 42)}
                </button>
              ) : (
                <button onClick={connectWallet}>Connect wallet</button>
              )}
            </h3>
            <br></br>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br></br>
      <div class="bg-img">
      <Row sm={1} md={2} className="g-4">
        <Col sm lg="2" style={style3}>
          <Card>
            <Card.Body>
              <Card.Title>CREATE PROJECT</Card.Title>
              <br></br>
              <br></br>
              <Card.Text>
                <input
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name of Project"
                />
                <br></br>
                <br></br>
                <input
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount Needed"
                />
                <br></br>
                <br></br>
                <Button onClick={createProject}>Create</Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm lg="2" style={style4}>
          <Card>
            <Card.Body>
              <Card.Title>DONATE</Card.Title>
              <br></br>
              <Card.Text>
                <input
                  onChange={(e) => setProjectAddr(e.target.value)}
                  placeholder="Project Address"
                />
                <br></br>
                <br></br>
                <input
                  onChange={(e) => setMoney(e.target.value)}
                  placeholder="enter amount"
                />
                <br></br>
                <br></br>
                <Button onClick={donate}>Donate</Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm lg="2" style={style3}>
          <Card>
            <Card.Body>
              <Card.Title>GET FUNDING</Card.Title>

              <br></br>
              <br></br>
              <Card.Text>
                <input
                  onChange={(e) => setProjectAdd(e.target.value)}
                  placeholder="Project Address"
                />
                <br></br>
                <br></br>
                <Button onClick={requestMoney}>REQUEST</Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm lg="2" style={style4}>
          <Card>
            <Card.Body>
              <Card.Title>ALLOW</Card.Title>
              <br></br>
              <br></br>
              <Card.Text>
                <input
                  onChange={(e) => setAllowP(e.target.value)}
                  placeholder="Project address"
                />
                <br></br>
                <br></br>
                <Button onClick={allow}>Allow</Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm lg="2" style={style3}>
          <Card>
            <Card.Body>
              <Card.Title>GET PROJECTS</Card.Title>
              <br></br>
              <br></br>
              <Card.Text>
                <input
                  onChange={(e) => setProjectIndex(e.target.value)}
                  placeholder="Project index"
                />
                <br></br>
                <br></br>
                <Button onClick={getProjects}>Get</Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm lg="2" style={style4}>
          <Card>
            <Card.Body>
              <Card.Title>GET DONARS</Card.Title>
              <br></br>
              <br></br>
              <Card.Text>
                <input
                  onChange={(e) => setDonarIndex(e.target.value)}
                  placeholder="Donar index"
                />
                <br></br>
                <br></br>
                <Button onClick={getDonars}>Get</Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm lg="2" style={style3}>
          <Card>
            <Card.Body>
              <Card.Title>SHOW DONARS</Card.Title>
              <br></br>
              <br></br>
              <Card.Text>
                <input
                  onChange={(e) => setAddP(e.target.value)}
                  placeholder="Project Address"
                />
                <br></br>
                <br></br>
                <Button onClick={showDonars}>Show</Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm lg="2" style={style4}>
          <Card>
            <Card.Body>
              <Card.Title>WITHDRAW</Card.Title>
              <br></br>
              <br></br>
              <Card.Text>
                <Button onClick={withdraw}>Withdraw</Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br></br>
      <br></br>
      </div>
    </div>


  );
}

export default App;
