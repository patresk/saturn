import React from "react";
import styled from "styled-components";

const LightGray = styled.span`
  color: #7c7c7c;
`;

const TwoLineLayout = styled.div`
  overflow: hidden;
  max-height: 33px;
  text-overflow: ellipsis;
  line-height: 16px;
`;

export function ErrorCell(props) {
  const val = props.cell.value;
  if (!val || val.length === 0) {
    return <LightGray>No errors</LightGray>;
  }
  return <TwoLineLayout title={val}>{val}</TwoLineLayout>;
}

export function VariablesCell(props) {
  const val = props.cell.value;
  if (!val || val === "{}") {
    return <LightGray>No variables</LightGray>;
  }
  return <TwoLineLayout title={val}>{val}</TwoLineLayout>;
}

export function DataCell(props) {
  const val = props.cell.value;
  if (val === undefined || val === null || val === "") {
    return <LightGray>No data</LightGray>;
  }
  return <TwoLineLayout title={val}>{val}</TwoLineLayout>;
}

export function QueryCell(props) {
  const val = props.cell.value;
  if (val === undefined || val === null) {
    return <LightGray>No query</LightGray>;
  }
  return <TwoLineLayout title={val}>{val}</TwoLineLayout>;
}
