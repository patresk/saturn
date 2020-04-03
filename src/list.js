import React from "react";
import styled from "styled-components";

const Table = styled.table`
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
`

const Header = styled.th`
  background-color: #f3f3f3;
  height: 28px;
  line-height: 32px;
  padding: 0 6px;
  font-size: 12px;
  font-weight: normal;
  text-align: left;
  margin: 0;
  border: 1px solid #cdcdcd;
  border-top: 0;
  color: #323941;
  &:hover {
    background-color: #e6e6e6;
    cursor: pointer; 
  }
`

const Cell = styled.td`
  padding: 0 6px;
  font-size: 12px;
  height: 38px;
  border: 1px solid #e1e1e1;
  color: #323941;
`

const Row = styled.tr`
  &:nth-child(2n) {
    background-color: #f5f5f5;
  }
  &:hover {
    background-color: #f2f6fc
  }
`

export function List(props) {
  const { list = [] } = props
  return (
    <Table>
      <thead>
      <Header>Operation</Header><Header>HTTP status</Header><Header>Errors</Header>
      </thead>
      <tbody>
      {list.map(item => (
        <Row>
          <Cell>{item.operationName}</Cell>
          <Cell>{item.httpStatus}</Cell>
          <Cell>{item.errors} errors</Cell>
        </Row>
      ))}
      </tbody>
    </Table>
  )
}