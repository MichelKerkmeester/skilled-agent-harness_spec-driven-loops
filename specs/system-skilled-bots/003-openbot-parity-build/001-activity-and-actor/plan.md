---
title: "Implementation Plan: Phase 1: activity-and-actor"
description: "Adds a pure grouping module and an actor resolver to the bots runtime, gathers the live activity sources and the refresh on read in status.ts, extends the needs-you answer and the run record with the actor, records the answer's scope, pins the operator and the full-access flag at install and exposes bots activity, bots inbox --json and bots answer --scope once|deny through the CLI."
trigger_phrases:
  - "activity and actor plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: activity-and-actor

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, run through `tsx` from a Node 22 CLI |
| **Framework** | None. The runtime is plain modules with a `Result<T>` return convention |
| **Storage** | SQLite through `better-sqlite3` for the status index, and JSON files under the user-level state root |
| **Testing** | Vitest, in `.skilled/skills/system-skilled-bots/runtime/tests/` |

### Overview
Two new runtime modules carry the rules: `activity.ts` holds the seven group ids, the mapping of a run row to a group, the order and the text lines as a pure function, and `actor.ts` resolves a name from `--as`, the operator pinned in the job's environment or the OS user. `status.ts` gathers everything `activity.ts` groups: the index after a refresh on read, the live lease side files, the queued requests and the installed schedules with their next fire. The needs-you item gains `by` and `scope` on its answer and `kind` in its key list, the run record gains `actor` and `answeredBy`, the status index gains `actor` inside the run summary JSON and an `updatedAt` meta row without moving `SCHEMA_VERSION` or the DDL, `posture.ts` caps a declared sandbox at `workspace-write` unless the install record grants full access. `bots.cjs` gains the `activity` verb, `--json` and `--all` on `inbox`, `--as` on `answer` and `run`, `--scope once|deny` on `answer`, `--full-access` on `schedule install` and the tty refusals. Every choice a builder would make is in `design/data-model.md`, and the proof is the runtime suite plus the one data set in `design/fixtures/`, which must reproduce the screen's sample payloads.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Each command below runs from the repository root with no tty. `SCRATCH` is a fresh `mktemp -d` folder, so a verb that reads state never builds an index in the live state root, where a first build applies retention [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:16-20].

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs activity` prints `bots: unknown verb: activity` as its first stderr line and exits 2
- [ ] `node .skilled/bin/bots.cjs inbox --json` prints `bots: inbox takes no --json` and exits 2
- [ ] `node .skilled/bin/bots.cjs answer item-1 yes --scope once` prints `bots: unknown option: --scope` and exits 2
- [ ] `rg -n 'SCHEMA_VERSION' .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints three lines: the constant, the reader and the writer, and the constant reads `'2'`
- [ ] `test -f specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/payloads/activity.json && echo present` prints `present`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints `Test Files` with no `failed` line
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0
- [ ] `XDG_STATE_HOME=${SCRATCH:?set SCRATCH to a mktemp -d folder} node .skilled/bin/bots.cjs activity` prints `bots: no activity` and exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered runtime modules behind one CLI. A pure grouping function sits behind one gatherer, so the rule and the file reads are tested apart.

