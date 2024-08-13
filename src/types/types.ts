export interface WebSocketMessage {
  type: 'send' | 'receive';
  time: number;
  data: string;
  opcode: number;
}

export interface NetworkEntry {
  request: {
    url: string;
    bodySize: number;
    headers: Array<{ name: string; value: string }>;
    method: string;
    postData: {
      text: string;
    };
  };
  response: any;
  time: number;
  startedDateTime: string; // ISO string
  getContent: (callback: (content: string) => void) => void;
  _resourceType: string;
  _webSocketMessages: Array<WebSocketMessage>;
}

export interface HAR {
  entries: Array<NetworkEntry>;
}
