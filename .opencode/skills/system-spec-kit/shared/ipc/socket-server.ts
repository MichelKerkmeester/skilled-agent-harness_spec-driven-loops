// ───────────────────────────────────────────────────────────────
// MODULE: IPC Socket Server (multi-client launcher bridge)
// ───────────────────────────────────────────────────────────────
// Canonical bridge logic shared by every daemon launcher (memory,
// code-index, skill-advisor). Each service supplies its own socket/db
// PATHS; only the bind/reclaim/serve LOGIC lives here so the security
// and race-safety contract stays identical across services.

import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const SOCKET_FILE_NAME = 'daemon-ipc.sock';
const DEFAULT_MAX_SECONDARY_CLIENTS = 8;
const TCP_EADDRINUSE_RETRY_DELAYS_MS = [100, 250, 500, 1000, 1500] as const;

interface IpcBridgeStats {
  socket_path: string | null;
  secondary_clients_count: number;
  total_secondary_messages_in: number;
  total_secondary_messages_out: number;
}

// Structural shape of the only MCP server capability this bridge uses. Typed structurally (a
// method, so its transport param is bivariant) rather than against a concrete `Server` import so
// every consuming package satisfies it with its own `@modelcontextprotocol/sdk` copy — the three
// daemons each install the SDK separately and its private members make the classes nominally
// distinct, which a concrete import would reject across package boundaries.
interface McpServerLike {
  connect(transport: StdioServerTransport): Promise<void>;
}

interface IpcSocketServerOptions {
  readonly socketPath: string;
  readonly createServer: () => McpServerLike;
  readonly maxClients?: number;
  readonly log?: (message: string) => void;
  readonly onActivity?: () => void;
}

interface IpcSocketServerHandle {
  readonly socketPath: string;
  readonly close: () => Promise<void>;
}

let activeServer: net.Server | null = null;
let activeSocketPath: string | null = null;
const activeSockets = new Set<net.Socket>();
const activeTransports = new Map<net.Socket, StdioServerTransport>();
let totalSecondaryMessagesIn = 0;
let totalSecondaryMessagesOut = 0;

function countJsonRpcFrames(chunk: unknown): number {
  const text = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk ?? '');
  const newlineCount = text.split('\n').length - 1;
  return Math.max(1, newlineCount);
}

function parseMaxClients(rawValue = process.env.SPECKIT_MAX_SECONDARY_CLIENTS): number {
  if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
    return DEFAULT_MAX_SECONDARY_CLIENTS;
  }
  const parsed = Number.parseInt(String(rawValue), 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_MAX_SECONDARY_CLIENTS;
  }
  return parsed;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Canonicalize a path via realpath, even when the leaf does not exist yet. realpath the nearest
// existing ancestor (so symlinked roots like macOS `/tmp` -> `/private/tmp` normalize) and
// re-append the missing tail. Without ancestor canonicalization, a socket dir that was cleared
// (e.g. `/tmp/<service>` after a reboot) stays literal `/tmp/...` and fails the allowed-root
// check below — which canonicalizes `/tmp` to `/private/tmp` — crashing the server.
function canonicalizePath(target: string): string {
  const resolved = path.resolve(target);
  const tail: string[] = [];
  let current = resolved;
  while (!fs.existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) {
      return resolved;
    }
    tail.unshift(path.basename(current));
    current = parent;
  }
  try {
    return path.join(fs.realpathSync.native(current), ...tail);
  } catch {
    return resolved;
  }
}

// Prefix-match containment: true iff `candidate` is `root` itself or a descendant of it.
// Both inputs MUST already be canonicalized. Inlined here so the shared bridge carries no
// cross-module dependency for a single containment call.
function isWithinRoot(root: string, candidate: string): boolean {
  if (candidate === root) {
    return true;
  }
  const prefix = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
  return candidate.startsWith(prefix);
}

// Allowed roots for the IPC socket directory: the workspace itself plus the system temp dirs.
// The macOS `sun_path` limit (104 chars) forces deep in-workspace socket paths into a short
// `/tmp` path, so a workspace-only constraint is incompatible with the documented config.
// `os.tmpdir()` is portable (Linux/CI; macOS resolves to `/var/folders/...`), and `/tmp` covers
// the project convention (`SPECKIT_IPC_SOCKET_DIR=/tmp/<service>`). The owner check in
// `canUnlinkExistingSocket` preserves the unlink-hardening intent.
function allowedSocketRoots(): string[] {
  const roots = new Set<string>();
  roots.add(canonicalizePath(process.cwd()));
  roots.add(canonicalizePath(os.tmpdir()));
  roots.add(canonicalizePath('/tmp'));
  return [...roots];
}

