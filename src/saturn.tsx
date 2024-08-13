import React, { useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/app';

import '@/css/chrome-shared.css';
import '@/css/widgets.css';
import { HAR, NetworkEntry, WebSocketMessage } from './types/types';
import {
  isGraphqlWsRequest,
  isGraphRequest,
} from './request-handling/detection';
import { processRawNetworkEntries } from './request-handling/transformation';

function Saturn() {
  const [wsMessages, setWsMessages] = useState<Array<WebSocketMessage>>([]);
  const [httpRequests, setHttpRequests] = useState<
    Array<{ request: NetworkEntry; content: any }>
  >([]);
  // If the user clears the list, we have to store the timestamp, so we can filter our old websocket messages
  const [clearedAt, setClearedAt] = useState<number | null>(null);

  useEffect(function () {
    // Since chrome.devtools.network.onRequestFinished contains only finished requests, we have to poll for websocket messages of opened connections
    const interval = setInterval(() => {
      chrome.devtools.network.getHAR(function (har: HAR) {
        har.entries.forEach(function (entry) {
          if (isGraphqlWsRequest(entry)) {
            // Override the list, since we always have all of them in the HAR
            setWsMessages(entry._webSocketMessages);
          }
        });
      });
    }, 1000);

    chrome.devtools.network.onRequestFinished.addListener(
      // https://developer.chrome.com/extensions/devtools_network#type-Request
      function (request: NetworkEntry) {
        if (isGraphRequest(request)) {
          request.getContent(function (content) {
            const item = {
              request: request,
              content: JSON.parse(content),
            };
            setHttpRequests((items) => [...items, item]);
          });
        }
      },
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  const processedList = processRawNetworkEntries(
    wsMessages,
    httpRequests,
    clearedAt,
  );

  // Since the virtualization is not implemented, let's order and render the last 200 items
  const list = processedList
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(-200);

  return (
    <App
      list={list}
      onClear={() => {
        setClearedAt(Date.now());
      }}
    />
  );
}

ReactDOM.render(<Saturn />, document.getElementById('app'));
