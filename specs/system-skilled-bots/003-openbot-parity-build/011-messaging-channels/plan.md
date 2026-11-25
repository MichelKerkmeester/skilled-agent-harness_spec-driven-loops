---
title: "Implementation Plan: Phase 11: messaging-channels"
description: "One `channel.ts` contract, three file-backed state modules for the link, the approval index and the send queue, five transports in the order Telegram, Slack, Signal, WhatsApp and terminal, and the four channel names on `delivery.ts` so a parked question's prompt reaches the chat that asked."
trigger_phrases:
  - "messaging channels plan"
  - "bots channel plan"
  - "channel adapter plan"
  - "telegram slack signal whatsapp plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: messaging-channels

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node 22+ for the runtime, CommonJS for the CLI |
| **Framework** | None; `node:http` for the WhatsApp webhook, `node:crypto` for the signature, `node:readline` for the terminal |
| **Storage** | Files under the identity's state root: `channels/config.json`, `links.json`, `approvals.json`, `queue/` and `seen/` |
| **Testing** | vitest, with a fake transport in `tests/channel-support.ts` and no network call in any test |

### Overview
`channel.ts` owns the contract every transport implements: a descriptor, a declared-capability table, `start(sink)`, `stop`, `send` and `status`, plus the inbound and outbound message shapes and the explicit `unsupported` result an undeclared operation returns. Three file-backed modules hold the state a restart must not lose: `channel-link.ts` the chat-to-actor link and its lockout, `channel-approval.ts` the `approval-v1:<item-id>:<index>` index, and `channel-queue.ts` the durable send queue. Five transports sit on top, in the order Telegram, Slack, Signal, WhatsApp and terminal, each with its own chunk limit and its own approval surface. `delivery.ts` gains the four channel names, so a run that parks a question sends its prompt through the same path a desktop notice already takes, and the channel sender writes the approval index entry before the send.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs channel list` prints `bots: unknown verb: channel` and exits 2, the measured gap this phase closes
- [ ] `rg -c 'ChannelAdapter' .skilled/skills/system-skilled-bots/runtime/lib/` exits 1, so no module owns a channel contract today
- [ ] `rg -n 'DELIVERY_CHANNELS' .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` prints `45:export const DELIVERY_CHANNELS = ['desktop'] as const;`
- [ ] Phase 008 is closed, so a token has a store to be read from
- [ ] Phase 010 is closed, so the terminal transport has a conversation file and a `chat` verb to reuse
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx tsc --noEmit` exits 0
- [ ] `diff -q .skilled/bin/bots.cjs .opencode/bin/bots.cjs` prints nothing
- [ ] `rg -n 'tinychannels' THIRD_PARTY_NOTICES.md` exits 1, because no GPL-3.0 code is copied
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Adapter per transport, one file-backed state machine.

### Key Components
- **`channel.ts`**: the contract, the message model and the capability table. It imports `state-root.ts` and nothing else, so the wire shapes have one owner. An operation a transport does not declare returns `unsupported` with `retryable: false` and `sentBeforeError: false`, which is the rule the reference states once per provider and the conformance suite checks [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:58-64] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/long_tail.rs:1-7].
- **`channel-link.ts`**: the pairing code, the link record, the lockout and the roster. A code is one-time and expires; five failures from one chat id lock it for 300 s, and the lockout is a file so a restart does not clear it [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/security/mod.rs:15-18]. An unlinked chat is denied by default, which is the allowlist rule the reference applies to every provider [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/config.rs:133-172].
- **`channel-approval.ts`**: the file-backed index and the reply grammar. The action id is `approval-v1:<item-id>:<index>`, which is the reference's versioned id and fits Telegram's 64-byte callback limit [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/event.rs:14-28]. The choices are the item's `options`, which the runner fills from the `[OPTION]` lines the decision marker defines [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:45] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1105]. The reference keeps the reply index in memory and loses it on restart [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:61]; ours is a file written before the send.
- **`channel-queue.ts`**: the durable send queue. An entry is written before the I/O, an uncertain send is recorded `unknown` and never retried, and a retryable failure backs off 0, 5, 25, 120 and 600 s [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/queue.rs:1-12] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs:11].
- **The five transports**: `channel-telegram.ts`, `channel-slack.ts`, `channel-signal.ts`, `channel-whatsapp.ts` and `channel-terminal.ts`. Each owns one wire protocol, one chunk limit and one approval surface.
- **`delivery.ts`**: the hook. It already carries a parked item's id on the entry it builds [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:133-143], so the four channel names are the whole change: the sender receives the item id and writes the approval index entry before it sends.
- **The `channel` verb group in `bots.cjs`**: `list`, `link`, `unlink`, `send`, `listen` and `drain`. It holds argv and printing, and no rule a module could hold.

