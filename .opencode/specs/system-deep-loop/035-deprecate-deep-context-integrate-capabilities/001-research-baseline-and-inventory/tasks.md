---
title: "Tasks: Research Baseline And Inventory"
description: "Task breakdown for preserving completed research evidence and establishing the active-reference inventory gate for deep-context deprecation."
trigger_phrases:
  - "deep-context inventory tasks"
  - "research baseline tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-deprecate-deep-context-integrate-capabilities/001-research-baseline-and-inventory"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "opencode"
    recent_action: "Authored phase 001 task list"
    next_safe_action: "Refresh metadata and validate"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-001-tasks"
      parent_session_id: "2026-07-04-phase-001-research-baseline"
    completion_pct: 70
    open_questions: []
    answered_questions:
      - "Runtime implementation is out of scope for phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Research Baseline And Inventory

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are met |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (primary file or surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold phase child folder from SpecKit templates.
- [x] T002 Confirm completed research artifacts exist under the packet.
- [x] T003 Confirm `.codex/agents/deep-context*` is absent in this workspace.
- [x] T004 Read phase-parent rules and template guidance before writing docs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Move completed research artifacts into `001-research-baseline-and-inventory/research/`.
- [x] T006 Replace parent-level heavy docs with child phase docs.
- [x] T007 Author phase 001 spec, plan, tasks, checklist, decision record, and implementation summary.
- [ ] T008 Capture fresh baseline advisor routing probes immediately before phase 002 edits.
- [ ] T009 Capture fresh grep inventory counts immediately before phase 002 edits.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Refresh `description.json` and `graph-metadata.json` for parent and children.
- [ ] T011 Run strict validation for phase 001.
- [ ] T012 Run recursive strict validation from the parent.
- [ ] T013 Update `implementation-summary.md` with validation evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Research artifacts are phase-local and cited by docs.
- [ ] Phase 001 docs have no placeholders.
- [ ] Metadata is refreshed.
- [ ] Strict validation passes for the phase and recursive parent packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Research Synthesis**: `research/research.md`
<!-- /ANCHOR:cross-refs -->
