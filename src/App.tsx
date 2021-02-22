import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";

import Chat from "./Chat";

const GlobalStyle = createGlobalStyle`
  :root {
    --background-color: #1b1d21;
    --background-color-lighter: #2f3239;
    --secondary-background-color: #19171d;
    --border-color: #2b2a30;
    --font-color: #d1d2d3;
    --secondary-font-color: white;
  }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    color: var(--font-color);
  }
  
  #root {
    background-color: var(--background-color);
    height: 100vh;
  }
`;

const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 256px 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background-color: var(--secondary-background-color);
  border-right: 1px solid var(--border-color);

  @media (max-width: 768px) {
    display: none;
  }
`;

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Sidebar />
        <Chat />
      </Container>
    </>
  );
}
