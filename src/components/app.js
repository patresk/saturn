import React, { useState, useMemo } from "react";
import styled, { css, ThemeProvider } from "styled-components";
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
} from "react-table";

import { Sidebar } from "./sidebar";
import { EmptyState, ErrorState } from "./non-ideal-states";
import { DataCell, ErrorCell, QueryCell, VariablesCell } from "./cells";
import darkTheme from "./themes/dark";
import lightTheme from "./themes/light";

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
  veritcal-align: middle;
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

const Row = styled.div`
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
  { Header: "Operation name", accessor: "operationName" },
  { Header: "Type", width: 70, accessor: "type" },
  { Header: "Query", accessor: "query", Cell: QueryCell },
  { Header: "Variables", accessor: "variablesString", Cell: VariablesCell },
  { Header: "Data", accessor: "dataStringShort", Cell: DataCell },
  { Header: "Errors", accessor: "errorMessages", Cell: ErrorCell },
  { Header: "HTTP Status", width: 90, accessor: "status" },
];

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
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

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function AppPure(props) {
  const { list = [] } = props;
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [initialTab, setInitialTab] = useState(null);
  const [filter, setFilter] = useState("");

  const defaultColumnWidth =
    (window.innerWidth - 70 - 90) / (columns.length - 2) -
    (activeRequestId ? 600 : 0);

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 50,
      width: defaultColumnWidth,
      maxWidth: Math.max(defaultColumnWidth, 400),
    }),
    []
  );

  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const filteredList = useMemo(() => {
    return filter.length > 0
      ? list.filter((item) =>
          (item.operationName || "").match(RegExp(escapeRegex(filter), "i"))
        )
      : list;
  }, [filter, list]);

  const {
    getTableProps,
    getTableHeaderProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: filteredList,
      defaultColumn,
    },
    useBlockLayout,
    useResizeColumns,
    useSortBy
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
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
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
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render("Header")}

                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <div className="arrow arrow-down"></div>
                          ) : (
                            <div className="arrow arrow-up"></div>
                          )
                        ) : (
                          ""
                        )}

                        <Resizer {...column.getResizerProps()} />
                      </Header>
                    ))}
                  </div>
                ))}
              </THead>
              <TBody style={{ width: tableWidth, overflowX: "hidden" }}>
                {rows.map((row) => {
                  prepareRow(row);
                  const hasError =
                    row.original.errorsCount > 0 ||
                    row.original.status === "Cancelled";
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
                              setActiveRequestId(row.original.id);
                              const map = {
                                Query: "query",
                                Variables: "variables",
                                Data: "data",
                                Errors: "errors",
                              };
                              if (map[cell.column.Header]) {
                                setInitialTab(map[cell.column.Header]);
                              }
                            }}
                          >
                            {cell.render("Cell")}
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

export function App(props) {
  return (
    <ErrorBoundary>
      <AppPure {...props} />
    </ErrorBoundary>
  );
}
