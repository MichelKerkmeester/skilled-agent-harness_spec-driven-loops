// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Tool Exports
// ───────────────────────────────────────────────────────────────
import { handleTool } from './code-graph-tools.js';
export * from './code-graph-tools.js';
export async function dispatch(name, args) {
    const result = await handleTool(name, args);
    if (result)
        return result;
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({ status: 'error', error: `Unknown system_code_graph tool: ${name}` }),
            }],
        isError: true,
    };
}
//# sourceMappingURL=index.js.map