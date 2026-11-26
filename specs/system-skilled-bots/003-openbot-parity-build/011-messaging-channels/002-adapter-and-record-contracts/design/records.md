---
title: "Design: channel records, samples and lifecycles"
description: "Field tables and samples for every channel record with its schemaVersion: the channel config, the link record and its lockout, the approval index with its key structure, the queue entry with its state enum and the backoff table as data, the seen record, the listen lease and the channel list payload. Adds the secret name derivation for transports that need more than one credential."
trigger_phrases:
  - "channel records design"
  - "queue entry state enum"
  - "approval index key structure"
  - "channel secret names"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Channel records, samples and lifecycles

`contracts/records.md` sections 11 to 16 own the shape of every channel record, and `contracts/cli-json.md` section 3.3 owns `bots channel list --json`. Each table below restates its contract section so a builder reads one file, and **the contract wins on any difference**. What this file adds is what the contract leaves to this phase: the lifecycle of each record, the backoff table as data, the listen lease, the secret names a transport derives and the order of writes.

Every file is 0600 inside a 0700 folder under `<identity>/channels/`, except `operators.json` at `<identity>/operators.json` (`contracts/runtime-architecture.md` section 2.1). Every write goes through `writeStateAtomic`, so a reader sees the old file or the new one and never half of one. Every record carries `schemaVersion: 1` (`contracts/versioning.md` rule 3).

---

## 1. `channels/config.json`

Restates `contracts/records.md` section 11. Writer and reader: `channel.ts` alone.

| Key | Type | Null | Absent reads as |
|-----|------|------|-----------------|
| `schemaVersion` | integer `1` | no | `1` |
| `channels` | object keyed by `telegram`, `slack`, `signal` or `whatsapp` | no | `{}` |
| `channels.<name>.secret` | string, a secret name in the `contracts/records.md` section 8 grammar | no | required |
| `channels.<name>.enabled` | boolean | no | required |

```json
{ "schemaVersion": 1, "channels": { "telegram": { "secret": "telegram", "enabled": true }, "slack": { "secret": "slack-app-token", "enabled": false } } }
```

Lifecycle: `bots channel link <channel> [--secret <name>]` writes the entry with `enabled: true` and `secret` defaulting to the channel name. `bots channel unlink <channel>` sets `enabled: false` and keeps the entry. Nothing deletes an entry.

### 1.1 Secret names a transport derives

The contract gives each channel one `secret`. Slack needs an app-level token and a bot token [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/types.rs:41-42], and WhatsApp needs an access token, a verify token and the Meta app secret [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/channel.rs:34-39]. Signal's account and WhatsApp's `phone_number_id` have no key either. Adding keys would change a frozen contract, so this phase derives every further name from the configured one by a fixed suffix. Each derived name stays inside the section 8 grammar, because a suffix adds only lowercase letters and hyphens.

| Channel | Name | Holds | Read by |
|---------|------|-------|---------|
| `telegram` | `<secret>` | The bot token | `getUpdates` and `sendMessage` |
| `slack` | `<secret>` | The app-level `xapp-` token | `apps.connections.open` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/socket.rs:23-27] |
| `slack` | `<secret>-bot` | The bot `xoxb-` token | `chat.postMessage` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/types.rs:152] |
| `signal` | `<secret>` | The registered account number in E.164 form | the JSON-RPC `account` parameter and the events query [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/signal/listener.rs:89-90] |
| `whatsapp` | `<secret>` | The Cloud API access token | every Graph call [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/api.rs:81] |
| `whatsapp` | `<secret>-app-secret` | The Meta app secret, the key of `X-Hub-Signature-256` | the webhook check |
| `whatsapp` | `<secret>-verify-token` | The verify token of the subscription handshake | the `GET` handshake |
| `whatsapp` | `<secret>-phone-number-id` | The sending number's id | the send URL and the inbound binding |

