// ───────────────────────────────────────────────────────────────
// MODULE: MCP Response Types And Argument Parser
// ───────────────────────────────────────────────────────────────

export type MCPResponse = {
  content: Array<{ type: 'text'; text: string }>;
};

export function parseArgs<T>(args: Record<string, unknown>): T {
  if (args == null || typeof args !== 'object') {
    return {} as T;
  }
  return args as unknown as T;
}
