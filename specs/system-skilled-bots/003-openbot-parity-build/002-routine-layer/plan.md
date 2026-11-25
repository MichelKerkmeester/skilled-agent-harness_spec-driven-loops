---
title: "Implementation Plan: Phase 2: routine-layer"
description: "Adds the four-part routine block to BOT.md, renders its first start into the trigger every existing reader consumes, runs an `until_check` command after a completed run, refuses a sub-15-minute cron start, switches a bot off after ten consecutive failures, and adds a bots routines list."
trigger_phrases:
  - "routine layer plan"
  - "routine block plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: routine-layer

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node 22, loaded through the runtime's own `tsx`; one CommonJS CLI and one CommonJS checker |
| **Framework** | None; the bots runtime is a flat module set with a hand-written CLI front door |
| **Storage** | JSON files under the user-level state root, plus the derived SQLite status index |
| **Testing** | Vitest, with fixtures copied into a temp repository and an isolated environment |

### Overview
Two new modules carry the work: `routine.ts` holds the block rules and is pure, and `routine-state.ts` holds the per-bot state file and the fatigue count and does the I/O. `definition.ts` gains the `routine` key and derives `trigger` from `starts[0]`, so the installer, slot accounting and status keep reading the field they read today and no reader changes. The runner gains two hooks, one after a completed run for `until_check` and one after a failed run for the fatigue count, and the checker and the installer each gain the floor refusal. `until` stays prose and never reaches a shell; `until_check` is the command the hook runs. Proof is `bot-check.cjs` over a fixture, `bots routines` over the same fixture, and the vitest suites for the two new modules and the four modified ones.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The measured behavior block in `spec.md` holds three commands and their verbatim output

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` exits 0
- [ ] `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean` exits 0 and the same command over each new defect fixture exits 1
- [ ] `node .skilled/bin/bots.cjs routines --repo .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean` exits 0 and prints one row per routine
- [ ] Docs updated (spec/plan/tasks, the template, the author reference, the status mode)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered module set with a pure core. A parser stays shape-only, a state module owns the files, and the CLI and the checker hold no rules.

### Key Components
- **`routine.ts`**: `parseRoutine` validates the block shape and reuses `parseTrigger` per start [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:142-166]; `renderTrigger` returns `starts[0]`; `checkRoutineFloor` measures a cron start with `schedulePeriodSeconds` and refuses under 900 seconds [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:102]; `routineDelivery` maps `does` to a delivery. It also owns the `until`/`until_check` pairing: `until` is prose and is refused when it holds a shell metacharacter, `until_check` without `until` is refused, and `until` without `until_check` parses and simply never completes. Pure, no I/O, so the checker and the runner cannot disagree.
- **`routine-state.ts`**: `routineStateFile` names `routines/<bot-id>.json` under the identity state root [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117-132]; `readRoutineState` and `writeRoutineState` own it; `recordUntilOutcome` writes `untilMetAt`; `failureStreak` counts consecutive failures from the run records, where a failed run is a dispatched run whose record carries a non-null `exit.class`, no `exit.refusal` and an `exit.reason` other than `awaiting-decision`, so a parked run and a refusal before dispatch are never counted [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:134-138]; `evaluateFatigue` sets the `disabled` switch, records `fatiguedAt` and the item id, and raises one needs-you item at ten, whose `runId` is the tenth failed run's id and whose `id` equals it [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:103]. The item's `botId` is the bot's own id, so `bots inbox` lists it under that bot and `bots enable` finds it; `bots enable` answers it through `answerItem` with that function's no-resume option, so its derived state is `answered`, `holdForBot` no longer matches it and the tenth failed run is not re-run [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:99-109]. One write path answers every item, so the guarded write 006 owns and the roster check 011 owns reach this answer too, and no second writer exists to drop the grant [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:128].
- **`definition.ts`**: gains `routine` in `FRONTMATTER_KEYS`, refuses `routine` beside `trigger`, and fills `trigger` from `renderTrigger`. `BotDefinition` gains `routine: Routine | null`.
- **`runner.ts`**: reads the `completed` switch beside the `disabled` one before the lease [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:822]; after a run that completes, runs `until_check` through `runPrecheck` in the bound checkout or the identity's state root and records the observation; after a failed run, calls `evaluateFatigue`; and refuses a run stopped by the fatigue switch as `routine-fatigued`, read from the routine state file.
- **`switches.ts`**: `SWITCH_KINDS` gains `completed`, so `readSwitch`, `setSwitch` and `clearSwitch` take it with no other change [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/switches.ts:25].
- **`bots.cjs`**: gains the `routines` verb, and `enable` clears `completed` as well as `disabled`, answers the fatigue item through `rt.answer.answerItem` with its no-resume option and clears the fatigue record [SOURCE: .skilled/bin/bots.cjs:513-514]. The module is already loaded for the `answer` verb, so `enable` adds no import [SOURCE: .skilled/bin/bots.cjs:187-196].

### Data Flow
1. An author writes `routine` in BOT.md. `parseDefinition` calls `parseRoutine`, then `renderTrigger`, and the definition carries both the block and the derived `trigger`.
2. The checker and the installer each call `checkRoutineFloor` on a cron start, and each refuses `routine-floor-15-minutes` before anything is written.
3. A run dispatches as it does today. On a completed run the runner calls `runPrecheck(until_check)`, writes the observation onto the run record, and on exit 0 writes `untilMetAt` and sets the `completed` switch. The check runs in the checkout the bot is bound to, or in the identity's state root when it binds none, so a routine with no checkout still has a working directory. The helper already ends a timed-out check's whole process group [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:529-534].
4. On a failed run the runner calls `failureStreak` over the bot's run records, counting only dispatched runs that failed — a non-null `exit.class`, no `exit.refusal` and a reason other than `awaiting-decision` — so a parked run and a refusal before dispatch are never counted [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:134-138] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:273-277]. At ten it sets the `disabled` switch, records `fatiguedAt` and the item id in the routine state file, and raises one needs-you item whose `botId` is the bot's own id and whose `runId` is the tenth failed run's id, so `bots inbox` lists it under that bot and `bots enable` finds it; the shape is the one the status index already summarizes [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:68-86].
5. `bots routines` reads the checkout's BOT.md files, the identity's routine state files, the switches and at most ten run records per bot, and prints one row per routine.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This change touches schema boundaries, persistence and shared policy, so the inventory is filled even though the packet is not a bug fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/definition.ts` | Produces the `trigger` every reader consumes | update: accept `routine`, derive `trigger` from `starts[0]` | `rg -n "routine" runtime/lib/definition.ts` names the key and the conflict refusal |
| `runtime/lib/installer.ts` | Reads `trigger.kind` and `trigger.expression` to build a plist | update: add the floor refusal; the trigger read is unchanged | `rg -n "trigger-not-cron\|routine-floor" runtime/lib/installer.ts` names both |
| `runtime/lib/slot-accounting.ts` | Reads `trigger` and refuses a schedule index past 0 | unchanged: `starts[0]` is the only cron start, so the index stays 0 | `rg -n "scheduleIndex !== 0" runtime/lib/slot-accounting.ts` still prints one line |
| `runtime/lib/status.ts` | Reads install checks, path state, launchd, the last index row and open needs-you items; does not read switches | update: import `readSwitch`, insert `completed` into `BOT_ROW_STATES` after `held`, and report it | `rg -n "completed" runtime/lib/status.ts` names the state and the switch read |
| `runtime/lib/run-record.ts` | Produces the record the index and delivery read | update: carry the optional `until` observation | `rg -n "until" runtime/lib/run-record.ts` names the field |
| `runtime/lib/answer.ts` | Answers one needs-you item and always enqueues a resume | update: a no-resume option, so `bots enable` answers the fatigue item through the one write path | `rg -n "input.resume" runtime/lib/answer.ts` names the option and the branch that skips the enqueue |
| `runtime/lib/status-index.ts` | Consumes the record into a run row | unchanged: the summary keeps the fields it keeps, and `bots routines` reads the state file instead | `rg -n "until" runtime/lib/status-index.ts` prints nothing |
| `runtime/lib/delivery.ts` | Reads `delivery.mode` | unchanged: `does: tell` resolves to `local-only` before delivery sees it | `rg -n "local-only" runtime/lib/delivery.ts` still prints its branch |
| `runtime/lib/dispatch.ts` | Builds the prompt from the body | not a consumer: the routine block never reaches the prompt | `rg -n "routine" runtime/lib/dispatch.ts` prints nothing |
| `scripts/bot-check.cjs` | Audits a checkout before anything installs | update: nine new hard invariants and the floor call | `node scripts/bot-check.cjs <defect fixture>` exits 1 and names the invariant |
| `.skilled/bin/bots.cjs` | Parses one verb and one id | update: the `routines` verb, and `enable` answering the fatigue item through `answerItem` with no resume | `node .skilled/bin/bots.cjs routines` exits 0 |

