#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import * as codeGraphTools from './tools/index.js';
import { CODE_GRAPH_TOOL_SCHEMAS } from './tool-schemas.js';
import { writeCodeGraphReadinessMarker } from './lib/readiness-marker.js';

const server = new Server(
  { name: 'mk-code-index', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: CODE_GRAPH_TOOL_SCHEMAS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request): Promise<any> => {
  const args = (request.params.arguments ?? {}) as Record<string, unknown>;
  return await codeGraphTools.dispatch(request.params.name, args);
});

try {
  writeCodeGraphReadinessMarker(process.cwd());
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[mk-code-index] readiness marker write failed: ${message}`);
}

const transport = new StdioServerTransport();
await server.connect(transport);
