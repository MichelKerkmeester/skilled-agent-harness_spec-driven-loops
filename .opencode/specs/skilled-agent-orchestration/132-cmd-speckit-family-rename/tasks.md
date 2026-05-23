---
title: "Tasks: rename commands/spec_kit/ -> commands/speckit/"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "speckit rename tasks"
  - "rename task list"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-cmd-speckit-family-rename"
    last_updated_at: "2026-05-23T15:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored task checklist"
    next_safe_action: "Mark Phase 9 closed"
    blockers: []
    key_files: []
---
# Tasks: rename commands/spec_kit/ -> commands/speckit/

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

- [x] T001 [P] Map command surface via 3 parallel Explore agents (claude/opencode/gemini/codex inventory)
- [x] T002 Confirm scope via AskUserQuestion (slash commands only + changelog updates + dangerous mode)
- [x] T003 Read cli-devin SKILL.md + sk-prompt-small-model SKILL.md (required pre-dispatch reading)
- [x] T004 Compose RCAF dispatch prompt with sequential_thinking + Gate 3 pre-answer (`/tmp/devin-prompt-speckit-rename.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 cli-devin SWE-1.6 Pass 1 dispatch with `--permission-mode dangerous` (operator-approved)
- [x] T006 Filesystem renames: `git mv` 2 source dirs + 8 yaml assets (`.opencode/commands/speckit/`, `.gemini/commands/speckit/`)
- [x] T007 Reference sweep: 1,170+ files updated via exclusion-aware sed loop
- [x] T008 Identify 8 broken-by-rename live files inside `system-spec-kit/`
- [x] T009 sed-fix 8 framework-skill files (5 tests + scaffold-debug-delegation.sh + SKILL.md + README.md)
- [x] T010 Commit Pass 1 on main: SHA `576624ada8` (1,220 files, 17,284 insertions, 15,236 deletions)
- [x] T011 cli-devin SWE-1.6 Pass 2 audit dispatch with `--permission-mode auto` (read-only)
- [x] T012 Fix 6 audit findings: 3 P0 in `.opencode/commands/README.txt` + 3 more re-grep hits + 1 P1 in anobel.com
- [x] T013 Remove pre-existing broken `deep-research` entry from `test-phase-command-workflows.js`
- [x] T014 Strict-scope commit Pass 2 on main via `git restore --staged .`: SHA `ce6d9c0cee` (2 files)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Gate 1: `/spec_kit:` refs outside allowlist = 0 (verified)
- [x] T016 Gate 2: `commands/spec_kit/` refs outside allowlist = 0 (verified)
- [x] T017 Gate 3: `spec_kit_*.yaml` refs outside allowlist = 0 (verified)
- [x] T018 Gate 5: `system-spec-kit` framework skill preserved verbatim (verified via positive grep + ls)
- [x] T019 Gate 6: codex + claude symlinks intact (`../.opencode/commands`, `../.opencode/skills`)
- [x] T020 Gate 7: 16 `speckit_*.yaml` assets present (8 source + 8 via symlink)
- [x] T021 Live test passes: `node test-phase-command-workflows.js` -> exit 0, 89/89 PASS
- [x] T022 Audit verdict PASS for active surface (P2 z_archive historical refs intentionally excluded)
- [x] T023 Memory save via generate-context.js + strict validate this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (live test + 7 gates + audit verdict)
- [x] Memory save indexed this packet via generate-context.js
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Summary**: See `implementation-summary.md`
- **Commits**: `576624ada8` (Pass 1), `ce6d9c0cee` (Pass 2)
<!-- /ANCHOR:cross-refs -->
