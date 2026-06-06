---
title: "Tasks: Deep-AI-Council Scenarios (Deep-Loop Playbook 002)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-ai-council scenarios tasks"
  - "deep ai council playbook tasks"
  - "007 phase 002 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/007-deep-stack-playbook-validation/002-deep-ai-council-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 002 task list"
    next_safe_action: "Confirm phase 001 06/07/08 verdicts, then render 01--runtime-routing-and-rename batch prompt"
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
# Tasks: Deep-AI-Council Scenarios (Deep-Loop Playbook 002)

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

- [ ] T001 Confirm phase 001 `06`/`07`/`08` verdicts non-FAIL (gates 08/09 dispatch)
- [ ] T002 Create `/tmp/qa/{prompts,verdicts,evidence}`
- [ ] T003 [P] Render RCAF category-batch dispatch prompts (scratch/prompts/*.md), CLEAR-checked
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Dispatch 01--runtime-routing-and-rename batch (DAC-001,002) → devin, capture log
- [ ] T005 Dispatch 02--council-deliberation-and-seat-diversity batch (DAC-003,004) → devin, capture log
- [ ] T006 Dispatch 03--artifact-persistence-and-state-format batch (DAC-005,006,007) → devin, capture log
- [ ] T007 Dispatch 04--convergence-and-rollback batch (DAC-008,009,010) → devin, capture log
- [ ] T008 Dispatch 05--scope-boundaries batch (DAC-011,012) → devin, capture log
- [ ] T009 Dispatch 06--depth-and-failure-handling batch (DAC-014,018) → devin, capture log
- [ ] T010 Dispatch 07--writer-library-contract batch (DAC-013,015,016,017) → devin, capture log
- [ ] T011 [B] Dispatch 08--council-graph-integration batch (DAC-019..026) → devin, capture log (GATED on T001)
- [ ] T012 [B] Dispatch 09--council-graph-value-comparison batch (DAC-027..032) → codex GPT-5.5 medium-fast A/B, capture log (GATED on T001)
- [ ] T013 SIGKILL each dispatch before launching next (single-dispatch discipline)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Parse each batch table into checklist.md ledger (32 rows)
- [ ] T015 Spot-re-run all FAIL/PARTIAL + 1 PASS/category; reconcile contested verdicts
- [ ] T016 Confirm 08/09 dispatched only after phase 001 06/07/08 verdicts non-FAIL
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 32/32 verdicts recorded with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dispatch runbook**: See `../006-release-readiness-synthesis/dispatch-runbook.md`
<!-- /ANCHOR:cross-refs -->
