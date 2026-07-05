---
title: "Tasks: Deep-Agent-Improvement Scenarios (Deep-Loop Playbook 005)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-agent-improvement scenarios tasks"
  - "deep agent improvement playbook tasks"
  - "007 phase 005 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/007-deep-stack-playbook-validation/005-deep-agent-improvement-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 005 task list"
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
# Tasks: Deep-Agent-Improvement Scenarios (Deep-Loop Playbook 005)

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

- [ ] T004 Dispatch 01--integration-scanner batch (IS-001..004) → capture log
- [ ] T005 Dispatch 02--profile-generator batch (PG-005..008) → capture log
- [ ] T006 Dispatch 03--5d-scorer batch (5D-010,012,013) → capture log
- [ ] T007 Dispatch 04--benchmark-integration batch (BI-014,015) → capture log
- [ ] T008 Dispatch 05--reducer-dimensions batch (RD-017,018,019) → capture log
- [ ] T009 Dispatch 06--end-to-end-loop batch (E2E-020..024) → capture log
- [ ] T010 Dispatch 07--runtime-truth batch (RT-025..034; execute or SKIP-with-blocker) → capture log
- [ ] T011 Dispatch 08--agent-discipline-stress-tests batch (CP-040..045) LAST, sandboxed via `setup-cp-sandbox.sh`, cleanup after → capture log
- [ ] T012 SIGKILL each dispatch before launching next (single-dispatch discipline)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Parse each batch table into checklist.md ledger (37 rows)
- [ ] T014 Spot-re-run all FAIL/PARTIAL + 1 PASS/category; reconcile contested verdicts
- [ ] T015 Confirm RT-025..034 verdicts captured for release-readiness synthesis
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 37/37 verdicts recorded with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dispatch runbook**: See `../006-release-readiness-synthesis/dispatch-runbook.md`
<!-- /ANCHOR:cross-refs -->
