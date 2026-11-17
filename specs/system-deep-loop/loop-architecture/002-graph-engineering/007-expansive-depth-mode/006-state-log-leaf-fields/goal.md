---
title: "Goal: Restore the research leaf fields the state-log projection drops (D7, D9)"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "state log leaf fields goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields"
    last_updated_at: "2026-11-17T17:15:00Z"
    last_updated_by: "scaffold"
    recent_action: "Operator decided ADR-001: option 1, widen the upcast"
    next_safe_action: "Capture the REQ-006 baseline (T002)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-state-log-leaf-fields"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Restore the research leaf fields the state-log projection drops (D7, D9)

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make the research `findings_not_enumerated` gate and the `focusAlignment` guard run on real leaf data carried through a widened ledger upcast, the option the operator chose.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Option 1: widen the research upcast, stem schema, type and projection (`decision-record.md` ADR-001, Accepted 2026-11-17). |
| D2 | Frontier fields and the identity fields `runId`, `sessionId` and `lineageId` stay off state-log rows. |
| D3 | The parent packet's own files are not edited from this phase; needed parent wording is recorded in ADR-001. |
| D4 | `focusAlignment` evaluates only the latest record that carries both lists, and compares normalized text with a leading question-id prefix removed. |
| D5 | Which landed-iteration reasons may trigger `redispatch_once` is decided by `../013-no-redispatch-landed-iteration/`, not here. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `rg -n 'Accepted' decision-record.md` prints the ADR-001 status line.
- [x] A `verify-iteration.vitest.ts` case whose gateway-projected state row claims `findingsCount: 3` with nothing enumerated returns reason `findings_not_enumerated`, and a route-proof case on a projected row passes with no "route proof came from deltas" warning.
- [x] `convergence-script.vitest.ts` cases report `focusAlignment` `failed` when the latest record answers outside its `keyQuestions`, `passed` after a later aligned iteration, and `passed` for `Q1: `-prefixed `keyQuestions` matching bare answered text.
- [x] `deep-research-projections-contract.vitest.ts` asserts these ten keys on a projected research `iteration` row: `target_agent`, `agent_definition_loaded`, `resolved_route`, `findingsCount`, `keyQuestions`, `noveltyJustification`, `focusTrack`, `edgeCase`, `toolsUsed`, `sourcesQueried`.
- [x] `rg -n '"keyQuestions"' .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` prints the record-shape line, and `check-contract-drift.vitest.ts` passes after the research contract is regenerated.
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/append-mode-event-cli.vitest.ts tests/unit/append-mode-event-legacy-seam.vitest.ts tests/unit/check-projection-coverage.vitest.ts tests/unit/deep-research-projections-contract.vitest.ts tests/unit/deep-research-ledger-schema.vitest.ts tests/unit/verify-iteration.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts tests/unit/prompt-pack.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/integration/convergence-script.vitest.ts` exits 0, with a pass count equal to the baseline in this goal's log plus the new cases.
- [x] `rg -l "focusAlignment" .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook` lists a scenario written by `/create:manual-testing-playbook`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase docs authored | Done | `spec.md`, `plan.md`, `tasks.md`, `decision-record.md` |
| ADR-001 operator decision | Done | 2026-11-17: option 1, widen the upcast (`decision-record.md` OD-001) |
| Session save | Done | operator decisions written to decision-record.md |
| Baseline (T002) | Done | 2026-11-17 on integration tip `c898b3ad9a3`: the ten REQ-006 suites, 237 passed, exit 0 |
| Implementation | Done (code and tests) | Ten suites 252 passed (baseline plus 15 new). Nine new cases failed before any source edit. Criteria 1-6 met. Criterion 7 (playbook) and the changelog entry are written by @markdown in integration after merge |
| Generation-2 replay (T018) | Recorded | Five deltas replayed as projected rows: `verify` passes 5 of 5. `focusAlignment` fails 4 of 5 (iterations 2-5): three answered a question absent from their own `keyQuestions`, and one wrote the bare id `Q6` as its key question |
| Playbook and changelog | Done | DR-067 scenario and `deep-research/changelog/v1.15.17.0.md` (deep-research 1.15.17.0, with the `SKILL.md` version carrier). The facts check reports 0 errors and the playbook validator reports 0 violations. Criterion 7 is met |

### Deviations and findings

| Item | Note |
|------|------|
| Default-run change | Widening switches both checks on for every research run; parent section 20 Slice F and the code agree. The changelog states it. |
| Plan review | The 2026-11-17 plan review findings were applied: consumer risks enumerated with a case each, pack record shape and contract regeneration, `focusAlignment` scoped and prefix-tolerant, the ten-field list and the route-proof survival task, renumbered REQ and task ids, decision-record label fixed, the 013 redispatch interaction recorded, runnable test commands, and this phase's own playbook scenario. |
<!-- /ANCHOR:log -->
