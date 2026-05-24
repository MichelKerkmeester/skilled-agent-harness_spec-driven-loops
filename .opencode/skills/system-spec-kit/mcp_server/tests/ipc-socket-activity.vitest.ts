import net from 'node:net';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  startIpcSocketServer,
  type IpcSocketServerHandle,
} from '../lib/ipc/socket-server.js';

const handles: IpcSocketServerHandle[] = [];
const sockets: net.Socket[] = [];

function makeServer(): Server {
  const server = new Server(
    { name: 'ipc-activity-test', version: '0.0.0' },
    { capabilities: { tools: {} } },
  );
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [],
  }));
  return server;
}

function connectionTarget(endpoint: string): net.NetConnectOpts {
  const url = new URL(endpoint);
  return { host: url.hostname, port: Number.parseInt(url.port, 10) };
}

async function connectSocket(endpoint: string): Promise<net.Socket> {
  const socket = net.createConnection(connectionTarget(endpoint));
  sockets.push(socket);
  await new Promise<void>((resolve, reject) => {
    socket.once('connect', resolve);
    socket.once('error', reject);
  });
  return socket;
}

async function readLine(socket: net.Socket): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    let buffer = '';
    const onData = (chunk: Buffer) => {
      buffer += chunk.toString('utf8');
      const index = buffer.indexOf('\n');
      if (index === -1) return;
      socket.off('data', onData);
      resolve(buffer.slice(0, index));
    };
    socket.on('data', onData);
    socket.once('error', reject);
  });
}

async function waitFor(predicate: () => boolean, label: string, timeoutMs = 500): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error(`Timed out waiting for ${label}`);
}

describe('IPC socket activity callback', () => {
  afterEach(async () => {
    while (sockets.length > 0) {
      sockets.pop()?.destroy();
    }
    while (handles.length > 0) {
      await handles.pop()?.close();
    }
  });

  it('marks connect, inbound data, and outbound writes as launcher activity', async () => {
    const onActivity = vi.fn();
    const handle = await startIpcSocketServer({
      socketPath: 'tcp://127.0.0.1:0',
      createServer: makeServer,
      onActivity,
      log: () => undefined,
    });
    handles.push(handle);

    const socket = await connectSocket(handle.socketPath);
    await waitFor(() => onActivity.mock.calls.length >= 1, 'server-side socket activity');
    expect(onActivity).toHaveBeenCalledTimes(1);

    socket.write('{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}\n');
    const response = await readLine(socket);

    expect(response).toContain('"jsonrpc":"2.0"');
    expect(onActivity.mock.calls.length).toBeGreaterThanOrEqual(3);
  });
});
