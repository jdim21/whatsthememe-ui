import React from 'react';
import { Box, Stack, Paper, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import wtmBanner from './wtmBanner.png';
import Vision from './Vision';
import Change from './Change';
import History from './History';
  
const Home = () => {
    const ref = React.useRef(null);
  return (
          <Box sx={{ width: '100%' }}>
            <Stack spacing={0}>
              <img ref={ref} id={"home"} className="imgFullWidth" src={wtmBanner}>
              </img>
              <Vision></Vision>
              <Change></Change>
              <History></History>
            </Stack>
          </Box>
  );
};
  
export default Home;