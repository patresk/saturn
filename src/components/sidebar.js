import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import JSONTree from "react-json-tree";
import { GraphqlCodeBlock } from "graphql-syntax-highlighter-react";
import { LightGray } from "./cells";

const SidebarStyled = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 2px solid #cccccc;
`;

const SidebarHeader = styled.div`
  width: 100%;
  height: 28px;
  border-bottom: 1px solid #cccccc;
  background-color: #f3f3f3;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  padding: 0 8px 1px 8px;
`;

const SidebarContent = styled.div`
  height: calc(100vh - 28px);
  overflow-y: auto;
  padding: 0px 12px;
`;

const CloseButton = styled.div`
  height: 16px;
  width: 16px;
  box-sizing: border-box;
  border-radius: 50%;
  display: flex;
  align-items: center;
  text-align: center;
  padding: 3px 3px;
  position: relative;
  > div {
    line-height: 1;
    position: absolute;
    font-size: 16px;
    display: block;
    top: -1px;
    left: 2px;
  }
  &:hover {
    background-color: #db9793;
    color: white;
  }
`;

const Tab = styled.div`
  height: 28px;
  line-height: 28px;
  padding: 0px 10px;
  box-sizing: border-box;
  cursor: pointer;
  color: #323941;
  &:hover {
    background-color: #e6e6e6;
  }
  ${(props) =>
    props.active &&
    css`
      border-bottom: 2px solid #1974e8;
      hover {
        background-color: transparent;
      }
    `}
`;

const CodeText = styled.div`
  font-size: 11px;
  font-family: Menlo, monospace;
  line-height: 1.2;

  .graphql-syntax {
    pre {
      margin: 3px 0;
      font-size: 11px;
      font-family: Menlo, monospace;
      line-height: 1.2;
    }
    .number {
      color: #0800cb;
    }
    .property {
      color: #81028a;
    }
    .keyword {
      color: #bd433a;
    }
  }
  ${(props) =>
    props.topPadding &&
    css`
      padding-top: 8px;
    `}
`;

function renderVariablesCount(variables) {
  if (!variables) {
    return "";
  }
  const count = Object.keys(variables).length;
  if (count === 0) {
    return <EmptyCount>({count})</EmptyCount>;
  }
  return `(${count})`;
}

function renderErrorsCount(item) {
  if (item.errorsCount === 0) {
    return <EmptyCount>({item.errorsCount})</EmptyCount>;
  }
  return `(${item.errorsCount})`;
}

function getDefaultTab(item) {
  if (item.errorsCount > 0) {
    return "errors";
  }
  return "query";
}

// Try-hard copy of chrome devtool json explorer
const JSONTreeTheme = {
  scheme: "saturn",
  author: "saturn",
  base00: "#ffffff",
  base01: "#ffffff",
  base02: "#2e2e2e",
  base03: "#2e2e2e",
  base04: "#2e2e2e",
  base05: "#2e2e2e",
  base06: "#2e2e2e",
  base07: "#2e2e2e",
  base08: "#2e2e2e",
  base09: "#0800cb",
  base0A: "#2e2e2e",
  base0B: "#bd433a",
  base0C: "#878787",
  base0D: "#81028a",
  base0E: "#2e2e2e",
  base0F: "#2e2e2e",
};

export function Sidebar(props) {
  const { item, initialTab, onClose } = props;
  const [activeTab, setActiveTab] = useState(getDefaultTab(item));

  useEffect(() => {
    if (initialTab !== null) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <SidebarStyled>
      <SidebarHeader>
        <CloseButton onClick={onClose}>
          <div>×</div>
        </CloseButton>
        <Tab
          active={activeTab === "query"}
          onClick={() => setActiveTab("query")}
        >
          Query
        </Tab>
        <Tab
          active={activeTab === "variables"}
          onClick={() => setActiveTab("variables")}
        >
          Variables {renderVariablesCount(item.variables)}
        </Tab>
        <Tab active={activeTab === "data"} onClick={() => setActiveTab("data")}>
          Data
        </Tab>
        <Tab
          active={activeTab === "errors"}
          onClick={() => setActiveTab("errors")}
        >
          Errors {renderErrorsCount(item)}
        </Tab>
      </SidebarHeader>
      <SidebarContent>
        {activeTab === "query" && <QueryTab item={item} />}
        {activeTab === "variables" && <VariablesTab item={item} />}
        {activeTab === "data" && <DataTab item={item} />}
        {activeTab === "errors" && <ErrorsTab item={item} />}
      </SidebarContent>
    </SidebarStyled>
  );
}

const EmptyState = styled.div`
  color: #7c7c7c;
  margin-top: 6px;
`;

const EmptyCount = styled.span`
  color: #7c7c7c;
`;

function VariablesTab({ item }) {
  if (!item.variables || Object.keys(item.variables).length === 0) {
    return <EmptyState>No variables</EmptyState>;
  }
  return (
    <CodeText>
      <JSONTree
        theme={JSONTreeTheme}
        hideRoot={false}
        invertTheme={false}
        shouldExpandNode={() => true}
        data={item.variables}
      />
    </CodeText>
  );
}

function QueryTab({ item }) {
  if (item.query === undefined || item.query === null) {
    return <EmptyState>No query</EmptyState>;
  }
  return (
    <CodeText topPadding>
      <GraphqlCodeBlock className="graphql-syntax" queryBody={item.query} />
    </CodeText>
  );
}

function ErrorsTab({ item }) {
  if (item.errors === undefined || item.errors === null) {
    return <EmptyState>No errors</EmptyState>;
  }
  return (
    <CodeText>
      <JSONTree
        theme={JSONTreeTheme}
        hideRoot={true}
        invertTheme={false}
        shouldExpandNode={() => true}
        data={item.errors}
      />
    </CodeText>
  );
}

function DataTab({ item }) {
  if (item.data === undefined || item.data === null || item.data === "") {
    return <EmptyState>No data</EmptyState>;
  }
  return (
    <CodeText>
      <JSONTree
        theme={JSONTreeTheme}
        hideRoot={true}
        invertTheme={false}
        shouldExpandNode={() => true}
        data={item.data}
      />
    </CodeText>
  );
}
