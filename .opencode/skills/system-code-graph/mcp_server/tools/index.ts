// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Tool Exports
// ───────────────────────────────────────────────────────────────

import { handleTool } from './code-graph-tools.js';

export * from './code-graph-tools.js';

export async function dispatch(name: string, args: Record<string, unknown>) {
  const result = await handleTool(name, args);
  if (result) return result;
  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify({ status: 'error', error: `Unknown system_code_graph tool: ${name}` }),
    }],
    isError: true,
  };
}
