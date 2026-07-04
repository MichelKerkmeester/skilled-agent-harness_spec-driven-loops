---
title: "Tasks: External Smoke + GPT-vs-Claude Behavioral Benchmark"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "gpt vs claude benchmark"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/004-benchmarks-and-verification/002-gpt-claude-benchmark"
    last_updated_at: "2026-07-01T17:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 11 tasks complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 013"
    blockers: []
    key_files:
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-012-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: External Smoke + GPT-vs-Claude Behavioral Benchmark

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Checked: `OPENCODE_PID` unset, `opencode` CLI (v1.17.11) directly reachable from this Claude Code shell. **PASS.**
- [x] T002 Not triggered (T001 passed) -- proceeded to T005/T006.
- [x] T003 Confirmed all of phases 008-011 complete before running the full matrix.
- [x] T004 Drafted (matches spec.md exactly): `phase0_self_check`/Mode-D, `route_mismatch`, `missing_artifact`, `timeout_latency`, plus `pass`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Ran all 4 modes via Claude-native direct Task dispatch (deep-context, deep-research, deep-review, ai-council): all 4 clean passes, 2.3-6.5s each. See `benchmark-results.md` §3.
- [x] T006 Ran the GPT leg via `opencode` CLI direct/command dispatch for all 4 modes. 2 cells (context, review-direct, ai-council) completed cleanly; research's direct dispatch was correctly refused per Command-only routing; research and review's command-level runs hit the smoke window before full completion (classified timeout_latency, with research's Phase-0 pass separately confirmed). See `benchmark-results.md` §3.
- [x] T007 Classified: 7 pass, 2 timeout_latency, 0 phase0_self_check, 0 route_mismatch, 0 missing_artifact. See `benchmark-results.md` §5.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirmed -- every cell has an explicit classification; the 2 incomplete command-level runs are `timeout_latency`, not a generic "failed".
- [x] T009 ai-council results are meaningful because phase 008's route-identity fix already landed (confirmed complete before this benchmark ran) -- annotated in `benchmark-results.md` §7.
- [x] T010 Written: `benchmark-results.md`.
- [x] T011 Ran `validate.sh --strict`: see `implementation-summary.md` Verification.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Precondition result explicit, not assumed (T001) -- PASS.
- [x] All collected results classified (T007, T008).
- [x] Strict spec validation passes (T011).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Precedent (same precondition gap)**: `../005-gpt-verification-smoke/`
- **Predecessor**: `../011-deep-route-guard-plugin/`
<!-- /ANCHOR:cross-refs -->

---
