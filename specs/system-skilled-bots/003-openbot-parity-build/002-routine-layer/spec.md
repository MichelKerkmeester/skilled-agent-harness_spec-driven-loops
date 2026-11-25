---
title: "Feature Specification: Phase 2: routine-layer"
description: "A BOT.md says when a bot runs and nothing about what it is for, whether it acts or only tells, or when it is done. This phase adds the four-part routine block over the existing cron, queue, git-hook and manual triggers, an `until` outcome with an `until_check` command that switches the bot off when the outcome is reached, the 15-minute floor, a ten-failure fatigue switch and a `bots routines` list."
trigger_phrases:
  - "routine layer"
  - "phase 2 routine layer"
  - "routine block"
  - "until check"
  - "fatigue switch"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: routine-layer

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 10 |
| **Predecessor** | 001-activity-and-actor |
| **Successor** | 003-terminal-screen |
| **Handoff Criteria** | A BOT.md carrying a `routine` block parses, passes `bot-check.cjs` and installs; `bots routines` lists it; a met `until_check` switches the bot off; the floor and the fatigue switch each refuse by name. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification.

**Scope Boundary**: The authored `routine` block, its rendering over the four triggers that already exist, the `until_check` command, the 15-minute floor, the ten-failure fatigue switch and the `bots routines` list. The terminal pane that draws routines is phase 003, and it reads the `--json` this phase ships.

**Dependencies**:
- Phase 001-activity-and-actor, for the run rows the fatigue rule counts and the `by:` field the routine list reports.
- The existing cron translator, slot accounting, precheck helper, switches and status index, all unchanged in contract.

**Deliverables**:
- `runtime/lib/routine.ts` and `runtime/lib/routine-state.ts`.
- The `routine` key in `runtime/lib/definition.ts`, and the `completed` switch kind in `runtime/lib/switches.ts`.
- The `until_check` and fatigue hooks in `runtime/lib/runner.ts`, and the floor refusal in `runtime/lib/installer.ts` and `scripts/bot-check.cjs`.
- The `routines` verb in `.skilled/bin/bots.cjs`.
- The template, the author reference and the status mode updated to name the block and the verb.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A BOT.md declares a trigger and a body, so it says when a bot runs and nothing about what the run is for, whether it acts or only tells, or when it is done. The parser holds exactly those two surfaces and no third [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92-107]. An operator who wants "every weekday at nine, summarize the overnight changes, until the release ships" writes the outcome into the body prose, where nothing checks it, and the bot keeps firing after the outcome is reached. Nothing bounds a standing instruction either: a five-minute cron is accepted today, and a bot that has failed every night for a fortnight keeps firing, because the only stop switches are `disabled` and `paused` and neither is set by a failure [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/switches.ts:25].

### Purpose
One authored routine block that reads as a sentence, renders over the triggers that already exist, and stops the bot when its outcome is reached or when it has failed ten times running.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Three commands, run from the repository root on 2026-11-25, measure the gap this phase closes.

```text
$ node .skilled/bin/bots.cjs routines
bots: unknown verb: routines
$ echo $?
2

$ rg -c -i routine .skilled/skills/system-skilled-bots/runtime/lib/*.ts .skilled/bin/bots.cjs | wc -l
0

$ node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs <fixture with trigger: {kind: cron, expression: "*/5 * * * *"}>
PASS: config: bots/config.json reads cleanly
PASS: identity: local/tool (from config)
PASS: definition: bots/every-five/BOT.md parses as every-five
PASS: executor-bounds: bots/every-five/BOT.md: runtime cli-codex within the executor's bounds
PASS: isolation: bots/every-five/BOT.md: shared
PASS: posture: bots/every-five/BOT.md: cli-codex honors sandbox workspace-write
PASS: schedule: bots/every-five/BOT.md: "*/5 * * * *" translates to 12 calendar dictionaries
PASS: label: bots/every-five/BOT.md: com.skilled.bots.local_2ftool.every-five.0
$ echo $?
0
```

