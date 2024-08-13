import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { GraphqlCodeBlock } from 'graphql-syntax-highlighter-react';

import darkTheme from './themes/dark';
import lightTheme from './themes/light';
import { ListItem } from './app';
import { JSONTree } from 'react-json-tree';

const SidebarStyled = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 2px solid ${(props) => props.theme.colors.sidebarBorderColor};
`;

const SidebarHeader = styled.div`
  width: 100%;
  height: 28px;
  border-bottom: 1px solid ${(props) => props.theme.colors.tableCellBorder};
  background-color: ${(props) => props.theme.colors.tableHeaderBackground};
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

const Tab = styled.div<{ active: boolean }>`
  height: 28px;
  line-height: 28px;
  padding: 0px 10px;
  box-sizing: border-box;
  cursor: pointer;
  color: ${(props) => props.theme.colors.tabColor};
  &:hover {
    background-color: ${(props) => props.theme.colors.tabHoverBackgroundColor};
  }
  ${(props) =>
    props.active &&
    css`
      border-bottom: 2px solid #1974e8;
      background-color: ${(props) => props.theme.colors.tabBackgroundColor};
      hover {
        background-color: transparent;
      }
    `}
`;

const CodeText = styled.div<{ topPadding?: boolean; bottomPadding?: boolean }>`
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
      color: ${(props) => props.theme.colors.jsonNumber};
    }
    .property {
      color: ${(props) => props.theme.colors.jsonProperty};
    }
    .keyword {
      color: ${(props) => props.theme.colors.jsonKeyword};
    }
  }

  ${(props) =>
    props.topPadding &&
    css`
      padding-top: 8px;
    `}
  ${(props) =>
    props.bottomPadding &&
    css`
      padding-bottom: 24px;
    `}
`;

const EmptyState = styled.div`
  color: #7c7c7c;
  margin-top: 6px;
`;

const EmptyCount = styled.span`
  color: #7c7c7c;
`;

function renderVariablesCount(variables?: any) {
  if (!variables) {
    return '';
  }
  const count = Object.keys(variables).length;
  if (count === 0) {
    return <EmptyCount>({count})</EmptyCount>;
  }
  return `(${count})`;
}

function renderErrorsCount(item: { errorsCount?: number }) {
  if (!item.errorsCount || item.errorsCount === 0) {
    return <EmptyCount>({item.errorsCount})</EmptyCount>;
  }
  return `(${item.errorsCount})`;
}

function getDefaultTab(item: { errorsCount?: number }) {
  if (item.errorsCount > 0) {
    return 'errors';
  }
  return 'query';
}

export function Sidebar(props: {
  item: ListItem;
  initialTab: string | null;
  onClose: () => void;
  isDarkMode: boolean;
}) {
  const { item, initialTab, onClose } = props;
  const [activeTab, setActiveTab] = useState(getDefaultTab(item));

  useEffect(() => {
    if (initialTab !== null) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const theme = props.isDarkMode ? darkTheme : lightTheme;

  // Try-hard copy of chrome devtool json explorer
  const JSONTreeTheme = {
    scheme: 'saturn',
    author: 'saturn',
    base00: theme.colors.background,
    base01: theme.colors.background,
    base02: theme.colors.jsonText,
    base03: theme.colors.jsonText,
    base04: theme.colors.jsonText,
    base05: theme.colors.jsonText,
    base06: theme.colors.jsonText,
    base07: theme.colors.jsonText,
    base08: theme.colors.jsonText,
    base09: theme.colors.jsonNumber,
    base0A: theme.colors.jsonText,
    base0B: theme.colors.jsonKeyword,
    base0C: '#878787',
    base0D: theme.colors.jsonProperty,
    base0E: theme.colors.jsonText,
    base0F: theme.colors.jsonText,
  };

  return (
    <SidebarStyled>
      <SidebarHeader>
        <CloseButton onClick={onClose}>
          <div>×</div>
        </CloseButton>
        <Tab
          active={activeTab === 'query'}
          onClick={() => setActiveTab('query')}
        >
          Query
        </Tab>
        <Tab
          active={activeTab === 'variables'}
          onClick={() => setActiveTab('variables')}
        >
          Variables {renderVariablesCount(item.variables)}
        </Tab>
        <Tab active={activeTab === 'data'} onClick={() => setActiveTab('data')}>
          Data
        </Tab>
        <Tab
          active={activeTab === 'errors'}
          onClick={() => setActiveTab('errors')}
        >
          Errors {renderErrorsCount(item)}
        </Tab>
      </SidebarHeader>
      <SidebarContent>
        {activeTab === 'query' && <QueryTab item={item} />}
        {activeTab === 'variables' && (
          <VariablesTab theme={JSONTreeTheme} item={item} />
        )}
        {activeTab === 'data' && <DataTab theme={JSONTreeTheme} item={item} />}
        {activeTab === 'errors' && (
          <ErrorsTab theme={JSONTreeTheme} item={item} />
        )}
      </SidebarContent>
    </SidebarStyled>
  );
}

function VariablesTab({
  item,
  theme,
}: {
  item: ListItem;
  theme: Record<string, any>;
}) {
  if (!item.variables || Object.keys(item.variables).length === 0) {
    return <EmptyState>No variables</EmptyState>;
  }
  return (
    <CodeText>
      <JSONTree
        theme={theme}
        hideRoot={false}
        invertTheme={false}
        shouldExpandNodeInitially={() => true}
        data={item.variables}
      />
    </CodeText>
  );
}

function QueryTab({ item }: { item: ListItem }) {
  if (item.query === undefined || item.query === null) {
    return <EmptyState>No query</EmptyState>;
  }
  return (
    <CodeText topPadding bottomPadding>
      <GraphqlCodeBlock className="graphql-syntax" queryBody={item.query} />
    </CodeText>
  );
}

function ErrorsTab({
  item,
  theme,
}: {
  item: ListItem;
  theme: Record<string, any>;
}) {
  if (item.errors === undefined || item.errors === null) {
    return <EmptyState>No errors</EmptyState>;
  }
  return (
    <CodeText>
      <JSONTree
        theme={theme}
        hideRoot={true}
        invertTheme={false}
        shouldExpandNodeInitially={() => true}
        data={item.errors}
      />
    </CodeText>
  );
}

function DataTab({
  item,
  theme,
}: {
  item: ListItem;
  theme: Record<string, any>;
}) {
  if (item.data === undefined || item.data === null || item.data === '') {
    return <EmptyState>No data</EmptyState>;
  }
  return (
    <CodeText>
      <JSONTree
        theme={theme}
        hideRoot={true}
        invertTheme={false}
        shouldExpandNodeInitially={() => true}
        data={item.data}
      />
    </CodeText>
  );
}
