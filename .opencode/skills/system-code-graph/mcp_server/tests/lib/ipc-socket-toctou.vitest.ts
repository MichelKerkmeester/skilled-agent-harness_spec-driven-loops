// ───────────────────────────────────────────────────────────────
// MODULE: IPC socket bind TOCTOU race regression
// ───────────────────────────────────────────────────────────────
// Under N-way primary contention a daemon hits EADDRINUSE on a socket
// path another primary owns, then races to reclaim it. The stale-socket
// node can vanish (ENOENT) between the EADDRINUSE failure and the
// lstat/unlink reclaim (a TOCTOU window). The bind must treat that
// vanished node as reclaimable and re-bind — never throw-to-abort and
// orphan the socket. These tests drive the REAL EADDRINUSE -> reclaim
// path (a genuine pre-bound UNIX socket), not a regular file, so they do
// not depend on the macOS/Node listen()-on-a-file EINVAL quirk.

import fs from 'node:fs';
import net from 'node:net';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  startIpcSocketServer,
  type IpcSocketServerHandle,
} from '../../lib/ipc/socket-server.js';

const tempDirs: string[] = [];
const stalePreBinds: net.Server[] = [];
const handles: IpcSocketServerHandle[] = [];
const clients: net.Socket[] = [];

function tempRoot(prefix: string): string {
  // os.tmpdir() resolves inside an allowed socket root on every supported host.
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

// Bind a real raw UNIX socket and leave it listening so a subsequent startIpcSocketServer on the
// same path hits a genuine EADDRINUSE (the real reclaim trigger), not a regular-file EINVAL.
async function preBindStaleSocket(socketPath: string): Promise<net.Server> {
  const server = net.createServer();
  stalePreBinds.push(server);
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.once('listening', resolve);
    server.listen(socketPath);
  });
  return server;
}

function makeServer(): Server {
  const server = new Server(
    { name: 'ipc-toctou-test', version: '0.0.0' },
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

afterEach(async () => {
  vi.restoreAllMocks();
  while (clients.length > 0) clients.pop()?.destroy();
  while (handles.length > 0) await handles.pop()?.close();
  while (stalePreBinds.length > 0) {
    const server = stalePreBinds.pop();
    if (server) await new Promise<void>((resolve) => server.close(() => resolve()));
  }
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('IPC socket bind TOCTOU race', () => {
  it('reclaims a real stale UNIX socket on EADDRINUSE and the survivor serves', async () => {
    const dir = tempRoot('cg-toctou-reclaim-');
    const socketPath = join(dir, 'daemon-ipc.sock');
    // A genuine pre-bound, same-uid socket node: the fence permits the unlink and the bind reclaims.
    await preBindStaleSocket(socketPath);

    const handle = await startIpcSocketServer({
      socketPath,
      createServer: makeServer,
      log: () => undefined,
    });
    handles.push(handle);

    const client = await connect(socketPath);
    client.write('{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}\n');
    const response = await readLine(client);
    expect(response).toContain('"jsonrpc":"2.0"');
  });

  it('does NOT abort the bind when the stale socket node vanishes mid-reclaim (ENOENT TOCTOU)', async () => {
    const dir = tempRoot('cg-toctou-enoent-');
    const socketPath = join(dir, 'daemon-ipc.sock');
    // Force a genuine EADDRINUSE first.
    await preBindStaleSocket(socketPath);

    // Simulate the racing peer removing the socket node between the EADDRINUSE failure and the
    // reclaim lstat: the very next lstatSync of the socket path throws ENOENT. The reclaim path must
    // treat this as "already gone -> reclaimable" and re-bind, not throw and orphan the socket. The
    // stale pre-bind stays listening so the bind below hits a REAL EADDRINUSE first (which is what
    // drives the reclaim path); the real unlink then frees the path so the retry can re-bind.
    const realLstat = fs.lstatSync.bind(fs);
    let raced = false;
    vi.spyOn(fs, 'lstatSync').mockImplementation(((target: fs.PathLike, ...rest: unknown[]) => {
      if (!raced && String(target) === socketPath) {
        raced = true;
        const error = new Error('ENOENT: vanished mid-reclaim') as NodeJS.ErrnoException;
        error.code = 'ENOENT';
        throw error;
      }
      return (realLstat as (p: fs.PathLike, ...args: unknown[]) => fs.Stats)(target, ...rest);
    }) as typeof fs.lstatSync);

    const handle = await startIpcSocketServer({
      socketPath,
      createServer: makeServer,
      log: () => undefined,
    });
    handles.push(handle);

    expect(raced).toBe(true);
    // Survivor is serving on the reclaimed path.
    const client = await connect(socketPath);
    client.write('{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n');
    const response = await readLine(client);
    expect(response).toContain('"jsonrpc":"2.0"');
  });
});
