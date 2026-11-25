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

**Objective:** Give a reader one grouped activity read over the status index, a JSON inbox, and a name on every answer and run, so a shared identity stops erasing who did what.

This phase answers to `../goal.md`, the packet's durable directive, and its decisions bind the detail below.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The activity read groups the rows the status index already holds and adds no table, so `SCHEMA_VERSION` stays `'2'` and the DDL does not move. |
| D2 | The actor is a name, never a path: `--as` is validated against `^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$` before it is stored, and no filesystem call takes it. |
| D3 | The tty refusal lives in `bots.cjs` alone, so `answerItem` takes the actor as an argument and a channel daemon or a test passes it with no tty. |
| D4 | The answer's `scope` is `once` or `deny` and defaults to `once`. The `grants` object and the precedence ladder stay with 006-approval-grants, which fills `grants.scope` from this answer's `scope`. |
| D5 | A definition's declared sandbox is a request, not a grant: it is capped at `workspace-write` unless the operator installed the bot with full access, and the cap is read from the install. |
| D6 | `kind` lands in the needs-you item's key list as a key only. 005-memory owns its values and the absent-means-`decision` default. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/activity.vitest.ts` prints no `failed` line, and `node .skilled/bin/bots.cjs activity --json | jq -r '.groups[].rows[] | keys | join(",")'` prints `actor,at,botId,identity,runId,state` on every row.
- [ ] `node .skilled/bin/bots.cjs inbox --json | jq -r '.items[0] | keys | join(",")'` prints `answer,at,botId,createdAt,expiresAt,id,kind,options,question,state`, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "answered item"` prints one passing test.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "by"` and `npx vitest run tests/answer.vitest.ts -t "scope"` each print one passing test.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/actor.vitest.ts -t "pinned"` prints one passing test, and `npx vitest run tests/status-index.vitest.ts -t "actor"` and `npx vitest run tests/status-index.vitest.ts -t "old-ddl"` each print one passing test.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-run.vitest.ts -t "tty"` and `npx vitest run tests/answer.vitest.ts -t "explicit actor"` each print one passing test, and `node .skilled/bin/bots.cjs answer item-1 yes --scope always` prints `bots: grant-scope-unsupported`.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/posture.vitest.ts -t "cap"` prints one passing test.
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
| Packet validation | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor --strict` prints `RESULT: PASSED` |
| W0 setup reads | Pending | `plan.md` §8 Waves, row W0 |
| W1 to W9 implementation | Pending | `plan.md` §8 Waves, rows W1 to W9 |
| W10 verification | Pending | `plan.md` §8 Waves, row W10 |

### Deviations and findings

| Item | Note |
|------|------|
| Effort below the phase row | The parent's phase row fixes this phase at `--thinking max` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:194]. That is the phase's primary effort and its ceiling. The parent's tier rule is what sets a mechanical wave at `high` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:188], so W0, W6, W8, W9 and W10 run at `high` and the design waves run at `max`. |
| Fallback order | `plan.md` §8 walks the parent's ladder, `cli-pi` then `cli-opencode` then `cli-mistral-vibe` then `cli-devin` then `cli-codex` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:209]. |
| Parent binding row | This file is the target of the parent's `001-activity-and-actor` row, so that row resolves. The parent's strict run still reports `SPECDOC_SUFFICIENCY_006` for each child goal that does not exist yet; it printed 9 at the time of writing, for `006-approval-grants` through `014-deep-review`. |
| No open question | The packet's `spec.md` §10 records a decision for every question it raises, so this goal carries none. |
<!-- /ANCHOR:log -->
