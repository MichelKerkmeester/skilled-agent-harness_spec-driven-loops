// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Apply                                                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// MCP tool handler for code_graph_apply.
import { applyCodeGraph, } from '../lib/apply-orchestrator.js';
function buildResponse(payload) {
    return {
        content: [{
                type: 'text',
                text: JSON.stringify(payload, null, 2),
            }],
    };
}
export async function handleCodeGraphApply(args) {
    try {
        const result = await applyCodeGraph(args);
        return buildResponse({
            status: result.status,
            result,
        });
    }
    catch (error) {
        return buildResponse({
            status: 'error',
            error: `code_graph_apply failed: ${error instanceof Error ? error.message : String(error)}`,
        });
    }
}
//# sourceMappingURL=apply.js.map