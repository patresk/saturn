import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import { List } from "@/components/list";

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

function Panel() {
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
      id: item.raw.startedDateTime + Date.now(),
      operationName: item.request.operationName || "Untitled operation",
      status: item.raw.response.status,
      queryShort: item.request.query ? item.request.query.substring(0, 26) : "",
      query: item.request.query ? item.request.query : "",
      errors: item.response.errors ? item.response.errors.length : 0,
      errorMessages: item.response.errors
        ? item.response.errors.map((err) => err.message)
        : [],
    };
  });

  console.log("raw", state.list);
  console.log("transformed", transformed);

  return <List list={transformed} />;
}

ReactDOM.render(<Panel />, document.getElementById("app"));
