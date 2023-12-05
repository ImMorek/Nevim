import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LevelPage from './Level';
import Home from './Home';
import { SessionProvider } from "next-auth/react"


export default function App({
  Component,
  pageProps: { session, ...pageProps},
}) {
  return (
  <SessionProvider session={session}>
    <Component {...pageProps} />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="Level/:levelNumber" element={<LevelPage />} />        
      </Routes>
    </BrowserRouter>
  </SessionProvider>
  );
}
