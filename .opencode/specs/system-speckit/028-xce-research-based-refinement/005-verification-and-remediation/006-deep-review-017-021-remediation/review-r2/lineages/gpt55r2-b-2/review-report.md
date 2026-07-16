# Deep Review Report - gpt55r2-b-2

## Executive Summary
- Overall verdict: CONDITIONAL
- hasAdvisories: false
- Active findings: P0=0, P1=1, P2=0
- Stop reason: maxIterationsReached
- Iterations: 1 / 1
- Review scope summary: memory store/index/lifecycle surfaces under `.opencode/skills/system-spec-kit/mcp_server/`, focused on delete/tombstone, active row selection, dedup, retention, job cancellation, transaction recovery, and causal cleanup.

## Planning Trigger
- `/speckit:plan` is required because one active P1 data-integrity finding remains.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "F001",
      "severity": "P1",
      "title": "Soft-deleted memory rows remain active to list/retrieval/dedup surfaces",
      "evidence": [
        ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:91-98",
        ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1834-1845",
        ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:127-135",
        ".opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:102-107",
        ".opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:269-279"
      ]
    }
  ],
  "remediationWorkstreams": [
    "Soft-delete active-surface filtering and replacement-save correctness"
  ],
  "specSeed": [
    "Define tombstoned memory rows as inactive for every user-facing active read, list, search, update, and dedup path."
  ],
  "planSeed": [
    "Remove tombstoned ids from active_memory_projection or ensure all active queries include deleted_at IS NULL.",
    "Update same-path and content-hash dedup to ignore deleted_at IS NOT NULL rows.",
    "Add regression coverage: save -> soft delete -> list/search/update/re-save same file."
  ],
  "findingClasses": [
    "data_integrity"
  ],
  "affectedSurfacesSeed": [
    "memory_delete",
    "memory_list",
    "memory_save dedup",
    "active_memory_projection",
    "vector-index active prepared statements"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry
| ID | Severity | Title | Dimension | File:Line | Disposition | Finding Class |
|---|---|---|---|---|---|---|
| F001 | P1 | Soft-deleted memory rows remain active to list/retrieval/dedup surfaces | correctness, security | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:91-98` | active | data_integrity |

### F001 Details
- Evidence: soft delete updates only `deleted_at`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:91-98]
- Evidence: active prepared statements count/get rows without `deleted_at IS NULL`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1834-1845]
- Evidence: `memory_list` builds queries directly over `memory_index` without excluding tombstones. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:127-135]
- Evidence: same-path dedup selects latest matching row without excluding tombstones and can return `unchanged`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:102-107] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:269-279]
- Impact: a successful soft delete can leave the row externally visible and can block a later replacement save until retention purge.
- Fix recommendation: make tombstone inactive at the projection and query layers, and add regression tests for delete/list/search/update/re-save.
- Scope proof: scope spec explicitly targets memory store/index/lifecycle code and write-path safety. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:7-14]

## Remediation Workstreams
| Workstream | Findings | Actions |
|---|---|---|
| Soft-delete active-surface filtering | F001 | Remove tombstoned rows from `active_memory_projection` at delete time or require `deleted_at IS NULL` in every active read. Update dedup and idempotency active-row checks to ignore tombstones. Add regression tests. |

## Spec Seed
- Tombstoned memory rows must be inactive immediately after `memory_delete`/`memory_bulk_delete` reports success.
- Replacement saves after tombstone must create or activate a live current row, not replay or return an unchanged result for a deleted row.
- Retention purge may physically remove tombstones later, but purge latency must not affect active read semantics.

## Plan Seed
- Inventory all active memory row selectors and classify as active-only, admin/all, or purge-only.
- Add `deleted_at IS NULL` or active projection removal to active-only selectors.
- Update same-path/content-hash dedup and idempotency replay validation to ignore tombstoned rows.
- Add tests for soft delete followed by `memory_list`, `memory_search` or active retrieval, `memory_update`, and same-content `memory_save`.

## Traceability Status
| Protocol | Level | Status | Evidence | Unresolved Drift |
|---|---|---|---|---|
| `spec_code` | core | partial | Scope claims memory store/index/lifecycle review; F001 is within that scope. | Full broad scope not exhausted in one iteration. |
| `checklist_evidence` | core | partial | No checklist found in scoped folder. | No checklist claims to validate. |
| `feature_catalog_code` | overlay | partial | Reviewed feature-catalog annotated files in delete/save/index lifecycle. | Full feature catalog not exhausted. |
| `playbook_capability` | overlay | notApplicable | No playbook artifact in scope. | None. |
- AC_COVERAGE: exempt; scope folder contains only `spec.md` and no checklist/implementation-summary lifecycle pair.

## Deferred Items
- Continue cancellation/post-processing review in `memory-index.ts` if another iteration is allowed.
- Continue causal lifecycle review beyond the edge cleanup paths spot-checked here.

## Search Ledger
- searchCoverage.graphCoverageMode: graphless_fallback
- requiredBugClasses: data_integrity, cancellation_lifecycle, transaction_boundary
- candidateCoverage.covered: soft_delete_visibility, save_dedup, job_cancel, pending_file_recovery
- searchDebt: none
- cleanSearchProof: `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:261-268`; `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:612-663`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:401-406`

## Audit Appendix
- Convergence summary: stopped by `maxIterationsReached` after one iteration, not by saturation.
- Coverage summary: 2 of 4 dimensions covered; traceability partial; maintainability not covered.
- Adversarial self-check: F001 retained as P1 because delete success semantics are violated while the tombstone remains active; not P0 because the tombstone flag is opt-in and purge can eventually remove rows.
- Sources reviewed: see `iterations/iteration-001.md` and `deep-review-state.jsonl`.
