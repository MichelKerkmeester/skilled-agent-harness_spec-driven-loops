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

- [x] T001 Read the four design files, then record the item's key list (`specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/`, `$RT/lib/needs-you.ts`). Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/` lists `README.md`, `records.md`, `state-machines.md`, `refusals.md`, `mockups.md` and `fixtures`, and `rg -n "ITEM_KEYS" $RT/lib/needs-you.ts` prints the declaration and no `'grants'` entry
- [x] T002 Record the gate's item write (`$RT/lib/runner.ts`). Verify: `rg -n "const item: NeedsYouItem" $RT/lib/runner.ts` prints one line
- [x] T003 Record the answer's two item writes and its read-check-write order (`$RT/lib/answer.ts`). Verify: `rg -n "writeNeedsYouItem|needsYouState" $RT/lib/answer.ts` prints the state check and two writes
- [x] T004 Record the answer verb spec, the inbox branch and the inbox `--json` branch (`.skilled/bin/bots.cjs`). Verify: `rg -n "answer: \{ ids: 2|inbox: \{ ids: 0" .skilled/bin/bots.cjs` prints both specs, `answer` carrying `as` and `scope` and `inbox` carrying `json` and `all`, which is the 001 surface this phase extends [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md, T020 to T021]
- [x] T005 Record the run record's request join (`$RT/lib/run-record.ts`). Verify: `rg -n "resumedItemId" $RT/lib/run-record.ts` prints the optional field the grant line sits beside
- [x] T006 Capture the baseline suite result (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` count
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Create the six kinds in the plan's own order, the row order of OpenBot's "What asks" table at `docs/approvals.md:38-43`, which ranks no kind (`$RT/lib/action-kind.ts`). Verify: `rg -n "pay|credentials|delete|send|share|post" $RT/lib/action-kind.ts` prints the kind list in that order
- [x] T008 Add the word lists and `classifyAction` over the whole question, with its `other` fallback (`$RT/lib/action-kind.ts`). Verify: `rg -n "classifyAction" $RT/lib/action-kind.ts` prints the export and the fallback
- [x] T009 Parse one `[ACTION: <kind>]` line, take the stricter of the declared and the classified kind, and refuse a kind outside the seven (`$RT/lib/action-kind.ts`). Verify: `rg -n "action-kind-invalid" $RT/lib/action-kind.ts` prints the refusal, and `rg -n "stricter" $RT/lib/action-kind.ts` prints the floor rule
- [x] T010 Create the four rungs and `decideApproval` over rung 1 and the `bot` fallback (`$RT/lib/approval-ladder.ts`). Verify: `rg -n "kind|rule|auto-review|extra-vigilant" $RT/lib/approval-ladder.ts` prints the rung list in order
- [x] T011 Name rungs 2 to 4 as not implemented in this phase (`$RT/lib/approval-ladder.ts`, `.skilled/bin/bots.cjs`). Verify: `rg -n "not implemented in this phase" $RT/lib/approval-ladder.ts .skilled/bin/bots.cjs` prints the module note and the help line
- [x] T012 Add the scope rule to the ladder module, so `once` and `deny` are the two values it accepts and `always` and `conversation` are named as the two it does not (`$RT/lib/approval-ladder.ts`). The refusal itself stays in `bots.cjs`, where 001 put it, and T055 adds its detail. Verify: `rg -n "SCOPES" $RT/lib/approval-ladder.ts` prints the two-value list
- [x] T013 Add `grants` to the item, its key and its validation (`$RT/lib/needs-you.ts`). Verify: `rg -n "'grants'" $RT/lib/needs-you.ts` prints the key and its check
- [x] T014 Read a missing grant as null (`$RT/lib/needs-you.ts`). Verify: `rg -n "grants" $RT/lib/needs-you.ts` prints the null default beside the field
- [x] T015 Name the granted scope in the resumed prompt, and when the scope is `deny` replace the closing line with the two declined-action lines `design/records.md` section 6 fixes (`$RT/lib/needs-you.ts`). Verify: `rg -n "scope" $RT/lib/needs-you.ts` prints the resumed-prompt line
- [x] T016 Classify the parked question and write the grant (`$RT/lib/runner.ts`). Verify: `rg -n "classifyAction|decideApproval" $RT/lib/runner.ts` prints both calls
- [x] T017 Carry the grant forward in every item writer, including the memory-proposal branch 005 lands and the fatigue item 002 raises in `routine-state.ts` (`$RT/lib/runner.ts`, `$RT/lib/routine-state.ts`, `$RT/lib/answer.ts`, `.skilled/bin/bots.cjs`). Verify: `rg -n "writeNeedsYouItem" $RT/lib/` prints every writer, each passing the grant it read, `rg -n "memory-proposals" $RT/lib/runner.ts` prints the branch that fills it, and `rg -n "classifyAction|decideApproval" $RT/lib/routine-state.ts` prints both calls on the fatigue item's write
- [x] T018 Record 001's scope on the grant, so `answerItem` writes `scope`, `grantedBy` and `grantedAt` from the value `bots.cjs` parsed (`$RT/lib/answer.ts`). The refusal of `always` and `conversation` is 001's and stays in `bots.cjs`, so no runtime module raises it. Verify: `rg -n "grantedBy|grantedAt" $RT/lib/answer.ts` prints both fields and the write
- [x] T019 Compare the answer's text and its scope as one identity (`$RT/lib/answer.ts`). Verify: `rg -n "item-answered-differently" $RT/lib/answer.ts` prints the check over both fields
- [x] T020 Guard the item write with an exclusive lock file beside the item, holding the writer's `pid`, a `nonce` and the instant it was created, wait on a live holder with `Atomics.wait` so `answerItem` keeps its synchronous signature, re-read the lock after every acquisition and proceed only on the own `nonce` and release it only when the file still holds that `nonce` (`$RT/lib/answer.ts`). Verify: `rg -n "lock" $RT/lib/answer.ts` prints the lock taken before the write and released after it, `rg -n "pid|nonce" $RT/lib/answer.ts` prints the three keys the lock file holds, and `rg -n "Atomics.wait" $RT/lib/answer.ts` prints the wait
- [x] T021 Write the scope, `grantedBy` and `grantedAt` on the grant, and derive `deny` from a NO, `deny`, `no`, `n` or `reject`, even when `--scope once` is given, so a refusal is never recorded as an approval (`$RT/lib/answer.ts`). Verify: `rg -n "grantedBy|grantedAt" $RT/lib/answer.ts` prints both fields and the write, and `cd $RT && npx vitest run tests/answer.vitest.ts -t "^bots answer records the scope the answer grants$"` prints `Tests  1 passed`
- [x] T022 Carry one line per grant on the resumed run's record (`$RT/lib/run-record.ts`). Verify: `rg -n "grant" $RT/lib/run-record.ts` prints the optional field on the request join
- [x] T023 Carry the grant on the `answer` path 001's `--scope` reaches (`.skilled/bin/bots.cjs`). Verify: `$BOTS answer item-1 yes --scope once` prints `bots: item-unknown: item-1`
- [x] T024 Prove 001's scope refusal still holds and writes no grant (`.skilled/bin/bots.cjs`). Verify: `$BOTS answer item-1 yes --scope sometimes` exits 2 with `bots: --scope takes once or deny`
- [x] T055 Change 001's `grant-scope-unsupported` line so it carries the detail `no rule store lands in this phase`, and leave the refusal where 001 put it, in `bots.cjs` and not in a runtime module, so it stays a parse refusal at exit 2 (`.skilled/bin/bots.cjs`). Verify: `rg -n "no rule store lands in this phase" .skilled/bin/bots.cjs` prints the detail on the refusal line, and `$BOTS answer item-1 yes --scope always` exits 2 with `bots: grant-scope-unsupported: no rule store lands in this phase`
- [x] T025 Print the grant on the inbox line (`.skilled/bin/bots.cjs`). Verify: `rg -n "grants" .skilled/bin/bots.cjs` prints the column
- [x] T026 Carry the grant on the inbox `--json` row (`.skilled/bin/bots.cjs`). Verify: `cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots inbox prints the grant on the item line and its json row$"` prints `Tests  1 passed`, because the row is proved on the temporary state root the test seeds rather than on the live one
- [x] T027 Create the classifier tests in a block named `classifyAction` and a block named `the ACTION line`, with tests named `tests the six kinds in the plan's order`, `reads the whole question`, `matches a whole word only` and `removes the declaration tokens before the scan` in the first and `takes the declared kind as a floor` in the second (`$RT/tests/action-kind.vitest.ts`). Verify: `cd $RT && npx vitest run tests/action-kind.vitest.ts -t "^classifyAction "` prints `Tests  4 passed` and `cd $RT && npx vitest run tests/action-kind.vitest.ts -t "^the ACTION line "` prints `Tests  1 passed`
- [x] T028 Create the ladder tests in a block named `decideApproval` with tests named `first answer wins`, `never returns rungs 2 to 4` and `walks the 21-row matrix`, a block named `the scope rule` with `records the scope the answer grants` and `refuses always and conversation` and a block named `adversarial` with `an empty question`, `a question naming two kinds` and `the other kind variant` (`$RT/tests/approval-ladder.vitest.ts`). Verify: `cd $RT && npx vitest run tests/approval-ladder.vitest.ts -t "^decideApproval "` prints `Tests  3 passed` and `cd $RT && npx vitest run tests/approval-ladder.vitest.ts -t "^adversarial "` prints `Tests  3 passed`
- [x] T029 Extend the needs-you tests with tests named `writes the grant a parked question classifies`, `reads an item written before this phase`, `names the granted scope in the resumed prompt` and `refuses a grant whose scope disagrees with the answer` (`$RT/tests/needs-you.vitest.ts`). Verify: `cd $RT && npx vitest run tests/needs-you.vitest.ts -t "^needs-you item writes the grant a parked question classifies$"` prints `Tests  1 passed` and `cd $RT && npx vitest run tests/needs-you.vitest.ts -t "^needs-you item reads an item written before this phase$"` prints `Tests  1 passed`
- [x] T030 Extend the answer tests with tests named `records the scope the answer grants`, `refuses a second answer with another scope`, `two answers one lands` and `a stale lock does not block the next answer` (`$RT/tests/answer.vitest.ts`). The standing-allow refusal is 001's and stays in `bots.cjs`, so T032 proves it in `cli-run.vitest.ts`. Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "^bots answer records the scope the answer grants$"` prints `Tests  1 passed` and `cd $RT && npx vitest run tests/answer.vitest.ts -t "^bots answer two answers one lands$"` prints `Tests  1 passed`
- [x] T031 Extend the runner tests with tests named `writes the grant from the parked question`, `fills the grant on the memory-proposal branch` and `carries one grant line on the resumed record` (`$RT/tests/runner.vitest.ts`). Verify: `cd $RT && npx vitest run tests/runner.vitest.ts -t "^needs-you decisions writes the grant from the parked question$"` prints `Tests  1 passed` and `cd $RT && npx vitest run tests/runner.vitest.ts -t "^needs-you decisions carries one grant line on the resumed record$"` prints `Tests  1 passed`
- [x] T032 Extend the CLI tests with a block named `bots answer --scope` holding `grant-scope-unsupported`, a block named `bots inbox` holding `prints the grant on the item line and its json row`, and a block named `bots enable` holding `answers the fatigue item with a grant and no resume`, `drops a queued resume before the next drain` and `refuses the run routine-fatigued before enable`, all on a temporary state root (`$RT/tests/cli-run.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots enable "` prints `Tests  3 passed` and `cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots inbox prints the grant on the item line and its json row$"` prints `Tests  1 passed`
- [x] T033 Write the ladder as a doc (`.skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md`). Verify: `rg -n "first answer wins" .skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md` prints the rule
- [x] T034 Mark rungs 2 to 4 not implemented in the ladder doc (`.skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md`). Verify: `rg -n "not implemented in this phase" .skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md` prints the note
- [x] T035 Document the grant 001's `--scope once|deny` records on `bots answer` (`.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md`). Verify: `rg -n -- "grant" .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` prints the grant beside the option
- [x] T036 Name the grant column and the `--json` key in the status reference (`.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md`). Verify: `rg -n "grant" .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints the column
- [x] T037 Add the grant to the item's catalog entry (`.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md`). Verify: `rg -n "grants" .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md` prints the field
- [x] T038 Add the grant and the scope it records to the answer's catalog entry (`.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-answer.md`). Verify: `rg -n "grants" .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-answer.md` prints the field
- [x] T039 Add the two module rows to the runtime README (`$RT/lib/README.md`). Verify: `rg -n "action-kind.ts|approval-ladder.ts" $RT/lib/README.md` prints two rows
- [x] T040 Confirm this phase adds no notice section, because the word lists are written from `docs/approvals.md` and `shared/tool-name.ts` holds no classifier. No file is written (`.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md`, read only). Verify: `rg -c "tool-name.ts|## 006-approval-grants" .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints nothing and exits 1
- [x] T041 Add the `grants` key to the screen's `inbox --json` payload as a new scenario file, `crates/bots-tui/tests/fixtures/payloads/inbox.grant.json`, served by the fake CLI behind `--fixture-scenario grant`, so the base payload and its snapshots stay as 003 shipped them (`crates/bots-tui/tests/fixtures/payloads/inbox.grant.json`). Verify: `rg -n "grants" crates/bots-tui/tests/fixtures/payloads/inbox.grant.json` prints the key on the payload Observed 2026-11-27: the grep prints `grants` on lines 15, 35 and 55, the three rows match `inbox.json` key for key apart from `grants`, and `cargo test --locked` and `cargo fmt --check` both exit 0. The fake CLI serves `--fixture-scenario grant` with its base payload until the crate lane adds a `grant` branch to `tests/fixtures/bots`, because this unit was cleared to write the payload file only.
- [x] T042 Drop a resume still queued for the item when the no-resume option is passed, so `bots enable` cannot leave one behind that dispatches the tenth failed run once it clears the switch (`$RT/lib/answer.ts`). Verify: `rg -n "queueFolders|listInbox" $RT/lib/answer.ts` prints the queue read the drop uses, and `cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots enable drops a queued resume before the next drain$"` prints `Tests  1 passed`
- [x] T054 Reclaim a lock left by a killed process, so a lock whose owner pid is gone or whose `createdAt` is more than 60 seconds before now is renamed away before the acquisition is retried, a lock whose owner is alive is waited on with `Atomics.wait` for up to 2,000 ms and then refused `item-busy` and the release unlinks only a lock that still holds the writer's own `nonce` (`$RT/lib/answer.ts`). Verify: `rg -n "stale|pid" $RT/lib/answer.ts` prints the reclaim by owner pid and by age, and `cd $RT && npx vitest run tests/answer.vitest.ts -t "^bots answer a stale lock does not block the next answer$"` prints `Tests  1 passed`, which seeds a lock file naming a dead pid and proves the next answer lands rather than being refused `item-busy`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T043 Run the whole runtime suite (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [x] T044 Prove the gate writes a grant from a parked question, and the memory-proposal branch fills one (`$RT/tests/runner.vitest.ts`). Verify: `cd $RT && npx vitest run tests/runner.vitest.ts -t "^needs-you decisions writes the grant from the parked question$"` prints `Tests  1 passed` and `cd $RT && npx vitest run tests/runner.vitest.ts -t "^needs-you decisions fills the grant on the memory-proposal branch$"` prints `Tests  1 passed`
- [x] T045 Prove the scope an answer records, the NO that records `deny` and the NO that overrides an explicit `once` (`$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "^bots answer records the scope the answer grants$"` prints `Tests  1 passed`
- [x] T046 Prove the answer identity (`$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "^bots answer refuses a second answer with another scope$"` prints `Tests  1 passed`
- [x] T047 Prove the guarded write under two concurrent answers, in a test named `two answers one lands` that starts two child processes held at a barrier file so both reach the lock within one poll interval (`$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "^bots answer two answers one lands$"` prints `Tests  1 passed`
- [x] T048 Prove rung 1 and the `bot` fallback (`$RT/tests/approval-ladder.vitest.ts`). Verify: `cd $RT && npx vitest run tests/approval-ladder.vitest.ts -t "^decideApproval first answer wins$"` prints `Tests  1 passed`
- [x] T049 Prove an item written before this phase still lists (`$RT/tests/needs-you.vitest.ts`). Verify: `cd $RT && npx vitest run tests/needs-you.vitest.ts -t "^needs-you item reads an item written before this phase$"` prints `Tests  1 passed`
- [x] T050 Prove the grant line on the resumed record (`$RT/tests/runner.vitest.ts`). Verify: `cd $RT && npx vitest run tests/runner.vitest.ts -t "^needs-you decisions carries one grant line on the resumed record$"` prints `Tests  1 passed`
- [x] T051 Prove the inbox line and its `--json` row carry the grant, on the temporary state root the test seeds (`$RT/tests/cli-run.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots inbox prints the grant on the item line and its json row$"` prints `Tests  1 passed`
- [x] T052 Prove `bots enable`'s fatigue answer records the grant and queues no resume, an answer to the same item from `bots answer` queues one the runner refuses `routine-fatigued`, and `bots enable` running before the next drain drops that queued resume so the tenth failed run is never dispatched (`$RT/tests/cli-run.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots enable "` prints `Tests  3 passed`
- [x] T053 Run the packet validator (`specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `$BOTS inbox` prints a grant column on every item line and exits 0
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md` prints 14
- [x] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md` prints one line
- [x] CHK-003 [P1] Dependencies identified and available. Verify: `cd $RT && npx vitest --version` exits 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The runtime type-checks. Verify: `cd $RT && npm run typecheck` exits 0
- [x] CHK-011 [P0] The two new modules print nothing. Verify: `rg -n 'console\.(log|error)' $RT/lib/action-kind.ts $RT/lib/approval-ladder.ts` prints nothing
- [x] CHK-012 [P1] Error handling implemented. Verify: `rg -n 'grant-scope-unsupported' .skilled/bin/bots.cjs` prints the refusal and its detail
- [x] CHK-013 [P1] Code follows project patterns. Verify: `rg -n '^export (function|type|interface)' $RT/lib/action-kind.ts $RT/lib/approval-ladder.ts` prints the exports
- [x] CHK-014 [P0] A lock left by a dead pid does not block the next answer. Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "^bots answer a stale lock does not block the next answer$"` prints `Tests  1 passed`, and `rg -n "stale|pid" $RT/lib/answer.ts` prints the reclaim by owner pid and by age
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Observed 2026-11-27: `Errors: 0  Warnings: 0` and `RESULT: PASSED`. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants --strict` prints `RESULT: PASSED`
- [x] CHK-021 [P0] Manual testing complete. Verify: `$BOTS inbox` exits 0
- [x] CHK-022 [P1] Edge cases tested. Verify: `cd $RT && npx vitest run tests/approval-ladder.vitest.ts -t "^adversarial "` prints `Tests  3 passed`
- [x] CHK-023 [P1] Error scenarios validated. Verify: `cd $RT && npx vitest run tests/cli-run.vitest.ts -t "^bots answer grant-scope-unsupported$"` prints `Tests  1 passed`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

The plan's affected-surfaces addendum is active because this phase changes a stored record shape and a CLI surface. These rows verify the inventories it names.

- [x] CHK-FIX-001 [P0] Each changed surface names its class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. Verify: `rg -c '^\| .*runtime/lib/' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md` prints 8
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `rg -n 'writeNeedsYouItem' $RT/lib/` prints every writer of an item
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the changed symbols. Verify: `rg -n 'NeedsYouItem|ITEM_KEYS|buildResumedPrompt' $RT --glob '*.ts'` prints every reader
- [x] CHK-FIX-004 [P0] The classifier's and the ladder's adversarial cases are tested. Verify: `rg -n 'adversarial' $RT/tests/approval-ladder.vitest.ts` prints the case block
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: `rg -n 'Matrix axes' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md` prints the 21-row line
- [x] CHK-FIX-006 [P1] The `other`-kind variant ran. Verify: `cd $RT && npx vitest run tests/approval-ladder.vitest.ts -t "^adversarial the other kind variant$"` prints `Tests  1 passed`
- [x] CHK-FIX-007 [P1] Evidence is pinned to a commit, not a moving branch. Observed: every check ran on the tree cut from `b289bd4357f`, and the unit commit that carries this line is the pin. Verify: `git rev-parse --short HEAD` prints the commit the evidence was taken at
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'sk-|ghp_|BEGIN PRIVATE KEY' $RT/lib/action-kind.ts $RT/lib/approval-ladder.ts` prints nothing
- [x] CHK-031 [P0] Input validation implemented. Verify: `rg -n 'KINDS|SCOPES' $RT/lib/action-kind.ts $RT/lib/approval-ladder.ts` prints both closed lists
- [x] CHK-032 [P1] Auth/authz working correctly. Verify: `rg -n 'grant-scope-unsupported' .skilled/bin/bots.cjs` prints the refusal, `rg -n 'the host is the authority' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md` prints the model, and `rg -n 'a present roster is checked on either surface' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md` prints the alignment with 011's check, because the runtime has no sign-in and a grant is a record
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Verify: `rg -l 'grants' specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/tasks.md` prints three paths
- [x] CHK-041 [P1] Code comments adequate. Verify: `rg -c '^\s*//' $RT/lib/action-kind.ts` prints a count above zero
- [x] CHK-042 [P2] The runtime README names both modules. Verify: `rg -n 'action-kind.ts|approval-ladder.ts' $RT/lib/README.md` prints two rows
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/scratch/` lists no file the phase wrote outside it
- [x] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/scratch -type f` prints nothing. Observed: only the `.gitkeep` placeholder the scaffold committed remains, and no file this phase wrote
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-27
<!-- /ANCHOR:summary -->

---
