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
- [ ] `bots routines --json` prints one object with `version` and `routines`, and every key in `003-terminal-screen/002-architecture-and-contracts/design/payloads/routines.json` appears in the real output with the same JSON type
- [ ] The five `design/` documents agree with the code: every refusal name in `design/refusals.md` is a string in the source, every fixture in `design/fixtures.md` exists, and every line in `design/mockups.md` is what the verb prints
- [ ] Docs updated (spec/plan/tasks, the template, the author reference, the status mode, the fixtures README)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered module set with a pure core. A parser stays shape-only, a state module owns the files, and the CLI and the checker hold no rules.

### Design artifacts

Five documents in `design/` fix what a builder would otherwise decide. Each one is the authority for its subject and the sections below cite it rather than restating it.

| File | It fixes |
|------|----------|
| `design/records.md` | Every field of the routine state file, the run record's `until` object, the fatigue item and the `routines --json` row, plus the authored `routine` block |
| `design/state-machines.md` | The routine lifecycle, the fatigue and enable write orders, the four transition rows and four Mermaid sequences |
| `design/refusals.md` | The eleven refusals with their layer, class, exit, registry entry, checker id and fixture |
| `design/fixtures.md` | The ten `routine-*` fixtures with their literal content and the one invariant each trips |
| `design/mockups.md` | The literal stdout and stderr of `bots routines`, `bots inbox`, `bots enable`, `bots status` and the refusal lines |

### Key Components
- **`routine.ts`**: `parseRoutine` validates the block shape and takes `parseTrigger` as an argument, so it reuses the trigger parser without a runtime import [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:142-166]; `renderTrigger` returns `starts[0]`; `describeStart` renders the `summary` phrase, such as `every 6h` or `daily 02:00`; `checkRoutineFloor` takes the shortest period as an argument its caller computes and refuses under 900 seconds; `routineDelivery` maps `does` to a delivery. The module imports `repo-config` and takes `definition` as a type-only import, so it stays inside the contracts group and closes no cycle [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/runtime-architecture.md:314]. The checker and the installer each compute the period with `schedulePeriodSeconds` and pass it in [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:102]. It also owns the `until`/`until_check` pairing: `until` is prose and is refused when it holds a shell metacharacter, `until_check` without `until` is refused, and `until` without `until_check` parses and simply never completes. Pure, no I/O, so the checker and the runner cannot disagree. The block's field table is `design/records.md` section 5.
- **`routine-state.ts`**: `routineStateFile` names `routines/<bot-id>.json` under the identity state root [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117-132]; `readRoutineState` and `writeRoutineState` own it. The file holds the five keys `contracts/records.md` section 6 fixes, `schemaVersion`, `untilMetAt`, `fatiguedAt`, `fatigueItemId` and `enabledAt`, and an absent or damaged file reads as every field null and never as met [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:228]. The write is one `writeStateAtomic` call of the whole object followed by `chmodSync(file, 0o600)`, because `writeStateAtomic` sets no mode and the file is owner-only [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts:413-415]. The chmod runs on every write, so a file an older runtime created is repaired. `recordUntilOutcome` writes `untilMetAt`; `failureStreak` counts consecutive failures from the run records, where a failed run is a dispatched run whose record carries a non-null `exit.class`, no `exit.refusal` and an `exit.reason` other than `awaiting-decision`, so a parked run and a refusal before dispatch are never counted [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:134-138], and it stops at the first record whose `dispatch.dispatchedAt` is not later than `enabledAt`; `evaluateFatigue` writes the item, then `fatiguedAt` and the item id, then the `disabled` switch, in that order, and raises one needs-you item at ten, whose `runId` is the tenth failed run's id and whose `id` equals it [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:103]. The item's `botId` is the bot's own id, so `bots inbox` lists it under that bot and `bots enable` finds it; `bots enable` answers it through `answerItem` with that function's no-resume option, so its derived state is `answered`, `holdForBot` no longer matches it and the tenth failed run is not re-run [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:99-109]. One write path answers every item, so the guarded write 006 owns and the roster check 011 owns reach this answer too, and no second writer exists to drop the grant [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:128]. The shapes are `design/records.md` section 1 and the order is `design/state-machines.md` section 2.
- **`definition.ts`**: gains `routine` in `FRONTMATTER_KEYS`, refuses `routine` beside `trigger`, and fills `trigger` from `renderTrigger`. `BotDefinition` gains `routine: Routine | null`.
- **`runner.ts`**: reads the `completed` switch beside the `disabled` one before the lease and refuses it as `routine-completed`, class `null` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:822]; names `routine-fatigued` at that same `disabled` check when the routine state file records `fatiguedAt`, because the check refuses before anything else could name fatigue [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md:231]; after a run that completes, runs `until_check` through `runPrecheck` in the bound checkout or the identity's state root and records the observation; after a failed run, calls `evaluateFatigue`. The two checks run `disabled` first, so a bot that is both fatigued and completed reports the fatigue, which is the state the operator has to act on.
- **`switches.ts`**: `SWITCH_KINDS` gains `completed`, so `readSwitch`, `setSwitch` and `clearSwitch` take it with no other change [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/switches.ts:25].
- **`bots.cjs`**: gains the `routines` verb, whose human line and `--json` payload are `design/mockups.md` sections 2 and 3. On `enable` it answers the fatigue item through `rt.answer.answerItem` with its no-resume option and the fixed text `enabled`, then writes `enabledAt` and clears the fatigue record, then clears `disabled` and `completed`, in that order [SOURCE: .skilled/bin/bots.cjs:513-514]. The text is `enabled` because `answerItem` derives the scope `deny` only from `deny`, `no` or `n`, so the answer records `once` and the grant is written with it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md:23]. An expired item is not answered and the enable still clears the switch and the record. The module is already loaded for the `answer` verb, so `enable` adds no import [SOURCE: .skilled/bin/bots.cjs:187-196].

