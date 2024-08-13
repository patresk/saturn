import React, { useState, useMemo, ReactNode } from 'react';
import styled, { css, ThemeProvider } from 'styled-components';
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
} from 'react-table';

import { Sidebar } from './sidebar';
import { EmptyState, ErrorState } from './non-ideal-states';
import {
  DataCell,
  ErrorCell,
  QueryCell,
  TimeCell,
  VariablesCell,
} from './cells';
import darkTheme from './themes/dark';
import lightTheme from './themes/light';

export interface ListItem {
  id: string;
  time?: Date;
  operationName: string;
  status: string;

  query: string;
  queryShort: string;

  type: 'query' | 'mutation' | 'subscription' | 'subscription data';
  variables?: any;
  variablesString?: string;

  data?: any;
  dataString?: string;
  dataStringShort?: string;

  errors: Array<any>;
  errorMessages: string[];
  errorsCount?: number;
}

interface AppProps {
  list: ListItem[];
  onClear: () => void;
}

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: calc(100vh - 25px);
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.color};
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${(props) => props.theme.colors.color};
  height: 22px;
  padding: 1px;
  background-color: ${(props) => props.theme.colors.toolbarBackgroundColor};
  border-bottom: 1px solid ${(props) => props.theme.colors.tableHeaderBorder};
`;

const FilterInput = styled.input`
  height: 20px;
  min-height: 10px !important;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.color};
  border-radius: 0;
  border: 1px solid white !important;
  &:hover {
    border: 1px solid ${(props) => props.theme.colors.tableHeaderBorder} !important;
  }
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.tableRowActive} !important;
  }
`;

const FilterButton = styled.div<{ isActive?: boolean }>`
  border-radius: 8px;
  font-size: 11px;
  background: ${(props) =>
    props.isActive
      ? props.theme.colors.tableRowActive
      : props.theme.colors.toolbarBackgroundColor};
  border: 1px solid
    ${(props) =>
      props.isActive
        ? props.theme.colors.tableRowActive
        : props.theme.colors.tableHeaderBorder};
  padding-top: 0px;
  padding-bottom: 0px;
  line-height: 12px;
  cursor: pointer;
  padding: 3px 6px;
  color: ${(props) => (props.isActive ? 'white' : undefined)};
