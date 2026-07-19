// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Tool Exports
// ───────────────────────────────────────────────────────────────

import { handleTool } from './code-graph-tools.js';

export * from './code-graph-tools.js';

export async function dispatch(name: string, args: Record<string, unknown>) {
  const result = await handleTool(name, args);
  if (result) return result;
  console.error(`[mk-code-index] unknown tool dispatched: ${name}`);
  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify({ status: 'error', error: `Unknown mk-code-index tool: ${name}` }),
    }],
    isError: true,
  };
}
