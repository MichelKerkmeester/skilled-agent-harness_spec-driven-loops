import { mkdtempSync, rmSync } from 'node:fs';
import net from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { afterEach, describe, expect, it } from 'vitest';

import {
  getIpcBridgeStats,
  startIpcSocketServer,
  type IpcSocketServerHandle,
} from '../../lib/ipc/socket-server.js';

const tempDirs: string[] = [];
const handles: IpcSocketServerHandle[] = [];
const clients: net.Socket[] = [];
const originalMaxClients = process.env.SPECKIT_MAX_SECONDARY_CLIENTS;

function makeTempSocketPath(label: string): string {
  const dir = mkdtempSync(join(tmpdir(), `${label}-`));
  tempDirs.push(dir);
  return join(dir, 'daemon-ipc.sock');
}

function makeServer(): Server {
  const server = new Server(
    { name: 'ipc-cap-stress', version: '0.0.0' },
    { capabilities: { tools: {} } },
  );
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [] }));
  return server;
}

async function connect(socketPath: string): Promise<net.Socket> {
  const socket = net.createConnection({ path: socketPath });
  clients.push(socket);
  await new Promise<void>((resolve, reject) => {
    socket.once('connect', resolve);
    socket.once('error', reject);
  });
  return socket;
}

function readLine(socket: net.Socket, timeoutMs = 1500): Promise<string> {
  return new Promise((resolve, reject) => {
    let buffer = '';
    const cleanup = (): void => {
      clearTimeout(timer);
      socket.off('data', onData);
      socket.off('close', onClose);
      socket.off('error', onError);
    };
    const onData = (chunk: Buffer): void => {
      buffer += chunk.toString('utf8');
      const index = buffer.indexOf('\n');
      if (index === -1) return;
      cleanup();
      resolve(buffer.slice(0, index));
    };
    const onClose = (): void => {
      cleanup();
      reject(new Error('socket closed before JSON-RPC response'));
    };
    const onError = (error: Error): void => {
      cleanup();
      reject(error);
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('timed out waiting for JSON-RPC response'));
    }, timeoutMs);
    socket.on('data', onData);
    socket.once('close', onClose);
    socket.once('error', onError);
  });
}

async function initializeRoundTrip(socketPath: string, id: number): Promise<net.Socket> {
  const socket = await connect(socketPath);
  socket.write(`${JSON.stringify({
    jsonrpc: '2.0',
    id,
    method: 'initialize',
    params: {
      protocolVersion: '2025-06-18',
      capabilities: {},
      clientInfo: { name: 'ipc-cap-stress-client', version: '0.0.0' },
    },
  })}\n`);
  const line = await readLine(socket);
  const response = JSON.parse(line) as { result?: unknown; error?: unknown };
  expect(response.error).toBeUndefined();
  expect(response.result).toBeTruthy();
  socket.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} })}\n`);
  return socket;
}

async function attemptInitialize(socketPath: string, id: number): Promise<'served' | 'refused'> {
  try {
    await initializeRoundTrip(socketPath, id);
    return 'served';
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (/closed before JSON-RPC response|ECONNRESET|EPIPE|socket hang up/i.test(message)) {
      return 'refused';
    }
    throw error;
  }
}

async function waitFor(predicate: () => boolean, label: string, timeoutMs = 1500): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error(`Timed out waiting for ${label}`);
}

afterEach(async () => {
  process.env.SPECKIT_MAX_SECONDARY_CLIENTS = originalMaxClients ?? '';
  if (originalMaxClients === undefined) delete process.env.SPECKIT_MAX_SECONDARY_CLIENTS;
  while (clients.length > 0) clients.pop()?.destroy();
  while (handles.length > 0) await handles.pop()?.close();
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('IPC secondary client cap fanout stress', () => {
  it('serves more than twenty concurrent initialize round-trips under the default cap', async () => {
    delete process.env.SPECKIT_MAX_SECONDARY_CLIENTS;
    const handle = await startIpcSocketServer({
      socketPath: makeTempSocketPath('ipc-cap-default'),
      createServer: makeServer,
      log: () => undefined,
    });
    handles.push(handle);

    const sockets = await Promise.all(
      Array.from({ length: 24 }, (_value, index) => initializeRoundTrip(handle.socketPath, index + 1)),
    );

    expect(sockets).toHaveLength(24);
    expect(getIpcBridgeStats().secondary_clients_count).toBe(24);
  });

  it('refuses only over-cap clients and accepts again after holders close', async () => {
    process.env.SPECKIT_MAX_SECONDARY_CLIENTS = '4';
    const handle = await startIpcSocketServer({
      socketPath: makeTempSocketPath('ipc-cap-low'),
      createServer: makeServer,
      log: () => undefined,
    });
    handles.push(handle);

    const holders = await Promise.all(
      Array.from({ length: 4 }, (_value, index) => initializeRoundTrip(handle.socketPath, index + 1)),
    );
    expect(getIpcBridgeStats().secondary_clients_count).toBe(4);

    const overflow = await Promise.all(
      Array.from({ length: 4 }, (_value, index) => attemptInitialize(handle.socketPath, index + 101)),
    );
    expect(overflow.filter((result) => result === 'refused')).toHaveLength(4);
    expect(overflow.filter((result) => result === 'served')).toHaveLength(0);

    for (const holder of holders) holder.destroy();
    await waitFor(() => getIpcBridgeStats().secondary_clients_count === 0, 'cap holders to disconnect');

    const survivor = await attemptInitialize(handle.socketPath, 999);
    expect(survivor).toBe('served');
    expect(getIpcBridgeStats().secondary_clients_count).toBe(1);
  });
});
