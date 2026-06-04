# Deep Review Report - codex-2 MCP Core Lineage

## 1. Executive Summary

Verdict: CONDITIONAL

Scope: MCP memory mutation, save, and embedding reconcile core. The lineage reviewed the scoped update/delete/bulk-delete/save/reconcile implementation files plus public reconcile contract surfaces.

Active findings:
- P0: 0
- P1: 3
- P2: 2
- hasAdvisories: true

The loop converged after five iterations across correctness, security, traceability, maintainability, and stabilization. Release readiness remains conditional because three active P1s affect mutation freshness, dry-run/apply parity, and atomic-save consistency.

Executor note: the requested executor was `cli-codex model=gpt-5.5`. The local `cli-codex` skill forbids nested Codex self-invocation, so this Codex runtime executed the lineage directly and recorded the guard in config/state.

## 2. Planning Trigger

Open remediation planning before treating this slice as release-ready. The active P1s are not cosmetic:

- F001 can keep graph-channel routing stale after `memory_update` changes entity-density terms.
- F002 can make reconcile dry-run under-report the rows apply will reset.
- F003 can commit memory-index rows before the canonical file promotion succeeds.

## 3. Active Finding Registry

| ID | Severity | Category | Evidence | Summary |
|---|---|---|---|---|
| F001 | P1 | correctness | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:489`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:619`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:153` | `memory_update` can change title or trigger phrases without invalidating the entity-density cache. |
| F002 | P1 | correctness | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`; `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:361`; `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:417` | Dry-run success coverage checks only missing rowids, while apply repairs missing rowids or missing active dimension rows. |
| F003 | P1 | correctness | `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360`; `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:362`; `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:378`; `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:394`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2534` | Atomic save indexes the DB before promoting the pending file and lacks a compensating DB cleanup if promotion fails. |
| F004 | P2 | traceability | `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`; `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955`; `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654`; `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:342` | Public docs still describe `dryRun: false` instead of live `mode: "apply"`. |
| F005 | P2 | traceability | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:343`; `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`; `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:43` | `activeOnly` is accepted and documented but not consumed by reconcile runtime logic. |

## 4. Remediation Workstreams

1. Entity-density invalidation for updates.

   Add entity-density invalidation to the update path, preferably through the shared mutation hook result contract so save/update/delete/bulk-delete/atomic-save report the same cache surface. Add a regression where an entity-dense title or trigger phrase change affects routing without waiting for the 60s TTL.

2. Reconcile dry-run/apply predicate parity.

   Make `computeSuccessCoverage()` use the same missing-surface predicate as apply repair. Add a rowid-present, dimension-row-missing success row test and assert dry-run planned rows match apply changes.

3. Atomic save promotion ordering or compensation.

   Either promote the pending file before committing index rows, or make `indexPrepared` return a compensating cleanup handle/transaction that removes created rows when promotion fails. Add a regression that forces `promotePendingFile` to throw after `indexPrepared` succeeds.

4. Public contract cleanup.

   Replace stale `dryRun: false` examples with `mode: "apply"`. Remove, deprecate, or implement `activeOnly`.

## 5. Spec Seed

Add acceptance criteria:

- `memory_update` invalidates entity-density cache when title or trigger phrases change.
- `memory_embedding_reconcile({ mode: "dry-run", repairSuccessCoverage: true })` predicts the same success-coverage rows that apply mode would reset.
- Atomic save cannot leave a committed memory row for content that was not promoted to its target file.
- Public reconcile docs use `mode: "apply"` and expose no inert options without explicit deprecation text.

## 6. Plan Seed

1. Patch update/shared mutation hooks for entity-density invalidation and feedback.
2. Add update cache invalidation tests.
3. Patch `computeSuccessCoverage()` to use rowid OR dimension-table absence.
4. Add reconcile dry-run/apply parity tests for dim-only missing rows.
5. Patch atomic save ordering or add compensating cleanup on promotion failure.
6. Add a promote-failure regression in `atomic-index-memory.vitest.ts`.
7. Update install guide and feature catalog reconcile command examples.
8. Decide `activeOnly` semantics and update schema/runtime accordingly.

## 7. Traceability Status

| Protocol | Status | Notes |
|---|---|---|
| spec_code | partial | Scope was covered, but active P1 implementation findings remain. |
| checklist_evidence | pass/skipped | Target packet is Level 1 and has no `checklist.md`. |
| feature_catalog_code | partial | Feature catalog reconcile entry is stale. |
| playbook_capability | partial | Install guide troubleshooting still uses unsupported `dryRun: false`. |

## 8. Deferred Items

- No P0 findings were found.
- No security finding was retained after source review.
- Code Graph was unavailable; graphless fallback used direct source reads and exact `rg` searches.
- No tests were run because this was a read-only fan-out lineage with writes confined to the artifact directory.
- F005 is advisory unless `activeOnly: false` was intended to have observable non-active-shard semantics.

## 9. Audit Appendix

Iterations:

| Run | Dimension | New P0 | New P1 | New P2 | Verdict |
|---:|---|---:|---:|---:|---|
| 1 | correctness | 0 | 2 | 0 | CONDITIONAL |
| 2 | security | 0 | 0 | 0 | PASS |
| 3 | traceability | 0 | 0 | 2 | PASS |
| 4 | maintainability | 0 | 1 | 0 | CONDITIONAL |
| 5 | stabilization | 0 | 0 | 0 | PASS |

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

Replay:

- Dimension coverage: 4/4.
- Required traceability: covered or explicitly N/A.
- Active P0: 0.
- Active P1: 3.
- Active P2: 2.
- Stop reason: converged.
- Final verdict: CONDITIONAL.
