---
title: "Implementation Summary"
description: "A BOT.md routine block now renders its own trigger, stops the bot once its until_check passes, refuses a start under fifteen minutes and switches a bot off after ten failed runs in a row."
trigger_phrases:
  - "routine layer implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/002-routine-layer"
    last_updated_at: "2026-11-27T12:00:00Z"
    last_updated_by: "unit-002-orchestrator"
    recent_action: "Built the routine layer and closed every acceptance criterion"
    next_safe_action: "Merge the unit branch"
    blockers: []
    key_files:
      - ".skilled/skills/system-skilled-bots/runtime/lib/routine.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/runner.ts"
      - ".skilled/bin/bots.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "unit-002-routine-layer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-routine-layer |
| **Completed** | 2026-11-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A bot can now carry a `routine` block that says what it is for, when it starts, whether it acts or only tells and what outcome ends it. Once its `until_check` exits 0 the bot stops itself, and once it fails ten runs in a row it is switched off with one inbox notice that `bots enable` answers.

### Phase 2: routine-layer

You write `what`, one `starts` entry, `does` and an optional `until` with an `until_check`. The block renders its first start into the `trigger` the installer, slot accounting and status already read, so nothing downstream changed shape. `does: tell` maps to local-only delivery, and a `delivery` key beside it is refused. Every cron start under 900 seconds is refused `routine-floor-15-minutes` by the checker and by the install preflight, with or without a routine block.

After a completed run the runner runs `until_check` through the precheck helper, so it gets the same filtered environment, process group, timeout and kill grace. Exit 0 records `untilMetAt` and sets the new `completed` switch, and the next run is refused `routine-completed`. After a failed run the runner reads the bot's run records newest first and, at ten failures in a row, writes the fatigue notice, records `fatiguedAt` and sets `disabled`, so the next run is refused `routine-fatigued`. `bots enable` answers that notice with the no-resume option, writes `enabledAt` so the streak restarts and clears both switches. `bots routines [--json]` lists every routine bot with its start phrase, outcome, switch and streak, and a scheduled run's prompt now carries one fixed line saying it was started by its schedule.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/routine.ts` | Created | The block's types, `parseRoutine` with its eight refusals, `renderTrigger`, `describeStart`, `routineDelivery` and `checkRoutineFloor` |
| `.skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts` | Created | The 0600 state file, `recordUntilOutcome`, `recordEnable`, `failureStreak`, `evaluateFatigue`, `disabledCause` and `routineSwitch` |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Modified | Accepts `routine`, refuses it beside `trigger` and derives the trigger and delivery from it |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modified | The optional `until: {met}` observation and its validation |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modified | The completed and fatigued refusals, the `until_check` hook, the fatigue evaluation and the scheduled flag |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Modified | The scheduled-run line after the exemption line |
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | Modified | The fifteen-minute floor in preflight and the completed switch probe |
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | Modified | The `completed` row state and `describeStart` as the activity default |
| `.skilled/skills/system-skilled-bots/runtime/lib/switches.ts`, `state-root.ts`, `answer.ts` | Modified | The `completed` kind, the `routines` folder name and the `resume: false` answer option |
| `.skilled/bin/bots.cjs` | Modified | The `routines` verb and the fatigue recovery in `enable` |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Modified | Nine new hard invariants and the floor call |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/routine-*`, `fixtures/README.md` | Created, Modified | One clean routine checkout and nine defect fixtures |
| `.skilled/skills/system-skilled-bots/runtime/tests/routine.vitest.ts`, `routine-state.vitest.ts` | Created | Five block tests and six state tests |
| `.skilled/skills/system-skilled-bots/runtime/tests/` activity, answer, bot-check, cli-run, definition, dispatch, installer, run-record, runner and status suites | Modified | The named test for each criterion and the expectations the new fields and the floor moved |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt`, `bots-author/references/bot-definition.md`, `bots-status/SKILL.md`, `runtime/lib/README.md` | Modified | The commented block, the field list, the new read verb and the two module rows |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Cheap workers wrote every change in eight internal waves, 42 runs in all, one change per brief, on `cli-mistral-vibe` with `deepseek-flash`. Every run exited 0 with outcome finished, so no run fell back to `cli-pi` and no retry was spent. After each wave the orchestrator ran the brief's verify commands itself before marking a task. Three corrections were brief defects rather than worker failures, and each went to a new worker: the activity default (s1b reverted it, s1c restored it, a13 moved the test), the routine state path guard (r5) and the run-record expectations (a4b). The closing gate ran the whole runtime suite, the type-check, every acceptance command and the CLI reads on fresh `mktemp -d` checkouts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The `routines` folder is named in `state-root.ts` and made by its writer on first write | `state-root.vitest.ts` pins the folder list `ensureIdentityState` creates, and the writer already makes its parent at 0700 |
| `describeStart` is the default `describe` of `activityReport`, and the one data set test now expects the phrase without a describe argument | `bots activity` calls `activityReport` with no `describe`, so the library default is the only place the phrase can come from. The old assertion pinned 001's placeholder null, which this phase replaces |
| `routineStateFile` carries no guard of its own | Both callers check the id with `isSafeSegment` and refuse `bot-id-invalid` before they ask for the path, and the module refuses only through named Result reasons |
| The `until` key is written as null on every record that ran no check | A reader tells what the run measured from one key, and a record from before this phase reads the same way |
| The fatigue item takes the tenth failed run's id, or the open fatigue notice's id when one exists | A stop between two writes is repaired by the next failed run without raising a second notice |
| `bots enable` runs the installer step first and the answer, the restart and the switches after it | A refused installer step leaves every routine file as it was, so the bot stays stopped and nothing needs repair |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm test` in the runtime | PASS: `Test Files  39 passed (39)` and `Tests  456 passed (456)`, exit 0. Baseline 37 and 424. The 32 new tests are the 23 named ones and 9 the checker suite generates from its defect table |
| `npm run typecheck` | PASS: exit 0 |
| AC-001 to AC-014 commands | PASS: every anchored filter printed `Tests  1 passed`, every defect fixture exited 1 with its `FAIL:` line and `routine-clean` exited 0 |
| `bots routines` and `bots routines --json` on a fresh copy of `routine-clean` | PASS: the two rows of `design/mockups.md` section 2, exit 0, and a payload equal to the screen contract's sample in every key but `failureStreak`, whose sample counts a failed run this data set does not hold |
| `rg -n 'throw new Error'` over the two new modules | PASS: no line |
| `validate.sh --strict` on this folder | PASS: `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two verify cells read differently from their wording.** T021 runs `bots routines --repo $F/routine-clean`, but that fixture sits inside the repository, so the CLI resolves the git toplevel and prints `bots: no routines`. The same command on a `$S/checkout` copy, the rule the notation states for every `bots.cjs` read, prints both rows. CHK-050's `rg -c 'bots/|fixtures/'` also matches the `system-skilled-bots/` segment of this folder's own path, so it counts any changed packet document until the commit lands.
2. **T001 and T003 record the tree before the change.** The six switch call sites T001 counted are now eight, and the `scratch/measured` fixture T003 kept now fails `routine-floor-15-minutes`, which is the floor it was kept to prove absent. Both held on the pre-edit tree, as `scratch/setup-notes.md` records.
3. **Two installer assertions moved with the cron.** Moving the suite's `*/5` crons to `*/15` changed the expected `StartCalendarInterval` count from 12 to 4 and the lateness bound from 300 to 900 seconds, two lines beyond the literal swap T044 names.
<!-- /ANCHOR:limitations -->
