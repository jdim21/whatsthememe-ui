import { useRef } from "react";
import { useTheme } from '@mui/material/styles'
import { Typography } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import wtmLogo from './wtmLogo.png';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import contract from './contracts/wtm.json';

const ethers = require("ethers")
const contractAddress = "0xf54162F673D36D8013DC32A1b55fB498711d6046";
const expectedChainId = 1;
const abi = contract;

const Mint = () => {
  const theme = useTheme();
  const ref = useRef(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currMintStatus, setMintStatus] = useState(null);
  const [wtmRemaining, setWtmRemaining] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
    } else {
      console.log("Metamask is installed. Ready to go!");
    }

    const accounts = await ethereum.request({method: 'eth_accounts'});

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
      setMintStatus("none");
    } else {
      console.log("No authorized account found!");
    }
  }

  const connectWalletHandler = async () => { 
    const { ethereum } = window;

    if (!ethereum) {
      alert ("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      console.log("Found some accounts. Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  }

  const mintNftHandler = async () => { 
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const { chainId } = await provider.getNetwork();
        if (chainId != expectedChainId) {
          alert("Please connect to Ethereum!");
          return;
        }
        const signer = provider.getSigner();
        const balance = ethers.utils.formatEther(await signer.getBalance());
        if (balance < 0.01) {
          alert("Insufficient funds to mint!");
          return;
        }
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.mint(currentAccount, { value: ethers.utils.parseEther("0.01") });
        console.log("Mining... please wait");
        setMintStatus("minting");

        await nftTxn.wait();
        setMintStatus("none");
        fetchRemaining();

        console.log("Mined. Txn hash: ", nftTxn.hash);
      }
    } catch (err) {
      console.log("Error minting NFT");
      console.log(err);
      alert(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <Button variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{color: 'primary.dark', backgroundColor: 'primary.light'}}onClick={connectWalletHandler}>
        Connect Wallet
      </Button>
    )
  }

  const mintNftButton = () => {
    if (currMintStatus != "minting") {
      return (
        <Button variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{color: 'primary.dark', backgroundColor: 'primary.light'}}onClick={mintNftHandler}>
          Mint NFT
        </Button>
      )
    }
    return (
      <Button variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{color: 'primary.dark', backgroundColor: 'primary.light'}}onClick={mintNftHandler}>
        <CircularProgress />
        Minting...
      </Button>
    )
  }

  const fetchRemaining = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const nftContract = new ethers.Contract(contractAddress, abi, provider);
      let remaining = await nftContract.getRemaining();
      remaining = parseInt(remaining);
      console.log("remainingTxn: ", remaining);
      setWtmRemaining(remaining);
    } catch (e) {
      console.log("Error fetching remaining NFTs: " + JSON.stringify(e));
    } 
  }

  useEffect(() => {
    setWtmRemaining("???");
    fetchRemaining();
    checkWalletIsConnected();
  }, [])
  
  return (
    <div style={{height: "100vh", backgroundColor: theme.palette.primary.light}} fontFamily={theme.typography.fontFamily} ref={ref} id={"mint"}>
    <Footer></Footer>
      <Box sx={{
        maxWidth: 400,
        minWidth: 300,
        width: '100vw',
        height: 530,
        backgroundColor: 'primary.main',
        margin: "0 auto", 
        marginTop: "2rem",
        borderRadius: 8,
        boxShadow: 16,
      }}>
        <Typography color={"white"} sx={{pt: 5, pb: 1}} variant="h4" fontWeight="bold">MINT NFT</Typography>
        <Box sx={{display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: 200, minWidth: 300, borderRadius: 12, paddingTop: "1.5rem"}}>
          <img style={{maxWidth: "75%"}} src={wtmLogo}></img>
        </Box>
        {currentAccount ? mintNftButton() : connectWalletButton()}
        <div style={{marginTop: "1rem"}}></div>
        <Typography color={"white"} sx={{pt: 0, pb: 1}} variant="h6" fontWeight="bold">Cost: 0.01 ETH</Typography>
        <div></div>
        <Typography color={"white"} sx={{pt: 2, pb: 2}} variant="p" fontWeight="bold">Remaining: {wtmRemaining} / 1000</Typography>
      </Box>

    </div>
  );
}

export default Mint;