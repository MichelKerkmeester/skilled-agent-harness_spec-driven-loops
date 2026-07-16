# Iteration 002 - Traceability and Contract Pass

## Focus
Traceability across the target spec, public tool schemas, runtime validation schemas, handler behavior, and tests.

## Files Reviewed
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts`

## Cross-Reference Results
| Check | Result | Evidence |
|---|---|---|
| spec_code | pass | Target spec lines 49-56 name the retrieval and causal files; iterations 001-003 cover each named file. |
| checklist_evidence | skipped | Target packet is Level 1 and has no `checklist.md` at initialization. |
| feature_catalog_code | partial | `memory_match_triggers` public/runtime schemas allow `limit` up to 100, while handler behavior caps at 50. |
| playbook_capability | skipped | No playbook file is in scope for this review slice. |

## New Findings

### F003 - P2 Traceability - `memory_match_triggers` advertises limit 100 but silently caps results at 50

The public MCP contract says `memory_match_triggers.limit` can request up to 100 results at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:210`. The runtime schema mirrors that with `positiveIntMax(100)` at `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:206`. The handler then silently clamps the accepted value to 50 at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:248`, and response construction later slices to that clamped value at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:500`.

The existing handler test only proves a small caller limit is respected; it sets `requestedLimit = 2` at `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:252`, so it would not catch the 51-100 contract band.

Impact: callers that validate against the published schema can ask for 51-100 trigger matches and receive fewer results without an error or visible contract hint.

Fix: either lower the public and runtime max to 50, or let the handler honor 100. Add a boundary test for 50, 51, and 100.

Content hash: `ac48479c6c92955add76b68875865808d819612d168cd211b1916d3c3e44bc11`

## Repeated Findings
- F001 remains open; not re-adjudicated in this traceability pass.
- F002 remains open; not re-adjudicated in this traceability pass.

## Delta
New findings ratio: 0.33

Review verdict: PASS
