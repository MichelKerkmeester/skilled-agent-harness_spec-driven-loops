---
title: "Tasks: Refresh .opencode/commands to match the new sk-doc setup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "commands refresh tasks"
  - "125 sk-doc phase 015 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/015-commands-refresh"
    last_updated_at: "2026-07-07T06:40:27.201Z"
    last_updated_by: "claude-opus"
    recent_action: "Author phase-015 tasks; residual repoints applied"
    next_safe_action: "Verify path resolution and close the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Refresh .opencode/commands to match the new sk-doc setup

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Enumerate stale sk-doc structural references under `.opencode/commands/` (facades=0, monoliths=0 real, doc-quality=0, references/global=0, skill_creation=4)
- [x] T002 Map each residual to its real post-refactor target (`skill_creation/` -> `parent_skill/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Repoint `skill_creation/` -> `parent_skill/` (`.opencode/commands/create/assets/create_parent_skill_auto.yaml`)
- [x] T004 Repoint `skill_creation/` -> `parent_skill/` (`.opencode/commands/create/assets/create_parent_skill_confirm.yaml`)
- [x] T005 Correct stale monolith display label (`.opencode/commands/create/README.txt`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Grep confirms zero residual stale references under `.opencode/commands/`
- [x] T007 Resolve every `create_*_auto.yaml` sk-doc resource path (32 checked, 0 broken)
- [ ] T008 `validate.sh --strict` passes for this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Zero stale sk-doc structural references under `.opencode/commands/`
- [x] All command-cited sk-doc resource paths resolve
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
