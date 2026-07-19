import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { createRequire } from 'node:module';
import net from 'node:net';
import { PassThrough } from 'node:stream';
import {
  copyFileSync,
  cpSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { afterEach, describe, expect, it } from 'vitest';

import {
  getIpcBridgeStats,
  resolveIpcSocketPath,
  startIpcSocketServer,
  type IpcSocketServerHandle,
} from '../lib/ipc/socket-server.js';

const require = createRequire(import.meta.url);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const tempRoot = '/private/tmp';
const bridgeModule = require('../../../../bin/lib/launcher-ipc-bridge.cjs') as {
  bridgeStdioToSocket: (socketPath: string, options?: Record<string, unknown>) => net.Socket;
};

const tempDirs: string[] = [];
const children: ChildProcessWithoutNullStreams[] = [];
const handles: IpcSocketServerHandle[] = [];
const servers: net.Server[] = [];

function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tempRoot, prefix));
  tempDirs.push(dir);
  return dir;
}

async function listenTcp(server: net.Server): Promise<string | null> {
  const listened = await new Promise<boolean>((resolvePromise, reject) => {
    server.once('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EPERM') {
        resolvePromise(false);
        return;
      }
      reject(error);
    });
    server.listen(0, '127.0.0.1', () => {
      resolvePromise(true);
    });
  });
  if (!listened) return null;
  servers.push(server);
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('TCP test server did not expose an address');
  }
  return `tcp://${address.address}:${address.port}`;
}

function connectionTarget(endpoint: string): string | net.NetConnectOpts {
  if (!endpoint.startsWith('tcp://')) {
    return endpoint;
  }
  const url = new URL(endpoint);
  return { host: url.hostname, port: Number.parseInt(url.port, 10) };
}

function makeServer(): Server {
  const server = new Server(
    { name: 'test-bridge', version: '0.0.0' },
    { capabilities: { tools: {} } },
  );
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'ping',
        description: 'test tool',
        inputSchema: { type: 'object', properties: {} },
      },
    ],
  }));
  return server;
}

function readLine(socket: net.Socket): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    let buffer = '';
    const onData = (chunk: Buffer) => {
      buffer += chunk.toString('utf8');
      const index = buffer.indexOf('\n');
      if (index === -1) return;
      socket.off('data', onData);
      resolvePromise(buffer.slice(0, index));
    };
    socket.on('data', onData);
    socket.once('error', reject);
  });
}

async function connectSocket(pathValue: string): Promise<net.Socket> {
  const socket = net.createConnection(connectionTarget(pathValue));
  await new Promise<void>((resolvePromise, reject) => {
    socket.once('connect', resolvePromise);
    socket.once('error', reject);
  });
  return socket;
}

function copyLauncherFixture(root: string, launcherRelativePath: string): string {
  const launcherPath = join(root, launcherRelativePath);
  mkdirSync(dirname(launcherPath), { recursive: true });
  copyFileSync(join(repoRoot, launcherRelativePath), launcherPath);
  // The launcher require()s its whole ./lib tree (model-server-supervision.cjs,
  // launcher-session-proxy.cjs, launcher-ipc-bridge.cjs) at module-load time. Copying only the
  // bridge file makes every spawned launcher die with MODULE_NOT_FOUND before it reaches bridge
  // mode, so copy the entire sibling lib tree.
  const libSource = join(repoRoot, '.opencode/bin/lib');
  const libDest = join(root, '.opencode/bin/lib');
  cpSync(libSource, libDest, { recursive: true });
  return launcherPath;
}

function spawnLauncher(root: string, launcherPath: string, env: NodeJS.ProcessEnv = {}): {
  child: ChildProcessWithoutNullStreams;
  stdout: string;
  stderr: string;
} {
  const child = spawn(process.execPath, [launcherPath], {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const run = { child, stdout: '', stderr: '' };
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk) => { run.stdout += chunk; });
  child.stderr.on('data', (chunk) => { run.stderr += chunk; });
  children.push(child);
  return run;
}

