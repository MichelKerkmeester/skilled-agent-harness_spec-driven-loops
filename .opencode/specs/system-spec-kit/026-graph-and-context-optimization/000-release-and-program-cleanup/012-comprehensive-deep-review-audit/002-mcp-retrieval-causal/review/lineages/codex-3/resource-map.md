# Resource Map

This lineage had no packet `resource-map.md` at init, so this artifact records the converged review deltas gathered by graphless fallback.

## Reviewed Surface

| Path | Coverage | Findings |
| --- | --- | --- |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | security, correctness support | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | correctness, security support | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts` | correctness, security support | F003 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | traceability, maintainability support | F004 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | maintainability, edge-integrity check | none |

## Supporting Evidence Paths

| Path | Used For |
| --- | --- |
| `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts` | trusted-session contract and session dedup behavior |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts` | arbitrary session-state creation and mutation |
| `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts` | trigger matching limit behavior |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | public MCP tool contracts |
| `.opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts` | causal tool dispatch validation |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts` | missing-session test gap |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts` | scoped trigger test gap |
| `.opencode/skills/system-spec-kit/mcp_server/tests/causal-stats-output.vitest.ts` | causal-stats backfill hint contract |

## Active Finding Map

| Finding | Severity | Primary File | Evidence Anchor |
| --- | --- | --- | --- |
| F001 | P1 | `memory-context.ts` | deterministic fallback session ID at lines 164-167 and 1128-1131 |
| F002 | P1 | `memory-search.ts` | raw `sessionId` use at lines 646-687, 1283-1334, and 1375-1391 |
| F003 | P1 | `memory-triggers.ts` | capped global trigger match before scoped filtering at lines 304-340 |
| F004 | P2 | `causal-graph.ts` / `tool-schemas.ts` | handler backfill args at lines 92-110 and schema rejection at lines 454-457 |
