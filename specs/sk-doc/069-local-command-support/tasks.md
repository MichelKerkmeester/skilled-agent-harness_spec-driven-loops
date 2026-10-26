---
title: "Tasks: Support git-ignored local-* commands in every runtime"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "local command support tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Support git-ignored local-* commands in every runtime

<!-- SPECKIT_LEVEL: 1 -->

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

Commands run from the repository root, and every git call passes `-c core.fsmonitor=false`. `T` is `.skilled/commands/doctor/scripts/tests/command-catalog-mirror-check.test.cjs`. `H` is `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`. `C` is `.skilled/skills/system-spec-kit/runtime/cli`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baselines (`$T`, `$H`). Verify: `node --test $T` printed `pass 11`, and `bash $H` printed `pre-commit gates: 134 passed, 0 failed`.
- [x] T002 Record the mirror baseline (`$C`). Verify: `node $C/runtime-mirrors/sync-runtime-mirrors.cjs --check` printed `PASS: 194 mirrors across 8 trees are in sync.` and `node $C/codex/sync-prompts.cjs --check` printed `PASS: 38 prompts are in sync.`
- [x] T003 Confirm no tracked path matches the new command pattern (`git ls-files`). Verify: `git ls-files | grep -E '^\.(skilled|opencode|claude|cursor)/commands/(assets/)?local-|^\.(codex|pi|hermes)/prompts/local-'` exits 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the seven `local-*` command ignore rules (`.gitignore`). Verify: `git check-ignore -v --no-index .skilled/commands/local-probe.md .hermes/prompts/local-probe.md` prints `.gitignore:250:/.skilled/commands/local-*` and `.gitignore:256:/.hermes/prompts/local-*`.
- [x] T005 Skip a `local-*` root command or namespace (`command-catalog-mirror-check.cjs`). Verify: `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` exits 0 and prints `STATUS=OK command-catalog-mirror`.
- [x] T006 [P] Add the skip case and the `localize.md` boundary case (`$T`). Verify: `node --test $T` prints `pass 13` and `fail 0`.
- [x] T007 Add `PRIVATE_COMMAND_RE` to the guard (`.skilled/scripts/git-hooks/pre-commit`). Verify: `/bin/bash -n .skilled/scripts/git-hooks/pre-commit` exits 0, and the pattern matches 8 private paths and none of the 119,716 tracked paths on bash 3.2.
- [x] T008 [P] Add cases 82 and 83 (`$H`). Verify: `bash $H` prints `pre-commit gates: 145 passed, 0 failed`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the new catalog case against the `HEAD` checker (negative control). Verify: `node --test` on a copy of `$T` beside the `HEAD` checker prints `fail 1`.
- [x] T010 Run the harness against the `HEAD` hook (negative control). Verify: it prints `pre-commit gates: 136 passed, 9 failed`.
- [x] T011 With a local command present, run the four generators (`$C`). Verify: they print `Linked 2`, then `Wrote 1 of 39` for Codex, Pi and Hermes.
- [x] T012 Run every mirror check with the local command present (`$C`, `.skilled/commands/doctor/scripts`). Verify: all twelve exit 0, including `PASS: 196 mirrors across 8 trees` and `PASS: 39 prompts are in sync` for Codex, Pi and Hermes.
- [x] T013 Probe the ignore rules (`.gitignore`). Verify: `git check-ignore -v --no-index` on eight `local-probe` paths exits 0, and on `.skilled/commands/doctor/local-notes.md .skilled/commands/localize.md .codex/prompts/create-local-x.md` exits 1.
- [x] T014 Confirm the tracked change names no private command (`rg`). Verify: `rg -n -i` for the private name over the five tracked files and this folder prints nothing.
- [x] T015 Validate the packet (`specs/sk-doc/069-local-command-support`). Verify: `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/069-local-command-support --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: both suites green and every mirror check at exit 0 with a local command present
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Precedent**: `specs/sk-code/013-private-surface-skills`
<!-- /ANCHOR:cross-refs -->

---
