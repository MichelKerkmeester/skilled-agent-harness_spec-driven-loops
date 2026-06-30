---
title: "Tasks: D5-R1 — Design Standards Loading ALWAYS rule (twin of code-standards)"
description: "Ordered append-only insertion + verification tasks for the Design Standards Loading ALWAYS rule across the 3 cli-* SKILLs under GLM-5.2 concurrency."
trigger_phrases:
  - "d5-r1 tasks"
  - "design standards loading tasks"
  - "cli design rule insertion tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/001-design-standards-always-rule"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all D5-R1 insertion and verification tasks complete"
    next_safe_action: "Regenerate generated metadata after doc sync"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r1-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: D5-R1 — Design Standards Loading ALWAYS rule (twin of code-standards)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-read the unique anchor `Code Standards Loading (surface-aware contract)` + the next ALWAYS item in `cli-codex/SKILL.md` (`.opencode/skills/cli-codex/SKILL.md`) [3m] — anchor confirmed
- [x] T002 Re-read the same anchor + next item in `cli-claude-code/SKILL.md` (`.opencode/skills/cli-claude-code/SKILL.md`) [3m] — anchor confirmed
- [x] T003 Re-read the same anchor + next item in `cli-opencode/SKILL.md` (`.opencode/skills/cli-opencode/SKILL.md`) — CONTENT match only; line may have shifted under GLM WIP [3m] — content match confirmed
- [x] T004 Capture baseline `git status --porcelain` + per-file blob SHA for all three targets; confirm `cli-opencode` is dirty, the other two clean [2m] — codex/claude-code clean, opencode dirty
- [x] T005 Confirm baseline `grep -c "sk-design"` returns `0` in all three target files (the "today it does not appear" precondition) [1m] — baseline 0 confirmed

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Clean files first
- [x] T006 Insert the twin rule into `cli-claude-code/SKILL.md` as ALWAYS item `10`, immediately after code-standards (`9`); renumber `10→11` (Single-dispatch), `11→12` (AI_SESSION_CHILD). No other change. (`.opencode/skills/cli-claude-code/SKILL.md`) [5m] — inserted, diff clean
- [x] T007 Insert the twin rule into `cli-codex/SKILL.md` as ALWAYS item `12`, immediately after code-standards (`11`); renumber `12→13` (Single-dispatch), `13→14` (AI_SESSION_CHILD). No other change. (`.opencode/skills/cli-codex/SKILL.md`) [5m] — inserted, diff clean

### Dirty file last (isolated)
- [x] T008 Re-confirm `cli-opencode/SKILL.md` anchor by CONTENT, then insert the twin as ALWAYS item `13`, immediately after code-standards (`12`); renumber `13→14` (Destructive-scope RM-8), `14→15` (Single-dispatch), `15→16` (AI_SESSION_CHILD). No other change. (`.opencode/skills/cli-opencode/SKILL.md`) [10m] — inserted, design hunk isolated
- [x] T009 Do NOT `git add` `cli-opencode/SKILL.md` while it carries unstaged GLM-5.2 hunks; isolate the design hunk per checklist CHK-031 / plan §7 HALT condition 2 [included] — left for `git apply --cached` of the single design hunk

> The inserted text is IDENTICAL across T006–T008 except the leading list number. Exact text: see `plan.md` §3 "Exact rule text".

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Presence + routing token
- [x] T010 `grep -c "Design Standards Loading (surface-aware contract)"` returns `1` in each of the three files [2m] — 1 each
- [x] T011 `grep -c "sk-design"` returns `>= 1` in each of the three files (was `0` at T005) [2m] — 1 each

### Byte-unchanged + parallelism
- [x] T012 `git diff .opencode/skills/cli-claude-code/SKILL.md` shows exactly one added rule block + `10→11`,`11→12` renumber, nothing else [3m] — verified
- [x] T013 `git diff .opencode/skills/cli-codex/SKILL.md` shows exactly one added rule block + `12→13`,`13→14` renumber, nothing else [3m] — verified
- [x] T014 For `cli-opencode/SKILL.md`, isolate the design hunk from GLM hunks and confirm it is exactly one added rule block + `13→14`,`14→15`,`15→16` renumber; GLM WIP unchanged [3m] — verified, GLM hunk separate
- [x] T015 Confirm each twin sits on the line directly after its code-standards rule (content-adjacent, "beside") [1m] — content-adjacent in all three

### Evergreen + cross-ref integrity
- [x] T016 `grep -nE "specs/|packet|phase[ -]|ADR-|REQ-|task-[0-9]|finding"` over the inserted block in all three files returns NOTHING (evergreen [HARD]) [1m] — clean
- [x] T017 Confirm `cli-opencode` ALWAYS rule 8's `(see ALWAYS rule 12)` still resolves to code-standards (number preserved) [included] — number preserved

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `sk-design` now present in all 3 cli-* dispatch contracts (was absent)
- [x] Each file byte-unchanged except the inserted rule + minimal renumber
- [x] GLM-5.2 workstream edits not clobbered
- [x] checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md` (exact rule text in §3, HALT conditions in §7)
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Append-only insertion across 3 cli-* SKILLs
- Verification includes grep (sk-design presence) + byte-unchanged diff + evergreen scan
-->
