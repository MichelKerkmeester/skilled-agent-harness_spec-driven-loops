---
title: "Tasks: Phase 6: integration-validation"
description: "Concrete validation steps for the assembled sk-design family. Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-design integration validation tasks"
  - "sk-design family validation steps"
  - "sk-design recursive validate tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/006-integration-validation"
    last_updated_at: "2026-06-25T12:41:18Z"
    last_updated_by: "claude-opus"
    recent_action: "Populated the Level-1 task list for the terminal integration-validation phase"
    next_safe_action: "Begin T002 (rebuild the skill-advisor index)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design/008-sk-design-parent/006-integration-validation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: integration-validation

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

- [ ] T001 Confirm all five children exist and the 005 children passed `validate.sh --strict` (precondition)
- [ ] T002 Rebuild the skill-advisor index (`advisor_rebuild`)
- [ ] T003 Run a skill-graph scan and confirm the family nodes/edges are present and clean (`skill_graph_scan` / `advisor_validate`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Run per-domain routing fixtures (interface, foundations, motion, audit, spec) and confirm each resolves to the right child at >=0.8
- [ ] T005 Confirm `sk-design-interface` resolves directly and mcp-open-design's MANDATORY design-judgment pairing still fires
- [ ] T006 Run `validate.sh --recursive` on `.opencode/specs/design/008-sk-design-parent/` until it exits 0
- [ ] T007 Run the backward-compat `rg` sweep across mcp-open-design, mcp-figma, sk-code, sk-code-review, CLAUDE.md and confirm each `sk-design-interface` reference resolves
- [ ] T008 Record any failed check and route it back to its owning phase/child (no content authored here)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Add changelog entries for the new (foundations, motion, audit) and changed (interface, spec, umbrella) skills
- [ ] T010 Confirm the generic "make this look good" entry still defaults to the interface child (no regression)
- [ ] T011 Update spec/plan/tasks to reflect the green terminal gate
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `validate.sh --recursive` on the 154 parent exits 0
- [ ] Every routing fixture resolves to the right child; `sk-design-interface` still resolves directly
- [ ] Backward-compat sweep clean; changelog entries present for new + changed skills
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

