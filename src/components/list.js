import React, { useState } from "react";
import styled from "styled-components";
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
} from "react-table";
import { Sidebar } from "@/components/sidebar";

const TableWrapper = styled.div`
  width: 100%;
  flex-grow: 1;
  overflow-x: auto;

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

const Table = styled.div`
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;
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
  /* The secret sauce */
  /* Each cell should grow equally */
  width: 1%;
  /* But "collapsed" cells should be as small as possible */
  &.collapse {
    width: 0.0000000001%;
  }
`;

const Row = styled.div`
  cursor: pointer;
  color: #323941;
  &:nth-child(2n) {
    background-color: #f5f5f5;
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
  /* The secret sauce */
  /* Each cell should grow equally */
  //width: 1%;
  /* But "collapsed" cells should be as small as possible */
  //&.collapse {
  //  width: 0.0000000001%;
  //}
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
  { Header: "HTTP Status", accessor: "status" },
  { Header: "Query", accessor: "query" },
  { Header: "Variables", accessor: "variablesString" },
  { Header: "Data", accessor: "dataString" },
  { Header: "Errors", accessor: "errorMessages" },
];

const EmptyStateStyled = styled.div`
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

function EmptyState() {
  return (
    <EmptyStateStyled>
      <h1>🚀</h1>
      <p>Recording GraphQL requests...</p>
      <p>Perform a request or reload the page to record.</p>
      <p>
        <a
          target="_blank"
          href="https://github.com/patresk/saturn/blob/master/src/panel.js#L10"
        >
          How GraphQL request is detected?
        </a>
      </p>
    </EmptyStateStyled>
  );
}

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
      return (
        <EmptyStateStyled>
          <h1>⚠️</h1>
          <p>Unexpected problem occurred.</p>
          <p>
            <a target="_blank" href="https://github.com/patresk/saturn/issues">
              Create a GitHub issue
            </a>
          </p>
        </EmptyStateStyled>
      );
    }

    return this.props.children;
  }
}

function ListPure(props) {
  const { list = [] } = props;
  const [activeRequestId, setActiveRequestId] = useState(null);

  const defaultColumnWidth =
    window.innerWidth / columns.length - (activeRequestId ? 600 : 0);
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

  console.log("active", activeRequestId);

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

export function List(props) {
  return (
    <ErrorBoundary>
      <ListPure {...props} />
    </ErrorBoundary>
  );
}
