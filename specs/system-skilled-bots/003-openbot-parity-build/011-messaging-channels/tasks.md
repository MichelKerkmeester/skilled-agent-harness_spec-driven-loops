---
title: "Tasks: Phase 11: messaging-channels"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "messaging channels tasks"
  - "bots channel tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: messaging-channels

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

Three shell variables this list uses: `RT` is `.skilled/skills/system-skilled-bots/runtime`, `BOTS` is `node .skilled/bin/bots.cjs` and `CTX` is `specs/system-skilled-bots/context`.

Every task that writes state runs on a temporary state root, never the real one: `T=$(mktemp -d) && mkdir -p "$T/checkout"`, then `XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets` in front of the command and `--repo "$T/checkout"` after it. The empty checkout is what keeps this repository's config and origin remote out of the run, and `SKILLED_BOTS_STATE_ROOT` must be unset because it wins over `XDG_STATE_HOME` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:102-108]. A roster left on the real root would refuse real terminal answers, and a drain there would send real queued messages.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the adapter contract (`$CTX/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs`). Verify: `rg -n 'declared_capabilities|async fn start' $CTX/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs` prints both
- [ ] T002 Record the four message types (`$CTX/tinychannels-main/crates/tinychannels-bus/src/channel/`). Verify: `rg -n 'struct ChannelInboundEnvelope|struct ChannelOutboundIntent|struct MessageReceipt|struct ChannelSendError' $CTX/tinychannels-main/crates/tinychannels-bus/src/channel/` prints four
- [ ] T003 Record the approval action id (`$CTX/tinychannels-main/crates/tinychannels-bus/src/channel/event.rs`). Verify: `rg -n 'approval-v1' $CTX/tinychannels-main/crates/tinychannels-bus/src/channel/event.rs` prints the format and the parser
- [ ] T004 Record the pairing lockout (`$CTX/tinychannels-main/crates/tinychannels-runtime/src/security/mod.rs`). Verify: `rg -n 'MAX_PAIR_ATTEMPTS|PAIR_LOCKOUT_SECS' $CTX/tinychannels-main/crates/tinychannels-runtime/src/security/mod.rs` prints 5 and 300
- [ ] T005 Record the delivery queue and its backoff (`$CTX/tinychannels-main/src/delivery/policy.rs`). Verify: `rg -n 'BACKOFF_MS' $CTX/tinychannels-main/src/delivery/policy.rs` prints the five values
- [ ] T006 Record the conformance rules (`$CTX/tinychannels-main/crates/tinychannels-conformance/src/lib.rs`). Verify: `rg -n 'explicitly_unsupported|reached the mock platform' $CTX/tinychannels-main/crates/tinychannels-conformance/src/lib.rs` prints both
- [ ] T007 Record the Telegram wire facts (`$CTX/tinychannels-main/src/providers/telegram/`). Verify: `rg -n 'getUpdates|TELEGRAM_MAX_MESSAGE_LENGTH' $CTX/tinychannels-main/src/providers/telegram/` prints both
- [ ] T008 Record the Slack wire facts (`$CTX/tinychannels-main/src/providers/slack/`). Verify: `rg -n 'apps.connections.open|SLACK_TEXT_CHUNK_CHARS' $CTX/tinychannels-main/src/providers/slack/` prints both
- [ ] T009 Record the Signal wire facts (`$CTX/tinychannels-main/src/providers/signal/`). Verify: `rg -n 'api/v1/rpc|SIGNAL_TEXT_CHUNK_CHARS' $CTX/tinychannels-main/src/providers/signal/` prints both
- [ ] T010 Record the WhatsApp wire facts (`$CTX/tinychannels-main/src/providers/whatsapp/`). Verify: `rg -n 'X-Hub-Signature-256|TEXT_LIMIT' $CTX/tinychannels-main/src/providers/whatsapp/` prints both
- [ ] T011 Record the delivery hook and the item id (`$RT/lib/delivery.ts`). Verify: `rg -n 'parked|entry.itemId' $RT/lib/delivery.ts` prints both
- [ ] T012 Record the answer path (`$RT/lib/answer.ts`). Verify: `rg -n 'export function answerItem' $RT/lib/answer.ts` prints one line
- [ ] T013 Record the state layout (`$RT/lib/state-root.ts`). Verify: `rg -n 'export function deliveryClaimFolder' $RT/lib/state-root.ts` prints one line
- [ ] T014 Capture the baseline suite result (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` count
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T015 Create the contract and the message model (`$RT/lib/channel.ts`). Verify: `rg -n 'ChannelAdapter|ChannelInbound|ChannelOutbound|ChannelSendResult' $RT/lib/channel.ts` prints all four
- [ ] T016 Add the declared-capability table and the unsupported refusal (`$RT/lib/channel.ts`). Verify: `rg -n 'unsupported|retryable|sentBeforeError' $RT/lib/channel.ts` prints the three flags
- [ ] T017 Create the pairing code and the link record (`$RT/lib/channel-link.ts`). Verify: `rg -n 'LINK_CODE|links.json' $RT/lib/channel-link.ts` prints both
- [ ] T018 Add the 5-failure 300 s lockout (`$RT/lib/channel-link.ts`). Verify: `rg -n 'MAX_PAIR_ATTEMPTS|PAIR_LOCKOUT_SECS' $RT/lib/channel-link.ts` prints 5 and 300
- [ ] T019 Add the `operators.json` roster read and the approver check (`$RT/lib/channel-link.ts`). Verify: `rg -n 'operators.json|isApprover' $RT/lib/channel-link.ts` prints both
- [ ] T020 Create the approval index (`$RT/lib/channel-approval.ts`). Verify: `rg -n 'approval-v1|approvals.json' $RT/lib/channel-approval.ts` prints both
- [ ] T021 Add the numbered and YES/NO reply grammar, mapping `N` to `no` before the answer call so a NO records `deny` on the item's grant (`$RT/lib/channel-approval.ts`). Verify: `rg -n 'YES|NO|deny' $RT/lib/channel-approval.ts` prints the grammar and the deny mapping
- [ ] T022 Create the durable send queue (`$RT/lib/channel-queue.ts`). Verify: `rg -n 'enqueue|unknown' $RT/lib/channel-queue.ts` prints both
- [ ] T023 Add the backoff table (`$RT/lib/channel-queue.ts`). Verify: `rg -n 'BACKOFF_MS' $RT/lib/channel-queue.ts` prints the five values
- [ ] T024 Add `channelFolder` and `ensureChannelState` (`$RT/lib/state-root.ts`). Verify: `rg -n 'channelFolder|ensureChannelState' $RT/lib/state-root.ts` prints both
- [ ] T025 Create the Telegram transport (`$RT/lib/channel-telegram.ts`). Verify: `rg -n 'getUpdates|4096|inline_keyboard' $RT/lib/channel-telegram.ts` prints all three
- [ ] T026 Add the Telegram allowlist check before a press (`$RT/lib/channel-telegram.ts`). Verify: `rg -n 'callback_is_allowed|channel-unlinked' $RT/lib/channel-telegram.ts` prints both
- [ ] T027 Create the Slack transport (`$RT/lib/channel-slack.ts`). Verify: `rg -n 'apps.connections.open|3900|block_actions' $RT/lib/channel-slack.ts` prints all three
- [ ] T028 Create the Signal transport (`$RT/lib/channel-signal.ts`). Verify: `rg -n 'api/v1/rpc|api/v1/events|2000' $RT/lib/channel-signal.ts` prints all three
- [ ] T029 Create the terminal fallback transport (`$RT/lib/channel-terminal.ts`). Verify: `rg -n 'readline|answerItem|enqueueRequest' $RT/lib/channel-terminal.ts` prints all three
- [ ] T030 Create the WhatsApp transport last, because it is the one transport that needs a public URL (`$RT/lib/channel-whatsapp.ts`). Verify: `rg -n 'X-Hub-Signature-256|4096|timingSafeEqual' $RT/lib/channel-whatsapp.ts` prints all three
- [ ] T031 Add the four channel names and their senders (`$RT/lib/delivery.ts`). Verify: `rg -n "DELIVERY_CHANNELS" $RT/lib/delivery.ts` prints five names
- [ ] T032 Add the `channel` verb group's usage line, its `VERB_SPECS` entry and its `parseArgs` branch (`.skilled/bin/bots.cjs`). The entry is `channel: { ids: 0, options: ['role'] }`, because `parseArgs` caps positionals by `spec.ids` and refuses an option outside `COMMON_OPTIONS` or `spec.options` [SOURCE: .skilled/bin/bots.cjs:143] [SOURCE: .skilled/bin/bots.cjs:167]; `role` also joins `KNOWN_OPTIONS`, because an option outside that set is refused before the spec is read [SOURCE: .skilled/bin/bots.cjs:126]; and a `channel` branch beside the `enqueue`, `schedule` and `answer` branches reads `roster add|remove|list` and its actor from the positional list and returns them as `args`, because the generic tail returns `args: []` [SOURCE: .skilled/bin/bots.cjs:168]. Verify: `rg -n "channel: \{ ids: 0" .skilled/bin/bots.cjs` prints the verb spec, `rg -n "'role'" .skilled/bin/bots.cjs` prints two lines, and `rg -n "verb === 'channel'" .skilled/bin/bots.cjs` prints the parse branch
- [ ] T033 Add `list`, `link` and `unlink`, with `--secret <name>` on `link` defaulting to the channel's own name (`.skilled/bin/bots.cjs`). Verify: `T=$(mktemp -d) && mkdir -p "$T/checkout" && XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets $BOTS channel list --repo "$T/checkout"` exits 0
- [ ] T034 Add `send`, `listen` and `drain` (`.skilled/bin/bots.cjs`). Verify: `T=$(mktemp -d) && mkdir -p "$T/checkout" && XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets $BOTS channel drain --repo "$T/checkout"` exits 0 with an empty queue
- [ ] T035 Create the shared fake transport (`$RT/tests/channel-support.ts`). Verify: `rg -n 'fakeTransport|temporaryStateRoot' $RT/tests/channel-support.ts` prints both
- [ ] T036 Create the contract tests (`$RT/tests/channel.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel.vitest.ts` prints no `failed`
- [ ] T037 Create the link tests (`$RT/tests/channel-link.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-link.vitest.ts` prints no `failed`
- [ ] T038 Create the approval tests (`$RT/tests/channel-approval.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-approval.vitest.ts` prints no `failed`
- [ ] T039 Create the queue tests (`$RT/tests/channel-queue.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-queue.vitest.ts` prints no `failed`
- [ ] T040 Create the transport tests (`$RT/tests/channel-transports.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-transports.vitest.ts` prints no `failed`
- [ ] T041 Create the conformance tests (`$RT/tests/channel-conformance.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-conformance.vitest.ts` prints no `failed`
- [ ] T042 Create the CLI tests (`$RT/tests/cli-channel.vitest.ts`), including the unlinked-message refusal `channel-unlinked`, which no CLI command can reach because a message arrives from a transport rather than from argv. Verify: `cd $RT && npx vitest run tests/cli-channel.vitest.ts` prints no `failed`
- [ ] T043 Append a `## 011-messaging-channels` section to `THIRD_PARTY_NOTICES.md` with the Apache-2.0 notices, one entry per lifted file (`.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md`). Verify: `rg -n 'rakazo|turnstone' .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints one line per lifted file
- [ ] T044 Add the nine modules to the runtime README (`$RT/lib/README.md`). Verify: `rg -n 'channel.ts' $RT/lib/README.md` prints the row
- [ ] T045 Write the channel reference (`.skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md`). Verify: `rg -n 'operator prerequisite' .skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md` prints the WhatsApp row
- [ ] T046 Name the verb group in the run mode (`.skilled/skills/system-skilled-bots/bots-run/SKILL.md`). Verify: `rg -n 'bots channel' .skilled/skills/system-skilled-bots/bots-run/SKILL.md` prints the line
- [ ] T047 Name `bots channel` in the hub (`.skilled/skills/system-skilled-bots/SKILL.md`). Verify: `rg -n 'bots channel' .skilled/skills/system-skilled-bots/SKILL.md` prints the line
- [ ] T048 Write the feature entry (`.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/messaging-channels.md`). Verify: `rg -n 'Source Files' .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/messaging-channels.md` prints the section
- [ ] T049 Add the catalog row (`.skilled/skills/system-skilled-bots/feature-catalog/feature-catalog.md`). Verify: `rg -n 'messaging-channels.md' .skilled/skills/system-skilled-bots/feature-catalog/feature-catalog.md` prints the row
- [ ] T050 Add the roster verbs `add`, `remove` and `list` (`.skilled/bin/bots.cjs`). Verify: `T=$(mktemp -d) && mkdir -p "$T/checkout" && XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets $BOTS channel roster add ada --role owner --repo "$T/checkout"` exits 0 and `find "$T/state" -name operators.json` prints one path
- [ ] T051 Add the roster read, write and creation rule (`$RT/lib/channel-link.ts`). Verify: `rg -n 'operators.json|channel-roster-missing|channel-roster-owner' $RT/lib/channel-link.ts` prints all three
- [ ] T052 Add the six-digit five-minute one-use code and the sender id on the link record (`$RT/lib/channel-link.ts`). Verify: `rg -n 'LINK_CODE_TTL|senderId' $RT/lib/channel-link.ts` prints both
- [ ] T053 Add the per-actor approver lockout, so one member's failures do not lock the chat (`$RT/lib/channel-link.ts`). Verify: `rg -n 'approverFailures' $RT/lib/channel-link.ts` prints the counter, and `rg -n 'answer-not-approver' $RT/lib/answer.ts` prints the refusal it counts
- [ ] T054 Add the roster check to `answerItem`, before the write, and take the actor and the surface (`terminal` or `channel`) as arguments, so a channel passes both with no tty and an absent roster refuses only the channel surface (`$RT/lib/answer.ts`). Verify: `rg -n 'answer-not-approver|isApprover|channel-roster-missing' $RT/lib/answer.ts` prints all three, and `rg -n 'isTTY' $RT/lib/answer.ts` exits 1
- [ ] T055 Add the approval entry's `expiresAt` and the `item-expired` refusal (`$RT/lib/channel-approval.ts`). Verify: `rg -n 'expiresAt|item-expired' $RT/lib/channel-approval.ts` prints both
- [ ] T056 Add the group-chat refusal (`$RT/lib/channel-approval.ts`). Verify: `rg -n 'channel-group-approval' $RT/lib/channel-approval.ts` prints the refusal
- [ ] T057 Write the `unknown` send state to the run record's delivery entry (`$RT/lib/channel-queue.ts`). Verify: `rg -n 'unknown' $RT/lib/channel-queue.ts` prints the state and the record write
- [ ] T058 Read the token at `start` and render every URL with `bot<redacted>` (`$RT/lib/channel.ts`). Verify: `rg -n 'bot<redacted>|redactToken' $RT/lib/channel.ts` prints both
- [ ] T059 Send only the `deliveryMessage()` output after the literal check, never a re-rendered question (`$RT/lib/delivery.ts`). Verify: `rg -n 'deliveryMessage|findSecretLiteral' $RT/lib/delivery.ts` prints both
- [ ] T060 Wrap an inbound chat message in its untrusted block before it becomes a request prompt (`$RT/lib/channel.ts`). Verify: `rg -n 'untrusted|conversation' $RT/lib/channel.ts` prints the label
- [ ] T074 Add the `channels/config.json` read and write, the only reader and writer of the file, with `secret` defaulting to the channel's own name and `unlink` writing `enabled: false` (`$RT/lib/channel.ts`). Verify: `rg -n 'readChannelConfig|writeChannelConfig' $RT/lib/channel.ts` prints both, `rg -n 'config.json' $RT/lib/channel-link.ts` exits 1, so the file has one owner, and `cd $RT && npx vitest run tests/channel.vitest.ts -t "config"` prints one passing test
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T061 Run the whole runtime suite (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [ ] T062 Type-check the runtime (`$RT/tsconfig.json`). Verify: `cd $RT && npm run typecheck` exits 0
- [ ] T063 Prove the link on a temporary state root (`.skilled/bin/bots.cjs`). The roster is added first, because `link` refuses `channel-roster-missing` until `operators.json` names an actor, and the unlinked-message refusal is proved in `tests/cli-channel.vitest.ts` rather than here, because no CLI command can deliver a message to a chat. Verify: `T=$(mktemp -d) && mkdir -p "$T/checkout" && XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets $BOTS channel roster add ada --role owner --repo "$T/checkout"` exits 0, then `XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets $BOTS channel link telegram --repo "$T/checkout"` prints one six-digit code
- [ ] T064 Prove the lockout (`$RT/tests/channel-link.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-link.vitest.ts -t "lockout"` prints one passing test
- [ ] T065 Prove the approval index survives a restart (`$RT/tests/channel-approval.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-approval.vitest.ts -t "restart"` prints one passing test
- [ ] T066 Prove the non-approver refusal (`$RT/tests/channel-link.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-link.vitest.ts -t "not-approver"` prints one passing test
- [ ] T067 Prove the uncertain send is not retried (`$RT/tests/channel-queue.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-queue.vitest.ts -t "unknown"` prints one passing test
- [ ] T068 Prove the conformance rules, the mismatched sender id and the withheld secret question (`$RT/tests/channel-conformance.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-conformance.vitest.ts` prints no `failed`
- [ ] T069 Prove the roster verbs and the absent-roster refusal (`$RT/tests/cli-channel.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-channel.vitest.ts -t "roster"` prints one passing test
- [ ] T070 Prove `answer-not-approver` through `answerItem` with the surface `channel` and an explicit actor, on a channel press, the terminal answer that an absent roster does not refuse, and the terminal answer a present roster refuses, which is what `bots enable`'s fatigue answer and the screen's answer reach (`$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/answer.vitest.ts -t "not-approver"` prints one passing test, and `cd $RT && npx vitest run tests/answer.vitest.ts -t "no roster"` prints one passing test
- [ ] T071 Prove the injection fixture and the token redaction (`$RT/tests/channel.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel.vitest.ts -t "injection"` prints one passing test
- [ ] T072 Prove the entry expiry, the group-chat refusal and the concurrent answer (`$RT/tests/channel-approval.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-approval.vitest.ts -t "expired"` prints one passing test, `cd $RT && npx vitest run tests/channel-approval.vitest.ts -t "group"` prints one passing test, and `cd $RT && npx vitest run tests/channel-approval.vitest.ts -t "concurrent"` prints one passing test
- [ ] T073 Run the packet validator (`specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`, and `test -L .opencode/bin && test -L .opencode/skills` exits 0
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md` prints 23
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -c '^\| `[^`]+` \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md` prints 10
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `cd $RT && npm run typecheck` exits 0
- [ ] CHK-011 [P0] `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [ ] CHK-012 [P1] Every refusal is a named reason, not a throw: `rg -n 'throw new Error' $RT/lib/channel-*.ts` prints only the unsafe-segment guard
- [ ] CHK-013 [P1] No channel module imports the CLI or the checker: `rg -n "bin/bots.cjs|scripts/" $RT/lib/channel-*.ts` exits 1
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `! rg -q '\| Unmet \|' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/acceptance-criteria.md` exits 0
- [ ] CHK-021 [P0] The five conformance rules pass on the fake transport. Verify: `cd $RT && npx vitest run tests/channel-conformance.vitest.ts` exits 0
- [ ] CHK-022 [P1] Each transport's chunk limit is tested at the limit and one character over
- [ ] CHK-023 [P1] The lockout, the non-approver and the bad signature are each tested
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret: `rg -n 'bot_token|app_token|app_secret' $RT/lib/channel-*.ts` prints only a secret name, never a value
- [ ] CHK-031 [P0] The WhatsApp body is authenticated before it is parsed
- [ ] CHK-032 [P0] Only an owner or a member answers an item: `rg -n 'isApprover|answer-not-approver' $RT/lib/answer.ts` prints the check before the write
- [ ] CHK-033 [P1] A token is read at `start` and at every send and never written to a file: `rg -n 'token' $RT/lib/channel-queue.ts` exits 1
- [ ] CHK-034 [P0] A chat message is labelled untrusted before it becomes a request prompt: `rg -n 'untrusted' $RT/lib/channel.ts` prints the label
- [ ] CHK-035 [P1] The roster has one writer: `rg -n 'operators.json' $RT/lib/channel-link.ts` prints the read and the write, and `rg -n 'operators.json' $RT/lib/channel-approval.ts` exits 1
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] The reference names each transport's operator prerequisite
- [ ] CHK-042 [P2] The feature catalog row links the new entry
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | [ ]/10 |
| P1 Items | 11 | [ ]/11 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---



