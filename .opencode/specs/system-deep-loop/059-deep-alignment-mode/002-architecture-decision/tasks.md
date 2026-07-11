---
title: "Tasks: Phase 2: architecture-decision"
description: "Task list for the deep-alignment architecture-decision gate: author 12 ADRs (7 accepted, 5 open) and route for operator approval before phase 003."
trigger_phrases:
  - "deep-alignment architecture tasks"
  - "adr authoring tasks"
  - "decision gate tasks"
  - "phase 002 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/002-architecture-decision"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted pending tasks for the architecture-decision gate"
    next_safe_action: "Execute T004 accepted-ADR authoring"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/spec.md"
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-002-architecture-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: architecture-decision

<!-- SPECKIT_LEVEL: 3 -->

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

- [ ] T001 Confirm the seven locked-decision clusters and five open questions from the frozen design brief (spec.md §2 Evidence)
- [ ] T002 [P] Confirm phase 001's research/context map has been produced and is available as ADR evidence
- [ ] T003 [P] Draft the ADR numbering plan: 001-007 accepted, 008-012 open, each with an owning phase for the open set
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author ADR-001 (new mode-packet vs. deep-review mode) through ADR-007 (explicit boundary) in decision-record.md
- [ ] T005 Author ADR-008 (sk-code adapter limits) through ADR-012 (adapter registration governance) in decision-record.md, each Status: Open with a named owning phase
- [ ] T006 Freeze the state-machine and adapter-contract target shape in plan.md §3 Architecture
- [ ] T007 Cross-check spec.md, plan.md, checklist.md, and decision-record.md cite all 12 ADRs consistently
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm no files outside this phase folder were touched during execution
- [ ] T009 Run phase-folder validation (validate.sh --strict) and resolve any findings
- [ ] T010 Stop for human review and route decision-record.md for operator approval before phase 003 begins
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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
