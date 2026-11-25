---
title: "Acceptance Criteria: Phase 11: messaging-channels"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "messaging channels acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels"
    last_updated_at: "2026-11-25T07:51:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-messaging-channels"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 11: messaging-channels

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/011-messaging-channels
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a transport that declares only text send, When an undeclared operation is called, Then the result is `unsupported: true` with `retryable: false` and `sentBeforeError: false`, and no throw escapes | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel.vitest.ts -t "unsupported"` prints one passing test | Unmet | - |
| AC-002 | REQ-002 | Given one inbound message and one outbound intent, When each is built, Then the inbound object carries `channel`, `messageId`, `replyToId`, `timestampUnixMs`, `conversation`, `sender`, `text` and `raw`, and the receipt carries `platformMessageIds` and `primaryPlatformMessageId` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel.vitest.ts -t "message model"` prints one passing test | Unmet | - |
| AC-003 | REQ-003 | Given a temporary state root, When `bots channel link telegram` runs and a chat sends the printed code, Then the chat is linked to the actor who ran the command; and a message from a chat that never linked exits 4 with `channel-unlinked` and writes no run record | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-channel.vitest.ts -t "link"` prints one passing test | Unmet | - |
| AC-004 | REQ-004 | Given one chat id, When five wrong codes are sent and a sixth is attempted, Then the sixth is refused `channel-locked` with a positive seconds count, and the same refusal survives a new process | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-link.vitest.ts -t "lockout"` prints one passing test | Unmet | - |
| AC-005 | REQ-005 | Given a chat linked to an actor who is neither `owner` nor in `members`, When that chat answers an open item, Then the answer is refused `channel-not-approver`, the item file's bytes are unchanged and no resume request is queued | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-link.vitest.ts -t "not-approver"` prints one passing test | Unmet | - |
| AC-006 | REQ-006 | Given a prompt written to the approval index, When the process is restarted and a press carrying `approval-v1:<item-id>:1` arrives, Then the item is answered with the second choice and one resume request is queued | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-approval.vitest.ts -t "restart"` prints one passing test | Unmet | - |
| AC-007 | REQ-007 | Given a Telegram chat and a Slack channel, When a prompt is sent, Then Telegram carries an `inline_keyboard` and Slack carries a `block_actions` button, each with `approval-v1:<item-id>:<index>`; and a press from an unlinked chat emits no inbound event | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts -t "buttons"` prints one passing test | Unmet | - |
| AC-008 | REQ-008 | Given an open prompt on Signal, WhatsApp or the terminal, When `2`, `yes`, `Y`, `no` and `N` are sent, Then each selects its choice, and `hello` is treated as a chat message rather than an answer | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-approval.vitest.ts -t "grammar"` prints one passing test | Unmet | - |
| AC-009 | REQ-009 | Given a Telegram transport, When it starts, Then it calls `getUpdates` with `offset`, `timeout: 30` and `allowed_updates` of `message` and `callback_query`, registers no webhook, and splits a 5,000-character reply into two messages of at most 4096 | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts -t "telegram"` prints one passing test | Unmet | - |
| AC-010 | REQ-010 | Given a Slack transport with an app token, When it starts, Then it calls `apps.connections.open` and opens no inbound port, splits a 4,000-character reply at 3900, and drops a `block_actions` press from a non-approver | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts -t "slack"` prints one passing test | Unmet | - |
| AC-011 | REQ-011 | Given a Signal transport pointed at a local daemon, When it sends and listens, Then it posts to `/api/v1/rpc` and reads `/api/v1/events`, and splits a 3,000-character reply at 2000 | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts -t "signal"` prints one passing test | Unmet | - |
| AC-012 | REQ-012 | Given a webhook body and a wrong `X-Hub-Signature-256`, When the request is handled, Then it is refused `channel-signature` before the body is parsed; and a correct signature over the raw bytes is accepted and splits a 5,000-character reply at 4096 | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts -t "whatsapp"` prints one passing test | Unmet | - |
| AC-013 | REQ-013 | Given a transport that reports `uncertain`, When one send runs, Then the queue entry is written before the call, its state is `unknown` afterwards, and a second drain pass sends nothing; and a retryable failure waits 0, 5, 25, 120 and 600 s | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts -t "unknown"` prints one passing test | Unmet | - |
| AC-014 | REQ-014 | Given a channel whose token names a stored secret, When it sends, Then the value is read from the store at send time and `rg -n '<the value>' <stateRoot>` prints nothing | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts -t "token"` prints one passing test | Unmet | - |
| AC-015 | REQ-015 | Given an open prompt and a terminal transport, When `1` is typed, Then the item is answered; and when `hello` is typed, one chat message is enqueued through the phase 010 path | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts -t "terminal"` prints one passing test | Unmet | - |
| AC-016 | REQ-016 | Given a bot whose delivery target is `telegram:<chat>`, When its run parks a question, Then one delivery entry carries the item id and the channel sender writes the approval index entry before the send | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts -t "delivery"` prints one passing test | Unmet | - |
| AC-017 | REQ-017 | Given the fake transport, When the five conformance rules run, Then an undeclared operation returns `unsupported` and records no wire call, and a declared one returns no provider error and records one matching call with a receipt | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-conformance.vitest.ts` prints no `failed` | Unmet | - |
| AC-018 | REQ-018 | Given the lifted files, When `THIRD_PARTY_NOTICES.md` is read, Then it names `rakazo-main/packages/adapters/src/providers/messaging/telegram/telegram-messaging.ts`, `rakazo-main/packages/db/src/messaging/messaging.ts`, `turnstone-main/turnstone/channels/slack/bot.py` and `turnstone-main/turnstone/channels/_protocol.py`, each with the Apache-2.0 licence, its copyright line and a statement of changes, and `rg -n 'tinychannels' THIRD_PARTY_NOTICES.md` exits 1 | `rg -c 'Apache License' THIRD_PARTY_NOTICES.md` prints 4 or more | Unmet | - |
| AC-019 | REQ-019 | Given two configured channels, one enabled with one linked chat and one queued send, When `bots channel list` runs, Then it prints both with their enabled state, linked chat count and queue depth, and `--json` prints the same as an object | `node .skilled/bin/bots.cjs channel list --json \| jq -r 'keys \| length'` prints 2 | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

AC-001 is unmet: no channel contract exists yet, so every later criterion rests on a module that has not been written.
<!-- /ANCHOR:closure -->