With the contract's sample, Slack reads `slack-app-token` and `slack-app-token-bot`. The phone number id and the account number are not credentials, and they sit in the vault because the config has no other place for them and the vault already keeps them off every log. A missing derived name refuses `secret-unknown` before any I/O, the same as a missing primary name.

**The length bound.** A derived name must also stay within the 64 characters of the `contracts/records.md` section 8 grammar. The longest suffix is `-phone-number-id`, 16 characters, so a `whatsapp` entry's `secret` is at most 48 characters. A longer one derives a name the vault cannot hold: `bots secret set` refuses it `secret-name-invalid`, and `bots channel listen whatsapp` then refuses `secret-unknown`. No check at `channel link` enforces the bound. `contracts/records.md` section 11, "Derived secret names", states the same rule.

Two addresses are fixed rather than configured, for the same reason: the Signal daemon at `http://127.0.0.1:8080` and the WhatsApp webhook listener at `127.0.0.1:8787`. `operator-runbook.md` tells the operator to start the daemon and the tunnel on those addresses. `contracts/records.md` section 11, "Fixed addresses", adopts both as fixed, so `channels/config.json` gains no key for them. A later key for either is an added key under `contracts/versioning.md` rule 1.

---

## 2. LINK RECORD AND LOCKOUT

Restates `contracts/records.md` section 12. File: `channels/links.json`. Writer: `channel-link.ts` alone.

| Key | Type | Null | Absent reads as |
|-----|------|------|-----------------|
| `schemaVersion` | integer `1` | no | `1` |
| `links` | object keyed `<channel>:<chatId>` | no | `{}` |
| `links.<key>.channel`, `.chatId`, `.senderId`, `.actor` | string | no | required |
| `links.<key>.linkedAt` | string, ISO 8601 UTC | no | required |
| `codes` | object keyed by channel name, each `{code, actor, expiresAt}` | no | `{}` |
| `lockouts` | object keyed `<channel>:<chatId>`, each `{failures, lockedUntil}` | no | `{}` |

**Key structure.** A link key is the channel name, a colon and the provider's chat id as a string. One chat has at most one link. A pending code is keyed by channel, so a second `bots channel link telegram` replaces the first unused code. `senderId` is the provider-asserted sender of the message that carried the code, and a later press resolves only when its sender id equals it.

Sample after one link and one locked stranger:

```json
{
  "schemaVersion": 1,
  "links": {
    "telegram:81234567": { "channel": "telegram", "chatId": "81234567", "senderId": "81234567", "actor": "ada", "linkedAt": "2026-11-25T20:05:00.000Z" }
  },
  "codes": {},
  "lockouts": {
    "telegram:99887766": { "failures": 5, "lockedUntil": "2026-11-25T21:18:00.000Z" }
  }
}
```

Sample with a code pending, one minute after `bots channel link telegram`:

```json
{ "schemaVersion": 1, "links": {}, "codes": { "telegram": { "code": "482913", "actor": "ada", "expiresAt": "2026-11-25T20:09:00.000Z" } }, "lockouts": {} }
```

| Event | Write |
|-------|-------|
| `bots channel link <channel>` | `codes.<channel>` set, `expiresAt` five minutes ahead |
| An unlinked chat sends the pending code before `expiresAt` | One write: `links.<key>` added, `codes.<channel>` removed, `lockouts.<key>` removed |
| An unlinked chat sends six digits that are not the pending code, or sends them after it expired | `lockouts.<key>.failures` plus one. At five, `lockedUntil` is set 300 s ahead and `failures` stays 5 [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/security/mod.rs:15-18] |
| An unlinked chat sends anything that is not six digits | No write. Refused `channel-unlinked`. Only a code attempt counts, because only a code attempt can guess a code |
| A locked chat sends anything before `lockedUntil` | No write. Refused `channel-locked` with the whole seconds left, rounded up |
| A locked chat sends after `lockedUntil` | The lockout is removed and the message is judged as new |
| `bots channel unlink <channel>` | Every `links` entry of that channel removed |

