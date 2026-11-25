---
title: "Acceptance Criteria: Phase 6: approval-grants"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "approval grants acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/006-approval-grants"
    last_updated_at: "2026-11-25T07:13:41Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-approval-grants"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: approval-grants

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/006-approval-grants
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
| AC-001 | REQ-001 | Given a parked run whose question names a delete, When the item is read, Then its `grants` carries `kind: "delete"`, the question's first sentence as `action`, `rung: "kind"` and `scope: null` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/needs-you.vitest.ts -t "grants"` prints one passing test | Unmet | - |
| AC-002 | REQ-002 | Given the name `pay the invoice and send the receipt`, When `classifyAction` runs, Then it returns `pay`, and `send the receipt` alone returns `send` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/action-kind.vitest.ts -t "order"` prints one passing test | Unmet | - |
| AC-003 | REQ-003 | Given a kind that asks and a rule that allows, When `decideApproval` runs, Then it returns `rung: "kind"`; given no kind and a rule that asks with auto-review off, Then it returns `rung: "rule"`; and auto-review beats extra vigilant the same way | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/approval-ladder.vitest.ts -t "first answer wins"` prints one passing test | Unmet | - |
| AC-004 | REQ-004 | Given a child that prints `[NEEDS-DECISION] delete the stale branch?`, When the run parks, Then the item file carries a `grants` object naming `delete` and `kind` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts -t "grant"` prints one passing test | Unmet | - |
| AC-005 | REQ-005 | Given an open item, When `bots answer <item-id> yes --scope always` runs, Then the item's `grants.scope` reads `always`, and the same answer with no `--scope` reads `once` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "scope"` prints one passing test | Unmet | - |
| AC-006 | REQ-006 | Given an item whose `grants.kind` is `other`, When `bots answer <item-id> yes --scope always` runs, Then it exits 2 with `bots: grant-kind-unknown`, and `--scope once` on the same item succeeds | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "grant-kind-unknown"` prints one passing test | Unmet | - |
| AC-007 | REQ-007 | Given one open item carrying a grant, When `bots inbox` runs, Then the item's line carries its kind, its rung and its scope, and an ungranted scope prints `-` | `node .skilled/bin/bots.cjs inbox` prints one line per item carrying `delete` and `kind` | Unmet | - |
| AC-008 | REQ-008 | Given an item file written before this phase with no `grants` key, When it is read, Then it validates with `grants: null` and `bots inbox` still lists it | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/needs-you.vitest.ts -t "before this phase"` prints one passing test | Unmet | - |
| AC-009 | REQ-009 | Given the ladder doc, When it is read, Then it names the four rungs in OpenBot's order, the first-answer-wins rule, the strictest-rule rule within rung 2, and the four answers | `rg -n "first answer wins" .skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md` prints the rule | Unmet | - |
| AC-010 | REQ-010 | Given the lifted classifier, When `THIRD_PARTY_NOTICES.md` is read, Then it names `shared/tool-name.ts`, OpenBot's MIT licence and its copyright line | `rg -n "tool-name.ts" THIRD_PARTY_NOTICES.md` prints the entry | Unmet | - |
| AC-011 | REQ-011 | Given an answered item whose grant scope is `always`, When the resumed prompt is built, Then it names that scope, and an item with no grant adds no line | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/needs-you.vitest.ts -t "resumed"` prints one passing test | Unmet | - |

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
