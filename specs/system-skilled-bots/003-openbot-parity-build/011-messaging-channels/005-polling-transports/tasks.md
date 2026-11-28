---
title: "Tasks: Phase 5: polling-transports"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "polling transports tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: polling-transports

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

- [x] T001 Confirm child 004's handoff (`$RT/lib/channel-queue.ts`). Verify: `test -f $RT/lib/channel-queue.ts && test -f $RT/lib/channel-approval.ts && echo ok` prints `ok` Observed `ok`
- [x] T002 Record the Telegram wire facts as a design note in a worker of its own, the one worker whose brief names the tinychannels source, was T007 (`$CTX/tinychannels-main/src/providers/telegram/`, writing `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/design/wire-notes.md` under one `## telegram` heading). Verify: `rg -n '^## telegram$' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/design/wire-notes.md` prints one line, and `rg -n 'getUpdates|TELEGRAM_MAX_MESSAGE_LENGTH' $CTX/tinychannels-main/src/providers/telegram/` prints both Observed one line, `19:## telegram`, and both names in the reference (`getUpdates` in 5 files, `TELEGRAM_MAX_MESSAGE_LENGTH` in 5)
- [x] T003 Record the Slack wire facts in the same note, in the same worker as T002, was T008 (`$CTX/tinychannels-main/src/providers/slack/`, writing `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/design/wire-notes.md` under one `## slack` heading). Verify: `rg -n '^## slack$' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/design/wire-notes.md` prints one line, and `rg -n 'apps.connections.open|SLACK_TEXT_CHUNK_CHARS' $CTX/tinychannels-main/src/providers/slack/` prints both Observed one line, `41:## slack`, and both names in the reference (`apps.connections.open` in 3 files, `SLACK_TEXT_CHUNK_CHARS` in 3)
- [x] T004 Record the conversation renderer (`$RT/lib/conversation.ts`). Verify: `rg -n 'export function' $RT/lib/conversation.ts` prints the renderer, or the task is `[B]` until phase 010 lands it Observed `518:export function renderChannelBlock` and `551:export function prepareHumanMessage`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Create the Telegram transport with the offset rule, the offset moved past a dropped duplicate, the three-way error rule of REQ-036 and the probe, from `design/wire-notes.md` and the Wire Table with no tinychannels path in the brief, was T025 (`$RT/lib/channel-telegram.ts`). Verify: `rg -n 'getUpdates|deleteWebhook|getMe|inline_keyboard|4096' $RT/lib/channel-telegram.ts` prints all five Observed all five
- [x] T006 Add the press check before emit, was T026 (`$RT/lib/channel-telegram.ts`). Verify: `rg -n 'channel-unlinked|answerCallbackQuery' $RT/lib/channel-telegram.ts` prints both Observed both, `channel-unlinked` at line 445 and `answerCallbackQuery` at line 616
- [x] T007 [P] Create the Slack transport with the envelope acknowledge, the reconnect, the 3,000-character cut of the chunk that carries the buttons, the three-way error rule of REQ-036 and the probe, from `design/wire-notes.md` and the Wire Table with no tinychannels path in the brief, was T027 (`$RT/lib/channel-slack.ts`). Verify: `rg -n 'apps.connections.open|envelope_id|auth.test|block_actions|3900|3000' $RT/lib/channel-slack.ts` prints all six Observed all six
- [x] T008 [P] Create the terminal transport, was T029 (`$RT/lib/channel-terminal.ts`). Verify, amended: `rg -n 'readline|answerItem|enqueueFromCheckout' $RT/lib/channel-terminal.ts` prints all three. The original verify named `enqueueRequest`, which needs a request record built by `request-record.ts`, a module the transport import edges forbid, so the terminal calls `enqueueFromCheckout`, the same call `bots chat` makes. Observed all three
- [x] T009 Add `listen` with the lease, the probe line and the transport table, was the listen half of T034 (`.skilled/bin/bots.cjs`). Verify: `rg -n "channel-listening|listen-" .skilled/bin/bots.cjs $RT/lib/channel.ts` prints the refusal and the lease path Observed the refusal at `bots.cjs:1293` and the lease path at `channel.ts:615`
- [x] T010 [P] Record the Telegram and Slack fixtures with invented data only (`$RT/tests/fixtures/channels/`). Verify: `ls $RT/tests/fixtures/channels/ | wc -l | tr -d ' '` prints a number above 0 and `rg -n 'xox[abp]-[0-9]|xapp-[0-9]|[0-9]{8,10}:[A-Za-z0-9_-]{30,}' $RT/tests/fixtures/channels/` exits 1 Observed `17`, and the `rg` exits 1
- [x] T011 Create the transport tests with one block per transport and a sixth `transport shared` block for the rules every transport obeys, was T040 and the injection half of T071 (`$RT/tests/channel-transports.vitest.ts`). The blocks are `transport telegram`, `transport slack`, `transport terminal` and `transport shared`, and every test is named in `acceptance-criteria.md` AC-007 to AC-036. Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport ")` prints `Tests  16 passed`, and `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts)` prints no `failed` Observed `Tests  16 passed (16)` for the filter and `Tests  16 passed (16)` with no `failed` for the file
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the whole runtime suite (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` Observed `Test Files  56 passed (56)` and `Tests  758 passed (758)`, exit 0
- [x] T013 Type-check the runtime (`$RT/tsconfig.json`). Verify: `cd $RT && npm run typecheck` exits 0 Observed exit 0
- [x] T014 Prove the buttons and the press check (`$RT/tests/channel-transports.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport telegram sends an inline keyboard with the action id$")` prints `Tests  1 passed` and `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport slack sends Block Kit buttons with the action id$")` prints `Tests  1 passed` Observed `Tests  1 passed | 15 skipped (16)` for each filter
- [x] T015 Prove Telegram and Slack replay, chunking and redelivery (`$RT/tests/channel-transports.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport telegram follows the wire table$")` prints `Tests  1 passed` and `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport slack follows the wire table$")` prints `Tests  1 passed` Observed `Tests  1 passed | 15 skipped (16)` for each filter
- [x] T016 Prove the token rule, was T058's proof and the token half of T071 (`$RT/tests/channel-transports.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport shared reads the token at every send$")` prints `Tests  1 passed` Observed `Tests  1 passed | 15 skipped (16)`
- [x] T017 Prove the injection fixture, was T060 and the injection half of T071 (`$RT/tests/channel-transports.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport shared keeps an inbound message inside its block$")` prints `Tests  1 passed` Observed `Tests  1 passed | 15 skipped (16)`
- [x] T018 Prove every sent message equals its golden (`$RT/tests/channel-transports.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport shared matches every golden$")` prints `Tests  1 passed` Observed `Tests  1 passed | 15 skipped (16)`
- [x] T019 Prove a piped terminal session on a temporary state root (`.skilled/bin/bots.cjs`). Verify: `T=$(mktemp -d) && mkdir -p "$T/checkout" && printf 'hello\n' | XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets $BOTS channel listen terminal --repo "$T/checkout"; echo "exit=$?"` prints `exit=0` once stdin closes The literal command prints `bots: identity-unknown` and `exit=4`, because the CLI resolves identity under the drain job's environment and drops `SKILLED_BOTS_IDENTITY`, the limit 011.003 T024 and 011.004 T020 recorded. With a checkout `bots/config.json` naming `acme/widgets`, observed the M22 line (the checkout holds no bot) and `exit=0`
- [x] T020 Run the validator (`specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports --strict` prints `RESULT: PASSED` Observed `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] T012 and T013 pass from the final state Observed `Test Files  56 passed (56)` and `Tests  758 passed (758)`, exit 0
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-0' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md` prints 11 Observed 11
- [x] CHK-002 [P0] The Wire Table has one row per transport. Verify: `rg -c '^\| `(telegram|slack|terminal)` \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md` prints 3 Observed 3
- [x] CHK-003 [P1] Dependencies available. Verify: T001 to T004 print what they say Observed, see T001 to T004
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The typecheck passes. Verify: T013 exits 0 Observed exit 0
- [x] CHK-011 [P1] Each transport imports only the edges the contract allows. Verify: `rg -n "^import .* from './" $RT/lib/channel-telegram.ts $RT/lib/channel-slack.ts $RT/lib/channel-terminal.ts` names only `channel`, `channel-link`, `channel-approval`, `channel-queue`, `conversation`, `secrets`, `answer` and `request-queue` Observed only those eight modules across the three files
- [x] CHK-012 [P1] No ephemeral label in a code comment. Verify: `rg -n 'REQ-0|T0[0-9]{2}|specs/' $RT/lib/channel-telegram.ts $RT/lib/channel-slack.ts $RT/lib/channel-terminal.ts` exits 1 Observed exit 1
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Verify: `rg -c '\| Met \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/acceptance-criteria.md` prints 11 Observed 11
- [x] CHK-021 [P0] The suite passes. Verify: T012 prints no `failed` Observed, see T012
- [x] CHK-022 [P1] No test reaches a network. Verify: `rg -n 'https://' $RT/tests/channel-transports.vitest.ts` names only fixture URLs passed to the injected `fetch` Observed no `https://` in the file at all: every wire call goes to the recorded fetch and every socket to the fake factory
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No token reaches the state root. Verify: T016 passes Observed, see T016
- [x] CHK-031 [P0] An inbound message never ends its own block. Verify: T017 passes Observed, see T017
- [x] CHK-032 [P1] No credential in a fixture. Verify: T010's `rg` exits 1 Observed exit 1
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Every Wire Table cell with a provider fact cites a source or says not stated. Verify: `rg -o 'SOURCE: |not stated' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md | wc -l` prints a number above 15 Observed 22
- [x] CHK-041 [P2] The parent map names this child. Verify: `rg -n '005-polling-transports/ \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md` prints the map row Observed line 262, the map row
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the files of the spec's Files to Change table change. Verify: `git status --short .skilled` lists no other path beyond children 003 and 004 Observed `.skilled/bin/bots.cjs`, the three transport modules, the test file and the fixture folder, every one a row of the table
- [x] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/scratch -type f ! -name .gitkeep` prints nothing Observed nothing, the folder holds only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-28
<!-- /ANCHOR:summary -->

---
