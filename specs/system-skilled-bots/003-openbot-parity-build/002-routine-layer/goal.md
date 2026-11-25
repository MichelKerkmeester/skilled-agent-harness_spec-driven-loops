---
title: "Goal: Phase 2: routine-layer"
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
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/002-routine-layer"
    last_updated_at: "2026-11-25T19:53:07Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-002-routine-layer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: routine-layer

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Deliver the routine layer of the OpenBot parity build (`specs/system-skilled-bots/003-openbot-parity-build/goal.md`): a BOT.md `routine` block that renders over the triggers that already exist, an `until_check` that stops the bot when its outcome is reached, a fifteen-minute floor, a ten-failure fatigue switch, and a `bots routines` list.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `starts` keeps the list shape and v1 accepts exactly one entry; a second entry is refused by name, never dropped. |
| D2 | `until` is prose and never reaches a shell; `until_check` is the only command the hook runs. |
| D3 | `starts[0]` is the only source of `trigger`, so the installer, slot accounting and status keep reading the field they read today. |
| D4 | The fatigue count reads the run records under the identity's `records/` folder, not the derived status index. |
| D5 | A `completed` switch kind carries the outcome, rather than a reason field on `disabled`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `for d in .skilled/skills/system-skilled-bots/scripts/fixtures/routine-*; do node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs "$d" >/dev/null 2>&1; rc=$?; echo "${d##*/} $rc"; done` prints ten lines: `routine-clean 0`, and `1` for each of the nine defect fixtures.
- [ ] `node .skilled/bin/bots.cjs routines --repo .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean` exits 0 and prints two rows, and `T=$(mktemp -d) && cp -R .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean "$T/checkout" && XDG_STATE_HOME="$T/state" node .skilled/bin/bots.cjs routines --json --repo "$T/checkout" | jq -e '.version == 1 and (.routines | length == 2) and (.routines[0].botId != null)'` exits 0.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/routine.vitest.ts tests/routine-state.vitest.ts tests/runner.vitest.ts tests/installer.vitest.ts tests/cli-run.vitest.ts tests/answer.vitest.ts` exits 0.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 and `npm run typecheck` exits 0.
- [ ] `rg -c 'routine' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints 1, `rg -c 'routine' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints at least 1, and `rg -c 'bots routines' .skilled/skills/system-skilled-bots/bots-status/SKILL.md` prints at least 1.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer --strict` prints `RESULT: PASSED`, and `rg -c '\| Unmet \|' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/acceptance-criteria.md` prints 0.
- [ ] The five `design/` documents agree with the code: `rg -c '^(sequenceDiagram|stateDiagram-v2)$' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/state-machines.md` prints 5, `rg -c '^\| [0-9]+ \| `routine-' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/refusals.md` prints 11, and `rg -c '^\| `routine-[a-z-]+` \| `digest/BOT\.md`' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/fixtures.md` prints 9.

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
| Bound to the parent goal | Done | `specs/system-skilled-bots/003-openbot-parity-build/goal.md` §2 BINDING names `002-routine-layer/goal.md` as this phase's authoritative goal |
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer` printed `RESULT: PASSED (5/5 checks)` |
| External orchestration | Done | `plan.md` §8 names the roster, the eight waves W0-W7 and the fallback ladder |
| Design artifacts | Done | `design/records.md`, `design/state-machines.md`, `design/refusals.md`, `design/fixtures.md` and `design/mockups.md` hold every shape, transition, refusal, fixture and printed line the phase ships |
| Tasks T001-T035 | Pending | `rg -c '^- \[ \] T[0-9]' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md` prints 35 |

### Deviations and findings

| Item | Note |
|------|------|
| Waves live in `plan.md`, not `tasks.md` | The sibling phases 012, 013 and 014 keep their wave table in `tasks.md` §Waves. This run's write scope is `goal.md` and `plan.md` only, so the wave table sits in `plan.md` §8 and `tasks.md` is unchanged. |
| The routine state file is 0600 | `contracts/records.md` section 6 calls it owner-only and `writeStateAtomic` sets no mode, so the writer chmods after every write. `contracts/runtime-architecture.md` section 2.1 still marks the node `umask`, and `design/records.md` section 7 names that line as the one the operator changes, because this phase cannot edit the contract folder. |
| The enable's answer text is `enabled` | `contracts/answer-seam.md` leaves the text to this phase. `enabled` is not in the NO set, so the answer records the scope `once` and the grant is written with it. |
| The fatigue and enable write orders are fixed here | The work order asks for a transition contract and the packet contracts state none. `design/state-machines.md` sections 2 to 4 fix the order, what each stop leaves and the one repair. |
| Test files no task line names | T005-T010, T013-T019 verify against `tests/routine.vitest.ts`, `tests/routine-state.vitest.ts`, `tests/definition.vitest.ts`, `tests/run-record.vitest.ts`, `tests/runner.vitest.ts`, `tests/installer.vitest.ts` and `tests/status.vitest.ts`, and no task line names any of them as a file to write. The wave table counts them as write targets, because a worker that must make a `-t` filter pass writes that file. |
<!-- /ANCHOR:log -->
