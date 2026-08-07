# Deep Review Strategy

## Topic
MCP memory mutation, save, and embedding reconcile core.

## Review Dimensions
- [x] correctness - covered in iterations 001, 004, and 005.
- [x] security - covered in iteration 002.
- [x] traceability - covered in iteration 003 and replayed in iteration 005.
- [x] maintainability - covered in iteration 004.

## Completed Dimensions
| Dimension | Iteration | Verdict | Notes |
|---|---:|---|---|
| correctness | 001 | CONDITIONAL | F001 and F002 found. |
| security | 002 | PASS | No input validation, path, or SQL injection finding found. |
| traceability | 003 | PASS with advisories | F004 and F005 found. |
| maintainability | 004 | CONDITIONAL | F003 found in atomic save ordering. |
| stabilization | 005 | PASS | No new findings; active P1s remain. |

## Running Findings
Active P0: 0
Active P1: 3
Active P2: 2

## What Worked
- Direct source reads beat relying on the calibration reports; one earlier delete-cache claim was narrowed because lower-level delete helpers now invalidate entity-density.
- Comparing dry-run predicates against apply predicates exposed the reconcile parity bug quickly.
- Reading the atomic save helper separately from `memory-save.ts` exposed the file-promotion failure path.

## What Failed
- Code Graph was unavailable, so graphless fallback used `rg` plus direct source reads.
- No live MCP calls or Vitest runs were executed; this fan-out lineage is a read-only source audit.

## Exhausted Approaches
- Delete-path entity-density stale-cache review: lower-level delete helpers invalidate the cache after row/edge deletion, so no delete-specific P1 was retained.
- SQL injection review of reconcile dimension table interpolation: the table name is derived after active-shard dimension verification, so no security finding was retained.

## Ruled Out Directions
- `memory_bulk_delete` cache invalidation as a blocker: it directly calls `invalidateEntityDensityCacheAfterBulkDelete()` on zero-row and successful delete paths.
- `memory_save` cache invalidation as a blocker: the save path invalidates after successful commit and after background enrichment.

## Next Focus
Converged. Route to remediation planning for F001, F002, and F003 before treating the slice as release-ready.

## Known Context
- Target packet is Level 1 and has no checklist.md.
- `resource-map.md` was not present at init; resource-map coverage gate was skipped.
- Calibration reports identified reconcile preview/apply drift and stale docs; this lineage rechecked those claims and broadened the audit to update/save atomicity.
- Requested executor was `cli-codex model=gpt-5.5`; nested Codex self-invocation was refused by the local cli-codex skill contract, so the current Codex runtime executed the lineage directly.

## Cross-Reference Status
| Protocol | Class | Status | Evidence |
|---|---|---|---|
| spec_code | core | partial | Scope covered; active P1s show implementation does not meet intended write-path safety. |
| checklist_evidence | core | pass/skipped | No checklist exists for this Level 1 target. |
| feature_catalog_code | overlay | partial | Feature catalog still describes `dryRun` and stale status behavior for reconcile. |
| playbook_capability | overlay | partial | Install guide troubleshooting uses unsupported reconcile apply call shape. |

## Files Under Review
| File | Coverage | Iterations |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` | reviewed | 001, 005 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | reviewed | 002, 004, 005 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts` | reviewed | 004, 005 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts` | reviewed | 004 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts` | sampled | 004 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts` | sampled | 004 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | sampled | 004 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts` | sampled | 001 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | reviewed | 001, 005 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | reviewed | 001, 002, 005 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | reviewed | 002, 005 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts` | reviewed | 001, 002, 003, 005 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts` | reviewed | 001, 002, 003, 005 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts` | reviewed | 001, 005 |

## Review Boundaries
- Max iterations: 7.
- Completed iterations: 5.
- Convergence threshold: 0.10.
- Write boundary: only this lineage artifact directory.
- Reviewed implementation files were read-only.

## Non-Goals
- No code fixes.
- No test execution or DB mutation.
- No writes outside the lineage artifact directory.

## Stop Conditions
- All four dimensions covered.
- Required traceability protocols covered or explicitly N/A.
- One stabilization pass found no new P0/P1.
- P1 findings have typed claim-adjudication packets.
