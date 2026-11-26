---
title: "Design: inbound acknowledge sequence per transport"
description: "Per transport, when the provider is acknowledged relative to the durable enqueue and the seen record, what is on disk if the process stops between the steps, and how a redelivered message is recognized."
trigger_phrases:
  - "channel inbound sequence"
  - "provider acknowledge boundary"
  - "channel redelivery"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Inbound acknowledge sequence per transport

The inbound acknowledge boundary was undefined per transport and the `seen/` folder was named once with no content. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:203] The reference makes the boundary an adapter policy with four values, defaulting to acknowledge after the receive record. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/adapter.rs:16-22] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:66-68] This phase takes that default for every transport whose provider has an acknowledge, and the order is the one `contracts/records.md` section 15 fixes: the durable step, then the seen record, then the acknowledge.

---

## 1. THE COMMON ORDER

Every transport with an acknowledge runs these steps for one inbound message, in this order.

| # | Step | Writes |
|---|------|--------|
| 1 | Authenticate the delivery where the provider signs it. Only WhatsApp does | Nothing |
| 2 | Compute the `messageId` (table below) and look for `seen/<channel>/<sha256 hex of messageId>.json`. Found means a redelivery: acknowledge and stop | Nothing |
| 3 | Resolve the chat and the sender through `links.json`: unlinked, locked, a pairing code, or a sender id that differs from the link record's `senderId` | `links.json` for a code or a failure count |
| 4 | Act. A press or a matching reply calls `answerItem`. Any other text becomes one `enqueueRequest` whose event id is `<channel>:<messageId>` | The answered item, or the request and its seen marker under `requests/` |
| 5 | Write the seen record with the request id, or `null` for an answer or a refusal | `seen/<channel>/<hash>.json` |
| 6 | Enqueue the reply the catalog names, if any (an echo or a refusal) | `channels/queue/<key>.json` |
| 7 | Acknowledge the provider | Nothing local |

| Transport | `messageId` | Why that value |
|-----------|-------------|----------------|
| `telegram` | `update:<update_id>` | `update_id` is unique per bot and the reference tracks seen updates by it [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1970-1985] |
| `slack` | `envelope:<envelope_id>` | The reference's dedupe key for a Socket Mode delivery [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/events.rs:146-149] |
| `signal` | `<source number>:<timestamp>` | A Signal message is named by its sender and its millisecond timestamp, the pair the reference reserves as its seen key [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/signal/inbound.rs:428] |
| `whatsapp` | the message's `wamid` id | Meta redelivers the same id until it sees a 2xx [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/ingress.rs:10-11] |
| `terminal` | none | A stdin line has no provider and no redelivery |

**Two dedupe layers, one reason each.** The seen record catches a redelivery before anything runs, which matters for a press: answering twice is idempotent, but it would enqueue a second echo. The request queue's own seen marker catches the case where the process stopped between steps 4 and 5, because the event id is the same on redelivery and `enqueueRequest` returns `duplicate`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:133-150]

**Step 3 resolves the sender, not only the chat.** A link record holds the provider-asserted `senderId` of the message that carried the code, and step 3 compares it with the inbound message's `sender.id` for every event kind, a press included. A sender that differs is refused `channel-unlinked` with no reply, no counter and no `answerItem` call, because the sender is not the person the chat linked and a reply would answer a stranger. A pairing code sent from a group on a transport whose `groupKnown` is `yes` links nothing, because the group's other members would share the link. A linked actor the roster does not name is a different case and is refused later, at `answerItem`, with reply M14 and one `notApprover` count.

**What a stop leaves, the common case.**

| Stopped after | On disk | On the next delivery of the same message |
|---------------|---------|------------------------------------------|
| Step 3 | At most a failure count | Judged again. A code attempt counts twice, which can lock a chat one attempt early. Accepted, because the alternative is a second write before every read |
| Step 4, a request | The queued request, no seen record | Step 4 returns `duplicate`, step 5 writes the seen record, nothing runs twice |
| Step 4, an answer | The answered item, no seen record | `answerItem` takes the duplicate path for the same text and scope (`contracts/answer-seam.md` step 8), step 5 writes the seen record |
| Step 5 | The seen record | Step 2 finds it and the message is dropped |
| Step 6 | The reply queued | Step 2 drops the message. The reply is sent by the next drain |

---

## 2. TELEGRAM

