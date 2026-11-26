---
title: "Acceptance Criteria: Phase 2: conversation-runtime-and-chat-verb"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "conversation runtime acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb"
    last_updated_at: "2026-11-26T01:00:00Z"
    last_updated_by: "wo-08-writer"
    recent_action: "Moved the runtime rows here and changed the transcript rows to the object envelope"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-conversations"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: conversation-runtime-and-chat-verb

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb
**Level:** 2
**Status:** Draft
**Date:** 2026-11-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. AC-008, the pane, moved with its id to `../003-chat-pane-and-proof/acceptance-criteria.md`, so this table skips it. AC-015 to AC-032 are that child's, so the renderer row here takes AC-033.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a temporary state root and a bot with a `BOT.md`, When `bots chat my-bot --message hello` runs, Then one human message and one bot message are appended in that order, the bot message carries the run id the run wrote, and the request prompt holds the transcript inside one `<conversation id="my-bot">` block whose next line is the untrusted label, with one `<human>` or `<bot>` line per message after the body | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-chat.vitest.ts -t "one message"` prints one passing test | Unmet | - |
| AC-002 | REQ-002 | Given a conversation file whose last line is partial, When `bots chat my-bot --transcript` runs, Then every whole message prints, the partial line is reported on stderr and the file's bytes are unchanged. A human message with no run is reported as unanswered rather than re-dispatched | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/conversation.vitest.ts -t "torn"` prints one passing test | Unmet | - |
| AC-003 | REQ-003 | Given one human message and one bot message, When `--transcript --json` runs, Then each object carries `schemaVersion`, `id`, `conversationId`, `botId`, `role`, `text`, `at`, `runId` and `by`, the bot message's `by` is `bot`, and a message holding a control character other than a line feed is stored without it while a line feed is kept | `node .skilled/bin/bots.cjs chat my-bot --transcript --json \| jq -r '.messages[0] \| keys \| length'` prints 9 | Unmet | - |
| AC-004 | REQ-004 | Given two bots with a `BOT.md`, When `bots chat my-bot --message "@other-bot hello"` runs, Then the human message's `botId` is `other-bot` and the run record names `other-bot`. A message naming a bot with no `BOT.md`, or a token that fails the bot id pattern, exits 4 with `bot-unknown` and appends nothing | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-chat.vitest.ts -t "routing"` prints one passing test | Unmet | - |
| AC-005 | REQ-005 | Given a closed stdin, When `printf '/exit\n' \| bots chat my-bot` runs, Then it exits 0 and appends nothing. `printf 'hello\n/exit\n'` appends one human message and one bot message | `printf '/exit\n' \| node .skilled/bin/bots.cjs chat my-bot; echo "exit=$?"` prints `exit=0` | Unmet | - |
| AC-006 | REQ-006 | Given a conversation holding two messages, When `bots chat my-bot --transcript` runs, Then it prints both in order and `--json` prints the object `{"version": 1, "conversationId": "my-bot", "messages": [...]}` of `contracts/cli-json.md` section 3.1 with two messages, and a missing file prints the empty shape | `node .skilled/bin/bots.cjs chat my-bot --transcript --json \| jq '.messages \| length'` prints 2, and `node .skilled/bin/bots.cjs chat my-bot --transcript --json \| jq -r 'keys \| join(" ")'` prints `conversationId messages version` | Unmet | - |
| AC-007 | REQ-007 | Given a bot whose run prints a decision marker, When the message is sent, Then a bot message reading `needs you: <question> (item <itemId>)` is appended. A run that fails appends a bot message reading `failed: <exit reason>` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-chat.vitest.ts -t "parked"` prints one passing test | Unmet | - |
| AC-009 | REQ-009 | Given a conversation of 100 messages, When a new message is sent, Then the request prompt holds the newest 40 messages and no more, a single message over 8,000 characters is cut from its start to the bound with the `[cut: <n> characters dropped]` marker, the composed prompt never exceeds 32,000 characters, and a prompt still over the bound with the conversation empty is refused `prompt-over-budget` naming the block that crossed the line | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/conversation.vitest.ts -t "bound"` prints one passing test | Unmet | - |
| AC-010 | REQ-010 | Given the lifted loop, When `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` is read, Then a `## 010-conversations` section names `turnstone/turnstone/cli.py`, the Apache-2.0 licence, the copyright line and a statement of changes | `rg -n '^## 010-conversations\|turnstone/cli.py\|Apache License\|Statement of changes' .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints the heading, the source path, the licence and the statement of changes | Unmet | - |
| AC-011 | REQ-003 | Given one message id, When the same request is enqueued twice, Then the second result is `duplicate` and no second run record is written | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-chat.vitest.ts -t "duplicate"` prints one passing test | Unmet | - |
| AC-012 | REQ-012 | Given a chat message whose run parks a question, When `bots answer <item> yes` runs and the resume drains, Then the item and the resume request both carry `conversationId` and both validate against their closed key lists, `--transcript` prints three messages, and the third carries the answer text, the item id and the run id | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-chat.vitest.ts -t "resumed"` prints one passing test | Unmet | - |
| AC-013 | REQ-013 | Given the eight cases of `../001-chat-ux-and-pane-map/design/prompt-boundary.md` section 4.2, When each is dispatched, Then each stays inside the `<conversation id="...">` block as data with every reserved tag escaped to `&lt;`, the message's own text is the only record of the attempt and `--transcript` prints it verbatim, and no posture change follows | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/conversation.vitest.ts -t "injection"` prints eight passing tests | Unmet | - |
| AC-014 | REQ-014 | Given a message holding a stored secret literal, When it is sent, Then nothing is appended and the run is refused `body-secret` with exit 4. A reply that echoes the value is appended as `[redacted: <name>]` with `secret-in-output` in the run record's `postRunCauses` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-chat.vitest.ts -t "secret"` prints one passing test | Unmet | - |
| AC-033 | REQ-015 | Given an inbound channel message, When the renderer's `channel` form renders it, Then the block opens `<conversation channel="<channel name>">`, its next line is the same label and it holds one escaped `<human>` line | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/conversation.vitest.ts -t "channel"` prints one passing test | Unmet | - |

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

AC-001 is unmet. No code has been written yet, so every criterion is open.
<!-- /ANCHOR:closure -->
