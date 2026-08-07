# Deep Review Report - codex-3

## 1. Executive Summary

Verdict: CONDITIONAL.

The lineage completed five review iterations across correctness, security, traceability, maintainability, and stabilization. No P0 findings were found. Three active P1 findings remain, plus one P2 advisory. The review itself converged, but the slice should route to remediation before release PASS.

Active counts:

- P0: 0
- P1: 3
- P2: 1
- hasAdvisories: true

Scope covered:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts`

## 2. Planning Trigger

Route to remediation planning. The active P1s are behavior or operator-contract issues:

- F001 can leave graph-channel preservation routing stale after `memory_update`.
- F002 makes dry-run under-report apply mutations for success-coverage repair.
- F003 gives operators a repair command rejected by the live schema.

## 3. Active Finding Registry

### F001 - P1 - `memory_update` leaves entity-density cache stale after title or trigger phrase changes

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:92`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:306`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:4`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:97`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:9`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:619`
- `.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:112`

`memory_update` mutates title and trigger phrase fields consumed by entity-density routing, but neither the update path nor the shared post-mutation hook invalidates entity-density. Delete was checked and not included in this finding because the delete helper now invalidates entity-density after successful deletes.

### F002 - P1 - success-coverage dry-run undercounts rows missing only the active dimension vector

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:285`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:361`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:409`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:419`
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:83`

Dry-run coverage counts only success rows missing `vec_memories_rowids`, while apply repair mutates success rows missing either `vec_memories_rowids` or the active dimension-table vector. A row missing only the dimension vector is therefore omitted from planned dry-run counts but mutated by apply.

### F003 - P1 - operator docs use unsupported `dryRun:false` for `memory_embedding_reconcile`

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`
- `.opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts:99`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:76`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654`

The live tool contract uses `mode: "apply"` and validates args before dispatch. The install guide and feature catalog still instruct `dryRun: false`, so the documented degraded-health repair command is rejected.

### F004 - P2 - `activeOnly` is advertised but ignored by reconcile implementation

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:343`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:308`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:22`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299`

`activeOnly` is accepted and advertised, but reconcile implementation does not branch on it. Since the current behavior stays on the safer active-shard path, this is advisory API drift.

## 4. Remediation Workstreams

1. Shared mutation cache invalidation: add entity-density invalidation for `memory_update`, preferably through the shared post-mutation hook, and add update-path regression coverage.
2. Reconcile dry-run/apply parity: make `computeSuccessCoverage()` use the same rowid-or-dimension missing predicate as apply repair.
3. Public docs parity: replace `dryRun:false` examples for `memory_embedding_reconcile` with `mode:"apply"` in install guide and feature catalog.
4. API cleanup: remove/deprecate `activeOnly` or implement explicit semantics and tests.

## 5. Spec Seed

Add acceptance criteria:

- `memory_update` invalidates entity-density cache when title or trigger phrases change.
- `memory_embedding_reconcile({ mode: "dry-run", repairSuccessCoverage: true })` predicts every success-coverage row that `mode: "apply"` will repair.
- Operator docs and feature catalog examples use the live `mode` argument shape for reconcile apply.

## 6. Plan Seed

1. Patch `mutation-hooks.ts` and `MutationHookResult` so entity-density invalidation is part of the shared post-mutation contract, or patch `memory-crud-update.ts` directly if the shared hook scope is intentionally narrower.
2. Add an integration test proving `memory_update({ triggerPhrases })` updates entity-density routing without waiting for TTL.
3. Patch `computeSuccessCoverage()` to test both `vec_memories_rowids` and `active_vec.vec_<dim>`.
4. Update `vector-coverage-hygiene.vitest.ts` so rowid-present/dimension-missing success rows count in dry-run and repair in apply.
5. Update `INSTALL_GUIDE.md` and `feature_catalog.md` from `dryRun:false` to `mode:"apply"`.
6. Decide whether `activeOnly` remains in the public contract.

## 7. Traceability Status

| Protocol | Status | Notes |
|---|---|---|
| `spec_code` | partial | Scoped files were reviewed; F001 and F002 remain active implementation contract bugs. |
| `checklist_evidence` | pass/skipped | The Level 1 slice has no checklist. |
| `feature_catalog_code` | partial | F003 records stale feature-catalog wording for reconcile apply mode. |
| `playbook_capability` | partial | F003 records an unsupported troubleshooting command in the install guide. |

## 8. Deferred Items

- F004 is advisory unless maintainers intended `activeOnly:false` to widen reconcile beyond the active shard.
- Code Graph was unavailable; graphless fallback used direct source reads and `rg`.
- No live MCP mutation was run because the review target is read-only and lineage writes were confined to this artifact directory.
- `resource-map.md` was not present in the target spec at initialization; the resource-map coverage gate was skipped.

## 9. Audit Appendix

Iterations:

| Run | Dimension | New P0 | New P1 | New P2 | Verdict |
|---:|---|---:|---:|---:|---|
| 1 | correctness | 0 | 2 | 0 | CONDITIONAL |
| 2 | security | 0 | 0 | 0 | PASS |
| 3 | traceability | 0 | 1 | 1 | CONDITIONAL |
| 4 | maintainability | 0 | 0 | 0 | PASS |
| 5 | stabilization | 0 | 0 | 0 | PASS |

Replay:

- Last two new-findings ratios: 0.000, 0.000.
- Dimension coverage: 100%.
- Stabilization passes: 1.
- Active P0: 0.
- Active P1: 3.
- Active P2: 1.
- Stop reason: converged.
- Final verdict: CONDITIONAL.

Legal-stop gates:

- convergenceGate: pass
- dimensionCoverageGate: pass
- p0ResolutionGate: pass
- evidenceDensityGate: pass
- hotspotSaturationGate: pass
- claimAdjudicationGate: pass
- fixCompletenessReplayGate: pass
- candidateCoverageGate: pass
- graphlessFallbackGate: pass

Executor note: user requested `executor: cli-codex model=gpt-5.5`; this Codex runtime executed the spawned lineage directly and wrote the required lineage artifacts without nested CLI fan-out.