### Data Flow
1. An author writes `routine` in BOT.md. `parseDefinition` calls `parseRoutine`, then `renderTrigger`, and the definition carries both the block and the derived `trigger`.
2. The checker and the installer each call `checkRoutineFloor` on a cron start, and each refuses `routine-floor-15-minutes` before anything is written.
3. A run dispatches as it does today. On a completed run the runner calls `runPrecheck(until_check)`, writes the observation onto the run record, and on exit 0 writes `untilMetAt` and sets the `completed` switch. The check runs in the checkout the bot is bound to, or in the identity's state root when it binds none, so a routine with no checkout still has a working directory. The helper already ends a timed-out check's whole process group [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:529-534].
4. On a failed run the runner calls `failureStreak` over the bot's run records, counting only dispatched runs that failed (a non-null `exit.class`, no `exit.refusal` and a reason other than `awaiting-decision`), so a parked run and a refusal before dispatch are never counted [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:134-138] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:273-277]. The count also stops at the first record dispatched at or before `enabledAt`, so a re-enabled bot starts at zero. At ten it writes the needs-you item, then `fatiguedAt` and the item id in the routine state file, then the `disabled` switch, in that order, and the item's `botId` is the bot's own id and its `runId` is the tenth failed run's id, so `bots inbox` lists it under that bot and `bots enable` finds it; the shape is the one the status index already summarizes [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:68-86]. The order is `design/state-machines.md` section 2, and each step is safe to repeat, so a stop between two writes is repaired by the next failed run.
5. `bots enable` answers the fatigue item through `answerItem` with the no-resume option and the text `enabled`, then writes `enabledAt` and clears the fatigue record, then clears the `disabled` and `completed` switches. A stop after the answer leaves the bot stopped, which is the safe direction, and a second `bots enable` converges. The order is `design/state-machines.md` section 3.
6. `bots routines` reads the checkout's BOT.md files, the identity's routine state files, the switches and at most ten run records per bot, and prints one row per routine.

