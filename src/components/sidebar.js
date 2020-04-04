import React, { useState } from "react";
import styled from "styled-components";

const SidebarS = styled.div`
  display: flex;
  width: 60%;
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
  padding: 0 8px;
`;

const SidebarContent = styled.div`
  padding: 16px;
  height: calc(100vh - 28px);
  overflow-y: auto;
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
  padding: 0px 8px;
  box-sizing: border-box;
  &.is-active {
    border-bottom: 2px solid #1974e8;
  }
`;

export function Sidebar(props) {
  const { item, onClose } = props;
  const [activeTab, setActiveTab] = useState("query");
  return (
    <SidebarS>
      <SidebarHeader>
        <CloseButton onClick={onClose}>
          <div>×</div>
        </CloseButton>
        <Tab className={activeTab === 'query' ? 'is-active' : ''} onClick={() => setActiveTab('query')}>Query</Tab>
        <Tab className={activeTab === 'data' ? 'is-active' : ''} onClick={() => setActiveTab('data')}>Data</Tab>
        <Tab className={activeTab === 'errors' ? 'is-active' : ''} onClick={() => setActiveTab('errors')}>Errors</Tab>
      </SidebarHeader>
      <SidebarContent>
        {activeTab === 'query' && item.query}
        {activeTab === 'data' && item.data}
        {activeTab === 'errors' && item.errors}
      </SidebarContent>
    </SidebarS>
  );
}
