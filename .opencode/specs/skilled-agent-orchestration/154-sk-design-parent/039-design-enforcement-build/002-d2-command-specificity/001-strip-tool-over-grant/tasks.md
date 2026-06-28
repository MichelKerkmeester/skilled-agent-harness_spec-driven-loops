---
title: "Tasks: Strip tool over-grant from the read-and-guide /design:* wrappers"
description: "Ordered task list to align the four read-and-guide /design:* wrapper allowed-tools with the command-metadata.json toolPolicy SSOT and verify tool-policy parity."
trigger_phrases:
  - "d2-r1 tool over-grant tasks"
  - "strip write edit bash design wrappers"
  - "tool-policy parity tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/001-strip-tool-over-grant"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark all build tasks complete with one-line evidence; canonicalize phase headers"
    next_safe_action: "Run D2-R2 to write per-command argument-hint and aliases to the wrappers"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r1-strip-tool-over-grant"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Strip tool over-grant from the read-and-guide /design:* wrappers

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

> Confirm the SSOT (15m)

- [x] T001 Confirm D2-R3 has landed: `command-metadata.json` and `design-command-surface-check.mjs` both exist (`.opencode/skills/sk-design/`) [5m] — both present.
- [x] T002 Read `toolPolicy.mutatesWorkspace` for every command in `command-metadata.json`; record the four `false` (interface, foundations, motion, audit) and the one `true` (md-generator) (`.opencode/skills/sk-design/command-metadata.json`) [5m] — four `false`, md-generator `true`.
- [x] T003 Read the five current wrapper `allowed-tools` lines to capture the baseline (`.opencode/commands/design/*.md`) [5m] — all five baselined at `Read, Write, Edit, Bash, Glob, Grep`.
  - **Verify**: Baseline recorded; all five currently read `Read, Write, Edit, Bash, Glob, Grep`.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Strip the over-grant (20m)

- [x] T004 [P] Set `allowed-tools: Read, Glob, Grep` in interface wrapper (`.opencode/commands/design/interface.md`) [5m] — line 4 now `Read, Glob, Grep`.
- [x] T005 [P] Set `allowed-tools: Read, Glob, Grep` in foundations wrapper (`.opencode/commands/design/foundations.md`) [5m] — line 4 now `Read, Glob, Grep`.
- [x] T006 [P] Set `allowed-tools: Read, Glob, Grep` in motion wrapper (`.opencode/commands/design/motion.md`) [5m] — line 4 now `Read, Glob, Grep`.
- [x] T007 [P] Set `allowed-tools: Read, Glob, Grep` in audit wrapper (`.opencode/commands/design/audit.md`) [5m] — line 4 now `Read, Glob, Grep`.
- [x] T008 Leave the md-generator wrapper `allowed-tools` untouched at `Read, Write, Edit, Bash, Glob, Grep` (`.opencode/commands/design/md-generator.md`) [0m] — byte-unchanged.
  - **Verify**: Only the `allowed-tools` line changed in each of the four wrappers; bridge prose (PURPOSE / INSTRUCTIONS / Return Status) untouched.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Parity, static, smoke, and documentation checks (15m)

### Tool-policy parity
- [x] T009 Run `design-command-surface-check.mjs`; confirm the four allowed-tools drifts cleared (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [5m] — surface drift dropped 14 → 10; no `mutatesWorkspace:false` command declares Write/Edit/Bash.
  - **Verify**: No `mutatesWorkspace:false` command declares Write/Edit/Bash; the four allowed-tools drifts are gone.

### Static checks
- [x] T010 Grep the four read-and-guide wrappers' `allowed-tools` lines; confirm no `Write`, `Edit`, or `Bash` remains [3m] — none remain.
- [x] T011 Grep `md-generator.md` `allowed-tools`; confirm `Write, Edit, Bash` are still present (unchanged) [2m] — still present.
- [x] T012 Confirm no spec/packet/phase IDs or spec paths were introduced into any wrapper file (evergreen) [2m] — evergreen clean.

### Smoke
- [x] T013 Confirm each of the four commands still loads its mode as a thin bridge (frontmatter parses; mode load step intact) [3m] — all four parse; bridge prose intact.
  - **Verify**: Each bridge still reads the hub `SKILL.md` and its mode packet without error.

### Documentation
- [x] T014 Mark all `checklist.md` items with evidence [5m] — all P0/P1/P2 verified with evidence.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `design-command-surface-check.mjs` no longer reports the four allowed-tools drifts (surface drift 14 → 10)
- [x] Four read-and-guide wrappers carry only `Read, Glob, Grep`
- [x] md-generator wrapper unchanged
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Confirm SSOT → strip 4 wrappers → verify parity
- md-generator frozen (T008)
- Verification per task
-->
