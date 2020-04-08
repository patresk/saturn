import React, { useState } from "react";
import styled from "styled-components";
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
} from "react-table";
import { Sidebar } from "./sidebar";
import { EmptyState, ErrorState } from "./non-ideal-states";
import { DataCell, ErrorCell, QueryCell, VariablesCell } from "./cells";

const TableWrapper = styled.div`
  width: 100%;
  flex-grow: 1;
  overflow-x: auto;
`;

const Table = styled.div`
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;
  overflow-x: hidden;
  .resizer {
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
  }
`;

const Header = styled.div`
  background-color: #f3f3f3;
  height: 28px;
  padding: 0 6px;
  font-size: 12px;
  font-weight: normal;
  text-align: left;
  margin: 0;
  border-right: 1px solid #cdcdcd;
  border-bottom: 1px solid #cdcdcd;
  border-top: 0;
  color: #323941;
  display: flex !important;
  align-items: center;
  veritcal-align: middle;
  &:hover {
    background-color: #e6e6e6;
    cursor: pointer;
  }
  &.collapse {
    width: 0.0000000001%;
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
    border-bottom: 7px solid #6e6e6e;
  }
  .arrow-down {
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 7px solid #6e6e6e;
  }
`;

const Row = styled.div`
  cursor: pointer;
  color: #323941;
  &:nth-child(2n) {
    background-color: #f5f5f5;
  }
  &:nth-child(n):last-child {
    border-bottom: 1px solid #f5f5f5;
  }
  &:hover {
    background-color: #f2f6fc;
  }
  &.has-error {
    color: #d42d1f;
  }
  &.is-active {
    background-color: #1974e8;
    color: white !important;
    span {
      color: white !important;
    }
  }
`;

const Cell = styled.div`
  padding: 0 6px;
  font-size: 12px;
  height: 38px;
  border-right: 1px solid #e1e1e1;
  position: relative;
  display: flex !important;
  align-items: center;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

const SidebarWrapper = styled.div`
  min-width: 600px;
  flex-grow: 1;
  flex-direction: column;
`;

const TBody = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  height: calc(100vh - 28px);
`;

const columns = [
  { Header: "Operation name", accessor: "operationName" },
  { Header: "Type", width: 70, accessor: "type" },
  { Header: "Query", accessor: "query", Cell: QueryCell },
  { Header: "Variables", accessor: "variablesString", Cell: VariablesCell },
  { Header: "Data", accessor: "dataString", Cell: DataCell },
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

function AppPure(props) {
  const { list = [] } = props;
  const [activeRequestId, setActiveRequestId] = useState(null);

  const defaultColumnWidth =
    (window.innerWidth - 70 - 90) / (columns.length - 2) - (activeRequestId ? 600 : 0);
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 50,
      width: defaultColumnWidth,
      maxWidth: Math.max(defaultColumnWidth, 400),
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: list,
      defaultColumn,
    },
    useBlockLayout,
    useResizeColumns,
    useSortBy
  );

  return (
    <Container>
      {list.length === 0 && <EmptyState />}
      {list.length > 0 && (
        <TableWrapper>
          <Table>
            <div>
              {headerGroups.map((headerGroup) => (
                <div {...headerGroup.getHeaderGroupProps()} className="tr">
                  {headerGroup.headers.map((column) => (
                    <Header
                      {...column.getHeaderProps({
                        className: column.collapse ? "collapse" : "",
                        ...column.getSortByToggleProps(),
                      })}
                      className="th"
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

                      <div
                        {...column.getResizerProps()}
                        className={`resizer ${
                          column.isResizing ? "isResizing" : ""
                        }`}
                      />
                    </Header>
                  ))}
                </div>
              ))}
            </div>
            <TBody
              {...getTableBodyProps()}
              style={{
                overFlowX: "auto",
              }}
            >
              {rows.map((row, i) => {
                prepareRow(row);
                const hasError = row.original.errorsCount > 0;
                const isActive = row.original.id === activeRequestId;
                return (
                  <Row
                    {...row.getRowProps()}
                    className={
                      (hasError ? "has-error" : "") +
                      (isActive ? " is-active" : "")
                    }
                    onClick={() => {
                      setActiveRequestId(row.original.id);
                    }}
                  >
                    {row.cells.map((cell, index) => {
                      return (
                        <Cell
                          {...cell.getCellProps({
                            className: cell.column.collapse ? "collapse" : "",
                          })}
                          className="td"
                        >
                          {cell.render("Cell")}
                          <div
                            {...cell.column.getResizerProps()}
                            className={`resizer ${
                              cell.column.isResizing ? "isResizing" : ""
                            }`}
                          />
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
            item={list.find((i) => i.id === activeRequestId)}
            onClose={() => setActiveRequestId(null)}
          />
        </SidebarWrapper>
      )}
    </Container>
  );
}

export function App(props) {
  return (
    <ErrorBoundary>
      <AppPure {...props} />
    </ErrorBoundary>
  );
}
