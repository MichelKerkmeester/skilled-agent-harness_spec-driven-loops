---
title: "Tasks: Phase 7: sk-code Asset-Template Alignment + Smart-Router Conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-code asset router tasks"
  - "authoring checklist overview tasks"
  - "loading levels task"
  - "router guard verification task"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/142-sk-code-ponytail-based-refinement/007-sk-code-asset-router-alignment"
    last_updated_at: "2026-06-14T06:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implementation tasks executed and verified"
    next_safe_action: "Run validate.sh --strict on this phase folder"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "146-007-sk-code-asset-router-alignment"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: sk-code Asset-Template Alignment + Smart-Router Conformance

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read sk-doc asset + smart-router standards (`sk-doc/assets/skill/*`)
- [x] T002 Read the 11 checklists + SKILL.md §2 and identify the four router hard constraints
- [x] T003 [P] Confirm the asset-validator failure (`missing_required_section: overview`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Restructure `agent_authoring.md` to OVERVIEW (Purpose + Usage) (`assets/opencode/checklists/agent_authoring.md`)
- [x] T005 Restructure `command_authoring.md` + `mcp_server_authoring.md` (`assets/opencode/checklists/`)
- [x] T006 Restructure `skill_authoring.md` + `spec_folder_authoring.md` (`assets/opencode/checklists/`)
- [x] T007 Add the Resource Loading Levels table to `SKILL.md §2` (`.opencode/skills/sk-code/SKILL.md`)
- [x] T008 Surface the UNKNOWN_FALLBACK checklist in `SKILL.md §2` (`.opencode/skills/sk-code/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 `validate_document.py --type asset` -> VALID for all 11 checklists
- [x] T010 `verify_stack_folders.py` exit 0; `check-rule-copies.js` exit 0; SKILL.md `--type skill` VALID
- [x] T011 Confirm playbook by-section anchors resolve and the ladder gate is intact
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All guards green and `validate.sh --strict` passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
