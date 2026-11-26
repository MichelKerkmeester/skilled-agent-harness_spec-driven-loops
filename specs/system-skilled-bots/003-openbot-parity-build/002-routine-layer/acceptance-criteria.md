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

`R` is `.skilled/skills/system-skilled-bots/runtime`, `F` is `.skilled/skills/system-skilled-bots/scripts/fixtures` and `S` is a fresh `mktemp -d` folder holding a copy of `$F/routine-clean` at `$S/checkout`, as in `tasks.md`. A vitest filter is anchored `^<full name>$` and states its pass count, and a `bots.cjs` command that reads or writes state passes `--repo "$S/checkout"`, per `contracts/verification.md` V1, V2 and V10.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a BOT.md carrying `routine` with `what`, one cron `starts` entry, `does: act` and no `until`, When `parseDefinition` reads it, Then the definition carries the block and a `trigger` equal to `starts[0]`, and the installer builds the same plist it builds for the equivalent `trigger` | `(cd $R && npx vitest run tests/definition.vitest.ts -t "^worked shapes carries the routine block and derives the trigger$")` prints `Tests  1 passed`, and `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-clean` exits 0 | Unmet | - |
| AC-002 | REQ-002 | Given a BOT.md carrying both `routine` and `trigger`, When the checker reads it, Then it exits 1 and prints `FAIL: definition.routine-trigger-conflict` | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-trigger-conflict` exits 1 and prints `FAIL: definition.routine-trigger-conflict` | Unmet | - |
| AC-003 | REQ-003 | Given `does: tell` with no `delivery` key, When the definition parses, Then delivery is `local-only`. Given `does: tell` beside a `delivery` key, When the checker reads it, Then it exits 1 and prints `FAIL: definition.routine-tell-with-targets` | `(cd $R && npx vitest run tests/routine.vitest.ts -t "^routine block maps does tell to local-only delivery$")` prints `Tests  1 passed`, and `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-tell-with-targets` exits 1 and prints `FAIL: definition.routine-tell-with-targets` | Unmet | - |
| AC-004 | REQ-004 | Given a routine bot whose `until_check` exits 0, When a run completes, Then the run record carries `until.met: true`, the routine state file carries `untilMetAt` and the `completed` switch is set. Given an `until_check` that exits 1, times out or cannot spawn, Then the record carries `until.met: false` and no switch is set. Given a bot bound to no checkout, Then the check runs in the identity's state root | `(cd $R && npx vitest run tests/runner.vitest.ts -t "^manual run, happy path runs the until check after a completed run$")` prints `Tests  1 passed`, `(cd $R && npx vitest run tests/routine-state.vitest.ts -t "^routine state records the until outcome$")` prints `Tests  1 passed`, and `(cd $R && npx vitest run tests/cli-run.vitest.ts -t "^bots routines lists the routines and their switches$")` prints `Tests  1 passed` | Unmet | - |
| AC-005 | REQ-005 | Given a cron start of `*/5 * * * *`, When the checker and the installer each read it, Then each refuses `routine-floor-15-minutes` and no plist is written. Given `0 9 * * 1-5`, Then both accept it. Given a slot missed while the machine slept, Then the slot is skipped, never caught up, and the skip is recorded on the slot snapshot | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-floor` exits 1 and prints `FAIL: routine-floor-15-minutes`, `(cd $R && npx vitest run tests/installer.vitest.ts -t "^preflight refuses a cron start under fifteen minutes$")` prints `Tests  1 passed`, and `(cd $R && npx vitest run tests/slot-accounting.vitest.ts -t "^scheduled fires through the runner turns a week-long sleep gap into one catch-up run with a bounded summary and no backfill$")` prints `Tests  1 passed` | Unmet | - |
| AC-006 | REQ-006 | Given ten consecutive failed runs for one bot, When the tenth failure is recorded, Then the `disabled` switch is set, the routine state file records `fatiguedAt` and the item id, and exactly one needs-you item exists whose `botId` is that bot and whose `runId` is the tenth failed run's id. Given a parked run or a run refused before dispatch between two failures, Then neither is counted, because a failed run needs a non-null `exit.class`, no `exit.refusal` and a reason other than `awaiting-decision`, and the streak stops there. Given a run refused by that switch, Then it is refused `routine-fatigued`. Given `bots enable`, Then the switch is cleared, the item is answered through `answerItem` with its no-resume option and the fixed text `enabled`, so its derived state is `answered`, it holds nothing and no resume is queued, the fatigue record is cleared and the streak restarts at zero. Given a completed run, Then the streak resets to zero | `(cd $R && npx vitest run tests/routine-state.vitest.ts -t "^routine state counts the fatigue streak and raises one item$")` prints `Tests  1 passed`, `(cd $R && npx vitest run tests/runner.vitest.ts -t "^stops during dispatch evaluates the fatigue rule after a failed run$")` prints `Tests  1 passed`, `(cd $R && npx vitest run tests/cli-run.vitest.ts -t "^bots enable answers the fatigue item with no resume$")` prints `Tests  1 passed`, `(cd $R && npx vitest run tests/answer.vitest.ts -t "^bots answer answers with no resume$")` prints `Tests  1 passed`, and `rg -c 'input.resume' .skilled/skills/system-skilled-bots/runtime/lib/answer.ts` prints at least 1 | Unmet | - |
| AC-007 | REQ-007 | Given a checkout holding two routine bots and one bot with no `routine` block, When `bots routines` runs, Then it prints two rows with `botId`, the start summary, `does`, `until`, `untilMetAt`, `switch` and `streak`, and exits 0. With `--json`, Then it prints one object with `version` and `routines`, the two rows sorted by `botId`, each carrying every key `003-terminal-screen/002-architecture-and-contracts/design/contracts.md` section 7 names, and every key in `003-terminal-screen/002-architecture-and-contracts/design/payloads/routines.json` appears with the same JSON type | `node .skilled/bin/bots.cjs routines --repo "$S/checkout"` exits 0 and prints two rows, and `T=$(mktemp -d) && cp -R .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean "$T/checkout" && XDG_STATE_HOME="$T/state" node .skilled/bin/bots.cjs routines --json --repo "$T/checkout" \| jq -e '(.version == 1) and (.routines \| length == 2) and (.routines[0].botId != null)'` exits 0, and `rg -c '^\| `botId`' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/records.md` prints 2 | Unmet | - |
| AC-008 | REQ-008 | Given a `routine` block with `starts: []`, When the checker reads it, Then it exits 1 and prints `FAIL: definition.routine-starts-empty` | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-starts-empty` exits 1 and prints `FAIL: definition.routine-starts-empty` | Unmet | - |
| AC-009 | REQ-009 | Given two cron entries in `starts`, When the checker reads it, Then it exits 1 and prints `FAIL: definition.routine-starts-multiple-cron`. Given one cron entry at index 1, Then it exits 1 and prints `FAIL: definition.routine-starts-cron-not-first`. Given a cron entry plus a queue entry, Then it exits 1 and prints `FAIL: definition.routine-starts-multiple` | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-starts-multiple-cron` exits 1 and prints `FAIL: definition.routine-starts-multiple-cron`, `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-starts-cron-not-first` exits 1 and prints `FAIL: definition.routine-starts-cron-not-first`, and `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-starts-multiple` exits 1 and prints `FAIL: definition.routine-starts-multiple` | Unmet | - |
| AC-010 | REQ-010 | Given the shipped template, the author reference and the status mode, When each is read, Then the template carries a commented `routine` block, the reference names `routine` in its field list and the status mode names `bots routines` | `rg -c 'routine' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints 1, `rg -c 'routine' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints at least 1, and `rg -c 'bots routines' .skilled/skills/system-skilled-bots/bots-status/SKILL.md` prints at least 1 | Unmet | - |
| AC-011 | REQ-011 | Given a routine with `until` and no `until_check`, When a run completes, Then no `completed` switch is set. Given `until_check` with no `until`, Then the checker exits 1 and prints `FAIL: definition.routine-until-check-without-outcome`. Given an `until` holding a shell metacharacter, Then the checker exits 1 and prints `FAIL: definition.routine-until-shell-metacharacters` | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-until-check-without-outcome` exits 1 and prints `FAIL: definition.routine-until-check-without-outcome`, `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/routine-until-shell-metacharacters` exits 1 and prints `FAIL: definition.routine-until-shell-metacharacters`, and `(cd $R && npx vitest run tests/routine.vitest.ts -t "^routine block refuses a check with no outcome$")` prints `Tests  1 passed` | Unmet | - |
| AC-012 | REQ-006 | Given a bot with ten consecutive failed runs and a `bots enable` that wrote `enabledAt`, When the next run fails, Then the streak is 1 and not 11, because only runs whose `dispatch.dispatchedAt` is later than `enabledAt` count. Given a bot that was never re-enabled, Then `enabledAt` is null and every run counts | `rg -c '^\| `enabledAt` \| string' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/records.md` prints 1, and `(cd $R && npx vitest run tests/routine-state.vitest.ts -t "^routine state counts only runs after enabledAt$")` prints `Tests  1 passed` | Unmet | - |
| AC-013 | REQ-006 | Given a stop after the fatigue item write, When the next failed run evaluates the rule, Then the item is rewritten with the same id, `fatiguedAt` is written and the `disabled` switch is set, and exactly one item exists. Given a stop after the fatigue state file write, Then the next failed run sets the switch and no second item exists. Given a stop after the enable's answer write, Then a second `bots enable` writes the derived `resumeRequestId`, the state file and the switch | `rg -c '^\| [1-4] \| [^|]* \| [^|]* \| [^|]* \| [^|]* \|$' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/state-machines.md` prints 4, and `(cd $R && npx vitest run tests/routine-state.vitest.ts -t "^routine state repairs an interrupted write$")` prints `Tests  1 passed` | Unmet | - |

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
