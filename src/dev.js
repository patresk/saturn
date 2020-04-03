import React, {useEffect, useReducer, useState} from "react";
import ReactDOM from "react-dom";

import {List} from "./list";

function Dev() {
  return <List list={[
    {
      operationName: 'getProjectsBySlug',
      httpStatus: 'OK',
      errors: 2
    },
    {
      operationName: 'getProjects',
      httpStatus: 'OK',
      errors: 0
    },
    {
      operationName: 'getUser',
      httpStatus: 'OK',
      errors: 1
    }
  ]}/>
}

ReactDOM.render(<Dev/>, document.getElementById('app'));