import { useRef } from "react";
import { useTheme } from '@mui/material/styles'
import Container from '@mui/material/Container';
import { CssBaseline, Typography } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Card } from "@mui/material";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import discordLogo from './discordLogo.png';
import twitterLogo from './twitterLogo.png';
import { Avatar, Stack } from "@mui/material";
import { sizeHeight } from "@mui/system";
import Button from '@mui/material/Button';
import { AptosAccount } from "aptos";
import boizBanner from './boizBanner.png';
import wtmLogo from './wtmLogo.png';
import Footer from './Footer';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ENGINE_METHOD_CIPHERS } from "constants";
import contract from './contracts/wtm.json';

// Import everything
const ethers = require("ethers")
// let window;
const contractAddress = "0x35E5aE1Dd0bF2A9Df7A66dda9Ae2303DF77D1Ca3";
const expectedChainId = 5;
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
        // const balance = ethers.utils.formatEther(await signer.getBalance());
        // if (balance < 5) {
        //   alert("Insufficient funds to mint!");
        //   return;
        // }
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.mint(currentAccount, { value: ethers.utils.parseEther("0.01") });
        console.log("Mining... please wait");
        setMintStatus("minting");

        await nftTxn.wait();
        setMintStatus("none");

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

  useEffect(() => {
    setWtmRemaining("???");
    checkWalletIsConnected();
  }, [])
  
  return (
    <div style={{height: "100vh", backgroundImage: boizBanner, backgroundColor: theme.palette.primary.light}} fontFamily={theme.typography.fontFamily} ref={ref} id={"mint"}>
    {/* <p>Your account: {this.state.account}</p> */}
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
        {/* <Typography color={theme.palette.primary.dark} sx={{pt: 5, pb: 1}} variant="h3" fontWeight="bold">MINT NFT</Typography> */}
        <Box sx={{display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: 200, minWidth: 300, borderRadius: 12, paddingTop: "1.5rem"}}>
          <img style={{maxWidth: "75%"}} src={wtmLogo}></img>
        </Box>
        {currentAccount ? mintNftButton() : connectWalletButton()}
        {/* <Button variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{color: 'primary.dark', backgroundColor: 'primary.light'}}onClick={mintWag}>
          MINT
        </Button> */}
        <div style={{marginTop: "1rem"}}></div>
        <Typography color={"white"} sx={{pt: 0, pb: 1}} variant="h6" fontWeight="bold">Cost: 0.01 ETH</Typography>
        <div></div>
        <Typography color={"white"} sx={{pt: 2, pb: 2}} variant="p" fontWeight="bold">Remaining: {wtmRemaining} / 1000</Typography>
        {/* <Typography color={"white"} sx={{pt: 2, pb: 2}} variant="p" fontWeight="bold">Status: SOLD OUT!</Typography> */}
      </Box>

      {/* <Typography color={theme.palette.primary.dark} sx={{pt: 5, pb: 1}} variant="h4" fontWeight="bold">Instructions:</Typography>
      <Typography color={theme.palette.primary.dark} sx={{pt: 0, pb: 1}} variant="h6" fontWeight="bold">1: Make sure you have the Martian Wallet Extension installed.</Typography>
      <Typography color={theme.palette.primary.dark} sx={{pt: 0, pb: 1}} variant="h6" fontWeight="bold">2: Press the "MINT" button to pay for the mint and create an offer. Wait a few seconds for the transaction.</Typography>
      <Typography color={theme.palette.primary.dark} sx={{pt: 0, pb: 1}} variant="h6" fontWeight="bold">3: Press "CLAIM MINT" to receive your minted token in a second transaction.</Typography>
      <Typography color={theme.palette.primary.dark} sx={{pt: 1, mb: 2}} variant="h7">Explanation: The first transaction pays for the mint and creates a new token offered to you. The second transaction claims the token since Aptos does NOT allow tokens to be sent to you unless you ask for them!</Typography> */}
    </div>
  );
}

async function mintWag(){
  // Create a transaction
  // try {
  //   const network = await window.martian.network();
  //   if (network != "Mainnet"){
  //     alert ("Please use mainnet!");
  //   }
  //   else
  //   {
  //     const response = await window.martian.connect();
  //     const sender = response.address;
  //     const payload = {
  //       function: "0x1::coin::transfer",
  //       type_arguments: ["0x1::aptos_coin::AptosCoin"],
  //       arguments: ["0xa6fd9de4c08b39838bd06729f193bf70f7cb7a61647ea0b564d25e278ad75f1e", 200000000]
  //     };
  //     const transaction = await window.martian.generateTransaction(sender, payload);
  //     const txnHash = await window.martian.signAndSubmitTransaction(transaction);
  //     // console.log("txnHash; " + JSON.stringify(txnHash));
  //     const requestOptions = {
  //       method: "POST",
  //       headers: { 'Content-Type': 'application/json' },
  //     }
  //     // const url = apiGateway + 'mint-payment?address=' + sender + '&txnHash=' + txnHash;
  //     // const url = 'http://localhost:3001/mint-payment?address=' + sender + '&txnHash=' + txnHash;
  //     // const url = 'http://localhost:3001/mint-payment?address=' + JSON.stringify(sender) + '&txnHash=' + JSON.stringify(txnHash);
  //     // console.log("url to fetch: " + url);
  //     // const fetchRes = await fetch(
  //     //   url, requestOptions
  //     // ).then(response => {
  //     //   // console.log(response.statusText);
  //     //   return response.text();
  //     // }).catch(e => JSON.stringify(e));
  //     // console.log("fetchRes: " + fetchRes);

  //   }
  // } catch (e) {
  //   console.log("Error minting: " + JSON.stringify(e));
  // } 
}

export default Mint;