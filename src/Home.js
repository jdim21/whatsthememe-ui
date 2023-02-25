import React from 'react';
import { Box, Stack, Paper, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import wtmBanner from './wtmBanner.png';
import Vision from './Vision';
import About from './About';
import Faq from './Faq';
  
const Home = () => {
    const ref = React.useRef(null);
  return (
          <Box sx={{ width: '100%' }}>
            <Stack spacing={0}>
              <img ref={ref} id={"home"} className="imgFullWidth" src={wtmBanner}>
              </img>
              <Vision></Vision>
              <About></About>
              <Faq></Faq>
            </Stack>
          </Box>
  );
};
  
export default Home;