The first block is the missing verb: `bots routines` is not a verb, so the CLI exits 2 with `unknown verb`. The second is the missing surface: no runtime module and no CLI line mentions a routine. The third is the missing floor: a five-minute cron passes every hard invariant the checker holds and exits 0, so nothing refuses a standing instruction that fires 288 times a day. The fixture is two files, `bots/config.json` and `bots/every-five/BOT.md`, kept under `scratch/measured/` while this packet is open.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an optional `routine` block to BOT.md with `what`, `starts`, `does`, `until` and `until_check`, and render `starts[0]` into the `trigger` that the installer, slot accounting and status already read [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:47]. `until` is the prose outcome and is never executed; `until_check` is the command that measures it.
- Add the `until_check` command, run after a run that completes through the existing precheck helper, recording `untilMetAt` and setting a `completed` switch on exit 0 [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:535].
- Refuse a cron start whose shortest period is under 15 minutes, by name, in the checker and at install [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:107-111].
- Switch a bot off after ten consecutive failed runs, counted from the run records the status index is built from, and raise one needs-you item that names the bot in its `botId`, so `bots inbox` lists it under that bot and `bots enable <bot>` finds and answers it [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:118-123].
- Add `bots routines [--json]`, a read-only list of the checkout's routines with their `botId`, starts, does, until, `untilMetAt` and switch state.

