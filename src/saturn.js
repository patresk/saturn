import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import { App } from "./components/app";

import "@/css/chrome-shared.css";
import "@/css/widgets.css";

// Return false if the request does not seem like a graphql request,
// otherwise return parsed REQUEST body
function isGraphRequest(request) {
  const req = request.request;
  if (!req) {
    return false;
  }
  if (req.method !== "POST") {
    return false;
  }
  if (
    !request.request.headers.find(
      (h) => h.name.toLowerCase() === "content-type"
    )
  ) {
    return false;
  }
  try {
    const parsed = JSON.parse(request.request.postData.text);
    if (!parsed.hasOwnProperty("query")) {
      return false;
    }
    return parsed;
  } catch (err) {
    console.error("The body is not a valid JSON", err);
    return false;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return { list: state.list.concat(action.payload) };
    default:
      throw new Error();
  }
}

function Saturn() {
  const [state, dispatch] = useReducer(reducer, { list: [] });

  useEffect(function () {
    chrome.devtools.network.onRequestFinished.addListener(
      // https://developer.chrome.com/extensions/devtools_network#type-Request
      function (request) {
        console.log("Request detected", request);
        const graphQl = isGraphRequest(request);
        if (graphQl === false) {
          return;
        }
        request.getContent(function (content) {
          // console.log('response', JSON.parse(content))
          const item = {
            id: request.startedDateTime + Date.now(),
            raw: request,
            request: graphQl,
            response: JSON.parse(content),
          };
          console.log("GraphQL request detected", item);
          dispatch({ type: "add", payload: item });
        });
      }
    );
  }, []);

  const transformed = state.list.map((item) => {
    return {
      id: item.id,
      operationName: item.request.operationName || "Untitled operation",
      status:
        item.raw.response.status === 0 ? "Cancelled" : item.raw.response.status,
      query: item.request.query ? item.request.query : "",
      queryShort: item.request.query ? item.request.query.substring(0, 26) : "",
      type: item.request.query.substring(0, 26).trim().startsWith("mutation")
        ? "mutation"
        : "query",
      variables: item.request.variables ? item.request.variables : null,
      variablesString: item.request.variables
        ? JSON.stringify(item.request.variables)
        : "",
      errorsCount:
        item.response && item.response.errors ? item.response.errors.length : 0,
      errors:
        item.response && item.response.errors ? item.response.errors : null,
      errorMessages:
        item.response && item.response.errors
          ? item.response.errors.map((err) => err.message)
          : [],
      data: item.response && item.response.data ? item.response.data : null,
      dataString:
        item.response && item.response.data
          ? JSON.stringify(item.response.data)
          : "",
    };
  });

  console.log("raw", state.list);
  console.log("transformed", transformed);

  return <App list={transformed} />;
}

ReactDOM.render(<Saturn />, document.getElementById("app"));
