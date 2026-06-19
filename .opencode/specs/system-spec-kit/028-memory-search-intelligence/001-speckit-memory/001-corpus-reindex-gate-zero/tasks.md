---
title: "Tasks: Corpus Reindex — Gate-Zero for Recall Benchmarking"
description: "Breakdown for running the deferred corpus reindex and wiring the C9-4 embedding-coverage guard. Candidate is PENDING (not in 030 section 14) — all tasks open."
trigger_phrases:
  - "corpus reindex tasks gate zero"
  - "embedding coverage guard tasks"
  - "reindex reconcile breakdown"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/001-corpus-reindex-gate-zero"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author reindex gate-zero task breakdown"
    next_safe_action: "Start T001 — capture pre-reindex memory_health baseline"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-001-corpus-reindex"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Corpus Reindex — Gate-Zero for Recall Benchmarking

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

> **Candidate status:** `corpus-reindex-gate-zero` is **PENDING** — gate = needs-reindex-run (it IS the reindex). It is NOT in `030-memory-search-intelligence-impl/spec.md` §14 (that table covers candidates 1-13; none is the reindex). The Wave-0 030 fixes did not require a whole corpus, so gate-zero was deferred there and is owned here. No tasks are pre-checked.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Baseline] [15m]

- [ ] T001 Capture pre-reindex `memory_health` full report; record `pendingByStatus` (failed/partial/pending), `consistency` counts, `index.summary` [10m]
- [ ] T002 Confirm `embeddingProvider.healthy === true` and no active competing index-scan job (`index.activeScanJob === false`) [5m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Reindex — the gate-zero data operation] [1-3h, mostly re-embed wall-clock]

### Force reindex
- [ ] T003 Run `memory_index_scan({ force: true, background: true })`; capture the returned `jobId` [5m]
- [ ] T004 Poll `memory_index_scan_status({ jobId })` to completion; record final counts (deferred/complete_with_pending_vectors) [varies]

### Embedding reconcile
- [ ] T005 Run `memory_embedding_reconcile({ mode: 'dry-run' })`; record the bucket preview (vector-present-to-success, missing-to-retry) [10m]
- [ ] T006 Run `memory_embedding_reconcile({ mode: 'apply' })` after confirming the dry-run buckets [10m]
- [ ] T007 [P] Run a second `memory_embedding_reconcile` pass to measure the irreducible `failed` floor (resolve OPEN QUESTION 2) [10m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [Guard + Verify] [1-2h]

### Coverage delta
- [ ] T008 Capture post-reindex `memory_health` full report; compute the before/after delta on `pendingByStatus` + `consistency` (regression-baseline-and-delta rule) [15m]
- [ ] T009 Explain any residual `failed` rows (genuine provider failures vs recoverable); record the floor [10m]

### Ground-truth re-alignment (conditional)
- [ ] T010 If `assertGroundTruthAlignment` reports drift post-reindex, run `map-ground-truth-ids.ts --write` against the active DB and re-verify [20m]

### C9-4 coverage guard
- [ ] T011 Add `assertEmbeddingCoverage` (compute golden-set parent embedding coverage; throw-with-remediation below threshold) (`lib/eval/ablation-framework.ts`) [45m]
- [ ] T012 Invoke it at the existing pre-flight call site `:580-586` alongside `assertGroundTruthAlignment` (`lib/eval/ablation-framework.ts`) [10m]

### Tests
- [ ] T013 Unit: `assertEmbeddingCoverage` throws below threshold, passes above (`mcp_server/` vitest) [20m]
- [ ] T014 Integration: `runAblation` refuses a deliberately-low-coverage probe and passes on the restored corpus [20m]
- [ ] T015 Regression: full `mcp_server/` vitest passes vs the captured baseline (no new failures) [15m]

### Documentation
- [ ] T016 Record the coverage delta + residual-floor evidence in implementation-summary.md [15m]
- [ ] T017 Mark all checklist items with evidence [10m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Coverage restored (`pending` ~0, residual explained) with a recorded before/after delta
- [ ] `assertEmbeddingCoverage` wired and verified (throws below / passes above)
- [ ] `mcp_server/` vitest passing; checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Gate-zero source**: `../../research/synthesis/08-retrieval-evaluation-findings.md`

<!-- /ANCHOR:cross-refs -->
