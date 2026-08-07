# Iteration 005 - Traceability And Tool Surface

## Scope
Focused pass over code-graph and skill-advisor MCP tool IDs, plus graceful degradation when graph tools are unavailable.

## Findings

No new P0/P1/P2 findings.

## Evidence Checked
- Code-graph publishes 8 stable tools in `CODE_GRAPH_TOOL_SCHEMAS`, including `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `code_graph_classify_query_intent`, `code_graph_verify`, `code_graph_apply`, and `detect_changes` [SOURCE: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:186].
- code-graph server dispatches through live tool schemas and `codeGraphTools.dispatch` [SOURCE: .opencode/skills/system-code-graph/mcp_server/index.ts:80].
- skill-advisor exports the 4 advisor descriptors plus skill graph definitions through `TOOL_DEFINITIONS` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tools/index.ts:37].
- skill graph descriptors include `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`, and `skill_graph_propagate_enhances` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts:85].
- code_graph_context blocks non-fresh or errored readiness and returns a recovery payload rather than graph answers [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/context.ts:200].
- detect_changes blocks on non-fresh readiness or verification failure [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:104].

## Traceability Result
Tool ID contracts look coherent. The open release-blocking and conditional findings are concentrated in deep-review/deep-loop-runtime fan-out execution, not MCP tool registration.

Review verdict: PASS
