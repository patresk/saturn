import { NetworkEntry } from '../types/types';

// Return false if the request does not seem like a graphql request,
// otherwise return parsed REQUEST body
export function isGraphRequest(request: NetworkEntry) {
  const req = request.request;
  if (!req) {
    return false;
  }
  if (req.method !== 'POST') {
    return false;
  }
  if (
    !request.request.headers.find(
      (h) => h.name.toLowerCase() === 'content-type',
    )
  ) {
    return false;
  }
  try {
    const parsed = JSON.parse(request.request.postData.text);
    if (!parsed.hasOwnProperty('query')) {
      return false;
    }
    return true;
  } catch (err) {
    // Using console.error would render "Errors" in Chrome extensions list, which is not desirable (it's not a real error)
    console.log('The body is not a valid JSON', err);
    return false;
  }
}

export function isGraphqlWsRequest(entry: NetworkEntry) {
  // Detect GraphQL subscription event
  // TODO: this should be more robust, because WS link can be used for query / mutations operations as well
  const headerWebsocketProtocol = entry.request.headers.find(
    (header) => header.name === 'Sec-WebSocket-Protocol',
  );

  if (
    entry._resourceType === 'websocket' &&
    (entry.request.url.endsWith('/subscriptions') ||
      (headerWebsocketProtocol &&
        headerWebsocketProtocol.value === 'graphql-transport-ws'))
  ) {
    console.log('websocket entry', entry);
    return true;
  }
  return false;
}
