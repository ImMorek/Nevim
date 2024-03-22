import { SessionProvider } from "next-auth/react"
import Home from "./Home"
import LevelPage from "./Level"
import IndexPage from ".";
import '../styles/App.css';
import '../styles/Level.css';
import '../styles/index.css';
import '../styles/Level.css';
import '../styles/InfoWindow.css';
import '../styles/Home.css';
import * as React from 'react';
import { Component } from "react";

const MyApp = (props) => {
  const { Component, pageProps } = props;


  return (
<SessionProvider>
  <Component {...pageProps} />
</SessionProvider>
  );
};

export default MyApp;