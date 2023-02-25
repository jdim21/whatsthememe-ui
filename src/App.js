import * as React from 'react';
import './App.css';
import ResponsiveAppBar from './ResponsiveAppBar';
import { Box, Stack, Paper, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import theme from './AaaTheme';
import Vision from './Vision';
import About from './About';
import Faq from './Faq';
import Mint from './Mint';
import Home from './Home';
import Footer from './Footer';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === '#1A2027',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function App() {
  const ref = React.useRef(null);
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline/>
    <Router>
    <div className="App">
      {window.location.pathname === '/mint' ? null : <ResponsiveAppBar/>}
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>
        <Route exact path="/mint" element={<Mint/>}></Route>
      </Routes>
      {window.location.pathname === '/mint' ? null : <Footer/>}
    </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
