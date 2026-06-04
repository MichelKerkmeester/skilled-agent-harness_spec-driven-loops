# Deep Review Strategy

## Topic
MCP Session + Index + Schema/Entrypoint Review Slice

## Review Dimensions
- [x] D1 Correctness, Logic errors, wrong dispatch, broken lifecycle/index invariants
- [x] D2 Security, input validation, path traversal, trust boundaries, unsafe mutation
- [x] D3 Traceability, spec/code alignment, schema-to-handler parity, advertised option drift
- [x] D4 Maintainability, clarity, duplication, operational safety, follow-on change cost

## Non-Goals
- Do not modify reviewed implementation files.
- Do not review mutation/save path slice 001 or retrieval/causal path slice 002 except as call-site context.
- Do not write outside this lineage artifact directory.

## Stop Conditions
- Stop after all four configured dimensions and required traceability protocols have coverage, followed by one stabilization pass.
- Stop at seven iterations if convergence has not legally triggered.
- Stop immediately on unrecoverable state corruption.

## Completed Dimensions
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | Found governed-ingest metadata propagation drift in scan/async ingest paths. |
| D2 Security | CONDITIONAL | 2 | Confirmed F001 has tenant/session/retention impact but did not find path traversal or cross-session escalation. |
| D3 Traceability | CONDITIONAL | 3 | Confirmed public tool definitions, strict schemas, and handlers disagree around governed ingest fields. |
| D4 Maintainability | CONDITIONAL | 4 | Confirmed F001 is a boundary-contract problem: request types carry governance, queue/index contracts do not. |
| Stabilization | CONDITIONAL | 5 | No new findings after all dimensions; F001 persisted as the sole active P1. |

## Running Findings
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2; refined 1 P1

## What Worked
- Schema-to-handler propagation review exposed the governed-ingest drift quickly because it followed fields from Zod schema to handler to queue/index write path (iteration 1).
- Security calibration was effective by checking whether the drift touched actual retention/scope columns and whether independent path/session guards blocked escalation (iteration 2).
- Traceability pass separated registration/validation from propagation: dispatcher coverage exists, but the governed fields still diverge across public schemas, strict schemas, and async execution (iteration 3).
- Maintainability pass identified the durable repair shape: pass normalized governance metadata through the scan/index and async queue contracts instead of adding isolated call-site patches (iteration 4).
- Stabilization found no new evidence that would split or upgrade F001; synthesis can proceed with a conditional verdict (iteration 5).

## What Failed
- Dispatcher-only inspection was too shallow; the effective break appeared only after following queued async execution (iteration 1).

## Exhausted Approaches
- Dispatch coverage gap ruled out because the listed tools route through lifecycle/memory dispatchers (iteration 1).
- Embedder premature pointer flip ruled out because reindex stages writes before completion swap (iteration 1).
- Path traversal escalation via async ingest ruled out because paths are segment-checked, realpath/resolved, and constrained to allowed roots (iteration 2).
- Cross-session resume escalation ruled out for non-stdio transports because explicit mismatched session IDs are rejected (iteration 2).
- Missing dispatcher registration ruled out for the target lifecycle/memory tools because `tools/index.ts`, `lifecycle-tools.ts`, and `memory-tools.ts` route them through validation and handlers (iteration 3).
- Separate embedder/session-helper maintainability findings ruled out at the configured threshold; their handler surfaces are small or already routed through shared helpers (iteration 4).

## Ruled Out Directions
- None.

## Next Focus
- Dimension: synthesis
- Files: review-report, resource map, dashboard, registry, state
- Why: main loop converged with one active P1 and no P0.

## Known Context
- `resource-map.md` not present. Skipping coverage gate.
- Code Graph unavailable in startup context, so this lineage uses `rg` plus direct reads for discovery.
- The user bound `artifact_dir` directly to `review/lineages/codex-5`; no artifact-root resolver command was run.

## Cross-Reference Status
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | REQ-002 covered with one active P1 parity drift |
| `checklist_evidence` | core | blocked | 1 | No checklist.md exists in this Level 1 slice |
| `feature_catalog_code` | overlay | partial | 3 | Public tool definitions and strict schemas diverge for governed ingest fields |
| `playbook_capability` | overlay | partial | 3 | Entrypoint validation route exists; F001 blocks clean capability verdict |

## Files Under Review
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | D1, D3, D4 | 4 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | D3 | 3 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | D1, D3 | 3 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/README.md` | D3 | 3 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts` | D1, D2 | 2 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts` | D3, D4 | 4 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts` | D3, D4 | 4 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | D1, D2, D3, D4 | 4 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | D3, D4 | 4 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-alias.ts` | D3, D4 | 4 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts` | D1, D2, D3, D4 | 4 | 0 P0, 1 P1, 0 P2 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts` | D3, D4 | 4 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts` | D1, D2, D4 | 4 | 0 P0, 0 P1, 0 P2 | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts` | D3, D4 | 4 | 0 P0, 0 P1, 0 P2 | reviewed |

## Review Boundaries
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-codex-5-1780592962034-iuktuj, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-06-04T17:11:07Z