`;

const ClearButton = styled.a`
  background: none;
  background-image: none;
  border: none;
  width: 16px;
  padding: 4px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.color};
  &:hover {
    color: ${(props) => props.theme.colors.color};
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
`;

const Table = styled.div`
  border-spacing: 0;
  border-collapse: collapse;
`;

const Resizer = styled.span`
  display: inline-block;
  width: 4px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  transform: translateX(50%);
  z-index: 1;
  touch-action: none;
  cursor: col-resize !important;
`;

const Header = styled.div`
  background-color: ${(props) => props.theme.colors.tableHeaderBackground};
  height: 28px;
  padding: 0 6px;
  font-size: 12px;
  font-weight: normal;
  text-align: left;
  margin: 0;
  border-right: 1px solid ${(props) => props.theme.colors.tableHeaderBorder};
  border-bottom: 1px solid ${(props) => props.theme.colors.tableHeaderBorder};
  border-top: 0;
  color: ${(props) => props.theme.colors.color};
  display: flex !important;
  align-items: center;
  vertical-align: middle;
  &:hover {
    background-color: ${(props) => props.theme.colors.tableHeaderHover};
    cursor: pointer;
  }
  .arrow {
    position: absolute;
    right: 6px;
    top: 11px;
  }
  .arrow-up {
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 7px solid ${(props) => props.theme.colors.color};
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 7px solid ${(props) => props.theme.colors.color};
  }
`;

const Row = styled.div<{ hasError: boolean; isActive: boolean }>`
  cursor: pointer;
  color: ${(props) => props.theme.colors.color};
  &:nth-child(2n) {
    background-color: ${(props) => props.theme.colors.tableRowStripe};
  }
  &:nth-child(n):last-child {
    border-bottom: 1px solid ${(props) => props.theme.colors.tableHeaderBorder};
  }
  &:hover {
    background-color: ${(props) => props.theme.colors.tableRowHover};
  }
  ${(props) =>
    props.hasError &&
    css`
      color: #d42d1f !important;
    `}
  ${(props) =>
    props.isActive &&
    css`
      background-color: ${(props) =>
        props.theme.colors.tableRowActive} !important;
      color: white !important;
      span {
        color: white !important;
      }
    `}
`;

const Cell = styled.div`
  padding: 0 6px;
  font-size: 12px;
  height: 38px;
  border-right: 1px solid ${(props) => props.theme.colors.tableCellBorder};
  position: relative;
  display: flex !important;
  align-items: center;
  overflow: hidden;
`;

const SidebarWrapper = styled.div`
  min-width: 50vw;
  max-width: 50vw;
  flex-grow: 1;
  flex-direction: column;
`;

const THead = styled.div`
  position: sticky;
  top: 0;
  z-index: 999;
`;

const TBody = styled.div`
  overflow-y: scroll;
  overflow-x: auto;
`;

const columns = [
  { Header: 'Operation name', accessor: 'operationName' },
  { Header: 'Received at', width: 130, accessor: 'time', Cell: TimeCell },
  { Header: 'Op. Type', width: 110, accessor: 'type' },
  { Header: 'Op. Definition', accessor: 'query', Cell: QueryCell },
  { Header: 'Variables', accessor: 'variablesString', Cell: VariablesCell },
  { Header: 'Data', accessor: 'dataStringShort', Cell: DataCell },
  { Header: 'Errors', accessor: 'errorMessages', Cell: ErrorCell },
  { Header: 'HTTP Status', width: 90, accessor: 'status' },
];

class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error) {
    console.error(error);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorState />;
    }

    return this.props.children;
  }
}

function escapeRegex(string: string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const filterToOperationTypeMap = {
  all: ['-'], // Not used
  query: ['query'],
  mutation: ['mutation'],
  subscription: ['subscription', 'subscription data'],
} as const;

function AppPure(props: AppProps) {
  const { list = [] } = props;
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [initialTab, setInitialTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<
    'all' | 'query' | 'mutation' | 'subscription'
  >('all');

  const defaultColumnWidth =
    (window.innerWidth - 70 - 90) / (columns.length - 2) -
    (activeRequestId ? 600 : 0);

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 50,
      width: defaultColumnWidth,
      maxWidth: Math.max(defaultColumnWidth, 400),
    }),
    [],
  );

  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const filteredList = useMemo(() => {
    return list
      .filter((item) => {
        // Search in GraphQL operation name and variables
        if (searchQuery.length > 0) {
          return ((item.operationName || '') + item.variablesString).match(
            RegExp(escapeRegex(searchQuery), 'i'),
          );
        }
        return true;
      })
      .filter((item) => {
        // Filter by operation type
        if (filter && filter.length > 0) {
          if (filter === 'all') {
            return true;
          }
          if (filterToOperationTypeMap[filter] && item.type) {
            // @ts-expect-error FIXME
            return filterToOperationTypeMap[filter].includes(item.type);
          }
        }

        return true;
      });
  }, [searchQuery, filter, list]);

  const { headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: filteredList,
      defaultColumn,
    },
    useBlockLayout,
    useResizeColumns,
    useSortBy,
  );

  const tableWidth = headerGroups[0].getHeaderGroupProps().style.width;

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Toolbar>
        <ClearButton
          title="Clear"
          onClick={() => {
            if (props.onClear) {
              props.onClear();
            }
          }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </ClearButton>
        <FilterInput
          placeholder="Filter"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FilterButton
          isActive={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          All
        </FilterButton>
        <FilterButton
          isActive={filter === 'query'}
          onClick={() => setFilter('query')}
        >
          Query
        </FilterButton>
        <FilterButton
          isActive={filter === 'mutation'}
          onClick={() => setFilter('mutation')}
        >
          Mutation
        </FilterButton>
        <FilterButton
          isActive={filter === 'subscription'}
          onClick={() => setFilter('subscription')}
        >
          Subscription
        </FilterButton>
      </Toolbar>
      <Container>
        {list.length === 0 && <EmptyState />}
        {list.length > 0 && (
          <TableWrapper>
            <Table style={{ width: tableWidth }}>
              <THead style={{ width: tableWidth }}>
                {headerGroups.map((headerGroup) => (
                  <div {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <Header
                        {...column.getHeaderProps(
                          // @ts-expect-error FIXME
                          column.getSortByToggleProps(),
                        )}
                      >
                        {column.render('Header')}

                        {/* @ts-expect-error FIXME */}
                        {column.isSorted ? (
                          // @ts-expect-error FIXME
                          column.isSortedDesc ? (
                            <div className="arrow arrow-down"></div>
                          ) : (
                            <div className="arrow arrow-up"></div>
                          )
                        ) : (
                          ''
                        )}

                        {/* @ts-expect-error FIXME */}
                        <Resizer {...column.getResizerProps()} />
                      </Header>
                    ))}
                  </div>
                ))}
              </THead>
              <TBody style={{ width: tableWidth, overflowX: 'hidden' }}>
                {rows.map((row) => {
                  prepareRow(row);
                  const hasError =
                    // @ts-expect-error FIXME
                    row.original.errorsCount > 0 ||
                    // @ts-expect-error FIXME
                    row.original.status === 'Cancelled';
                  // @ts-expect-error FIXME
                  const isActive = row.original.id === activeRequestId;
                  return (
                    <Row
                      {...row.getRowProps()}
                      isActive={isActive}
                      hasError={hasError}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <Cell
                            {...cell.getCellProps()}
                            onClick={() => {
                              // @ts-expect-error FIXME
                              setActiveRequestId(row.original.id);
                              const map = {
                                Query: 'query',
                                Variables: 'variables',
                                Data: 'data',
                                Errors: 'errors',
                              };
                              // @ts-expect-error FIXME
                              if (map[cell.column.Header]) {
                                // @ts-expect-error FIXME
                                setInitialTab(map[cell.column.Header]);
                              }
                            }}
                          >
                            {cell.render('Cell')}
                            {/* @ts-expect-error FIXME */}
                            <Resizer {...cell.column.getResizerProps()} />
                          </Cell>
                        );
                      })}
                    </Row>
                  );
                })}
              </TBody>
            </Table>
          </TableWrapper>
        )}
        {activeRequestId && list.find((i) => i.id === activeRequestId) && (
          <SidebarWrapper>
            <Sidebar
              isDarkMode={isDarkMode}
              initialTab={initialTab}
              item={list.find((i) => i.id === activeRequestId)}
              onClose={() => setActiveRequestId(null)}
            />
          </SidebarWrapper>
        )}
      </Container>
    </ThemeProvider>
  );
}

export function App(props: AppProps) {
  return (
    <ErrorBoundary>
      <AppPure {...props} />
    </ErrorBoundary>
  );
}
