import { ChangeEvent, useRef } from "react";
import { useTheme } from '@mui/material/styles'
import { FormHelperText, TextField, Typography } from "@mui/material";
import * as React from 'react';
import Box from '@mui/material/Box';
import Arweave from 'arweave';
import wtmLogo from './wtmLogo.png';
import wtmLogoQuestion from './wtmLogoQuestion.png';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import contract from './contracts/wtm.json';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import HelpIcon from '@mui/icons-material/Help';
import Tooltip from '@mui/material/Tooltip';
import RefreshIcon from '@mui/icons-material/Refresh';
import wojak from './wojak2.png';
import { maxHeight, maxWidth, minHeight } from "@mui/system";
const ethers = require("ethers")
const abi = contract;
const expectedChainId = 1;
// const expectedChainId = 5;
const contractAddress = "0xf54162F673D36D8013DC32A1b55fB498711d6046";
// const contractAddress = "0x4fcce2ba0ade7525dc1fa96df7a2ac6127d70400";

const Change = props => {
  const theme = useTheme();
  const ref = useRef(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currUploadStatus, setUploadStatus] = useState(null);
  const [numNft, setNumNft] = useState(0);
  const [currFileToUpload, setNewFileToUpload] = useState(null);
  const [currFileNameToUpload, setNewFileNameToUpload] = useState("<none>");
  const [newURI, setNewURI] = useState("");
  const [contractInterface, setContractInterface] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedMessage, setUploadedMessage] = useState(null);
  const [isUploadingToArweave, setIsUploadingToArweave] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

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
      const signer = await provider.getSigner();
      const nftContract = new ethers.Contract(contractAddress, abi, signer);
      console.log("signer: ", signer);
      const address = await signer.getAddress();
      console.log("address: ", address);
      const balanceOf = await nftContract.balanceOf(address.toString(), 0);
      const balance = parseInt(balanceOf);
      console.log("balance: ", balance);
      setNumNft(balance);
      setContractInterface(nftContract);
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

  const handleFileUpload = async e => { 
    try {
      console.log("Hanlding file upload..");
      if (!currFileToUpload) {
        console.log("Aborting.");
        return;
      }
      setIsUploadingToArweave(true);
      const file = currFileToUpload;
      var reader = new FileReader();
      reader.onload = async function(e) {
        let arrayBuffer = new Uint8Array(reader.result);
        console.log(arrayBuffer);
        const arKey = process.env.REACT_APP_ARWEAVE_SECRET_KEY;
        const arweave = Arweave.init({
          host: 'arweave.net',
          port: 443,
          protocol: 'https'
        });
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

        const message = newMessage;

        const metaDataFlat = '{"token_id":"0","name":"WTM","description":"WhatsTheMeme","seller_fee_basis_points":250,"image":"' + imageLink + '","external_url":"","attributes":[{"display_type":null,"trait_type":"Message","value":"' + message + '"}],"properties":{"files":[{"uri":"' + imageLink + '","type":"image/png"}],"category":"image","creators":[{"address":"0x2d6070C8834BEAB74d6496DbC59B76c761137f33","share":100}]}}';

        let transaction2 = await arweave.createTransaction({ data: metaDataFlat }, arjKey);
        transaction2.addTag('Type', 'file');
        transaction2.addTag('Content-Type', 'application/json');

        await arweave.transactions.sign(transaction2, arjKey);
        const res2 = await arweave.transactions.post(transaction2);
        console.log("URI Link:");
        const uriLink = "https://arweave.net/" + transaction2.id.toString();
        console.log(uriLink);
        setNewURI(uriLink);
        fetchImageAndMessage(uriLink);
        setIsUploadingToArweave(false);
      }
      console.log("file: ", file);
      reader.readAsArrayBuffer(currFileToUpload);
    } catch (err) {
      console.log("Error uploading: ", err);
      setIsUploadingToArweave(false);
    }
  }

  const fetchImageAndMessage = async(uploadedURI) => {
    fetch(uploadedURI).then(uriResult => {
    // console.log("uriResult: ", uriResult);
      if (uriResult.status == 200) {
        try {
          uriResult.json().then(parsed => {
          // console.log("parsed: ", parsed);
            if (parsed.image) {
              setUploadedImage(parsed.image + "?" + performance.now());
            }
            if (parsed.attributes && parsed.attributes[0]) {
              setUploadedMessage(parsed.attributes[0].value);
            }
          })

        } catch (e) {
          console.log("Failed to parse result for " + uploadedURI + ": ", e);
          setUploadedImage(null);
          setUploadedMessage(null);
        }
      }
    }).catch(e => {
      console.log("Attempted to fetch image and message failed for " + uploadedURI + ": ", e);
      setUploadedImage(null);
      setUploadedMessage(null);
    });
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
      <Grid sx={{mt: 1.5}} container spacing={0}>
        <Grid item xs={6}>
          {/* <Item>xs=8</Item> */}
          <div>
            <Button component="label" variant="contained" sx={{ ml: 1, color: 'primary.dark', backgroundColor: 'primary.light' }}>
              Select Image
              <input type="file" accept=".png, .jpg" hidden onChange={handleNewFileSelected} />
            </Button>
            <Typography style={{ minHeight: "1.5rem" }}>{currFileNameToUpload}</Typography>
          </div>
        </Grid>
        <Grid item xs={6}>
          {/* <Item>xs=4</Item> */}
          <TextField
            required
            id="outlined"
            label="Message"
            size="small"
            variant="filled"
            sx={{ mr: 4, backgroundColor: 'primary.light' }}
            onChange={e => setNewMessage(e.target.value)}
          />
        </Grid>
      </Grid>
    )
  }

  const uploadNewImageButton = () => {
    if (numNft > 0) {
      // if (currUploadStatus != "uploading") {
      if (!isUploadingToArweave) {
        return (
          <div style={{marginTop: "1rem"}}>
          <Button disabled={currFileNameToUpload == "<none>"}component="label" variant="contained" style={{marginRight: "1rem"}} sx={{color: 'primary.dark', backgroundColor: 'primary.light'}} onClick={handleFileUpload}>
            Upload New Image & Message
          </Button>
          </div>
        )
      }
      return (
        <div>
          {/* <CircularProgress style={{marginTop: "1rem", marginRight: "1rem", color: theme.palette.primary.light}} /> */}
          <Button variant="contained" style={{marginTop: "1rem", marginRight: "1rem"}} sx={{color: 'primary.dark', backgroundColor: 'primary.light'}}>
            <CircularProgress style={{marginRight: "1rem"}} />
            Uploading...
          </Button>
        </div>
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

  const newURITextField = (isDisabled) => {
      return (
        <div>
          <TextField
            required
            disabled={isDisabled}
            id="newURIField"
            label="New URI"
            size="small"
            value={newURI}
            onChange={e => {
              setNewURI(e.target.value);
              fetchImageAndMessage(e.target.value);
            }}
            variant="filled"
            sx={{ mt: 1.5, backgroundColor: 'primary.light' }}
          />
        </div>
      );
  }

  const changeTheNft = async () => {
    if (!contractInterface) {
      console.log("Failed to interface with the smart contract. Aborting.");
      return;
    }
    console.log("changing the nft to new uri: ", newURI);
    try {
      setIsChanging(true);
      let result = await contractInterface.setURI(newURI, { value: ethers.utils.parseEther("0.0042069") });
      await result.wait();
      const isTestnet = expectedChainId != 1 ? "testnets-" : "";
      const openseaRefreshUrl = "https://" + isTestnet + "api.opensea.io/api/v1/asset/" + contractAddress + "/0/?force_update=true"
      fetch(openseaRefreshUrl);
      setIsChanging(false);
    } catch (e) {
      console.log(e);
      setIsChanging(false);
      alert("Error changing NFT! Check the console logs for more details.");
    }
  }

  const setTheMemeButton = (isDisabled) => {
    if (isChanging) {
      <Button disabled={isDisabled} variant="contained" style={{marginTop: "1.5rem"}} sx={{color: 'primary.dark', backgroundColor: 'primary.light'}} onClick={changeTheNft}>
        <CircularProgress style={{marginRight: "1rem"}} />
        CHANGE THE NFT
      </Button>
    }
    return (
      <Button disabled={isDisabled} variant="contained" style={{marginTop: "1.5rem"}} sx={{color: 'primary.dark', backgroundColor: 'primary.light'}} onClick={changeTheNft}>
        CHANGE THE NFT
      </Button>
    );
  }

  const changeTheNftBox = () => {
    if (newURI) {
      return (
        <Box sx={{
          maxWidth: 400,
          minWidth: 300,
          width: '100vw',
          height: 520,
          backgroundColor: 'primary.main',
          margin: "0 auto", 
          marginTop: "2rem",
          marginBottom: "3rem",
          borderRadius: 8,
          boxShadow: 16,
        }}>
          <Box sx={{display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: 200, minWidth: 300, borderRadius: 12, paddingTop: "1.5rem"}}>
          </Box>
          {selectImageButtonAndField()}
          {currentAccount ? uploadNewImageButton() : connectWalletButton()}
          <Divider sx={{p: 1.5}} variant="middle"></Divider>
          <Typography style={{position: "relative"}} color={"white"} sx={{pt: 1, pb: 1}} variant="h6" >
            Preview
            <IconButton size="small" sx={{ml: 1}} style={{color:"white"}} onClick={() => fetchImageAndMessage(newURI)} aria-label="refresh button" component="label">
              <RefreshIcon />
            </IconButton>
            <Tooltip title="For large images, please allow up to 1 minute for the upload. Press the refresh button to check if the upload has completed. On occasion, the upload can fail and needs to be reuploaded above. Once the preview shows as expected, continue below.">
              <HelpIcon style={{color:"white", position:"absolute", top:"5px", right:"5px"}}/>
            </Tooltip>
          </Typography>
          <Grid sx={{ mt: 1.5 }} container spacing={0}>
            <Grid item xs={6}>
              <img style={{maxHeight:"8rem", maxWidth:"8rem"}} src={uploadedImage ? uploadedImage : wtmLogoQuestion}>
              </img>
            </Grid>
            <Grid item xs={6}>
              <Typography color={"white"} sx={{ pt: 1, pb: 1 }} variant="h7" >{uploadedMessage ? uploadedMessage : "<Your message here>"}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{p: 1.5}} variant="middle"></Divider>
          {/* {numNft ? newURITextField() : newURITextField(true)} */}
          {numNft ? setTheMemeButton() : setTheMemeButton(true)}
          <div style={{marginTop: "1rem"}}></div>
          <Typography color={"white"} sx={{pt: 0, pb: 1}} variant="h6" fontWeight="bold">Cost: 0.0042069 ETH</Typography>
          <div></div>
        </Box>
      );
    }
    return (
      <Box sx={{
        maxWidth: 400,
        minWidth: 300,
        width: '100vw',
        height: 180,
        backgroundColor: 'primary.main',
        margin: "0 auto", 
        marginTop: "2rem",
        marginBottom: "3rem",
        borderRadius: 8,
        boxShadow: 16,
      }}>
        <Box sx={{display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: 200, minWidth: 300, borderRadius: 12, paddingTop: "1.5rem"}}>
        </Box>
        {selectImageButtonAndField()}
        {currentAccount ? uploadNewImageButton() : connectWalletButton()}
        {/* <Divider sx={{p: 1.5}} variant="middle"></Divider>
        <Typography color={"white"} sx={{pt: 1, pb: 1}} variant="h6" >Preview</Typography>
        <Grid sx={{ mt: 1.5 }} container spacing={0}>
          <Grid item xs={6}>
            <img style={{maxHeight:"8rem", maxWidth:"8rem"}} src={uploadedImage ? uploadedImage : wtmLogoQuestion}>
            </img>
          </Grid>
          <Grid item xs={6}>
            <Typography color={"white"} sx={{ pt: 1, pb: 1 }} variant="h7" >{uploadedMessage ? uploadedMessage : "<Your message here>"}</Typography>
          </Grid>
        </Grid> */}
        {/* <Divider sx={{p: 1.5}} variant="middle"></Divider> */}
        {/* {numNft ? newURITextField() : newURITextField(true)} */}
        {/* {numNft ? setTheMemeButton() : setTheMemeButton(true)} */}
        {/* <div style={{marginTop: "1rem"}}></div> */}
        {/* <Typography color={"white"} sx={{pt: 0, pb: 1}} variant="h6" fontWeight="bold">Cost: 0.0042069 ETH</Typography> */}
        <div></div>
      </Box>
    );
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div style={{backgroundColor: theme.palette.primary.light}} fontFamily={theme.typography.fontFamily} ref={ref} id={"change"}>
      <Typography color={theme.palette.primary.dark} sx={{pt: 5, pb: 1}} variant="h3" fontWeight="bold">CHANGE THE NFT</Typography>
      {changeTheNftBox()}
    </div>);
}

export default Change;