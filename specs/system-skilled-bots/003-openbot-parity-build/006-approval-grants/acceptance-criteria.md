---
title: "Acceptance Criteria: Phase 6: approval-grants"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
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
| AC-001 | REQ-001 | Given a parked run whose question names a delete, When the item is read, Then its `grants` carries `kind: "delete"`, the whole question clipped to 120 characters as `action`, `rung: "kind"`, `scope: null`, `grantedBy: null` and `grantedAt: null` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/needs-you.vitest.ts -t "^needs-you item writes the grant a parked question classifies$"` prints `Tests  1 passed` Observed 2026-11-27 on the final tree: `Tests  1 passed`. | Met | - |
| AC-002 | REQ-002 | Given the question `pay the invoice and delete the receipt`, When `classifyAction` runs, Then it returns `pay`, and `I will tidy the notes. Delete the production database?` returns `delete` rather than `other` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/action-kind.vitest.ts -t "^classifyAction tests the six kinds in the plan's order$"` prints `Tests  1 passed` Observed 2026-11-27 on the final tree: `Tests  1 passed`. | Met | - |
| AC-003 | REQ-003 | Given a question naming a kind, When `decideApproval` runs, Then it returns `rung: "kind"`. Given a question naming no kind, Then it returns `rung: "bot"`. No input returns `rule`, `auto-review` or `extra-vigilant` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/approval-ladder.vitest.ts -t "^decideApproval first answer wins$"` prints `Tests  1 passed` Observed 2026-11-27 on the final tree: `Tests  1 passed`. | Met | - |
| AC-004 | REQ-004 | Given a child that prints `[NEEDS-DECISION] delete the stale branch?`, When the run parks, Then the item file carries a `grants` object naming `delete` and `kind`, and every item writer this phase can see, which is the gate, the answer, the resume stamp, the memory-proposal branch 005 lands and the fatigue item 002 raises in `routine-state.ts`'s `evaluateFatigue`, carries the grant it read | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts -t "^needs-you decisions writes the grant from the parked question$"` prints `Tests  1 passed` Observed 2026-11-27 on the final tree: `Tests  1 passed`. | Met | - |
| AC-005 | REQ-005 | Given an open item, When `bots answer <item-id> yes --scope deny` runs, Then the item's `grants.scope` reads `deny` with `grantedBy` and `grantedAt` set, the same answer with no `--scope` reads `once`, a NO, `no` or `n`, with no `--scope` reads `deny`, and a NO with `--scope once` reads `deny` too | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer records the scope the answer grants$"` prints `Tests  1 passed` Observed 2026-11-27 on the final tree: `Tests  1 passed`. | Met | - |
| AC-006 | REQ-006 | Given an open item, When `bots answer <item-id> yes --scope always` or `--scope conversation` runs, Then it exits 2 with `bots: grant-scope-unsupported`, and `--scope once` and `--scope deny` on the same item succeed | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "^bots answer --scope grant-scope-unsupported$"` prints `Tests  1 passed` Observed 2026-11-27 on the final tree: `Tests  1 passed`. | Met | - |
| AC-007 | REQ-007 | Given one open item carrying a grant, seeded into a temporary state root, When `bots inbox` runs, Then the item's line carries its kind, its rung and its scope with `-` for an ungranted scope, and `bots inbox --json` carries the same `grants` object on that item's row | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "^bots inbox prints the grant on the item line and its json row$"` prints `Tests  1 passed`: the test writes the item with `writeNeedsYouItem` into the root `botWorld()` gives and runs both forms through `runCli`, so no live state root is read Observed 2026-11-27 on the final tree: `Tests  1 passed`. | Met | - |
| AC-008 | REQ-008 | Given an item file written before this phase with no `grants` key, When it is read, Then it validates with `grants: null` and `bots inbox` still lists it | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/needs-you.vitest.ts -t "^needs-you item reads an item written before this phase$"` prints `Tests  1 passed` Observed 2026-11-27 on the final tree: `Tests  1 passed`. | Met | - |
| AC-009 | REQ-009 | Given the ladder doc, When it is read, Then it names the four rungs in OpenBot's order, the first-answer-wins rule, the strictest-rule rule within rung 2 and the two scopes and marks rungs 2 to 4 not implemented in this phase | `rg -n "first answer wins" .skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md` prints the rule, and `rg -n "not implemented in this phase" .skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md` prints the note Observed 2026-11-27 on the final tree: the first grep prints line 21, `The first answer wins: a kind beats a rule and a rule beats auto-review.`, and the second prints lines 49 to 51 and 78. | Met | - |
| AC-010 | REQ-010 | Given the classifier, When `THIRD_PARTY_NOTICES.md` is read, Then it holds no `## 006-approval-grants` section and names no `tool-name.ts` | `rg -c "tool-name.ts|## 006-approval-grants" .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints nothing and exits 1 Observed 2026-11-27 on the final tree: the grep prints nothing and exits 1. | Met | - |
| AC-011 | REQ-011 | Given an answered item whose grant scope is `deny`, When the resumed prompt is built, Then it names that scope and ends with the two declined-action lines, equal to `design/fixtures/resumed-prompt.txt`, and holds no `Continue the work` line. Given a grant whose scope is `once`, Then the closing `Continue the work` line stays. Given an item with no grant, Then no line is added | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/needs-you.vitest.ts -t "^needs-you item names the granted scope in the resumed prompt$"` prints `Tests  1 passed` Observed 2026-11-27 on the final tree: `Tests  1 passed`. | Met | - |
| AC-012 | REQ-012 | Given a question carrying `[ACTION: pay]` and no payment word, When the gate classifies it, Then the grant reads `kind: "pay"`. Given `[ACTION: other]` on a question that names a delete, Then the grant reads `delete`, because the stricter of the declared and the classified kind wins. Given `[ACTION: transfer]`, Then the item is refused `action-kind-invalid` and not written | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/action-kind.vitest.ts -t "^the ACTION line takes the declared kind as a floor$"` prints `Tests  1 passed` Observed 2026-11-27 on the final tree: `Tests  1 passed`. | Met | - |
| AC-013 | REQ-013 | Given an item answered `yes --scope once`, When `bots answer <item-id> yes --scope deny` runs, Then it exits 4 with `bots: item-answered-differently` and the recorded scope stays `once` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer refuses a second answer with another scope$"` prints `Tests  1 passed` Observed 2026-11-27 on the final tree: `Tests  1 passed`. | Met | - |
| AC-014 | REQ-014 | Given one open item and two answers that both read `open`, When both write, Then one lands, the other is refused `item-answered-differently` and the item holds the first answer's text and scope | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer two answers one lands$"` prints `Tests  1 passed` Observed 2026-11-27 on the final tree: `Tests  1 passed`. | Met | - |
| AC-015 | REQ-005 | Given an answered item whose grant names a scope and an actor, When the resumed run's record is read, Then it carries one line naming the item id, the kind, the scope and the actor, and a run with no grant carries none | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts -t "^needs-you decisions carries one grant line on the resumed record$"` prints `Tests  1 passed` Observed 2026-11-27 on the final tree: `Tests  1 passed`. | Met | - |
| AC-016 | REQ-004 | Given 002's fatigue item open on a bot, When `bots enable <bot-id>` runs, Then the item is answered through `answerItem` with its no-resume option, its `grants` carries the kind, the rung, the scope and the actor, and no resume request is queued. When `bots answer <item-id> enabled` answers the same item instead, Then the grant is recorded and a resume request is queued, and When `bots enable <bot-id>` then runs before the next drain, Then that queued resume is dropped and the tenth failed run is never dispatched, while a drain that runs before `bots enable` refuses the run `routine-fatigued` because the switch is still set | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "^bots enable "` prints `Tests  3 passed`, one each for `answers the fatigue item with a grant and no resume`, `drops a queued resume before the next drain` and `refuses the run routine-fatigued before enable` Observed 2026-11-27 on the final tree: `Tests  3 passed | 20 skipped (23)`. | Met | - |
| AC-017 | REQ-014 | Given an open item and a lock file beside it naming a pid that is no longer alive, When `bots answer <item-id> yes --scope once` runs, Then the lock is reclaimed by rename, the answer lands and the item's `grants.scope` reads `once` and the answer is not refused `item-busy`. Given a lock file whose owner pid is alive and whose `createdAt` is under 60 seconds old, When the wait runs past 2,000 ms, Then the answer is refused `item-busy` with the holder's pid and the lock's instant | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer a stale lock does not block the next answer$"` prints `Tests  1 passed` Observed 2026-11-27 on the final tree: `Tests  1 passed`. | Met | - |

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

Every row is Met. Each Verification command was run verbatim on the final tree on 2026-11-27, and the whole runtime suite printed 43 files and 548 tests passed against the floor of 41 files and 519. AC-004 and AC-016 both rest on REQ-004 because the gate's grant and the fatigue answer's grant are written by different writers. AC-005 and AC-015 both rest on REQ-005 because the scope an answer records and the line the resumed record carries fail separately. AC-014 and AC-017 both rest on REQ-014 because a race between two live answers and a lock a killed process left behind are different faults of the same lock.
<!-- /ANCHOR:closure -->
