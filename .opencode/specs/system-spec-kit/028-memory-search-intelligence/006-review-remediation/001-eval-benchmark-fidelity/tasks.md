---
title: "Tasks: Eval Benchmark Fidelity Remediation"
description: "PENDING task list for the flag-eval driver fix and criterion-4 re-run."
trigger_phrases:
  - "028 eval benchmark fidelity tasks"
  - "flag eval driver fix tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/006-review-remediation/001-eval-benchmark-fidelity"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING eval-benchmark-fidelity tasks"
    next_safe_action: "Reproduce the prior benchmark"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-tasks-006-001-eval-benchmark-fidelity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Eval Benchmark Fidelity Remediation

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Reproduce the prior criterion-4 run and save its per-flag deltas as baseline.
- [ ] T002 Confirm the `routeQuery()` vs `forceAllChannels` contract at `hybrid-search.ts:1394-1396`.
- [ ] T003 Confirm the `exactTriggerSearch` call site at `hybrid-search.ts:1504` lacks the trigger guard.
- [ ] T004 Confirm embedding coverage is healthy before any re-run.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Replace the forced all-channels path with default `routeQuery()` routing in `run-retrieval-flag-eval.mjs` (P1-1).
- [ ] T006 Gate the trigger lane so the ablation genuinely removes it (P1-3).
- [ ] T007 Keep all production routing code unchanged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Re-run the criterion-4 per-flag benchmark on the corrected driver.
- [ ] T009 Re-derive the criterion-4 flip verdict from the new deltas.
- [ ] T010 Update `benchmark-status.md` with the new deltas and a supersession note.
- [ ] T011 Run strict validation for this child folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Benchmark re-run evidence is recorded.
- [ ] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
- **Source review**: See `../../review-report.md`
<!-- /ANCHOR:cross-refs -->
