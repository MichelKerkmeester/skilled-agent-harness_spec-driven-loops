---
title: "Tasks: Prompt Command Canon Refactor"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "prompt command tasks"
  - "canon refactor tasks"
  - "router split tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/007-sk-prompt-parent/009-prompt-command-canon-refactor"
    last_updated_at: "2026-07-18T06:21:04.143Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the task breakdown for the /prompt:improve refactor"
    next_safe_action: "Validate the router and workflow assets, then refresh packet metadata"
    blockers: []
    key_files:
      - ".opencode/commands/prompt/improve.md"
      - ".opencode/commands/prompt/assets/prompt_improve_presentation.txt"
      - ".opencode/commands/prompt/assets/prompt_improve_auto.yaml"
      - ".opencode/commands/prompt/assets/prompt_improve_confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-009-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Prompt Command Canon Refactor

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

- [x] T001 Read the create-command router template, contract, and presentation template [File: `.opencode/skills/sk-doc/create-command/assets/command_router_template.md`]
- [x] T002 Read a reference router and the deep-command Phase 0 pattern [File: `.opencode/commands/deep/command-benchmark.md`]
- [x] T003 [P] Enumerate the monolith's capabilities for a behavior-preserving split [Source: `.opencode/commands/prompt/improve.md pre-refactor`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite improve.md as a thin router with Phase 0 dispatch-context check + input gate [File: `.opencode/commands/prompt/improve.md`]
- [x] T005 Author the presentation asset [File: `.opencode/commands/prompt/assets/prompt_improve_presentation.txt`]
- [x] T006 Author the auto workflow YAML [File: `.opencode/commands/prompt/assets/prompt_improve_auto.yaml`]
- [x] T007 Author the confirm workflow YAML [File: `.opencode/commands/prompt/assets/prompt_improve_confirm.yaml`]
- [x] T008 Correct the commands README index (recategorize + fix broken link) [File: `.opencode/commands/README.txt`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Validate the router as a command [Test: `validate_document.py --type command`]
- [x] T010 Confirm no stale references remain and the link resolves [Test: `rg /prompt-improve over .opencode/commands`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Router validates 0/0 and the command index is clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
