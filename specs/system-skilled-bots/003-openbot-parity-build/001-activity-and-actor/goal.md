---
title: "Goal: Phase 1: activity-and-actor"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/001-activity-and-actor"
    last_updated_at: "2026-11-25T19:52:34Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-001-activity-and-actor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: activity-and-actor

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give a reader one grouped activity read with a named source for each of its seven groups, current on every read, a JSON inbox and a name on every answer and run, so a shared identity stops erasing who did what and the terminal screen reads payloads that match its contract.

This phase answers to `../goal.md`, the packet's durable directive, and its decisions bind the detail below. `design/data-model.md` holds every choice a builder would otherwise make.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The activity read adds no table, so `SCHEMA_VERSION` stays `'2'` and the DDL does not move. `needs_you`, `done`, `stopped` and `failed` come from the index. `working` comes from a live lease side file, `scheduled` from a queued request and an installed schedule's next fire, `recurring` from each installed schedule. |
| D2 | The actor is a name, never a path: `--as` is validated against `^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$` before it is stored, and no filesystem call takes it. |
| D3 | The tty refusal lives in `bots.cjs` alone, so `answerItem` takes the actor as an argument and a channel daemon or a test passes it with no tty. |
| D4 | The answer's `scope` is `once` or `deny` and defaults to `once`. The `grants` object and the precedence ladder stay with 006-approval-grants, which fills `grants.scope` from this answer's `scope`. |
| D5 | A definition's declared sandbox is a request, not a grant: it is capped at `workspace-write` unless the operator installed the bot with `--full-access`, and the cap is read from the install record. |
| D6 | `kind` lands in the needs-you item's key list as a key only, and no writer in this phase writes it. 005-memory owns its values and the absent-means-`decision` default. |
| D7 | The refresh on read is incremental and never applies retention or rebuilds, and every record of a stale identity goes through `indexRunRecord`. |
| D8 | `activity.ts` is pure and imports `status-index` types only. `status.ts` reads every file the activity read needs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

`SCRATCH` is a fresh `mktemp -d` folder holding the scratch checkout `tasks.md` T000 builds. Every `bots.cjs` command that reads or writes state passes `--repo "$SCRATCH/checkout"`, and every vitest command runs in a subshell, per `contracts/verification.md` V10 and V11.

