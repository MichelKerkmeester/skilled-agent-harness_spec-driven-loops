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
| AC-001 | REQ-001 | Given a BOT.md carrying `routine` with `what`, one cron `starts` entry, `does: act` and no `until`, When `parseDefinition` reads it, Then the definition carries the block and a `trigger` equal to `starts[0]`, and the installer builds the same plist it builds for the equivalent `trigger` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/definition.vitest.ts -t 'routine'` exits 0, and `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean` exits 0 | Unmet | - |
| AC-002 | REQ-002 | Given a BOT.md carrying both `routine` and `trigger`, When the checker reads it, Then it exits 1 and prints `FAIL: routine-trigger-conflict` | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-trigger-conflict` exits 1 and prints `FAIL: routine-trigger-conflict` | Unmet | - |
| AC-003 | REQ-003 | Given `does: tell` with no `delivery` key, When the definition parses, Then delivery is `local-only`; and given `does: tell` beside a `delivery` key, When the checker reads it, Then it exits 1 and prints `FAIL: routine-tell-with-targets` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine.vitest.ts -t 'routineDelivery'` exits 0, and `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-tell-with-targets` exits 1 | Unmet | - |
| AC-004 | REQ-004 | Given a routine bot whose `until_check` exits 0, When a run completes, Then the run record carries `until.met: true`, the routine state file carries `untilMetAt`, and the `completed` switch is set; and given an `until_check` that exits 1, times out or cannot spawn, Then the record carries `until.met: false` and no switch is set; and given a bot bound to no checkout, Then the check runs in the identity's state root | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts -t 'until'` exits 0, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine-state.vitest.ts -t 'until'` exits 0, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t 'routines'` exits 0 | Unmet | - |
| AC-005 | REQ-005 | Given a cron start of `*/5 * * * *`, When the checker and the installer each read it, Then each refuses `routine-floor-15-minutes` and no plist is written; and given `0 9 * * 1-5`, Then both accept it; and given a slot missed while the machine slept, Then the slot is skipped, never caught up, and the skip is recorded on the slot snapshot | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-floor` exits 1 and prints `FAIL: routine-floor-15-minutes`, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/installer.vitest.ts -t 'floor'` exits 0, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/slot-accounting.vitest.ts -t 'skipped'` exits 0 | Unmet | - |
| AC-006 | REQ-006 | Given ten consecutive failed runs for one bot, When the tenth failure is recorded, Then the `disabled` switch is set, the routine state file records `fatiguedAt` and the item id, and exactly one needs-you item exists whose `botId` is that bot and whose `runId` is the tenth failed run's id; and given a parked run or a run refused before dispatch between two failures, Then neither is counted, because a failed run needs a non-null `exit.class`, no `exit.refusal` and a reason other than `awaiting-decision`, and the streak stops there; and given a run refused by that switch, Then it is refused `routine-fatigued`; and given `bots enable`, Then the switch is cleared, the item is answered through `answerItem` with its no-resume option and the fixed text `enabled`, so its derived state is `answered`, it holds nothing and no resume is queued, the fatigue record is cleared and the streak restarts at zero; and given a completed run, Then the streak resets to zero | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine-state.vitest.ts -t 'fatigue'` exits 0, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts -t 'fatigue'` exits 0, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t 'fatigue'` exits 0, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t 'no resume'` exits 0, and `rg -c 'input.resume' .skilled/skills/system-skilled-bots/runtime/lib/answer.ts` prints at least 1 | Unmet | - |
| AC-007 | REQ-007 | Given a checkout holding two routine bots and one bot with no `routine` block, When `bots routines` runs, Then it prints two rows with `botId`, the start summary, `does`, `until`, `untilMetAt`, `switch` and `streak`, and exits 0; and with `--json`, Then it prints one object with `version` and `routines`, the two rows sorted by `botId`, each carrying every key `003-terminal-screen/002-architecture-and-contracts/design/contracts.md` section 7 names, and every key in `003-terminal-screen/002-architecture-and-contracts/design/payloads/routines.json` appears with the same JSON type | `node .skilled/bin/bots.cjs routines --repo .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean` exits 0 and prints two rows, and `T=$(mktemp -d) && cp -R .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean "$T/checkout" && XDG_STATE_HOME="$T/state" node .skilled/bin/bots.cjs routines --json --repo "$T/checkout" \| jq -e '.version == 1 and (.routines \| length == 2) and (.routines[0].botId != null)'` exits 0, and `rg -c '^\| `botId`' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/records.md` prints 2 | Unmet | - |
| AC-008 | REQ-008 | Given a `routine` block with `starts: []`, When the checker reads it, Then it exits 1 and prints `FAIL: routine-starts-empty` | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-empty` exits 1 and prints `FAIL: routine-starts-empty` | Unmet | - |
| AC-009 | REQ-009 | Given two cron entries in `starts`, When the checker reads it, Then it exits 1 and prints `FAIL: routine-starts-multiple-cron`; and given one cron entry at index 1, Then it exits 1 and prints `FAIL: routine-starts-cron-not-first`; and given a cron entry plus a queue entry, Then it exits 1 and prints `FAIL: routine-starts-multiple` | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-multiple-cron` exits 1, and `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-cron-not-first` exits 1, and `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-multiple` exits 1 and prints `FAIL: routine-starts-multiple` | Unmet | - |
| AC-010 | REQ-010 | Given the shipped template, the author reference and the status mode, When each is read, Then the template carries a commented `routine` block, the reference names `routine` in its field list, and the status mode names `bots routines` | `rg -c 'routine' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints 1, `rg -c 'routine' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints at least 1, and `rg -c 'bots routines' .skilled/skills/system-skilled-bots/bots-status/SKILL.md` prints at least 1 | Unmet | - |
| AC-011 | REQ-011 | Given a routine with `until` and no `until_check`, When a run completes, Then no `completed` switch is set; and given `until_check` with no `until`, Then the checker exits 1 and prints `FAIL: routine-until-check-without-outcome`; and given an `until` holding a shell metacharacter, Then the checker exits 1 and prints `FAIL: routine-until-shell-metacharacters` | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-until-check-without-outcome` exits 1 and prints `FAIL: routine-until-check-without-outcome`, and `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-until-shell-metacharacters` exits 1 and prints `FAIL: routine-until-shell-metacharacters`, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine.vitest.ts -t 'until'` exits 0 | Unmet | - |
| AC-012 | REQ-006 | Given a bot with ten consecutive failed runs and a `bots enable` that wrote `enabledAt`, When the next run fails, Then the streak is 1 and not 11, because only runs whose `dispatch.dispatchedAt` is later than `enabledAt` count; and given a bot that was never re-enabled, Then `enabledAt` is null and every run counts | `rg -c '^\| `enabledAt` \| string' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/records.md` prints 1, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine-state.vitest.ts -t 'enabledAt'` exits 0 | Unmet | - |
| AC-013 | REQ-006 | Given a stop after the fatigue item write, When the next failed run evaluates the rule, Then the item is rewritten with the same id, `fatiguedAt` is written and the `disabled` switch is set, and exactly one item exists; and given a stop after the fatigue state file write, Then the next failed run sets the switch and no second item exists; and given a stop after the enable's answer write, Then a second `bots enable` writes the derived `resumeRequestId`, the state file and the switch | `rg -c '^\| [1-4] \| [^|]* \| [^|]* \| [^|]* \| [^|]* \|$' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/state-machines.md` prints 4, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine-state.vitest.ts -t 'interrupted'` exits 0 | Unmet | - |

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

No criterion is met yet, because this packet is the specification and no code has been written. AC-001 is the first that must be met, since every other row reads the definition it produces. AC-011 is the second, because the `until`/`until_check` split decides what AC-004 measures. AC-013 is the third, because the write order it proves is what makes AC-006's recovery safe to repeat.
<!-- /ANCHOR:closure -->