| Fact | Value |
|------|-------|
| Acknowledge | The next `getUpdates` with an `offset` above the update's id confirms it. The reference advances the offset only after the update's action succeeded [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1979-1986] |
| Policy | `after-seen-record`: the offset moves past an update only after step 5 |
| A press | `answerCallbackQuery` is called on receipt to stop the client's spinner, before the allowlist check [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1988-1996]. That call is a display acknowledge and confirms nothing. The offset rule above still holds |
| Offset across a restart | Not persisted. The loop starts at `offset: 0`, as the reference does [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1854], so the first poll returns every unconfirmed update and step 2 drops the ones already taken |
| Stop between steps 4 and 7 | The update was never confirmed, so it comes back on the first poll after the restart |

## 3. SLACK

| Fact | Value |
|------|-------|
| Acknowledge | `{"envelope_id": "<id>"}` sent back over the socket [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/socket.rs:138-141] |
| Policy | `after-seen-record` |
| Unacknowledged envelope | Redelivered after a reconnect, as the reference relies on when its queue is full [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/socket.rs:194-199] |
| A `disconnect` frame | The socket is closed and reopened through a fresh `apps.connections.open` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/socket.rs:164-166] |
| Stop between steps 4 and 7 | The envelope was not acknowledged and comes back after the next connect |

How long Slack waits for an acknowledge before it redelivers is not stated in the reference. Steps 2 to 6 are local file writes, so the design does not depend on the figure.

## 4. SIGNAL

| Fact | Value |
|------|-------|
| Acknowledge | None. The daemon pushes events over SSE and takes no reply [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/signal/listener.rs:89-104] |
| Policy | `none`. Steps 1 to 6 still run in order, and step 7 is skipped |
| Stop between steps 4 and 5 | The request is queued. No redelivery follows, so the missing seen record costs nothing |
| An event sent while no SSE client is connected | **UNKNOWN.** The reference reconnects with a growing delay and says nothing about events in the gap [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/signal/listener.rs:94-138]. Whether signal-cli holds them for the next client is unconfirmed. A manual run of the daemon with the client stopped, then started, would confirm it. Until then the runbook tells the operator that a message sent while `listen signal` is down may be lost |

## 5. WHATSAPP

| Fact | Value |
|------|-------|
| Acknowledge | The HTTP response to Meta's `POST`. Meta retries until it sees a 2xx [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/ingress.rs:10-11] |
| Policy | `after-seen-record`: `200` with an empty body is written only after steps 2 to 6 ran for every message in the body |
| Step 1 | `X-Hub-Signature-256` is checked as HMAC-SHA256 of the raw bytes in constant time before any parse [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/ingress.rs:33-50]. A missing, malformed or wrong signature answers `401` with an empty body and the reason `channel-signature` in the local log, the same for all three |
| Body size | At most 2 MiB, the reference's bound, because Meta batches several messages in one `POST` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/ingress.rs:26-27]. A larger body answers `413` before the signature is computed |
| A delivery for another number | Refused rather than routed: a `phone_number_id` other than the configured one is dropped [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/ingress.rs:6-8] |
| Status updates | A `statuses` entry carries no message from a person. One whose `status` is `failed` and whose `id` is a platform message id the queue holds moves that queue entry and the run record's delivery entry to `failed`, with the platform's error code in the entry's `error.message`, because the platform accepted the send and then could not deliver it. Every other status entry is dropped after step 1 |
| The handshake | `GET` with `hub.mode=subscribe` and a `hub.verify_token` equal to the stored verify token echoes `hub.challenge` with `200`. Anything else answers `403` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/ingress.rs:84-90] |
| Stop between steps 4 and 7 | Meta saw no 2xx and posts the same body again. Step 2 drops every message already taken |

## 6. TERMINAL

The terminal reads stdin lines in `bots channel listen terminal`. A line that answers an open prompt calls `answerItem` with the surface `channel`. Any other line goes through the 010 chat path of `../../../010-conversations/002-conversation-runtime-and-chat-verb/spec.md` section 9, anchor `chat-path`, whose commit point is the append of the human message. No seen record is written and no acknowledge exists, so the policy is `none`.

---

## 7. CHECKS

```bash
D=specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design
rg -c '^## [2-6]\. ' $D/inbound-sequence.md
rg -c '^\| Policy \|' $D/inbound-sequence.md
```

The first prints 5, one section per transport. The second prints 4, because the terminal section has no policy row.
