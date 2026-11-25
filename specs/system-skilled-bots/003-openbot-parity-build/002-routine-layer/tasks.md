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
- [ ] T002 Record the baseline suite result before any edit (`scratch/setup-notes.md`). Verify: `cd $R && npm test` exits 0.
- [ ] T003 [P] Keep the measured fixture that proves no floor exists (`scratch/measured/`). Verify: `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/scratch/measured` exits 0.
- [ ] T004 [P] Confirm the cron translator and the period helper are importable from a new module (`$R/lib/routine.ts`). Verify: `rg -n 'export function schedulePeriodSeconds' .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts` prints one line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### The block

- [ ] T005 Create the routine module with its types and `parseRoutine` (`$R/lib/routine.ts`). Verify: `cd $R && npm run typecheck` exits 0.
- [ ] T006 Add `renderTrigger` and `routineDelivery` to the routine module (`$R/lib/routine.ts`). Verify: `cd $R && npx vitest run tests/routine.vitest.ts -t 'renderTrigger'` exits 0.
- [ ] T007 Add `checkRoutineFloor` with the 900-second bound (`$R/lib/routine.ts`). Verify: `cd $R && npx vitest run tests/routine.vitest.ts -t 'floor'` exits 0.

### The state file and the fatigue count

- [ ] T008 Create the routine state module with the state file path and read/write (`$R/lib/routine-state.ts`). Verify: `cd $R && npx vitest run tests/routine-state.vitest.ts -t 'state file'` exits 0.
- [ ] T009 Add `recordUntilOutcome` to the routine state module (`$R/lib/routine-state.ts`). Verify: `cd $R && npx vitest run tests/routine-state.vitest.ts -t 'until'` exits 0.
- [ ] T010 Add `failureStreak` and `evaluateFatigue` to the routine state module (`$R/lib/routine-state.ts`). Verify: `cd $R && npx vitest run tests/routine-state.vitest.ts -t 'fatigue'` exits 0.
- [ ] T011 Name and create the identity's `routines` folder (`$R/lib/state-root.ts`). Verify: `rg -c 'routines' .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` prints 2.
- [ ] T012 Add the `completed` switch kind (`$R/lib/switches.ts`). Verify: `rg -n 'SWITCH_KINDS' .skilled/skills/system-skilled-bots/runtime/lib/switches.ts` prints one line holding `completed`.

### The definition and the record

- [ ] T013 Accept the `routine` key, refuse it beside `trigger`, and derive `trigger` from `starts[0]` (`$R/lib/definition.ts`). Verify: `cd $R && npx vitest run tests/definition.vitest.ts -t 'routine'` exits 0.
- [ ] T014 Carry the optional `until` observation on the run record (`$R/lib/run-record.ts`). Verify: `cd $R && npx vitest run tests/run-record.vitest.ts` exits 0.

### The runner hooks

- [ ] T015 Read the `completed` switch beside the `disabled` one before the lease (`$R/lib/runner.ts`). Verify: `cd $R && npx vitest run tests/runner.vitest.ts -t 'completed switch'` exits 0.
- [ ] T016 Run `until` through the precheck helper after a completed run and record the observation (`$R/lib/runner.ts`). Verify: `cd $R && npx vitest run tests/runner.vitest.ts -t 'until'` exits 0.
- [ ] T017 Evaluate the fatigue rule after a failed run (`$R/lib/runner.ts`). Verify: `cd $R && npx vitest run tests/runner.vitest.ts -t 'fatigue'` exits 0.

### The refusals and the verb

- [ ] T018 Refuse a sub-floor cron start in the install preflight, before anything is written (`$R/lib/installer.ts`). Verify: `cd $R && npx vitest run tests/installer.vitest.ts -t 'floor'` exits 0.
- [ ] T019 Report the `completed` switch as a row state (`$R/lib/status.ts`). Verify: `cd $R && npx vitest run tests/status.vitest.ts -t 'completed'` exits 0.
- [ ] T020 Add the five routine invariants and the floor call to the checker (`.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`). Verify: `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-floor` exits 1 and prints `FAIL: routine-floor-15-minutes`.
- [ ] T021 Add the `routines` verb and clear `completed` on `enable` (`.skilled/bin/bots.cjs`). Verify: `node .skilled/bin/bots.cjs routines --repo $F/routine-clean` exits 0.

### The docs the author and the reader use