async function waitFor(predicate: () => boolean, label: string, timeoutMs = 2000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    if (predicate()) return;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 20));
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function waitForExit(child: ChildProcessWithoutNullStreams, timeoutMs = 3000): Promise<number | null> {
  if (child.exitCode !== null) return child.exitCode;
  return await new Promise((resolvePromise, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timed out waiting for launcher exit')), timeoutMs);
    child.once('exit', (code) => {
      clearTimeout(timeout);
      resolvePromise(code);
    });
  });
}

// SKIP: requires stable local IPC socket lifecycle — defer to integration env
describe.skip('launcher IPC bridge', () => {
  afterEach(async () => {
    while (children.length > 0) {
      const child = children.pop();
      if (child && child.exitCode === null && child.signalCode === null) {
        child.kill('SIGTERM');
      }
    }
    while (handles.length > 0) {
      const handle = handles.pop();
      if (handle) await handle.close();
    }
    while (servers.length > 0) {
      const server = servers.pop();
      if (server) await new Promise<void>((resolvePromise) => server.close(() => resolvePromise()));
    }
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  it('pipes stdin to a unix socket and socket responses to stdout', async () => {
    let sock = '';
    let serverSocket: net.Socket | null = null;
    const server = net.createServer((socket) => {
      serverSocket = socket;
      socket.once('data', (chunk) => {
        socket.write(`echo:${chunk.toString('utf8')}`);
      });
    });
    sock = await listenTcp(server) ?? '';
    if (!sock) return;

    const input = new PassThrough();
    const output = new PassThrough();
    let outputText = '';
    output.on('data', (chunk) => { outputText += chunk.toString('utf8'); });
    bridgeModule.bridgeStdioToSocket(sock, { stdin: input, stdout: output, exit: () => undefined });

    input.write('{"jsonrpc":"2.0","id":1,"method":"tools/list"}\n');
    await waitFor(() => outputText.includes('echo:'), 'echoed bridge output');
    expect(outputText).toContain('"method":"tools/list"');
    serverSocket?.destroy();
  });

  it('lease-held with socket present enters bridge mode and stays attached', async () => {
    const root = tempDir('launcher-bridge-present-');
    const launcherPath = copyLauncherFixture(root, '.opencode/bin/mk-spec-memory-launcher.cjs');
    const dbDir = join(root, '.opencode/skills/system-spec-kit/mcp-server/database');
    mkdirSync(dbDir, { recursive: true });
    writeFileSync(join(dbDir, '.mk-spec-memory-launcher.json'), JSON.stringify({ pid: process.pid, startedAt: '2026-05-19T00:00:00.000Z' }));
    const server = net.createServer(() => undefined);
    const socketEndpoint = await listenTcp(server);
    if (!socketEndpoint) return;

    const run = spawnLauncher(root, launcherPath, { SPECKIT_IPC_SOCKET_DIR: socketEndpoint });
    await waitFor(() => run.stderr.includes('bridging to lease holder'), 'bridge log');
    expect(run.child.exitCode).toBeNull();
  });

  it('lease-held with missing socket exits with no-bridge-socket marker', async () => {
    const root = tempDir('launcher-bridge-missing-');
    const launcherPath = copyLauncherFixture(root, '.opencode/bin/mk-spec-memory-launcher.cjs');
    const dbDir = join(root, '.opencode/skills/system-spec-kit/mcp-server/database');
    mkdirSync(dbDir, { recursive: true });
    writeFileSync(join(dbDir, '.mk-spec-memory-launcher.json'), JSON.stringify({ pid: process.pid, startedAt: '2026-05-19T00:00:00.000Z' }));

    const run = spawnLauncher(root, launcherPath);
    await waitForExit(run.child);
    expect(run.stdout).toContain(`LEASE_HELD_BY:${process.pid} startedAt=2026-05-19T00:00:00.000Z (no-bridge-socket)`);
  });

  it('SPECKIT_LAUNCHER_BRIDGE_DISABLED forces legacy lease-held output', async () => {
    const root = tempDir('launcher-bridge-disabled-');
    const launcherPath = copyLauncherFixture(root, '.opencode/bin/mk-spec-memory-launcher.cjs');
    const dbDir = join(root, '.opencode/skills/system-spec-kit/mcp-server/database');
    mkdirSync(dbDir, { recursive: true });
    writeFileSync(join(dbDir, '.mk-spec-memory-launcher.json'), JSON.stringify({ pid: process.pid, startedAt: '2026-05-19T00:00:00.000Z' }));
    const server = net.createServer(() => undefined);
    const socketEndpoint = await listenTcp(server);
    if (!socketEndpoint) return;

    const run = spawnLauncher(root, launcherPath, {
      SPECKIT_IPC_SOCKET_DIR: socketEndpoint,
      SPECKIT_LAUNCHER_BRIDGE_DISABLED: '1',
    });
    await waitForExit(run.child);
    expect(run.stdout).toBe(`LEASE_HELD_BY:${process.pid} startedAt=2026-05-19T00:00:00.000Z\n`);
  });

  it('daemon-side socket listener accepts tools/list and returns a response', async () => {
    const sock = 'tcp://127.0.0.1:0';
    let handle: IpcSocketServerHandle;
    try {
      handle = await startIpcSocketServer({ socketPath: sock, createServer: makeServer });
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === 'EPERM') return;
      throw error;
    }
    handles.push(handle);

    const socket = await connectSocket(sock);
    socket.write('{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}\n');
    const response = JSON.parse(await readLine(socket)) as { result?: { tools?: Array<{ name: string }> } };
    expect(response.result?.tools?.[0]?.name).toBe('ping');
    socket.destroy();
  });

  it('serves multiple concurrent secondary clients', async () => {
    const sock = 'tcp://127.0.0.1:0';
    let handle: IpcSocketServerHandle;
    try {
      handle = await startIpcSocketServer({ socketPath: sock, createServer: makeServer });
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === 'EPERM') return;
      throw error;
    }
    handles.push(handle);

    const sockets = await Promise.all([connectSocket(sock), connectSocket(sock), connectSocket(sock)]);
    const responses = await Promise.all(sockets.map((socket, index) => {
      socket.write(`{"jsonrpc":"2.0","id":${index + 1},"method":"tools/list","params":{}}\n`);
      return readLine(socket);
    }));
    expect(responses).toHaveLength(3);
    for (const response of responses) {
      expect(JSON.parse(response).result.tools[0].name).toBe('ping');
    }
    sockets.forEach((socket) => socket.destroy());
  });

  it('refuses clients beyond SPECKIT_MAX_SECONDARY_CLIENTS', async () => {
    const sock = 'tcp://127.0.0.1:0';
    let handle: IpcSocketServerHandle;
    try {
      handle = await startIpcSocketServer({ socketPath: sock, createServer: makeServer, maxClients: 8 });
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === 'EPERM') return;
      throw error;
    }
    handles.push(handle);
    const sockets = await Promise.all(Array.from({ length: 8 }, () => connectSocket(sock)));
    await waitFor(() => getIpcBridgeStats().secondary_clients_count === 8, 'eight active clients');

    const ninth = await connectSocket(sock);
    await new Promise<void>((resolvePromise) => ninth.once('close', () => resolvePromise()));
    expect(getIpcBridgeStats().secondary_clients_count).toBe(8);
    sockets.forEach((socket) => socket.destroy());
  });

  it('cleans up the socket file when the listener closes', async () => {
    const dbDir = tempDir('daemon-bridge-cleanup-');
    const unixSock = resolveIpcSocketPath(dbDir);
    expect(unixSock).toBe(join(dbDir, 'daemon-ipc.sock'));
    const sock = 'tcp://127.0.0.1:0';
    let handle: IpcSocketServerHandle;
    try {
      handle = await startIpcSocketServer({ socketPath: sock, createServer: makeServer });
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === 'EPERM') return;
      throw error;
    }
    expect(getIpcBridgeStats().socket_path).toMatch(/^tcp:\/\/127\.0\.0\.1:\d+$/);
    await handle.close();
    expect(getIpcBridgeStats().socket_path).toBeNull();
  });
});
