import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import "@/css/chrome-shared.css";
import "@/css/widgets.css";

import { App } from "./components/app";

// Devtools are zoomed out a little bit.
const ZoomOut = styled.div`
  zoom: 0.9;
`;

function Dev() {
  return (
    <ZoomOut>
      <App
        list={[
          {
            id: "1",
            operationName: "getProjectsBySlug",
            errorMessages: ["Forbidden", "No valid ID extracted from 1"],
            errors: 2,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "2",
            operationName: "getProjects",
            httpStatus: "OK",
            errorMessages: ["Forbidden", "No valid ID extracted from 1"],
            errors: 0,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "3",
            operationName: "getUser",
            httpStatus: "OK",
            errors: 1,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "4",
            operationName: "getProjectsBySlug",
            httpStatus: "OK",
            errors: 2,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "5",
            operationName: "getProjects",
            httpStatus: "OK",
            errors: 0,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "6",
            operationName: "getUser",
            httpStatus: "OK",
            errors: 1,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "7",
            operationName: "getProjectsBySlug",
            httpStatus: "OK",
            errors: 2,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "8",
            operationName: "getProjects",
            httpStatus: "OK",
            errors: 0,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "9",
            operationName: "getUser",
            httpStatus: "OK",
            errors: 1,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "10",
            operationName: "getProjectsBySlug",
            httpStatus: "OK",
            errors: 2,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "11",
            operationName: "getProjects",
            httpStatus: "OK",
            errors: 0,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "12",
            operationName: "getUser",
            httpStatus: "OK",
            errors: 1,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "13",
            operationName: "getProjectsBySlug",
            httpStatus: "OK",
            errors: 2,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "14",
            operationName: "getProjects",
            httpStatus: "OK",
            errors: 0,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "15",
            operationName: "getUser",
            httpStatus: "OK",
            errors: 1,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "16",
            operationName: "getProjectsBySlug",
            httpStatus: "OK",
            errors: 2,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "17",
            operationName: "getProjects",
            httpStatus: "OK",
            errors: 0,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
          {
            id: "18",
            operationName: "getUser",
            httpStatus: "OK",
            errors: 1,
            status: 200,
            queryShort: "{ species { id name descriptions ...",
            query: `
      {
        species {
          id
          name
          descriptions
          animals {
            id
            name
          }
        }
      }
      `,
          },
        ]}
      />
    </ZoomOut>
  );
}

ReactDOM.render(<Dev />, document.getElementById("app"));