The contract follows the reference's adapter shape: a descriptor, a declared-capability table, a start that takes an inbound sink, a stop, a send that returns a receipt, and a status [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:15-188]. The message model follows its four types: the inbound envelope, the outbound intent, the receipt and the error with its `retryable` flag [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/envelope.rs:259] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/intent.rs:388] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/receipt.rs:75] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/error.rs:24]. The reference is GPL-3.0, so it is design only and no line is copied.

### Data Flow
An inbound message reaches a transport's `start` loop, which checks the allowlist before it emits anything. The sink resolves the chat id through `links.json`; an unlinked chat is refused `channel-unlinked` and stops there. A linked chat's message becomes one `bots enqueue` request whose event id is the provider's message id, so a redelivered event is a queue duplicate. The drain runs the bot; a run that parks a question writes a needs-you item, and `delivery.ts` builds one entry per target carrying the item id. The channel sender writes the approval index entry, then enqueues the prompt in `channel-queue.ts`, then sends it: an inline keyboard on Telegram, Block Kit buttons on Slack, a numbered list on Signal, WhatsApp and the terminal. A press or a reply parses the action id or the number, resolves the item through `approvals.json`, checks the sender's actor against `operators.json`, and calls `answerItem`, which records the answer and queues the resume. A send whose result is uncertain leaves its queue entry `unknown` and is never retried.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | Owns `DELIVERY_CHANNELS`, the senders and the claim-before-send rule | update - add the four channel names, their senders and the item id the prompt carries | `rg -n "DELIVERY_CHANNELS" .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` prints five names |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Names every per-identity folder and creates it | update - add `channelFolder` and `ensureChannelState` | `rg -n "channelFolder\|ensureChannelState" .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` prints both |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Owns the item shape and its derived state | unchanged - the approval index holds the channel mapping, so the item gains no field | `rg -n "channel" .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` exits 1 |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Owns the answer write and the resume enqueue | unchanged - a channel answer calls `answerItem` | `rg -n "answerItem" .skilled/skills/system-skilled-bots/runtime/lib/channel-approval.ts` prints the call |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts` | Owns the enqueue and the duplicate marker | unchanged - a chat message enqueues through it | `rg -n "enqueueRequest" .skilled/skills/system-skilled-bots/runtime/lib/channel-terminal.ts` prints the call |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Owns the delivery entry shape | unchanged - the entry already carries `itemId` | `rg -n "itemId" .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` prints the field |
| `.skilled/bin/bots.cjs` | Owns the verb table, the usage text and the exit codes | update - add the `channel` verb group | `node .skilled/bin/bots.cjs channel list` exits 0 and names each channel |
| `.opencode/bin/bots.cjs` | Byte-identical mirror of the CLI | update - copy the edited file | `diff -q .skilled/bin/bots.cjs .opencode/bin/bots.cjs` prints nothing |
| `bots status --json` | Reads run records and items | not a consumer - this phase adds no field it reads | `node .skilled/bin/bots.cjs status --json` still exits 0 |
| `bots chat` | The phase 010 conversation verb | unchanged - the terminal transport calls it | `node .skilled/bin/bots.cjs chat my-bot --transcript` still exits 0 |
| `bots answer` | The one write path an answer takes | unchanged - the channel calls `answerItem` directly | `node .skilled/bin/bots.cjs answer <id> deny` still exits 0 |

Required inventories:
- Same-class producers: `rg -n 'DELIVERY_CHANNELS|CHANNEL_ACKNOWLEDGES|DEFAULT_SENDERS' .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` lists every place a channel name is declared, so a fifth name cannot be added without naming its acknowledgement rule and its sender.
- Consumers of changed symbols: `rg -n 'DeliveryChannel|DeliverySenders|IdentityStatePaths' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names every reader of the three changed types.
- Matrix axes: five transports by two approval surfaces (button, text) by three sender states (linked approver, linked non-approver, unlinked) by four send outcomes (acknowledged, attempted, failed, uncertain), plus the locked chat, the bad signature and the daemon-down cases.
- Algorithm invariant: the approval index entry is written before the send and never rewritten, so a press always resolves to the item it was sent for; a queue entry's state only moves forward, so no entry is sent twice.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the adapter contract, the four transports' wire facts, the approval action id, the pairing lockout, the delivery queue and the existing `delivery.ts`, `needs-you.ts`, `answer.ts` and `state-root.ts`, then captures the baseline suite result. Implementation writes `channel.ts`, `channel-link.ts`, `channel-approval.ts` and `channel-queue.ts`, then Telegram and Slack, then Signal, then the terminal fallback, then WhatsApp last because it is the one transport that needs a public URL, then the `channel` verb group and the four names on `delivery.ts`, then the docs and the notices. Verification runs the runtime suite, `tsc`, the conformance fixtures, one live link-and-answer cycle on a temporary state root with a fake transport, and the packet validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `channel.ts`: the contract, the message model and the unsupported refusal | `npx vitest run tests/channel.vitest.ts` |
| Unit | `channel-link.ts`: the code, the default deny, the lockout and the roster | `npx vitest run tests/channel-link.vitest.ts` |
| Unit | `channel-approval.ts`: the index across a restart, the action id and the reply grammar | `npx vitest run tests/channel-approval.vitest.ts` |
| Unit | `channel-queue.ts`: enqueue before I/O, unknown after an uncertain send, the backoff table | `npx vitest run tests/channel-queue.vitest.ts` |
| Unit | The five transports: each chunk limit, each approval surface, each wire shape against a stub | `npx vitest run tests/channel-transports.vitest.ts` |
| Integration | The five conformance rules on a fake transport | `npx vitest run tests/channel-conformance.vitest.ts` |
| Integration | The `channel` verb group's argv, refusals and exit codes | `npx vitest run tests/cli-channel.vitest.ts` |
| Manual | One link-and-answer cycle on a temporary state root with a fake transport | `node .skilled/bin/bots.cjs channel link telegram` then a message carrying the code |