### Key Components
- **`activity.ts`**: owns the seven group ids, their order and titles, the mapping of a run row to one group (`design/data-model.md` section 3), the sort and its tie-break (section 5), the empty-group filter and the text lines (section 7). It is a pure function over `ActivitySources` and imports `status-index` types only, as `../contracts/runtime-architecture.md` section 1.2 allows, so the text and JSON forms cannot disagree and a test feeds it rows directly.
- **`status.ts`**: owns the refresh on read (section 6), which `statusReport` and the new `activityReport` share, and the gathering of the three live sources (section 4). **A run in flight is read from its held lease**: the `<lease>.run.json` side file the runner keeps while the lease is held, kept when its owner pid is alive and no record exists for its run id [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:916-925]. **A next fire is computed here**, from the install record's cron expression through `translateCron` and `listSlots`, the hub's one cron reader [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-lister.ts:71]. A queued request is read from `requests/inbox/`. `status.ts` gains imports from `cron-translator`, `slot-lister`, `request-record` and the deep-loop `processAlive`, which section 12 of the data model reports as an amendment to the frozen module table.
- **`actor.ts`**: owns the precedence `--as` then the pinned operator then the OS user, and the name pattern. It reads `env`, never `resolveEnv`, because the resolved job environment carries the installing operator (section 8). It is the only place a name is validated, so no caller can write an unvalidated one.
- **`status-index.ts`**: owns the index schema. It gains `actor` as a nullable field inside the `summary` JSON and an `updatedAt` row in the `meta` table, and neither `SCHEMA_VERSION` nor the DDL moves, so an index built before this phase still opens and still accepts a write.
- **`posture.ts`**: owns the sandbox cap. `validatePosture` takes `{ fullAccess }` and honors a declared `danger-full-access` only when it is true. The runner reads `fullAccess` from the install record, because a queued or resumed run runs under the drain's environment, not the bot's [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts:222].
- **`bots.cjs`**: owns argument parsing, the exit codes and the tty refusals, in the order `design/state-machines.md` section 6 draws. It gains one verb and five options and no grouping or naming rule of its own.

`actor` and `answeredBy` are nullable top-level fields on the run record and `schemaVersion` stays 1. `answeredBy` is stamped twice: on the parked run's record by the answer, and on the resumed run's record by the runner from the item's `answer.by`. `scope` is a field on the answer, `once` or `deny`, and `answerItem` takes both the actor and the scope as arguments, so a channel daemon or a test passes them with no tty.

### Data Flow
`bots activity --json` → `bots.cjs` parses and calls `activityReport` → `status.ts` opens the index, builds it once if it is missing, refreshes each stale identity in one transaction, reads the snapshot, then lists the lease side files, the queued requests and the install records and computes each next fire → `activity.ts` maps the run rows, adds the open item rows and the live rows, sorts each group and drops the empty ones → `bots.cjs` prints `{"version": 1, "groups": [...]}`.

