---
title: "Acceptance Criteria: Phase 2: routine-layer"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "routine layer acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/002-routine-layer"
    last_updated_at: "2026-11-25T07:13:38Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-routine-layer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: routine-layer

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/002-routine-layer
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`R` is `.skilled/skills/system-skilled-bots/runtime` and `F` is `.skilled/skills/system-skilled-bots/scripts/fixtures`, as in `tasks.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a BOT.md carrying `routine` with `what`, one cron `starts` entry, `does: act` and no `until`, When `parseDefinition` reads it, Then the definition carries the block and a `trigger` equal to `starts[0]`, and the installer builds the same plist it builds for the equivalent `trigger` | `cd $R && npx vitest run tests/definition.vitest.ts -t 'routine'` exits 0, and `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-clean` exits 0 | Unmet | - |
| AC-002 | REQ-002 | Given a BOT.md carrying both `routine` and `trigger`, When the checker reads it, Then it exits 1 and prints `FAIL: routine-trigger-conflict` | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-trigger-conflict` exits 1 and prints `FAIL: routine-trigger-conflict` | Unmet | - |
| AC-003 | REQ-003 | Given `does: tell` with no `delivery` key, When the definition parses, Then delivery is `local-only`; and given `does: tell` beside a `delivery` key, When the checker reads it, Then it exits 1 and prints `FAIL: routine-tell-with-targets` | `cd $R && npx vitest run tests/routine.vitest.ts -t 'routineDelivery'` exits 0, and `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-tell-with-targets` exits 1 | Unmet | - |
| AC-004 | REQ-004 | Given a routine bot whose `until` exits 0, When a run completes, Then the run record carries `until.met: true`, the routine state file carries `untilMetAt`, and the `completed` switch is set; and given an `until` that exits 1, times out or cannot spawn, Then the record carries `until.met: false` and no switch is set | `cd $R && npx vitest run tests/runner.vitest.ts -t 'until'` exits 0, and `node .skilled/bin/bots.cjs routines --repo $F/routine-clean` prints a non-empty `untilMetAt` | Unmet | - |
| AC-005 | REQ-005 | Given a cron start of `*/5 * * * *`, When the checker and the installer each read it, Then each refuses `routine-floor-15-minutes` and no plist is written; and given `0 9 * * 1-5`, Then both accept it | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-floor` exits 1 and prints `FAIL: routine-floor-15-minutes`, and `cd $R && npx vitest run tests/installer.vitest.ts -t 'floor'` exits 0 | Unmet | - |
| AC-006 | REQ-006 | Given ten consecutive failed runs for one bot, When the tenth failure is recorded, Then the `disabled` switch is set with reason `failure-streak` and exactly one needs-you item exists; and given `bots enable`, Then the switch is cleared and the streak restarts at zero | `cd $R && npx vitest run tests/routine-state.vitest.ts -t 'fatigue'` exits 0, and `node .skilled/bin/bots.cjs inbox` lists exactly one item for that bot | Unmet | - |
| AC-007 | REQ-007 | Given a checkout holding two routine bots and one bot with no `routine` block, When `bots routines` runs, Then it prints two rows with `what`, rendered starts, `does`, `until`, `untilMetAt` and switch state, and exits 0; and with `--json`, Then the same two rows parse as JSON | `node .skilled/bin/bots.cjs routines --repo $F/routine-clean` exits 0 and prints two rows, and `node .skilled/bin/bots.cjs routines --json --repo $F/routine-clean \| jq -e 'length == 2'` exits 0 | Unmet | - |
| AC-008 | REQ-008 | Given a `routine` block with `starts: []`, When the checker reads it, Then it exits 1 and prints `FAIL: routine-starts-empty` | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-starts-empty` exits 1 and prints `FAIL: routine-starts-empty` | Unmet | - |
| AC-009 | REQ-009 | Given two cron entries in `starts`, When the checker reads it, Then it exits 1 and prints `FAIL: routine-starts-multiple-cron`; and given one cron entry at index 1, Then it exits 1 and prints `FAIL: routine-starts-cron-not-first` | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-starts-multiple-cron` exits 1, and `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-starts-cron-not-first` exits 1 | Unmet | - |
| AC-010 | REQ-010 | Given the shipped template, the author reference and the status mode, When each is read, Then the template carries a commented `routine` block, the reference names `routine` in its field list, and the status mode names `bots routines` | `rg -c 'routine' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints 1, `rg -c 'routine' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints at least 1, and `rg -c 'bots routines' .skilled/skills/system-skilled-bots/bots-status/SKILL.md` prints at least 1 | Unmet | - |

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

No criterion is met yet, because this packet is the specification and no code has been written. AC-001 is the first that must be met, since every other row reads the definition it produces.
<!-- /ANCHOR:closure -->