function isWithinAllowedSocketRoot(candidate: string): boolean {
  return allowedSocketRoots().some((root) => isWithinRoot(root, candidate));
}

function resolveIpcSocketPath(dbDir: string): string {
  const rawSocketDir = process.env.SPECKIT_IPC_SOCKET_DIR
    ? path.resolve(process.env.SPECKIT_IPC_SOCKET_DIR)
    : path.resolve(dbDir);
  const socketDir = canonicalizePath(rawSocketDir);
  if (!isWithinAllowedSocketRoot(socketDir)) {
    throw new Error(
      `IPC socket directory must stay within the workspace root or a system temp dir: ${socketDir}`,
    );
  }
  return path.join(socketDir, SOCKET_FILE_NAME);
}

// Only remove a stale socket at `socketPath` when it is provably ours: the parent dir resolves
// inside an allowed root, the path is an actual socket, and it is owned by the current uid.
// Guards against socket-hijack on shared hosts where an attacker plants a non-socket file or a
// socket they own at the bind path.
function canUnlinkExistingSocket(socketPath: string): boolean {
  let parent: string;
  try {
    parent = fs.realpathSync.native(path.dirname(socketPath));
  } catch (error: unknown) {
    // A racing peer can remove the socket directory between the EADDRINUSE failure and this
    // resolve; a vanished node is safe to reclaim, so never abort the bind on a missing path.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return true;
    }
    throw error;
  }
  if (!isWithinAllowedSocketRoot(parent)) {
    return false;
  }
  try {
    const stat = fs.lstatSync(socketPath);
    if (!stat.isSocket()) {
      return false;
    }
    if (typeof process.getuid === 'function' && stat.uid !== process.getuid()) {
      return false;
    }
    return true;
  } catch (error: unknown) {
    // Same race on the socket node itself: if it is already gone the prior EADDRINUSE was
    // transient, so treat the path as reclaimable instead of throwing and orphaning the bind.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return true;
    }
    throw error;
  }
}

function getIpcBridgeStats(): IpcBridgeStats {
  return {
    socket_path: activeSocketPath,
    secondary_clients_count: activeSockets.size,
    total_secondary_messages_in: totalSecondaryMessagesIn,
    total_secondary_messages_out: totalSecondaryMessagesOut,
  };
}

async function listenOnce(server: net.Server, socketPath: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const onError = (error: NodeJS.ErrnoException) => {
      server.off('listening', onListening);
      reject(error);
    };
    const onListening = () => {
      server.off('error', onError);
      resolve();
    };
    server.once('error', onError);
    server.once('listening', onListening);
    if (socketPath.startsWith('tcp://')) {
      const url = new URL(socketPath);
      server.listen(Number.parseInt(url.port, 10), url.hostname);
      return;
    }
    server.listen(socketPath);
  });
}

// TCP fallback (used when a unix socket path exceeds the sun_path limit) cannot be reclaimed by
// unlinking a node — a stale TCP port frees itself once the prior owner exits, so retry the bind a
// few times before giving up. Returns true once a retry binds, false if the port stays in use.
async function retryTcpListenAfterEaddrInUse(
  server: net.Server,
  socketPath: string,
  log: (message: string) => void,
): Promise<boolean> {
  for (const delayMs of TCP_EADDRINUSE_RETRY_DELAYS_MS) {
    log(`[ipc-bridge] tcp socket in use at ${socketPath}; retrying listen in ${delayMs}ms`);
    await sleep(delayMs);
    try {
      await listenOnce(server, socketPath);
      return true;
    } catch (error: unknown) {
      const err = error as NodeJS.ErrnoException;
      if (err.code !== 'EADDRINUSE') {
        throw err;
      }
    }
  }
  return false;
}

