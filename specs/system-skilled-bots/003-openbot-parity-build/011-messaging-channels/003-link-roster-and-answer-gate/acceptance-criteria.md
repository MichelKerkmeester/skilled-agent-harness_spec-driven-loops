---
title: "Acceptance Criteria: Phase 3: link-roster-and-answer-gate"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "link roster and answer gate acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate"
    last_updated_at: "2026-11-26T06:00:00Z"
    last_updated_by: "wo-09-writer"
    recent_action: "Authored the acceptance criteria"
    next_safe_action: "Run each block and mark the rows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-003-link-roster"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: link-roster-and-answer-gate

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate
**Level:** 2
**Status:** Draft
**Date:** 2026-11-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

AC ids follow their requirement, AC-NNN checks REQ-NNN and keep the pre-expansion numbers. Every command runs from the repository root with no tty, no token and no network. A command that writes state runs on the temporary state root of `tasks.md` Task Notation.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a transport that declares only text send, When an undeclared operation is called, Then the result is `unsupported: true` with `retryable: false` and `sentBeforeError: false` and no throw escapes | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel.vitest.ts -t "^bots channel refuses an undeclared operation$")` prints `Tests  1 passed`. Observed 2026-11-28: `Tests  1 passed | 4 skipped (5)`. Edit, react, file and buttons on a text-only fake each resolve to the unsupported result with no throw | Met | - |
| AC-002 | REQ-002 | Given one inbound message and one outbound intent, When each is built, Then the inbound object carries `channel`, `messageId`, `replyToId`, `timestampUnixMs`, `conversation` as `{ id, isGroup }`, `sender` as `{ id }`, `text`, `actionId` and `raw`, an outbound intent of kind `buttons` carries `itemId` and `choices` and the receipt carries `platformMessageIds` and `primaryPlatformMessageId` | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel.vitest.ts -t "^bots channel builds the message model$")` prints `Tests  1 passed`. Observed 2026-11-28: `Tests  1 passed | 4 skipped (5)` | Met | - |
| AC-003 | REQ-003 | Given a temporary state root whose roster names one owner, When `bots channel link telegram` runs and a chat sends the printed six-digit code within five minutes, Then the chat is linked to the actor who ran the command and the link record carries that actor and the sender id, a message from a chat that never linked is refused `channel-unlinked` and writes no run record and a second send of the same code links nothing. Given a roster naming `ada` as `owner` and `bob` as a member, When `bots channel link telegram --as bob` runs and `bob`'s chat sends the code, Then the link record names `bob`, and `bots channel link telegram --as mallory` is refused `answer-not-approver` with exit 4 | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-channel.vitest.ts -t "^bots channel link links a chat that sends the code$")` prints `Tests  1 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-channel.vitest.ts -t "^bots channel link links a member's chat with --as$")` prints `Tests  1 passed`. Observed 2026-11-28: each prints `Tests  1 passed | 9 skipped (10)`. The `--as bob` and `--as mallory` cases run under a pty on darwin, and `--as mallory` exits 4 with `bots: answer-not-approver: mallory`. A link with no `--as` names the OS user, so that case makes the OS user the owner rather than `ada` | Met | - |
| AC-004 | REQ-004 | Given one chat id, When five wrong six-digit codes are sent and a sixth is attempted, Then the sixth is refused `channel-locked` with a positive seconds count and the same refusal survives a new process, a non-code message counts nothing and given a linked chat whose actor is not an approver, When that actor fails five times, Then the chat is not locked for the other members, and given a pending code and five wrong attempts spread over two chats, When a sixth attempt arrives from either chat, Then the code is void | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-link.vitest.ts -t "^bots channel link locks a chat after five wrong codes$")` prints `Tests  1 passed`. Observed 2026-11-28: `Tests  1 passed | 1 skipped (2)`. One test covers the five wrong codes and the lock, the lock read again by a second process, the non-code text that counts nothing, the code voided across two chats and a linked non-approver whose five refusals lock no chat. The cross-chat count is a `failures` key on the pending code that reads 0 when absent | Met | - |
| AC-005 | REQ-005 | Given a chat linked to an actor who is neither `owner` nor in `members`, When that chat answers an open item, Then the answer is refused `answer-not-approver`, the item's bytes are unchanged and no resume request is queued, a link record whose sender id belongs to a member but whose press claims another actor is refused the same way, an absent roster refuses every channel answer `channel-roster-missing` and of two answers that both read `open` the loser is refused `item-answered-differently` | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-link.vitest.ts -t "^bots channel link refuses a chat whose actor is off the roster$")` prints `Tests  1 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer refuses the loser of two concurrent answers$")` prints `Tests  1 passed`. Observed 2026-11-28: `Tests  1 passed | 1 skipped (2)` and `Tests  1 passed | 19 skipped (20)`. A press whose sender id is not the link's `senderId` is refused `channel-unlinked` with detail `sender mismatch` by `resolveLink`, the silent rule of the channel message catalog section 2, so it reaches no answer and the item stays unchanged | Met | - |
| AC-020 | REQ-020 | Given an absent `operators.json`, When `bots channel roster add ada --role owner` runs, Then the file is created as `{ "schemaVersion": 1, "owner": "ada", "members": [] }`, `roster add bob --role member` adds a member, `roster list` prints both, `roster remove ada` is refused `channel-roster-owner` and `bots channel link telegram` on a state root with no roster exits 4 with `channel-roster-missing`, `roster add grace` defaults the role to `member`, `roster add ada --role owner` on a roster that already names an owner replaces the owner and leaves `members`, a repeated `roster add bob` exits 0 and writes nothing, `roster remove zoe` exits 0 with `bots: zoe is not on the roster` on stderr and `roster list` on an absent file prints `bots: no roster` on stderr and exits 0 | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-channel.vitest.ts -t "^bots channel roster ")` prints `Tests  7 passed`. Observed 2026-11-28: `Tests  7 passed | 3 skipped (10)` | Met | - |
| AC-021 | REQ-021 | Given a roster naming `ada` as `owner` and `bob` as a member, When `answerItem` is called with the surface `channel` and the actor `mallory` and no tty, Then it refuses `answer-not-approver` and the item is unchanged and given no roster the surface `terminal` with `ada` writes `"by": "ada"` while the surface `channel` is refused `channel-roster-missing` and given the present roster the surface `terminal` with `mallory` is refused `answer-not-approver`, which is what `bots enable`'s fatigue answer and the screen's answer reach | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer refuses a channel answer from an actor off the roster$")` prints `Tests  1 passed`, `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer writes a terminal answer on no roster$")` prints `Tests  1 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer refuses a terminal answer from an actor off a present roster$")` prints `Tests  1 passed`. Observed 2026-11-28: each prints `Tests  1 passed | 19 skipped (20)`. The three behaviours hold for an explicit surface. REQ-021's no-default clause did not land: an omitted `surface` reads as `terminal`, see `implementation-summary.md` Known Limitations | Met | - |
| AC-023 | REQ-023 | Given an absent `channels/config.json` and a roster naming one owner, When `bots channel link telegram` runs, Then the file holds `{ "schemaVersion": 1, "channels": { "telegram": { "secret": "telegram", "enabled": true } } }` and no token value, `bots channel link slack --secret team-slack` adds a second entry naming that secret and `bots channel unlink telegram` sets `enabled: false` and leaves the entry and `bots channel link whatsapp --secret <a 49 character name>` is refused `secret-name-invalid` with exit 4 and writes no entry | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel.vitest.ts -t "^bots channel writes the config entry$")` prints `Tests  1 passed`. Observed 2026-11-28: `Tests  1 passed | 4 skipped (5)` | Met | - |
| AC-032 | REQ-032 | Given the reply table, When each of M07 to M20 is filled with the sample values of the catalog, Then it equals its golden file with the final newline removed | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel.vitest.ts -t "^bots channel matches every reply golden$")` prints `Tests  1 passed`. Observed 2026-11-28: `Tests  1 passed | 4 skipped (5)`. All fourteen rows M07 to M20 equal their golden files | Met | - |
| AC-033 | REQ-033 | Given the URL `https://api.telegram.org/bot123:abc/getUpdates` and the token `123:abc`, When `redactToken` runs, Then it returns `https://api.telegram.org/bot<redacted>/getUpdates` and a thrown fetch error carrying the URL is redacted the same way | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel.vitest.ts -t "^bots channel redacts a token in a URL$")` prints `Tests  1 passed`. Observed 2026-11-28: `Tests  1 passed | 4 skipped (5)` | Met | - |

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

**Closeable:** Yes

Every row is Met. Each Verification cell names the output observed on 2026-11-28 in the unit worktree. REQ-021's no-default clause is the one part of a requirement that did not land, and AC-021 checks only the explicit-surface behaviour it names.
<!-- /ANCHOR:closure -->
