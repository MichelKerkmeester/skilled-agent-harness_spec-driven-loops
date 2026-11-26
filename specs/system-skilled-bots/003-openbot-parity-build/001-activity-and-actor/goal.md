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

- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/activity.vitest.ts` prints no `failed` line, and `npx vitest run tests/activity.vitest.ts -t "one data set"`, `npx vitest run tests/activity.vitest.ts -t "refresh on read"` and `npx vitest run tests/activity.vitest.ts -t "row sources"` each print one passing test, so every row carries `actor,at,botId,identity,runId,schedule,state`.
- [ ] `XDG_STATE_HOME=$(mktemp -d) node .skilled/bin/bots.cjs inbox --json | jq -c .` prints `{"version":1,"items":[]}`, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "answered item"` and `-t "payload types"` each print one passing test.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "by"`, `npx vitest run tests/answer.vitest.ts -t "scope"` and `npx vitest run tests/needs-you.vitest.ts -t "old answer"` each print one passing test.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/actor.vitest.ts -t "pinned"` prints one passing test, and `npx vitest run tests/status-index.vitest.ts -t "actor"` and `npx vitest run tests/status-index.vitest.ts -t "old-ddl"` each print one passing test.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "tty"` and `npx vitest run tests/answer.vitest.ts -t "explicit actor"` each print one passing test, and `node .skilled/bin/bots.cjs answer item-1 yes --scope always` prints `bots: grant-scope-unsupported`.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/posture.vitest.ts -t "cap"` and `npx vitest run tests/resume.vitest.ts -t "full access resume"` each print one passing test.
- [ ] `rg -n "activity-groups.ts|activity-rows.ts" .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints two lines.
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
| W0 setup reads | Pending | `plan.md` §8 Waves, row W0 |
| W1 to W9 implementation | Pending | `plan.md` §8 Waves, rows W1 to W9 |
| W10 verification | Pending | `plan.md` §8 Waves, row W10 |

### Deviations and findings

| Item | Note |
|------|------|
| Effort below the phase row | The parent's phase row fixes this phase at `--thinking max` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION", row 001]. That is the phase's primary effort and its ceiling. The parent's tier rule is what sets a mechanical wave at `high` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"], so W0, W6, W8, W9 and W10 run at `high` and the design waves run at `max`. |
| Fallback order | `plan.md` §8 walks the parent's ladder, `cli-pi` then `cli-opencode` then `cli-mistral-vibe` then `cli-devin` then `cli-codex` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"]. |
| Parent binding row | This file is the target of the parent's `001-activity-and-actor` row, so that row resolves. The parent's strict run still reports `SPECDOC_SUFFICIENCY_006` for each child goal that does not exist yet. It printed 9 at the time of writing, for `006-approval-grants` through `014-deep-review`. |
| No open question | The packet's `spec.md` §10 records a decision for every question it raises, so this goal carries none. |
| Frozen-file amendments | `design/data-model.md` section 12 lists seven one-line fixes the frozen contracts need, for their owners to apply: a `status.ts` row in `runtime-architecture.md` 1.3, two install record keys in `records.md` 4, the settled `kind` row in `versioning.md` 2, three refusal rows in `refusals.md` 3.1 and, in the screen contract, section 10 step 2 with the REQ-011 text, two field-table rows and AC-013. |
| Verbatim edits changed | The screen contract's REQ-003 and REQ-011 rows lost their serial commas, and REQ-011 says every listed record goes through `indexRunRecord` and every step after the stamp read is one transaction, to agree with the contract's own section 10 and to close the gap it left for this phase. REQ-012 names the lease side file alone as the `working` source. AC-002 and AC-003 now verify through the one data set and a scratch state root instead of a `jq` read of the live state root, which may hold no row. |
<!-- /ANCHOR:log -->
