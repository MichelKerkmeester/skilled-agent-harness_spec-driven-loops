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
| AC-006 | REQ-006 | Given a queued prompt drained once, When the process restarts and a press carrying `approval-v1:<item-id>:2` arrives, Then the item is answered with its second option and one resume request is queued, a press after `expiresAt` is refused `item-expired` with M15 and the entry is removed, a press from a group conversation is refused `channel-group-approval` with M16 and a fatigue item has no entry | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-approval.vitest.ts -t "restart"`, `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-approval.vitest.ts -t "expired"` and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-approval.vitest.ts -t "group"` each print one passing test | Unmet | - |
| AC-008 | REQ-008 | Given an open prompt on the fake transport without buttons, When `2`, `yes`, `Y`, `no`, `N`, `7` and `hello` are sent, Then each row of the grammar applies, a `no` or `N` records `deny` on the item's grant, `7` replies M20 and keeps the prompt open and `hello` is a chat message | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-approval.vitest.ts -t "grammar"` prints one passing test | Unmet | - |
| AC-013 | REQ-013 | Given a fake transport that reports an uncertain result, When one drain runs, Then the queue file existed before the call, its state is `unknown`, the run record's delivery entry reads `unknown`, the drain printed M21 and a second drain sends nothing, a `sending` entry found at start becomes `unknown` and a retryable failure waits 0, 5, 25, 120 and 600 s or the provider's longer wait | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts -t "unknown"` and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts -t "backoff"` each print one passing test | Unmet | - |
| AC-016 | REQ-016 | Given a bot whose delivery target is `telegram:81234567`, When its run parks a question, Then one delivery entry carries the item id and one queue entry `notice-<runId>-telegram` is `queued` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts -t "delivery"` prints one passing test | Unmet | - |
| AC-019 | REQ-019 | Given a temporary state root with two config entries, one enabled with one linked chat and one queued send, When `bots channel list --json` runs, Then it prints `version` 1 and both channels sorted by name with `enabled`, `secret`, `linkedChats` and `queueDepth` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-channel.vitest.ts -t "list"` prints one passing test | Unmet | - |
| AC-028 | REQ-028 | Given an item whose second option holds a stored secret value, When the run parks, Then no queue entry is written and the delivery entry records the withheld evidence and given a clean item the queued text ends with the M01 choice block | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts -t "withheld"` prints one passing test | Unmet | - |
| AC-034 | REQ-034 | Given a linked conversation, When `bots channel send telegram 81234567 hello` runs twice within a minute, Then one entry `send-<hash>` is written and sent once, an unlinked conversation is refused `channel-unlinked` with exit 4 and `bots channel drain` with one failed due entry exits 1 | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-channel.vitest.ts -t "send"` and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-channel.vitest.ts -t "drain"` each print one passing test | Unmet | - |

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
