---
title: "Tasks: RTK Shell-Output Shortening Trial"
description: "Trial RTK (the Rust shell-output shortener bundled with Headroom) on a representative set of our noisy commands, measure savings and correctness, and decide adopt/skip — independent of Headroom proxy/wrap."
trigger_phrases:
  - "rtk shell output trial"
  - "rust token killer trial"
  - "shell output compression"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-headroom-utilization/005-rtk-shell-output-trial"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the rtk-shell-output-trial phase"
    next_safe_action: "Obtain the RTK binary and pick representative commands"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-005-rtk-shell-output-trial"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: RTK Shell-Output Shortening Trial

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

- [ ] T001 Obtain the RTK binary (binaries.py or standalone) and verify provenance
- [ ] T002 Select ≥5 representative noisy commands
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Run each raw vs rtk; record char/token savings
- [ ] T004 Diff outputs; flag any dropped information we rely on
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Write the trial report with per-command adopt/skip calls
- [ ] T006 Run validate.sh; STOP for review
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Report artifact written and `validate.sh` green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
