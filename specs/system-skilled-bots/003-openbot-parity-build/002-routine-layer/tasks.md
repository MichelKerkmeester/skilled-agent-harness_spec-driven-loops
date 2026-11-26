---
title: "Tasks: Phase 2: routine-layer"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "routine layer tasks"
  - "routine block tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: routine-layer

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

Two shell variables, used by every verify clause below:

- `R` is `.skilled/skills/system-skilled-bots/runtime`, the folder every `npx vitest` and `npm` command runs in.
- `F` is `.skilled/skills/system-skilled-bots/scripts/fixtures`, the folder the checker fixtures live in.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the switch and trigger call sites the change touches (`scratch/setup-notes.md`). Verify: `rg -n 'readSwitch|SWITCH_KINDS' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts .skilled/skills/system-skilled-bots/runtime/lib/installer.ts | wc -l` prints 6.
- [ ] T002 Record the baseline suite result before any edit (`scratch/setup-notes.md`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0.
- [ ] T003 [P] Keep the measured fixture that proves no floor exists (`scratch/measured/`). Verify: `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/scratch/measured` exits 0.
- [ ] T004 [P] Confirm the cron translator and the period helper are importable from a new module (`.skilled/skills/system-skilled-bots/runtime/lib/routine.ts`). Verify: `rg -n 'export function schedulePeriodSeconds' .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts` prints one line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### The block

- [ ] T005 Create the routine module with its types and `parseRoutine` (`.skilled/skills/system-skilled-bots/runtime/lib/routine.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [ ] T006 Add `renderTrigger`, `describeStart` and `routineDelivery` to the routine module, `describeStart` rendering the `summary` phrase such as `every 6h` or `daily 02:00` that T019 hands to `activityReport` (`.skilled/skills/system-skilled-bots/runtime/lib/routine.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine.vitest.ts -t 'renderTrigger'` exits 0 and `rg -n 'export.*describeStart' .skilled/skills/system-skilled-bots/runtime/lib/routine.ts` names the export.
- [ ] T007 Add `checkRoutineFloor` with the 900-second bound (`.skilled/skills/system-skilled-bots/runtime/lib/routine.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine.vitest.ts -t 'floor'` exits 0.

### The state file and the fatigue count

- [ ] T008 Create the routine state module with the state file path and read/write (`.skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine-state.vitest.ts -t 'state file'` exits 0.
- [ ] T009 Add `recordUntilOutcome` to the routine state module (`.skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine-state.vitest.ts -t 'until'` exits 0.
- [ ] T010 Add `failureStreak` and `evaluateFatigue` to the routine state module, counting only dispatched runs that failed (a non-null `exit.class`, no `exit.refusal` and a reason other than `awaiting-decision`), recording `fatiguedAt` and the item id, and raising the item with the tenth failed run's id as its `runId` so `bots enable` can find and answer it (`.skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine-state.vitest.ts -t 'fatigue'` exits 0.
- [ ] T011 Name and create the identity's `routines` folder (`.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts`). Verify: `rg -c 'routines' .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` prints 2.
- [ ] T012 Add the `completed` switch kind (`.skilled/skills/system-skilled-bots/runtime/lib/switches.ts`). Verify: `rg -n 'SWITCH_KINDS' .skilled/skills/system-skilled-bots/runtime/lib/switches.ts` prints one line holding `completed`.

### The definition and the record

- [ ] T013 Accept the `routine` key, refuse it beside `trigger`, and derive `trigger` from `starts[0]` (`.skilled/skills/system-skilled-bots/runtime/lib/definition.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/definition.vitest.ts -t 'routine'` exits 0.
- [ ] T014 Carry the optional `until` observation on the run record (`.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/run-record.vitest.ts` exits 0.

### The runner hooks

- [ ] T015 Read the `completed` switch beside the `disabled` one before the lease (`.skilled/skills/system-skilled-bots/runtime/lib/runner.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts -t 'completed switch'` exits 0.
- [ ] T016 Run `until_check` through the precheck helper after a completed run, in the bound checkout or the identity's state root, and record the observation (`.skilled/skills/system-skilled-bots/runtime/lib/runner.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts -t 'until'` exits 0.
- [ ] T017 Evaluate the fatigue rule after a failed run (`.skilled/skills/system-skilled-bots/runtime/lib/runner.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts -t 'fatigue'` exits 0.

### The refusals and the verb

- [ ] T018 Refuse a sub-floor cron start in the install preflight, before anything is written (`.skilled/skills/system-skilled-bots/runtime/lib/installer.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/installer.vitest.ts -t 'floor'` exits 0.
- [ ] T019 Import `readSwitch` and insert `completed` into `BOT_ROW_STATES` after `held`, so the row state is read from the switch rather than inferred from the other flags. Then import `describeStart` and pass it to `activityReport` as its `describe` argument, so an activity row from an installed schedule carries its `schedule` phrase in place of 001's null (`.skilled/skills/system-skilled-bots/runtime/lib/status.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/status.vitest.ts -t 'completed'` exits 0, `rg -n 'completed' .skilled/skills/system-skilled-bots/runtime/lib/status.ts` names the state and the switch read, and `rg -n 'describeStart' .skilled/skills/system-skilled-bots/runtime/lib/status.ts` names the import and the `activityReport` call.
- [ ] T020 Add the nine routine invariants and the floor call to the checker (`.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`). Verify: `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-floor` exits 1 and prints `FAIL: routine-floor-15-minutes`.
- [ ] T021 Add the `routines` verb, and on `enable` clear `completed`, answer the fatigue item through `answerItem` with its no-resume option and clear the fatigue record (`.skilled/bin/bots.cjs`, `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t 'fatigue'` exits 0, `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t 'no resume'` exits 0 and `rg -c 'input.resume' .skilled/skills/system-skilled-bots/runtime/lib/answer.ts` prints at least 1.

### The docs the author and the reader use

- [ ] T022 Add the commented `routine` block to the shipped template (`.skilled/skills/system-skilled-bots/assets/bot-template.txt`). Verify: `rg -c 'routine' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints 1.
- [ ] T023 Name `routine` in the author reference's field list (`.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md`). Verify: `rg -n 'routine' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints one line.
- [ ] T024 Name `bots routines` in the status mode (`R`'s sibling `.skilled/skills/system-skilled-bots/bots-status/SKILL.md`). Verify: `rg -n 'bots routines' .skilled/skills/system-skilled-bots/bots-status/SKILL.md` prints one line.
- [ ] T025 Name the two new modules and their group in the runtime README (`.skilled/skills/system-skilled-bots/runtime/lib/README.md`). Verify: `rg -c 'routine.ts|routine-state.ts' .skilled/skills/system-skilled-bots/runtime/lib/README.md` prints 2.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Fixtures and contract tests

- [ ] T026 Add one defect fixture per new hard invariant and the clean fixture (`.skilled/skills/system-skilled-bots/scripts/fixtures/`). Verify: `ls .skilled/skills/system-skilled-bots/scripts/fixtures | rg -c '^routine-'` prints 10.
- [ ] T027 Extend the checker test with the new invariants and their fixtures (`.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/bot-check.vitest.ts` exits 0.
- [ ] T028 Extend the CLI test with the `routines` verb, its `--json` shape and its exit code (`.skilled/skills/system-skilled-bots/runtime/tests/cli-run.vitest.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts` exits 0.

### The whole gate

- [ ] T029 Run the whole runtime suite (`.skilled/skills/system-skilled-bots/runtime/`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0.
- [ ] T030 Run the checker over a clean routine fixture (`.skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean`). Verify: `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean` exits 0.
- [ ] T031 Run `bots routines --json` over a temp copy of the clean fixture and check the shape, including that a bot with no recorded outcome prints `untilMetAt` as null (`scratch/`). The copy is what isolates the run: `jobEnv` prefers an installed job's own environment over the shell's, so a pinned root in the shell is ignored on a host with jobs, while a checkout no job names resolves under `XDG_STATE_HOME` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:774-785]. Verify: `T=$(mktemp -d) && cp -R .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean "$T/checkout" && XDG_STATE_HOME="$T/state" node .skilled/bin/bots.cjs routines --json --repo "$T/checkout" | jq -e '(.routines | length == 2) and (.routines[0].botId != null) and (.routines[0].untilMetAt == null)'` exits 0. Also check that every key in `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/payloads/routines.json` appears in the real output with the same JSON type.

### The packet

- [ ] T032 Mark every acceptance criterion with the evidence that proves it (`acceptance-criteria.md`). Verify: `rg -c '\| Met \|' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/acceptance-criteria.md` prints the number of criteria rows.
- [ ] T033 Run the packet validator (`specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer --strict` prints `RESULT: PASSED`.
- [ ] T034 Count the streak from runs newer than `enabledAt`, and write `enabledAt` on `bots enable` (`.skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts`, `.skilled/skills/system-skilled-bots/runtime/tests/routine-state.vitest.ts`). The field and its absent default are `design/records.md` section 1, and the restart rule is `design/state-machines.md` section 2. Verify: `rg -c '^\| `enabledAt` \| string' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/records.md` prints 1, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine-state.vitest.ts -t 'enabledAt'` exits 0.
- [ ] T035 Make each fatigue and enable write safe to repeat, so a stop after the item write, after the state file write or after the enable's answer write is repaired by the next attempt (`.skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts`, `.skilled/skills/system-skilled-bots/runtime/tests/routine-state.vitest.ts`). The four rows and the repair each one needs are `design/state-machines.md` section 4. Verify: `rg -c '^\| [1-4] \| [^|]* \| [^|]* \| [^|]* \| [^|]* \|$' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/state-machines.md` prints 4, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine-state.vitest.ts -t 'interrupted'` exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 and `npm run typecheck` exits 0
- [ ] `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean` exits 0 and each of the nine defect fixtures exits 1 naming its invariant
- [ ] `node .skilled/bin/bots.cjs routines --repo .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean` prints one row per routine and exits 0, and `bots routines --json` prints one object with `version` and `routines`
- [ ] The five `design/` documents agree with the code: every refusal name in `design/refusals.md` is a string in the source, every fixture in `design/fixtures.md` exists, and every line in `design/mockups.md` is what the verb prints
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

A `[B]` task blocks close at any priority. A P1 item deferred needs the reason written beside it in this file.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Every requirement in `spec.md` has a row in `acceptance-criteria.md`. Verify: `rg -c 'REQ-0' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/acceptance-criteria.md` prints 13.
- [ ] CHK-002 [P0] Every requirement in `spec.md` is a table row, and the plan names every file the change touches. Verify: `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md` prints 11 and `rg -c '^\| `\.skilled' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md` prints 25.
- [ ] CHK-003 [P1] The cron translator and the period helper are unchanged and importable. Verify: `rg -n 'export function schedulePeriodSeconds' .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts` prints one line.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runtime typechecks. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [ ] CHK-011 [P0] Every new refusal is a named `Result` reason, never a throw. Verify: `rg -n "throw new Error" .skilled/skills/system-skilled-bots/runtime/lib/routine.ts .skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts` prints nothing.
- [ ] CHK-012 [P1] Every new refusal name has a test that asserts it. Verify: `rg -c 'routine-floor-15-minutes|routine-starts-empty|routine-starts-multiple-cron|routine-starts-cron-not-first|routine-starts-multiple|routine-trigger-conflict|routine-tell-with-targets|routine-until-check-without-outcome|routine-until-shell-metacharacters' .skilled/skills/system-skilled-bots/runtime/tests/routine.vitest.ts` prints 9 and `rg -c 'routine-fatigued' .skilled/skills/system-skilled-bots/runtime/tests/routine-state.vitest.ts` prints at least 1.
- [ ] CHK-013 [P1] The two new modules follow the group-import rule in `runtime/lib/README.md`. Verify: `rg -n "from './" .skilled/skills/system-skilled-bots/runtime/lib/routine.ts` prints only contracts-group imports.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is `Met` with evidence that was observed. Verify: `rg -c '\| Unmet \|' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/acceptance-criteria.md` prints 0.
- [ ] CHK-021 [P0] The whole runtime suite passes. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0.
- [ ] CHK-022 [P1] Each new hard invariant has a defect fixture that fails it. Verify: `ls .skilled/skills/system-skilled-bots/scripts/fixtures | rg -c '^routine-'` prints 10.
- [ ] CHK-023 [P1] The `until` timeout, spawn-failure and non-zero paths are each tested. Verify: `rg -c "timed out|cannot spawn|exit 1" .skilled/skills/system-skilled-bots/runtime/tests/routine-state.vitest.ts` prints at least 3.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret is written into the routine state file or the run record. Verify: `rg -n 'secret|token|password' .skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts` prints nothing.
- [ ] CHK-031 [P0] The `until` command runs through the precheck helper's process group and filtered environment. Verify: `rg -n 'runPrecheck' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints the definition and both call sites.
- [ ] CHK-032 [P1] The routine state file is written owner-only under the identity state root. Verify: `rg -n 'STATE_DIR_MODE|0o600' .skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts` prints at least one line.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md` and `plan.md` both name the floor refusal, so the two documents agree on the one refusal both carry. Verify: `rg -c 'routine-floor-15-minutes' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md` prints one line per file.
- [ ] CHK-041 [P1] Code comments keep the durable why and carry no packet, phase or task label. Verify: `rg -n 'phase 2|002-routine-layer|T0[0-9][0-9]' .skilled/skills/system-skilled-bots/runtime/lib/routine.ts .skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts` prints nothing.
- [ ] CHK-042 [P2] The runtime README names the two new modules. Verify: `rg -c 'routine.ts|routine-state.ts' .skilled/skills/system-skilled-bots/runtime/lib/README.md` prints 2.
- [ ] CHK-043 [P1] The five design documents agree with the code. Verify: `rg -c '^## ' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/records.md` prints 8, and `rg -c '^(sequenceDiagram|stateDiagram-v2)$' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/state-machines.md` prints 5, and `rg -c '^\| [0-9]+ \| `routine-' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/refusals.md` prints 11.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Every temporary fixture lives under `scratch/`. Verify: `git status --porcelain specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer | rg -v 'scratch/'` prints only the four packet docs.
- [ ] CHK-051 [P1] `scratch/` holds only the measured fixture and the setup notes. Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/scratch` prints `measured` and `setup-notes.md` and nothing else.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---