### Transition contract: fatigue and enable

Two writers change a routine bot's state, the runner after a failed run and `bots enable`, and they write the same three things. The order is fixed here so a stop between two writes has one repair rather than a decision.

| Writer | Step 1 | Step 2 | Step 3 |
|--------|--------|--------|--------|
| The runner after the tenth failure | The needs-you item, id and `runId` the tenth run's id | The routine state file, `fatiguedAt` and `fatigueItemId` | The `disabled` switch |
| `bots enable` | The fatigue item, answered through `answerItem` with the no-resume option and the text `enabled` | The routine state file, `enabledAt` set and the fatigue fields cleared | The `disabled` and `completed` switches, both cleared |

**Why the fatigue switch is last.** The `disabled` check reads `fatiguedAt` to name `routine-fatigued`. Setting the switch before the record would make the next run refuse `disabled` and lose the name the phase requires.

**Why the enable switch is last.** A stop before it leaves the bot stopped, which is the safe direction. A stop after it with the record unwritten would let the next failure count the ten old ones.

**Each step is safe to repeat.** The item's id is the tenth run's id, so a second evaluation writes the same file. The state file is one whole-object write. `setSwitch` on a switch already set and `clearSwitch` on a switch already clear both return without changing anything. A second `bots enable` therefore converges, and it is also the repair for a stop after step 1 or step 2.

**The four rows the matrix adds.** `design/state-machines.md` section 4 names what each one leaves on disk and the one action that repairs it.

| Row | Scenario | What the next run does |
|-----|----------|------------------------|
| 1 | `bots enable` runs while a failing run is in flight | The in-flight run's `dispatch.dispatchedAt` is older than `enabledAt`, so it is not counted and the streak is 0 |
| 2 | A stop after the fatigue item write | Held by the open item, not refused. The next failed run rewrites the item, writes `fatiguedAt` and sets the switch |
| 3 | A stop after the fatigue state file write | Held by the open item, not refused. The next failed run sets the switch |
| 4 | A stop after the enable's answer write | Refused `routine-fatigued`. A second `bots enable` writes the derived `resumeRequestId`, the state file and the switch |
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
| `runtime/lib/status.ts` | Reads install checks, path state, launchd, the last index row and open needs-you items; does not read switches | update: import `readSwitch`, insert `completed` into `BOT_ROW_STATES` after `held`, and report it. Import `describeStart` from `routine.ts` and pass it to `activityReport` as `describe` | `rg -n "completed" runtime/lib/status.ts` names the state and the switch read, and `rg -n "describeStart" runtime/lib/status.ts` names the import and the call |
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
- Matrix axes: start kind (cron, queue, git-hook, manual) x `does` (act, tell) x `until_check` (absent, met, not met, timed out) x switch state (none, disabled, paused, completed). The required rows are the four start kinds with `does: act` and no `until_check`, then cron with each `until_check` outcome, then the four switch states against a routine bot, then the four transition rows in the transition contract above: `bots enable` during a failing run, and a stop after each of the first two writes of the fatigue order and of the enable order.
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
| Design | The five `design/` documents against the code: every refusal name, every fixture and every printed line | `rg` over `design/`, the checker over each fixture, the CLI over the clean fixture |
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
- **Procedure**: Revert the phase's commits. A BOT.md that carries a `routine` block then fails to parse, so the rollback also reverts those files, or the operator rewrites them as `trigger`. A `completed` switch file left under the identity state root is inert once the kind is gone, because nothing reads it, and it is deleted by hand. The `routines/` folder is left alone for the same reason, because an older runtime has no reader for it, and it is deleted by hand. The run record's `until` key is an added key, so an older runtime reads it as absent and no record needs editing, per `contracts/versioning.md` rule 1.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

