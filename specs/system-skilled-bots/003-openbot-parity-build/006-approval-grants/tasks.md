---
title: "Tasks: Phase 6: approval-grants"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "approval grants tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: approval-grants

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

- [ ] T001 Read the four design files, then record the item's key list (`specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/`, `$RT/lib/needs-you.ts`). Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/` lists `README.md`, `records.md`, `state-machines.md`, `refusals.md`, `mockups.md` and `fixtures`, and `rg -n "ITEM_KEYS" $RT/lib/needs-you.ts` prints the declaration and no `'grants'` entry
- [ ] T002 Record the gate's item write (`$RT/lib/runner.ts`). Verify: `rg -n "const item: NeedsYouItem" $RT/lib/runner.ts` prints one line
- [ ] T003 Record the answer's two item writes and its read-check-write order (`$RT/lib/answer.ts`). Verify: `rg -n "writeNeedsYouItem|needsYouState" $RT/lib/answer.ts` prints the state check and two writes
- [ ] T004 Record the answer verb spec, the inbox branch and the inbox `--json` branch (`.skilled/bin/bots.cjs`). Verify: `rg -n "answer: \{ ids: 2|inbox: \{ ids: 0" .skilled/bin/bots.cjs` prints both specs, `answer` carrying `as` and `scope` and `inbox` carrying `json` and `all`, which is the 001 surface this phase extends [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md, T020 to T021]
- [ ] T005 Record the run record's request join (`$RT/lib/run-record.ts`). Verify: `rg -n "resumedItemId" $RT/lib/run-record.ts` prints the optional field the grant line sits beside
- [ ] T006 Capture the baseline suite result (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` count
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Create the six kinds in OpenBot's order (`$RT/lib/action-kind.ts`). Verify: `rg -n "pay|credentials|delete|send|share|post" $RT/lib/action-kind.ts` prints the kind list in that order
- [ ] T008 Add the word lists and `classifyAction` over the whole question, with its `other` fallback (`$RT/lib/action-kind.ts`). Verify: `rg -n "classifyAction" $RT/lib/action-kind.ts` prints the export and the fallback
- [ ] T009 Parse one `[ACTION: <kind>]` line, take the stricter of the declared and the classified kind, and refuse a kind outside the six (`$RT/lib/action-kind.ts`). Verify: `rg -n "action-kind-invalid" $RT/lib/action-kind.ts` prints the refusal, and `rg -n "stricter" $RT/lib/action-kind.ts` prints the floor rule
- [ ] T010 Create the four rungs and `decideApproval` over rung 1 and the `bot` fallback (`$RT/lib/approval-ladder.ts`). Verify: `rg -n "kind|rule|auto-review|extra-vigilant" $RT/lib/approval-ladder.ts` prints the rung list in order
- [ ] T011 Name rungs 2 to 4 as not implemented in this phase (`$RT/lib/approval-ladder.ts`, `.skilled/bin/bots.cjs`). Verify: `rg -n "not implemented in this phase" $RT/lib/approval-ladder.ts .skilled/bin/bots.cjs` prints the module note and the help line
- [ ] T012 Add the scope rule and keep 001's `grant-scope-unsupported` refusal (`$RT/lib/approval-ladder.ts`). Verify: `rg -n "grant-scope-unsupported" $RT/lib/approval-ladder.ts` prints the refusal and its doc comment
- [ ] T013 Add `grants` to the item, its key and its validation (`$RT/lib/needs-you.ts`). Verify: `rg -n "'grants'" $RT/lib/needs-you.ts` prints the key and its check
- [ ] T014 Read a missing grant as null (`$RT/lib/needs-you.ts`). Verify: `rg -n "grants" $RT/lib/needs-you.ts` prints the null default beside the field
- [ ] T015 Name the granted scope in the resumed prompt (`$RT/lib/needs-you.ts`). Verify: `rg -n "scope" $RT/lib/needs-you.ts` prints the resumed-prompt line
- [ ] T016 Classify the parked question and write the grant (`$RT/lib/runner.ts`). Verify: `rg -n "classifyAction|decideApproval" $RT/lib/runner.ts` prints both calls
- [ ] T017 Carry the grant forward in every item writer, including the memory-proposal branch 005 lands and the fatigue item 002 raises in `routine-state.ts` (`$RT/lib/runner.ts`, `$RT/lib/routine-state.ts`, `$RT/lib/answer.ts`, `.skilled/bin/bots.cjs`). Verify: `rg -n "writeNeedsYouItem" $RT/lib/` prints every writer, each passing the grant it read, `rg -n "memory-proposals" $RT/lib/runner.ts` prints the branch that fills it, and `rg -n "classifyAction|decideApproval" $RT/lib/routine-state.ts` prints both calls on the fatigue item's write
- [ ] T018 Record 001's scope on the grant and keep the refusal of `always` and `conversation` (`$RT/lib/answer.ts`). Verify: `rg -n "grant-scope-unsupported" $RT/lib/answer.ts` prints the refusal
- [ ] T019 Compare the answer's text and its scope as one identity (`$RT/lib/answer.ts`). Verify: `rg -n "item-answered-differently" $RT/lib/answer.ts` prints the check over both fields
- [ ] T020 Guard the item write with an exclusive lock file beside the item, holding the writer's `pid`, a `nonce` and the instant it was created (`$RT/lib/answer.ts`). Verify: `rg -n "lock" $RT/lib/answer.ts` prints the lock taken before the write and released after it, and `rg -n "pid|nonce" $RT/lib/answer.ts` prints the three keys the lock file holds
- [ ] T021 Write the scope, `grantedBy` and `grantedAt` on the grant, and derive `deny` from a NO, `no` or `n` (`$RT/lib/answer.ts`). Verify: `rg -n "grantedBy|grantedAt" $RT/lib/answer.ts` prints both fields and the write, and `cd $RT && npx vitest run tests/answer.vitest.ts -t "scope"` prints no `failed`
- [ ] T022 Carry one line per grant on the resumed run's record (`$RT/lib/run-record.ts`). Verify: `rg -n "grant" $RT/lib/run-record.ts` prints the optional field on the request join
- [ ] T023 Carry the grant on the `answer` path 001's `--scope` reaches (`.skilled/bin/bots.cjs`). Verify: `$BOTS answer item-1 yes --scope once` prints `bots: item-unknown: item-1`
- [ ] T024 Prove 001's scope refusal still holds and writes no grant (`.skilled/bin/bots.cjs`). Verify: `$BOTS answer item-1 yes --scope sometimes` exits 2 with `bots: --scope takes once or deny`
- [ ] T025 Print the grant on the inbox line (`.skilled/bin/bots.cjs`). Verify: `rg -n "grants" .skilled/bin/bots.cjs` prints the column
- [ ] T026 Carry the grant on the inbox `--json` row (`.skilled/bin/bots.cjs`). Verify: `cd $RT && npx vitest run tests/cli-run.vitest.ts -t "grants"` prints one passing test, because the row is proved on the temporary state root the test seeds rather than on the live one
- [ ] T027 Create the classifier tests (`$RT/tests/action-kind.vitest.ts`). Verify: `cd $RT && npx vitest run tests/action-kind.vitest.ts` prints no `failed`
- [ ] T028 Create the ladder tests over the 21-row matrix (`$RT/tests/approval-ladder.vitest.ts`). Verify: `cd $RT && npx vitest run tests/approval-ladder.vitest.ts` prints no `failed`
- [ ] T029 Extend the needs-you tests (`$RT/tests/needs-you.vitest.ts`). Verify: `cd $RT && npx vitest run tests/needs-you.vitest.ts` prints no `failed`
- [ ] T030 Extend the answer tests with the standing-allow refusal, the NO that records `deny` (`no` and `n`), the identity and the lock (`$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/answer.vitest.ts` prints no `failed`
- [ ] T031 Extend the runner tests with the grant, the memory-proposal branch and the record line (`$RT/tests/runner.vitest.ts`). Verify: `cd $RT && npx vitest run tests/runner.vitest.ts` prints no `failed`
- [ ] T032 Extend the CLI tests with the grant on 001's `--scope`, the inbox line and the `--json` row on a temporary state root, `enable`'s fatigue answer recording the grant with no resume queued, an answer to that same item from `bots answer` queueing a resume the runner refuses `routine-fatigued`, and that same queued resume dropped when `bots enable` runs before the next drain (`$RT/tests/cli-run.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-run.vitest.ts` prints no `failed`
- [ ] T033 Write the ladder as a doc (`.skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md`). Verify: `rg -n "first answer wins" .skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md` prints the rule
- [ ] T034 Mark rungs 2 to 4 not implemented in the ladder doc (`.skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md`). Verify: `rg -n "not implemented in this phase" .skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md` prints the note
- [ ] T035 Document the grant 001's `--scope once|deny` records on `bots answer` (`.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md`). Verify: `rg -n -- "grant" .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` prints the grant beside the option
- [ ] T036 Name the grant column and the `--json` key in the status reference (`.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md`). Verify: `rg -n "grant" .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints the column
- [ ] T037 Add the grant to the item's catalog entry (`.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md`). Verify: `rg -n "grants" .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md` prints the field
- [ ] T038 Add the grant and the scope it records to the answer's catalog entry (`.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-answer.md`). Verify: `rg -n "grants" .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-answer.md` prints the field
- [ ] T039 Add the two module rows to the runtime README (`$RT/lib/README.md`). Verify: `rg -n "action-kind.ts|approval-ladder.ts" $RT/lib/README.md` prints two rows
- [ ] T040 Append the MIT notice for the lifted classifier (`.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md`). Verify: `rg -n "tool-name.ts" .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints the entry under a `## 006-approval-grants` heading
- [ ] T041 Add the `grants` key to the screen's fake CLI (`crates/bots-tui/tests/fixtures/bots`). Verify: `rg -n "grants" crates/bots-tui/tests/fixtures/bots` prints the key on the `inbox --json` payload
- [ ] T042 Drop a resume still queued for the item when the no-resume option is passed, so `bots enable` cannot leave one behind that dispatches the tenth failed run once it clears the switch (`$RT/lib/answer.ts`). Verify: `rg -n "queueFolders|listInbox" $RT/lib/answer.ts` prints the queue read the drop uses, and `cd $RT && npx vitest run tests/answer.vitest.ts -t "drops a queued resume"` prints one passing test
- [ ] T054 Reclaim a lock left by a killed process, so a lock whose owner pid is gone or whose `createdAt` is more than 60 seconds before now is renamed away before the acquisition is retried, and a lock whose owner is alive is waited on for up to 2,000 ms and then refused `item-busy` (`$RT/lib/answer.ts`). Verify: `rg -n "stale|pid" $RT/lib/answer.ts` prints the reclaim by owner pid and by age, and `cd $RT && npx vitest run tests/answer.vitest.ts -t "stale lock"` prints one passing test, which seeds a lock file naming a dead pid and proves the next answer lands rather than being refused `item-busy`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T043 Run the whole runtime suite (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [ ] T044 Prove the gate writes a grant from a parked question, and the memory-proposal branch fills one (`$RT/tests/runner.vitest.ts`). Verify: `cd $RT && npx vitest run tests/runner.vitest.ts -t "grant"` prints no `failed`
- [ ] T045 Prove the standing-allow refusal and the NO that records `deny` (`$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "scope"` prints no `failed`
- [ ] T046 Prove the answer identity (`$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "item-answered-differently"` prints one passing test
- [ ] T047 Prove the guarded write under two concurrent answers (`$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "concurrent"` prints one passing test
- [ ] T048 Prove rung 1 and the `bot` fallback (`$RT/tests/approval-ladder.vitest.ts`). Verify: `cd $RT && npx vitest run tests/approval-ladder.vitest.ts -t "first answer wins"` prints one passing test
- [ ] T049 Prove an item written before this phase still lists (`$RT/tests/needs-you.vitest.ts`). Verify: `cd $RT && npx vitest run tests/needs-you.vitest.ts -t "grants"` prints one passing test
- [ ] T050 Prove the grant line on the resumed record (`$RT/tests/runner.vitest.ts`). Verify: `cd $RT && npx vitest run tests/runner.vitest.ts -t "grant line"` prints one passing test
- [ ] T051 Prove the inbox line and its `--json` row carry the grant, on the temporary state root the test seeds (`$RT/tests/cli-run.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-run.vitest.ts -t "inbox line"` prints one passing test and `cd $RT && npx vitest run tests/cli-run.vitest.ts -t "grants"` prints one passing test
- [ ] T052 Prove `bots enable`'s fatigue answer records the grant and queues no resume, an answer to the same item from `bots answer` queues one the runner refuses `routine-fatigued`, and `bots enable` running before the next drain drops that queued resume so the tenth failed run is never dispatched (`$RT/tests/cli-run.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-run.vitest.ts -t "fatigue"` prints three passing tests
- [ ] T053 Run the packet validator (`specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `$BOTS inbox` prints a grant column on every item line and exits 0
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md` prints 14
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md` prints one line
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `cd $RT && npx vitest --version` exits 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runtime type-checks. Verify: `cd $RT && npm run typecheck` exits 0
- [ ] CHK-011 [P0] The two new modules print nothing. Verify: `rg -n 'console\.(log|error)' $RT/lib/action-kind.ts $RT/lib/approval-ladder.ts` prints nothing
- [ ] CHK-012 [P1] Error handling implemented. Verify: `rg -n 'grant-scope-unsupported' $RT/lib/answer.ts` prints the refusal
- [ ] CHK-013 [P1] Code follows project patterns. Verify: `rg -n '^export (function|type|interface)' $RT/lib/action-kind.ts $RT/lib/approval-ladder.ts` prints the exports
- [ ] CHK-014 [P0] A lock left by a dead pid does not block the next answer. Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "stale lock"` prints one passing test, and `rg -n "stale|pid" $RT/lib/answer.ts` prints the reclaim by owner pid and by age
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants --strict` prints `RESULT: PASSED`
- [ ] CHK-021 [P0] Manual testing complete. Verify: `$BOTS inbox` exits 0
- [ ] CHK-022 [P1] Edge cases tested. Verify: `cd $RT && npx vitest run tests/approval-ladder.vitest.ts -t "adversarial"` prints one passing test
- [ ] CHK-023 [P1] Error scenarios validated. Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "grant-scope-unsupported"` prints one passing test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

The plan's affected-surfaces addendum is active because this phase changes a stored record shape and a CLI surface. These rows verify the inventories it names.

- [ ] CHK-FIX-001 [P0] Each changed surface names its class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Verify: `rg -c '^\| .*runtime/lib/' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md` prints 8
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `rg -n 'writeNeedsYouItem' $RT/lib/` prints every writer of an item
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed symbols. Verify: `rg -n 'NeedsYouItem|ITEM_KEYS|buildResumedPrompt' $RT --glob '*.ts'` prints every reader
- [ ] CHK-FIX-004 [P0] The classifier's and the ladder's adversarial cases are tested. Verify: `rg -n 'adversarial' $RT/tests/approval-ladder.vitest.ts` prints the case block
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: `rg -n 'Matrix axes' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md` prints the 21-row line
- [ ] CHK-FIX-006 [P1] The `other`-kind variant ran. Verify: `cd $RT && npx vitest run tests/approval-ladder.vitest.ts -t "other"` prints one passing test
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a commit, not a moving branch. Verify: `git rev-parse --short HEAD` prints the commit the evidence was taken at
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'sk-|ghp_|BEGIN PRIVATE KEY' $RT/lib/action-kind.ts $RT/lib/approval-ladder.ts` prints nothing
- [ ] CHK-031 [P0] Input validation implemented. Verify: `rg -n 'KINDS|SCOPES' $RT/lib/action-kind.ts $RT/lib/approval-ladder.ts` prints both closed lists
- [ ] CHK-032 [P1] Auth/authz working correctly. Verify: `rg -n 'grant-scope-unsupported' $RT/lib/answer.ts` prints the refusal, `rg -n 'the host is the authority' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md` prints the model, and `rg -n 'a present roster is checked on either surface' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md` prints the alignment with 011's check, because the runtime has no sign-in and a grant is a record
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized. Verify: `rg -l 'grants' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/tasks.md` prints three paths
- [ ] CHK-041 [P1] Code comments adequate. Verify: `rg -c '^\s*//' $RT/lib/action-kind.ts` prints a count above zero
- [ ] CHK-042 [P2] The runtime README names both modules. Verify: `rg -n 'action-kind.ts|approval-ladder.ts' $RT/lib/README.md` prints two rows
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/scratch/` lists no file the phase wrote outside it
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/scratch -type f` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | [ ]/13 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---