`bots answer --as ada --scope deny` → `bots.cjs` checks the `--as` value, the scope and the tty in that order → `answerItem` resolves the actor through `actor.ts`, writes `by: "ada"` and `scope: "deny"` on the answer in one write, stamps `answeredBy` on the parked run's record and queues the resume → `bots inbox --json --all` prints the item with its normalized four-key answer. A run dispatches → `runner.ts` resolves the actor from `env` and puts it on the seed, so the lease side file and the record both carry it → `status-index.ts` writes it into the row's `summary` JSON → `bots activity` groups the row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds a field inside a persisted index row's `summary` JSON and a meta row, a field to the answer, two fields to a stored record, two keys to a job's environment and two to the install record, so every producer and consumer of all of them is named here before implementation.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/status-index.ts` | Owns the index schema, `SCHEMA_VERSION` and `RunSummary` | update, `cross-consumer` | `rg -n "SCHEMA_VERSION = " runtime/lib/status-index.ts` prints `'2'`, `rg -n "actor\|updatedAt" runtime/lib/status-index.ts` prints the summary field, the meta write and the read, and `rg -n "ALTER TABLE\|ADD COLUMN" runtime/lib/status-index.ts` prints nothing |
| `runtime/lib/status.ts` | Reads the index and formats `bots status` | update, `algorithmic` | `rg -n "activityReport\|refreshStale\|updatedAt\|processAlive\|translateCron\|listSlots" runtime/lib/status.ts` prints the refresh, the gatherer and the report keys |
| `runtime/lib/activity.ts` | New | create, `algorithmic` | `rg -n "^import" runtime/lib/activity.ts` prints only `import type` lines from `./status-index.js` |
| `runtime/lib/run-record.ts` | Owns `RunRecord` and `validateRunRecord` | update, `cross-consumer` | `rg -n "actor\|answeredBy" runtime/lib/run-record.ts` prints both fields, their checks and their null defaults |
| `runtime/lib/needs-you.ts` | Owns `NeedsYouItem`, `NeedsYouAnswer` and `ITEM_KEYS` | update, `cross-consumer` | `rg -n "'by'\|'kind'\|'scope'" runtime/lib/needs-you.ts` prints all three keys and the checks for `by` and `scope`, and `rg -n "memory-proposal\|skill-proposal" runtime/lib/needs-you.ts` prints nothing because 005 owns `kind`'s values |
| `runtime/lib/answer.ts` | Writes the answer onto the item | update, `class-of-bug` | `rg -n "actor\|answeredBy\|scope" runtime/lib/answer.ts` prints the input fields, the write, the duplicate check and the record stamp |
| `runtime/lib/posture.ts` | Owns `validatePosture` and the sandbox values | update, `algorithmic` | `rg -n "workspace-write\|fullAccess" runtime/lib/posture.ts` prints the cap and the install-time flag |
| `runtime/lib/runner.ts` | Writes the run record and the lease side file | update, `cross-consumer` | `rg -n "actor\|answeredBy\|fullAccess\|export type LeaseSideFile\|export interface LeaseSideFile" runtime/lib/runner.ts` prints the seed field, the resume copy, the install read and the exported type |
| `runtime/lib/plist-render.ts` | Renders and reads back the job environment | update, `instance-only` | `rg -n "OPERATOR\|FULL_ACCESS" runtime/lib/plist-render.ts` prints the render and the read-back of both pinned values |
| `runtime/lib/installer.ts` | Builds `PinnedJobValues` and the install record | update, `cross-consumer` | `rg -n "operator\|fullAccess" runtime/lib/installer.ts` prints both pinned values, both record keys and the two env carriers |
| `runtime/lib/state-root.ts` | Owns the state root and its 0700 mode | not a consumer | `rg -n "actor" runtime/lib/state-root.ts` prints nothing |
| `bin/bots.cjs` | Parses verbs and options, maps exit codes, holds the tty and scope refusals | update, `matrix/evidence` | `XDG_STATE_HOME=${SCRATCH:?set SCRATCH to a mktemp -d folder} node .skilled/bin/bots.cjs activity` exits 0, `node .skilled/bin/bots.cjs answer item-1 yes --as ada < /dev/null` prints `bots: --as needs a tty`, and `rg -n "inbox.*--all" .skilled/bin/bots.cjs` prints the inbox usage line |
| `crates/bots-tui/tests/fixtures/bots` | The screen's fake CLI | not this phase's | `test ! -e crates/bots-tui/tests/fixtures/bots && echo absent` prints `absent`. 003 creates the fixture and this phase checks the screen's sample files against its own output instead |
| `bots-status` skill docs | Name the status verbs | update | `rg -n "bots activity" .skilled/skills/system-skilled-bots/bots-status/` prints the verb |
| `bots-run` skill docs | Name the run verbs | update | `rg -n -- "--as\|--scope\|--full-access" .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` prints all three options |

Required inventories:
- Same-class producers: `rg -n 'answeredAt|answer:' .skilled/skills/system-skilled-bots/runtime/lib/` names every place an answer is written, and `rg -n 'writeRunRecord' .skilled/skills/system-skilled-bots/runtime/lib/` names every place a record is written: the runner's terminal write, the delivery rewrite and, after this phase, the `answeredBy` stamp.
- Consumers of changed symbols: `rg -n 'NeedsYouAnswer|RunRecord|RunSummary|SCHEMA_VERSION|validatePosture|PinnedJobValues|pinnedFromPlist' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names every reader.
- Matrix axes: actor source (3: `--as`, OS user, pinned operator) × run kind (2: interactive, scheduled) × record age (2: written now, written before this phase) = 12 rows, and `actor.vitest.ts` covers all 12. Scope axis: `--scope` (3: `once`, `deny`, absent) × answer path (2: `bots.cjs`, `answerItem` called directly) = 6 rows, and `answer.vitest.ts` covers all 6. Row source axis (7: index item, index run, live lease, stale lease, queued request, unheld schedule, held schedule) and next fire axis (4: calendar inside 1 day, calendar past 32 days, interval with a prior run, interval with none) = 11 rows, and `activity.vitest.ts` test `row sources` covers all 11.
- Algorithm invariant: the actor is a name and never a path. `--as` is validated against `^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$` before it is stored, and no filesystem call takes it. Adversarial cases: an empty value, a value holding `/`, a value holding `..`, a value over 64 characters and a value holding a newline.
- Algorithm invariant: a missing scope is never an allow. `answerItem` writes `once` when no scope is passed, and `bots.cjs` refuses a value outside `once|deny` before the item is read, so no answer records an empty scope. Adversarial cases: `--scope ''`, `--scope always`, `--scope conversation`, `--scope ONCE` and a scope passed with no `--as`.
- Algorithm invariant: a declared sandbox is a request, not a grant. `validatePosture` caps it at `workspace-write` and honors `danger-full-access` only when the install record says `fullAccess: true`, so the cap is read from the install and never from the definition. Adversarial cases: a definition declaring `danger-full-access` on a bot installed without the flag, the same on a bot installed with it and a resumed run of a full-access bot drained by the drain job.
- Algorithm invariant: a read never deletes. The refresh never calls `rebuildIndex` or plans retention. Adversarial case: an identity whose run folders exceed the retention bound, refreshed once, keeps every folder.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads `status-index.ts`, `run-record.ts`, `needs-you.ts`, `posture.ts` and `bots.cjs` and records the current schema version, the record shape, the sandbox values and the verb list. Implementation adds `activity.ts` and `actor.ts`, the `by`, `scope`, `kind`, `actor` and `answeredBy` fields, the index summary field and meta row, the pinned operator and full-access values, the sandbox cap, the refresh and the gatherer in `status.ts` and the CLI surfaces. Verification runs the runtime suite, the typecheck, the one data set against the screen's samples, the CLI probes and the notices check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `activity.ts` grouping, order and tie-break, `actor.ts` precedence and pattern, `validateNeedsYouItem` and the old-answer read, `validateRunRecord`, `validatePosture`'s sandbox cap, the answer's `scope` default and refusal | Vitest |
| Integration | The one data set in `design/fixtures/one-data-set.json` against the screen's `payloads/activity.json` and `payloads/inbox.json`, the refresh on read after a run lands, a live and a stale lease side file, a queued and a claimed request, a held and an unheld install, `bots answer --as` and `--scope` through the item file, `answerItem` called with an explicit actor and no tty, the answered item `bots inbox --json --all` prints, a write into an index built by the old DDL, a scheduled run's pinned operator, a `danger-full-access` definition on a bot installed without the flag | Vitest with a temporary state root and `TZ=UTC` |
| Payload type | Every key of the screen's `status.json`, `activity.json` and `inbox.json` whose Producer is `today` or `packet 001`, against the real output by Type and Null, as `design/fixtures/README.md` defines it | Vitest in `cli-run.vitest.ts` |
| Manual | `bots activity`, `bots activity --json`, `bots inbox --json` and `bots answer --scope deny` against the live state root | The `bots` CLI |

