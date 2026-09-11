// ───────────────────────────────────────────────────────────────
// MODULE: IPC Socket Server (multi-client launcher bridge)
// ───────────────────────────────────────────────────────────────
// Thin re-export of the canonical bridge logic. The bind/reclaim/serve
// behaviour (including the race-safe stale-socket fence and the dir
// ownership/mode hardening) is shared across every daemon launcher so
// the security contract cannot drift between services. Per-service
// socket/db PATHS remain owned by each package's own resolution code.

export {
  canUnlinkExistingSocket,
  getIpcBridgeStats,
  parseMaxClients,
  resolveIpcSocketPath,
  startIpcSocketServer,
} from '@spec-kit/shared/ipc/socket-server.js';

export type {
  IpcBridgeStats,
  IpcSocketServerHandle,
  IpcSocketServerOptions,
} from '@spec-kit/shared/ipc/socket-server.js';
