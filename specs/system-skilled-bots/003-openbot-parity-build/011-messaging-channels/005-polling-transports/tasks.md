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

- [ ] T001 Confirm child 004's handoff (`$RT/lib/channel-queue.ts`). Verify: `test -f $RT/lib/channel-queue.ts && test -f $RT/lib/channel-approval.ts && echo ok` prints `ok`
- [ ] T002 Record the Telegram wire facts as a design note in a worker of its own, the one worker whose brief names the tinychannels source, was T007 (`$CTX/tinychannels-main/src/providers/telegram/`, writing `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/design/wire-notes.md` under one `## telegram` heading). Verify: `rg -n '^## telegram$' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/design/wire-notes.md` prints one line, and `rg -n 'getUpdates|TELEGRAM_MAX_MESSAGE_LENGTH' $CTX/tinychannels-main/src/providers/telegram/` prints both
- [ ] T003 Record the Slack wire facts in the same note, in the same worker as T002, was T008 (`$CTX/tinychannels-main/src/providers/slack/`, writing `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/design/wire-notes.md` under one `## slack` heading). Verify: `rg -n '^## slack$' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/design/wire-notes.md` prints one line, and `rg -n 'apps.connections.open|SLACK_TEXT_CHUNK_CHARS' $CTX/tinychannels-main/src/providers/slack/` prints both
- [ ] T004 Record the conversation renderer (`$RT/lib/conversation.ts`). Verify: `rg -n 'export function' $RT/lib/conversation.ts` prints the renderer, or the task is `[B]` until phase 010 lands it
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Create the Telegram transport with the offset rule, the offset moved past a dropped duplicate, the three-way error rule of REQ-036 and the probe, from `design/wire-notes.md` and the Wire Table with no tinychannels path in the brief, was T025 (`$RT/lib/channel-telegram.ts`). Verify: `rg -n 'getUpdates|deleteWebhook|getMe|inline_keyboard|4096' $RT/lib/channel-telegram.ts` prints all five
- [ ] T006 Add the press check before emit, was T026 (`$RT/lib/channel-telegram.ts`). Verify: `rg -n 'channel-unlinked|answerCallbackQuery' $RT/lib/channel-telegram.ts` prints both
- [ ] T007 [P] Create the Slack transport with the envelope acknowledge, the reconnect, the 3,000-character cut of the chunk that carries the buttons, the three-way error rule of REQ-036 and the probe, from `design/wire-notes.md` and the Wire Table with no tinychannels path in the brief, was T027 (`$RT/lib/channel-slack.ts`). Verify: `rg -n 'apps.connections.open|envelope_id|auth.test|block_actions|3900|3000' $RT/lib/channel-slack.ts` prints all six
- [ ] T008 [P] Create the terminal transport, was T029 (`$RT/lib/channel-terminal.ts`). Verify: `rg -n 'readline|answerItem|enqueueRequest' $RT/lib/channel-terminal.ts` prints all three
- [ ] T009 Add `listen` with the lease, the probe line and the transport table, was the listen half of T034 (`.skilled/bin/bots.cjs`). Verify: `rg -n "channel-listening|listen-" .skilled/bin/bots.cjs $RT/lib/channel.ts` prints the refusal and the lease path
- [ ] T010 [P] Record the Telegram and Slack fixtures with invented data only (`$RT/tests/fixtures/channels/`). Verify: `ls $RT/tests/fixtures/channels/ | wc -l | tr -d ' '` prints a number above 0 and `rg -n 'xox[abp]-[0-9]|xapp-[0-9]|[0-9]{8,10}:[A-Za-z0-9_-]{30,}' $RT/tests/fixtures/channels/` exits 1
- [ ] T011 Create the transport tests with one block per transport and a sixth `transport shared` block for the rules every transport obeys, was T040 and the injection half of T071 (`$RT/tests/channel-transports.vitest.ts`). The blocks are `transport telegram`, `transport slack`, `transport terminal` and `transport shared`, and every test is named in `acceptance-criteria.md` AC-007 to AC-036. Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport ")` prints `Tests  16 passed`, and `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts)` prints no `failed`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run the whole runtime suite (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [ ] T013 Type-check the runtime (`$RT/tsconfig.json`). Verify: `cd $RT && npm run typecheck` exits 0
- [ ] T014 Prove the buttons and the press check (`$RT/tests/channel-transports.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport telegram sends an inline keyboard with the action id$")` prints `Tests  1 passed` and `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport slack sends Block Kit buttons with the action id$")` prints `Tests  1 passed` |
- [ ] T015 Prove Telegram and Slack replay, chunking and redelivery (`$RT/tests/channel-transports.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport telegram follows the wire table$")` prints `Tests  1 passed` and `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport slack follows the wire table$")` prints `Tests  1 passed` |
- [ ] T016 Prove the token rule, was T058's proof and the token half of T071 (`$RT/tests/channel-transports.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport shared reads the token at every send$")` prints `Tests  1 passed` |
- [ ] T017 Prove the injection fixture, was T060 and the injection half of T071 (`$RT/tests/channel-transports.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport shared keeps an inbound message inside its block$")` prints `Tests  1 passed` |
- [ ] T018 Prove every sent message equals its golden (`$RT/tests/channel-transports.vitest.ts`). Verify: `(cd "$RT" && npx vitest run tests/channel-transports.vitest.ts -t "^transport shared matches every golden$")` prints `Tests  1 passed` |
- [ ] T019 Prove a piped terminal session on a temporary state root (`.skilled/bin/bots.cjs`). Verify: `T=$(mktemp -d) && mkdir -p "$T/checkout" && printf 'hello\n' | XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets $BOTS channel listen terminal --repo "$T/checkout"; echo "exit=$?"` prints `exit=0` once stdin closes
- [ ] T020 Run the validator (`specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] T012 and T013 pass from the final state
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-0' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md` prints 11
- [ ] CHK-002 [P0] The Wire Table has one row per transport. Verify: `rg -c '^\| `(telegram|slack|terminal)` \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md` prints 3
- [ ] CHK-003 [P1] Dependencies available. Verify: T001 to T004 print what they say
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The typecheck passes. Verify: T013 exits 0
- [ ] CHK-011 [P1] Each transport imports only the edges the contract allows. Verify: `rg -n "^import .* from './" $RT/lib/channel-telegram.ts $RT/lib/channel-slack.ts $RT/lib/channel-terminal.ts` names only `channel`, `channel-link`, `channel-approval`, `channel-queue`, `conversation`, `secrets`, `answer` and `request-queue`
- [ ] CHK-012 [P1] No ephemeral label in a code comment. Verify: `rg -n 'REQ-0|T0[0-9]{2}|specs/' $RT/lib/channel-telegram.ts $RT/lib/channel-slack.ts $RT/lib/channel-terminal.ts` exits 1
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `rg -c '\| Met \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/acceptance-criteria.md` prints 11
- [ ] CHK-021 [P0] The suite passes. Verify: T012 prints no `failed`
- [ ] CHK-022 [P1] No test reaches a network. Verify: `rg -n 'https://' $RT/tests/channel-transports.vitest.ts` names only fixture URLs passed to the injected `fetch`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No token reaches the state root. Verify: T016 passes
- [ ] CHK-031 [P0] An inbound message never ends its own block. Verify: T017 passes
- [ ] CHK-032 [P1] No credential in a fixture. Verify: T010's `rg` exits 1
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Every Wire Table cell with a provider fact cites a source or says not stated. Verify: `rg -o 'SOURCE: |not stated' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md | wc -l` prints a number above 15
- [ ] CHK-041 [P2] The parent map names this child. Verify: `rg -n '005-polling-transports/ \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md` prints the map row
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only the files of the spec's Files to Change table change. Verify: `git status --short .skilled` lists no other path beyond children 003 and 004
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/scratch -type f ! -name .gitkeep` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | [ ]/7 |
| P1 Items | 8 | [ ]/8 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-26
<!-- /ANCHOR:summary -->

---