The test matrix adds two rows the old plan lacked: where a run in flight is read from (a live lease side file gives a `working` row, a dead owner pid or an existing record gives none) and where a next fire is computed (an unheld install's cron through `translateCron` and `listSlots`, a held one gives none).

The one command that decides the phase is `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run`, which must print no `failed` line, followed by `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck`, which must exit 0, and `XDG_STATE_HOME=${SCRATCH:?set SCRATCH to a mktemp -d folder} node .skilled/bin/bots.cjs activity`, which must exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `better-sqlite3` | External | Green | The index cannot open, so `bots activity` has no rows. The module already loads it through `loadBinding` |
| `tsx` | External | Green | The CLI cannot load a `.ts` runtime module. `bots.cjs` already registers it |
| `vitest` | External | Green | No test runs. The runtime's `package.json` already declares it |
| `jq` | External | Green | The CLI checks in the acceptance criteria cannot run. `/usr/bin/jq` is present |
| OpenBot's two MIT files | External | Green | `app/src/lib/bot-lifecycle/activity-groups.ts` and `shared/activity-rows.ts` are in `specs/system-skilled-bots/context/OpenBot-main/` |
| The screen's sample payloads | Internal | Green | The one data set has nothing to match. They are in `003-terminal-screen/002-architecture-and-contracts/design/payloads/` |
| 002-routine-layer's `describeStart` | Internal | Not landed | Live `schedule` stays null. This phase proves the field with a stub and 002 wires the real phrase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `bots activity` misgroups a row, a read deletes a file, or a run record written before this phase is refused by `bots status --rebuild`.
- **Procedure**: Run `bots disable` on every bot whose definition declares `danger-full-access`, because an older runtime honors a declared sandbox with no cap. Then revert the one commit. `actor`, `answeredBy`, `by`, `scope` and the install record keys are additive, so an older reader ignores them. No item this phase writes carries `kind`, so none is refused. `SCHEMA_VERSION` stays `'2'` and the DDL does not change, so an index built before this phase still opens and still accepts a write. `design/data-model.md` section 10 lists each change and its cost.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

This phase's build is dispatched, not hand-run. The roster below is the closed set of executors the build may use, and the wave table assigns every task in `tasks.md` to one of them. The hub owns the routing and each mode owns its dispatch contract, so this section names the executor, the model, the effort and the worker count and never restates a mode's flags [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:26].

### Executor roster

| Executor | Model | Effort | Source |
|----------|-------|--------|--------|
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` or `--thinking max` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:157] |
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` or `#max` on the model id | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:146] |
| `cli-mistral-vibe` | `deepseek-flash` | `thinking = "max"` on the roster row, and no flag exists to change it | [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] |
| `cli-devin` | `deepseek-v4-1-flash-max` | baked into the model uid, so no flag carries it | [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md:59] |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort="xhigh"` with `-c service_tier="fast"` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:165] |

Each row's own `SKILL.md` owns its flags, its stdin redirect and its outcome record, so this table names the executor, the model and the effort and stops there. A worker reads its mode's `SKILL.md` before it composes a command.

`cli-pi` is the only row whose effort is a standalone flag, so it is the only row where `high` and `max` are a choice on the command line rather than a property of the model id [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:157]. `cli-codex` sets effort through `-c model_reasoning_effort=` because no `--reasoning-effort` flag exists [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:138]. `cli-devin` and `cli-mistral-vibe` bake the tier into the id or the row, so a dispatch cannot raise or lower it.

### Effort policy

- **`high`** for a small mechanical task: a read that records a current value, a test that mirrors an existing one, a doc line, a notice entry.
- **`max`** for a design or tricky task: a new module, a new field on a stored record, a seam between install and dispatch, the refresh on a read path, the CLI's refusal surface.
- **`gpt-6-luna` at `xhigh` on the `fast` service tier** for the hardest task in the build, and as the last fallback when every other row is out of usage.
- **GPT models only through `cli-codex`.** No other row in this roster reaches a GPT model, so a task that needs one is a `cli-codex` task by definition.

The parent's phase row fixes this phase at `cli-pi` and `--thinking max` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:197]. That `max` is the phase's primary effort and its ceiling. The parent's tier rule is what sets a mechanical wave below it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:191], so W0, W6, W8, W9 and W10 run at `high` and the design waves run at `max`.

### Dispatch rules every worker carries

- Read the target mode's `SKILL.md` before composing the prompt, and attach the resolved agent persona to every dispatch [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198].
- Compose every prompt as the child preamble, then the inlined persona, then the task, and set `AI_SESSION_CHILD=1` on the run [SOURCE: .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:60].
- One change per brief: the file, the edit, the `design/` section it implements and the check that proves it.
- Read the outcome record, not stdout. A clean stdout proves nothing, and `cli-mistral-vibe` counts a run complete only when `export.json` records `exit_code` 0 and `outcome` `finished` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:116].
- The executor CLI is the HOW. It never overrides this phase's own workflow, so a worker that finishes its brief stops and reports rather than widening its scope [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:206].

### Self-invocation guards

A running CLI skill never dispatches itself, so the orchestrator removes its own row from the roster before the first wave. The ladder below is written to survive one row being gone.

| Executor | Refuses when | Source |
|----------|--------------|--------|
| `cli-mistral-vibe` | `VIBE_SESSION=1` is set, or `vibe-rs` or `vibe-app-server` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:16] |
| `cli-opencode` | the runtime is OpenCode | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:10] |
| `cli-codex` | `$CODEX_SESSION_ID` or any `CODEX_*` env var is set, or `codex` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:10] |
| `cli-devin` | `$DEVIN_PROJECT_DIR` is set, or `devin` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:10] |
| `cli-pi` | never for being inside Pi, only from inside a fan-out lineage or when `cli-pi` already appears in the dispatch stack | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:10] |

### Fallback ladder

Every wave walks this ladder from its own entry point, and a wave names only that entry point. A row is skipped, not retried, when its guard refuses or its usage is exhausted. The order is the parent's [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:212].

1. `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017`, `--thinking high` or `max`.
2. `cli-opencode` at `opencode-go/deepseek-v4.1-flash#high` or `#max`.
3. `cli-mistral-vibe` at `deepseek-flash`, skipped when `VIBE_SESSION=1` is set.
4. `cli-devin` at `deepseek-v4-1-flash-max`, probed first with a trivial read-only call, because quota exhaustion gates the paid families and the banner alone is not a refusal [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237].
5. `cli-codex` at `gpt-6-luna`, `xhigh`, `fast`, as the last fallback.

