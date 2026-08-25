#!/usr/bin/env bun

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: sk-vision MCP Server (host adapter for MCP-only hosts)         ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Expose the 13 sk_vision_* tools over MCP stdio for Cursor and    ║
// ║          Devin, which have no in-process plugin API. Reuses the same      ║
// ║          shared tool definitions the OpenCode/Pi adapters use; kept in    ║
// ║          the runtime package because it needs the MCP SDK dependency.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// MODULE: sk-vision MCP Server

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { ToolContext, ToolDefinition, ToolResult } from "@opencode-ai/plugin";
import { skVisionTools } from "../opencode/tools.js";
import { PhotonProvider } from "../providers/photon.js";
import { RuntimeClient } from "../runtime/client.js";

// ─────────────────────────────────────────────────────────────────────────────
// 2. TYPES + HELPERS
// ─────────────────────────────────────────────────────────────────────────────

type McpToolResult = {
  content: Array<{ type: "text"; text: string }>;
};

type ToolRegistrar = {
  registerTool(
    name: string,
    config: {
      description: string;
      inputSchema: ToolDefinition["args"];
    },
    handler: (args: Record<string, unknown>) => Promise<McpToolResult>,
  ): void;
};

/**
 * Build the minimal tool context the shared tool definitions expect. MCP has no
 * per-message session, so the identity fields are constant stubs and the
 * interactive `ask`/`metadata` hooks are no-ops — MCP tools run non-interactively.
 *
 * @returns A context scoped to the current working directory.
 */
function toolContext(): ToolContext {
  return {
    sessionID: "mcp",
    messageID: "mcp",
    agent: "mcp",
    directory: process.cwd(),
    worktree: process.cwd(),
    abort: new AbortController().signal,
    metadata: () => {},
    ask: async () => {},
  };
}

/**
 * Flatten a tool result to text. The shared definitions return either a bare
 * string or an object with an `output` field; MCP only carries text content.
 *
 * @param result - The tool's return value.
 * @returns The text payload.
 */
function resultText(result: ToolResult): string {
  return typeof result === "string" ? result : result.output;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SERVER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the MCP server and register the shared sk-vision tool definitions.
 * Reusing the same definitions the in-process adapters use keeps the 13 tools
 * and their schemas identical across every host.
 *
 * @param client - The runtime client the tools call through.
 * @returns The configured (not yet connected) MCP server.
 */
export function createSkVisionMcpServer(client: RuntimeClient): McpServer {
  const provider = new PhotonProvider(client, { projectDir: process.cwd() });
  const tools = skVisionTools(() => provider) as Record<string, ToolDefinition>;
  const server = new McpServer({ name: "sk-vision", version: "0.2.0" });
  const registrar = server as unknown as ToolRegistrar;

  // Bridge each shared definition to an MCP tool: reuse its description and
  // input schema, and wrap its execute() output as MCP text content.
  for (const [name, definition] of Object.entries(tools)) {
    registrar.registerTool(
      name,
      {
        description: definition.description,
        inputSchema: definition.args,
      },
      async (args) => ({
        content: [
          {
            type: "text",
            text: resultText(await definition.execute(args, toolContext())),
          },
        ],
      }),
    );
  }

  return server;
}

/**
 * Install every self-termination guard a stdio MCP child needs so it never
 * outlives its host. A SIGKILLed host delivers no signal and no clean EOF, so
 * the only universal orphan signal is being reparented to init (ppid 1); the
 * other paths (transport close, stdin end/close, SIGTERM/SIGINT/SIGHUP) cover
 * graceful teardown. Every path runs the same idempotent shutdown: close the
 * runtime client (which reaps the python child) then exit.
 *
 * `exit` and `getParentPid` are injectable so the guards are unit-testable
 * without terminating the test runner.
 */
export function installMcpLifecycleGuards(opts: {
  server: McpServer;
  client: RuntimeClient;
  exit?: (code: number) => void;
  getParentPid?: () => number;
  watchIntervalMs?: number;
}): { dispose: () => void } {
  const exit = opts.exit ?? ((code: number) => process.exit(code));
  const getParentPid = opts.getParentPid ?? (() => process.ppid);
  let closing = false;
  const shutdown = (code = 0): void => {
    if (closing) return;
    closing = true;
    void opts.client.close().finally(() => exit(code));
  };
  opts.server.server.onclose = () => shutdown();
  process.stdin.on("end", () => shutdown());
  process.stdin.on("close", () => shutdown());
  for (const signal of ["SIGTERM", "SIGINT", "SIGHUP"] as const) {
    process.on(signal, () => shutdown());
  }
  const orphanWatch = setInterval(() => {
    if (getParentPid() === 1) shutdown();
  }, opts.watchIntervalMs ?? 5_000);
  // Never let the watchdog timer itself keep the event loop alive.
  orphanWatch.unref();
  return { dispose: () => clearInterval(orphanWatch) };
}

/** Run sk-vision as an MCP stdio server until the host closes the session. */
export async function runSkVisionMcpServer(): Promise<void> {
  const client = new RuntimeClient();
  const server = createSkVisionMcpServer(client);
  installMcpLifecycleGuards({ server, client });
  await server.connect(new StdioServerTransport());
}

if (import.meta.main) {
  await runSkVisionMcpServer();
}
