---
title: "Goal: Completed-Run Extension (--extend=N)"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "completed run extension goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension"
    last_updated_at: "2026-11-17T17:15:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-completed-run-extension"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Completed-Run Extension (--extend=N)

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Let an operator add N more iterations to a completed deep-research or deep-review run in the same session and generation, without `--restart`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The flag is `--extend=N` (optional `--extend-minutes=M`) and it maps to the reserved lineage mode `completed-continue`; no separate vocabulary. |
| D2 | The extension is recorded as a new ledger stem per loop, `run_extended`, appended through the gateway. |
| D3 | The config is mutated in place inside the loop lock, before classification; `createdAt` is never re-stamped. |
| D4 | `maxIterations = continuedFromRun + N` and `maxDurationMinutes = max(prior, elapsedMinutesAtExtension) + M`, M defaulting to the prior budget. |
| D5 | Both loops ship together; `fork` stays deferred. |
| D6 | A fan-out run rejects `--extend` before `step_fanout_spawn` with a named error; per-lineage extension is not built. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `rg -c '\| Unmet \|' acceptance-criteria.md` in this folder prints nothing, so each of its 19 rows is `Met`, `Waived` or `Superseded`.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run` prints no failure that is absent from `scratch/baseline.txt`, and `check-ledger-stem-producers.cjs`, `check-projection-coverage.cjs` and `check-contract-drift.cjs` all exit 0.
- [ ] `/doctor:runtime-mirrors` reports no drift for the `deep-research` and `deep-review` agents.
- [ ] Each of `deep-research/manual-testing-playbook` and `deep-review/manual-testing-playbook` lists an `--extend=N` scenario written by `/create:manual-testing-playbook`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
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
| Phase spec authored | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` written from `../research/research.md` §19 and §20 |
| Implementation | Pending | Not started |
| Session save | Done | operator decisions written to decision-record.md |

### Deviations and findings

| Item | Note |
|------|------|
| Stem-producer table disagreement | The producer table marks `deep_research.run_resumed` as having no writer, while `on_resume` appends a `resumed` row that the upcast maps to that stem (verification log V3). Check it when T005 edits the table. |
| Open questions | Decided 2026-11-17: the operator accepted all four recommended defaults in `spec.md` §10, recorded as ADR-001 to ADR-004 in `decision-record.md` (T003 done). CHK-004 still waits on the T004 `:confirm` trace. |
| Plan review amendments 2026-11-17 | Applied the Fable 5.2 plan review: presentation bindings, the five legacy-name lifecycle sites and the projected `extended` row, fan-out rejection (D6 added), wider deferred-wording sweep including the runtime mirrors, compiled-contract regeneration, mirror sync, test homes and command forms, and playbook scenarios through `/create:manual-testing-playbook`. Acceptance criteria grew from 13 to 19 rows. |
<!-- /ANCHOR:log -->
