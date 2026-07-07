---
title: "Tasks: PC-005 Bench Doc + Gate Calibration (F2)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "F2 tasks bench gates"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/003-pc005-bench-doc-and-gates"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-remediation"
    recent_action: "Implemented and verified"
    next_safe_action: "None; phase complete and verified"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: PC-005 Bench Doc + Gate Calibration (F2)

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

- [x] T001 Read bench argparse defaults + stress vitest contract + feature-catalog envelope
- [x] T002 Decide cold p95 = advisory vs subprocess-scoped budget
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Update PC-005 doc with `--dataset <regression fixture>` + `--runs 1` smoke note
- [x] T004 Set warm p95 default 50 ms; cold p95 advisory or subprocess-scoped in skill_advisor_bench.py
- [x] T005 Align python-bench-runner-stress.vitest.ts to the chosen gate contract
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the corrected documented command; confirm exit 0 + gate report
- [x] T007 Run the stress vitest; confirm no doc/code drift
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Documented command runs + gates report correctly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Root cause**: See `../research/research.md` §3 F2
<!-- /ANCHOR:cross-refs -->
