---
title: "Messaging channels"
description: "Lets a roster member answer a bot's needs-you question from Telegram, Slack, Signal, WhatsApp or the terminal, with every prompt indexed and every send queued before it goes out."
trigger_phrases:
  - "messaging channels"
  - "bots channel"
  - "chat channel transports"
  - "answer a bot from chat"
version: 1.0.0.0
---

# Messaging channels

## 1. OVERVIEW

Lets a roster member answer a bot's needs-you question from Telegram, Slack, Signal, WhatsApp or the terminal, with every prompt indexed and every send queued before it goes out.

A team that works in a chat client answers where the question was asked instead of walking to the host, and only a person the roster names may answer.

---

## 2. HOW IT WORKS

`bots channel link <channel>` prints a one-time code on the host that lasts five minutes. Sending it from the chat links that chat to the actor who ran the verb, and `bots channel roster` names the owner and the members. A message whose sender is not the person the chat linked is dropped in silence.

Every prompt gets an approval index entry before it is sent, so a restart cannot lose the question a chat holds. Telegram and Slack show buttons and Signal, WhatsApp and the terminal take a numbered or YES or NO reply. A prompt holding a stored secret literal is withheld and never sent.

Every outbound message is a file in the send queue before it is sent, and `bots channel drain` sends due entries. A send whose result is uncertain is `unknown` and never retried. An operation a transport does not declare returns the explicit unsupported result and reaches no provider, which the conformance suite checks on every transport.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/bin/bots.cjs` | Script | The `channel` verb group: link, unlink, roster, list, send, drain and listen |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel.ts` | Shared | The adapter contract, the capability matrix and the config entry |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-link.ts` | Shared | The pairing code, the link record and the operators.json roster |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-approval.ts` | Shared | The approval index and the reply grammar a press or a typed line resolves |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-queue.ts` | Shared | The send queue, its idempotency keys and the forward-only state moves |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-terminal.ts` | Shared | The terminal transport, a line on stdin as the whole inbound path |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-telegram.ts` | Shared | The Telegram transport over a long poll |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-slack.ts` | Shared | The Slack transport over Socket Mode |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-signal.ts` | Shared | The Signal transport over a local signal-cli daemon |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-whatsapp.ts` | Shared | The WhatsApp transport over the Cloud API webhook |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/channel.vitest.ts` | Vitest | The adapter contract, the config entry, the reply table and token redaction |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-link.vitest.ts` | Vitest | The pairing code lockout and the actor a chat answers as |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-approval.vitest.ts` | Vitest | The approval index and the reply grammar against a temp state root |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-queue.vitest.ts` | Vitest | The send queue against a temp state root and a fake transport |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-channel.vitest.ts` | Vitest | The link, unlink and roster verbs through the CLI |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-transports.vitest.ts` | Vitest | The transports against recorded wire fixtures and loopback servers |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-conformance.vitest.ts` | Vitest | The conformance rules over every transport and operation |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-support.ts` | Test harness | The temp state root, the scripted fake transport and the capability-matrix driver |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/channels/` | Fixture | The recorded wire exchanges each transport replays |

---

## 4. SOURCE METADATA

- Group: Operator loop
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `operator-loop/messaging-channels.md`

Related references:
- [run-delivery.md](run-delivery.md) - the delivery that queues a chat prompt
- [needs-you-answer.md](needs-you-answer.md) - the answer a chat records
