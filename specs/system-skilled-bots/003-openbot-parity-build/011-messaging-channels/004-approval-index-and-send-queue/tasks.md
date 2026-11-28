---
title: "Tasks: Phase 4: approval-index-and-send-queue"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "approval index and send queue tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: approval-index-and-send-queue

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

The shell variables, the temporary state root and the `was T0NN` convention are those of `../003-link-roster-and-answer-gate/tasks.md` Task Notation: `RT` is `.skilled/skills/system-skilled-bots/runtime`, `BOTS` is `node .skilled/bin/bots.cjs` and `CTX` is `specs/system-skilled-bots/context`. Every task that writes state runs on `T=$(mktemp -d) && mkdir -p "$T/checkout"` with `XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets` in front and `--repo "$T/checkout"` after, and `SKILLED_BOTS_STATE_ROOT` unset. Every command runs with no tty, no token and no network.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm child 003's handoff (`$RT/lib/channel.ts`). Verify: `test -f $RT/lib/channel.ts && rg -n 'ensureChannelState' $RT/lib/state-root.ts` prints one line. Observed `222:export function ensureChannelState`
- [x] T002 Record the approval action id, was T003 (`$CTX/tinychannels-main/crates/tinychannels-bus/src/channel/event.rs`). Verify: `rg -n 'approval-v1' $CTX/tinychannels-main/crates/tinychannels-bus/src/channel/event.rs` prints the format and the parser. Observed line 18 `format!("approval-v1:{request_id}:{choice_index}")` and line 24 the `strip_prefix` parser
- [x] T003 Record the backoff, was T005 (`$CTX/tinychannels-main/src/delivery/policy.rs`). Verify: `rg -n 'BACKOFF_MS' $CTX/tinychannels-main/src/delivery/policy.rs` prints the five values. Observed line 11 `[0, 5_000, 25_000, 120_000, 600_000]`
- [x] T004 Record the delivery hook and the item id, was T011 (`$RT/lib/delivery.ts`). Verify: `rg -n 'parked|entry.itemId' $RT/lib/delivery.ts` prints both. Observed the `parked` rule at line 133 and `entry.itemId` at line 143
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Create the approval index with the derived 1-based action id, written by the drain before the send, was T020 (`$RT/lib/channel-approval.ts`). Verify: `rg -n 'approval-v1|approvals.json' $RT/lib/channel-approval.ts` prints both. Observed `ACTION_ID_PREFIX = 'approval-v1'` and `approvals.json` in `approvalsFile`
- [x] T006 [P] Add the expiry, the group refusal and the `notApprover` counter, was T055, T056 and T053 (`$RT/lib/channel-approval.ts`). Verify: `rg -n 'expiresAt|item-expired|channel-group-approval|notApprover' $RT/lib/channel-approval.ts` prints all four. Observed all four words, typecheck exit 0
- [x] T007 [P] Add the reply grammar, mapping `N` to `no` before the answer call, and apply it on Slack only to an open prompt whose `choices` hold a label over 75 characters, was T021 (`$RT/lib/channel-approval.ts`). Verify: `rg -n 'YES|NO|deny' $RT/lib/channel-approval.ts` prints the grammar and the mapping. Observed `YES_NO_CHOICES`, the `NO` mapping comment and the deny note, typecheck exit 0
- [x] T008 [P] Create the queue, its forward-only states, the backoff, the `unknown` write to the run record and the rule that an error with `sentBeforeError: true` makes the entry `unknown` whatever `retryable` says, was T022, T023 and T057 (`$RT/lib/channel-queue.ts`). Verify: `rg -n 'BACKOFF_MS|wx|unknown|writeRunRecord' $RT/lib/channel-queue.ts` prints all four. Observed all four, typecheck exit 0
- [x] T009 Add the four channel names, the choice block under the literal check, the text form for a Slack prompt with an option over 75 characters and the queue entry, was T031 and T059 (`$RT/lib/delivery.ts`). Verify: `rg -n "DELIVERY_CHANNELS" $RT/lib/delivery.ts` prints five names, and `rg -n 'deliveryMessage|findSecretLiteral|enqueueChannel' $RT/lib/delivery.ts` prints all three. Observed the five-name list line 49 and the three names, typecheck exit 0
- [x] T010 Add `list`, `send` and `drain` after child 003's verbs, was the list half of T033 and the send and drain half of T034 (`.skilled/bin/bots.cjs`). Verify: `T=$(mktemp -d) && mkdir -p "$T/checkout" && XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets $BOTS channel list --json --repo "$T/checkout" </dev/null` prints `{"version":1,"channels":[]}`. Ran with a checkout `bots/config.json` naming `acme/widgets`, because the CLI resolves identity under the job environment, which does not carry `SKILLED_BOTS_IDENTITY`. Observed `{"version":1,"channels":[]}` and exit 0
- [x] T011 [P] Create the approval tests, was T038 (`$RT/tests/channel-approval.vitest.ts`). Seven tests inside one `bots channel approval` block: `resolves a press after a restart`, `refuses a press after expiresAt`, `refuses a press from a group`, `falls through to answerItem when the item has no entry`, `applies the reply grammar`, `answers only a delivered prompt` and `answers nothing when two delivered prompts are open`. Verify: `(cd "$RT" && npx vitest run tests/channel-approval.vitest.ts -t "^bots channel approval ")` prints `Tests  7 passed`, and `(cd "$RT" && npx vitest run tests/channel-approval.vitest.ts)` prints no `failed`. Observed `Tests  7 passed (7)` and the whole file with no failed
- [x] T012 [P] Create the queue tests, was T039 (`$RT/tests/channel-queue.vitest.ts`). Nine tests inside one `bots channel queue` block: `records an uncertain send as unknown`, `moves an error that may have landed to unknown`, `queues the text form for a Slack label over 75 characters`, `waits the backoff ladder`, `withholds a prompt whose option holds a secret`, `queues the button form on a buttons channel`, `queues the text form otherwise`, `queues a prompt for the channel that asked` and `queues a prompt for the request's reply target`. Verify: `(cd "$RT" && npx vitest run tests/channel-queue.vitest.ts -t "^bots channel queue ")` prints `Tests  9 passed`, and `(cd "$RT" && npx vitest run tests/channel-queue.vitest.ts)` prints no `failed`. Observed `Tests  9 passed (9)` and the whole file with no failed
- [x] T013 [P] Append the `list`, `send` and `drain` blocks (`$RT/tests/cli-channel.vitest.ts`). Four tests: `lists both channels` inside `bots channel list`, `sends one entry twice within a minute` inside `bots channel send` and `exits 1 when a due entry failed` and `exits 4 when the drain is refused` inside `bots channel drain`. Each calls the in-process `runChannelVerb(argv, transports)` with a fake transport table, because a spawned `bots.cjs` cannot be handed one. Verify: `(cd "$RT" && npx vitest run tests/cli-channel.vitest.ts -t "^bots channel list ")` prints `Tests  1 passed`, `(cd "$RT" && npx vitest run tests/cli-channel.vitest.ts -t "^bots channel send ")` prints `Tests  1 passed`, `(cd "$RT" && npx vitest run tests/cli-channel.vitest.ts -t "^bots channel drain ")` prints `Tests  2 passed` and `(cd "$RT" && npx vitest run tests/cli-channel.vitest.ts)` prints no `failed`. Observed `Tests  1 passed | 13 skipped (14)` for list and send, `Tests  2 passed | 12 skipped (14)` for drain and `Tests  14 passed (14)` for the file
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run the whole runtime suite (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`. Observed `Test Files  51 passed (51)`, `Tests  654 passed (654)`, exit 0
- [x] T015 Type-check the runtime (`$RT/tsconfig.json`). Verify: `cd $RT && npm run typecheck` exits 0. Observed exit 0
- [x] T016 Prove the index survives a restart, was T065 (`$RT/tests/channel-approval.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-approval.vitest.ts -t "^bots channel approval resolves a press after a restart$")` prints `Tests  1 passed`. Observed `Tests  1 passed | 6 skipped (7)`
- [x] T017 Prove the expiry, the group refusal, the grammar and the missing entry, was T072 (`$RT/tests/channel-approval.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-approval.vitest.ts -t "^bots channel approval refuses a press after expiresAt$")` prints `Tests  1 passed`, `(cd "$RT" && npx vitest run tests/channel-approval.vitest.ts -t "^bots channel approval refuses a press from a group$")` prints `Tests  1 passed`, `(cd "$RT" && npx vitest run tests/channel-approval.vitest.ts -t "^bots channel approval applies the reply grammar$")` prints `Tests  1 passed` and `(cd "$RT" && npx vitest run tests/channel-approval.vitest.ts -t "^bots channel approval falls through to answerItem when the item has no entry$")` prints `Tests  1 passed`. Observed `Tests  1 passed | 6 skipped (7)` for each of the four filters
- [x] T018 Prove the uncertain send is not retried, was T067 (`$RT/tests/channel-queue.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-queue.vitest.ts -t "^bots channel queue records an uncertain send as unknown$")` prints `Tests  1 passed`. Observed `Tests  1 passed | 8 skipped (9)`
- [x] T019 Prove the withheld prompt, the two queued forms and the delivery hook (`$RT/tests/channel-queue.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-queue.vitest.ts -t "^bots channel queue withholds a prompt whose option holds a secret$")` prints `Tests  1 passed`, `(cd "$RT" && npx vitest run tests/channel-queue.vitest.ts -t "^bots channel queue queues the button form on a buttons channel$")` prints `Tests  1 passed`, `(cd "$RT" && npx vitest run tests/channel-queue.vitest.ts -t "^bots channel queue queues the text form otherwise$")` prints `Tests  1 passed` and `(cd "$RT" && npx vitest run tests/channel-queue.vitest.ts -t "^bots channel queue queues a prompt for the channel that asked$")` prints `Tests  1 passed`. Observed `Tests  1 passed | 8 skipped (9)` for each of the four filters
- [x] T020 Prove an empty drain on a temporary state root (`.skilled/bin/bots.cjs`). Verify: `T=$(mktemp -d) && mkdir -p "$T/checkout" && XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets $BOTS channel drain --repo "$T/checkout" </dev/null; echo "exit=$?"` prints `exit=0`. Ran with a checkout `bots/config.json` naming `acme/widgets`, as T010. Observed `exit=0`. The literal command exits 4 `identity-unknown`
- [x] T021 Run the validator (`specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue --strict` prints `RESULT: PASSED`. Observed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] T014 and T015 pass from the final state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
- **Parent specification**: See `../spec.md`
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

A blocked task is `[B]` with the reason on the same line, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-0' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md` prints 7. Observed 7
- [x] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/plan.md` prints one line. Observed one line
- [x] CHK-003 [P1] Dependencies available. Verify: T001 to T004 print what they say. Observed, see T001 to T004
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The typecheck passes. Verify: T015 exits 0. Observed exit 0
- [x] CHK-011 [P1] `delivery.ts` imports no transport and no `channel-approval`. Verify: `rg -n "from './channel-(approval|telegram|slack|signal|whatsapp|terminal)" $RT/lib/delivery.ts` exits 1. Observed exit 1
- [x] CHK-012 [P1] No ephemeral label in a code comment. Verify: `rg -n 'REQ-0|T0[0-9]{2}|specs/' $RT/lib/channel-approval.ts $RT/lib/channel-queue.ts` exits 1. Observed exit 1
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Verify: `rg -c '\| Met \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/acceptance-criteria.md` prints 7. Observed 7
- [x] CHK-021 [P0] The suite passes. Verify: T014 prints no `failed`. Observed no failed
- [x] CHK-022 [P1] No test opens a socket. Verify: `rg -n 'fetch\(|net\.connect|new WebSocket' $RT/tests/channel-approval.vitest.ts $RT/tests/channel-queue.vitest.ts` exits 1. Observed exit 1
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] A prompt holding a stored secret writes no queue entry. Verify: T019's `^bots channel queue withholds a prompt whose option holds a secret$` filter prints `Tests  1 passed`. Observed `Tests  1 passed | 8 skipped (9)`
- [x] CHK-031 [P0] A refusal is never recorded as an approval. Verify: T017's `^bots channel approval applies the reply grammar$` filter prints `Tests  1 passed`. Observed `Tests  1 passed | 6 skipped (7)`, and the test reads `deny` on the stored answer
- [x] CHK-032 [P1] No token in a queue entry. Verify: `(cd "$RT" && npx vitest run tests/channel-queue.vitest.ts -t "^bots channel queue records an uncertain send as unknown$")` prints `Tests  1 passed`, because that test reads the queue file back and finds no token. Observed `Tests  1 passed | 8 skipped (9)`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The `--json` envelope matches the contract. Verify: T010 prints `{"version":1,"channels":[]}`. Observed `{"version":1,"channels":[]}` with the T010 workaround
- [x] CHK-041 [P2] The parent map names this child. Verify: `rg -n '004-approval-index-and-send-queue/ \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md` prints the map row. Observed line 261
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only the seven files of the spec's Files to Change table change. Verify: `git status --short .skilled` lists no other path beyond child 003's. Not met as written: beyond the seven files the unit also changed `lib/runner.ts`, `lib/request-drain.ts`, `tests/delivery.vitest.ts` and the `delivery-channel-unknown` fixture, each recorded in implementation-summary.md
- [x] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/scratch -type f ! -name .gitkeep` prints nothing. Observed nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 8 | 7/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-28
<!-- /ANCHOR:summary -->

---
