---
title: "Tasks: Deep-Research Scenarios (Deep-Loop Playbook 004)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-research scenarios tasks"
  - "deep research playbook tasks"
  - "007 phase 004 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/007-deep-stack-playbook-validation/004-deep-research-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 004 task list"
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
# Tasks: Deep-Research Scenarios (Deep-Loop Playbook 004)

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

- [ ] T001 Run `devin auth status` + `codex auth status` pre-flight (reuse foundational phase result)
- [ ] T002 Create `/tmp/qa/{prompts,verdicts,evidence}`
- [ ] T003 [P] Render RCAF category-batch dispatch prompts (scratch/prompts/*.md), CLEAR-checked
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Dispatch 01--entry-points-and-modes batch (DR-001,002,003) → capture log
- [ ] T005 Dispatch 02--initialization-and-state-setup batch (DR-004,005,006,027) → capture log
- [ ] T006 Dispatch 03--iteration-execution-and-state-discipline batch (DR-007,008,009,010,024,025,028,029) → capture log
- [ ] T007 Dispatch 04--convergence-and-recovery batch (DR-011,012,013,014,020,021,022,023,030,031,032,033,034) → capture log (may sub-split into two dispatches)
- [ ] T008 Dispatch 05--pause-resume-and-fault-tolerance batch (DR-015,016,017,018) → capture log
- [ ] T009 Dispatch 06--synthesis-save-and-guardrails batch (DR-019,026,035) → capture log
- [ ] T010 Dispatch 07--command-flow-stress-tests batch (CP-046..051) LAST — `setup-cp-sandbox.sh` provision `/tmp/cp-deep-research-sandbox`, capture log, cleanup after
- [ ] T011 SIGKILL each dispatch before launching next (single-dispatch discipline)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Parse each batch table into checklist.md ledger (41 rows)
- [ ] T013 Spot-re-run all FAIL/PARTIAL + 1 PASS/category; reconcile contested verdicts
- [ ] T014 Confirm `/tmp/cp-deep-research-sandbox` torn down and no leakage into deterministic categories
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 41/41 verdicts recorded with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dispatch runbook**: See `../006-release-readiness-synthesis/dispatch-runbook.md`
<!-- /ANCHOR:cross-refs -->
