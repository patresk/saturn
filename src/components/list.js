import React, { useState } from "react";
import styled from "styled-components";
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
} from "react-table";
import { Sidebar } from "@/components/sidebar";

const Global = styled.div`
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
  /* The secret sauce */
  /* Each cell should grow equally */
  width: 1%;
  /* But "collapsed" cells should be as small as possible */
  &.collapse {
    width: 0.0000000001%;
  }
`;

const Panel = styled.div`
  /* This is required to make the table full-width */
  display: block;
  max-width: 100%;
`;

const Wrap = styled.div`
  display: block;
  max-width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  border-bottom: 1px solid black;
`;

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  > div {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-flow: nowrap column;
    overflow: hidden;
  }
`;

const TBody = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  height: calc(100vh - 28px);
`;

const columns = [
  { Header: "Operation", accessor: "operationName" },
  { Header: "HTTP Status", accessor: "status" },
  { Header: "Query", accessor: "queryShort" },
  { Header: "Errors", accessor: "errorMessages" },
];

export function List(props) {
  const { list = [] } = props;
  const [activeRequestId, setActiveRequestId] = useState(null);

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
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
      <Global>
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
          <TBody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              const hasError = row.original.errors > 0;
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
      </Global>
      {activeRequestId && (
        <Sidebar
          item={list.find((i) => i.id === activeRequestId)}
          onClose={() => setActiveRequestId(null)}
        />
      )}
    </Container>
  );
}
