# Deep Review Strategy

## Topic

MCP core review slice covering memory mutation hooks, `memory_save`, CRUD update/delete/bulk-delete, and `memory_embedding_reconcile`.

## Review Dimensions

| Dimension | Status | Iteration | Verdict |
|---|---|---:|---|
| Correctness | complete | 1 | CONDITIONAL |
| Security | complete | 2 | PASS |
| Traceability | complete | 3 | CONDITIONAL |
| Maintainability | complete | 4 | PASS |
| Stabilization | complete | 5 | PASS |

## Completed Dimensions

Correctness found two active P1s: entity-density cache invalidation misses update/delete, and reconcile dry-run/apply success-coverage predicates diverge.

Security found no P0/P1. Dynamic SQL was bounded by validated enum/table names or prepared parameters, mutation handlers use transaction wrappers, delete paths require confirmation, and `memory_save` validates path/scope/governance before indexing.

Traceability found one active P1 and one P2: public reconcile docs still use `dryRun:false`, and `activeOnly` is accepted but ignored.

Maintainability found no new standalone finding. Test gaps are attached to F001/F002/F003 remediation rather than split into duplicate advisories.

## Running Findings

| ID | Severity | Status | Summary |
|---|---|---|---|
| F001 | P1 | active | `memory_update` and `memory_delete` leave entity-density cache stale until TTL expiry. |
| F002 | P1 | active | `memory_embedding_reconcile` dry-run undercounts success-coverage rows that apply will mutate. |
| F003 | P1 | active | Operator docs still instruct `dryRun:false` for `memory_embedding_reconcile`, but the live schema exposes `mode:"apply"`. |
| F004 | P2 | active | `activeOnly` is accepted and advertised but not read by the reconcile implementation. |

## What Worked

- Re-reading the exact mutation hook result contract separated the real update/delete cache gap from the already-fixed save and bulk-delete paths.
- Comparing dry-run planned mutation construction to apply SQL exposed a rowid-only vs rowid-or-dimension predicate mismatch.
- Public schema, Zod schema, allowed-field list, handler mode selection, install guide, and feature catalog cross-checks gave a clear traceability verdict.

## What Failed

- Code Graph was unavailable, so structural discovery used direct `rg` and file reads.
- Live MCP invocation and test execution were deferred to avoid writes outside the lineage artifact directory.

## Exhausted Approaches

- No additional security finding was supported after checking path validation, schema validation, active-shard verification, and transaction boundaries.
- No separate maintainability finding was split from the active P1s because each test/documentation gap is remediation evidence for an existing defect.

## Ruled-Out Directions

- Bulk delete stale entity-density cache was ruled out: the handler imports and calls `invalidateEntityDensityCache()` after commit.
- Save stale entity-density cache was ruled out for the main and background enrichment paths: both call the save invalidation helper.
- Active-shard SQL injection was ruled out: the dimension table is derived from a validated numeric active dim and checked with `hasTable()` before interpolation.

## Next Focus

Synthesis complete. Next remediation should address F001, F002, and F003 before a PASS verdict is possible.

## Known Context

The target spec folder has no `resource-map.md`, `plan.md`, `tasks.md`, or `checklist.md`. The available seed artifacts are `spec.md`, `probe-report.md`, and `probe-report-codex2.md`. The two probe reports disagreed on finding counts and scope, so this lineage re-read the implementation rather than inheriting either report as source of truth.

`resource-map.md not present. Skipping coverage gate`

## Cross-Reference Status

| Protocol | Level | Status | Notes |
|---|---|---|---|
| spec_code | core | partial | Scope was reviewed, but active implementation defects remain. |
| checklist_evidence | core | pass/skipped | Level 1 slice has no `checklist.md`; no checked completion claims were present. |
| feature_catalog_code | overlay | partial | Feature catalog still documents `dryRun:false` for reconcile. |
| playbook_capability | overlay | partial | Install guide troubleshooting gives an unsupported reconcile apply call shape. |

## Files Under Review

| File | Coverage | Notes |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` | reviewed | F001 evidence |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | reviewed | Save invalidates entity-density on commit and background enrichment |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/` | sampled in depth | Atomic save, create-record, dedup, post-insert, response-builder, reconsolidation bridge checked |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | reviewed | F001 evidence |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | reviewed | F001 evidence |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | reviewed | Direct cache invalidation present |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts` | reviewed | F003 evidence |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts` | reviewed | F002 and F004 evidence |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts` | reviewed | F001 evidence |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | reviewed | F003 and F004 evidence |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | reviewed | F003 and F004 evidence |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | reviewed | F003 evidence |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | reviewed | F003 evidence |

## Review Boundaries

- Max iterations: 7
- Actual iterations: 5
- Convergence threshold: 0.10
- Severity threshold: P2
- Writes confined to this lineage artifact directory.
- Reviewed implementation files were read-only.

## Non-Goals

- No implementation fixes.
- No edits to spec docs outside the lineage artifact directory.
- No live MCP calls or test runs that could write outside the artifact directory.

## Stop Conditions

Stopped after all four configured dimensions plus one stabilization pass were complete, no new findings appeared in the stabilization pass, legal-stop gates passed, and the remaining verdict was stable at CONDITIONAL because active P1 findings remain.
