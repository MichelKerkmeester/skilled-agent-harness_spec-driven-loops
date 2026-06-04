# Iteration 4 — correctness — causal-unlink-wiring

**Verdict:** CONDITIONAL

Adversarial correctness review (gpt-5.5-fast high) of `memory_causal_unlink` exposure (commit deee30b319). Scope: consistent registration across all layers — `ToolDefinition` descriptor + `TOOL_DEFINITIONS` in `tool-schemas.ts`; `MEMORY_RUNTIME_TOOL_NAMES` in `context-server.ts`; import + `TOOL_NAMES` + dispatch case in `tools/causal-tools.ts`; input schema + required `edgeId` in `tool-input-schemas.ts`. The wiring is present across all layers; the single finding is a schema-contract tightness mismatch, not a missing layer.

## Findings

- **[P2]** Public ToolDefinition schema is looser than runtime validation for edgeId — `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` (line 463)
  - Evidence: Line 463: `inputSchema: { type: 'object', additionalProperties: false, properties: { edgeId: { type: 'number', description: 'ID of the causal edge to delete (from a memory_causal_link result or memory_drift_why allEdges[].id)' } }, required: ['edgeId'] },` while `tool-input-schemas.ts` lines 416-418 validate `edgeId: positiveInt`.
  - Recommendation: Align the ToolDefinition descriptor with runtime validation by adding a positive integer constraint, e.g. `minimum: 1` and integer semantics if supported, so clients see the same contract the server enforces.
