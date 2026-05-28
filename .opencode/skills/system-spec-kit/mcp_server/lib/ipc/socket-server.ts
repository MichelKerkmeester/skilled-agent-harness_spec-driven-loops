// ───────────────────────────────────────────────────────────────
// MODULE: IPC Socket Server (multi-client launcher bridge)
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
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

interface IpcSocketServerOptions {
  readonly socketPath: string;
  readonly createServer: () => Server;
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

function resolveIpcSocketPath(dbDir: string): string {
  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR
    ? path.resolve(process.env.SPECKIT_IPC_SOCKET_DIR)
    : path.resolve(dbDir);
  return path.join(socketDir, SOCKET_FILE_NAME);
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
    fs.mkdirSync(path.dirname(socketPath), { recursive: true, mode: 0o700 });
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
    if (err.code === 'EADDRINUSE' && socketPath.startsWith('tcp://')) {
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
    } else if (err.code !== 'EADDRINUSE') {
      throw err;
    } else {
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
