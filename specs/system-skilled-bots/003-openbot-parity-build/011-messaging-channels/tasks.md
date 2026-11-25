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
- [ ] T021 Add the numbered and YES/NO reply grammar (`$RT/lib/channel-approval.ts`). Verify: `rg -n 'YES|NO' $RT/lib/channel-approval.ts` prints the grammar
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
- [ ] T032 Add the `channel` verb group's usage line and verb spec (`.skilled/bin/bots.cjs`). Verify: `rg -n 'channel' .skilled/bin/bots.cjs` prints the usage line and the verb spec
- [ ] T033 Add `list`, `link` and `unlink` (`.skilled/bin/bots.cjs`). Verify: `$BOTS channel list` exits 0 on a temporary state root
- [ ] T034 Add `send`, `listen` and `drain` (`.skilled/bin/bots.cjs`). Verify: `$BOTS channel drain` exits 0 with an empty queue
- [ ] T035 Create the shared fake transport (`$RT/tests/channel-support.ts`). Verify: `rg -n 'fakeTransport|temporaryStateRoot' $RT/tests/channel-support.ts` prints both
- [ ] T036 Create the contract tests (`$RT/tests/channel.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel.vitest.ts` prints no `failed`
- [ ] T037 Create the link tests (`$RT/tests/channel-link.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-link.vitest.ts` prints no `failed`
- [ ] T038 Create the approval tests (`$RT/tests/channel-approval.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-approval.vitest.ts` prints no `failed`
- [ ] T039 Create the queue tests (`$RT/tests/channel-queue.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-queue.vitest.ts` prints no `failed`
- [ ] T040 Create the transport tests (`$RT/tests/channel-transports.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-transports.vitest.ts` prints no `failed`
- [ ] T041 Create the conformance tests (`$RT/tests/channel-conformance.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-conformance.vitest.ts` prints no `failed`
- [ ] T042 Create the CLI tests (`$RT/tests/cli-channel.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-channel.vitest.ts` prints no `failed`
- [ ] T043 Write the Apache-2.0 notices (`THIRD_PARTY_NOTICES.md`). Verify: `rg -n 'rakazo|turnstone' THIRD_PARTY_NOTICES.md` prints one line per lifted file
- [ ] T044 Add the nine modules to the runtime README (`$RT/lib/README.md`). Verify: `rg -n 'channel.ts' $RT/lib/README.md` prints the row
- [ ] T045 Write the channel reference (`.skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md`). Verify: `rg -n 'operator prerequisite' .skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md` prints the WhatsApp row
- [ ] T046 Name the verb group in the run mode (`.skilled/skills/system-skilled-bots/bots-run/SKILL.md`). Verify: `rg -n 'bots channel' .skilled/skills/system-skilled-bots/bots-run/SKILL.md` prints the line
- [ ] T047 Name `bots channel` in the hub (`.skilled/skills/system-skilled-bots/SKILL.md`). Verify: `rg -n 'bots channel' .skilled/skills/system-skilled-bots/SKILL.md` prints the line
- [ ] T048 Mirror the hub line (`.opencode/skills/system-skilled-bots/SKILL.md`). Verify: `diff -q .skilled/skills/system-skilled-bots/SKILL.md .opencode/skills/system-skilled-bots/SKILL.md` prints nothing
- [ ] T049 Mirror the edited CLI (`.opencode/bin/bots.cjs`). Verify: `diff -q .skilled/bin/bots.cjs .opencode/bin/bots.cjs` prints nothing
- [ ] T050 Write the feature entry (`.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/messaging-channels.md`). Verify: `rg -n 'Source Files' .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/messaging-channels.md` prints the section
- [ ] T051 Add the catalog row (`.skilled/skills/system-skilled-bots/feature-catalog/feature-catalog.md`). Verify: `rg -n 'messaging-channels.md' .skilled/skills/system-skilled-bots/feature-catalog/feature-catalog.md` prints the row
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T052 Run the whole runtime suite (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [ ] T053 Type-check the runtime (`$RT/tsconfig.json`). Verify: `cd $RT && npx tsc --noEmit` exits 0
- [ ] T054 Prove the link and the default deny (`.skilled/bin/bots.cjs`). Verify: `$BOTS channel link telegram` prints one code and an unlinked message exits 4 with `channel-unlinked`
- [ ] T055 Prove the lockout (`$RT/tests/channel-link.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-link.vitest.ts -t "lockout"` prints one passing test
- [ ] T056 Prove the approval index survives a restart (`$RT/tests/channel-approval.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-approval.vitest.ts -t "restart"` prints one passing test
- [ ] T057 Prove the non-approver refusal (`$RT/tests/channel-link.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-link.vitest.ts -t "not-approver"` prints one passing test
- [ ] T058 Prove the uncertain send is not retried (`$RT/tests/channel-queue.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-queue.vitest.ts -t "unknown"` prints one passing test
- [ ] T059 Prove the conformance rules (`$RT/tests/channel-conformance.vitest.ts`). Verify: `cd $RT && npx vitest run tests/channel-conformance.vitest.ts` prints no `failed`
- [ ] T060 Run the packet validator (`specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`, and `diff -q .skilled/bin/bots.cjs .opencode/bin/bots.cjs` prints nothing
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `cd $RT && npx tsc --noEmit` exits 0
- [ ] CHK-011 [P0] `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [ ] CHK-012 [P1] Every refusal is a named reason, not a throw: `rg -n 'throw new Error' $RT/lib/channel-*.ts` prints only the unsafe-segment guard
- [ ] CHK-013 [P1] No channel module imports the CLI or the checker: `rg -n "bin/bots.cjs|scripts/" $RT/lib/channel-*.ts` exits 1
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The five conformance rules pass on the fake transport
- [ ] CHK-022 [P1] Each transport's chunk limit is tested at the limit and one character over
- [ ] CHK-023 [P1] The lockout, the non-approver and the bad signature are each tested
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret: `rg -n 'bot_token|app_token|app_secret' $RT/lib/channel-*.ts` prints only a secret name, never a value
- [ ] CHK-031 [P0] The WhatsApp body is authenticated before it is parsed
- [ ] CHK-032 [P0] Only an owner or a member answers an item: `rg -n 'isApprover' $RT/lib/channel-approval.ts` prints the check before the answer call
- [ ] CHK-033 [P1] A token is read at send time and never written to a file: `rg -n 'token' $RT/lib/channel-queue.ts` exits 1
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
| P0 Items | 9 | [ ]/9 |
| P1 Items | 10 | [ ]/10 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---



