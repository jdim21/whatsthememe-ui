import { useRef } from "react";
import { useTheme } from '@mui/material/styles'
import Container from '@mui/material/Container';
import { CssBaseline, Typography } from "@mui/material";
import wtmLogo from './wtmLogo.png';
import openseaLogo from './openseaLogo.png';
import twitterLogo from './twitterLogo.png';

const Footer = () => {
  const theme = useTheme();
  const ref = useRef(null);
  return (
    <div style={{backgroundColor: theme.palette.primary.dark}} fontFamily={theme.typography.fontFamily} ref={ref} id={"footer"}>
    <Container fontFamily={theme.typography.fontFamily}>
    <CssBaseline />
      <a href="https://twitter.com/WhatsTheMemeNFT">
        <img style={{marginBottom:26, marginRight: 26}} width="36" height="32" src={twitterLogo}></img>
      </a>
      <a href="/"><img width="96" height="96" src={wtmLogo}></img></a>
      <a href="https://opensea.io/collection/whatsthememe">
        <img style={{marginBottom:26, marginLeft: 26}} width="32" height="34" src={openseaLogo}></img>
      </a>
      {/* <Typography color="white" sx={{pt: 5, pb: 1}} variant="body2" fontWeight="bold">Made with love</Typography> */}
    </Container>
    </div>);
}

export default Footer;