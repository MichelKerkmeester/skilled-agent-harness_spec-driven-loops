---
title: "Acceptance Criteria: Phase 1: activity-and-actor"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "activity and actor acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/001-activity-and-actor"
    last_updated_at: "2026-11-25T07:13:38Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-activity-and-actor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: activity-and-actor

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/001-activity-and-actor
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
| AC-001 | REQ-001 | Given a state root holding one open item, one running run and one completed run, When `bots activity` runs, Then it prints the groups `needs_you`, `working` and `done` in that order and prints no group holding nothing | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/activity.vitest.ts -t "order"` prints one passing test | Unmet | - |
| AC-002 | REQ-002 | Given the same state root, When `bots activity --json` runs, Then it prints one JSON object whose `groups` array carries each group's `id`, `title` and `rows` | `node .skilled/bin/bots.cjs activity --json \| jq -r '.groups[].id'` prints the group ids in order | Unmet | - |
| AC-003 | REQ-003 | Given one open needs-you item, When `bots inbox --json` runs, Then it prints one JSON object whose `items` array carries that item's id, bot, state, question, options, timestamps and answer | `node .skilled/bin/bots.cjs inbox --json \| jq -r '.items[0].id'` prints the item id | Unmet | - |
| AC-004 | REQ-004 | Given an open needs-you item, When `bots answer <item-id> yes --as ada` runs, Then the item's answer carries `"by": "ada"`, and the same answer with no `--as` carries the OS user's name | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "by"` prints one passing test | Unmet | - |
| AC-005 | REQ-005 | Given a bot installed by one operator and fired by launchd, When the run record is written, Then its `actor` is that operator's name, and an interactive run's `actor` is the OS user | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/actor.vitest.ts -t "pinned"` prints one passing test | Unmet | - |
| AC-006 | REQ-006 | Given the two lifted OpenBot files, When `THIRD_PARTY_NOTICES.md` is read, Then it names both source paths, OpenBot's MIT licence and its copyright line | `rg -n "activity-groups.ts\|activity-rows.ts" THIRD_PARTY_NOTICES.md` prints two lines | Unmet | - |
| AC-007 | REQ-007 | Given a run record carrying an actor, When the status index is built, Then the run row carries that actor and `bots activity` prints it without opening the record | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/status-index.vitest.ts -t "actor"` prints one passing test | Unmet | - |

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

AC-001 is unmet, and no code has been written yet, so every criterion is open.
<!-- /ANCHOR:closure -->
