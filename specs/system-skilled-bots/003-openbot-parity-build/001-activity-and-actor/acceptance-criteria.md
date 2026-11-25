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
| AC-002 | REQ-002 | Given the same state root, When `bots activity --json` runs, Then it prints one JSON object whose `groups` array carries each group's `id`, `title` and `rows`, and each row carries `botId`, `identity`, `state`, `at`, `actor` and `runId`, where `state` is one of the seven group ids | `node .skilled/bin/bots.cjs activity --json \| jq -r '.groups[].id'` prints the group ids in order, and `jq -r '.groups[].rows[] \| keys \| join(",")'` prints the six row keys | Unmet | - |
| AC-003 | REQ-003 | Given one open needs-you item, When `bots inbox --json` runs, Then it prints one JSON object whose `items` array carries that item's `id`, `botId`, `kind`, `question`, `state`, `at`, `options`, `createdAt`, `expiresAt` and `answer`, where `kind` is `null` until 005-memory writes a value | `node .skilled/bin/bots.cjs inbox --json \| jq -r '.items[0].id'` prints the item id, and `jq -r '.items[0] \| keys \| join(",")'` prints the ten keys | Unmet | - |
| AC-004 | REQ-004 | Given an open needs-you item, When `bots answer <item-id> yes --as ada` runs from a tty, or `answerItem` is called with `ada` and no tty, Then the item's answer carries `"by": "ada"`, and the same answer with no `--as` carries the OS user's name; `Ada` and `ada` are different actors | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "by"` prints one passing test | Unmet | - |
| AC-005 | REQ-005 | Given a bot installed by one operator and fired by launchd, When the run record is written, Then its `actor` is that operator's name, and an interactive run's `actor` is the OS user; a run requested by one person and answered by another carries `actor` for the requester and `answeredBy` for the approver | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/actor.vitest.ts -t "pinned"` prints one passing test | Unmet | - |
| AC-006 | REQ-006 | Given the two lifted OpenBot files, When `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` is read, Then it names both source paths, OpenBot's MIT licence and its copyright line | `rg -n "activity-groups.ts\|activity-rows.ts" .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints two lines | Unmet | - |
| AC-007 | REQ-007 | Given a run record carrying an actor, When the status index is built, Then the run row's `summary` JSON carries that actor and `bots activity` prints it without opening the record, and a write into an index built by the old DDL succeeds with no `ALTER TABLE` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/status-index.vitest.ts -t "actor"` prints one passing test, and `npx vitest run tests/status-index.vitest.ts -t "old-ddl"` prints one passing test | Unmet | - |
| AC-008 | REQ-008 | Given a script with stdin not a tty, When `bots answer <item-id> yes --as ada` runs and `ada` is not the OS user, Then it exits 2 with `bots: --as needs a tty` and the item stays open, while `answerItem` called with an explicit actor writes the answer with no tty | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "tty"` prints one passing test, and `npx vitest run tests/answer.vitest.ts -t "explicit actor"` prints one passing test | Unmet | - |
| AC-009 | REQ-009 | Given a definition declaring `danger-full-access` on a bot installed without full access, When the run dispatches, Then its `posture.sandbox` is `workspace-write`, and the same definition on a bot installed with full access dispatches at `danger-full-access` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/posture.vitest.ts -t "cap"` prints one passing test | Unmet | - |
| AC-010 | REQ-010 | Given an open needs-you item, When `bots answer <item-id> yes --scope deny` runs, Then the item's answer carries `"scope": "deny"`, the same answer with no `--scope` carries `"scope": "once"`, `--scope always` exits 2 with `bots: grant-scope-unsupported`, and `--scope sometimes` exits 2 with `bots: --scope takes once or deny` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "scope"` prints one passing test, and `node .skilled/bin/bots.cjs answer item-1 yes --scope always` prints `bots: grant-scope-unsupported` | Unmet | - |
| AC-011 | REQ-003 | Given one open item and one answered item, When `bots inbox --json --all` runs, Then the answered item appears with `state` `answered` and its `answer.by`, while the default `bots inbox --json` leaves it out, so a reader sees who answered it without opening the item file | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "answered item"` prints one passing test | Unmet | - |

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
