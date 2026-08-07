# Deep Review Strategy

## Topic
MCP Retrieval + Causal Review Slice

## Review Charter
Audit the MCP retrieval and causal read path for correctness, security, traceability, and maintainability drift. The reviewed implementation files are read-only.

Resource map coverage is skipped because the target packet has no `resource-map.md` at initialization.

## Review Dimensions
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

## Completed Dimensions
- correctness: iteration 001 found scoped retrieval correctness break in community fallback.
- security: iteration 001 found scoped retrieval leak and untrusted session-state usage.
- traceability: iteration 002 compared target spec, public schemas, runtime schemas, and tests.
- maintainability: iteration 003 covered causal read/link processing and supporting regression tests.

## Running Findings
P0: 1
P1: 1
P2: 1

## Files Under Review
| File | Status | Notes |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | reviewed | Primary semantic search handler |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | reviewed | Unified context assembly |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts` | reviewed | Trigger matching handler |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | reviewed | Causal query and graph operations |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | reviewed | Causal link extraction and edge insertion |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts` | reviewed | Supporting fallback path followed from memory search |
| `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts` | reviewed | Supporting session trust boundary |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | reviewed | Supporting fallback flag defaults |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | reviewed | Supporting result/content formatting |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | reviewed | Runtime input validation |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | reviewed | Public tool contract |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | reviewed | Supporting scoped candidate filtering |
| `.opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts` | reviewed | Causal tool validation dispatcher |
| `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts` | reviewed | Causal relation orientation regression |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts` | reviewed | Trigger handler coverage |

## Cross-Reference Status
| Protocol | Gate | Status | Evidence |
|---|---|---|---|
| spec_code | hard | pass | Target spec lines 49-56 list files reviewed in iterations 001-003 |
| checklist_evidence | hard | skipped | Level 1 target packet has no checklist at initialization |
| feature_catalog_code | advisory | partial | F003 records schema/runtime limit drift for `memory_match_triggers` |
| playbook_capability | advisory | skipped | No playbook file is in scope for this slice |

## Known Context
- Target packet contains only `spec.md`; `plan.md`, `tasks.md`, `checklist.md`, and `resource-map.md` are absent at initialization.
- Code Graph is unavailable in this session; review uses direct reads and `rg`.
- `cli-codex` self-invocation is prohibited in Codex runtime, so this fan-out lineage is executed in-process.

## What Worked
- Iteration 001: following fallback code outside the main pipeline exposed a scoped retrieval bypass.
- Iteration 001: comparing neighboring handler session validation exposed inconsistent trust handling.

## What Failed
- Code Graph unavailable; structural coverage must be reconstructed from direct reads.

## Exhausted Approaches
- Community fallback scope path reviewed enough to support F001.
- Session trust boundary reviewed enough to support F002.
- Trigger contract drift reviewed enough to support F003.
- Causal graph and causal link processing reviewed without additional active findings.

## Ruled-Out Directions
- Direct maxDepth handler hardening is not promoted yet because the public causal tool dispatcher validates `maxDepth`.
- `blocks` mapping to reversed `enabled` edges is not promoted because `graph-metadata-integration.vitest.ts` asserts that behavior.

## Next Focus
Synthesis complete. Active P0 keeps release readiness at release-blocking.

## Review Boundaries
- Artifact directory is bound directly to the fan-out override.
- All generated outputs stay inside this lineage directory.
- Reviewed implementation files are read-only.
- Maximum iterations: 7.
- Convergence threshold: 0.10.

## Non-Goals
- No fixes or edits to reviewed implementation files.
- No review of mutation/save path beyond supporting evidence needed for session or retrieval boundaries.
- No review of unrelated audit slices.

## Stop Conditions
- All four review dimensions and required traceability checks have evidence.
- New findings stabilized after iteration 002.
- Active P0 remains release-blocking in synthesis.
