---
title: "Tasks: Rename session relaunch to session handover"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "session handover rename tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Rename session relaunch to session handover

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`H` is `.skilled/hooks/session-handover`. `X` is the git pathspec `':!specs/**' ':!**/changelog/**' ':!**/benchmark/reports/**' ':!**/z_archive/**'`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the inventory (repository). Verify: `git grep -l -I -i -E "session[-_ ]?relaunch" -- . X | wc -l` printed 135 before the rename.
- [x] T002 Record the baseline counts (`scratch/gate.sh`). Verify: relaunch 1,567, flags 30, Pi 67, goal 203, Vibe 48, doctor 17, spec gate 107, writer 75.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Move the hook folder and the 13 files named after the feature (`H`, `.opencode/plugins/`, `.pi/extensions/`, the playbooks and catalog). Verify: `git status --short | grep -c '^R'` counts the renames.
- [x] T004 Rewrite every live form with the word map (130 files). Verify: the inventory grep, with `NNN-session-relaunch` and `--session-relaunch` lines dropped, prints 0.
- [x] T005 Re-point the nine mirror links (`.claude/hooks/`, `.codex/hooks/`, `H/opencode/`). Verify: every link resolves with `test -e`.
- [x] T006 Re-render the registrations (`.claude/settings.json`, `.codex/hooks.json`). Verify: `rg -c session-handover .claude/settings.json` prints a count above 0.
- [x] T007 Regenerate the trigger index and rebuild the advisor (`generate-trigger-index.mjs`, `npm run build`). Verify: both exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the gate (`scratch/gate.sh`). Verify: every count matches T002, and hook sync and mirror sync print PASS.
- [x] T009 Run the advisor command tests and the bridge check. Verify: 14 of 14 pass and `derive-command-bridges --check` reports no changes.
- [x] T010 Run one live Claude Code hop (`scratch/harness/live-hop.sh claude rename1`). Verify: `score.cjs` prints `5/5`.
- [x] T012 Rename every in-session form to the short main name (`scratch/rename2.pl`, 13 paths, 130 files). Verify: the in-session grep outside history lists only two false matches.
- [x] T013 Read the in-session switch spelling while the main switch is blank (`hook-flags.cjs`, `hook-flags.sh`, `hook-flags.test.cjs`). Verify: `node --test hook-flags.test.cjs` prints 31 pass, 0 fail.
- [x] T014 Add three owned signals to `/speckit:handoff` (`command-metadata.json`) and regenerate the bridges. Verify: the advisor names `/speckit:handoff` for all three phrasings, and none on main.
- [x] T015 Retitle the parent goal and spec (`../goal.md`, `../spec.md`). Verify: both H1s read "Session handover loop".
- [x] T016 Run one live Claude Code hop on the short names (`live-hop.sh claude short1`). Verify: `score.cjs` prints `5/5`.
- [x] T011 Write the release note through `/create:changelog skilled`. Verify: the entry names the old and new variables and the state folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The live hop scored 5/5
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The inventory and baseline are in `spec.md` and T002
- [x] CHK-002 [P0] The word map and the protected names are in `plan.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The Pi type check exits 0 with `tsc -p tsconfig.pi.json`
- [x] CHK-011 [P0] No code comment carries a spec or phase id: the rename added none
- [x] CHK-012 [P1] The word map never produced `IN_SESSION_RELAUNCH` or "a in-session": `rg -c 'IN_SESSION_RELAUNCH|a in-session'` prints nothing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every suite prints its baseline count
- [x] CHK-021 [P0] The live Claude Code hop scored 5/5
- [x] CHK-022 [P1] The protected spec-folder names still read `002-session-relaunch-loop`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] N/A. The rename reads no secret and adds no input.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same counts
- [x] CHK-041 [P1] The release note names the old and new variables and the state folder
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The harness and run logs live under `scratch/`
- [x] CHK-051 [P1] The empty `relative-repo/` folders the tests leak are deleted
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---
