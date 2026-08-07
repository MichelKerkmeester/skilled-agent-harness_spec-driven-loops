# Deep Review Strategy - MCP Core

## Topic
MCP memory mutation, save, CRUD update/delete, bulk-delete, and embedding-reconcile write-path audit for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core`.

## Review Dimensions
| Dimension | Status | Result |
|---|---|---|
| correctness | complete | F001 and F002 active P1 findings |
| security | complete | No security findings |
| traceability | complete | F003 active P1 and F004 active P2 |
| maintainability | complete | No additional findings beyond coverage gaps tied to F001/F004 |

## Completed Dimensions
- [x] correctness: mutation cache freshness and reconcile predicate parity checked.
- [x] security: path validation, active-shard authority, strict tool schema validation, and guarded transactions checked.
- [x] traceability: spec, schema, install guide, README, and feature catalog checked.
- [x] maintainability: save sub-handler boundaries, response-builder hook wiring, and relevant regression coverage checked.

## Running Findings
| Severity | Active | Delta |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 3 | +3 |
| P2 | 1 | +1 |

## What Worked
- Direct source replay found that earlier delete-cache concerns are now mitigated by `delete_memory_from_database()`.
- Comparing dry-run SQL to apply SQL exposed the success-coverage reconcile drift.
- Cross-checking schema validation against operator docs distinguished stale docs from implementation behavior.

## What Failed
- Code Graph was unavailable, so review used direct `rg` and line-numbered source reads.
- No live MCP calls or tests were run because this fan-out lineage is read-only against reviewed files and writes are constrained to the artifact directory.

## Exhausted Approaches
- Delete-path entity-density stale-cache concern was ruled out for the single-delete helper because `delete_memory_from_database()` invalidates the cache after successful delete.
- Security issue search around caller-supplied vector shard paths was ruled out because apply attaches the active profile shard and fails closed when verification fails.

## Ruled-Out Directions
- `memory_save` missing entity-density invalidation: ruled out for the reviewed single-row path because it calls `invalidateEntityDensityCacheAfterSave()` after successful commit.
- `memory_bulk_delete` missing entity-density invalidation: ruled out because it calls `invalidateEntityDensityCacheAfterBulkDelete()` after delete commit and the integration test covers that behavior.

## Next Focus
Synthesis complete. Remediation should target F001, F002, and F003 before a PASS rerun; F004 can be bundled as API cleanup.

## Known Context
- `resource-map.md` not present. Skipping coverage gate.
- Prior probe reports identified similar reconcile and docs drift. This lineage re-read live source and narrowed stale entity-density cache impact to update paths.
- `executor: cli-codex model=gpt-5.5` was supplied as lineage metadata. The local `cli-codex` skill forbids Codex self-invocation, so this Codex runtime executed the lineage directly.

## Cross-Reference Status
| Protocol | Class | Status | Notes |
|---|---|---|---|
| spec_code | hard | partial | Scope was reviewed, but F001/F002 show implementation issues inside the requested write path. |
| checklist_evidence | hard | pass/skipped | No checklist exists in this Level 1 slice. |
| feature_catalog_code | advisory | partial | F003 records stale `dryRun:false` feature-catalog wording. |
| playbook_capability | advisory | partial | F003 records stale operator repair guidance in the install guide. |

## Files Under Review
| File | Coverage |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/` | sampled across atomic-index, create-record, response-builder, reconsolidation bridge, README |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` | supporting evidence |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | supporting traceability evidence |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | supporting traceability evidence |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | supporting traceability evidence |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | supporting traceability evidence |

## Review Boundaries
- Max iterations: 7.
- Completed iterations: 5.
- Severity threshold: P2.
- Reviewed files were not modified.
- Outputs were written only inside the requested lineage artifact directory.

## Non-Goals
- Implementing fixes.
- Running live MCP mutations against the memory database.
- Auditing retrieval/context/causal sibling slices outside this spec.

## Stop Conditions
- All four review dimensions covered.
- Core traceability protocols executed or explicitly marked not applicable.
- Stabilization pass found no new findings.
- No P0 findings remain.
- Final verdict is CONDITIONAL because P1 findings remain active.
