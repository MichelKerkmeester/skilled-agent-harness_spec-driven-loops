---
title: "Feature Specification: Phase 11: messaging-channels"
description: "Adds a shared channel adapter and a file-backed identity link, then Telegram long polling, Slack Socket Mode, Signal through a local signal-cli daemon and the WhatsApp Cloud API, so a person can talk to a bot and answer its needs-you questions from a chat, with approvals as buttons where the platform has them and numbered or YES/NO replies elsewhere."
trigger_phrases:
  - "messaging channels"
  - "phase 11 messaging channels"
  - "bots channel"
  - "telegram long polling"
  - "slack socket mode"
  - "signal-cli daemon"
  - "whatsapp cloud api webhook"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: messaging-channels

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-conversations |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh --strict` prints `RESULT: PASSED` for this folder. Nothing passes to a successor: this is the last phase of the program. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Build OpenBot parity for skilled bots: the messaging channels that put a bot in a chat, after the ten ranked slices of the 002 research. The research ranks no messaging slice, so this phase extends the program rather than continuing its order; its design references are the `tinychannels`, `rakazo` and `turnstone` context trees, and its runtime dependencies are the phases that already landed the item, the answer path and the actor.

**Scope Boundary**: The channel adapter contract, the identity link and its lockout, the file-backed approval index, the durable send queue, five transports (terminal, Telegram, Slack, Signal, WhatsApp), and the four channel names on `delivery.ts`. A hosted relay, a web UI, Discord and the other tinychannels providers, the WhatsApp Web linked-device client, attachments and streaming are out of scope.

**Dependencies**:
- The needs-you item and its derived state, which a channel prompt names by item id [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29-47]
- The answer path, which records the answer and queues the resume, so a channel answer reuses it rather than writing an item [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:65-119]
- The delivery entry that already carries a parked item's id, which is how a channel learns a prompt exists [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:133-143]
- The per-identity state folders, which the channel files join [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117-131]
- Phase 001's `by:` actor, which a link record names [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:40]
- Phase 006's `grants` field and ladder, which say what an approval approves [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:40]
- Phase 008's vault, which holds every channel token by name [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:40]
- Phase 010's conversation JSONL and `bots chat`, which the terminal transport reuses [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:94]

**Deliverables**:
- `channel.ts`, the adapter contract, the message model and the explicit `unsupported` refusal
- `channel-link.ts`, the pairing code, the link record, the 5-failure 300 s lockout and the `operators.json` roster
- `channel-approval.ts`, the file-backed `approval-v1:<item-id>:<index>` index and the numbered or YES/NO reply grammar
- `channel-queue.ts`, the durable send queue with enqueue-before-I/O, unknown-after-send and the 0/5/25/120/600 s backoff
- `channel-telegram.ts`, `channel-slack.ts`, `channel-signal.ts`, `channel-whatsapp.ts` and `channel-terminal.ts`
- `bots channel list|link|unlink|send|listen|drain`
- The four channel names on `delivery.ts`, so a parked question's prompt reaches the chat that asked
- The Apache-2.0 notices for rakazo's polling and link codes and turnstone's socket mode, approval buttons and adapter protocol
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A bot's only way to reach a person is a macOS desktop notice, and its only way to ask a question is `bots inbox` on the host, so a small team that works in a chat client walks to the machine to answer. `delivery.ts` names one channel, `desktop`, and marks every other target `channel-unsupported`, so a chat cannot be a delivery target at all [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:45] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:139-142]. Nothing links a chat identity to a person, so a message from a chat cannot be attributed to an actor, and nothing records which prompt a button belongs to: the reference implementation keeps that index in memory and loses it on restart [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:61].

### Purpose
Put a bot in the chat the team already uses, so a message starts a run and a question is answered where it was asked, with the answer attributed to a person who is allowed to give it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ node .skilled/bin/bots.cjs channel list
bots: unknown verb: channel
exit=2
$ rg -c 'ChannelAdapter' .skilled/skills/system-skilled-bots/runtime/lib/
exit=1
$ rg -c 'approval-v1' .skilled/skills/system-skilled-bots/runtime/lib/
exit=1
$ rg -c 'signal-cli' .skilled/skills/system-skilled-bots/runtime/lib/
exit=1
$ rg -c 'operators' .skilled/skills/system-skilled-bots/runtime/lib/
exit=1
$ rg -n 'channels' .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts
exit=1
$ rg -n 'DELIVERY_CHANNELS' .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts
45:export const DELIVERY_CHANNELS = ['desktop'] as const;
```