No test opens a socket. Every transport is exercised through the fake transport in `tests/channel-support.ts`, which records each wire call and returns a scripted result, so the conformance rules run without a token or a network.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 008's vault | Internal | Yellow | A token has no store; the transport refuses `secret-unknown` before the I/O and the queue keeps the entry |
| Phase 010's `chat` verb and conversation file | Internal | Yellow | The terminal transport has no chat path; the other four transports are unaffected |
| `node:http` and `node:crypto` | External | Green | Built into Node 22; no package is added |
| A local `signal-cli` daemon | External | Yellow | The Signal transport refuses `channel-daemon-unreachable`; the other four are unaffected |
| A public HTTPS URL and a Meta business account | External | Red | The WhatsApp transport cannot receive a webhook; it is the last transport and an operator prerequisite |
| A Telegram bot token and a Slack app token | External | Yellow | The two transports cannot authenticate; the fake transport proves the code without them |

No package is added. The four transports use `fetch`, which Node 22 provides, and the webhook uses `node:http`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a channel answers an item for a sender who is not an owner or member, or a send is made twice for one queue entry, or a token appears in a file under the state root.
- **Procedure**: revert the one commit. The channel files live under `<stateRoot>/<identity>/channels/`, which no other module reads, so a revert leaves them inert; delete that folder to remove every link, prompt and queued send. `DELIVERY_CHANNELS` returns to `['desktop']`, so a channel target is refused `channel-unsupported` again and no send is attempted.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing; it reads the runtime and the context trees and captures the baseline | Implementation, which needs the recorded wire facts and the baseline count |
| Implementation | Setup's recorded facts, phase 008's vault and phase 010's chat verb | Verification, which runs the suite the implementation writes |
| Verification | Implementation's modules, tests and CLI verb group | Closure: no acceptance criterion is Met before it runs |
<!-- /ANCHOR:phase-deps -->

---

