---
title: "Tasks: Phase 4: computer-exposure"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "computer exposure tasks"
  - "bot working place tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: computer-exposure

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

Two shell variables shorten the commands below. Set them once per shell:

```bash
LIB=.skilled/skills/system-skilled-bots/runtime/lib
RT="npm --prefix .skilled/skills/system-skilled-bots/runtime"
BOTS="node .skilled/bin/bots.cjs"
```
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the measured gap before any edit (`.skilled/bin/bots.cjs`). Verify: `$BOTS status | rg -c 'branch '` prints nothing and exits 1.
- [ ] T002 Record the baseline suite so a later failure is this phase's (`runtime`). Verify: `$RT test` prints a `Tests` line with no `failed`.
- [ ] T003 Record the baseline typecheck (`runtime`). Verify: `$RT run typecheck` exits 0.
- [ ] T004 Read the prompt builder and record the two line shapes it already has (`$LIB/dispatch.ts`). Verify: `rg -n 'export function checkoutLine|export function buildBotPrompt' $LIB/dispatch.ts` prints two lines.
- [ ] T005 Read the dispatch path and record where the directory and the tree branch are known (`$LIB/runner.ts`). Verify: `rg -n 'const workDir = tree' $LIB/runner.ts` prints one line.
- [ ] T006 Read the row formatter and record the part order it prints (`$LIB/status.ts`). Verify: `rg -n 'const parts = \[row.state' $LIB/status.ts` prints one line.
- [ ] T007 Read the run summary and confirm it rides in a JSON column (`$LIB/status-index.ts`). Verify: `rg -n "SCHEMA_VERSION = '2'" $LIB/status-index.ts` prints one line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Write `workingPlaceLine` in both shapes, with and without a branch (`$LIB/dispatch.ts`). Verify: `$RT test -- dispatch` prints no `failed` and names `workingPlaceLine`.
- [ ] T009 Add the `workingPlace` input to `buildBotPrompt` and emit the line above the bot body (`$LIB/dispatch.ts`). Verify: `rg -c 'workingPlace' $LIB/dispatch.ts` prints a number of 3 or more.
- [ ] T010 Write `checkoutBranch`, returning the branch or null and never a refusal (`$LIB/isolation.ts`). Verify: `$RT test -- isolation` prints no `failed` and names `checkoutBranch`.
- [ ] T011 Resolve the branch and pass the working place on the dispatch path (`$LIB/runner.ts`). Verify: `rg -n 'checkoutBranch' $LIB/runner.ts` prints one import line and one call line.
- [ ] T012 Fill `evidence.branch` on the dispatch path only, so a refusal keeps its nulls (`$LIB/runner.ts`). Verify: `$RT test -- runner` prints no `failed`.
- [ ] T013 Add the working-place line to a resumed prompt that lacks it, by exact-text check (`$LIB/runner.ts`). Verify: `rg -n 'workingPlaceLine' $LIB/runner.ts` prints one line.
- [ ] T014 Add `worktreePath` and `branch` to `RunSummary` and fill them in `summarizeRecord` (`$LIB/status-index.ts`). Verify: `rg -n 'worktreePath|branch:' $LIB/status-index.ts` prints the two interface lines and the two fill lines.
- [ ] T015 Add `worktreePath` and `branch` to `LastRun` and fill them in `lastRunOf` (`$LIB/status.ts`). Verify: `rg -n 'worktreePath' $LIB/status.ts` prints the interface line and the fill line.
- [ ] T016 Append `branch <name>` and `worktree <path>` after every part the row already prints (`$LIB/status.ts`). Verify: `$BOTS status --rebuild` prints a row whose last two parts are `branch <name>` and `worktree <path>` for a worktree run.
- [ ] T017 Write the dispatch cases: both shapes and no working place given (`runtime/tests/dispatch.vitest.ts`). Verify: `$RT test -- dispatch` prints no `failed`.
- [ ] T018 Write the isolation case: a worktree run's prompt names its tree and its branch (`runtime/tests/isolation.vitest.ts`). Verify: `$RT test -- isolation` prints no `failed`.
- [ ] T019 Write the runner cases: a shared run's branch, a refusal's nulls and a parked prompt without the line (`runtime/tests/runner.vitest.ts`). Verify: `$RT test -- runner` prints no `failed`.
- [ ] T020 Write the index cases: both fields, and a summary written without them reading back null (`runtime/tests/status-index.vitest.ts`). Verify: `$RT test -- status-index` prints no `failed`.
- [ ] T021 Write the status cases: the row text and the JSON (`runtime/tests/status.vitest.ts`). Verify: `$RT test -- status` prints no `failed`.
- [ ] T022 Update the `dispatch.ts`, `isolation.ts` and `status.ts` rows (`$LIB/README.md`). Verify: `rg -n 'working place|checkout branch' $LIB/README.md` prints three lines.
- [ ] T023 Update what a row shows (`.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md`). Verify: `rg -n 'branch <name>' .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T024 Run the whole runtime suite (`runtime`). Verify: `$RT test` prints a `Tests` line with no `failed`.
- [ ] T025 Run the typecheck over every changed signature (`runtime`). Verify: `$RT run typecheck` exits 0.
- [ ] T026 Prove a worktree run's prompt and record (`$LIB/runner.ts`). Verify: the run's receipt holds `Your working place is` and its record's `evidence.branch` equals the tree's branch.
- [ ] T027 Prove a shared run's record (`$LIB/runner.ts`). Verify: the record's `evidence.branch` equals `git -C <checkout> rev-parse --abbrev-ref HEAD`.
- [ ] T028 Prove the status row and its JSON (`$LIB/status.ts`). Verify: `$BOTS status` prints `branch <name>` on that row and `$BOTS status --json` carries `lastRun.branch`.
- [ ] T029 Prove an index built before the change still opens (`$LIB/status-index.ts`). Verify: `$BOTS status` exits 0 without `--rebuild`.
- [ ] T030 Prove no schema version moved (`$LIB/status-index.ts`). Verify: `rg -n "SCHEMA_VERSION = '2'" $LIB/status-index.ts` prints one line.
- [ ] T031 Validate the packet (`specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `$RT test` prints no `failed`, `$RT run typecheck` exits 0, and `$BOTS status` prints `branch <name>` on a row whose last run recorded one
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] `$BOTS status | rg -c 'branch '` prints nothing and exits 1 before the first edit.
- [ ] CHK-002 [P0] `$RT test` prints a `Tests` line with no `failed` before the first edit.
- [ ] CHK-003 [P1] `$RT run typecheck` exits 0 before the first edit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `$RT run typecheck` exits 0 after the last edit.
- [ ] CHK-011 [P0] `rg -n 'SCHEMA_VERSION = ' $LIB/status-index.ts` prints `'2'`, so no index needs a rebuild.
- [ ] CHK-012 [P1] `rg -n 'export function checkoutBranch' $LIB/isolation.ts` prints one line, so the branch read lives in the module that already reads git state.
- [ ] CHK-013 [P1] `rg -n 'workingPlaceLine' $LIB/dispatch.ts $LIB/runner.ts` prints the definition and its two call sites, so no third place builds the line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] `$RT test` prints a `Tests` line with no `failed`.
- [ ] CHK-021 [P0] `$RT test -- isolation` asserts a worktree run's prompt names its tree and its branch.
- [ ] CHK-022 [P1] `$RT test -- runner` covers a shared run's branch, a refusal's nulls and a parked prompt without the line.
- [ ] CHK-023 [P1] `$RT test -- status status-index` covers the row text, the JSON and a summary written without the two fields.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `rg -n 'process\.env' $LIB/dispatch.ts` matches no new line, so the line carries no environment value.
- [ ] CHK-031 [P0] The working-place line is added after the secret-literal check runs, so a path the runner produced never refuses a run.
- [ ] CHK-032 [P1] `rg -n 'token|secret|password' $LIB/dispatch.ts` matches only the existing secret-literal vocabulary and no new field.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `rg -n 'working place' specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/*.md` names the line in `spec.md`, `plan.md` and `tasks.md`.
- [ ] CHK-041 [P1] `rg -n 'branch <name>' $LIB/README.md .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints one line in each file.
- [ ] CHK-042 [P2] `rg -n 'worktree <path>' .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints one line.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] `git status --porcelain $LIB` lists only the five edited modules and `README.md`, and no new file.
- [ ] CHK-051 [P1] `git status --porcelain .skilled/skills/system-skilled-bots/runtime/tests` lists only the five edited suites, and no new file.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---
