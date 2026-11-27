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

Two shell variables shorten the paths below. Set them once per shell:

```bash
LIB=.skilled/skills/system-skilled-bots/runtime/lib
TESTS=.skilled/skills/system-skilled-bots/runtime/tests
```

`npm --prefix .skilled/skills/system-skilled-bots/runtime` and `node .skilled/bin/bots.cjs` are written in full at every use. A variable holding either one would need word splitting, which zsh does not do, so a shortened form would fail in the shell this packet is verified in.

**The design folder is read before the first edit.** `design/` holds six documents and twelve goldens that fix every shape this phase writes. Each task below names the one it needs. A builder that finds a shape the design folder does not fix stops and reports it rather than deciding it, because REQ-010 makes the folder the authority.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the measured gap before any edit (`.skilled/bin/bots.cjs`). Verify: `T=$(mktemp -d) && mkdir -p "$T/checkout/bots" && printf '{"stateRoot":"%s/state"}\n' "$T" > "$T/checkout/bots/config.json" && node .skilled/bin/bots.cjs status --repo "$T/checkout" | rg -c 'branch '` prints nothing and exits 1.
- [x] T002 Record the baseline suite so a later failure is this phase's (`runtime`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`.
- [x] T003 Record the baseline typecheck (`runtime`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0.
- [x] T004 Read the prompt builder and record the two line shapes it already has (`$LIB/dispatch.ts`). Verify: `rg -n 'export function checkoutLine|export function buildBotPrompt' $LIB/dispatch.ts` prints two lines.
- [x] T005 Read the dispatch path and record where the directory and the tree branch are known (`$LIB/runner.ts`). Verify: `rg -n 'const workDir = tree' $LIB/runner.ts` prints one line.
- [x] T006 Read the row formatter and record the part order it prints (`$LIB/status.ts`). Verify: `rg -n 'const parts = \[row.state' $LIB/status.ts` prints one line.
- [x] T007 Read the run summary and confirm it rides in a JSON column (`$LIB/status-index.ts`). Verify: `rg -n "SCHEMA_VERSION = '2'" $LIB/status-index.ts` prints one line.
- [x] T008 Read the design folder and record the shape each document fixes (`design/`). Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/design` prints six documents and `fixtures`, and `ls specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/design/fixtures` prints twelve goldens and `README.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### `dispatch.ts`, worker W1a

- [x] T009 [P] Write `workingPlaceLine` in both shapes, with and without a branch, and the prefix constant `Your working place is ` with its trailing space (`$LIB/dispatch.ts`). The two shapes are `design/prompt-line.md` section 1. Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- dispatch -t "^working place line both shapes$"` prints `Tests  1 passed`.
- [x] T010 [P] Add the `workingPlace` input to `buildBotPrompt` and emit the line after the spec-folder line and before the checkout line, in the shared order's working-place slot (`$LIB/dispatch.ts`). The slot is `contracts/prompt-sections.md` section 1.3 and the four slot assertions are `design/prompt-line.md` section 2. Verify: `rg -c 'workingPlace' $LIB/dispatch.ts` prints a number of 3 or more, and `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- dispatch -t "^working place line slot$"` prints `Tests  1 passed`.

### `isolation.ts` and `runner.ts`, worker W1b

- [x] T011 [P] Write `checkoutBranch`, returning the branch or null and never a refusal, through the module's existing `git` helper (`$LIB/isolation.ts`). The five git answers are `design/prompt-line.md` section 3. Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- isolation -t "^working place line worktree run$"` prints `Tests  1 passed`.
- [x] T012 [P] Resolve the branch after `workDir` and before the builder, and pass the working place on the dispatch path (`$LIB/runner.ts`). The order is `design/sequences.md` section 1. Verify: `rg -n 'checkoutBranch' $LIB/runner.ts` prints one import line and one call line.
- [x] T013 [P] Fill `evidence.branch` on the dispatch path only, so a refusal before the isolation step keeps its nulls (`$LIB/runner.ts`). The five run shapes are `design/records.md` section 3. Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner -t "^working place shared run branch$"` prints `Tests  1 passed`.
- [x] T014 [P] Add the working-place line to a resumed prompt that lacks it, replace the parked line when it names the same path, and refuse `resume-item-invalid` when the parked prompt names another path (`$LIB/runner.ts`). The three outcomes are `design/prompt-line.md` section 4. Verify: `rg -n 'workingPlaceLine' $LIB/runner.ts` prints one line, and `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner -t "^working place parked prompt same path$"` prints `Tests  1 passed`.

### `status-index.ts` and `status.ts`, worker W1c

- [x] T015 [P] Add `worktreePath` and `branch` to `RunSummary` and fill them in `summarizeRecord` (`$LIB/status-index.ts`). The two fields are `design/records.md` section 2. Verify: `rg -n 'worktreePath|branch:' $LIB/status-index.ts` prints the two interface lines and the two fill lines.
- [x] T016 [P] Add `worktreePath` and `branch` to `LastRun` and fill them in `lastRunOf`, reading each summary field as the value when it is a string and else null (`$LIB/status.ts`). The coalescing rule is `design/records.md` section 4. Verify: `rg -n 'worktreePath' $LIB/status.ts` prints the interface line and the fill line.
- [x] T017 [P] Append `branch <name>` and `worktree <path>` after every part the row already prints, in that order (`$LIB/status.ts`). The part order and the seven mockups are `design/status-row.md` sections 1 to 3. Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status -t "^working place row parts$"` prints `Tests  1 passed`.

### Tests

- [x] T018 [P] Write the dispatch cases: both shapes, no working place given, and the line's slot before the checkout line when the prompt carries one (`$TESTS/dispatch.vitest.ts`). The names are `working place line both shapes`, `working place line absent` and `working place line slot`, inside `describe('working place line')`. Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- dispatch -t "^working place line both shapes$"` prints `Tests  1 passed`, `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- dispatch -t "^working place line absent$"` prints `Tests  1 passed`, and `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- dispatch -t "^working place line slot$"` prints `Tests  1 passed`.
- [x] T019 [P] Write the isolation case: a worktree run's prompt names its tree and its branch, and the stub's `cwd` equals `evidence.worktreePath` (`$TESTS/isolation.vitest.ts`). The name is `working place line worktree run`, inside `describe('working place line')`. Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- isolation -t "^working place line worktree run$"` prints `Tests  1 passed`.
- [x] T020 [P] Write the runner cases: a shared run's branch, a detached HEAD, an unreadable branch, a refusal's two nulls and the three parked-prompt outcomes (`$TESTS/runner.vitest.ts`). The names are `working place shared run branch`, `working place detached head`, `working place unreadable branch`, `working place refusal records neither`, `working place parked prompt gains the line`, `working place parked prompt same path` and `working place parked prompt another path`, inside `describe('working place')`. Each reads the record through `recordFile`. Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner -t "^working place parked prompt another path$"` prints `Tests  1 passed`.
- [x] T021 [P] Write the index cases: both fields, and a summary written without them reading back null (`$TESTS/status-index.vitest.ts`). The name is `working place summary fields`, inside `describe('working place')`. Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status-index -t "^working place summary fields$"` prints `Tests  1 passed`.
- [x] T022 [P] Write the status cases: the row text, the JSON, and a row over an index built before the change (`$TESTS/status.vitest.ts`). The names are `working place row parts`, `working place json keys` and `working place old index`, inside `describe('working place')`. Each builds its own temp state root. Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status -t "^working place row parts$"` prints `Tests  1 passed`.

### Documentation, worker W2

- [x] T023 [P] Update the `dispatch.ts`, `isolation.ts` and `status.ts` rows (`$LIB/README.md`). Verify: `rg -n 'working place|checkout branch' $LIB/README.md` prints three lines.
- [x] T024 [P] Update what a row shows, naming `branch <name>` and `worktree <path>` (`.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md`). Verify: `rg -n 'branch <name>' .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T025 Run the whole runtime suite (`runtime`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`.
- [x] T026 Run the typecheck over every changed signature (`runtime`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0.
- [x] T027 Prove a worktree run's prompt and record (`$LIB/runner.ts`). Verify: the run's receipt holds `Your working place is` and its record's `evidence.branch` equals the tree's branch.
- [x] T028 Prove a shared run's record (`$LIB/runner.ts`). Verify: the record's `evidence.branch` equals `git -C <checkout> rev-parse --abbrev-ref HEAD`.
- [x] T029 Prove the status row and its JSON (`$LIB/status.ts`). Verify: `T=$(mktemp -d) && mkdir -p "$T/checkout/bots" && printf '{"stateRoot":"%s/state"}\n' "$T" > "$T/checkout/bots/config.json" && node .skilled/bin/bots.cjs status --repo "$T/checkout"` exits 0, and `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status -t "^working place json keys$"` prints `Tests  1 passed`.
- [x] T030 Prove an index built before the change still opens (`$LIB/status-index.ts`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status -t "^working place old index$"` prints `Tests  1 passed`.
- [x] T031 Prove no schema version moved (`$LIB/status-index.ts`). Verify: `rg -n "SCHEMA_VERSION = '2'" $LIB/status-index.ts` prints one line.
- [x] T032 Validate the packet (`specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints no `failed`, `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0 and `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status -t "^working place row parts$"` prints `Tests  1 passed`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Design folder**: See `design/`, whose six documents and twelve goldens fix every shape these tasks write
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

- [x] CHK-001 [P0] `T=$(mktemp -d) && mkdir -p "$T/checkout/bots" && printf '{"stateRoot":"%s/state"}\n' "$T" > "$T/checkout/bots/config.json" && node .skilled/bin/bots.cjs status --repo "$T/checkout" | rg -c 'branch '` prints nothing and exits 1 before the first edit.
- [x] CHK-002 [P0] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed` before the first edit.
- [x] CHK-003 [P1] `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0 before the first edit.
- [x] CHK-004 [P1] `ls specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/design` prints six documents and `fixtures` before the first edit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0 after the last edit.
- [x] CHK-011 [P0] `rg -n 'SCHEMA_VERSION = ' $LIB/status-index.ts` prints `'2'`, so no index needs a rebuild.
- [x] CHK-012 [P1] `rg -n 'export function checkoutBranch' $LIB/isolation.ts` prints one line, so the branch read lives in the module that already reads git state.
- [x] CHK-013 [P1] `rg -n 'workingPlaceLine' $LIB/dispatch.ts $LIB/runner.ts` prints the definition and its two call sites, so no third place builds the line.
- [x] CHK-014 [P1] `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- dispatch` asserts the working-place line sits after the spec-folder line and before the checkout line, so the shared order in `contracts/prompt-sections.md` section 1.3 holds and 005's memory block lands after it.
- [x] CHK-015 [P1] `rg -n 'Your working place is ' $LIB/dispatch.ts` prints the prefix constant with its trailing space, so the resumed-prompt check matches the text the builder emits.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`.
- [x] CHK-021 [P0] `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- isolation` asserts a worktree run's prompt names its tree and its branch, and the stub's `cwd` equals `evidence.worktreePath`.
- [x] CHK-022 [P1] `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner` covers a shared run's branch, a refusal's two nulls and a parked prompt that gains the line.
- [x] CHK-023 [P1] `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status status-index` covers the row text, the JSON and a summary written without the two fields.
- [x] CHK-024 [P1] `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner -t "^working place parked prompt same path$"` prints `Tests  1 passed`, so the three resumed-prompt outcomes are covered: absent, the same path and another path.
- [x] CHK-025 [P2] Every golden in `design/fixtures/` is read by the test `design/fixtures/README.md` names for it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `rg -n 'process\.env' $LIB/dispatch.ts` matches no new line, so the line carries no environment value.
- [x] CHK-031 [P0] The working-place line carries only a path, a branch and a run folder the runner produced, and the secret-literal check runs over the body, the resume question, the resume answer and the request prompt, so the composed prompt is never scanned and a path never refuses a run.
- [x] CHK-032 [P1] `rg -n 'token|secret|password' $LIB/dispatch.ts` matches only the existing secret-literal vocabulary and no new field.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `rg -n 'working place' specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/*.md` names the line in `spec.md`, `plan.md` and `tasks.md`.
- [x] CHK-041 [P1] `rg -n 'branch <name>' $LIB/README.md .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints one line in each file.
- [x] CHK-042 [P2] `rg -n 'worktree <path>' .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints one line.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] `git status --porcelain $LIB` lists only the five edited modules and `README.md`, and no new file.
- [x] CHK-051 [P1] `git status --porcelain .skilled/skills/system-skilled-bots/runtime/tests` lists only the five edited suites, and no new file.
- [x] CHK-052 [P1] `git status --porcelain specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure` lists only this phase's own documents and its `design/` folder, and no file outside it.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 15 | 15/15 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-11-27
<!-- /ANCHOR:summary -->

---
