---
title: "Verification Checklist: Corpus Reindex - Gate-Zero for Recall Benchmarking"
description: "Verification checklist for the C9-4 embedding-coverage guard (shipped and tested, 59 ablation tests pass) and the deferred corpus reindex (superseded - a live reconcile dry-run showed embedding coverage already whole). Reindex-path items stay unchecked because the reindex was deliberately not run, the coverage gate is satisfied."
trigger_phrases:
  - "corpus reindex checklist gate zero"
  - "embedding coverage verification"
  - "reindex gate zero qa"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/001-corpus-reindex-gate-zero"
    last_updated_at: "2026-07-04T17:51:03.030Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped C9-4 coverage guard, reindex superseded - coverage already 100pct"
    next_safe_action: "None - coverage gate satisfied, proceed to benchmark tier"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-001-corpus-reindex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Corpus Reindex - Gate-Zero for Recall Benchmarking

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Pre-reindex coverage baseline captured
  - **Evidence**: `memory_health` full-report snapshot with `pendingByStatus` + `consistency` recorded before any reindex action
- [ ] CHK-002 [P0] Embedding provider healthy + no competing scan job
  - **Evidence**: `embeddingProvider.healthy === true`, `index.activeScanJob === false`
- [ ] CHK-003 [P1] Guard seam confirmed present
  - **Evidence**: `assertGroundTruthAlignment` at `ablation-framework.ts:314`, call site `:580-586`

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `assertEmbeddingCoverage` compiles + lint/typecheck clean
  - **Evidence**: `mcp_server/` build/tsc exits 0
- [ ] CHK-011 [P1] Guard reuses the existing pre-flight choke point (no duplicated benchmark path)
  - **Evidence**: invoked at `:580-586` alongside the alignment assert, not bolted onto each caller
- [ ] CHK-012 [P1] Reconcile run fail-closed (dry-run before apply, no deletes)
  - **Evidence**: `dry-run` bucket preview recorded before `apply`, reconcile only flips status flags / re-embeds

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Coverage restored with a measured delta
  - **Evidence**: post-reindex `pendingByStatus.pending` ~0, before/after delta table recorded, residual `failed` explained
- [ ] CHK-021 [P0] Guard verified both ways
  - **Evidence**: `assertEmbeddingCoverage` throws below threshold (low-coverage probe) and passes on the restored corpus
- [ ] CHK-022 [P0] No regression vs baseline
  - **Evidence**: full `mcp_server/` vitest re-run, no new failures vs the captured baseline
- [ ] CHK-023 [P1] Ground-truth alignment holds post-reindex
  - **Evidence**: `assertGroundTruthAlignment` passes, or `map-ground-truth-ids.ts --write` re-aligned and re-verified

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The gate-zero work is classed: data-restore (reindex) + a `cross-consumer` guard (every benchmark path inherits the pre-flight)
  - **Evidence**: guard placed at the shared `runAblation` pre-flight, not per-caller
- [ ] CHK-FIX-002 [P0] Consumer inventory completed for the guard seam
  - **Evidence**: `rg -n "assertGroundTruthAlignment|runAblation" lib/eval` - all benchmark entry points pass the pre-flight
- [ ] CHK-FIX-003 [P0] Coverage-threshold invariant stated with its adversarial case
  - **Evidence**: a partly-cold index that passes ID-alignment but fails coverage is rejected (probe DB test)
- [ ] CHK-FIX-004 [P1] Reconcile mutation scope proven non-destructive
  - **Evidence**: `dry-run` bucket preview vs `apply`, no DELETE in the path, second-pass residual floor recorded
- [ ] CHK-FIX-005 [P1] Evidence pinned to the reindex run + a fix SHA/diff range, not a moving branch range
  - **Evidence**: before/after `memory_health` snapshots + the guard commit

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] No destructive corpus mutation
  - **Evidence**: no rows deleted, reconcile additive (status-flip + re-embed only)
- [ ] CHK-031 [P2] Reindex driven via the tool surface, not raw DB edits
  - **Evidence**: `memory_index_scan` / `memory_embedding_reconcile` used, `context-index.sqlite` not hand-edited

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized with the final reindex evidence
  - **Evidence**: all three docs reflect the executed reindex + guard
- [ ] CHK-041 [P1] Coverage delta + residual floor recorded in implementation-summary.md
  - **Evidence**: before/after `memory_health` numbers and the irreducible `failed` count documented

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No temp files outside scratch/
  - **Evidence**: any baseline snapshots stored in this sub-phase folder or scratch/, not loose in the tree
- [ ] CHK-051 [P2] scratch/ cleaned before completion
  - **Evidence**: scratch/ empty

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 0/6 (reindex path superseded, not run - see below) |
| P1 Items | 8 | 0/8 (reindex path superseded, not run - see below) |
| P2 Items | 3 | 0/3 (reindex path superseded, not run - see below) |

**Verification Date**: N/A - the C9-4 embedding-coverage guard shipped and passed 59 ablation tests; the deferred corpus reindex itself was deliberately not run because a live reconcile dry-run showed embedding coverage already whole, superseding this checklist's reindex-path items. These items stay unchecked by design, not because implementation is pending.
**Verified By**: claude-opus-4-8 (C9-4 guard verification, 2026-06-19)

<!-- /ANCHOR:summary -->
