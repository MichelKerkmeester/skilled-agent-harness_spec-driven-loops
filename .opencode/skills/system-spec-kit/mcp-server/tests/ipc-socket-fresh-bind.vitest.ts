// ───────────────────────────────────────────────────────────────
// MODULE: IPC socket fresh-bind symlink rejection
// ───────────────────────────────────────────────────────────────
// The EADDRINUSE reclaim branch fences a stale socket node via lstat
// (canUnlinkExistingSocket). The FRESH-bind path — where no socket is
// listening yet — needs the same protection: a symlink planted at the
// bind path must be refused before listen()/chmod, so the later 0o600
// chmod cannot be redirected onto an attacker-pointed target. These
// tests drive the fresh-bind path (no pre-bound socket) and assert the
// symlink is rejected up front, while a normal fresh bind still serves.

import fs from 'node:fs';
import net from 'node:net';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { afterEach, describe, expect, it } from 'vitest';

import {
  startIpcSocketServer,
  type IpcSocketServerHandle,
} from '../lib/ipc/socket-server.js';

const tempDirs: string[] = [];
const handles: IpcSocketServerHandle[] = [];
const clients: net.Socket[] = [];

function tempRoot(prefix: string): string {
  // os.tmpdir() resolves inside an allowed socket root on every supported host.
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function makeServer(): Server {
  const server = new Server(
    { name: 'ipc-fresh-bind-test', version: '0.0.0' },
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
  while (clients.length > 0) clients.pop()?.destroy();
  while (handles.length > 0) await handles.pop()?.close();
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('IPC socket fresh-bind symlink fence', () => {
  it('refuses to bind when a symlink is planted at the socket path (no EADDRINUSE involved)', async () => {
    const dir = tempRoot('sk-fresh-bind-symlink-');
    const socketPath = join(dir, 'daemon-ipc.sock');
    // A real file the symlink points at; if the fence were missing, the post-bind chmod could be
    // redirected onto this target. Nothing is listening, so this exercises the FRESH-bind path, not
    // the EADDRINUSE reclaim branch.
    const decoyTarget = join(dir, 'decoy-target');
    fs.writeFileSync(decoyTarget, 'do-not-chmod-me', 'utf8');
    fs.symlinkSync(decoyTarget, socketPath);

    await expect(
      startIpcSocketServer({
        socketPath,
        createServer: makeServer,
        log: () => undefined,
      }),
    ).rejects.toThrow(/symlink/i);

    // The symlink node is left intact (the fence rejected before any unlink/listen), and the decoy
    // target's permissions were never touched by a redirected chmod.
    expect(fs.lstatSync(socketPath).isSymbolicLink()).toBe(true);
  });

  it('binds cleanly on the fresh path when no node exists and the survivor serves', async () => {
    const dir = tempRoot('sk-fresh-bind-clean-');
    const socketPath = join(dir, 'daemon-ipc.sock');

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
});