This phase's build is dispatched, not hand-run. The hub owns the routing and each mode owns its dispatch contract, so this section names the executor, the model, the effort and the worker count, and never restates a mode's flags [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:16]. Two hub rules bind every dispatch: the target mode's `SKILL.md` is read before its prompt is composed [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198], and the executor CLI is the HOW, so it never overrides this phase's own workflow [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:206].

`R` is `.skilled/skills/system-skilled-bots/runtime` and `F` is `.skilled/skills/system-skilled-bots/scripts/fixtures`, as in `tasks.md`.

### Executor roster

Five executors, no sixth. Every row is a mode of the `cli-external-orchestration` hub, and each row's `SKILL.md` was read before this table was written.

| Executor | Model | Effort | Dispatch shape | Source |
|----------|-------|--------|----------------|--------|
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` or `--thinking max` | `pi -p --offline --model llmgateway/deepseek-v4.1-flash-1017 --thinking <level> --mode text </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:157] |
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` or `#max` on the model id | `opencode run -m opencode-go/deepseek-v4.1-flash#max --format json </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:146] |
| `cli-mistral-vibe` | `deepseek-flash` | `thinking = "max"` on the roster row, and no flag exists to change it | `vibe -p "$PROMPT" --model deepseek-flash --output-dir "$RUN_DIR/out" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] |
| `cli-devin` | `deepseek-v4-1-flash-max` | baked into the model id, so no flag carries it | `devin -p --model deepseek-v4-1-flash-max --permission-mode dangerous -- "$PROMPT" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156] |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort="xhigh"` with `-c service_tier="fast"` | `codex exec --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:138] |

`cli-pi` is the only row whose effort is a standalone flag, so it is the only row where `high` and `max` are a choice on the command line rather than a property of the model id [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:157]. `cli-codex` sets effort through `-c model_reasoning_effort=` because no `--reasoning-effort` flag exists [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:138]. `cli-devin` and `cli-mistral-vibe` bake the tier into the id or the row, so a dispatch cannot raise or lower it [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89].

### Effort policy

- **`high`** for a small mechanical task: a verb name, a field name, a count, a path, a one-line help entry, a doc line.
- **`max`** for a design or tricky task: a new module, a new shared record, a seam between two phases, a refusal name a test asserts.
- **`gpt-6-luna` at `xhigh` on the `fast` service tier** for the hardest task in the build, and as the last fallback when every other row is out of usage.
- **GPT models only through `cli-codex`.** No other row in this roster reaches a GPT model, so a task that needs one is a `cli-codex` task by definition.

### Dispatch rules every worker carries

- Read the target mode's `SKILL.md` before composing the prompt, and attach the resolved agent persona to every dispatch [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:199].
- Compose every prompt as the child preamble, then the inlined persona, then the task, and set `AI_SESSION_CHILD=1` on the run [SOURCE: .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:68].
- One change per brief: the file, the edit and the check that proves it [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:168].
- Read the outcome record, not stdout. A clean stdout proves nothing, and `cli-mistral-vibe` counts a run complete only when `export.json` records `exit_code` 0 and `outcome` `finished` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:116].
- After every wave the orchestrator runs `git status --porcelain` and confirms the wave touched only the files its workers were given. A file outside the wave's set is a lost worker, not a bonus.

### Self-invocation guards

A running CLI skill never dispatches itself, so the orchestrator removes its own runtime's row from the roster before the first wave, and the ladder below is written to survive one row being gone.

| Executor | Refuses when | Source |
|----------|--------------|--------|
| `cli-mistral-vibe` | `VIBE_SESSION=1` is set, or `vibe-rs` or `vibe-app-server` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:16] |
| `cli-opencode` | the runtime is OpenCode | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:10] |
| `cli-codex` | `$CODEX_SESSION_ID` or any `CODEX_*` env var is set, or `codex` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:10] |
| `cli-devin` | `$DEVIN_PROJECT_DIR` is set, or `devin` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:10] |
| `cli-pi` | never for being inside Pi; only from inside a fan-out lineage or when `cli-pi` already appears in the dispatch stack | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:10] |

