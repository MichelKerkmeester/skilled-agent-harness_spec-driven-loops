---
title: "Tasks: Phase 7: routing-benchmark-and-review"
description: "Task list for the router-mode Lane-C benchmark, the live delegation-routing re-baseline, and the independent deep-review pass."
trigger_phrases:
  - "cli-external benchmark tasks"
  - "routing benchmark tasks"
  - "deep-review tasks"
  - "phase 007 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/007-routing-benchmark-and-review"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the benchmark-and-review task list"
    next_safe_action: "Run the benchmark and review after phase 006"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external/benchmark/router-final/skill-benchmark-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-routing-benchmark-and-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: routing-benchmark-and-review

<!-- SPECKIT_LEVEL: 1 -->

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

- [ ] T001 Confirm the phases 003-006 diff is complete and available for review
- [ ] T002 Confirm the router-mode benchmark command and output directory
- [ ] T003 [P] Prepare real delegation prompts for both `cli-opencode` and `cli-claude-code`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Run the router-mode Lane-C benchmark and write both report files under `benchmark/router-final/`
- [ ] T005 Run the live delegation-routing re-baseline and confirm both executor kinds resolve with no silent misroute
- [ ] T006 Run the independent deep-review pass over the phases 003-006 diff, weighting the scorer rewrite and the fail-open hook
- [ ] T007 Record the routingClass decision per mode from D1/D2 evidence
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm the two report files exist and clearly report D1-D5 for both modes
- [ ] T009 Triage P0/P1/P2 review findings as fixed, deferred-with-reason, or false-positive
- [ ] T010 Run phase-folder validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Benchmark + live re-baseline done, no untriaged P0 finding, routingClass recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
