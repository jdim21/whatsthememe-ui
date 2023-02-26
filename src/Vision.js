import { useRef } from "react";
import { useTheme } from '@mui/material/styles'
import Container from '@mui/material/Container';
import { Button, CssBaseline, Stack, Typography } from "@mui/material";
import openseaLogo from './openseaLogo.png'
import twitterLogo from './twitterLogo.png'
import discordLogo from './discordLogo.png'

const Vision = () => {
  const theme = useTheme();
  const ref = useRef(null);
  return (
    <Container fontFamily={theme.typography.fontFamily} ref={ref} id={"vision"}>
    <CssBaseline />
      <Typography color="white" sx={{pt: 5, pb: 1}} variant="h3" fontWeight="bold">VISION</Typography>
      <Typography color="white" sx={{pt: 1, pb: 5}} variant="h6" fontWeight="bold" >
        WhatsTheMeme aims to be a simple & fun idea: holders of the NFT can change the artwork
        and corresponding message property to whatever they want. In doing so, the NFT is updated
        for everyone to see!
      </Typography>
      <Typography color="white" sx={{pt: 1, pb: 5}} variant="h5" fontWeight="bold" >
        Contract: 0xf54162f673d36d8013dc32a1b55fb498711d6046
      </Typography>
      <div>
      <Button variant="contained" style={{ backgroundColor: theme.palette.primary.dark}} color="secondary" size="large" href="/mint" sx={{mb: 3}}>
        <Typography variant="h4" color="white" sx={{pl: 2, pr: 2}} fontWeight="bold">
          MINT IS LIVE!
        </Typography>
      </Button>
      </div>
      <div>
      <Button variant="contained" style={{backgroundColor: theme.palette.primary.dark}} color="secondary" href="https://opensea.io/collection/whatsthememe" sx={{mb: 2}}>
        <Typography color="white" sx={{pr: 2}} fontWeight="bold">
          View & Trade WhatsTheMeme!
        </Typography>
          <img style={{padding: 0}} width="28" height="24" src={openseaLogo}></img>
      </Button>
      </div>
      <div>
      <Button variant="contained" style={{backgroundColor: theme.palette.primary.dark}} color="secondary" href="https://twitter.com/WhatsTheMemeNFT" sx={{mb: 5}}>
        <Typography color="white" sx={{pr: 2}} fontWeight="bold">
          Follow WTM on Twitter!
        </Typography>
          <img style={{paddingTop: 3}} width="28" height="24" src={twitterLogo}></img>
      </Button>
      </div>
      {/* <Button variant="contained" style={{backgroundColor: theme.palette.primary.dark}} color="secondary" href="https://discord.gg/" sx={{mb: 5}}>
        <Typography color="white" sx={{pr: 2}} fontWeight="bold">
          Join our discord!
        </Typography>
        <img width="24" height="24" src={discordLogo}></img>
      </Button> */}
    </Container>);
}

export default Vision;