The first line is the measured gap: the CLI has no `channel` verb, because its verb table lists eleven verbs and none of them is one [SOURCE: .skilled/bin/bots.cjs:64]. The five `exit=1` lines are the second: no runtime module names an adapter, an approval action id, a signal-cli daemon or an operator roster, and the state layout has no folder for a channel, so the files this phase writes have no home today [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117-131]. The last line is the third: delivery knows one channel, so a chat target is refused before a send is attempted [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:45].
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `channel.ts`, one adapter contract with a declared-capability table, an inbound sink and an explicit `unsupported` refusal for an operation a transport does not declare
- Add `channel-link.ts`, a one-time pairing code, a file-backed link record, a 5-failure 300 s lockout and an `operators.json` roster, so an unlinked chat is denied by default
- Add `channel-approval.ts`, a file-backed `approval-v1:<item-id>:<index>` index and the numbered or YES/NO reply grammar, so a restart loses no prompt
- Add `channel-queue.ts`, a durable send queue that writes an entry before the I/O, records an uncertain send `unknown` and never retries it, and backs off 0, 5, 25, 120 and 600 s
- Add the transports in the order Telegram, Slack, Signal, WhatsApp, with the terminal as the fallback that reuses phase 010. Each owns its chunk limit and its approval surface; only WhatsApp needs a public URL, and its public HTTPS URL or tunnel and Meta business account are an operator prerequisite
- Add `bots channel list|link|unlink|send|listen|drain`, and the four channel names on `delivery.ts`

