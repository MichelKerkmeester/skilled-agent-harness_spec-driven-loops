# Iteration 1: 8-Tool Surface and Parity Classification

## Focus

Establish the authoritative `mk_code_index` tool surface and classify each tool for CLI parity.

## Findings

1. The runtime authority is `CODE_GRAPH_TOOL_SCHEMAS`, which registers exactly 8 tools: `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `code_graph_classify_query_intent`, `code_graph_verify`, `code_graph_apply`, and `detect_changes`. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:186]
2. The dispatcher handles the same 8 names, including `detect_changes`; older review claims that `detect_changes` was unregistered are stale against current code. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:21]
3. `code_graph_scan` is maintenance/state-mutating because it builds or refreshes the structural index and accepts scope, incremental, and verification controls. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:13]
4. `code_graph_query`, `code_graph_context`, and `detect_changes` are read-path tools but readiness-gated; a CLI must preserve their blocked/degraded response contract. [SOURCE: file:.opencode/skills/system-code-graph/references/runtime/tool_surface.md:37]
5. `code_graph_status` and `code_graph_classify_query_intent` are low-risk synchronous CLI commands: status is answerable without readiness preconditions and classify operates on text. [SOURCE: file:.opencode/skills/system-code-graph/references/runtime/tool_surface.md:50]

## Sources Consulted

- `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts`
- `.opencode/skills/system-code-graph/references/runtime/tool_surface.md`

## Assessment

`newInfoRatio`: 1.00. First pass; all findings were new to this lineage.

Confidence: high. Schema and dispatcher agree.

## Reflection

Worked: starting from runtime schema avoided stale doc drift.

Failed/ruled out: treating older `detect_changes` registration reviews as current evidence.

## Recommended Next Focus

Read-path readiness and false-safe behavior.
