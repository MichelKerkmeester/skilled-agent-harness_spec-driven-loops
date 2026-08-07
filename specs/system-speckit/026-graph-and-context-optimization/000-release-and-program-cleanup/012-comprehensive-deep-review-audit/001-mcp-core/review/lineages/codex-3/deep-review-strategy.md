# Deep Review Strategy - codex-3

## Topic

MCP memory mutation, save, and embedding-reconcile write-path review for the `001-mcp-core` slice.

## Review Dimensions

| Dimension | Status | Iteration | Verdict |
|---|---|---:|---|
| Correctness | complete | 1 | CONDITIONAL |
| Security | complete | 2 | PASS |
| Traceability | complete | 3 | CONDITIONAL |
| Maintainability | complete | 4 | PASS |
| Stabilization | complete | 5 | PASS |

## Completed Dimensions

- Correctness: found F001 and F002.
- Security: no active findings.
- Traceability: found F003 and F004.
- Maintainability: no new findings beyond active API clarity advisory.
- Stabilization: replayed active findings and found no new P0/P1.

## Running Findings

| Severity | Active |
|---|---:|
| P0 | 0 |
| P1 | 3 |
| P2 | 1 |

## What Worked

- Direct source reads beat carrying calibration claims forward; delete-path cache invalidation had been fixed, so F001 was narrowed to update only.
- Comparing dry-run predicates to apply predicates exposed the reconcile preview/apply mismatch.
- Checking docs against `validateToolArgs()` made the `dryRun:false` drift concrete.

## What Failed

- Code Graph was unavailable; direct `rg` plus file reads were used.
- No live MCP calls were run because this lineage is a read-only review and writes are confined to the lineage artifact directory.

## Exhausted Approaches

- Re-reporting `memory_delete` entity-density staleness: ruled out by `delete_memory_from_database()` invalidation.
- Treating `activeOnly` as a P1: no evidence of unsafe behavior, only inert public API surface.

## Ruled-Out Directions

- SQL injection in reconcile table interpolation: dimension table is derived from numeric active embedder metadata and verified before use.
- Caller-supplied active shard path mutation: handler attaches active shard from runtime profile authority.

## Next Focus

Synthesis complete. Next external action is remediation planning for F001-F003, with F004 as an advisory cleanup.

## Known Context

- Target spec explicitly scopes memory mutation hooks, save pipeline, CRUD update/delete/bulk-delete, embedding reconcile, and entity-density cache.
- `resource-map.md` not present. Skipping coverage gate.
- Prior calibration reports found overlapping issues; this lineage independently re-read the source and narrowed stale delete-cache claims.

## Cross-Reference Status

| Protocol | Gate | Status | Finding Refs |
|---|---|---|---|
| `spec_code` | hard | partial | F001, F002 |
| `checklist_evidence` | hard | pass/skipped | none |
| `feature_catalog_code` | advisory | partial | F003 |
| `playbook_capability` | advisory | partial | F003 |

## Files Under Review

| File | Coverage |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/` | sampled/reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts` | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts` | reviewed |
| Supporting schemas/docs/tests | reviewed where needed for evidence |

## Review Boundaries

- Max iterations: 7.
- Completed iterations: 5.
- Writes confined to this lineage artifact directory.
- Reviewed files were read-only.

## Non-Goals

- No code fixes.
- No direct memory database mutation.
- No fan-out merge.

## Stop Conditions

- All configured dimensions covered.
- Stabilization pass found no new P0/P1.
- Active findings have file-line evidence and P1 claim adjudication packets.
