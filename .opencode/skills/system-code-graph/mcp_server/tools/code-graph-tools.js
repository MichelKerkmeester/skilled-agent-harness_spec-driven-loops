// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for code graph MCP tools: scan, query, status, context, verify, apply, detect_changes.
import { handleCodeGraphScan, handleCodeGraphQuery, handleCodeGraphStatus, handleCodeGraphContext, handleCodeGraphVerify, handleCodeGraphApply, handleCccStatus, handleCccReindex, handleCccFeedback, handleDetectChanges,
// PHASE-002-IMPORT-SLOT: handleCodeGraphHldLld (027/002)
// PHASE-003-IMPORT-SLOT: handleCodeGraphTrace (027/003)
// PHASE-004-IMPORT-SLOT: handleCodeGraphImpactAnalysis (027/004)
 } from '../handlers/index.js';
import { parseArgs } from '../../../system-spec-kit/mcp_server/tools/types.js';
/** Tool names handled by this module */
export const TOOL_NAMES = new Set([
    'code_graph_scan',
    'code_graph_query',
    'code_graph_status',
    'code_graph_context',
    'code_graph_verify',
    'code_graph_apply',
    'detect_changes',
    'ccc_status',
    'ccc_reindex',
    'ccc_feedback',
    // PHASE-002-TOOLNAME-SLOT: 'code_graph_hld_lld' (027/002)
    // PHASE-003-TOOLNAME-SLOT: 'code_graph_trace' (027/003)
    // PHASE-004-TOOLNAME-SLOT: 'code_graph_impact_analysis' (027/004)
]);
/** Coerce handler response to MCPResponse (fix type literal narrowing) */
function toMCP(result) {
    return {
        content: result.content.map(c => ({ type: 'text', text: c.text })),
    };
}
function getMissingRequiredStringArgs(args, requiredKeys) {
    return requiredKeys.filter((key) => {
        const value = args[key];
        return typeof value !== 'string' || value.trim().length === 0;
    });
}
function validationError(tool, missingKeys) {
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({
                    status: 'error',
                    error: `Missing required field${missingKeys.length === 1 ? '' : 's'}: ${missingKeys.join(', ')}`,
                    tool,
                }),
            }],
    };
}
/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name, args) {
    switch (name) {
        case 'code_graph_scan':
            return toMCP(await handleCodeGraphScan(parseArgs(args)));
        case 'code_graph_query': {
            const missingKeys = getMissingRequiredStringArgs(args, ['operation', 'subject']);
            if (missingKeys.length > 0) {
                return validationError(name, missingKeys);
            }
            return toMCP(await handleCodeGraphQuery(parseArgs(args)));
        }
        case 'code_graph_status':
            parseArgs(args);
            return toMCP(await handleCodeGraphStatus());
        case 'code_graph_context':
            return toMCP(await handleCodeGraphContext(parseArgs(args)));
        case 'code_graph_verify':
            return toMCP(await handleCodeGraphVerify(parseArgs(args)));
        case 'code_graph_apply':
            return toMCP(await handleCodeGraphApply(parseArgs(args)));
        case 'detect_changes': {
            const missingKeys = getMissingRequiredStringArgs(args, ['diff']);
            if (missingKeys.length > 0) {
                return validationError(name, missingKeys);
            }
            return toMCP(await handleDetectChanges(parseArgs(args)));
        }
        case 'ccc_status':
            parseArgs(args);
            return toMCP(await handleCccStatus());
        case 'ccc_reindex':
            return toMCP(await handleCccReindex(parseArgs(args)));
        case 'ccc_feedback': {
            const missingKeys = getMissingRequiredStringArgs(args, ['query', 'rating']);
            if (missingKeys.length > 0) {
                return validationError(name, missingKeys);
            }
            return toMCP(await handleCccFeedback(parseArgs(args)));
        }
        // PHASE-002-DISPATCH-SLOT: case 'code_graph_hld_lld' (027/002)
        // PHASE-003-DISPATCH-SLOT: case 'code_graph_trace' (027/003)
        // PHASE-004-DISPATCH-SLOT: case 'code_graph_impact_analysis' (027/004)
        default:
            return null;
    }
}
//# sourceMappingURL=code-graph-tools.js.map