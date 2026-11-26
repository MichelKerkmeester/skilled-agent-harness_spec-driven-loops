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
| D1 | `starts` keeps the list shape and v1 accepts exactly one entry. A second entry is refused by name, never dropped. |
| D2 | `until` is prose and never reaches a shell, and `until_check` is the only command the hook runs. |
| D3 | `starts[0]` is the only source of `trigger`, so the installer, slot accounting and status keep reading the field they read today. |
| D4 | The fatigue count reads the run records under the identity's `records/` folder, not the derived status index. |
| D5 | A `completed` switch kind carries the outcome, rather than a reason field on `disabled`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

`R` is `.skilled/skills/system-skilled-bots/runtime`, `F` is `.skilled/skills/system-skilled-bots/scripts/fixtures` and `S` is a fresh `mktemp -d` folder holding a copy of `$F/routine-clean` at `$S/checkout`, as in `tasks.md`. A vitest filter is anchored `^<full name>$` and states its pass count, and a `bots.cjs` command that reads or writes state passes `--repo "$S/checkout"`, per `contracts/verification.md` V1, V2 and V10.

- [ ] `for d in .skilled/skills/system-skilled-bots/scripts/fixtures/routine-*; do node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs "$d" >/dev/null 2>&1; rc=$?; echo "${d##*/} $rc"; done` prints ten lines: `routine-clean 0`, and `1` for each of the nine defect fixtures.
- [ ] `node .skilled/bin/bots.cjs routines --repo "$S/checkout"` exits 0 and prints two rows, and `T=$(mktemp -d) && cp -R .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean "$T/checkout" && XDG_STATE_HOME="$T/state" node .skilled/bin/bots.cjs routines --json --repo "$T/checkout" | jq -e '(.version == 1) and (.routines | length == 2) and (.routines[0].botId != null)'` exits 0.
- [ ] `(cd $R && npx vitest run tests/routine.vitest.ts -t "^routine block ")` and `(cd $R && npx vitest run tests/routine-state.vitest.ts -t "^routine state ")` each print `Tests  5 passed`, and `(cd $R && npx vitest run tests/runner.vitest.ts -t "^manual run, happy path runs the until check after a completed run$")`, `(cd $R && npx vitest run tests/installer.vitest.ts -t "^preflight refuses a cron start under fifteen minutes$")`, `(cd $R && npx vitest run tests/cli-run.vitest.ts -t "^bots routines lists the routines and their switches$")` and `(cd $R && npx vitest run tests/answer.vitest.ts -t "^bots answer answers with no resume$")` each print `Tests  1 passed`.
- [ ] `(cd $R && npm test)` exits 0 and `(cd $R && npm run typecheck)` exits 0.
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
| Tasks T001-T044 | Pending | `rg -c '^- \[ \] T[0-9]' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md` prints 44 |

### Deviations and findings

| Item | Note |
|------|------|
| Waves live in `plan.md`, not `tasks.md` | The sibling phases 012, 013 and 014 keep their wave table in `tasks.md` §Waves. This run's write scope is `goal.md` and `plan.md` only, so the wave table sits in `plan.md` §8 and `tasks.md` is unchanged. |
| The routine state file is 0600 | `contracts/records.md` section 6 calls it owner-only and `writeStateAtomic` sets no mode, so the writer chmods after every write. `contracts/runtime-architecture.md` section 2.1 still marks the node `umask`, and `design/records.md` section 7 names that line as the one the operator changes, because this phase cannot edit the contract folder. |
| The enable's answer text is `enabled` | `contracts/answer-seam.md` leaves the text to this phase. `enabled` is not in the NO set, so the answer records the scope `once` and the grant is written with it. |
| The fatigue and enable write orders are fixed here | The work order asks for a transition contract and the packet contracts state none. `design/state-machines.md` sections 2 to 4 fix the order, what each stop leaves and the one repair. |
| Every test file has its own task | T036 to T044 each name one test file, the tests it adds and an anchored filter with a stated pass count, so no implementation task has to prove itself against a file it does not write. The choice was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive, as the first alternative the finding named. |
| The eight parse reasons carry the `definition.` prefix | The checker already prefixes a parse refusal with `definition.`, so the eight routine parse reasons print as `FAIL: definition.routine-...` and only the floor prints unprefixed. The choice was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive, as the first alternative the finding named. |
| The `starts` precedence is cron first | `routine-starts-multiple-cron` wins when two or more entries are cron, then `routine-starts-cron-not-first` when exactly one entry is cron and it is not at index 0, then `routine-starts-multiple`. The choice was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive, as the first alternative the finding named. |
| An absent `kind` reads as `decision` | The needs-you item's `kind` is a key only in this phase, and a record without it reads as `decision`. The choice was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive, as the first alternative the finding named. |
| The floor and the fatigue rule bind every bot | REQ-005 and REQ-006 each say so in one sentence, with or without a `routine` block, and T044 moves the shipped installer test's two sub-floor expressions to `*/15` so the floor does not refuse a fixture the suite relies on. The choice was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive, as the first alternative the finding named. |
| Every verify clause is an anchored filter with a stated count | A vitest filter is `^<full name>$` and its cell states `Tests  N passed`, a whole-file run is the regression check beside it and never the only check, and a `bots.cjs` command that reads or writes state passes `--repo "$S/checkout"`, per `contracts/verification.md` V1, V2, V5, V6 and V10. The choice was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive, as the first alternative the finding named. |
| The `routines --json` check asserts `version` | The `jq -e` expression opens with `.version == 1`, so a payload that drops the version fails the check rather than passing on its rows alone. The choice was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive, as the first alternative the finding named. |
| Semicolons split and serial commas dropped | Every prose semicolon in this phase's documents became a full stop or a conjunction, and no list carries a comma before its last item. A semicolon inside a code span, a shell command or a literal printed line stays, because it is code. The choice was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive, as the first alternative the finding named. |
<!-- /ANCHOR:log -->