### Out of Scope
- Discord and the other tinychannels providers (Lark, Mattermost, IRC, QQ, DingTalk, Yuanbao, iMessage) - each is another wire protocol, and the five here cover the team's clients [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/long_tail.rs:1-7]
- A hosted relay or a web UI - the research eliminates a server for the runtime, and a relay would hold every team's tokens [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:164]
- The WhatsApp Web linked-device client - it needs a paired phone session and breaks Meta's terms, so the Cloud API is the supported path
- The cdylib module host - a channel is a module in this runtime, not a plugin loaded from a shared object
- Telegram `/start` onboarding that makes the first sender the operator - it trusts an unauthenticated sender with ownership [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_recv.rs:527-545]
- Streaming a run's output into a chat as it arrives - one message is one run, and the reply is sent when the run ends
- Attachments, voice and images - every transport here carries text, and a file needs a media store
- A per-channel approval policy beyond the roster - phase 006 owns the ladder, and this phase only checks who may answer
- A second state root or a database - every file is under the identity's existing state root

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/channel.ts` | Create | The adapter contract, the message model, the declared-capability table and the explicit unsupported refusal |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-link.ts` | Create | The pairing code, the link record, the 5-failure 300 s lockout and the `operators.json` roster |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-approval.ts` | Create | The file-backed `approval-v1:<item-id>:<index>` index and the numbered or YES/NO reply grammar |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-queue.ts` | Create | The durable send queue: enqueue before I/O, unknown after an uncertain send, the 0/5/25/120/600 s backoff |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-telegram.ts` | Create | Long polling `getUpdates`, the 4096 chunk, the inline keyboard and the allowlist check before a press |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-slack.ts` | Create | Socket Mode over the app token, the 3900 chunk, Block Kit buttons and the approver check |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-signal.ts` | Create | The signal-cli daemon's JSON-RPC send and SSE events, and the 2000 chunk |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-whatsapp.ts` | Create | The Cloud API webhook, the `X-Hub-Signature-256` check and the 4096 chunk |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-terminal.ts` | Create | The terminal transport: stdin lines, numbered or YES/NO answers, the phase 010 chat path |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modify | `channelFolder` and `ensureChannelState`, naming `channels/` and its `queue/` and `seen/` folders |
| `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | Modify | The four channel names on `DELIVERY_CHANNELS`, their senders, and the item id a parked prompt carries |
| `.skilled/bin/bots.cjs` | Modify | The `channel` verb group: `list`, `link`, `unlink`, `send`, `listen`, `drain` |
| `.opencode/bin/bots.cjs` | Modify | Byte-identical mirror of the edited CLI |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel.vitest.ts` | Create | The contract, the message model and the unsupported refusal |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-link.vitest.ts` | Create | The pairing code, the default deny, the lockout and the roster |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-approval.vitest.ts` | Create | The index across a restart, the button id and the reply grammar |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-queue.vitest.ts` | Create | Enqueue before I/O, unknown after an uncertain send, the backoff table |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-conformance.vitest.ts` | Create | The five conformance rules on a fake transport |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-transports.vitest.ts` | Create | Each transport's chunk limit, its approval surface and its wire shape against a stub |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-channel.vitest.ts` | Create | The verb group's argv, the refusals and the exit codes |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-support.ts` | Create | The fake transport and the temporary state root the channel tests share |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modify | The nine new modules in the topology and the module table |
| `.skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md` | Create | The channel contract, the four transports, the reply grammar and the operator prerequisites |
| `.skilled/skills/system-skilled-bots/bots-run/SKILL.md` | Modify | Name the `channel` verb group in the mode's scope |
| `.skilled/skills/system-skilled-bots/SKILL.md` | Modify | One line naming `bots channel` as a run-mode verb |
| `.opencode/skills/system-skilled-bots/SKILL.md` | Modify | Byte-identical mirror of that line |
| `.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/messaging-channels.md` | Create | The feature entry: what a channel does, its files and its tests |
| `.skilled/skills/system-skilled-bots/feature-catalog/feature-catalog.md` | Modify | The operator-loop row for the new entry |
| `THIRD_PARTY_NOTICES.md` | Modify | The Apache-2.0 notices for rakazo's polling and link codes and turnstone's socket mode, buttons and protocol |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `channel.ts` defines one adapter contract: `descriptor`, `declaredCapabilities`, `start(sink)`, `stop`, `send` and `status`, plus an inbound sink with one `push`. An operation a transport does not declare returns an explicit `unsupported` result with `unsupported: true`, `retryable: false` and `sentBeforeError: false`, never a silent success and never a throw |
| REQ-002 | The message model is one shape per direction. An inbound message carries `channel`, `messageId`, `replyToId`, `timestampUnixMs`, `conversation`, `sender`, `text` and `raw`; an outbound intent carries `idempotencyKey`, `conversationId` and `text`; a receipt carries `platformMessageIds` and `primaryPlatformMessageId`; a send error carries `kind`, `message`, `unsupported`, `retryable` and `sentBeforeError` |
| REQ-003 | `bots channel link <channel>` prints a one-time code, and a chat that sends that code is linked to the actor who ran the command. The link is a file under the identity's state root. An unlinked chat is denied by default: its message reaches no bot, and the refusal is `channel-unlinked` |
| REQ-004 | Five failed code attempts from one chat id lock that chat for 300 s. The lockout is file-backed, so a restart does not clear it, and a locked chat is refused `channel-locked` with the seconds remaining |
| REQ-005 | Only an actor named `owner` or listed in `members` in `operators.json` may answer a needs-you item from a channel. Any other sender is refused `channel-not-approver`, the item is unchanged, and no resume request is queued |
| REQ-006 | A prompt sent to a channel writes its `approval-v1:<item-id>:<index>` action id, item id, channel, conversation and choices to a file before the send. A press or a reply resolves through that file, so a restart loses no prompt and no press is answered from memory |
| REQ-007 | Telegram sends an inline keyboard and Slack sends Block Kit buttons, each carrying `approval-v1:<item-id>:<index>`. The choices are the item's `options`, which the runner fills from the `[OPTION]` lines, and an item with no options gets a YES/NO pair. A press is checked against the allowlist before it is emitted as an inbound event, so a press from an unlinked chat reaches no handler |
| REQ-008 | Signal, WhatsApp and the terminal accept `1` to `n`, `YES` or `Y` and `NO` or `N` as an answer to an open prompt, case-insensitive and trimmed. A line that is none of those is a chat message, not an answer |
| REQ-009 | Telegram long-polls `getUpdates` with `offset`, `timeout: 30` and `allowed_updates` of `message` and `callback_query`. It registers no webhook, so it needs no public URL, and it chunks text at 4096 characters |
| REQ-010 | Slack uses Socket Mode: `apps.connections.open` with the app-level token returns the socket URL, so it needs no public URL. It chunks text at 3900 characters, and a `block_actions` press from a sender who is not an approver is dropped |
| REQ-011 | Signal talks to a local `signal-cli daemon --http` on localhost: it sends through JSON-RPC at `/api/v1/rpc` and reads events from the SSE stream at `/api/v1/events`. It chunks text at 2000 characters |
| REQ-012 | WhatsApp receives the Cloud API webhook and checks `X-Hub-Signature-256` as an HMAC-SHA256 of the raw body in constant time before any parse. A missing, malformed or wrong signature is refused `channel-signature` and the body is not read. It chunks text at 4096 characters |
| REQ-013 | Every outbound message is written to the durable send queue before the I/O. A send whose result is uncertain is recorded `unknown` and never retried. A retryable failure backs off 0, 5, 25, 120 and 600 s, and a permanent failure is not retried |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-014 | A channel names its token as a phase 008 secret. The value is read from the store at send time and never written to the channel config, a queue entry, a log or a run record |
| REQ-015 | `bots channel listen terminal` reads stdin lines, answers an open prompt by number or YES/NO, and sends anything else through the phase 010 chat path |
| REQ-016 | `delivery.ts` gains the four channel names, so a run that parks a question sends its approval prompt to the channel that asked, and a failed run's notice reaches the same place |
| REQ-017 | Five conformance rules run as fixture tests on a fake transport: an undeclared operation returns `unsupported` and reaches no platform; a declared one returns no provider error and produces one matching wire observation with a receipt |
| REQ-018 | The lifted Apache-2.0 code carries one `THIRD_PARTY_NOTICES.md` entry per file, naming its source path, its copyright line and a statement of changes. No tinychannels code is copied, so no notice is added for it |
| REQ-019 | `bots channel list` prints each configured channel, whether it is enabled, its linked chats and its queue depth, and `--json` prints the same as an object |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On a temporary state root with a fake transport, `bots channel link telegram` prints one code, a message carrying that code links the chat, and a second message from the same chat reaches a bot and writes one run record
- **SC-002**: A message from a chat that was never linked exits 4 with `channel-unlinked`, and five wrong codes from one chat make the sixth attempt exit 4 with `channel-locked` and a positive seconds count
- **SC-003**: A parked run's prompt is written to the approval index, the process is restarted, and a press carrying `approval-v1:<item-id>:1` still answers the item and queues one resume request
- **SC-004**: A press from a chat linked to an actor who is neither `owner` nor a member exits 4 with `channel-not-approver`, and the item file's bytes are unchanged
- **SC-005**: A send whose transport reports `uncertain` leaves one queue entry in state `unknown`, and a second drain pass sends nothing
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A public HTTPS URL and a Meta business account for WhatsApp | The WhatsApp transport cannot receive a webhook | It is the last transport and an operator prerequisite named in the reference; the other four need no public URL, so the phase is provable without it |
| Dependency | A local `signal-cli` daemon with a registered number | The Signal transport has no account to send from | The transport refuses `channel-daemon-unreachable` before a send, and the queue keeps the entry for a later drain |
| Dependency | Phase 008's vault | A token has no store, so a channel cannot authenticate | The token is named in the config and resolved at send time; a missing secret refuses `secret-unknown` before the I/O |
| Risk | A chat identity is linked to the wrong person | That person can approve a bot's actions | The code is one-time, expires, and is printed only on the host; the roster check is a second gate, so a wrong link still cannot approve unless the actor is an owner or member |
| Risk | A button press is replayed after the item is answered | A second resume request, or a changed answer | The answer path already refuses `item-answered-differently`, and the request id is the item id, so a replay is a queue duplicate |
| Risk | A token reaches a log or a queue entry | A leaked credential on a shared host | The token is read at send time and never stored; the queue entry holds the channel and conversation only, and the existing secret-literal check guards the message body |
| Risk | A transport's chunk limit is exceeded | The platform truncates or rejects a long reply | Each transport owns one named constant, and a test asserts the split at the limit and one character over it |
| Risk | Two `listen` processes poll one Telegram bot | Telegram refuses the second `getUpdates` and messages are lost | The listen verb takes a lease file per channel, so a second process refuses `channel-listening` |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One inbound message costs one state read and one queue write, and `bots channel list` over five channels prints in under 200 ms, measured with `time`
- **NFR-P02**: A long-poll cycle holds one HTTP request open for 30 s and issues no second request while it waits, so an idle Telegram channel makes one request per 30 s

### Security
- **NFR-S01**: Every channel file is created 0600 inside a 0700 folder, the mode every other state file uses
- **NFR-S02**: A token is read from the vault at send time and never written to the channel config, a queue entry, a log or a run record; a message body holding a known secret literal is withheld rather than sent
- **NFR-S03**: A WhatsApp webhook body is authenticated before it is parsed, and a missing, malformed and wrong signature are indistinguishable to the caller

### Reliability
- **NFR-R01**: A restart loses no approval prompt and no queued send, because both are files written before the I/O
- **NFR-R02**: A send whose result is uncertain is recorded `unknown` and never retried, so a duplicate notice is impossible and a lost one is visible
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty chat message is dropped and reaches no bot; `bots channel send` with an empty text exits 2 with usage
- Maximum input: a 10,000-character reply is split at the transport's limit into whole messages, and a message exactly at the limit is sent as one
- Failure path: an unlinked chat exits 4 with `channel-unlinked`; a locked chat exits 4 with `channel-locked`; a non-approver's press exits 4 with `channel-not-approver`; a bad webhook signature exits 4 with `channel-signature`; a transport that is down leaves the queue entry `queued` and exits 1
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Nine new modules, one CLI verb group, one delivery change, five transports, seven test files |
| Risk | 12/25 | Five network surfaces, a credential path, an approval gate and a webhook signature |
| Research | 8/20 | Three context trees name the contract, the wire facts and the approval id; no new research needed |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does this phase land `operators.json`, which the parent's §3 Out of Scope says no child builds? Decision: yes, the minimal roster. A channel message arrives from a chat identity, and the only way to say whether that person may approve is to resolve the identity to an actor and check that actor against a roster. The research already specifies the file and the check [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:103]. The parent's line stays true for the ten research slices; this phase is the one that needs the roster, and the parent's phase-map row records it
- Does a channel config live in `bots/config.json` or under the state root? Decision: under the state root, because a channel belongs to an identity and a shared host has one identity across several repositories, so a per-repository file would duplicate the token name and the linked chats
- Is the approval prompt a delivery notice or a separate send? Decision: the delivery notice, because `delivery.ts` already carries a parked item's id on its entry, so the channel learns of the prompt without a second hook [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:133-143]
- Should a chat message start a run through `bots chat` or through `bots enqueue`? Decision: `bots enqueue` with the message id as the event id, so a redelivered provider event is a queue duplicate and starts no second run
<!-- /ANCHOR:questions -->

---