### Out of Scope
- More than one start per routine - a second start needs a schedule index that `slot-accounting.ts:210` refuses today, so v1 accepts exactly one entry and refuses any second entry by name rather than ignoring it [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:210].
- OpenBot's 20-enabled cap - skilled bots has no per-person list; the operator owns the repository's `bots/` folder [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:113-116].
- Natural-language routine planning (`planRoutine`) - the block is authored YAML, not parsed from a sentence.
- A `progress:` line - `untilMetAt` is the progress record, and a second one would be a second truth.
- The routine pane in the terminal screen - phase 003 reads the `--json` this phase ships.
- Routine write verbs (`bots routine add`, `edit`, `remove`) - routines are authored in BOT.md, and the author mode owns that file.
- Missed-window replay - slot accounting already skips rather than replays and records the skip, and REQ-005 states that policy without changing it [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:161-171].
- The check-in frequency cap of once an hour - no check-in store exists, and `does: tell` is the whole of the check-in surface here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/routine.ts` | Create | The block: `parseRoutine`, `renderTrigger`, `checkRoutineFloor`, `routineDelivery`, the `until`/`until_check` pairing rule and the refusal names. |
| `.skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts` | Create | The per-bot state file: `readRoutineState`, `writeRoutineState`, `recordUntilOutcome`, `failureStreak`, `evaluateFatigue`, and the `untilMetAt`, `fatiguedAt` and `fatigueItemId` fields. |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Modify | Accept the `routine` key, refuse it beside `trigger`, and derive `trigger` from `starts[0]`. |
| `.skilled/skills/system-skilled-bots/runtime/lib/switches.ts` | Modify | Add the `completed` switch kind. |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modify | Name and create the identity's `routines` folder. |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | Read the `completed` switch before the lease; run `until_check` after a completed run; evaluate the fatigue rule after a failed one and refuse a fatigued bot as `routine-fatigued`. |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modify | Carry the optional `until` observation on the record. |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modify | Add the no-resume option, so `bots enable` answers the fatigue item through the one write path every other answer surface takes. |
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | Modify | Refuse a sub-floor cron start in the preflight, before anything is written. |
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | Modify | Report the `completed` switch as a row state. |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modify | Name the two new modules and their group. |
| `.skilled/bin/bots.cjs` | Modify | Add the `routines` verb, and on `enable` clear the `completed` switch, answer the fatigue item through `answerItem` with its no-resume option and clear the fatigue record. |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Modify | Add the nine routine invariants and call the floor check. |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Modify | Add the commented `routine` block. |
| `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` | Modify | Name `routine` in the field list. |
| `.skilled/skills/system-skilled-bots/bots-status/SKILL.md` | Modify | Name `bots routines` beside `bots status` and `bots inbox`. |
| `.skilled/skills/system-skilled-bots/runtime/tests/routine.vitest.ts` | Create | The block rules, the floor and the delivery mapping. |
| `.skilled/skills/system-skilled-bots/runtime/tests/routine-state.vitest.ts` | Create | The state file, the `until` outcome and the fatigue count. |
| `.skilled/skills/system-skilled-bots/runtime/tests/definition.vitest.ts` | Modify | The `routine` key, the conflict refusal and the derived trigger. |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Modify | The `until` hook and the `completed` switch. |
| `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts` | Modify | The no-resume option: the answer is written, no request is enqueued and the item's derived state is `answered`. |
| `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts` | Modify | The new hard invariants and their defect fixtures. |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-run.vitest.ts` | Modify | The `routines` verb, its `--json` shape and its exit code. |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/` | Create | One defect fixture per new hard invariant, plus the clean fixture. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A BOT.md may carry a `routine` block with `what`, `starts`, `does`, `until` and `until_check`; `starts` holds exactly one entry in v1, a trigger the parser already knows, and `starts[0]` renders into the `trigger` that the installer, slot accounting and status read. `until` is the prose outcome, printed by `bots routines` and never executed. The four parts are OpenBot's own [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:41-44]. |
| REQ-002 | A BOT.md carrying both `routine` and `trigger` is refused by name `routine-trigger-conflict`, so one source of truth decides when a bot runs. |
| REQ-003 | `does: tell` sets delivery to local-only, and `does: tell` beside a `delivery` key is refused by name `routine-tell-with-targets`. |
| REQ-004 | After a run that completes, the runner runs `until_check` through the existing precheck helper, in the checkout the bot is bound to or in the identity's state root when it binds none; exit 0 records `untilMetAt` and sets the `completed` switch, and any other outcome records `met: false` and leaves the bot enabled. The helper already owns a process group and a timeout [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:535]. |
| REQ-005 | A cron start whose shortest period is under 900 seconds is refused by name `routine-floor-15-minutes` by the checker and by the installer [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:109]. A cron slot missed while the machine was asleep is skipped, never caught up, and the skip is recorded on the slot snapshot [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:161-171]. |
| REQ-006 | After a failed run, ten consecutive failures for one bot set the `disabled` switch and record `fatiguedAt` and the item id in the routine state file, and raise one needs-you item whose `botId` is the bot's own id, so `bots inbox` lists it under that bot and `bots enable <bot>` finds it. A failed run is a dispatched run whose record carries a non-null `exit.class`, no `exit.refusal` and an `exit.reason` other than `awaiting-decision` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:134-138]. The reason test is what keeps a parked run out of the count: it carries `exit.reason: awaiting-decision` and `exit.class: operator` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:273-277], and `operator` is a failure class like any other [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:50], so the class and refusal tests alone would count it. A run refused before dispatch is not one either, because its record carries `exit.refusal` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:836-845]. The count stops at the first record that is not a failed run, so neither kind is ever counted as a failure. The item's `runId` is the tenth failed run's id and its `id` is that same value, because an item's id must equal its run id [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:103]. A run refused by that switch is refused by name `routine-fatigued` rather than the plain `disabled`, because the routine state file records the fatigue. The item is a notice rather than a parked run: `bots enable` answers it through `answerItem` with that function's no-resume option, writing the fixed text `enabled` when the item is open, so its derived state is `answered` and it holds nothing, and no resume is queued, because a resume would re-run the tenth failed run [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:99-109]. One write path answers every item, so the guarded write 006 owns and the roster check 011 owns reach this answer too, and no second writer exists to drop the grant [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:128]. `bots enable` also clears the switch, clears the fatigue record and restarts the count, and a completed run resets the count to zero [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:121]. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `bots routines [--json]` lists every bot in the checkout that carries a routine block, with its `botId`, `what`, rendered starts, `does`, `until`, `untilMetAt`, failure streak and switch state, and exits 0. |
| REQ-008 | A `routine` block with an empty `starts` list is refused by name `routine-starts-empty`. |
| REQ-009 | A `starts` list with more than one entry is refused by name, whatever the trigger kinds, until the schedule index lands: a second cron entry as `routine-starts-multiple-cron`, a cron entry past index 0 as `routine-starts-cron-not-first`, and any other second entry as `routine-starts-multiple`. |
| REQ-010 | The shipped template, the author reference and the status mode each name the `routine` block or the `routines` verb, so an author and a reader find it where they already look. |
| REQ-011 | `until_check` holds an optional shell command run after a completed run. A routine with `until` and no `until_check` never sets `completed`, a routine with `until_check` and no `until` is refused by name `routine-until-check-without-outcome`, and an `until` holding a shell metacharacter is refused by name `routine-until-shell-metacharacters`, so prose is never executed by accident. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A BOT.md with a `routine` block passes `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs <checkout>` with exit 0, and `bots routines` prints its row.
- **SC-002**: A bot whose `until_check` exits 0 stops firing, and `bots routines` prints its `untilMetAt`.
- **SC-003**: A `*/5 * * * *` cron start is refused by name in the checker and at install, and no plist is written.
- **SC-004**: Ten consecutive failed runs set the `disabled` switch and raise exactly one needs-you item for that bot, and `bots enable` answers it through `answerItem` with its no-resume option, so the bot's next run dispatches.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The cron translator and `schedulePeriodSeconds` | The floor cannot be measured, so a sub-floor start installs | Both exist and are unchanged; the floor reads them and restates no cron rule |
| Dependency | Phase 001's run rows | The fatigue count has no rows to count | The count reads run records, which exist today; the phase degrades to "no streak" rather than to a wrong count |
| Risk | The `starts` list widens the schema every reader consumes | The installer, slot accounting and status disagree about when a bot runs | `starts[0]` renders into the existing `trigger`, so no reader changes; a second entry is refused by name |
| Risk | An `until_check` command that hangs | A run never finishes | It runs through the precheck helper, which owns a process group and a timeout |
| Risk | The fatigue item holds the bot it reports on | The documented recovery does not recover it, because an open item refuses every later run | `bots enable` answers the item through `answerItem` with its no-resume option, so its derived state is `answered` and it holds nothing, and no resume is queued, so the bot's next scheduled or manual run dispatches |
| Risk | A derived failure count over a long history | A slow `bots routines` on a bot with thousands of runs | The count stops at the first non-failure, so it reads at most ten records |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The `until_check` command adds at most one process spawn per completed run, bounded by the precheck timeout the runner already applies.
- **NFR-P02**: `bots routines` reads one BOT.md and one state file per bot, plus at most ten run records per bot for the streak; it opens no run folder and no SQLite index.

### Security
- **NFR-S01**: The `until_check` command is authored in BOT.md and runs through the same process-group isolation and filtered environment as the precheck, never the shell's environment; `until` is prose and never reaches a shell.
- **NFR-S02**: The routine state file is owner-only under the identity state root, like every other file there.

### Reliability
- **NFR-R01**: An `until_check` that exits non-zero, times out or cannot spawn records `met: false` and never switches the bot off.
- **NFR-R02**: A damaged routine state file reads as "no `untilMetAt` recorded" and never as "met", so a damaged file cannot stop a bot.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a `routine` block with `starts: []` is refused as `routine-starts-empty`; a BOT.md with no `routine` block behaves exactly as it does today, so every existing bot keeps working. A routine with `until` and no `until_check` parses and never sets `completed`, and one with `until_check` and no `until` is refused as `routine-until-check-without-outcome`.
- Maximum input: `starts` holds exactly one entry in v1; a second entry of any kind is refused, a second cron entry as `routine-starts-multiple-cron`, a cron entry past index 0 as `routine-starts-cron-not-first` and any other second entry as `routine-starts-multiple`, because slot accounting refuses a schedule index past 0 [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:210].
- Failure path: an `until_check` that exits non-zero, times out or cannot spawn records `met: false` and leaves the bot enabled; a tenth consecutive failure sets the `disabled` switch, records `fatiguedAt` and the item id in the routine state file, and raises one needs-you item whose `botId` is the bot's own id and whose `runId` is the tenth failed run's id.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two new modules, nine modified runtime files, one CLI verb, one checker, three docs and seven test files |
| Risk | 12/25 | The schema widens where the installer, slot accounting and status read; no auth, no API, no data migration |
| Research | 10/20 | The research settles the block shape and the guardrails; the `starts` migration and the fatigue source are decided here |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **One start per routine, or a `starts` list?** Decided for this packet: `starts` keeps the list shape and v1 accepts exactly one entry, refusing any second entry by name. OpenBot allows more than one start [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:42], the research records the choice as open [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:185], and a one-start v1 would be size S where this phase is size M [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:47]. A list that silently drops its second entry is the failure this refuses: the author believes the bot fires on both. Reversal condition: when the schedule index lands, lift `routine-starts-multiple` and keep the two cron refusals, which already name the shapes the index will admit.
- **Is `until` prose or a command?** Decided: two fields. The reference's `Until` is an outcome in the author's words [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:45], and the precheck helper runs a shell command [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:535], so one field cannot be both. `until` is printed and never executed; `until_check` is the command. Reversal condition: if a later phase parses prose into a check, it writes `until_check` and leaves `until` as the record.
- **Where does the fatigue count read from?** The research says the status index's run rows [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/lineages/devin-2/research.md:51], but the index is only rebuilt by `bots status`, so a count read from it can be stale. Decided: count from the run records under the identity's `records/` folder, which is the source the index is built from. Reversal condition: if the runner starts indexing each record as it writes it, read the index instead.
- **A third switch kind, or a reason on `disabled`?** Decided: a `completed` switch kind, because `readSwitch` already takes a kind and an added kind cannot change what an existing switch file means [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/switches.ts:25]. Reversal condition: if a fourth kind is ever proposed, replace the kinds with a reason field instead of adding one.
<!-- /ANCHOR:questions -->

---
