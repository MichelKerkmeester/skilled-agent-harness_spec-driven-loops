---
title: "Tasks: Move goal-opencode command into .opencode only and remove the .skilled/plugins symlink"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "opencode native surfaces tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Move goal-opencode command into .opencode only and remove the .skilled/plugins symlink

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`SYNC` is `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`. `OC` is `.opencode/commands`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the starting layout (`OC`, `.skilled/plugins`). Verify: `readlink .opencode/commands; readlink .skilled/plugins` printed `../.skilled/commands` and `../.opencode/plugins` on main.
- [x] T002 Record the mirror baseline (`SYNC`). Verify: `node SYNC --check` printed `PASS: 193 mirrors across 8 trees are in sync.` on main.
- [x] T003 [P] Record the suite baselines on main (`.opencode/plugins/tests/`, `quality-gate.test.cjs`). Verify: plugin suite 557 pass 0 fail; quality-gate 95/0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Replace the `OC` link with a real directory of per-entry links and move `goal-opencode.md` into it with a git rename (`OC`). Verify: `test -f .opencode/commands/goal-opencode.md -a ! -L .opencode/commands` exits 0.
- [x] T005 Generate and check the `opencode-commands` tree and register the native command (`SYNC`, `command-scope.cjs`). Verify: `node SYNC --check` prints `PASS: 202 mirrors across 9 trees are in sync.`
- [x] T006 [P] Ignore private command links (`.gitignore`). Verify: `git check-ignore -v .opencode/commands/local-skilled-alignment.md` prints `.gitignore:245:/.opencode/commands/local-*`.
- [x] T007 Delete `.skilled/plugins`, repoint the 19 browsability links at `.opencode/plugins/`, and rewrite 27 markdown links and the prose path references (about 100 files). Verify: `rg -l --hidden '\.skilled/plugins|\.skilled/commands/goal-opencode\.md' -g '!specs/**' -g '!.git' .` prints only a released changelog.
- [x] T008 Treat `<repo>/.opencode/plugins` as hub plugin code and rewrite the F21 tests (`sk-code-quality/scripts/quality-gate.cjs`). Verify: `quality-gate.test.cjs` 93/0; reverting the gate line makes F21b fail.
- [x] T009 [P] Count real `OC/*.md` files in the description budget (`audit_descriptions.py`). Verify: 40 commands, 6867 chars, same as main.
- [x] T010 Update the inventory and layout test (`.opencode/SYNC.md`, `opencode-compat-layout.test.cjs`, `.skilled/commands/README.txt`, `README.md`). Verify: `node --test .skilled/bin/tests/opencode-compat-layout.test.cjs` prints 20 pass, 0 fail, 1 skipped.
- [x] T011 [P] Rename leftover `/vision` examples to `/notes` (catalog-check fixture, `check_readme_references.py` and its pytest, `doctor-skill-budget.yaml`, sk-create-benchmark example). Verify: README checker pytest 28/28.
- [x] T012 Regenerate Hermes skill copies, raise frontmatter versions of 56 changed docs and regenerate the trigger index. Verify: `frontmatter-version.mjs bump --base HEAD --check` exits 0 and the trigger index `--check` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T013 Prove the check catches a missing link (`SYNC`). Verify: with `OC/deep` moved away, `node SYNC --check` exits 1 with `MISSING .opencode/commands/deep`.
- [x] T014 Run the mirror, plugin and catalog suites. Verify: `sync-runtime-mirrors.test.mjs` 3/3; `.opencode/plugins/tests/` 557/0; `command-catalog-mirror-check.cjs` prints `STATUS=OK`.
- [x] T015 Confirm OpenCode lists every command (`opencode-version-battery.cjs --family=v2 --root=.`). Verify: prints `PASS v2 command-listed: all 49 command files listed` and exits 0.
- [x] T016 Compare the gate battery G1-G20 and A1 on main and the worktree. Verify: identical except A1, fixed by regenerating the trigger index; G12 fails on both.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the v2 battery lists all 49 command files
- [x] `node SYNC --check` prints `PASS: 202 mirrors across 9 trees are in sync.`

Commit, merge to main and push are outside this task list and wait for the operator.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task stays `[B]` with its reason on the same line, and the packet does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-005 in section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md: per-entry links generated by `SYNC`
- [x] CHK-003 [P1] Dependencies identified and available: OpenCode v2.1.4 installed, battery runs
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `node --check` exits 0 for `sync-runtime-mirrors.cjs`, `command-scope.cjs` and `quality-gate.cjs`
- [x] CHK-011 [P0] `node SYNC --check` prints PASS with no drift line
- [x] CHK-012 [P1] A missing link is reported, not ignored: `--check` exits 1 with `MISSING .opencode/commands/deep`
- [x] CHK-013 [P1] `OC` follows the existing pattern of `.claude/commands`, a real directory the sync script fills
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met: every row in `acceptance-criteria.md` is `Met`
- [x] CHK-021 [P0] Manual testing complete: v2 battery prints `all 49 command files listed`
- [x] CHK-022 [P1] Edge case: a stray entry in `OC` is flagged while `goal-opencode.md` and the mirrored README are kept (new test in `sync-runtime-mirrors.test.mjs`, 3/3)
- [x] CHK-023 [P1] Error scenario: F21b in `quality-gate.test.cjs` fails when the `.opencode/plugins` gate line is reverted
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No credential added: the change moves links and path strings and edits two path-resolving scripts
- [x] CHK-031 [P0] Every link stays inside the repository: each `readlink` under `OC` starts `../../.skilled/commands/`
- [x] CHK-032 [P1] Auth/authz: N/A, no auth surface is touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same three changes: real `OC`, moved goal command, deleted `.skilled/plugins`
- [x] CHK-041 [P1] Plugin comments name `.opencode/plugins`: the old-path `rg` outside `specs/` finds only a released changelog
- [x] CHK-042 [P2] `README.md` line 1039 says `/goal-opencode` is authored in `.opencode/commands/`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion: it holds only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->

---



