---
title: "Tasks: deep review + empirical benchmark of the context-loading contract"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "context contract benchmark tasks"
  - "deep review benchmark tasks design"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/035-design-context-benchmark"
    last_updated_at: "2026-06-27T16:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all review + benchmark tasks complete"
    next_safe_action: "Optional follow-ups; otherwise phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "benchmark-matrix.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "eval-154-035-design-context-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: deep review + empirical benchmark of the context-loading contract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

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

- [x] T001 Consult sk-prompt-small-model for Kimi K2.7 (COSTAR) + MiniMax M3 (TIDD-EC) recipes
- [x] T002 Smoke-test both transports (kimi-for-coding/k2p7 + minimax/MiniMax-M3) — both live
- [x] T003 Create the `031` packet + review/ + 4 run dirs; author review prompt + 4 A/B prompts + drivers
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Track 1: 10-iteration gpt-5.5 deep review over 029/030 → review/review-report.md
- [x] T005 [P] Track 2: 4-run A/B benchmark (MiniMax + Kimi × baseline/contract), parallel
- [x] T006 Score the 4 runs on the fixed rubric; independently recompute decisive contrast values
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Verify benchmark scope isolation (models wrote only to their run dir)
- [x] T008 Synthesize benchmark-matrix.md + combined verdict (review CONDITIONAL + benchmark +5/+6 lift)
- [x] T009 Author wrapper docs; generate metadata; run `validate.sh --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Review report (10 iters) + benchmark matrix + combined verdict produced; strict validation clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Deliverables**: `review/review-report.md`, `benchmark-matrix.md`
<!-- /ANCHOR:cross-refs -->
