---
title: "Tasks: Per-mode arg grammar for /design:* wrappers"
description: "Ordered tasks to populate argumentHint per command in command-metadata.json, project it to the five wrappers, and pass the arg-grammar drift gate."
trigger_phrases:
  - "arg grammar tasks"
  - "per-mode argument hint tasks"
  - "design command arg grammar"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/002-per-mode-arg-grammar"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark all build tasks complete with evidence; canonicalize phase headers"
    next_safe_action: "Run the D2 invocation-example and return-contract phase next"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r2-per-mode-arg-grammar"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Per-mode arg grammar for /design:* wrappers

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

> Ground & populate the SSOT (30-45m)

- [x] T001 Confirm the command-metadata SSOT phase (D2-R3) landed: `command-metadata.json` exists with an `argumentHint` key per command and `design-command-surface-check.mjs` runs (`.opencode/skills/sk-design/`) [5m] — both present; sibling 003 landed them.
- [x] T002 Re-read the five command bodies (`.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md`) and confirm each still passes `$ARGUMENTS` straight to its mode [10m] — all five pass arguments through to the mode.
- [x] T003 [P] Re-read the five mode `SKILL.md` files and confirm the grounded grammar table matches the real positional/flag inputs each mode consumes (`.opencode/skills/sk-design/design-*/SKILL.md`) [15m] — grammar table §3 traced to each mode.
- [x] T004 Set `argumentHint` per command in `command-metadata.json` to the grounded values: md-generator `<live-url> --output <dir>`; audit `<target> [--scope] [--score]`; motion `<component-state> [--library]`; foundations `<axis> <target>`; interface `<target> [--mode]` (`.opencode/skills/sk-design/command-metadata.json`) [15m] — five values set as the SSOT.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Project the SSOT to the wrappers (15-20m)

- [x] T005 Replace `argument-hint: "<design request>"` with the md-generator metadata value `<live-url> --output <dir>` (`.opencode/commands/design/md-generator.md`) [3m] — line 3 now matches metadata.
- [x] T006 Replace `argument-hint: "<design request>"` with the audit metadata value `<target> [--scope] [--score]` (`.opencode/commands/design/audit.md`) [3m] — line 3 now matches metadata.
- [x] T007 Replace `argument-hint: "<design request>"` with the motion metadata value `<component-state> [--library]` (`.opencode/commands/design/motion.md`) [3m] — line 3 now matches metadata.
- [x] T008 Replace `argument-hint: "<design request>"` with the foundations metadata value `<axis> <target>` (`.opencode/commands/design/foundations.md`) [3m] — line 3 now matches metadata.
- [x] T009 Replace `argument-hint: "<design request>"` with the interface metadata value `<target> [--mode]` (`.opencode/commands/design/interface.md`) [3m] — line 3 now matches metadata.
- [x] T010 Confirm no other frontmatter key changed — `allowed-tools` (owned by D2-R1) and `description` stay untouched on all five files [5m] — only the `argument-hint` line changed per wrapper.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Drift gate, grammar confirmation, evergreen, and documentation (20-30m)

### Drift Gate
- [x] T011 Run `design-command-surface-check.mjs`; confirm the arg-grammar presence check passes (no surviving `<design request>`) [5m] — `STATUS=PASS`; no generic hint remains.
- [x] T012 Confirm each wrapper `argument-hint` is byte-equal to its `command-metadata.json` `argumentHint` (checker wrapper-equals-metadata assertion) [5m] — `drift=0`; all five match the SSOT.

### Grammar Confirmation
- [x] T013 Tokenize one example invocation per command against its grammar slots and record the parse table [10m] — five-row parse table (plan.md §5) parses clean.
- [x] T014 Grep the five `argumentHint` values + the five wrapper lines for spec/packet/phase IDs or spec paths; confirm zero (evergreen) [5m] — zero hits; evergreen clean.

### Documentation
- [x] T015 Mark all checklist.md items with evidence [5m] — all P0/P1/P2 verified with evidence.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining (D2-R3 precedence satisfied)
- [x] No wrapper retains the generic `<design request>`
- [x] Each wrapper `argument-hint` equals its metadata `argumentHint`
- [x] `design-command-surface-check.mjs` passes
- [x] One example invocation per command parses against its grammar
- [x] checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **SSOT precedence**: command-metadata SSOT phase (D2-R3)
- **Sequential coordination**: tool-policy phase (D2-R1, same wrapper files)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks (drift gate + example parse + evergreen lint)
-->
