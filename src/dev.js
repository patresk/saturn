import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import "@/css/chrome-shared.css";
import "@/css/widgets.css";

import { App } from "./components/app";
import { requests } from "./fixtures/requests";

// Devtools are zoomed out a little bit.
const ZoomOut = styled.div`
  zoom: 0.9;
`;

function Dev() {
  const [list, setList] = useState(requests);
  return (
    <ZoomOut>
      <App list={list} onClear={() => setList([])} />
    </ZoomOut>
  );
}

ReactDOM.render(<Dev />, document.getElementById("app"));
