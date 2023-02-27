import { ChangeEvent, useRef } from "react";
import { useTheme } from '@mui/material/styles'
import { FormHelperText, TextField, Typography } from "@mui/material";
import * as React from 'react';
import Box from '@mui/material/Box';
import Arweave from 'arweave';
import wtmLogo from './wtmLogo.png';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import contract from './contracts/wtm.json';
import wojak from './wojak2.png';
const ethers = require("ethers")
const expectedChainId = 1;
const abi = contract;
const contractAddress = "0xf54162F673D36D8013DC32A1b55fB498711d6046";

const Change = () => {
  const theme = useTheme();
  const ref = useRef(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currUploadStatus, setUploadStatus] = useState(null);
  const [numNft, setNumNft] = useState(0);
  const [currFileToUpload, setNewFileToUpload] = useState(null);
  const [currFileNameToUpload, setNewFileNameToUpload] = useState("<none>");

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
      setUploadStatus("none");
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const network = await provider.getNetwork();
      if (!network || !network.chainId || network.chainId != expectedChainId) {
        alert("Please connect to Ethereum!");
      }
      const nftContract = new ethers.Contract(contractAddress, abi, provider);
      const signer = provider.getSigner();
      console.log("signer: ", signer);
      const address = await signer.getAddress();
      console.log("address: ", address);
      const balanceOf = await nftContract.balanceOf(address.toString(), 0);
      const balance = parseInt(balanceOf);
      console.log("balance: ", balance);
      setNumNft(balance);
    } else {
      console.log("No authorized account found!");
    }
  }

  const connectWalletButton = () => {
    return (
      <Button variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{color: 'primary.dark', backgroundColor: 'primary.light'}}onClick={connectWalletHandler}>
        Connect Wallet
      </Button>
    )
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

  const uploadNewImageHandler = async () => { 
    try {
      const { ethereum } = window;

      if (ethereum) {
        setUploadStatus("uploading");
        const arKey = process.env.REACT_APP_ARWEAVE_SECRET_KEY;
        const arweave = Arweave.init({});
        const arjKey = JSON.parse(arKey);
        const address = await arweave.wallets.jwkToAddress(arjKey);
        console.log("arweave addy: ", address);
        // const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const { chainId } = await provider.getNetwork();
        // if (chainId != expectedChainId) {
        //   alert("Please connect to Ethereum!");
        //   return;
        // }
        // const signer = provider.getSigner();
        // const balance = ethers.utils.formatEther(await signer.getBalance());
        // if (balance < 0.01) {
        //   alert("Insufficient funds to mint!");
        //   return;
        // }
        // const nftContract = new ethers.Contract(contractAddress, abi, signer);

        // console.log("Initialize payment");
        // let nftTxn = await nftContract.mint(currentAccount, { value: ethers.utils.parseEther("0.01") });
        console.log("Uploading... please wait");
        let data = Buffer.from(wojak.toString('base64'), 'base64');

        let transaction = await arweave.createTransaction({ data: data }, arjKey);
        // transaction.addTag('Type', 'manifest');
        // transaction.addTag('Content-Type', 'application/x.arweave-manifest+json');
        transaction.addTag('Type', 'file');
        transaction.addTag('Content-Type', 'image/png');

        await arweave.transactions.sign(transaction, arjKey);
        const res = await arweave.transactions.post(transaction);

        // let uploader = await arweave.transactions.getUploader(transaction);

        // while (!uploader.isComplete) {
        //   await uploader.uploadChunk();
        //   console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
        // }
        console.log("txn: ", transaction);
        console.log("res: ", res);
        console.log("Done.");
        console.log("Link:");
        console.log("https://arweave.net/" + transaction.id.toString());

        // TODO: wait for arweave uplaod
        // await nftTxn.wait();
        setUploadStatus("none");

        // console.log("Mined. Txn hash: ", nftTxn.hash);
      }
    } catch (err) {
      console.log("Error minting NFT");
      console.log(err);
      alert(err);
      setUploadStatus("none");
    }
  }

  const handleFileUpload = async e => { 
    try {
      console.log("Hanlding file upload..");
      if (!currFileToUpload) {
        console.log("Aborting.");
        return;
      }
      const file = currFileToUpload;
      var reader = new FileReader();
      reader.onload = async function(e) {
        let arrayBuffer = new Uint8Array(reader.result);
        console.log(arrayBuffer);
        const arKey = process.env.REACT_APP_ARWEAVE_SECRET_KEY;
        const arweave = Arweave.init({});
        const arjKey = JSON.parse(arKey);
        const address = await arweave.wallets.jwkToAddress(arjKey);
        console.log("arweave addy: ", address);
        console.log("Uploading... please wait");

        let transaction = await arweave.createTransaction({ data: arrayBuffer }, arjKey);
        transaction.addTag('Type', 'file');
        transaction.addTag('Content-Type', 'image/png');

        await arweave.transactions.sign(transaction, arjKey);
        const res = await arweave.transactions.post(transaction);
        console.log("Image Link:");
        const imageLink = "https://arweave.net/" + transaction.id.toString();
        console.log(imageLink);

        const message = "AHHHHHHH!";

        const metaDataFlat = '{"token_id":"0","name":"WTM","description":"WhatsTheMeme","seller_fee_basis_points":250,"image":"' + imageLink + '","external_url":"","attributes":[{"display_type":null,"trait_type":"Message","value":"' + message + '"}],"properties":{"files":[{"uri":"' + imageLink + '","type":"image/png"}],"category":"image","creators":[{"address":"0x2d6070C8834BEAB74d6496DbC59B76c761137f33","share":100}]}}';

        let transaction2 = await arweave.createTransaction({ data: metaDataFlat }, arjKey);
        transaction2.addTag('Type', 'file');
        transaction2.addTag('Content-Type', 'application/json');

        await arweave.transactions.sign(transaction2, arjKey);
        const res2 = await arweave.transactions.post(transaction2);
        console.log("URI Link:");
        const uriLink = "https://arweave.net/" + transaction2.id.toString();
        console.log(uriLink);
      }
      console.log("file: ", file);
      reader.readAsArrayBuffer(currFileToUpload);
    } catch (err) {
      console.log("Error uploading: ", err);
    }
  }

  const handleNewFileSelected = e => {
    if (!e.target.files) {
      console.log("Aborting.");
      return;
    }
    setNewFileNameToUpload(e.target.files[0].name);
    setNewFileToUpload(e.target.files[0]);
  }

  const selectImageButtonAndField = () => {
    return (
      <div>
      <Button component="label" variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{color: 'primary.dark', backgroundColor: 'primary.light'}}>
        Select Image To Upload
        <input type="file" accept=".png, .jpg" hidden onChange={handleNewFileSelected} />
      </Button>
      <Typography style={{minHeight: "1.5rem"}}>{currFileNameToUpload}</Typography>
      </div>
    )
  }

  const uploadNewImageButton = () => {
    if (numNft > 0) {
      if (currUploadStatus != "uploading") {
        return (
          // <Button variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{color: 'primary.dark', backgroundColor: 'primary.light'}}onClick={uploadNewImageHandler}>
          <Button disabled={currFileNameToUpload == "<none>"}component="label" variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{color: 'primary.dark', backgroundColor: 'primary.light'}} onClick={handleFileUpload}>
            Upload New Image
          </Button>
        )
      }
      return (
        <Button variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{color: 'primary.dark', backgroundColor: 'primary.light'}}>
          <CircularProgress style={{marginRight: "1rem"}} />
          Uploading...
        </Button>
      )
    } else {
      return (
        <div>
          <Button disabled={true} variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{color: 'primary.dark', backgroundColor: 'primary.light'}}>
            Upload New Image
          </Button>
          <div/>
          <Typography variant="caption" color={"red"}>You must hold a WhatsTheMeme NFT.</Typography>
        </div>
      )
    }
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div style={{backgroundColor: theme.palette.primary.light}} fontFamily={theme.typography.fontFamily} ref={ref} id={"change"}>
      <Typography color={theme.palette.primary.dark} sx={{pt: 5, pb: 1}} variant="h3" fontWeight="bold">CHANGE THE NFT</Typography>
      <Box sx={{
        maxWidth: 400,
        minWidth: 300,
        width: '100vw',
        height: 330,
        backgroundColor: 'primary.main',
        margin: "0 auto", 
        marginTop: "2rem",
        marginBottom: "2rem",
        borderRadius: 8,
        boxShadow: 16,
      }}>
        {/* <Typography color={"white"} sx={{pt: 5, pb: 1}} variant="h4" fontWeight="bold">CHANGE THE NFT</Typography> */}
        <Box sx={{display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: 200, minWidth: 300, borderRadius: 12, paddingTop: "1.5rem"}}>
          {/* <img style={{maxWidth: "75%"}} src={wtmLogo}></img> */}
        </Box>
        {/* {currentAccount ? null : connectWalletButton()} */}
        {selectImageButtonAndField()}
        {currentAccount ? uploadNewImageButton() : connectWalletButton()}
        <div style={{marginTop: "1rem"}}></div>
        <Typography color={"white"} sx={{pt: 0, pb: 1}} variant="h6" fontWeight="bold">Cost: 0.0042069 ETH</Typography>
        <div></div>
        {/* <Typography color={"white"} sx={{pt: 2, pb: 2}} variant="p" fontWeight="bold">Remaining: {wtmRemaining} / 1000</Typography> */}
      </Box>
    </div>);
}

export default Change;