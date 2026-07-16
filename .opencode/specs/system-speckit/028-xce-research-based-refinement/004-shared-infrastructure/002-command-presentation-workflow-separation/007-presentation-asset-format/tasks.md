---
title: "Tasks: Presentation Asset Format — .md to .txt [template:examples/level_1/tasks.md]"
description: "Task ledger for renaming command presentation assets to .txt and updating references."
trigger_phrases:
  - "presentation asset format tasks"
  - "command txt rename tasks"
  - "presentation extension tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/007-presentation-asset-format"
    last_updated_at: "2026-06-12T13:30:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Renamed assets and updated references"
    next_safe_action: "Validate and scoped-commit"
---
# Tasks: Presentation Asset Format — .md to .txt

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

- [x] T001 Confirm loader registers `assets/*.md` and skips `.yaml` (`.opencode/commands/`)
- [x] T002 Enumerate 24 assets + all references (`.opencode/commands/`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rename 24 `*_presentation.md` to `*_presentation.txt` (`.opencode/commands/*/assets/`)
- [x] T004 Rewrite router references to `.txt` (`.opencode/commands/*/*.md`)
- [x] T005 Fix the three doctor asset self-references (`.opencode/commands/doctor/assets/`)
- [x] T006 Update sk-doc generator templates (`.opencode/skills/sk-doc/assets/command_template.md`, `command_presentation_template.md`, `template_rules.json`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Zero-residual grep for `_presentation.md` (`.opencode/commands/`, `.opencode/skills/sk-doc/assets/`)
- [x] T008 Confirm no code loads assets by `.md` path (`grep --include=*.ts/*.js/*.cjs`)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Zero residual `.md` presentation references.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