### Fallback ladder

Every wave walks the same ladder, and a wave names only its entry point. A row is skipped, not retried, when its guard refuses or its usage is exhausted. The order is the parent's [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:209].

1. `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017`, `--thinking high` or `max`.
2. `cli-opencode` at `opencode-go/deepseek-v4.1-flash#high` or `#max`.
3. `cli-mistral-vibe` at `deepseek-flash`, skipped when `VIBE_SESSION=1` is set.
4. `cli-devin` at `deepseek-v4-1-flash-max`, probed first with a trivial read-only call, because quota exhaustion gates the paid families and the banner alone is not a refusal [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237].
5. `cli-codex` at `gpt-6-luna`, `xhigh`, `fast`, as the last fallback.

`cli-pi` is first because it is the one row whose effort is a flag and whose guard never fires for being inside Pi. `cli-codex` is last because it is the hardest-task row and the one a build should not spend on a mechanical edit.

### Waves

`tasks.md` owns the ordered work and each task's own verify clause. This table owns the dispatch grouping: which tasks start together, at what tier, and how many workers the file overlap allows. A wave is one dispatch round, and the orchestrator reads the wave's verify step before the next wave starts. The worker count is set by file overlap, never by how many tasks a wave holds: two workers never write the same file, so a wave whose tasks write one file runs one worker.

| Wave | Task ids | Executor | Model | Effort | Workers in parallel | What sets the worker count |
|------|----------|----------|-------|--------|---------------------|----------------------------|
| W0 | T001-T004, T011 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 1 | T001 and T002 both write `scratch/setup-notes.md`, and T011 is the only writer of `state-root.ts` |
| W1 | T005-T010, T012, T014, T034, T035 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 3 | Three disjoint file sets: the routine pair, the state module, the switch and record pair |
| W2 | T013, T015-T019, T026 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 3 | Three disjoint file sets: definition and runner, installer and status, the fixtures |
| W3 | T020, T021 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 2 | The checker and the CLI verb share no file |
| W4 | T022-T025 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 2 | Four disjoint doc files, paired into two workers |
| W5 | T027, T028 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 2 | The two test files share no file |
| W6 | T029-T031 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 1 | All three are read-only runs, and T031 writes only `scratch/` |
| W7 | T032, T033 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 1 | T032 is the only writer of `acceptance-criteria.md` |

### W0 - Setup and the state-root folder

- **Task ids**: T001, T002, T003, T004, T011
- **Executor**: `cli-pi`, because it is the one row whose effort is a standalone flag and whose guard never fires for being inside Pi [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:10]
- **Model**: `llmgateway/deepseek-v4.1-flash-1017`
- **Effort**: `--thinking high`, because four tasks are reads and greps and the fifth adds one folder name
- **Workers in parallel**: 1. T001 and T002 both write `scratch/setup-notes.md`, so a second worker would race it, and T011 is the only writer of `state-root.ts`.
- **Orchestrator verify after the wave**: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0, which is the baseline T002 recorded, and `rg -c 'routines' .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` prints 2.
- **Fallback order**: `cli-pi` → `cli-opencode` → `cli-mistral-vibe` → `cli-devin` after a probe → `cli-codex`. A read wave is the cheapest to re-run, so the orchestrator does the reads itself before it spends the last fallback.

### W1 - The two new modules

