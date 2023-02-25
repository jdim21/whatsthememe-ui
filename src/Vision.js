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
        Blobby Boiz aim to support the genesis of the CANTO network as we believe
        it is a fast, innovative, & secure layer 1 blockchain helping to push the boundaries. NFTs are a crucial part of a growing ecosystem,
        and a cute PFP collection is a crucial part to having fun!
        The Blobby Boiz team are NFT lovers and crypto enthusiasts looking to foster a like-minded community
        to explore and support the CANTO ecosystem.
      </Typography>
      <div>
      <Button variant="contained" style={{backgroundColor: theme.palette.primary.dark}} color="secondary" href="https://alto.build/collections/blobbyboiz" sx={{mb: 2}}>
        <Typography color="white" sx={{pr: 2}} fontWeight="bold">
          View and Trade the BOIZ!
        </Typography>
          <img style={{padding: 0}} width="28" height="24" src={openseaLogo}></img>
      </Button>
      </div>
      <div>
      <Button variant="contained" style={{backgroundColor: theme.palette.primary.dark}} color="secondary" href="https://twitter.com/blobbyboiz" sx={{mb: 2}}>
        <Typography color="white" sx={{pr: 2}} fontWeight="bold">
          Follow us on Twitter!
        </Typography>
          <img style={{paddingTop: 3}} width="28" height="24" src={twitterLogo}></img>
      </Button>
      </div>
      <Button variant="contained" style={{backgroundColor: theme.palette.primary.dark}} color="secondary" href="https://discord.gg/TsYNpDqJgG" sx={{mb: 5}}>
        <Typography color="white" sx={{pr: 2}} fontWeight="bold">
          Join our discord!
        </Typography>
        <img width="24" height="24" src={discordLogo}></img>
      </Button>
    </Container>);
}

export default Vision;