---
title: "Design: channel capability keys and matrix"
description: "The closed set of capability keys a channel transport declares, the operations each key admits, one matrix column per transport and the descriptor facts beside it. The conformance fixture reads the matrix as its input."
trigger_phrases:
  - "channel capability matrix"
  - "declared capabilities vocabulary"
  - "channel conformance input"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Channel capability keys and matrix

`declaredCapabilities` had no vocabulary and no per-transport matrix. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:202] This file is both. `channel.ts` holds the keys as one exported constant, each transport returns one row of section 2 from `declaredCapabilities` and `tests/channel-conformance.vitest.ts` iterates section 2 as data. A transport that disagrees with this file is wrong until this file changes.

The reference declares capabilities as one structured record with a version, flags for chat approvals and edits and nested content, action and delivery groups. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/capabilities.rs:162-185] Its conservative default declares text send and nothing else. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:55-63] This phase keeps the idea and flattens it to a closed list of booleans, because five transports and five operations do not need nested groups. The reference is GPL-3.0, so no line of it is copied.

---

## 1. THE KEYS

Every key is a boolean. A key a transport does not set reads as `false`, the reference's conservative default.

| # | Key | Operation it admits | What `false` means |
|---|-----|---------------------|--------------------|
| 1 | `sendText` | `send` with a text intent | The transport cannot send. No transport in this phase sets it `false` |
| 2 | `receiveText` | `start(sink)` pushes inbound text | The transport is send only |
| 3 | `buttons` | `send` with choice buttons that carry `approval-v1:<itemId>:<index>` | The prompt is sent as text with numbered choice lines |
| 4 | `numberedReply` | An inbound line `1` to `n`, `YES`, `Y`, `NO` or `N` is read as an answer to the open prompt | A typed number is a chat message, never an answer |
| 5 | `groupKnown` | The inbound message says whether it came from a group | Every inbound conversation is treated as direct |
| 6 | `edit` | `send` with an edit intent on an earlier message | Refused `unsupported` |
| 7 | `react` | `send` with a reaction intent | Refused `unsupported` |
| 8 | `file` | `send` with an attachment intent | Refused `unsupported` |

Keys 6 to 8 are declared `false` on every transport in this phase. They exist so the conformance suite has an undeclared operation to call on every transport, which is how rules 1 and 2 of `conformance-rules.md` reach all five.

The descriptor carries four facts that are not capabilities, because no operation depends on them:

| Fact | Type | Meaning |
|------|------|---------|
| `name` | string | The channel name: `terminal`, `telegram`, `slack`, `signal` or `whatsapp` |
| `chunkLimit` | integer | The largest outbound text one message carries |
| `chunkUnit` | `utf8-bytes` or `code-points` | What `chunkLimit` counts |
| `ackPolicy` | `after-seen-record` or `none` | When the provider is told an inbound message was taken, as `inbound-sequence.md` fixes |

---

## 2. THE MATRIX

One column per transport. This table is the conformance fixture's input and the one place a transport's row is written.

| Key | `terminal` | `telegram` | `slack` | `signal` | `whatsapp` |
|-----|------------|------------|---------|----------|------------|
| `sendText` | yes | yes | yes | yes | yes |
| `receiveText` | yes | yes | yes | yes | yes |
| `buttons` | no | yes | yes | no | no |
| `numberedReply` | yes | no | no | yes | yes |
| `groupKnown` | no | yes | yes | yes | no |
| `edit` | no | no | no | no | no |
| `react` | no | no | no | no | no |
| `file` | no | no | no | no | no |
| `chunkLimit` | 4096 | 4096 | 3900 | 2000 | 4096 |
| `chunkUnit` | `code-points` | `utf8-bytes` | `code-points` | `code-points` | `code-points` |
| `ackPolicy` | `none` | `after-seen-record` | `after-seen-record` | `none` | `after-seen-record` |

Where each value comes from:

| Value | Source |
|-------|--------|
| Telegram 4096, counted with the string's byte length | `TELEGRAM_MAX_MESSAGE_LENGTH` and its byte-length truncation [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/text.rs:7] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1665-1672] |
| Slack 3900, counted in characters | `SLACK_TEXT_CHUNK_CHARS` and its `chars().count()` check [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/types.rs:19] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/interact.rs:37] |
| Signal 2000, counted in characters | `SIGNAL_TEXT_CHUNK_CHARS`, below the length Signal turns into an attachment [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/signal/outbound.rs:32-33] |
| WhatsApp 4096, counted in characters | `TEXT_LIMIT` and `split_text`, which counts `chars()` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/outbound.rs:18] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp_shared/text.rs:8-16] |
| Terminal 4096 | No provider limit exists. The value is this phase's choice, so one long reply is split the way WhatsApp's is and a test of the split needs no special case |
| Telegram and Slack buttons | The inline keyboard and Block Kit buttons carry the versioned action id [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/blocks.rs:70] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/event.rs:8-20] |
| `numberedReply` only where `buttons` is `no` | `../../004-approval-index-and-send-queue/spec.md` REQ-008 keeps the reply grammar of the pre-expansion phase, which names Signal, WhatsApp and the terminal |
| WhatsApp `groupKnown` no | The Cloud API ingress binds a delivery to one configured number and routes direct messages [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/ingress.rs:1-11]. This phase reads no group field, so it declares none |
| `ackPolicy` per transport | `inbound-sequence.md` sections 2 to 6 |

**The unit, decided.** JavaScript's `length` counts UTF-16 code units, which is neither unit above. `channel.ts` measures `code-points` as `[...text].length` and `utf8-bytes` as `Buffer.byteLength(text, 'utf8')`, and splits on a code point boundary in both cases, so no chunk ends inside a character. Telegram keeps the byte unit because the reference counts bytes there and a byte count can never exceed the provider's character limit.

---

## 3. HOW A TRANSPORT USES ITS ROW

- `declaredCapabilities()` returns its column of section 2 as a frozen object.
- `send(intent)` first maps the intent to a key: text to `sendText`, buttons to `buttons`, edit to `edit`, reaction to `react`, attachment to `file`. A `false` key returns the explicit unsupported result of `../../003-link-roster-and-answer-gate/spec.md` REQ-001 before any I/O, which is the rule the reference checks once per provider. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:390-420]
- A prompt on a transport whose `buttons` is `no` is sent as text with the numbered choice lines of `../../001-channel-ux-and-message-map/design/message-catalog.md` row M01. It never calls `send` with a buttons intent, so the unsupported result is a programming error there and a test catches it.
- A message from a transport whose `groupKnown` is `yes` and whose provider marks it a group is refused `channel-group-approval` when it answers a prompt, as `contracts/refusals.md` section 3.10 lists.

---

## 4. CHECKS

Run from the repository root with no tty.

```bash
D=specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design
awk '/^## 2\. THE MATRIX/,/^Where each value/' $D/capabilities.md | rg -c '^\| `[a-zA-Z]+` \|'
```

It prints 11, one row per key and descriptor fact.