A wave that reaches the end of the ladder without a working executor stops and reports the wave, its task ids and the last refusal. It does not author a file by hand outside the dispatch contract.

### Waves

The parent's worker rule sets the bound: no two workers touch one file, so a wave's worker count is the number of disjoint file groups its tasks fall into, and this phase's row caps it at 3 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:193] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:197]. A wave runs at one effort, so a wave holds only tasks of one tier.

| Wave | Task ids | Executor | Model | Effort | Workers | File groups |
|------|----------|----------|-------|--------|---------|-------------|
| W0 | T001, T002, T003, T004, T005, T006 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 3 | reads only, so no file is written: (T001, T002) / (T003, T004) / (T005, T006) |
| W1 | T007, T008, T009 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 2 | `activity.ts` (T007, T008) / `actor.ts` (T009) |
| W2 | T010, T012, T013, T014 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 3 | `needs-you.ts` (T010) / `run-record.ts` (T012) / `status-index.ts` (T013, T014) |
| W3 | T011, T015, T018 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 3 | `answer.ts` (T011) / `runner.ts` (T015) / `posture.ts` (T018) |
| W4 | T016, T017 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 2 | `plist-render.ts` (T016) / `installer.ts` (T017) |
| W5 | T019, T020, T021, T041, T042 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 2 | `bots.cjs` (T019, T020, T021) / `status.ts` (T041, T042) |
| W6 | T022, T024, T026 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 3 | `activity.vitest.ts` (T022) / `needs-you.vitest.ts` with `answer.vitest.ts` (T024) / `posture.vitest.ts` with `resume.vitest.ts` (T026) |
| W7 | T023, T025, T043 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 3 | `actor.vitest.ts` (T023) / `run-record.vitest.ts` with `status-index.vitest.ts` (T025) / `activity.vitest.ts` (T043) |
| W8 | T027, T032, T033, T044, T045 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 3 | `cli-run.vitest.ts` (T027, T033) / `bots-run/references/run-queue-and-answer.md` (T032) / `status.vitest.ts` with `installer.vitest.ts` (T044, T045) |
| W9 | T028, T029, T030, T031 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 3 | `THIRD_PARTY_NOTICES.md` (T028) / `lib/README.md` (T029) / `bots-status/references/status-and-inbox.md` with `bots-status/SKILL.md` (T030, T031) |
| W10 | T034, T035, T036, T037, T038, T039 | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 1 | commands only, so no file is written |

