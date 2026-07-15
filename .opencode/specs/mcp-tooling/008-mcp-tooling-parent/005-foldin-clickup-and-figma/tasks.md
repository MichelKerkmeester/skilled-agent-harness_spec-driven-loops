---
title: "Tasks: Phase 5: foldin-clickup-and-figma"
description: "Task list for the git mv of the mcp-click-up workflow tree and the mcp-figma transport tree into the hub with internal self-path rewrites."
trigger_phrases:
  - "clickup figma fold-in tasks"
  - "mcp-figma transport move tasks"
  - "phase 005 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-tooling-parent/005-foldin-clickup-and-figma"
    last_updated_at: "2026-07-10T07:20:00Z"
    last_updated_by: "claude"
    recent_action: "Checked off fold-in tasks with evidence"
    next_safe_action: "No further action required"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/005-foldin-clickup-and-figma/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/005-foldin-clickup-and-figma/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-foldin-clickup-and-figma"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: foldin-clickup-and-figma

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

- [x] T001 Confirm phase 004 is complete and the hub has one packet already resolving — `mcp-tooling/mcp-chrome-devtools/` resolved cleanly and validated 0/0 before this phase started
- [x] T002 Inventory internal self-path references inside both trees, absolute and relative (`rg` for the two old skill-folder paths and their `../mcp-click-up` / `../mcp-figma` relative forms) — inventory taken before the `git mv`
- [x] T003 [P] Record figma's current `allowed-tools` to diff against after the move — pre-move surface (`Read`, `Bash`, `Grep`, `Glob`, `mcp__code_mode__call_tool_chain`; no `Write`/`Edit`) recorded for the post-move diff in T009
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 `git mv .opencode/skills/mcp-click-up` into `.opencode/skills/mcp-tooling/mcp-click-up` — `git status --short` shows 153 `R`/`RM` rename entries from the flat path to `mcp-tooling/mcp-click-up/`
- [x] T005 `git mv .opencode/skills/mcp-figma` into `.opencode/skills/mcp-tooling/mcp-figma` — `git status --short` shows 39 `R`/`RM` rename entries from the flat path to `mcp-tooling/mcp-figma/`
- [x] T006 Rewrite internal absolute and relative self-paths in both trees; keep both versions (1.0.0.0) and changelogs, sparing historical changelog prose — `mcp-tooling/mcp-click-up/SKILL.md:5` and `mcp-tooling/mcp-figma/SKILL.md:6` both read `version: 1.0.0.0`; each packet's single-entry `changelog/v1.0.0.0.md` is intact
- [x] T007 Note the pre-existing click-up OAuth-vs-`@clickup/mcp-server` config drift as a deferred follow-up, not fixed here — `mcp-tooling/mcp-click-up/SKILL.md` still documents OAuth 2.1 + PKCE via `mcp-remote`, left untouched by this move; drift tracked as still-deferred in phase 008
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Grep both moved trees for their old paths; confirm zero live self-path hits — `rg "\.opencode/skills/mcp-click-up/|\.opencode/skills/mcp-figma/" .opencode/skills/mcp-tooling/mcp-click-up .opencode/skills/mcp-tooling/mcp-figma` returns no matches outside `changelog/`
- [x] T009 Diff figma's `allowed-tools` before/after; confirm no `Write`/`Edit` and `mutatesWorkspace:false` — `mode-registry.json`'s `mcp-figma` mode still grants only `Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain`, forbids `Write, Edit, Task`, and `mutatesWorkspace: false`
- [x] T010 Confirm `git status` shows renames; run phase-folder validation — `validate.sh .../005-foldin-clickup-and-figma --strict` reports `Errors: 0  Warnings: 0`, `RESULT: PASSED`
- [x] T011 Resolve every rewritten relative link (`../mcp-click-up`, `../mcp-figma`, `../sk-*`) from its containing file and confirm the target exists on disk, not just that the old path string is grep-absent — the one relative cross-skill pair found (`mcp-figma/references/troubleshooting.md` linking to `mcp-chrome-devtools/SKILL.md` and `mcp-code-mode/SKILL.md`) resolves correctly on disk
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both packets resolve under the hub with disk-verified relative links; figma transport surface and sk-design pairing preserved
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
