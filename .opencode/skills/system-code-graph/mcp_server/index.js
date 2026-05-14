#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import * as codeGraphTools from './tools/index.js';
import { CODE_GRAPH_TOOL_SCHEMAS } from './tool-schemas.js';
const server = new Server({ name: 'system_code_graph', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: CODE_GRAPH_TOOL_SCHEMAS,
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const args = (request.params.arguments ?? {});
    return await codeGraphTools.dispatch(request.params.name, args);
});
const transport = new StdioServerTransport();
await server.connect(transport);
//# sourceMappingURL=index.js.map