- [ ] T022 Add the commented `routine` block to the shipped template (`.skilled/skills/system-skilled-bots/assets/bot-template.txt`). Verify: `rg -c 'routine' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints 1.
- [ ] T023 Name `routine` in the author reference's field list (`.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md`). Verify: `rg -n 'routine' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints one line.
- [ ] T024 Name `bots routines` in the status mode (`R`'s sibling `.skilled/skills/system-skilled-bots/bots-status/SKILL.md`). Verify: `rg -n 'bots routines' .skilled/skills/system-skilled-bots/bots-status/SKILL.md` prints one line.
- [ ] T025 Name the two new modules and their group in the runtime README (`$R/lib/README.md`). Verify: `rg -c 'routine.ts|routine-state.ts' .skilled/skills/system-skilled-bots/runtime/lib/README.md` prints 2.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Fixtures and contract tests

- [ ] T026 Add one defect fixture per new hard invariant (`$F/`). Verify: `ls .skilled/skills/system-skilled-bots/scripts/fixtures | rg -c '^routine-'` prints 5.
- [ ] T027 Extend the checker test with the new invariants and their fixtures (`$R/tests/bot-check.vitest.ts`). Verify: `cd $R && npx vitest run tests/bot-check.vitest.ts` exits 0.
- [ ] T028 Extend the CLI test with the `routines` verb, its `--json` shape and its exit code (`$R/tests/cli-run.vitest.ts`). Verify: `cd $R && npx vitest run tests/cli-run.vitest.ts` exits 0.

### The whole gate

- [ ] T029 Run the whole runtime suite (`$R/`). Verify: `cd $R && npm test` exits 0.
- [ ] T030 Run the checker over a clean routine fixture (`$F/routine-clean`). Verify: `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-clean` exits 0.
- [ ] T031 Run `bots routines --json` over the clean fixture and check the shape (`scratch/`). Verify: `node .skilled/bin/bots.cjs routines --json --repo $F/routine-clean | jq -e '.[0].untilMetAt'` exits 0.

### The packet

- [ ] T032 Mark every acceptance criterion with the evidence that proves it (`acceptance-criteria.md`). Verify: `rg -c '\| Met \|' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/acceptance-criteria.md` prints the number of criteria rows.
- [ ] T033 Run the packet validator (`specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `cd $R && npm test` exits 0 and `npm run typecheck` exits 0
- [ ] `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-clean` exits 0 and each of the five defect fixtures exits 1 naming its invariant
- [ ] `node .skilled/bin/bots.cjs routines --repo $F/routine-clean` prints one row per routine and exits 0
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

- [ ] CHK-001 [P0] Every requirement in `spec.md` has a row in `acceptance-criteria.md`. Verify: `rg -c 'REQ-0' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/acceptance-criteria.md` prints at least 10.
- [ ] CHK-002 [P0] The plan names every file the change touches. Verify: `rg -c '^\| `\.skilled' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md` prints 22.
- [ ] CHK-003 [P1] The cron translator and the period helper are unchanged and importable. Verify: `rg -n 'export function schedulePeriodSeconds' .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts` prints one line.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runtime typechecks. Verify: `cd $R && npm run typecheck` exits 0.
- [ ] CHK-011 [P0] Every new refusal is a named `Result` reason, never a throw. Verify: `rg -n "throw new Error" .skilled/skills/system-skilled-bots/runtime/lib/routine.ts .skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts` prints nothing.
- [ ] CHK-012 [P1] Every new refusal name has a test that asserts it. Verify: `rg -c 'routine-floor-15-minutes|routine-starts-empty|routine-starts-multiple-cron|routine-starts-cron-not-first|routine-trigger-conflict|routine-tell-with-targets' $R/tests/routine.vitest.ts` prints 6.
- [ ] CHK-013 [P1] The two new modules follow the group-import rule in `runtime/lib/README.md`. Verify: `rg -n "from './" .skilled/skills/system-skilled-bots/runtime/lib/routine.ts` prints only contracts-group imports.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is `Met` with evidence that was observed. Verify: `rg -c '\| Unmet \|' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/acceptance-criteria.md` prints 0.
- [ ] CHK-021 [P0] The whole runtime suite passes. Verify: `cd $R && npm test` exits 0.
- [ ] CHK-022 [P1] Each new hard invariant has a defect fixture that fails it. Verify: `ls .skilled/skills/system-skilled-bots/scripts/fixtures | rg -c '^routine-'` prints 5.
- [ ] CHK-023 [P1] The `until` timeout, spawn-failure and non-zero paths are each tested. Verify: `rg -c "timed out|cannot spawn|exit 1" $R/tests/routine-state.vitest.ts` prints at least 3.
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

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same six refusals. Verify: `rg -c 'routine-floor-15-minutes' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md` prints one line per file.
- [ ] CHK-041 [P1] Code comments keep the durable why and carry no packet, phase or task label. Verify: `rg -n 'phase 2|002-routine-layer|T0[0-9][0-9]' .skilled/skills/system-skilled-bots/runtime/lib/routine.ts .skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts` prints nothing.
- [ ] CHK-042 [P2] The runtime README names the two new modules. Verify: `rg -c 'routine.ts|routine-state.ts' .skilled/skills/system-skilled-bots/runtime/lib/README.md` prints 2.
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
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---
