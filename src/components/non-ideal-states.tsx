import React from 'react';
import styled from 'styled-components';

const NonIdealState = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 14px;
  color: #777777;
  p {
    margin: 8px 0;
    line-height: 1;
  }
`;

export function EmptyState() {
  return (
    <NonIdealState>
      <h1>🚀</h1>
      <p>Recording GraphQL requests...</p>
      <p>
        Perform a request or reload the page to record.
        <br />
        If your app is using websocket, page refresh is required while this tool
        is open.
      </p>
      <p>
        <a
          target="_blank"
          href="https://github.com/patresk/saturn/blob/master/src/saturn.js#L10"
        >
          How is GraphQL request detected?
        </a>
      </p>
    </NonIdealState>
  );
}

export function ErrorState() {
  return (
    <NonIdealState>
      <h1>⚠️</h1>
      <p>Unexpected problem occurred.</p>
      <p>
        <a target="_blank" href="https://github.com/patresk/saturn/issues">
          Create a GitHub issue
        </a>
      </p>
    </NonIdealState>
  );
}