A code read past `expiresAt` is removed on that read, so an expired code never links.

---

## 3. APPROVAL INDEX

Restates `contracts/records.md` section 13. File: `channels/approvals.json`. Writer: `channel-approval.ts` alone.

| Key | Type | Null | Absent reads as |
|-----|------|------|-----------------|
| `schemaVersion` | integer `1` | no | `1` |
| `prompts` | object keyed by item id | no | `{}` |
| `prompts.<itemId>.channel`, `.conversation` | string | no | required |
| `prompts.<itemId>.choices` | string array, the item's `options` or `["YES", "NO"]` | no | required |
| `prompts.<itemId>.expiresAt` | string, the item's `expiresAt` | no | required |
| `prompts.<itemId>.sentAt` | string, ISO 8601 UTC | no | required |
| `notApprover` | object keyed by actor, each `{failures, lastAt}` | no | `{}` |

**Key structure.** One item has one prompt, so the key is the item id, which is also the run id. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:103] The action id is derived and never stored: `approval-v1:<itemId>:<index>` with `index` the 1-based position in `choices`. The reference uses a 0-based index [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/event.rs:14-20], and this phase does not, because a numbered reply sends the same 1-based number the button carries. The reference caps the id at Telegram's 64-byte callback limit. An item id is 25 bytes, so the longest id here is `approval-v1:20261125T210504Z-3f9d2b11:99`, 40 bytes.

One entry holds one channel and one conversation. A bot with two channel targets parks one item and gets two queue entries, and the index entry names the first target the delivery pass reaches. A press from the other target's chat does not match the entry's `conversation`, so it is refused `item-unknown` there. The parent spec names this as a limit, because the contract keys the index by item.

```json
{
  "schemaVersion": 1,
  "prompts": {
    "20261125T210504Z-3f9d2b11": { "channel": "telegram", "conversation": "81234567", "choices": ["email", "chat"], "expiresAt": "2026-11-26T21:05:04.000Z", "sentAt": "2026-11-25T21:05:05.000Z" }
  },
  "notApprover": { "mallory": { "failures": 2, "lastAt": "2026-11-25T21:06:10.000Z" } }
}
```

| Event | Write |
|-------|-------|
| The drain is about to send a queued entry that carries `itemId` | `prompts.<itemId>` written, before the entry goes `sending` |
| A press or reply resolves and `answerItem` returns `enqueued`, `duplicate` or `reviewed` | `prompts.<itemId>` removed |
| `answerItem` refuses `answer-not-approver` on the `channel` surface | `notApprover.<actor>` plus one and `lastAt` now |
| Any read finds `expiresAt` past | That entry removed in the same read |

The per-actor counter locks no chat. It lets `bots channel list` and the tests see repeated attempts by one actor without locking the other members of a linked chat out.

---

## 4. QUEUE ENTRY

Restates `contracts/records.md` section 14. File: `channels/queue/<idempotencyKey>.json`. Writer: `channel-queue.ts` alone.

| Key | Type | Null | Absent reads as |
|-----|------|------|-----------------|
| `schemaVersion` | integer `1` | no | `1` |
| `idempotencyKey` | string, also the file name | no | required |
| `channel`, `conversationId`, `text` | string | no | required |
| `itemId`, `runId` | string | yes | `null` |
| `state` | `queued`, `sending`, `delivered`, `failed`, `unknown` | no | required |
| `attempts` | integer | no | `0` |
| `nextAttemptAt` | string, ISO 8601 UTC | yes, a terminal state | `null` |
| `enqueuedAt`, `updatedAt` | string, ISO 8601 UTC | no | required |
| `error` | `{kind, message, unsupported, retryable, sentBeforeError}` | yes | `null` |

