---
title: "Feature Specification: Phase 3: link-roster-and-answer-gate"
description: "Lands channel.ts with the adapter contract, the message model, the capability keys, the config file and the reply table, then the pairing code, the link record and its lockout, the operators.json roster and its verbs, and the roster check in answer.ts that every answer surface calls."
trigger_phrases:
  - "link roster and answer gate"
  - "phase 3 link roster and answer gate"
  - "bots channel link"
  - "bots channel roster"
  - "channel roster check"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: link-roster-and-answer-gate

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
| **Phase** | 3 of 7 |
| **Predecessor** | 002-adapter-and-record-contracts |
| **Successor** | 004-approval-index-and-send-queue |
| **Handoff Criteria** | `channel.ts` and the channel state folders land first, so child 004 can start. Then the roster verbs, `link` and `unlink` work on a temporary state root, `answerItem` refuses a channel answer from an actor the roster does not name, every acceptance criterion is Met and `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the messaging channels phase parent, the first build child.

**Scope Boundary**: `channel.ts`, the channel folders in `state-root.ts`, `channel-link.ts`, the roster check in `answer.ts` and the `channel` verb group in `bots.cjs` with `link`, `unlink` and `roster`. It also creates the two test helpers every later child imports. The approval index, the queue and `delivery.ts` are child 004. The transports are 005 and 006.

**Dependencies**:
- `../001-channel-ux-and-message-map/design/message-catalog.md` rows M07 to M20, the reply table this child writes into `channel.ts` and row M09, the line `link` prints
- `../002-adapter-and-record-contracts/design/capabilities.md` for the keys, and `design/records.md` sections 1, 2, 6 and 7 for the config, the link record, the listen lease and the roster
- `contracts/answer-seam.md` steps 1, 4 and 5, which place the surface, the actor and the roster check and `contracts/refusals.md` section 3.10 for every name
- The answer path, which records the answer and queues the resume [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:65-119]
- The per-identity state folders, which the channel folders join [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117-131]
- Phase 001's `by:` actor and its tty rule, which lives in `bots.cjs` alone, so a channel passes the actor as an argument [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:106]
- Phase 006's authority model and guarded write: the host is the authority, so a terminal answer needs no roster [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:103]

**Deliverables**:
- `channel.ts`: the contract, the message model, the capability keys, the unsupported result, `readChannelConfig` and `writeChannelConfig`, `redactToken`, the seen-record and listen-lease helpers and the reply table
- `channel-link.ts`: the pairing code, the link record, the pairing lockout and the roster
- The roster check in `answerItem`, keyed on the surface argument
- `bots channel link|unlink` and `bots channel roster add|remove|list`
- `tests/channel-support.ts`, the temporary state root and the scripted fake transport
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nothing links a chat identity to a person, so a message from a chat cannot be attributed to an actor and nothing says who may answer from one. `answerItem` writes any answer it is handed and checks no roster. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:65-119] No module owns an adapter contract, so five transports would each invent one.

### Purpose
One contract every transport implements, and one gate every answer passes, so a chat can only answer as the person who linked it and only when the roster names that person.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Taken on 2026-11-26 in this worktree.

```text
$ node .skilled/bin/bots.cjs channel roster list </dev/null 2>&1 | head -1
bots: unknown verb: channel
$ rg -c 'operators' .skilled/skills/system-skilled-bots/runtime/lib/; echo "exit=$?"
exit=1
$ rg -n 'channels' .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts; echo "exit=$?"
exit=1
```

The CLI has no `channel` verb, no module reads a roster and the state layout has no channel folder.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `channel.ts`, one adapter contract with the capability keys of child 002 and an explicit `unsupported` result for an undeclared operation.
- Add `channel-link.ts`, a one-time pairing code, a file-backed link record, a pairing lockout and the `operators.json` roster, so an unlinked chat is denied by default.
- Add the roster check to `answer.ts`, called by every answer surface with the surface as an argument.
- Add `bots channel link|unlink` and `bots channel roster add|remove|list`, the only surface that writes the roster.
- Create the shared test helpers.

### Out of Scope
- Discord and the other tinychannels providers - each is another wire protocol, and the five of this phase cover the team's clients [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/long_tail.rs:1-7]
- The WhatsApp Web linked-device client - it needs a paired phone session, so the Cloud API is the supported path
- Telegram `/start` onboarding that makes the first sender the operator - it trusts an unauthenticated sender with ownership [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_recv.rs:527-545]
- Streaming a run's output into a chat, attachments, voice and images - one message is one run and every transport carries text
- A per-channel approval policy beyond the roster - phase 006 owns the ladder
- A shared-host roster - the roster is single-operator until a later packet lands the 0770 mode, so a `members` entry names a person on this host
- A second state root or a database

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/channel.ts` | Create | The contract, the message model, the capability keys, the unsupported result, the config read and write, `redactToken`, the seen-record and listen-lease helpers and the reply table |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-link.ts` | Create | The pairing code, the link record, the pairing lockout and the roster |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modify | `channelFolder`, `operatorsFile` and `ensureChannelState`, naming `channels/` with its `queue/` and `seen/` folders |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modify | The roster check before the lock, keyed on the surface argument |
| `.skilled/bin/bots.cjs` | Modify | The `channel` verb group with `link`, `unlink` and `roster add|remove|list` |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-support.ts` | Create | `temporaryStateRoot` and the scripted fake transport every channel test imports |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel.vitest.ts` | Create | The contract, the message model, the unsupported result, the config, the redaction and the reply table against the goldens |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-link.vitest.ts` | Create | The code, the default deny, the lockout and the roster |
| `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts` | Modify | The roster check through `answerItem` on both surfaces |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-channel.vitest.ts` | Create | The verb group's argv, refusals and exit codes for `link`, `unlink` and `roster`. Child 004 appends its verbs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids keep their pre-expansion numbers and are unique across children 003 to 007, as `../spec.md` section 4 maps them. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `channel.ts` defines one adapter contract: `descriptor`, `declaredCapabilities`, `start(sink)`, `stop`, `send` and `status`, plus an inbound sink with one `push`. `declaredCapabilities` returns a column of `../002-adapter-and-record-contracts/design/capabilities.md` section 2. An operation a transport does not declare returns an explicit `unsupported` result with `unsupported: true`, `retryable: false` and `sentBeforeError: false`, never a silent success and never a throw |
| REQ-002 | The message model is one shape per direction. An inbound message carries `channel`, `messageId`, `replyToId`, `timestampUnixMs`, `conversation`, `sender`, `text` and `raw`. An outbound intent carries `idempotencyKey`, `conversationId` and `text`. A receipt carries `platformMessageIds` and `primaryPlatformMessageId`. A send error carries `kind`, `message`, `unsupported`, `retryable` and `sentBeforeError` |
| REQ-003 | `bots channel link <channel>` prints catalog row M09 with a one-time code of six digits that expires after five minutes and is consumed by its first use, and a chat that sends that code is linked to the actor who ran the command. The link is a record in `links.json` that holds both that actor and the provider-asserted sender id, so a later press resolves to a person rather than to a chat. An unlinked chat is denied by default: its message reaches no bot, and the refusal is `channel-unlinked` with reply M11. `link` refuses `channel-roster-missing` with exit 4 until `operators.json` names an owner |
| REQ-004 | Five six-digit attempts from one chat that are not the pending code lock that chat for 300 s, because no actor exists before a link. Each wrong attempt replies M12 and the lock replies M13. The lockout is file-backed in `links.json`, so a restart does not clear it and a locked chat is refused `channel-locked` with the whole seconds left. Text from an unlinked chat that is not six digits counts nothing. Once a chat is linked, a repeated `answer-not-approver` is counted per actor in the approval index's `notApprover`, which child 004 writes and never per chat, so one member's failures do not lock the chat for the others |
| REQ-005 | Only an actor named `owner` or listed in `members` of `operators.json` may answer a needs-you item from a channel. The roster is `{ "schemaVersion": 1, "owner": "<actor>", "members": ["<actor>"] }` at `<stateRoot>/<identity>/operators.json`, the shape of `contracts/records.md` section 16. `isApprover` resolves the provider-asserted sender id through the link record and then matches that actor against the roster, so a chat cannot borrow another person's name. An absent, unreadable or empty roster refuses every channel answer `channel-roster-missing`. Any other sender is refused `answer-not-approver`, the item is unchanged and no resume request is queued. The channel passes the linked actor to `answerItem` with the surface `channel` rather than through `--as`, so the item's `by` names the person who pressed and a channel answer needs no terminal. It goes through 006's guarded write, so a concurrent second answer with different text is refused `item-answered-differently` |
| REQ-021 | `answer.ts` gains one roster check, and every answer surface calls it, so a channel press and a CLI `--as` cannot disagree. `answerItem` takes the answer's surface as an argument, `terminal` or `channel` and defaulting to `terminal`, because a bare actor name cannot say which path it came from and 001's explicit-actor tests call `answerItem` with no roster and no tty [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md:57] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md:61]. A `terminal` answer on an absent roster is refused nothing, because the host is the authority 006 names. A `channel` answer on an absent, unreadable or empty roster is refused `channel-roster-missing`. A present roster is checked on either surface, and an actor who is neither `owner` nor a member is refused `answer-not-approver`. That reaches `bots enable`'s answer to 002's fatigue item and the screen's answer, which writes through `bots answer`. Both call the check with the surface `terminal`, so a present roster that names neither the OS user nor `--as` refuses them too, the item stays open and the operator adds themselves with `bots channel roster add <actor> --role owner` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:134]. The check runs at step 5 of `contracts/answer-seam.md`, before the lock |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-020 | `bots channel roster add <actor> [--role owner\|member]`, `remove <actor>` and `list` are the only surface that writes `operators.json`. `add --role owner` creates the file when it is absent. `add --role member` on an absent roster is refused `channel-roster-missing`, because a member without an owner is not a roster. `remove` refuses `channel-roster-owner` when it would leave no owner, and `list` prints `owner <actor>` and one `member <actor>` line each. Every refusal exits 4 |
| REQ-023 | `channels/config.json` at `<stateRoot>/<identity>/channels/config.json` is the one record of which channels exist: `{ "schemaVersion": 1, "channels": { "<name>": { "secret": "<secret-name>", "enabled": <boolean> } } }`, the shape of `contracts/records.md` section 11, where `secret` is a phase 008 secret name and never a value. `channel.ts` exports `readChannelConfig` and `writeChannelConfig`, the only reader and writer and imports `state-root.ts` alone. `bots channel link <channel> [--secret <name>]` writes the entry with `enabled: true` and `secret` defaulting to the channel name, and the roster check runs first, so a refused `link` writes no entry. `bots channel unlink <channel>` writes `enabled: false` and removes that channel's links from `links.json`, leaving the entry. A channel the file does not name is not configured |
| REQ-032 | `channel.ts` holds catalog rows M07 to M20 as one table of templates, and each filled template equals its golden file in `../001-channel-ux-and-message-map/design/golden/` byte for byte after the golden's final newline is removed |
| REQ-033 | `redactToken(url, token)` replaces every occurrence of the token in a URL or message with `<redacted>`, so `https://api.telegram.org/bot<token>/getUpdates` renders as `https://api.telegram.org/bot<redacted>/getUpdates` and every channel error, log line and queue entry passes through it |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On a temporary state root, `bots channel roster add ada --role owner` creates `operators.json` with `schemaVersion` 1 and `bots channel link telegram` then prints one M09 line with a six-digit code
- **SC-002**: A message from a chat that never linked is refused `channel-unlinked`, and five wrong six-digit codes make the sixth attempt refused `channel-locked` with a positive seconds count
- **SC-003**: `answerItem` with the surface `channel` and the actor `mallory` refuses `answer-not-approver` and leaves the item's bytes unchanged, while the surface `terminal` and the actor `ada` on a state root with no roster writes the answer
- **SC-004**: Every filled reply template equals its golden
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006's guarded write and lock | A concurrent answer could replace the first | The check sits before the lock, and the loser is refused by 006's rule |
| Risk | A chat is linked to the wrong person | That person can approve a bot's actions | The code is one-time, expires, is printed only on the host and the roster is a second gate |
| Risk | The roster is absent, unreadable or empty | Fail-open lets any linked chat approve, fail-closed locks the team out | A channel answer is refused `channel-roster-missing`, a terminal answer is not and `link` refuses until an owner exists |
| Risk | A roster on the real state root refuses real terminal answers | The operator's own `bots answer` stops working during a test | Every task that writes state runs on a temporary state root, `tasks.md` Task Notation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The roster check reads one file and runs before the item lock, so it never makes a second answerer wait

