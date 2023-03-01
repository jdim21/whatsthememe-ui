import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import wtmLogoQuestion from './wtmLogoQuestion.png';
import Vision from './Vision';
import Change from './Change';
import History from './History';
import { useTheme } from '@mui/material/styles'
import contract from './contracts/wtm.json';
const ethers = require("ethers")

const Home = () => {
  const theme = useTheme();
  const ref = React.useRef(null);
  const [currURI, setCurrURI] = useState(null);
  const [currImgURI, setCurrImgURI] = useState(null);
  const [currMessage, setCurrMessage] = useState("");

  useEffect(() => {
    console.log("Runinng getCurrMeme()...");
    if (!currURI) {
      const esApiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
      const provider = new ethers.providers.EtherscanProvider(null, esApiKey);
      const contractAddress = "0xf54162F673D36D8013DC32A1b55fB498711d6046";
      const abi = contract;
      const nftContract = new ethers.Contract(contractAddress, abi, provider);
      nftContract.uri(0).then(newURI => {
        console.log("newURI: ", newURI);
        setCurrURI(newURI);
        fetch(newURI).then(uriResult => {
          console.log("uriResult: ", uriResult);
          if (uriResult.status == 200) {
            uriResult.json().then(parsed => {
              console.log("parsed: ", parsed);
              if (parsed.image) {
                setCurrImgURI(parsed.image);
              }
              if (parsed.attributes && parsed.attributes[0]) {
                setCurrMessage(parsed.attributes[0].value);
              }
            })
            // console.log("body: ", uriResult.body.json());
          }
        });
      });
    }
  }, [])

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={0}>
        <div style={{backgroundColor: theme.palette.primary.light, minHeight:"30rem"}}>
          <Typography color={theme.palette.primary.dark} sx={{pt: 2, pb: 1}} variant="h2" fontWeight="bold">
            What's The Meme?
          </Typography>
          <Box sx={{ 
            p: '1rem', 
            width: '100vw',
            maxWidth: "35%",
            margin: "auto",
            maxHeight: '100%',

          }}>
            <img ref={ref} id={"home"} className="imgFullWidth" src={currImgURI ? currImgURI : wtmLogoQuestion}>
            </img>
            <Typography color={theme.palette.primary.dark} sx={{pt: 2, pb: 1}} variant="h5" fontWeight="bold">
              Message: {currMessage}
            </Typography>
          </Box>
        </div>
        <Vision></Vision>
        <Change></Change>
        {/* <History></History> */}
      </Stack>
    </Box>
  );
};
  
export default Home;