W2 and W3 are split by dependency, not by tier: `answer.ts` writes the `by` and `scope` that `needs-you.ts` declares and stamps the `answeredBy` that `run-record.ts` declares, so T011 waits for W2. W5's two workers share no file: `bots.cjs` calls `activityReport` by the signature `design/data-model.md` section 1 fixes, so it can be written beside `status.ts`, and the wave's verify runs only once both are in. T043 waits for W6 because it edits the file T022 creates.

### Verify after each wave

The orchestrator runs these itself and reads the output. A wave that fails its own verify does not hand off to the next one. `SCRATCH` is a fresh `mktemp -d` folder per wave.

| Wave | Verify |
|------|--------|
| W0 | `rg -n "SCHEMA_VERSION = " .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints one line holding `const SCHEMA_VERSION = '2'`, the T002, T003, T004 and T006 `rg` commands print their recorded values and the T005 baseline `Test Files` line is written into `goal.md` §4. |
| W1 | `rg -n "needs_you\|recurring" .skilled/skills/system-skilled-bots/runtime/lib/activity.ts` prints the seven ids in order, `rg -n "^import" .skilled/skills/system-skilled-bots/runtime/lib/activity.ts` prints only type imports from `./status-index.js`, `rg -n "ACTOR_PATTERN\|resolveActor\|trim" .skilled/skills/system-skilled-bots/runtime/lib/actor.ts` prints all three and `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0. |
| W2 | The four `rg` commands T010, T012, T013 and T014 name print, `rg -n "ALTER TABLE\|ADD COLUMN" .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints nothing and `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0. |
| W3 | The three `rg` commands T011, T015 and T018 name print and `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0. |
| W4 | The two `rg` commands T016 and T017 name print and `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0. |
| W5 | `XDG_STATE_HOME=${SCRATCH:?set SCRATCH to a mktemp -d folder} node .skilled/bin/bots.cjs activity` prints `bots: no activity` and exits 0, `XDG_STATE_HOME=${SCRATCH:?set SCRATCH to a mktemp -d folder} node .skilled/bin/bots.cjs inbox --json --all` exits 0 and prints `{"version": 1, "items": []}` in its two-space form, `node .skilled/bin/bots.cjs answer item-1 yes --as ada < /dev/null` prints `bots: --as needs a tty`, `node .skilled/bin/bots.cjs answer item-1 yes --scope always` prints `bots: grant-scope-unsupported` and the two `rg` commands T041 and T042 name print. |
| W6 | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/activity.vitest.ts tests/needs-you.vitest.ts tests/answer.vitest.ts tests/posture.vitest.ts tests/resume.vitest.ts` prints no `failed` line. |
| W7 | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/actor.vitest.ts tests/run-record.vitest.ts tests/status-index.vitest.ts tests/activity.vitest.ts` prints no `failed` line. From the runtime folder `npx vitest run tests/actor.vitest.ts -t "adversarial"`, `npx vitest run tests/activity.vitest.ts -t "refresh on read"` and `npx vitest run tests/activity.vitest.ts -t "row sources"` each print one passing test. |
| W8 | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts tests/status.vitest.ts tests/installer.vitest.ts` prints no `failed` line, `XDG_STATE_HOME=${SCRATCH:?set SCRATCH to a mktemp -d folder} node .skilled/bin/bots.cjs activity --json \| jq -e '.version == 1 and (.groups \| type == "array")'` exits 0, `XDG_STATE_HOME=${SCRATCH:?set SCRATCH to a mktemp -d folder} node .skilled/bin/bots.cjs inbox --json \| jq -e '.version == 1 and (.items \| type == "array")'` exits 0 and `rg -n -- "--as\|--scope\|--full-access" .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` prints all three options. |
| W9 | The four `rg` commands T028 to T031 name print and `rg -n "activity-groups.ts\|activity-rows.ts" .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints two lines. |
| W10 | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints no `failed` line, `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0, `XDG_STATE_HOME=${SCRATCH:?set SCRATCH to a mktemp -d folder} node .skilled/bin/bots.cjs activity` exits 0 and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/status-index.vitest.ts -t "old-ddl"` prints one passing test. |

T040 is the phase gate, so the orchestrator runs it itself after W10 rather than dispatching it: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor --strict` must print `RESULT: PASSED`. Its output decides the handoff to 002-routine-layer, so no worker reports it second-hand.
<!-- /ANCHOR:external-orchestration -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing, it only reads | Implementation |
| Implementation | Setup's recorded schema version and verb list, and `design/` | Verification |
| Verification | Implementation's modules and CLI surfaces | The phase handoff to 002-routine-layer, which wires `describeStart` into `activityReport` |
<!-- /ANCHOR:phase-deps -->

---