async function startIpcSocketServer(options: IpcSocketServerOptions): Promise<IpcSocketServerHandle> {
  const socketPath = options.socketPath.startsWith('tcp://')
    ? options.socketPath
    : path.resolve(options.socketPath);
  const log = options.log ?? ((message: string) => console.error(message));
  const maxClients = options.maxClients ?? parseMaxClients();
  const onActivity = options.onActivity ?? (() => undefined);
  if (!socketPath.startsWith('tcp://')) {
    const socketDir = path.dirname(socketPath);
    fs.mkdirSync(socketDir, { recursive: true, mode: 0o700 });
    // `mode: 0o700` only applies when mkdir CREATES the dir. A pre-existing socket dir
    // (e.g. an attacker-planted dir on a shared host) is not protected by the mkdir above,
    // so refuse to bind under a dir not owned by us or that is group/world-writable.
    try {
      const st = fs.statSync(socketDir);
      const uid = typeof process.getuid === 'function' ? process.getuid() : null;
      if (uid !== null && st.uid !== uid) {
        throw new Error(`IPC socket dir ${socketDir} not owned by current user (uid ${st.uid} != ${uid})`);
      }
      if ((st.mode & 0o022) !== 0) {
        throw new Error(`IPC socket dir ${socketDir} is group/world-writable (mode ${(st.mode & 0o777).toString(8)})`);
      }
    } catch (error: unknown) {
      const code = error && typeof error === 'object' && 'code' in error ? (error as NodeJS.ErrnoException).code : undefined;
      if (code !== 'ENOENT') throw error;
    }
  }

  const server = net.createServer((socket) => {
    if (activeSockets.size >= maxClients) {
      log(`[ipc-bridge] refusing secondary connection: max clients ${maxClients} reached`);
      socket.end();
      socket.destroy();
      return;
    }

    activeSockets.add(socket);
    onActivity();
    log('[ipc-bridge] secondary connected pid=?');

    const originalWrite = socket.write.bind(socket);
    socket.write = ((chunk: unknown, ...args: unknown[]) => {
      onActivity();
      totalSecondaryMessagesOut += countJsonRpcFrames(chunk);
      return originalWrite(chunk as string | Uint8Array, ...(args as [BufferEncoding?, (() => void)?]));
    }) as typeof socket.write;

    socket.on('data', (chunk) => {
      onActivity();
      totalSecondaryMessagesIn += countJsonRpcFrames(chunk);
    });

    const transport = new StdioServerTransport(socket, socket);
    activeTransports.set(socket, transport);
    const secondaryServer = options.createServer();
    secondaryServer.connect(transport).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      log(`[ipc-bridge] secondary connect error: ${message}`);
      socket.destroy();
    });

    socket.once('close', () => {
      activeSockets.delete(socket);
      activeTransports.delete(socket);
      void transport.close();
      log('[ipc-bridge] disconnect');
    });
    socket.once('error', (error) => {
      log(`[ipc-bridge] socket error: ${error.message}`);
    });
  });

  try {
    await listenOnce(server, socketPath);
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== 'EADDRINUSE') {
      throw err;
    }
    if (socketPath.startsWith('tcp://')) {
      // A TCP port in use cannot be reclaimed by unlinking; back off and retry a few times. If it
      // never frees, run without the secondary bridge rather than aborting the whole daemon.
      const listened = await retryTcpListenAfterEaddrInUse(server, socketPath, log);
      if (!listened) {
        log(`[ipc-bridge] tcp socket remained in use at ${socketPath}; secondary bridge disabled`);
        return {
          socketPath,
          close: async () => {
            for (const socket of activeSockets) {
              socket.destroy();
            }
            activeSockets.clear();
            activeTransports.clear();
          },
        };
      }
    } else {
      // Unix socket path: only reclaim a stale node that is provably ours (the fence). On a benign
      // concurrent-primary race the node may already be gone — canUnlinkExistingSocket treats ENOENT
      // as reclaimable, so we re-bind instead of aborting; a foreign-owned node still refuses.
      if (!canUnlinkExistingSocket(socketPath)) {
        throw err;
      }
      try {
        fs.unlinkSync(socketPath);
      } catch (unlinkError: unknown) {
        const unlinkErr = unlinkError as NodeJS.ErrnoException;
        if (unlinkErr.code !== 'ENOENT') {
          throw unlinkErr;
        }
      }
      await listenOnce(server, socketPath);
    }
  }

  const address = server.address();
  const listenedPath = typeof address === 'object' && address
    ? `tcp://${address.address}:${address.port}`
    : socketPath;
  if (!socketPath.startsWith('tcp://')) {
    fs.chmodSync(socketPath, 0o600);
  }
  activeServer = server;
  activeSocketPath = listenedPath;
  log(`[ipc-bridge] socket listening at ${listenedPath}`);

  return {
    socketPath: listenedPath,
    close: async () => {
      for (const socket of activeSockets) {
        socket.destroy();
      }
      activeSockets.clear();
      activeTransports.clear();
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
      if (activeServer === server) {
        activeServer = null;
        activeSocketPath = null;
      }
      if (!socketPath.startsWith('tcp://')) {
        try {
          fs.unlinkSync(socketPath);
        } catch (error: unknown) {
          const err = error as NodeJS.ErrnoException;
          if (err.code !== 'ENOENT') {
            throw err;
          }
        }
      }
    },
  };
}

export {
  canUnlinkExistingSocket,
  getIpcBridgeStats,
  parseMaxClients,
  resolveIpcSocketPath,
  startIpcSocketServer,
};

export type {
  IpcBridgeStats,
  IpcSocketServerHandle,
  IpcSocketServerOptions,
};
