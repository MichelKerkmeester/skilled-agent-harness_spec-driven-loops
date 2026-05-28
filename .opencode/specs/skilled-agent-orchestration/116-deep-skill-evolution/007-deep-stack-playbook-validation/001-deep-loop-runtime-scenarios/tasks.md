---
title: "Tasks: Deep-Loop Runtime Scenarios (Deep-Loop Playbook 001)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-loop-runtime scenarios tasks"
  - "deep loop runtime playbook tasks"
  - "030 phase 001 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-deep-loop-skills-playbook-validation/001-deep-loop-runtime-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 001 task list"
    next_safe_action: "Execute T001 auth pre-flight"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep-Loop Runtime Scenarios (Deep-Loop Playbook 001)

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

- [ ] T001 Run `devin auth status` + `codex auth status` pre-flight (one-time for packet)
- [ ] T002 Create `/tmp/qa/{prompts,verdicts,evidence}`
- [ ] T003 [P] Render RCAF category-batch dispatch prompts (scratch/prompts/*.md), CLEAR-checked
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Dispatch 01--executor batch (DLR-001,002,003) → capture log
- [ ] T005 Dispatch 02/03/05 batch (DLR-004,005,010) → capture log
- [ ] T006 Dispatch 04--state-safety batch (DLR-006,007,008,009) → capture log
- [ ] T007 Dispatch 06--coverage-graph batch (DLR-011,012,013) → capture log
- [ ] T008 Dispatch 07--script-entry-points batch (DLR-014,015,016,017) → capture log
- [ ] T009 Dispatch 08--council batch (DLR-018,019,020,021,022) → capture log
- [ ] T010 SIGKILL each dispatch before launching next (single-dispatch discipline)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Parse each batch table into checklist.md ledger (22 rows)
- [ ] T012 Spot-re-run all FAIL/PARTIAL + 1 PASS/category; reconcile contested verdicts
- [ ] T013 Confirm 06/07/08 verdicts captured to gate phase 002
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 22/22 verdicts recorded with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dispatch runbook**: See `../006-release-readiness-synthesis/dispatch-runbook.md`
<!-- /ANCHOR:cross-refs -->
