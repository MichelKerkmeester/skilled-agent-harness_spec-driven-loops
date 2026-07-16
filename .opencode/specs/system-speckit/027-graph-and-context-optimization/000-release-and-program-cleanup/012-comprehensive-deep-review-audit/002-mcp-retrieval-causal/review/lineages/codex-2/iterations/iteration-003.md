# Iteration 003 - Causal and Maintainability Pass

## Focus
Causal graph read behavior, causal link processing, relation orientation, handler validation, and maintainability risks in supporting tests.

## Files Reviewed
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts`

## Evidence Checked
- `memory_drift_why` clamps `maxDepth` server-side at `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:478`, but the public dispatch path validates the same field before handler entry at `.opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts:34` using the bounded schema at `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:398`.
- Causal link extraction maps `blocks` to a reversed `enabled` edge at `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:67`. That behavior is covered by `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts:117`, which expects dependency-to-packet `enabled` output at lines 133-138.
- Causal edge insertions now gate `inserted` on a non-null row id and record null insertion as an error at `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:404`.
- Fuzzy reference resolution is last-resort and uses escaped LIKE parameters at `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:290`.

## New Findings
No new findings.

## Repeated Findings
- F001 remains open and release-blocking.
- F002 remains open.
- F003 remains open.

## Delta
New findings ratio: 0.00

Review verdict: PASS
