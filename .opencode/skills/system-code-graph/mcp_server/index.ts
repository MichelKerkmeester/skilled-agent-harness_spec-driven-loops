#!/usr/bin/env node
/**
 * mk-code-index MCP server entry point.
 *
 * ## Environment Variables
 *
 * - `MK_CODE_INDEX_ROOT_DIR` — Workspace root directory used for the readiness
 *   marker path resolution. When set, this value replaces `process.cwd()`.
 *   Defaults to `process.cwd()` when the variable is absent or empty.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import * as codeGraphTools from './tools/index.js';
import { CODE_GRAPH_TOOL_SCHEMAS } from './tool-schemas.js';
import { writeCodeGraphReadinessMarker } from './lib/readiness-marker.js';
import { DATABASE_DIR } from './core/config.js';
import {
  resolveIpcSocketPath,
  startIpcSocketServer,
  type IpcSocketServerHandle,
} from './lib/ipc/socket-server.js';

process.on('uncaughtException', (err) => {
  console.error('[mk-code-index] uncaughtException:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('[mk-code-index] unhandledRejection:', reason);
  process.exit(1);
});

function createCodeIndexMcpServer(): Server {
  const codeIndexServer = new Server(
    { name: 'mk-code-index', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  codeIndexServer.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: CODE_GRAPH_TOOL_SCHEMAS,
  }));

  codeIndexServer.setRequestHandler(CallToolRequestSchema, async (request): Promise<any> => {
    const args = (request.params.arguments ?? {}) as Record<string, unknown>;
    return await codeGraphTools.dispatch(request.params.name, args);
  });

  return codeIndexServer;
}

let ipcBridge: IpcSocketServerHandle | null = null;

async function shutdownCodeIndex(reason: string): Promise<void> {
  console.error(`[mk-code-index] ${reason}`);
  if (ipcBridge) {
    await ipcBridge.close().catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[mk-code-index] ipc-bridge close error: ${message}`);
    });
    ipcBridge = null;
  }
}

process.once('SIGINT', () => {
  void shutdownCodeIndex('SIGINT').finally(() => process.exit(0));
});
process.once('SIGTERM', () => {
  void shutdownCodeIndex('SIGTERM').finally(() => process.exit(0));
});

const server = createCodeIndexMcpServer();

try {
  writeCodeGraphReadinessMarker(process.env.MK_CODE_INDEX_ROOT_DIR || process.cwd());
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[mk-code-index] readiness marker write failed: ${message}`);
}

const transport = new StdioServerTransport();
try {
  await server.connect(transport);
  ipcBridge = await startIpcSocketServer({
    socketPath: resolveIpcSocketPath(DATABASE_DIR),
    createServer: () => createCodeIndexMcpServer(),
    log: (message: string) => console.error(message),
  });
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  console.error('[mk-code-index] connect failed:', message);
  if (stack) console.error(stack);
  process.exit(1);
}