### Security
- **NFR-S01**: Every channel file and `operators.json` is created 0600 inside a 0700 folder
- **NFR-S02**: A press resolves only when its sender id equals the link record's `senderId`

### Reliability
- **NFR-R01**: The lockout and every pending code are files, so a restart neither clears a lock nor revives an expired code
- **NFR-R02**: `channel.ts` imports `state-root.ts` and nothing else, so the contract has no cycle (`contracts/runtime-architecture.md` section 1.4)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `bots channel roster add` with no actor exits 2 with usage
- Maximum input: an actor name outside 001's name pattern is refused by that pattern before the roster is read
- Failure path: an absent roster refuses a channel answer `channel-roster-missing` and refuses nothing on the terminal surface. `remove` of the last owner is refused `channel-roster-owner`
- Two `link` runs: the second replaces the first unused code, so only the newest code links
- Adversarial input: a chat that sends a valid code but a different sender id on a later press is refused `answer-not-approver`
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two new modules, two edits, one verb group, two helpers and four test files |
| Risk | 13/25 | The roster gate decides who may approve a bot's action |
| Research | 5/20 | The design children fix every shape |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does this phase land `operators.json`? Decision: yes, the minimal `owner` and `members` roster, which the parent packet assigns to this phase. Reversal condition: if the roster moves to a later packet, a channel answer must be refused outright.
- Does a channel config live in `bots/config.json` or under the state root? Decision: under the state root, because a channel belongs to an identity.
- Does a non-code message from an unlinked chat count toward the lockout? Decision: no, only a six-digit attempt can guess a code.
- Where does the untrusted wrap of an inbound message live? Decision: in the transports through 010's renderer, not in `channel.ts`, because `channel.ts` imports `state-root.ts` alone and the renderer lives in `conversation.ts` (`contracts/runtime-architecture.md` section 1.2). REQ-022 is child 005's.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Design children**: `../001-channel-ux-and-message-map/design/`, `../002-adapter-and-record-contracts/design/`
- **Next child**: `../004-approval-index-and-send-queue/`
- **Contracts**: `../../contracts/`
