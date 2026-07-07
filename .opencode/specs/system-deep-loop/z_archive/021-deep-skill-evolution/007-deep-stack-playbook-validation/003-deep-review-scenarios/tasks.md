---
title: "Tasks: Deep-Review Scenarios (Deep-Loop Playbook 003)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-review scenarios tasks"
  - "deep review playbook tasks"
  - "007 phase 003 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/007-deep-stack-playbook-validation/003-deep-review-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 003 task list"
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
# Tasks: Deep-Review Scenarios (Deep-Loop Playbook 003)

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

- [ ] T001 Run `devin auth status` + `codex auth status` pre-flight (reuse packet-level pre-flight)
- [ ] T002 Create `/tmp/qa/{prompts,verdicts,evidence}`
- [ ] T003 [P] Render RCAF category-batch dispatch prompts (scratch/prompts/*.md), CLEAR-checked
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Dispatch 01--entry-points-and-modes batch (DRV-001,002,003) → capture log
- [ ] T005 Dispatch 02--initialization-and-state-setup batch (DRV-004,005,006,007) → capture log
- [ ] T006 Dispatch 03--iteration-execution-and-state-discipline batch (DRV-008..015) → capture log
- [ ] T007 Dispatch 04--convergence-and-recovery batch (DRV-031,017,018,019,020,030,032,033,034) → capture log
- [ ] T008 Dispatch 05--pause-resume-and-fault-tolerance batch (DRV-021,022,023,024) → capture log
- [ ] T009 Dispatch 06--synthesis-save-and-guardrails batch (DRV-025,026,027,028,029) → capture log
- [ ] T010 Dispatch 08--review-depth-v2-rollout batch (DRV-058..063) → capture log
- [ ] T011 Dispatch 07--command-flow-stress-tests batch (CP-052..057) LAST, SANDBOXED → `setup-cp-sandbox.sh`, dispatch pinned to `/tmp/cp-deep-review-sandbox`, capture log, teardown
- [ ] T012 SIGKILL each dispatch before launching next (single-dispatch discipline)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Parse each batch table into checklist.md ledger (45 rows)
- [ ] T014 Spot-re-run all FAIL/PARTIAL + 1 PASS/category; reconcile contested verdicts
- [ ] T015 Confirm critical-path scenarios (DRV-001,005,008,009,017,027) carry PASS or an escalated FAIL
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 45/45 verdicts recorded with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dispatch runbook**: See `../006-release-readiness-synthesis/dispatch-runbook.md`
<!-- /ANCHOR:cross-refs -->