- [x] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/activity.vitest.ts` prints no `failed` line, and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/activity.vitest.ts -t "^bots activity one data set$")`, `-t "^bots activity refresh on read$"` and `-t "^bots activity row sources$"` each print `Tests  1 passed`, so every row carries `actor,at,botId,identity,runId,schedule,state`.
- [x] `node .skilled/bin/bots.cjs inbox --json --repo "$SCRATCH/checkout" | jq -c .` prints `{"version":1,"items":[]}`, and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "^bots inbox prints the answered item under --all$")` and `-t "^the activity and inbox payloads match the screen's types$"` each print `Tests  1 passed`.
- [x] `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer records the actor in by$")`, `-t "^bots answer records the scope and refuses another$"` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/needs-you.vitest.ts -t "^needs-you item reads an old answer as by null and scope once$")` each print `Tests  1 passed`.
- [x] `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/actor.vitest.ts -t "^actor pinned$")` prints `Tests  1 passed`, and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/status-index.vitest.ts -t "^building and rebuilding carries the actor in the run summary$")` and `-t "^opening the index accepts a write into an index built by the old DDL$"` each print `Tests  1 passed`.
- [x] `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "^bots answer refuses a foreign actor without a tty$")`, `-t "^bots answer refuses a write from a bot child$"` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer takes an explicit actor with no tty$")` each print `Tests  1 passed`, and `node .skilled/bin/bots.cjs answer item-1 yes --scope always` prints `bots: grant-scope-unsupported`.
- [x] `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/posture.vitest.ts -t "^posture matrix caps a declared danger-full-access without full access$")` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/resume.vitest.ts -t "^resume requests keeps danger-full-access for a full-access bot the drain resumes$")` each print `Tests  1 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "^bots schedule install records full access for a non-cron bot$")` prints `Tests  1 passed`, so a manual, queue or git-hook bot can be granted full access.
- [x] `rg -n "activity-groups.ts" .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints one line, and `rg -c "activity-rows.ts" .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints nothing.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor` prints `RESULT: PASSED (5/5 checks)` |
| External orchestration section | Done | `rg -n '^## 8\. External orchestration' specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md` prints one line |
| Design artifacts | Done | `design/data-model.md`, `design/state-machines.md`, `design/refusals.md` and `design/fixtures/` written 2026-11-26 from work order WO-02 |
| Packet validation | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor --strict` prints `RESULT: PASSED` |
| W0 setup reads | Done | Three `cli-mistral-vibe` lanes, seven runs, each `export.json` `0`/`finished`. Baseline on `b04f9f9718e`: `Test Files  35 passed (35)` and `Tests  381 passed (381)`, typecheck exit 0. `SCHEMA_VERSION = '2'`, no `activity` verb, no `'by'` key, no `actor` field and no `fullAccess` read |
| W1 to W9 implementation | Done | Every wave ran on `cli-mistral-vibe` with `deepseek-flash`, and every `export.json` read `0`/`finished` except T025 in W7, which a backend 502 stopped. T025 ran again on `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017` and passed its verify. Each wave's named filters printed their stated pass counts before its tasks were marked |
| W10 verification | Done | `npm test` printed `Test Files  37 passed (37)` and `Tests  424 passed (424)` with exit 0 against the baseline of 35 files and 381 tests. The type-check exited 0. On a fresh scratch checkout `bots activity`, `bots activity --json` and `bots inbox --json` each exited 0. AC-001 to AC-016 are `Met` |

### Deviations and findings

| Item | Note |
|------|------|
| Effort below the phase row | Since 2026-11-27 the parent's phase row fixes this phase at `cli-mistral-vibe` on `deepseek-flash` at `max (fixed)` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION", row 001]. Vibe has no effort flag, so the parent's tier rule now sets only the fallback tier [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"]: W0, W6, W8, W9 and W10 fall back to `cli-pi` at `high` and the design waves fall back at `max`. |
| Fallback order | `plan.md` §8 walks the parent's ladder, `cli-mistral-vibe` then `cli-pi` then `cli-opencode` then `cli-devin` then `cli-codex` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"]. |
| Parent binding row | This file is the target of the parent's `001-activity-and-actor` row, so that row resolves. The parent's strict run still reports `SPECDOC_SUFFICIENCY_006` for each child goal that does not exist yet. It printed 9 at the time of writing, for `006-approval-grants` through `014-deep-review`. |
| Full-access criteria merged | The amended criteria list held eight bullets and `check-goal.cjs` allows three to seven. The posture and resume check (AC-009) and the non-cron `--full-access` check (AC-016) both prove REQ-009, so they now share one bullet. Every command stays as it was. |
| No open question | The packet's `spec.md` §10 records a decision for every question it raises, so this goal carries none. |
| Frozen-file amendments | `design/data-model.md` section 12 lists seven one-line fixes the frozen contracts need, for their owners to apply: a `status.ts` row in `runtime-architecture.md` 1.3, two install record keys in `records.md` 4, the settled `kind` row in `versioning.md` 2, three refusal rows in `refusals.md` 3.1 and, in the screen contract, section 10 step 2 with the REQ-011 text, two field-table rows and AC-013. |
| Verbatim edits changed | The screen contract's REQ-003 and REQ-011 rows lost their serial commas, and REQ-011 says every listed record goes through `indexRunRecord` and every step after the stamp read is one transaction, to agree with the contract's own section 10 and to close the gap it left for this phase. REQ-012 names the lease side file alone as the `working` source. AC-002 and AC-003 now verify through the one data set and a scratch state root instead of a `jq` read of the live state root, which may hold no row. |
| F-015, pinned operator | The finding offered two ways to close the hole. The assistant took the first on 2026-11-26 under the operator's do-not-ask directive: `SKILLED_BOTS_OPERATOR` is honoured only on a scheduled fire or a scheduled drain, and takes the tty rule everywhere else. `design/data-model.md` section 8, `design/state-machines.md` sections 5 and 6 and REQ-008 state it. |
| F-015, child marker | The finding's second half is the `child-write-refused` bar. The assistant landed it on 2026-11-26 under the operator's do-not-ask directive, for the two write verbs this phase has, `answer` and `enable`, with one named test. `design/data-model.md` section 8.1, `design/refusals.md` row R13, REQ-013, AC-015 and T046 state it. |
| F-026, full access for a non-cron bot | The finding offered two ways. The assistant took the first on 2026-11-26 under the operator's do-not-ask directive: `bots schedule install <id> --full-access` writes the install record for a bot whose trigger is not cron and stops before the plist step. `design/data-model.md` section 9.7, `design/refusals.md` section 3, REQ-009, AC-016 and T047 state it. |
| F-033, the `describe` seam | The finding offered one fix. The assistant took it on 2026-11-26 under the operator's do-not-ask directive: `design/data-model.md` section 1 types the seam as `describe(start: { kind: 'cron'; expression: string }) => string \| null`, so 002's `describeStart` type-checks against it. |
| O-003, O-004 and O-005, anchored filters | The finding offered one fix. The assistant took it on 2026-11-26 under the operator's do-not-ask directive: every test this phase adds has a unique full name, and every filter is anchored `^<full name>$` with a stated pass count, per `contracts/verification.md` V1 and V2. `tasks.md` and `acceptance-criteria.md` carry the names. |
| O-008, the `SBOTS` notation | The finding offered two ways. The assistant took the first on 2026-11-26 under the operator's do-not-ask directive: `SBOTS` is `node .skilled/bin/bots.cjs --repo "$SCRATCH/checkout"`, and T000 builds that checkout with its own `stateRoot`. `tasks.md` Task Notation and `plan.md` section 2 state it, per `contracts/verification.md` V10. |
| O-018, one working directory per cell | The finding offered two ways. The assistant took the second on 2026-11-26 under the operator's do-not-ask directive, because `contracts/verification.md` V11 requires a subshell: every vitest command is `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest ...)`, so the next command in the same cell still resolves from the repository root. |
| O-021 and O-022, the prose style | The finding offered one fix. The assistant took it on 2026-11-26 under the operator's do-not-ask directive: every prose semicolon in this phase's documents became a full stop or a conjunction, and no list carries a comma before its last item. A semicolon inside a code span, a shell command or a literal printed line stays, because it is code. |
| T000 scratch source | The repository root has no `bots/` folder, so the scratch checkout copies the runtime fixture `manual-ok` and renames it `plain`, a manual trigger bot. |
| One data set fixture | `design/fixtures/one-data-set.json` had no install record for `nightly-report`, yet the screen payload draws its `scheduled` and `recurring` rows. The fixture gained that install (`0 2 * * *`, operator `ada`) and its `describe` entry, and `design/fixtures/README.md` now counts four install records. |
| T010 verify wording | The literal grep for `'by'` and `'scope'` prints only the `kind` lines, because the checks are written as `answer.by` and `answer.scope`. The behaviour is proved by the needs-you and answer tests. |
| Scheduled inference | `runner.ts` treats a run as scheduled when the fire marker is set or the request kind is scheduled, queued or resume, because `request-drain.ts` is outside this phase and cannot pass a flag. A hand drain from a shell that exports `SKILLED_BOTS_OPERATOR` would record the pinned name. That gap stays open. |
| Extra export | The T041 worker exported `readRecords` from `status-index.ts` so `status.ts` can refresh a stale identity. It is one keyword in a file no live worker shared. |
| Child bar placement | `bots.cjs` checks the child marker after a successful parse, so a marker with a malformed argv gets the parser's usage line and exit 2 instead of `child-write-refused`. |
| Mirrored pattern | `bots.cjs` is CommonJS and does not load the runtime before parsing, so it repeats `ACTOR_PATTERN` as a literal beside the one in `actor.ts`. |
| Refresh changes stale | Refresh on read means a moved stamp no longer leaves an identity stale. Three existing tests in `status-index.vitest.ts` and `status.vitest.ts` now make an identity stale with an unlistable needs-you folder. The T025 worker moved the stamp once more before that step, so the refresh has a stamp to fail on. |
| Full access proof path | A test has no tty, so the positive full-access test calls `installSchedule` directly. The CLI path was proved by hand through `script` on a scratch checkout: it printed `bots: plain has a manual trigger, so full access is recorded and no schedule is installed` and exited 0, and the record held `fullAccess: true` with no labels. |
| Install probes in a worktree | This build runs in a linked worktree, so an install probe needs the scratch checkout's `.skilled` linked to the worktree's and a `--skilled-tree` that is a plain repository. |
| Inline persona | Vibe and Pi cannot resolve an agent path, so every brief inlines a focused persona summary under exception 2 of the prompt card's section 6.4. |
| Scratch keep file | CHK-051 finds `scratch/.gitkeep`. It is the tracked scaffold file every sibling phase carries, so it stays. The phase wrote nothing else there. |
<!-- /ANCHOR:log -->
