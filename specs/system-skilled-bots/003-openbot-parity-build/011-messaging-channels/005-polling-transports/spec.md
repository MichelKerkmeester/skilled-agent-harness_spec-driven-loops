---
title: "Feature Specification: Phase 5: polling-transports"
description: "The three transports that need no public URL and no local daemon: Telegram long polling, Slack Socket Mode and the terminal, with bots channel listen, the untrusted wrap of every inbound message, token handling and a golden check of every chat message."
trigger_phrases:
  - "polling transports"
  - "phase 5 polling transports"
  - "telegram long polling transport"
  - "slack socket mode transport"
  - "bots channel listen"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: polling-transports

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-26 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 7 |
| **Predecessor** | 004-approval-index-and-send-queue |
| **Successor** | 006-daemon-and-webhook-transports |
| **Handoff Criteria** | Telegram, Slack and the terminal pass their transport tests against recorded wire fixtures, `bots channel listen` takes and releases the lease, every chat message equals its golden, every acceptance criterion is Met and `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the messaging channels phase parent. It runs beside `006-daemon-and-webhook-transports`: the two build their transport modules side by side and take turns on `bots.cjs` and `tests/channel-transports.vitest.ts`, this child first.

**Scope Boundary**: `channel-telegram.ts`, `channel-slack.ts`, `channel-terminal.ts`, `bots channel listen` with its transport table and the tests of the three. Each transport implements the contract of `channel.ts`, follows the inbound order of child 002 and sends through child 004's queue. Signal and WhatsApp are child 006.

**Dependencies**:
- Children 003 and 004: `channel.ts`, `channel-link.ts`, `channel-approval.ts` and `channel-queue.ts`
- `../002-adapter-and-record-contracts/design/inbound-sequence.md` sections 1, 2, 3 and 6, `capabilities.md` section 2 and `records.md` sections 1.1, 5 and 6
- `../001-channel-ux-and-message-map/design/mockups.md` sections 1, 2 and 3 and the 21 goldens
- `contracts/prompt-sections.md` section 1.9, the `<conversation channel="...">` block and sections 2 and 3, its label and escape
- The 010 chat path, which the terminal reuses: `../../010-conversations/002-conversation-runtime-and-chat-verb/spec.md` section 9, anchor `chat-path`
- Phase 008's `resolveSecret` and `knownSecretValues`, the only way a token is read

**Deliverables**:
- `channel-telegram.ts`, `channel-slack.ts` and `channel-terminal.ts`
- `bots channel listen <channel>` with its lease and start probe
- The untrusted wrap of every inbound chat message, rendered through `conversation.ts`
- `tests/channel-transports.vitest.ts` with one `describe` block per transport, and recorded wire fixtures under `tests/fixtures/channels/`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The contract, the index and the queue exist after children 003 and 004 and nothing speaks to a real provider. The two providers most teams already use, and the terminal, need no public URL, so they can ship before the transports that need a daemon or a webhook.

### Purpose
Three transports a person can answer from today, each with its protocol, its credentials, its limits, its retries, its idempotency key and its restart behavior fixed in one table.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Taken on 2026-11-26 in this worktree.

```text
$ rg -n '"timeout": 30' specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs
1873:                "timeout": 30,
$ rg -n 'reconnect_backoff: Duration::from_secs' specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/types.rs
88:            reconnect_backoff: Duration::from_secs(2),
$ ls .skilled/skills/system-skilled-bots/runtime/lib/channel-telegram.ts; echo "exit=$?"
ls: .skilled/skills/system-skilled-bots/runtime/lib/channel-telegram.ts: No such file or directory
exit=1
```

The reference polls with a 30 s timeout and reconnects Slack after 2 s, and no transport exists in the runtime.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:wire -->
### Wire Table

One row per transport. Each value is the reference's or a design child's, cited and a value no reference states is written as not stated.

| Transport | Protocol | Auth | Rate limits | Retries | Idempotency key | Restart |
|-----------|----------|------|-------------|---------|-----------------|---------|
| `telegram` | HTTPS Bot API. Long-polls `getUpdates` with `offset`, `timeout: 30` and `allowed_updates` of `message` and `callback_query`, where the reference adds two more [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1873-1874]. Clears any webhook first [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_core.rs:267-272]. Sends `sendMessage` as plain text with an `inline_keyboard` | The bot token in the URL path, read by `resolveSecret` from the configured secret name and rendered `bot<redacted>` everywhere else | Telegram's own limits are not stated in the reference. A `429` is retryable like a `5xx` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_send.rs:384]. 4,096 per message, counted in bytes (`../002-adapter-and-record-contracts/design/capabilities.md` section 2) | A failed poll waits 5 s and a `409` conflict waits 2 s [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_types.rs:26-29]. A send retries by the queue's backoff | Inbound `update:<update_id>` in the seen record [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1970-1985]. Outbound the queue key | The offset is not persisted and the first poll starts at `0` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1854], so unconfirmed updates return and the seen record drops those already taken |
| `slack` | Socket Mode. `apps.connections.open` returns a WebSocket URL [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/socket.rs:23-27]. Sends `chat.postMessage` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/types.rs:152] with Block Kit buttons [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/blocks.rs:70] | The app-level token under `<secret>` and the bot token under `<secret>-bot` (`../002-adapter-and-record-contracts/design/records.md` section 1.1) | A `429` carries `Retry-After`, which the reference reads [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs:82-89] and the error code `ratelimited` is the same case [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs:153]. 3,900 characters per message | The socket reconnects after 2 s [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/types.rs:88]. A send waits the larger of the backoff step and `Retry-After` | Inbound `envelope:<envelope_id>` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/events.rs:146-149], acknowledged by echoing `envelope_id` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/socket.rs:138-141]. Outbound the queue key | An unacknowledged envelope is redelivered after the next connect [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/socket.rs:194-199], and a `disconnect` frame reopens through a fresh `apps.connections.open` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/socket.rs:164-166] |
| `terminal` | stdin lines in, stdout lines out | None. The actor is the OS user, because a stdin line has no link and the answer goes to `answerItem` with the surface `channel`, so the roster must name that user (`contracts/answer-seam.md` step 1) | None | None. A refused answer prints its catalog reply and the line is not read again | None. A stdin line has no redelivery (`../002-adapter-and-record-contracts/design/inbound-sequence.md` section 6) | Nothing is held but the lease and the 010 conversation file, whose append of the human message is the commit point |
<!-- /ANCHOR:wire -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build the Telegram, Slack and terminal transports on the contract of `channel.ts`, each following the inbound order of child 002.
- Add `bots channel listen <channel>`, which takes the lease, runs the start probe and runs one transport until stopped.
- Render every inbound chat message that is not an answer as a `<conversation channel="...">` block through `conversation.ts` before it becomes a request prompt.
- Read every token through phase 008 at `start` and at every send, and never store one.
- Compare every message the three transports send to its golden.

### Out of Scope
- Signal and WhatsApp - child 006.
- Telegram webhooks - long polling needs no public URL.
- Slack slash commands, reactions and the Events API over HTTP - Socket Mode carries direct messages and button presses.
- Markdown or `parse_mode` - every surface is plain text (`../001-channel-ux-and-message-map/design/mockups.md` section 1).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-telegram.ts` | Create | Long polling, the inline keyboard, the press check, the probe and the send |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-slack.ts` | Create | Socket Mode, Block Kit, the envelope acknowledge, the probe and the send |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-terminal.ts` | Create | stdin lines, the grammar and the 010 chat path |
| `.skilled/bin/bots.cjs` | Modify | `listen` with its transport table, after child 004's verbs |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-transports.vitest.ts` | Create | One `describe` block per transport. Child 006 appends two |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/channels/` | Create | Recorded request and response bodies for Telegram and Slack, invented data only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids keep their pre-expansion numbers and are unique across children 003 to 007, as `../spec.md` section 4 maps them. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-007 | Telegram sends an inline keyboard and Slack sends Block Kit buttons, each carrying `approval-v1:<item-id>:<index>` with the 1-based index of child 004. The choices are the item's `options`, and an item with no options gets a YES and NO pair. Every event is checked against the link record before it is emitted as an inbound event, a press and a typed line alike, so an event from an unlinked chat reaches no handler and an event whose sender id is not the link record's `senderId` is refused `channel-unlinked` on every transport. A Slack `block_actions` press from a sender who is not an approver is dropped with no reply, no counter and no `answerItem` call, and a linked actor the roster does not name gets the `answerItem` refusal, reply M14 and the `notApprover` counter |
| REQ-009 | Telegram follows the `telegram` row of the Wire Table: it long-polls `getUpdates` with `offset`, `timeout: 30` and `allowed_updates` of `message` and `callback_query`, registers no webhook and cuts text at 4,096 bytes on a code point boundary. The offset moves past an update only after the seen record is written |
| REQ-010 | Slack follows the `slack` row of the Wire Table: Socket Mode through `apps.connections.open`, no inbound port, an `envelope_id` acknowledge after the seen record, text cut at 3,900 characters and escaped for `&`, `<` and `>` |
| REQ-014 | A channel names its token as a phase 008 secret. The value is read through `resolveSecret` at `start` and at every send and never held in a field that outlives the call. It is never written to `channels/config.json`, a queue entry, a log or a run record and every URL and error passes through `redactToken`, so a failed `getUpdates` prints `bot<redacted>`. A transport sends only the queued text, which is the `deliveryMessage()` output and the choice block after the literal check of child 004, never a re-rendered question [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:291]. On a channel whose capability says `buttons: yes` that queued text is the M02 button form, so the keyboard is drawn from the same bytes the transport sends, and on a channel without buttons it is the M01 text form |
| REQ-022 | An inbound chat message that is not an answer becomes a request whose prompt is a `<conversation channel="<channel>">` block rendered by `conversation.ts`, with the untrusted label and the escape of `contracts/prompt-sections.md` sections 2 and 3. The bot's body and the protocol lines outrank it, a message that tries to change posture stays inside its block as its own text, no run-record field carries the attempt and a message holding a closing tag is escaped so it cannot end its block |
| REQ-035 | A chat message that starts a run names its bot: the text begins with `@<bot-id>` and the rest is the prompt. A message with no `@` address, or one naming a bot this host does not run, reaches no bot and is answered with catalog row M22, which is a usage reply and not a refusal, because no verb returned it. The address is stripped before the prompt is built, so the bot never sees it. The request carries `<channel>:<chatId>` as its reply target, so the run's prompt and its outcome reach the chat that asked. The terminal transport's conversation id is `terminal:<os-user>`, which is its reply target |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-015 | `bots channel listen terminal` reads stdin lines, answers the newest open prompt by the grammar of child 004 with the OS user as the actor and the surface `channel` and sends anything else through the 010 chat path. It needs no tty. Its prompts come from the needs-you list and never from the approval index: at start and on a 60 s tick it lists the open needs-you items for its identity, prints each one's question and choices and resolves a reply against that list, so the terminal writes no index entry and no drain process has to print to its stdout |
| REQ-024 | `bots channel listen telegram` takes `channels/listen-telegram.lease`, refusing `channel-listening` with exit 4 while another holder is alive, resolves the token, clears any webhook, calls `getMe` once and prints `bots: telegram ready as @<username>` on stderr before its first poll. A missing secret refuses `secret-unknown` with exit 4 before any I/O. A `401` on the probe exits 1 with `bots: telegram rejected the credential` and releases the lease. After each inbound turn and on a 60 s tick it runs one drain pass for its own channel, so a reply leaves the queue without a second process |
| REQ-025 | `bots channel listen slack` does the same with `auth.test` on the bot token and then `apps.connections.open` on the app token, and prints `bots: slack ready as <bot user id>` |
| REQ-029 | Every message the three transports send, in each of the twelve situations of `../001-channel-ux-and-message-map/design/mockups.md` that apply to them, equals its golden or the mockup's wire payload byte for byte |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Telegram fixture with one message and one press produces one queued request and one answered item, and a replay of the same fixture produces nothing new
- **SC-002**: A Slack fixture produces the same, and every envelope is acknowledged after its seen record
- **SC-003**: A piped `1` on the terminal answers the open prompt and `hello` appends one chat message
- **SC-004**: `rg -n '<the token value>' <temporary state root>` prints nothing after a send
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 008's secret store | No token can be read | `secret-unknown` before any I/O |
| Risk | A chat message tries prompt injection | A bot follows it | The untrusted block of REQ-022, escaped |
| Risk | A provider limit the reference does not state | A burst is throttled | The queue's backoff honours `429` and `Retry-After` |
| Risk | Two `listen` processes on one channel | Telegram answers `409` and Slack doubles every event | The lease of REQ-024 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One poll or one socket per channel. A message costs one seen read, one durable write and one seen write before the acknowledge