**Idempotency key.** `notice-<runId>-<channel>` for a run's delivery notice, the form the contract sample uses and `reply-<sha256 of channel, conversation and inbound message id, first 32 hex>` for a refusal or echo reply to one inbound message and `send-<sha256 of channel, conversation, text and the UTC minute the verb ran, first 32 hex>` for one `bots channel send`, so a repeat inside the same minute enqueues nothing. The file is created with the exclusive flag, so a second enqueue of the same key finds the file and enqueues nothing. One logical message is one entry even when the transport splits it into chunks, and `platformMessageIds` on the receipt lists each chunk.

**State machine.** A state only moves forward.

```text
queued --drain claims--> sending --receipt--> delivered
                            |---retryable error, attempts < 5--> queued (nextAttemptAt set)
                            |---permanent error, or attempts = 5--> failed
                            |---uncertain result--> unknown
sending found at startup --> unknown
```

`delivered`, `failed` and `unknown` are terminal. A `sending` entry at the start of a drain belongs to a process that stopped mid-send, so it becomes `unknown` and is never resent, which is the contract's reason for the state.

**The backoff table as data.** `channel-queue.ts` exports it as written here, and a test reads both.

```json
{ "BACKOFF_MS": [0, 5000, 25000, 120000, 600000], "MAX_ATTEMPTS": 5 }
```

The values are the reference's delivery policy. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs:11] After attempt `n` fails with a retryable error, `nextAttemptAt` is now plus `max(BACKOFF_MS[n], retryAfterMs)`, where `retryAfterMs` is the provider's own wait when it sent one, so a provider's `Retry-After` is never undercut. After the fifth failed attempt the entry is `failed`. The first attempt waits `BACKOFF_MS[0]`, which is 0.

```json
{ "schemaVersion": 1, "idempotencyKey": "notice-20261125T210504Z-3f9d2b11-telegram", "channel": "telegram", "conversationId": "81234567", "text": "...", "itemId": "20261125T210504Z-3f9d2b11", "runId": "20261125T210504Z-3f9d2b11", "state": "queued", "attempts": 1, "nextAttemptAt": "2026-11-25T21:05:10.000Z", "enqueuedAt": "2026-11-25T21:05:04.500Z", "updatedAt": "2026-11-25T21:05:05.000Z", "error": { "kind": "rate-limited", "message": "Telegram sendMessage rejected with HTTP 429", "unsupported": false, "retryable": true, "sentBeforeError": false } }
```

The `text` is elided here because its literal form is `../../001-channel-ux-and-message-map/design/message-catalog.md`'s to fix, and the contract's own sample text does not match what `deliveryMessage()` builds. The parent spec lists that sample as a cross-file fix.

---

## 5. SEEN RECORD

Restates `contracts/records.md` section 15. File: `channels/seen/<channel>/<sha256 hex of messageId>.json`. Writer: the transport, through one `channel.ts` helper.

| Key | Type | Null | Absent reads as |
|-----|------|------|-----------------|
| `schemaVersion` | integer `1` | no | `1` |
| `channel`, `messageId` | string | no | required |
| `requestId` | string | yes, a message refused before enqueue | `null` |
| `seenAt` | string, ISO 8601 UTC | no | required |

The `messageId` form per transport is `inbound-sequence.md` section 1. A press writes a seen record with `requestId: null`, because a press becomes an answer rather than a request.

```json
{ "schemaVersion": 1, "channel": "slack", "messageId": "envelope:5e8f0b44-2c1d-4e8a-9a51-2b7f3c6d9e10", "requestId": null, "seenAt": "2026-11-25T21:06:01.200Z" }
```

Seen records are never removed in this phase. One file per inbound message is small, and pruning is a later packet's choice, named in the parent spec.

---

## 6. LISTEN LEASE

No contract section holds this file. `contracts/runtime-architecture.md` section 2.1 names its path, `channels/listen-<channel>.lease` and this phase fixes its shape. Writer: `bots channel listen` through `channel.ts`.