Required inventories:
- Same-class producers: `rg -c 'trigger' .skilled/skills/system-skilled-bots/runtime/lib/*.ts` prints `definition.ts:14`, `slot-accounting.ts:5`, `installer.ts:5`, `request-queue.ts:3`, `runner.ts:2`, `repo-config.ts:1`. Only `definition.ts` produces the field; the rest read it.
- Consumers of changed symbols: `rg -c 'SWITCH_KINDS|readSwitch|setSwitch|clearSwitch' .skilled/skills/system-skilled-bots/runtime/lib/*.ts .skilled/bin/bots.cjs` prints `switches.ts:4`, `installer.ts:3`, `runner.ts:3`, `bots.cjs:2`. `installer.ts:547-548` reads `disabled` and `paused` and must read `completed` too.
- Consumers of the changed answer symbol: `rg -c 'answerItem' .skilled/skills/system-skilled-bots/runtime/lib/*.ts .skilled/bin/bots.cjs` prints `answer.ts:1`, `bots.cjs:1`. `bots.cjs:293` is the `answer` verb, which keeps the default and still queues its resume, and the `enable` path adds the second call, which passes the option.
- Matrix axes: start kind (cron, queue, git-hook, manual) x `does` (act, tell) x `until_check` (absent, met, not met, timed out) x switch state (none, disabled, paused, completed). The required rows are the four start kinds with `does: act` and no `until_check`, then cron with each `until_check` outcome, then the four switch states against a routine bot.
- Algorithm invariant: `starts[0]` is the only cron start and the only source of `trigger`, so a definition's installed schedule and its authored routine can never name different times. Adversarial cases: a cron start at index 1, two cron starts, an empty `starts`, `routine` beside `trigger`, and `does: tell` beside a `delivery` key.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads `runtime/lib/definition.ts`, `switches.ts`, `state-root.ts` and `runner.ts:822-935` and records the four switch and trigger call sites. Implementation adds `routine.ts` and `routine-state.ts`, wires the `routine` key, the `completed` switch, the two runner hooks, the floor refusal and the `routines` verb. Verification runs `bot-check.cjs` over a routine fixture and each defect fixture, `bots routines` over the same fixture, and the runtime's vitest suite.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `parseRoutine`, `renderTrigger`, `checkRoutineFloor`, `routineDelivery`, `failureStreak`, `readRoutineState` | Vitest, `runtime/tests/routine.vitest.ts` and `routine-state.vitest.ts` |
| Integration | The `until_check` hook and the `completed` switch through `runBot`; the `routines` verb through the real CLI | Vitest with a stub executor, `runtime/tests/runner.vitest.ts` and `cli-run.vitest.ts` |
| Contract | The checker over one clean routine fixture and one defect fixture per new invariant | `node scripts/bot-check.cjs <fixture>`, `runtime/tests/bot-check.vitest.ts` |
| Manual | `bots routines` and `bots routines --json` over a fixture checkout | The CLI, read-only |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cron-translator.ts` and `slot-accounting.ts` | Internal | Green | The floor cannot be measured, so REQ-005 is blocked |
| `runner.ts` `runPrecheck` | Internal | Green | The `until_check` command has no process-group isolation, so REQ-004 is blocked |
| `switches.ts` and `state-root.ts` | Internal | Green | The `completed` switch and the routine state file have nowhere to live |
| `needs-you.ts` | Internal | Green | The fatigue rule cannot raise its one item or answer it on `enable` |
| `better-sqlite3` | External | Green | Not needed: `bots routines` reads no index |
| Phase 001-activity-and-actor | Internal | Yellow | The fatigue count still works from run records; only the `by:` column of the routine list is missing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A routine bot stops firing when its `until_check` has not been met, or a bot that never failed is switched off by the fatigue rule.
- **Procedure**: Revert the phase's commits. A BOT.md that carries a `routine` block then fails to parse, so the rollback also reverts those files, or the operator rewrites them as `trigger`. A `completed` switch file left under the identity state root is inert once the kind is gone, because nothing reads it, and it is deleted by hand.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
