import { ListItem } from '../components/app';

export const requests: Array<ListItem> = [
  {
    id: '1',
    operationName: 'getProjectsBySlug',
    errorMessages: ['Forbidden', 'No valid ID extracted from 1'],
    errors: [2],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '2',
    operationName: 'getProjects',
    errorMessages: ['Forbidden', 'No valid ID extracted from 1'],
    errors: [0],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '3',
    operationName: 'getUser',
    errors: [1],
    status: '200',
    errorMessages: [],
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '4',
    operationName: 'getProjectsBySlug',
    errors: [2],
    status: '200',
    errorMessages: [],
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '5',
    operationName: 'getProjects',
    errors: [0],
    errorMessages: [],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '6',
    operationName: 'getUser',
    errorsCount: 1,
    errors: [0],
    errorMessages: [],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '7',
    operationName: 'getProjectsBySlug',
    errors: [2],
    status: '200',
    errorMessages: [],
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '8',
    operationName: 'getProjects',
    errorsCount: 0,
    errors: [],
    errorMessages: [],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '9',
    operationName: 'getUser',
    errorsCount: 0,
    errors: [],
    errorMessages: [],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '10',
    operationName: 'getProjectsBySlug',
    errorsCount: 0,
    errors: [],
    errorMessages: [],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '11',
    operationName: 'getProjects',
    errors: [0],
    errorMessages: [],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '12',
    operationName: 'getUser',
    errors: [0],
    errorMessages: [],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '13',
    operationName: 'getProjectsBySlug',
    errors: [0],
    errorMessages: [],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '14',
    operationName: 'getProjects',
    errors: [0],
    errorMessages: [],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '15',
    operationName: 'getUser',
    errors: [0],
    errorMessages: [],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '16',
    operationName: 'getProjectsBySlug',
    errors: [0],
    errorMessages: [],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '17',
    operationName: 'getProjects',
    errors: [0],
    errorMessages: [],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
    id: '18',
    operationName: 'getUser',
    errors: [0],
    errorMessages: [],
    status: '200',
    type: 'query',
    queryShort: '{ species { id name descriptions ...',
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
];
