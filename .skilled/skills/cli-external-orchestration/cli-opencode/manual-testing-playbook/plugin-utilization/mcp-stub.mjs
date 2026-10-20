// ───────────────────────────────────────────────────────────────
// MODULE: Stub MCP Server
// ───────────────────────────────────────────────────────────────
// A stdio MCP server with one `ping` tool. Registered under the name of a
// family the Code Mode manifest covers, it gives the session a native MCP
// call for the route guard to advise on, without any real external server.
'use strict';

import { createInterface } from 'node:readline';

const send = (message) => process.stdout.write(`${JSON.stringify(message)}\n`);

createInterface({ input: process.stdin }).on('line', (line) => {
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return;
  }
  // Notifications carry no id and need no reply.
  if (message.id === undefined) return;
  const reply = (result) => send({ jsonrpc: '2.0', id: message.id, result });
  if (message.method === 'initialize') {
    reply({
      protocolVersion: message.params?.protocolVersion || '2025-06-18',
      capabilities: { tools: {} },
      serverInfo: { name: 'stub', version: '1.0.0' },
    });
  } else if (message.method === 'tools/list') {
    reply({ tools: [{ name: 'ping', description: 'Returns pong.', inputSchema: { type: 'object', properties: {} } }] });
  } else if (message.method === 'tools/call') {
    reply({ content: [{ type: 'text', text: 'pong-stub' }] });
  } else {
    reply({});
  }
});
