---
title: "Tasks: Phase 1: activity-and-actor"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "activity and actor tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: activity-and-actor

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

Two shell variables this list uses: `RT` is `.skilled/skills/system-skilled-bots/runtime` and `BOTS` is `node .skilled/bin/bots.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the current index schema version (`$RT/lib/status-index.ts`). Verify: `rg -n "SCHEMA_VERSION = " $RT/lib/status-index.ts` prints `const SCHEMA_VERSION = '2';`
- [ ] T002 Record the current verb list and option sets (`$RT/../bin/bots.cjs`). Verify: `rg -n "VERB_SPECS|FLAG_OPTIONS" .skilled/bin/bots.cjs` prints both declarations and no `activity` entry
- [ ] T003 Record the current needs-you item keys (`$RT/lib/needs-you.ts`). Verify: `rg -n "ITEM_KEYS" $RT/lib/needs-you.ts` prints the declaration and no `'by'` entry
- [ ] T004 Record the current run record shape (`$RT/lib/run-record.ts`). Verify: `rg -n "FIELD_GROUPS" $RT/lib/run-record.ts` prints the eight group names and no `actor`
- [ ] T005 Capture the baseline suite result (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` count
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Create the grouping module with the seven ids and their order (`$RT/lib/activity.ts`). Verify: `rg -n "needs_you|recurring" $RT/lib/activity.ts` prints the id list in OpenBot's order
- [ ] T007 Add the row-to-group rule and the empty-group omission (`$RT/lib/activity.ts`). Verify: `rg -n "filter" $RT/lib/activity.ts` prints the empty-group filter
- [ ] T008 Create the actor resolver with the name pattern and the three sources (`$RT/lib/actor.ts`). Verify: `rg -n "ACTOR_PATTERN|resolveActor" $RT/lib/actor.ts` prints both
- [ ] T009 Add `by` to the answer and to the item's key list (`$RT/lib/needs-you.ts`). Verify: `rg -n "'by'" $RT/lib/needs-you.ts` prints the key and its check
- [ ] T010 Write the actor as the answer's `by` (`$RT/lib/answer.ts`). Verify: `rg -n "actor" $RT/lib/answer.ts` prints the input field and the write
- [ ] T011 Add `actor` to the run record and read a missing one as null (`$RT/lib/run-record.ts`). Verify: `rg -n "actor" $RT/lib/run-record.ts` prints the field, the check and the null default
- [ ] T012 Add the `actor` column and bump the schema version (`$RT/lib/status-index.ts`). Verify: `rg -n "SCHEMA_VERSION = " $RT/lib/status-index.ts` prints `const SCHEMA_VERSION = '3';`
- [ ] T013 Carry the actor on `RunRow` and index it (`$RT/lib/status-index.ts`). Verify: `rg -n "actor" $RT/lib/status-index.ts` prints the row field, the insert and the select
- [ ] T014 Fill the record's actor at dispatch (`$RT/lib/runner.ts`). Verify: `rg -n "actor" $RT/lib/runner.ts` prints the fill
- [ ] T015 Pin the operator into the job environment (`$RT/lib/plist-render.ts`). Verify: `rg -n "OPERATOR" $RT/lib/plist-render.ts` prints the render and the read-back
- [ ] T016 Pass the installing operator into the pinned values (`$RT/lib/installer.ts`). Verify: `rg -n "operator" $RT/lib/installer.ts` prints the pinned value
- [ ] T017 Add the `activity` verb and its `--json` flag (`.skilled/bin/bots.cjs`). Verify: `$BOTS activity` exits 0
- [ ] T018 Add `--json` to `inbox` (`.skilled/bin/bots.cjs`). Verify: `$BOTS inbox --json` exits 0 and prints a JSON object
- [ ] T019 Add `--as` to `answer` and `run` (`.skilled/bin/bots.cjs`). Verify: `$BOTS answer item-1 yes --as ada` prints `bots: item-unknown: item-1`, not `unknown option`
- [ ] T020 Create the grouping tests (`$RT/tests/activity.vitest.ts`). Verify: `cd $RT && npx vitest run tests/activity.vitest.ts` prints no `failed`
- [ ] T021 Create the actor tests covering the twelve-row matrix (`$RT/tests/actor.vitest.ts`). Verify: `cd $RT && npx vitest run tests/actor.vitest.ts` prints no `failed`
- [ ] T022 Extend the needs-you and answer tests (`$RT/tests/needs-you.vitest.ts`, `$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/needs-you.vitest.ts tests/answer.vitest.ts` prints no `failed`
- [ ] T023 Extend the run-record and status-index tests (`$RT/tests/run-record.vitest.ts`, `$RT/tests/status-index.vitest.ts`). Verify: `cd $RT && npx vitest run tests/run-record.vitest.ts tests/status-index.vitest.ts` prints no `failed`
- [ ] T024 Extend the CLI tests (`$RT/tests/cli-run.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-run.vitest.ts` prints no `failed`
- [ ] T025 Write the MIT notice for the two lifted files (`THIRD_PARTY_NOTICES.md`). Verify: `rg -n "activity-groups.ts|activity-rows.ts" THIRD_PARTY_NOTICES.md` prints two lines
- [ ] T026 Add the two module rows to the runtime README (`$RT/lib/README.md`). Verify: `rg -n "activity.ts|actor.ts" $RT/lib/README.md` prints two rows
- [ ] T027 Name the activity verb and the JSON inbox in the status reference (`.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md`). Verify: `rg -n "bots activity|inbox --json" .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints both
- [ ] T028 Add the activity verb to the status mode's allowed Bash (`.skilled/skills/system-skilled-bots/bots-status/SKILL.md`). Verify: `rg -n "bots activity" .skilled/skills/system-skilled-bots/bots-status/SKILL.md` prints the line
- [ ] T029 Document `--as` on `bots answer` (`.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md`). Verify: `rg -n -- "--as" .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` prints the option
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Run the whole runtime suite (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [ ] T031 Prove the three CLI surfaces against the live state root (`.skilled/bin/bots.cjs`). Verify: `$BOTS activity` exits 0 and `$BOTS inbox --json` exits 0
- [ ] T032 Prove the actor round-trip on a temporary state root (`$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "by"` prints one passing test
- [ ] T033 Prove an index built before the bump still reads (`$RT/tests/status-index.vitest.ts`). Verify: `cd $RT && npx vitest run tests/status-index.vitest.ts -t "schema"` prints one passing test
- [ ] T034 Run the packet validator (`specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `$BOTS activity` prints at least one group heading and exits 0
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

A blocked task is marked `[B]` with the reason on the same line, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md` prints 7
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md` prints one line
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `cd $RT && npx vitest --version` exits 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runtime type-checks. Verify: `cd $RT && npx tsc --noEmit` exits 0
- [ ] CHK-011 [P0] The two new modules print nothing. Verify: `rg -n 'console\.(log|error)' $RT/lib/activity.ts $RT/lib/actor.ts` prints nothing
- [ ] CHK-012 [P1] Error handling implemented. Verify: `rg -n 'ok: false' $RT/lib/actor.ts` prints the refusals
- [ ] CHK-013 [P1] Code follows project patterns. Verify: `rg -n 'Result<' $RT/lib/activity.ts $RT/lib/actor.ts` prints the return types
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor --strict` prints `RESULT: PASSED`
- [ ] CHK-021 [P0] Manual testing complete. Verify: `$BOTS activity` exits 0
- [ ] CHK-022 [P1] Edge cases tested. Verify: `cd $RT && npx vitest run tests/actor.vitest.ts -t "adversarial"` prints one passing test
- [ ] CHK-023 [P1] Error scenarios validated. Verify: `cd $RT && npx vitest run tests/status-index.vitest.ts -t "schema"` prints one passing test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

The plan's affected-surfaces addendum is active because this phase changes a persisted schema and a stored record shape. These rows verify the inventories it names.

- [ ] CHK-FIX-001 [P0] Each changed surface names its class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Verify: `rg -c '^\| .*runtime/lib/' specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md` prints 9
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `rg -n 'writeRunRecord|answeredAt' $RT/lib/` prints every writer of a record and of an answer
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed symbols. Verify: `rg -n 'NeedsYouAnswer|RunRecord|RunRow|SCHEMA_VERSION' $RT --glob '*.ts'` prints every reader
- [ ] CHK-FIX-004 [P0] The actor's adversarial cases are tested. Verify: `rg -n 'adversarial' $RT/tests/actor.vitest.ts` prints the case block
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: `rg -n 'Matrix axes' specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md` prints the twelve-row line
- [ ] CHK-FIX-006 [P1] The hostile-environment variant ran. Verify: `cd $RT && npx vitest run tests/actor.vitest.ts -t "pinned"` prints one passing test
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a commit, not a moving branch. Verify: `git rev-parse --short HEAD` prints the commit the evidence was taken at
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'secret|token|password' $RT/lib/actor.ts` prints nothing
- [ ] CHK-031 [P0] Input validation implemented. Verify: `rg -n 'ACTOR_PATTERN' $RT/lib/actor.ts` prints the pattern and its test
- [ ] CHK-032 [P1] Auth/authz working correctly. Verify: `rg -n 'sign-in|login' $RT/lib/actor.ts` prints nothing, because the runtime has no sign-in and the actor is a name
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized. Verify: `rg -l 'bots activity' specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md` prints three paths
- [ ] CHK-041 [P1] Code comments adequate. Verify: `rg -c '^\s*//' $RT/lib/activity.ts` prints a count above zero
- [ ] CHK-042 [P2] The runtime README names both modules. Verify: `rg -n 'activity.ts|actor.ts' $RT/lib/README.md` prints two rows
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/scratch/` lists no file the phase wrote outside it
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/scratch -type f` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---
