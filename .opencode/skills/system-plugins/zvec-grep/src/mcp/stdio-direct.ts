import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import type { CreateZvecGrepOptions } from "../engine/service/types.js";
import type { ZvecGrepClientMode } from "../engine/config.js";
import { DirectBackend } from "./direct-backend.js";
import { createZvecGrepMcpServer } from "./tools.js";
import {
  MCP_TOOLSET_ENV,
  resolveMcpToolset,
  type McpToolset,
} from "./toolset.js";

export type StdioServerMode = "bridge" | "direct";

/**
 * Direct mode is opt-in for the stdio entry: only an explicit `--mode direct`
 * or `ZVEC_GREP_MODE=direct` selects it, so an existing installation keeps
 * bootstrapping the shared daemon.
 */
export function resolveStdioServerMode(
  explicitMode?: ZvecGrepClientMode,
  environmentMode = process.env.ZVEC_GREP_MODE,
): StdioServerMode {
  const mode = explicitMode ?? parseStdioServerMode(environmentMode);
  return mode === "direct" ? "direct" : "bridge";
}

function parseStdioServerMode(
  value: string | undefined,
): ZvecGrepClientMode | undefined {
  if (!value) return undefined;
  if (value === "direct" || value === "server" || value === "auto") {
    return value;
  }
  throw new Error("ZVEC_GREP_MODE must be direct, server, or auto");
}

/**
 * Serves the MCP tool contract over stdio from the current process.
 *
 * Unlike the bootstrap bridge this starts no daemon and proxies nothing: each
 * request runs against an in-process engine, so the process owns the Embedding
 * model and exits with the client.
 */
export async function runDirectStdioServer(options: {
  version: string;
  serviceOptions?: CreateZvecGrepOptions;
  mcpToolset?: McpToolset;
}): Promise<void> {
  const toolset = resolveMcpToolset(
    options.mcpToolset,
    process.env[MCP_TOOLSET_ENV],
  );
  const backend = new DirectBackend({
    serviceOptions: options.serviceOptions,
  });
  const server = createZvecGrepMcpServer(backend, options.version, {
    toolset,
    includeServerStatusTool: false,
  });

  let resolveClosed!: () => void;
  const closed = new Promise<void>((resolve) => {
    resolveClosed = resolve;
  });
  server.server.onclose = resolveClosed;
  server.server.onerror = (error) => console.error(error.message);

  try {
    await server.connect(new StdioServerTransport());
    await closed;
  } finally {
    await server.close().catch(() => undefined);
    await backend.close();
  }
}
