# Deep Review Report

## Executive Summary

Verdict: CONDITIONAL

Scope: MCP core review slice for `mutation-hooks.ts` and `memory-embedding-reconcile.ts`.

Active findings: P0: 0, P1: 1, P2: 1.

The review reached signal convergence after five iterations: correctness, security, traceability, maintainability, and stabilization. Release readiness remains conditional because P1-COD2-001 affects the safety promise of `memory_embedding_reconcile` dry-run previews.

## Planning Trigger

Open a remediation packet for the active P1 before treating the reconcile tool as release-ready. The P2 doc drift can ride in the same packet or in a docs cleanup follow-up, but the P1 should lead because it can make dry-run under-report mutations.

## Active Finding Registry

| ID | Severity | Category | Evidence | Summary |
|---|---|---|---|---|
| P1-COD2-001 | P1 | correctness | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:63`; `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`; `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:409` | Dry-run success-coverage counts only missing rowids, while apply repairs rows missing rowids OR the active dimension vector. |
| P2-COD2-002 | P2 | traceability | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:19`; `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`; `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`; `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654` | Some public docs still advertise `dryRun: false` instead of the live `mode: "apply"` argument. |

## Remediation Workstreams

1. Reconcile dry-run/apply coverage parity.

   Update `computeSuccessCoverage()` to use the same missing-surface predicate as the apply repair path. Add a regression for a `success` row with `vec_memories_rowids` present and `active_vec.vec_<dim>` absent, then verify dry-run planned rows and apply changes agree.

2. Public documentation cleanup.

   Replace stale `dryRun: false` examples with `mode: "apply"` in install-guide and feature-catalog surfaces. Align feature-catalog result wording with `mode`, `buckets`, `plannedMutations`, and `applied`.

## Spec Seed

Add a remediation requirement: dry-run output for `memory_embedding_reconcile({ mode: "dry-run", repairSuccessCoverage: true })` must predict every row that `mode: "apply"` would repair for success-coverage gaps.

Acceptance criteria:

- A row with rowid present but missing active dimension vector is counted in dry-run success coverage.
- The same row is repaired in apply mode.
- Planned repair count matches apply mutation count for this scenario.

## Plan Seed

1. Patch `computeSuccessCoverage()` to use rowid OR active dimension vector absence.
2. Add a Vitest case for `success` rows missing only the active dimension vector.
3. Run targeted reconcile tests.
4. Update stale public docs from `dryRun: false` to `mode: "apply"`.
5. Re-run the targeted review or a focused single-pass review on the remediated files.

## Traceability Status

| Protocol | Status | Notes |
|---|---|---|
| spec_code | covered | Both target implementation files were read with line evidence. |
| checklist_evidence | N/A | Target packet is Level 1 and has no `checklist.md`. |
| feature_catalog_code | covered with advisory | P2-COD2-002 records feature-catalog drift. |
| playbook_capability | partial | Tests and docs were checked; no live MCP invocation was run. |

## Deferred Items

- No security findings were recorded.
- No mutation hook maintainability finding was recorded.
- Live MCP request validation was deferred because this fan-out lineage was a read-only source audit with writes confined to the artifact directory.

## Audit Appendix

Iterations:

| Run | Dimension | New P0 | New P1 | New P2 | Verdict |
|---:|---|---:|---:|---:|---|
| 1 | correctness | 0 | 1 | 0 | CONDITIONAL |
| 2 | security | 0 | 0 | 0 | PASS |
| 3 | traceability | 0 | 0 | 1 | PASS |
| 4 | maintainability | 0 | 0 | 0 | PASS |
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

Graph status: Code Graph unavailable; graphless fallback used direct source reads and `rg`.

Stop reason: converged.
