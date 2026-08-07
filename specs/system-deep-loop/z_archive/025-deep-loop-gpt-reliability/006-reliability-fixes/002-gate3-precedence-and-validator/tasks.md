---
title: "Tasks: Gate-3 Precedence and Validator"
description: "Task stub for phase 002 of packet 035 (unified command-contract architecture); closes F-001, F-002, F-003, F-004, F-005, F-028, F-030, F-040."
trigger_phrases:
  - "tasks"
  - "035 002 tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/006-reliability-fixes/002-gate3-precedence-and-validator"
    last_updated_at: "2026-07-03T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task stub scaffolded from plan-review restructure"
    next_safe_action: "Expand tasks when this phase starts"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-002-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Gate-3 Precedence and Validator

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

**Task Format**: `T### Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Apply the requirement edits from `spec.md` §4, verifying quoted current-text against the live files first; wire each change behind the phase-001 feature flag (closes F-001, F-002, F-003, F-004, F-005, F-028, F-030, F-040).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Re-run the acceptance cells (RVB-008, RSB-008, ACB-004-med, IMB-004, IMB-005) on gpt-fast-med + gpt-fast-high; confirm the baseline leg does not regress and the CI comparator is green.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T003 Update docs, run `validate.sh --strict`, scoped commit + push.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Requirement edits applied behind the flag; acceptance cells moved to expected verdict; baseline green (per parent REQ-006).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Parent**: `../spec.md`
- **Gap mapping**: `../context-index.md`
- **Findings**: `../../034-gpt-reliability-research/research/findings-registry.md`
<!-- /ANCHOR:cross-refs -->