| Key | Type | Null | Meaning |
|-----|------|------|---------|
| `schemaVersion` | integer `1` | no | `1` |
| `pid` | integer | no | The listening process |
| `nonce` | string, 16 hex | no | Tells a reused pid from the owner |
| `startedAt` | string, ISO 8601 UTC | no | When the lease was taken |

```json
{ "schemaVersion": 1, "pid": 48213, "nonce": "9f3b2c71a0d84e65", "startedAt": "2026-11-25T21:00:00.000Z" }
```

The lease is created with the exclusive flag. A second `listen` on the same channel finds it, and refuses `channel-listening` with exit 4 when the pid is alive. A lease whose pid is gone is reclaimed by rename, the model the run lease uses. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:12-16] The lease is removed on a clean stop.

---

## 7. `operators.json`

Restates `contracts/records.md` section 16. File: `<identity>/operators.json`. Writer: `bots channel roster add|remove` through `channel-link.ts`.

| Key | Type | Null | Absent reads as |
|-----|------|------|-----------------|
| `schemaVersion` | integer `1` | no | `1` |
| `owner` | string, an actor name | no | the roster is missing |
| `members` | string array | no | `[]` |

```json
{ "schemaVersion": 1, "owner": "ada", "members": ["grace"] }
```

A file that does not parse, has no `owner` or has an empty `owner` reads as missing.

---

## 8. `bots channel list --json`

Restates `contracts/cli-json.md` section 3.3.

| Key | Type | Null | Format |
|-----|------|------|--------|
| `version` | integer | no | `1` |
| `channels` | array | no | sorted by `name` |
| `channels[].name`, `.secret` | string | no | the channel and its configured secret name |
| `channels[].enabled` | boolean | no | from the config |
| `channels[].linkedChats` | integer | no | `links` entries of that channel |
| `channels[].queueDepth` | integer | no | queue entries of that channel in `queued` or `sending` |

```json
{ "version": 1, "channels": [ { "name": "slack", "enabled": false, "secret": "slack-app-token", "linkedChats": 0, "queueDepth": 0 }, { "name": "telegram", "enabled": true, "secret": "telegram", "linkedChats": 1, "queueDepth": 0 } ] }
```

---

## 9. WRITE ORDER OF ONE PARKED PROMPT

`delivery.ts` imports `channel-queue.ts` and no other channel module, and only `channel-approval.ts` writes the index (`contracts/runtime-architecture.md` section 1.3, `contracts/records.md` section 13). So the queue entry comes first and the index entry is written by the drain, before the send.

1. The run parks and writes its item. `delivery.ts` builds one entry per target carrying `itemId`, appends the choice block to the message and runs the secret-literal check over all of it.
2. `delivery.ts` writes the queue entry `notice-<runId>-<channel>` in state `queued` through `channel-queue.ts`.
3. The `drain` verb in `bots.cjs` takes the due entry from `channel-queue.ts` and, because it carries `itemId`, has `channel-approval.ts` write `prompts.<itemId>`. The verb joins the two because `channel-queue.ts` imports only `channel`, `state-root` and `run-record`.
4. The drain sets `sending`, calls the transport and records the outcome.

A stop after step 2 leaves a `queued` entry, which the next drain takes through steps 3 and 4. A stop after step 3 leaves an index entry and a `queued` entry, and the next drain writes the same index entry again and sends once. A stop during step 4 leaves `sending`, which the next drain turns into `unknown`. The index entry stays until `expiresAt`, so a press on a prompt that did arrive still resolves.

---

## 10. CHECKS

```bash
D=specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design
rg -c '"schemaVersion": 1' $D/records.md
node -e 'const t=[0,5000,25000,120000,600000]; console.log(t.length, t.reduce((a,b)=>a+b))'
```

The first prints 9, one per sample and the second prints `5 750000`.
