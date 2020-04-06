import React, { useState } from "react";
import styled from "styled-components";
import JSONTree from "react-json-tree";
import { GraphqlCodeBlock } from "graphql-syntax-highlighter-react";

const SidebarS = styled.div`
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
  &.is-active {
    border-bottom: 2px solid #1974e8;
  }
  :not(.is-active):hover {
    background-color: #e6e6e6;
  }
`;

const CodeText = styled.div`
  font-size: 12px;
  font-family: monospace;
  line-height: 1.1;

  .graphql-syntax {
    pre {
      margin: 4px 0;
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
`;

function renderVariablesCount(variables) {
  if (!variables) {
    return "";
  }
  return `(${Object.keys(variables).length})`;
}

function getDefaultTab(item) {
  if (item.errorsCount > 0) {
    return "errors";
  }
  return "query";
}

export function Sidebar(props) {
  const { item, onClose } = props;
  const [activeTab, setActiveTab] = useState(getDefaultTab(item));

  // Try-hard copy of chrome devtool json explorer
  const theme = {
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

  return (
    <SidebarS>
      <SidebarHeader>
        <CloseButton onClick={onClose}>
          <div>×</div>
        </CloseButton>
        <Tab
          className={activeTab === "query" ? "is-active" : ""}
          onClick={() => setActiveTab("query")}
        >
          Query
        </Tab>
        <Tab
          className={activeTab === "variables" ? "is-active" : ""}
          onClick={() => setActiveTab("variables")}
        >
          Variables {renderVariablesCount(item.variables)}
        </Tab>
        <Tab
          className={activeTab === "data" ? "is-active" : ""}
          onClick={() => setActiveTab("data")}
        >
          Data
        </Tab>
        <Tab
          className={activeTab === "errors" ? "is-active" : ""}
          onClick={() => setActiveTab("errors")}
        >
          Errors {item.errorsCount > 0 ? `(${item.errorsCount})` : ""}
        </Tab>
      </SidebarHeader>
      <SidebarContent>
        {activeTab === "query" && (
          <CodeText style={{ paddingTop: "8px" }}>
            <GraphqlCodeBlock
              className="graphql-syntax"
              queryBody={item.query}
            />
          </CodeText>
        )}
        {activeTab === "variables" && (
          <CodeText>
            <JSONTree
              theme={theme}
              // hideRoot={true}
              invertTheme={false}
              shouldExpandNode={() => true}
              data={item.variables}
            />
          </CodeText>
        )}
        {activeTab === "data" && (
          <CodeText>
            <JSONTree
              theme={theme}
              hideRoot={true}
              invertTheme={false}
              shouldExpandNode={() => true}
              data={item.data}
            />
          </CodeText>
        )}
        {activeTab === "errors" && (
          <CodeText>
            <JSONTree
              theme={theme}
              hideRoot={true}
              invertTheme={false}
              shouldExpandNode={() => true}
              data={item.errors}
            />
          </CodeText>
        )}
      </SidebarContent>
    </SidebarS>
  );
}
