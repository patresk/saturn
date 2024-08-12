import { NetworkEntry, WebSocketMessage } from '../types/types';

export function processRawNetworkEntries(
  wsMessages: Array<WebSocketMessage>,
  httpRequests: Array<{ request: NetworkEntry; content: any }>,
  clearedAt: number,
) {
  const wsMessagesMap: { [key: string]: any } = {};

  const transformedWsMessages = wsMessages
    .map((wsMessage) => {
      const parsed = JSON.parse(wsMessage.data) as {
        type: string;
        id: string;
        payload: {
          operationName: string;
          query: string;
          variables: any;
          data: any;
          errors: Array<{ message: string }>;
        };
      };

      // We are ignoring ping/pong, connection_init, connection_ack and other messages
      if (parsed.type !== 'subscribe' && parsed.type !== 'next') {
        return false;
      }

      const type = parsed.type;
      const operationName = parsed.payload.operationName;
      const query = parsed.payload.query;
      const variables = parsed.payload.variables;
      const data = parsed.payload.data;
      const errors = parsed.payload.errors;

      const processed = {
        id: wsMessage.time.toString(),
        payloadId: parsed.id,
        time: new Date(wsMessage.time * 1000),
        operationName: operationName,
        status: '200',
        query: query ? query : '',
        queryShort: query ? query.substring(0, 64) : '',
        type:
          type === 'subscribe'
            ? ('subscription' as const)
            : ('subscription data' as const),
        variables: variables ? variables : null,
        variablesString: variables ? JSON.stringify(variables) : '',
        errorsCount: parsed && errors ? errors.length : 0,
        errors: parsed && errors ? errors : null,
        errorMessages:
          parsed && errors ? errors.map((err: any) => err.message) : [],
        data: data ? data : null,
        dataString: data ? JSON.stringify(data) : '',
        dataStringShort: data ? JSON.stringify(data).substring(0, 64) : '',
      };

      // Store the subscribe message as a parent
      if (parsed.id && parsed.type === 'subscribe') {
        wsMessagesMap[parsed.id] = processed;
      }

      // Ignore ws messages before the list was cleared
      if (clearedAt && wsMessage.time * 1000 < clearedAt) {
        return false;
      }

      return processed;
    })
    .filter((a) => a !== false)
    .map((a) => {
      // Only subscription data events are augmented with the subscription query, variables, etc.
      if (a.type !== 'subscription data') {
        return a;
      }
      const parentMessage = wsMessagesMap[a.payloadId];
      if (!parentMessage) {
        return a;
      }
      return {
        ...a,
        operationName: parentMessage.operationName,
        query: parentMessage.query,
        queryShort: parentMessage.queryShort,
        variables: parentMessage.variables,
        variablesString: parentMessage.variablesString,
      };
    });

  const transformed = httpRequests
    .filter((entry) => {
      if (clearedAt) {
        if (
          new Date(entry.request.startedDateTime).getTime() * 1000 <
          clearedAt
        ) {
          return false;
        }
      }
      return true;
    })
    .map((entry) => {
      const { request, content } = entry;
      const parsedRequestBody = JSON.parse(request.request.postData.text);

      return {
        id: request.startedDateTime.toString() + request.time.toString(),
        time: new Date(request.startedDateTime),
        operationName: parsedRequestBody.operationName || 'Untitled operation',
        status:
          request.response.status === 0 ? 'Cancelled' : request.response.status,
        query: parsedRequestBody.query ? parsedRequestBody.query : '',
        queryShort: parsedRequestBody.query
          ? parsedRequestBody.query.substring(0, 64)
          : '',
        type: parsedRequestBody.query
          .substring(0, 26)
          .trim()
          .startsWith('mutation')
          ? ('mutation' as const)
          : ('query' as const),
        variables: parsedRequestBody.variables
          ? parsedRequestBody.variables
          : null,
        variablesString: parsedRequestBody.variables
          ? JSON.stringify(parsedRequestBody.variables)
          : '',
        errorsCount: content && content.errors ? content.errors.length : 0,
        errors: content && content.errors ? content.errors : null,
        errorMessages:
          content && content.errors
            ? content.errors.map((err: any) => err.message)
            : [],
        data: content && content.data ? content.data : null,
        dataString: content && content.data ? JSON.stringify(content.data) : '',
        dataStringShort:
          content && content.data
            ? JSON.stringify(content.data).substring(0, 64)
            : '',
      };
    });

  return [...transformedWsMessages, ...transformed];
}
