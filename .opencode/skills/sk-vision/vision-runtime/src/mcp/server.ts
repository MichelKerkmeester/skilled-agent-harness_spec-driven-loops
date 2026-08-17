#!/usr/bin/env bun

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { ToolContext, ToolDefinition, ToolResult } from "@opencode-ai/plugin";
import { skVisionTools } from "../opencode/tools.js";
import { PhotonProvider } from "../providers/photon.js";
import { RuntimeClient } from "../runtime/client.js";

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

function resultText(result: ToolResult): string {
  return typeof result === "string" ? result : result.output;
}

/** Create the MCP server and register the shared sk-vision tool definitions. */
export function createSkVisionMcpServer(client: RuntimeClient): McpServer {
  const provider = new PhotonProvider(client, { projectDir: process.cwd() });
  const tools = skVisionTools(() => provider) as Record<string, ToolDefinition>;
  const server = new McpServer({ name: "sk-vision", version: "0.2.0" });
  const registrar = server as unknown as ToolRegistrar;

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

/** Run sk-vision as an MCP stdio server until the host closes the session. */
export async function runSkVisionMcpServer(): Promise<void> {
  const client = new RuntimeClient();
  const server = createSkVisionMcpServer(client);
  server.server.onclose = () => {
    void client.close();
  };
  await server.connect(new StdioServerTransport());
}

if (import.meta.main) {
  await runSkVisionMcpServer();
}
