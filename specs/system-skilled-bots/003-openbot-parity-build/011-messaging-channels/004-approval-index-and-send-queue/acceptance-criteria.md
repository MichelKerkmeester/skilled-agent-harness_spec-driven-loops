---
title: "Acceptance Criteria: Phase 4: approval-index-and-send-queue"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "approval index and send queue acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue"
    last_updated_at: "2026-11-26T06:00:00Z"
    last_updated_by: "wo-09-writer"
    recent_action: "Authored the acceptance criteria"
    next_safe_action: "Run each block and mark the rows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-004-approval-queue"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: approval-index-and-send-queue

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue
**Level:** 2
**Status:** Draft
**Date:** 2026-11-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

AC ids follow their requirement, AC-NNN checks REQ-NNN and keep the pre-expansion numbers. Every command runs from the repository root with no tty, no token and no network. A command that writes state runs on the temporary state root of `../003-link-roster-and-answer-gate/tasks.md` Task Notation.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-006 | REQ-006 | Given a queued prompt drained once, When the process restarts and a press carrying `approval-v1:<item-id>:2` arrives, Then the item is answered with its second option and one resume request is queued, a press after `expiresAt` is refused `item-expired` with M15 and the entry is removed, a press from a group conversation is refused `channel-group-approval` with M16, a fatigue item has no entry and a press for an item with no entry falls through to `answerItem` and returns the existing answered row | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-approval.vitest.ts -t "^bots channel approval resolves a press after a restart$")` prints `Tests  1 passed`, `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-approval.vitest.ts -t "^bots channel approval refuses a press after expiresAt$")` prints `Tests  1 passed`, `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-approval.vitest.ts -t "^bots channel approval refuses a press from a group$")` prints `Tests  1 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-approval.vitest.ts -t "^bots channel approval falls through to answerItem when the item has no entry$")` prints `Tests  1 passed` | Unmet | - |
| AC-008 | REQ-008 | Given an open prompt on the fake transport without buttons, When `2`, `yes`, `Y`, `no`, `N`, `7` and `hello` are sent, Then each row of the grammar applies, a `no` or `N` records `deny` on the item's grant, `7` replies M20 and keeps the prompt open and `hello` is a chat message. Given one prompt whose queue entry is still `queued` and one that is `delivered`, When `1` is sent, Then the delivered prompt is answered. Given two delivered prompts open in one conversation, When `1` or `YES` is sent, Then neither is answered and the reply is M23 naming both item ids | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-approval.vitest.ts -t "^bots channel approval applies the reply grammar$")` prints `Tests  1 passed`, `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-approval.vitest.ts -t "^bots channel approval answers only a delivered prompt$")` prints `Tests  1 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-approval.vitest.ts -t "^bots channel approval answers nothing when two delivered prompts are open$")` prints `Tests  1 passed` | Unmet | - |
| AC-013 | REQ-013 | Given a fake transport that reports an uncertain result, When one drain runs, Then the queue file existed before the call, its state is `unknown`, the run record's delivery entry reads `unknown`, the drain printed M21 and a second drain sends nothing, a `sending` entry found at start becomes `unknown` and a retryable failure waits 0, 5, 25, 120 and 600 s or the provider's longer wait | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts -t "^bots channel queue records an uncertain send as unknown$")` prints `Tests  1 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts -t "^bots channel queue waits the backoff ladder$")` prints `Tests  1 passed` | Unmet | - |
| AC-016 | REQ-016 | Given a bot whose delivery target is `telegram:81234567`, When its run parks a question, Then one delivery entry carries the item id and one queue entry `notice-<runId>-telegram` is `queued`. Given a request whose reply target is `telegram:81234567` and a bot definition that names no delivery target, When its run parks a question, Then the prompt is queued for that conversation and the run record's delivery entry reads `queued` until the drain writes the terminal state | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts -t "^bots channel queue queues a prompt for the channel that asked$")` prints `Tests  1 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts -t "^bots channel queue queues a prompt for the request's reply target$")` prints `Tests  1 passed` | Unmet | - |
| AC-019 | REQ-019 | Given a temporary state root with two config entries, one enabled with one linked chat and one queued send, When `bots channel list --json` runs, Then it prints `version` 1 and both channels sorted by name with `enabled`, `secret`, `linkedChats` and `queueDepth`, and given an index whose `notApprover` names one actor with two failures, Then the human output prints `notApprover <actor> 2` and `--json` carries no such key | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-channel.vitest.ts -t "^bots channel list lists both channels$")` prints `Tests  1 passed` | Unmet | - |
| AC-028 | REQ-028 | Given an item whose second option holds a stored secret value, When the run parks, Then no queue entry is written and the delivery entry records the withheld evidence and given a clean item on a channel whose capability says `buttons: yes` the queued text is the M02 button form while on a channel without buttons it is the M01 text form, and the literal check runs over the text form either way | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts -t "^bots channel queue withholds a prompt whose option holds a secret$")` prints `Tests  1 passed`, `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts -t "^bots channel queue queues the button form on a buttons channel$")` prints `Tests  1 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts -t "^bots channel queue queues the text form otherwise$")` prints `Tests  1 passed` | Unmet | - |
| AC-034 | REQ-034 | Given a linked conversation, When `bots channel send telegram 81234567 hello` runs twice within a minute, Then one entry `send-<hash>` is written and sent once, an unlinked conversation is refused `channel-unlinked` with exit 4, `bots channel drain` with one failed due entry exits 1 and a drain refused `channel-daemon-unreachable` exits 4. The test calls the in-process verb function `runChannelVerb(argv, transports)` with a fake transport table rather than spawning `bots.cjs`, because a spawned process cannot be handed a fake transport, and child 005 creates the table it passes | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-channel.vitest.ts -t "^bots channel send sends one entry twice within a minute$")` prints `Tests  1 passed`, `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-channel.vitest.ts -t "^bots channel drain exits 1 when a due entry failed$")` prints `Tests  1 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-channel.vitest.ts -t "^bots channel drain exits 4 when the drain is refused$")` prints `Tests  1 passed` | Unmet | - |

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

Every row is unmet until the code lands and each command prints what its row says.
<!-- /ANCHOR:closure -->