### Security
- **NFR-S01**: No token in any file under the state root, and no token in any URL a log or error shows
- **NFR-S02**: No test reaches a network. Every wire call goes to a recorded fixture

### Reliability
- **NFR-R01**: A stop at any step of the inbound order loses no message the provider would redeliver and answers nothing twice
- **NFR-R02**: `listen` releases its lease on a normal stop and a stale lease is reclaimed
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty chat message is dropped before the grammar and reaches no bot
- Maximum input: a 4,500-character question is cut into two Telegram messages and two Slack messages, with the buttons on the last
- Failure path: a `409` from Telegram waits 2 s and polls again, and a `disconnect` frame from Slack reconnects
- A press on Telegram from a chat that is linked but not an approver: `answer-not-approver` and reply M14
- A message holding `</conversation>`: escaped inside its own block
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Three transports, one verb, one shared test file and fixtures |
| Risk | 13/25 | Tokens, injection and redelivery |
| Research | 6/20 | The design children and the Wire Table fix the facts |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which surface does the terminal transport answer on? Settled: `channel`, with the OS user as actor, as `contracts/answer-seam.md` section 1, step 1 "Surface", and its decisions table now state for the terminal transport by name. Reversal condition: the contract owner gives the terminal transport the `terminal` surface in that row and in REQ-015 together.
- What does a rejected credential refuse? Settled: no refusal name. `contracts/refusals.md` section 3.10, the rejected credential row, fixes the line `bots: <channel> rejected the credential`, the released lease and exit 1, which REQ-024 and REQ-025 specify.
- Does a chat see the bot's reply text? No, the parent spec section 5.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Design children**: `../001-channel-ux-and-message-map/design/`, `../002-adapter-and-record-contracts/design/`
- **Sibling**: `../006-daemon-and-webhook-transports/`
