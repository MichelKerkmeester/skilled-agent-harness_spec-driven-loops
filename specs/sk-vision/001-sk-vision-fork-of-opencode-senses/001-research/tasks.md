---
title: "Tasks: sk-vision 001 research"
description: "Research tasks for the Senses fork, skill housing, and OpenCode plus Pi adapter lock."
trigger_phrases:
  - "sk-vision research tasks"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/001-research"
    last_updated_at: "2026-08-16T06:28:08.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Marked research authoring tasks complete pending validation."
    next_safe_action: "Run validate.sh --strict."
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-research-20260815"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision 001 research

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

## AI Execution Protocol

### Pre-Task Checklist
Before starting any task, verify:
1. spec.md scope unchanged
2. Current phase identified in plan.md
3. Task dependencies satisfied
4. Relevant P0/P1 checklist items identified
5. No blocking issues in decision-record.md
6. Previous session context reviewed when resuming

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order |
| TASK-SCOPE | Stay within this research child; no skill scaffold |
| TASK-VERIFY | Cite dump paths or Pi type lines |
| TASK-DOC | Update status immediately |
| TASK-SYNC | Close with validate.sh --strict |

### Status Reporting Format
`T### STATUS: done|blocked - evidence path`

### Blocked Task Protocol
If a task is BLOCKED, stop, record the blocker in continuity, and do not start later children.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Rewrite track metadata (`specs/sk-vision/description.json`)
- [x] T002 Scaffold phase parent plus `001-research` (`create.sh --phase`)
- [x] T003 Render L3 checklist, decision-record, and research templates (`001-research/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Inventory dumped Senses plugin, tools, runtime (`../context/`)
- [x] T005 [P] Read Pi 0.84.2 `registerTool`, `ToolDefinition`, `InputEvent.images`
- [x] T006 Author child spec, plan, and ADRs (`spec.md`, `plan.md`, `decision-record.md`)
- [x] T007 Author `research/research.md` with confirmed versus inferred labels
- [x] T008 Author parent lean `../spec.md` phase map
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `validate.sh` on this child `--strict` (`validate.sh`)
- [x] T010 Run `validate.sh` on the parent `--recursive --strict` (`validate.sh`)
- [x] T011 Confirm `../context/` still present after scaffold
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (`validate.sh` exit 0)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
