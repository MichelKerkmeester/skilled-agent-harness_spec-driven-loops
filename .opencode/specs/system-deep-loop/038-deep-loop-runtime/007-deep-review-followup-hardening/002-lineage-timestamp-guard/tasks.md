---
title: "Tasks: Lineage Timestamp Guard"
description: "Task ledger for the timestamp window checker and its fan-out boundary integration."
trigger_phrases:
  - "timestamp guard tasks"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-deep-loop-runtime/007-deep-review-followup-hardening/002-lineage-timestamp-guard"
    last_updated_at: "2026-07-04T16:33:20.324Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Implementation completed"
    next_safe_action: "Review final verification evidence"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/lineage-timestamp-window.ts"
      - ".opencode/skills/deep-loop-runtime/tests/unit/lineage-timestamp-window.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-002-timestamp-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Lineage Timestamp Guard

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Read the lineage completion path in `fanout-run.cjs` and `lib/deep-loop/post-dispatch-validate.ts`; choose the seam.
- [x] T002 Read deep-loop-runtime vitest conventions.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Implement the pure window-check function (inclusive bounds, documented skew tolerance, per-class counts, bounded offender sample).
- [x] T004 Integrate at lineage completion; emit `timestamp_anomaly` ledger event + orchestration-summary field only when counts are non-zero.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Fixtures: fabricated pre-window sequence (all flagged), honest in-window (clean), boundary-exact (clean), unparseable, untimestamped.
- [x] T006 Outcome-invariance check: exit/retry/salvage identical with anomalies present.
- [x] T007 Full deep-loop-runtime vitest suite: 0 new failures.
- [x] T008 Author implementation-summary.md; fill checklist evidence; set spec.md Status per real outcome.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed (`validate.sh --strict` exits 0 on this folder).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