- **Task ids**: T005, T006, T007, T008, T009, T010, T012, T014, T034, T035
- **Executor**: `cli-pi`
- **Model**: `llmgateway/deepseek-v4.1-flash-1017`
- **Effort**: `--thinking max`, because two new modules carry the block rules and the fatigue count, and a wrong shape here is read by every later wave
- **Workers in parallel**: 3. Worker A takes T005-T007 and writes `.skilled/skills/system-skilled-bots/runtime/lib/routine.ts` and `.skilled/skills/system-skilled-bots/runtime/tests/routine.vitest.ts`. Worker B takes T008-T010, T034 and T035 and writes `.skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts` and `.skilled/skills/system-skilled-bots/runtime/tests/routine-state.vitest.ts`. Worker C takes T012 and T014 and writes `.skilled/skills/system-skilled-bots/runtime/lib/switches.ts`, `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` and `.skilled/skills/system-skilled-bots/runtime/tests/run-record.vitest.ts`. No two sets share a file.
- **Orchestrator verify after the wave**: `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine.vitest.ts tests/routine-state.vitest.ts tests/run-record.vitest.ts` exits 0.
- **Fallback order**: `cli-pi` → `cli-opencode` → `cli-mistral-vibe` → `cli-devin` after a probe → `cli-codex`. A worker that runs out mid-module hands its whole file set to the next row, because a half-written module is worse than an unwritten one.

### W2 - The wiring and the fixtures

- **Task ids**: T013, T015, T016, T017, T018, T019, T026
- **Executor**: `cli-pi`
- **Model**: `llmgateway/deepseek-v4.1-flash-1017`
- **Effort**: `--thinking max`, because the two runner hooks are the seam between the block and the record, and the floor refusal has to land in the installer before anything is written
- **Workers in parallel**: 3. Worker A takes T013 and T015-T017 and writes `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts`, `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts`, `.skilled/skills/system-skilled-bots/runtime/tests/definition.vitest.ts` and `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts`. Worker B takes T018 and T019 and writes `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts`, `.skilled/skills/system-skilled-bots/runtime/lib/status.ts`, `.skilled/skills/system-skilled-bots/runtime/tests/installer.vitest.ts` and `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts`. Worker C takes T026 and writes the ten `routine-*` fixtures under `.skilled/skills/system-skilled-bots/scripts/fixtures/`. No two sets share a file.
- **Orchestrator verify after the wave**: `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0, `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/definition.vitest.ts tests/runner.vitest.ts tests/installer.vitest.ts tests/status.vitest.ts` exits 0, and `ls .skilled/skills/system-skilled-bots/scripts/fixtures | rg -c '^routine-'` prints 10.
- **Fallback order**: `cli-pi` → `cli-opencode` → `cli-mistral-vibe` → `cli-devin` after a probe → `cli-codex`. The fixtures are the wave's cheapest re-run, so a worker that loses its row hands the fixtures to the next row first and the two code sets second.

### W3 - The refusals and the verb

- **Task ids**: T020, T021
- **Executor**: `cli-pi`
- **Model**: `llmgateway/deepseek-v4.1-flash-1017`
- **Effort**: `--thinking max`, because nine refusal names and the `enable` answer path are what the acceptance criteria assert by name
- **Workers in parallel**: 2. Worker A takes T020 and writes `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` and `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts`. Worker B takes T021 and writes `.skilled/bin/bots.cjs`, `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts`, `.skilled/skills/system-skilled-bots/runtime/tests/cli-run.vitest.ts` and `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts`. The two sets share no file.
- **Orchestrator verify after the wave**: `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean` exits 0, and `node .skilled/bin/bots.cjs routines --repo .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean` exits 0 and prints two rows.
- **Fallback order**: `cli-pi` → `cli-opencode` → `cli-mistral-vibe` → `cli-devin` after a probe → `cli-codex`. This is the wave where the last fallback is a real option, because a refusal name that ships wrong is a name every later phase quotes.

### W4 - The docs the author and the reader use

- **Task ids**: T022, T023, T024, T025
- **Executor**: `cli-pi`
- **Model**: `llmgateway/deepseek-v4.1-flash-1017`
- **Effort**: `--thinking high`, because each task is one doc line naming a block or a verb
- **Workers in parallel**: 2. Worker A takes T022 and T025 and writes `.skilled/skills/system-skilled-bots/assets/bot-template.txt` and `.skilled/skills/system-skilled-bots/runtime/lib/README.md`. Worker B takes T023 and T024 and writes `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` and `.skilled/skills/system-skilled-bots/bots-status/SKILL.md`. Four disjoint files, paired into two dispatches rather than four.
- **Orchestrator verify after the wave**: `rg -c 'routine' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints 1, `rg -c 'routine' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints at least 1, `rg -c 'bots routines' .skilled/skills/system-skilled-bots/bots-status/SKILL.md` prints at least 1, and `rg -c 'routine.ts|routine-state.ts' .skilled/skills/system-skilled-bots/runtime/lib/README.md` prints 2.
- **Fallback order**: `cli-pi` → `cli-opencode` → `cli-mistral-vibe` → `cli-devin` after a probe → `cli-codex`. A doc wave is the one place the orchestrator writes the line itself rather than spend a dispatch, because the check is a single `rg`.

### W5 - The contract tests

- **Task ids**: T027, T028
- **Executor**: `cli-pi`
- **Model**: `llmgateway/deepseek-v4.1-flash-1017`
- **Effort**: `--thinking high`, because each task mirrors a test that already exists
- **Workers in parallel**: 2. Worker A takes T027 and writes `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts`. Worker B takes T028 and writes `.skilled/skills/system-skilled-bots/runtime/tests/cli-run.vitest.ts`. The two files are disjoint.
- **Orchestrator verify after the wave**: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/bot-check.vitest.ts tests/cli-run.vitest.ts` exits 0.
- **Fallback order**: `cli-pi` → `cli-opencode` → `cli-mistral-vibe` → `cli-devin` after a probe → `cli-codex`.

