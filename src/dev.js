import React, { useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import "@/css/chrome-shared.css";
import "@/css/widgets.css";

import { List } from "@/components/list";

// Devtools are zoomed out a little bit.
const ZoomOut = styled.div`
  zoom: 0.9;
`;

function Dev() {
  return (
    <ZoomOut>
      <List
        list={[
          {
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
