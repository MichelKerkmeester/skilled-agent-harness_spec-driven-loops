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

- [x] `rg -c '\| Unmet \|' acceptance-criteria.md` in this folder prints nothing, so each of its 19 rows is `Met`, `Waived` or `Superseded`.
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run` prints no failure that is absent from `scratch/baseline.txt`, and `check-ledger-stem-producers.cjs`, `check-projection-coverage.cjs` and `check-contract-drift.cjs` all exit 0.
- [x] `/doctor:runtime-mirrors` reports no drift for the `deep-research` and `deep-review` agents.
- [x] Each of `deep-research/manual-testing-playbook` and `deep-review/manual-testing-playbook` lists an `--extend=N` scenario written by `/create:manual-testing-playbook`.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
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
| Implementation | Done on the phase branch | 2026-11-17, worktree 456: commits `32d56a21455`, `2c80c64f391`, `dc00a20a8dd`, `ac4151f027f` and a closing commit. Phase suites pass (ledger-schema 76, typed reducers 144, state reducers 51, legacy seam 6, restart lifecycle 34, heartbeat 5, YAML/doc readers 442, system-spec-kit 18), typecheck exit 0, the three guard scripts exit 0 |
| Mirrors | Done | Every checker `/doctor:runtime-mirrors` lists exits 0 after the generators and the hand-maintained `.claude/agents` twins were updated |
| Open | Waiting on integration | AC-004 (the live walk, T028), AC-010 (REQ-010 still prints two `.vibe/agents` TOML lines, see the 2026-11-17 row above), whole-suite run (T027). AC-019 is Met as of 2026-11-17. |
| Session save | Done | operator decisions written to decision-record.md |
| Playbook, catalog and changelog | Done for 001, walk open | 2026-11-17, `@markdown`: `DR-065` and `DRV-070` written through the update-mode steps (both validators PASS); `initialization.md:27` split (validate_document VALID, DQI 88); changelog `v2.1.0.0` (DQI 89), with step 6 moving the hub version carriers to 2.1.0.0 (parent-skill-check PASS). Open: the walk (CHK-021), and REQ-010 still prints two `.vibe/agents` TOML lines (AC-010). |

### Deviations and findings

| Item | Note |
|------|------|
| Stem-producer table disagreement | The producer table marks `deep_research.run_resumed` as having no writer, while `on_resume` appends a `resumed` row that the upcast maps to that stem (verification log V3). Check it when T005 edits the table. |
| Catalog line (T031) | 2026-11-17: `/create:feature-catalog` stops at a Phase 0 `@markdown` self-check (`create-feature-catalog-presentation.txt:10`) and the task forbids a hand edit. The parent log defers playbooks and changelogs to the integration worktree for the same reason, but not the catalog, so this deferral needs an operator yes. |
| In-step value check | 2026-11-17: the extension step now refuses a non-positive-integer `--extend` or `--extend-minutes` after the lock, beside the prose preflight check, so the refusal is tested (CHK-023, CHK-031). |
| Open questions | Decided 2026-11-17: the operator accepted all four recommended defaults in `spec.md` §10, recorded as ADR-001 to ADR-004 in `decision-record.md` (T003 done). CHK-004 still waits on the T004 `:confirm` trace. |
| Plan review amendments 2026-11-17 | Applied the Fable 5.2 plan review: presentation bindings, the five legacy-name lifecycle sites and the projected `extended` row, fan-out rejection (D6 added), wider deferred-wording sweep including the runtime mirrors, compiled-contract regeneration, mirror sync, test homes and command forms, and playbook scenarios through `/create:manual-testing-playbook`. Acceptance criteria grew from 13 to 19 rows. |
| 2026-11-17 night | Criterion 1 met: AC-004 closed by the DR-065 live walk (`scratch/dr-065-walk.md`), AC-010 by OD-005, and `rg -c '\| Unmet \|'` exits 1 with no output. Criterion 2 met at integration gate `b5fb87abad8`: 186 files, 3185 passed, 0 failed, and the three check scripts exit 0. The final rerun after phase 014 re-confirms it. CHK-021 stays open until DRV-070 is walked live. |
| 2026-11-17 23:1x | The DRV-070 live walk found a defect in the review extension. Runs were counted with `row.run ?? row.iteration`, and the review prompt pack has leaves write `"run":"<run-id>"`, so `--extend=3` after 2 iterations gave `continuedFromRun` 1 and cap 4, not 2 and 5. Fixed in `deep-review.yaml` and `deep-research.yaml` `step_extend_completed_run` to count the integer iteration first with a numeric run fallback, matching `step_read_state`. The new case "review: runs are counted by iteration when the leaf writes a run id string" failed before (1 and 4) and passes after. `workflow-restart-lifecycle` and `stop-policy-yaml-parity` pass 39 of 39, and the contracts regenerate with drift OK. The other DRV-070 signals passed live: one `extended` row, 0 `resumed`, session and generation kept, and the snapshot equal to the prior report. |
<!-- /ANCHOR:log -->