### W6 - The whole gate

- **Task ids**: T029, T030, T031
- **Executor**: `cli-pi`
- **Model**: `llmgateway/deepseek-v4.1-flash-1017`
- **Effort**: `--thinking high`, because all three are runs of commands the earlier waves already proved
- **Workers in parallel**: 1. T029 runs the whole suite, so a second worker running a suite beside it would race the same temp state, and T031 writes only `scratch/`.
- **Orchestrator verify after the wave**: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 and `npm run typecheck` exits 0, and `T=$(mktemp -d) && cp -R .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean "$T/checkout" && XDG_STATE_HOME="$T/state" node .skilled/bin/bots.cjs routines --json --repo "$T/checkout" | jq -e '.version == 1 and (.routines | length == 2) and (.routines[0].botId != null) and (.routines[0].untilMetAt == null)'` exits 0.
- **Fallback order**: `cli-pi` → `cli-opencode` → `cli-mistral-vibe` → `cli-devin` after a probe → `cli-codex`. A gate wave that loses its row is run by the orchestrator directly, because a dispatch that only runs `npm test` costs a run for nothing.

### W7 - The packet

- **Task ids**: T032, T033
- **Executor**: `cli-pi`
- **Model**: `llmgateway/deepseek-v4.1-flash-1017`
- **Effort**: `--thinking high`, because T032 copies evidence that already exists into eleven rows and T033 runs one command
- **Workers in parallel**: 1. T032 is the only writer of `acceptance-criteria.md`, and T033 must read the file T032 finished.
- **Orchestrator verify after the wave**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer --strict` prints `RESULT: PASSED`, and `rg -c '\| Unmet \|' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/acceptance-criteria.md` prints 0.
- **Fallback order**: `cli-pi` → `cli-opencode` → `cli-mistral-vibe` → `cli-devin` after a probe → `cli-codex`. The last wave is the one the orchestrator keeps for itself when every row is out of usage, because a validator run and eleven status cells need no model.
<!-- /ANCHOR:external-orchestration -->

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
