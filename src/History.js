import { useRef } from "react";
import { useTheme } from '@mui/material/styles'
import Container from '@mui/material/Container';
import { CssBaseline, Typography } from "@mui/material";
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const History = () => {
  const theme = useTheme();
  const ref = useRef(null);
  return (
    <Container sx={{pb: 5}} fontFamily={theme.typography.fontFamily} ref={ref} id={"history"}>
    <CssBaseline />
      <Typography color="white" sx={{pt: 5, pb: 1}} variant="h3" fontWeight="bold">HISTORY</Typography>
      <Typography color="white" sx={{pt: 5, pb: 1}} variant="h5" fontWeight="bold">Coming soon...</Typography>
      <div>
        {/* <Accordion style={{backgroundColor: theme.palette.primary.dark}}>
          <AccordionSummary 
            backgroundColor={theme.palette.primary.light}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="white" fontWeight="0">Which wallet should I use?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="white" fontWeight="bold">
              TBD
            </Typography>
          </AccordionDetails>
        </Accordion> */}
      </div>
    </Container>);
}

export default History;