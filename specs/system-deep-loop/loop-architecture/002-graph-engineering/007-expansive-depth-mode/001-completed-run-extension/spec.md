---
title: "Feature Specification: Completed-Run Extension (--extend=N)"
description: "A completed deep-research or deep-review run cannot gain more iterations today; the only path is --restart, which archives the registry, strategy and questions. This phase exposes the reserved completed-continue lineage mode as --extend=N on both loops, with a run_extended ledger event, an in-place config mutation under the lock and a duration ceiling computed from elapsed time."
trigger_phrases:
  - "completed run extension"
  - "completed-continue lineage mode"
  - "extend completed deep research run"
  - "run_extended ledger event"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Completed-Run Extension (--extend=N)

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None |
| **Successor** | None |
| **Source** | `../research/research.md` §19, §20 Slice A, §12 items 5, 8 and 9, §13 D11, §15 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A completed deep-research run halts on `on_completed_session`, and a completed deep-review run re-synthesizes but adds no iterations (defect D11). The reserved `completed-continue` lineage mode is listed as deferred, so the only way to keep working a finished run is `--restart`, which opens a new generation and archives the registry, strategy and questions; the parent packet hit this live when its generation 2 had to open through a restart with a hand-carried Known Context.

### Purpose
An operator runs `/deep:research --extend=N` or `/deep:review --extend=N` on a completed run and gets exactly N more iterations in the same session and generation, with the extension recorded as a `run_extended` ledger event and the run re-synthesized afterwards.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n -A2 '"deferredModes"' .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json
36:    "deferredModes": [
37-      "fork",
38-      "completed-continue"
$ rg -n 'const LIVE_LINEAGE_MODES' .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs
27:const LIVE_LINEAGE_MODES = new Set(['new', 'resume', 'restart']);
$ rg -n 'run_extended' .skilled/skills/system-deep-loop/runtime | wc -l
       0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Expose `completed-continue` as `--extend=N` with an optional `--extend-minutes=M` on both `/deep:research` and `/deep:review`; in research move the mode from `lineage.deferredModes` to `lineage.allowedModes`, and in review teach the flat lineage fields and `LIVE_LINEAGE_MODES` the new mode.
- Add one new ledger stem per loop, `deep_research.run_extended` and `deep_review.run_extended`, appended through the gateway, and handle it in every hand-written place that handles `run_resumed` today: ledger schemas and types, stem-producer tables, the upcaster, both typed reducers, both legacy projections and the lifecycle-event filters in both `reduce-state.cjs`. The legacy projections write the stem back as a state-log row with `event: 'extended'`, the twin of `run_restarted` projecting to `restarted`, and the reducers' five lifecycle sites match on that legacy name, not on the stem: research `deep-research/scripts/reduce-state.cjs:2245` (lineage filter) and `:2294` (terminal-stop lifecycle check), review `runtime/scripts/reduce-state.cjs:497` (lineage filter), `:549` (`buildTerminalStopState`) and `:591`.
- Reject `--extend` together with fan-out in a pre-spawn guard that runs before `step_fanout_spawn` (research `deep-research.yaml:327`, review `deep-review.yaml:304`), beside `step_apply_lifecycle_request` (research `:270`, review `:247`), which already runs before fan-out, with a named usage error. `step_preflight_contract` cannot hold the rejection: it sits inside `phase_init`, and a fan-out run jumps from `step_fanout_spawn` straight to `phase_synthesis`, skipping `phase_init`, `step_acquire_lock` and `step_classify_session`, so neither the guard nor the pre-classify step would ever run there.
- Bind `--extend` and `--extend-minutes` in both presentation assets, where `lineage_mode` is bound today (`deep-research-presentation.txt:47`, `:70`, `:107-108`; `deep-review-presentation.txt:39`, `:72`, `:120-121`).
- Add a locked pre-classify step to both workflow YAMLs that mutates the config in place (status `complete` to `initialized`, `maxIterations = continuedFromRun + N`, `maxDurationMinutes = max(prior, elapsedMinutesAtExtension) + M`, `continuedFromRun` set) after `step_acquire_lock` and before `step_classify_session`, never re-stamping `createdAt`.
- Add a synthesis snapshot step that copies the prior synthesis before the extension's first dispatch, under a name that survives repeated extensions.
- Update every doc that calls the mode deferred, not wired, reserved or not to be exposed, the two `system-spec-kit` assertions that pin the "deferred" wording, and the proving test suites listed in `plan.md`.
- Regenerate both compiled command contracts after the YAML, command-doc, presentation, config, protocol, `SKILL.md` and agent edits, and sync the ten runtime agent mirrors after the agent edits.
- Write the manual testing playbook scenarios for `--extend=N` through `/create:manual-testing-playbook`, not by hand.

### Out of Scope
- The `fork` lineage mode - it stays deferred; only `completed-continue` is promoted.
- The expansive frontier sub-mode and the other change slices B to M - each is a separate phase of the parent packet.
- A new segment model for the dashboard - `run_extended` already serves as the before/after boundary (research §19 item 7).
- Automatic question injection on extension - open question 1, decided by ADR-001; this phase documents the window and warns instead.

### Files to Change

Paths are relative to `.skilled/`. `S/` is `skills/system-deep-loop/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `commands/deep/research.md`, `commands/deep/review.md` | Modify | `--lineage-mode` rows; document `--extend=N` and `--extend-minutes=M` |
| `commands/deep/assets/deep-research.yaml`, `deep-review.yaml` | Modify | lineage param, `note_deferred_branches`, locked pre-classify step, `on_resume` event choice, snapshot step, pre-spawn fan-out rejection before `step_fanout_spawn` |
| `commands/deep/assets/deep-research-presentation.txt`, `deep-review-presentation.txt` | Modify | bind `--extend` and `--extend-minutes` beside the `lineage_mode` binding |
| `commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown` | Regenerate | `compile-command-contracts.cjs --write`; never edited by hand |
| `S/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts`, `deep-research-ledger-types.ts` | Modify | `run_extended` stem, payload fields, stem-producer table row |
| `S/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts`, `deep-review-ledger-types.ts` | Modify | same for review |
| `S/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | Modify | upcast for the legacy `run_extended` row |
| `S/runtime/lib/deep-research-reducers/deep-research-reducer.ts`, `S/runtime/lib/deep-review-reducers/deep-review-reducer.ts` | Modify | routing tables and every `assertNeverStem` switch |
| `S/runtime/lib/legacy-projections/deep-research-contract.ts`, `deep-review-state-contract.ts` | Modify | write the new stem back into the state log |
| `S/deep-research/scripts/reduce-state.cjs`, `S/runtime/scripts/reduce-state.cjs` | Modify | lifecycle-event filters; review `LIVE_LINEAGE_MODES` |
| `S/deep-research/assets/deep-research-config.json`, `S/deep-review/assets/deep-review-config.json` | Modify | research `lineage` lists; review flat fields |
| `S/deep-research/references/protocol/loop-protocol.md`, `S/deep-review/references/protocol/loop-protocol.md` | Modify | lifecycle branch contract, snapshot rule |
| `S/deep-review/assets/review-mode-contract.yaml`, `S/deep-review/references/state/state-format.md` | Modify | drop the "deferred" wording |
| `S/deep-review/references/protocol/quick-reference.md`, `S/deep-research/references/guides/quick-reference.md` | Modify | flag rows |
| `S/deep-research/SKILL.md`, `S/deep-research/assets/deep-research-strategy.md` | Modify | drop the "deferred" wording |
| `agents/deep-research.md`, `agents/deep-review.md` | Modify | lineage-mode notes |
| Runtime agent mirrors: `../.claude/agents/deep-{research,review}.md`, `../.codex/agents/deep-{research,review}.toml`, `../.pi/agents/deep-{research,review}.md`, `../.vibe/agents/deep-{research,review}.toml`, `../.dsh/agents/deep-{research,review}.patch.yml` | Sync | all ten carry the `completed-continue` wording; synced through `/doctor:runtime-mirrors`, not hand-edited |
| `S/deep-review/README.md`, `S/deep-research/README.md` | Modify | drop the "deferred" and "not wired" wording (`S/deep-research/README.md:197`) |
| `S/deep-research/references/guides/capability-matrix.md` | Modify if needed | `:44` and `:84` list `completed-continue` as live vocabulary and as the reopened-packet branch; check both hold after the change |
| `S/deep-research/feature-catalog/loop-lifecycle/initialization.md` | Modify through `/create:feature-catalog` | `:27` says the mode is "not exposed as live modes" |
| `skills/system-spec-kit/runtime/cli/tests/deep-review-contract-parity.vitest.ts`, `deep-review-reducer-schema.vitest.ts` | Modify | the two assertions that pin "deferred" |
| Existing `S/runtime/tests/unit/` suites: `workflow-restart-lifecycle`, `deep-research-ledger-schema`, `deep-review-ledger-schema`, `append-mode-event-legacy-seam`, `deep-research-reducers`, `deep-review-reducers`, `deep-research-reduce-state`, `deep-review-state-reducer`, `loop-heartbeat` | Modify | new cases listed in `plan.md` §5 |
| `S/deep-research/manual-testing-playbook/entry-points-and-modes/`, `S/deep-review/manual-testing-playbook/entry-points-and-modes/` | Modify through `/create:manual-testing-playbook` | one `--extend=N` scenario per loop and the package index |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `/deep:research --extend=N` and `/deep:review --extend=N` on a completed run resolve to lineage mode `completed-continue`; the research config lists the mode in `lineage.allowedModes` and not in `lineage.deferredModes`, and the review reducer keeps `completed-continue` instead of mapping it to `null`. |
| REQ-002 | An extension appends exactly one `deep_research.run_extended` or `deep_review.run_extended` event through the gateway, carrying `priorTailDigest`, the unchanged sessionId and generation, `continuedFromRun`, and `extension: {addedIterations, priorMaxIterations, newMaxIterations, priorMaxDurationMinutes, newMaxDurationMinutes, elapsedMinutesAtExtension}`. |
| REQ-003 | The config mutation runs in a new step after `step_acquire_lock` and before `step_classify_session` in both YAMLs; it sets status from `complete` to `initialized`, sets `continuedFromRun`, and leaves `createdAt` byte-identical. |
| REQ-004 | `maxIterations` after extension equals `continuedFromRun + N`, where `continuedFromRun` counts every `type: iteration` row (one per iteration number, error and timeout rows included); a run that stopped at 7 of 10 with `--extend=3` gets a cap of 10. |
| REQ-005 | `maxDurationMinutes` after extension equals `max(priorMaxDurationMinutes, elapsedMinutesAtExtension) + M`, with M defaulting to the prior budget when `--extend-minutes` is omitted; an extension started later than the old budget after `createdAt` dispatches at least one iteration before the duration check can stop it. |
| REQ-006 | The new stem is handled in both ledger schemas and types, the stem-producer tables, the upcaster, both typed reducers' routing tables and `assertNeverStem` switches, both legacy projections and the five lifecycle sites in the two `reduce-state.cjs` files (research `:2245`, `:2294`; review `:497`, `:549`, `:591`), which match the projected legacy row `event: 'extended'`; each stem-producer table lists `run_extended` as `spoken` with its workflow YAML as producer, unlike research `run_resumed`, which is `reserved`; `check-ledger-stem-producers` and `check-projection-coverage` pass, and a projection test shows the `extended` row in the state log. |
| REQ-007 | Before the extension's first dispatch, the workflow snapshots `research/research.md` (research) or `review/review-report.md` (review) under a name that does not collide on a second extension of the same generation. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | The extension writes one landing mechanism per loop: the plan's chosen combination of `resumed` and `run_extended` events, and for review the pre-classify mutation rather than an `on_completed_session` branch, each pinned by a test. |
| REQ-009 | The telemetry ledger accepts two `completed` terminal rows for one sessionId without error, proven by a double-terminal test. |
| REQ-010 | Every live doc line that calls `completed-continue` deferred, not wired, reserved or not to be exposed is updated (the 11 lines named in the verification log row F7, `note_deferred_branches`, the YAML comment lines, `S/deep-review/README.md`, `S/deep-research/README.md:197`, `S/deep-research/feature-catalog/loop-lifecycle/initialization.md:27`, `S/deep-research/references/protocol/loop-protocol.md:121` and the ten runtime agent mirrors); `rg -n 'completed-continue' .skilled .claude/agents .codex/agents .pi/agents .vibe/agents .dsh/agents --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' --glob '!**/fixtures/**' \| rg -i -e 'deferred' -e 'not wired' -e 'reserved' -e 'MUST NOT be exposed' -e 'not exposed'` prints nothing. Changelogs, benchmark reports and retrieval fixtures are history and stay unchanged. |
| REQ-011 | The two `system-spec-kit` assertions that pin the deferred wording (`deep-review-contract-parity.vitest.ts:126`, `deep-review-reducer-schema.vitest.ts:120-121`) change with the wording and pass; the assertions that only require the name `completed-continue` still pass unchanged. |
| REQ-012 | Default runs that never pass `--extend` keep their current behavior: the existing `workflow-restart-lifecycle` and `deep-review-auto-restart-contract` suites pass unchanged in their existing cases. |
| REQ-013 | Under `stopPolicy: convergence`, the docs state that an extension with no new questions re-stops on `all_questions_answered` (research) or `all_dimensions_clean` (review), and name the `--convergence-mode=off` or `max-iterations` window or inbox injection as the way to keep it running. They also state that a run which completed on consecutive failures re-stops at the consecutive-failure check (`convergence.cjs:1127`) even under `--convergence-mode=off`, because that check runs before the `off` branch (`:1134`). |
| REQ-014 | `--extend` together with a fan-out config is rejected by a pre-spawn guard placed before `step_fanout_spawn` in both YAMLs, with a named usage error, before any lineage spawns. Proof: A `workflow-restart-lifecycle` case reads both YAMLs and finds the rejection line above the `step_fanout_spawn:` line. |
| REQ-015 | An extended run is not terminal before its first new iteration lands: with the `extended` row after `synthesis_complete`, both reducers return no terminal stop and review keeps `continuedFromRun` instead of nulling it under `terminalStop ? null`. Proof: One case in `deep-research-reduce-state.vitest.ts` and one in `deep-review-state-reducer.vitest.ts`. |
| REQ-016 | Both presentation assets bind `--extend` and `--extend-minutes` beside `lineage_mode`. Proof: A binding case in `workflow-restart-lifecycle.vitest.ts`, beside "research.md and the presentation bind lineage_mode", passes for both loops. |
| REQ-017 | Both compiled command contracts are regenerated after every digested source edit in this phase. Proof: `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` exits 0, and `check-contract-drift.vitest.ts` passes. |
| REQ-018 | The ten runtime agent mirrors match the edited `.skilled/agents/deep-research.md` and `deep-review.md`. Proof: `/doctor:runtime-mirrors` reports no drift for the two agents. |
| REQ-019 | One manual testing playbook scenario per loop covers `--extend=N` on a completed run, written through `/create:manual-testing-playbook`. Proof: Each `entry-points-and-modes/` category gains a scenario file and the package index lists it. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fixture run completed at 7 of 10 iterations, extended with `--extend=3`, ends with 10 iteration rows, one `run_extended` event and status `complete`, in the original sessionId and generation.
- **SC-002**: A fixture extension whose `createdAt` is older than the prior budget dispatches its first iteration instead of stopping on the duration check.
- **SC-003**: The deep-loop vitest suites (`cd .skilled/skills/system-deep-loop/runtime && npx vitest run`), `check-ledger-stem-producers`, `check-projection-coverage`, `check-contract-drift` and the two updated `system-spec-kit` suites exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None. Slice A depends on no other slice and comes first in the parent's order (research §20). | None | None needed |
| Risk | Ledger-schema drift: a new stem missing from a legacy projection fails silently, so the event sits in the ledger and never reaches the state log. A stem missing from a typed reducer fails to compile, which is safe. | High | Run `check-ledger-stem-producers` and `check-projection-coverage`, and add a `run_extended` projection test case. |
| Risk | Duration re-stop: wall-clock time since `createdAt` counts idle time, so a plain `+= M` stops every next-day extension before its first dispatch. | High | The `max(prior, elapsed) + M` rule with a default M, and a duration-ceiling test that starts the extension after the old budget. |
| Risk | Immediate re-stop under `stopPolicy: convergence` when the question set is unchanged. | Med | Document the window (REQ-013) and warn when nothing is queued (ADR-001). |
| Risk | Status `initialized` may classify differently in an untraced `:confirm` branch. | Med | Task T004 traces every `:confirm` branch before the YAML edit (ADR-003). |
| Risk | Fan-out bypass: a fan-out run skips `phase_init`, so an extension there would silently do nothing. | Med | REQ-014 rejects the combination before `step_fanout_spawn` with a named error; a check inside `phase_init` would never run for fan-out. |
| Risk | Terminal re-read: the extension suppresses `resumed` (ADR-004), so if the reducers do not match the projected `extended` row, `buildTerminalStopState` keeps the run terminal until the first new iteration lands and review nulls `continuedFromRun`. | High | REQ-015 adds `extended` to the five lifecycle sites and tests both reducers. |
| Risk | Compiled-contract drift: the YAML, command-doc, presentation, config, protocol, `SKILL.md` and agent edits change digested sources, so `check-contract-drift` fails the full gate until the contracts are regenerated, and a parallel phase that also regenerates them conflicts at merge. | Med | REQ-017; regenerate again on the merged tree instead of resolving digest lines by hand. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The pre-classify step reads the state log once and writes the config once; it adds no dispatch.
- **NFR-P02**: N/A for throughput: the loop runs one iteration at a time and the extension changes no per-iteration cost.

### Security
- **NFR-S01**: The config mutation and the event append happen under the existing loop lock, so a concurrent workflow cannot interleave a second extension.
- **NFR-S02**: `--extend` accepts only a positive integer and `--extend-minutes` only a positive integer; anything else is a usage error before the lock is taken.

### Reliability
- **NFR-R01**: The extension is replayable from the ledger: the `run_extended` event alone carries every prior and new budget value.
- **NFR-R02**: A run without `--extend` produces byte-identical state, dashboard and synthesis to today.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `--extend` on a run that is not complete is rejected with a message that names `resume`, and the config is left untouched.
- Maximum input: a second and third extension of the same generation each get their own snapshot and their own `run_extended` event, and `continuedFromRun` grows each time.
- Failure path: `--extend=0`, a negative value or a non-integer exits with a usage error before the lock is acquired; a lock that cannot be acquired leaves the config unchanged.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | About 40 files and 700 LOC across two YAMLs, two ledger schemas, two reducers, two projections, two `reduce-state.cjs`, configs, docs and tests |
| Risk | 14/25 | Ledger schema and shared reducer change; opt-in, so default runs are not affected |
| Research | 6/20 | Design done in research §19 and verified; the four open questions were decided on 2026-11-17 (ADR-001 to ADR-004) |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

All four were decided on 2026-11-17: the operator accepted each recommended default, recorded as ADR-001 to ADR-004 in `decision-record.md`. The `:confirm` trace that the third decision depends on is still task T004.

- Open question 1 (research §12 item 5): under `stopPolicy: convergence`, should `--extend` require inbox question injection (research) or candidate admission (review), or only document the `--convergence-mode=off` / `max-iterations` window? Recommended default: document the window and print a warning when `--extend` runs under `convergence` with no pending inbox rows; coupling stays optional. Decided 2026-11-17: default accepted (ADR-001).
- Open question 2 (research §12 item 8): what name does the pre-extension synthesis snapshot use, given that extension keeps the generation? Recommended default: key it by `continuedFromRun` in both loops, `research/synthesis-v{generation}-r{continuedFromRun}.md` and `review/review-report-v{generation}-r{continuedFromRun}.md`, and amend the research `loop-protocol.md:562` line and the review loop protocol to match. Decided 2026-11-17: default accepted (ADR-002).
- Open question 3 (research §12 item 9): is status `initialized` right for an extended config, and does it classify as `resume` in every `:confirm` branch? Recommended default: use `initialized`, the only other value the workflow writes, and trace every `:confirm` branch (task T004) before the YAML edit; a new `active` value is not introduced. Decided 2026-11-17: default accepted (ADR-003).
- Open question 4 (research §19 item 6): on landing at `resume`, does the extension write both `resumed` and `run_extended`, or suppress `resumed`? Recommended default: write `run_extended` only and suppress the `resumed` row for an extension, so the ledger carries one event per lifecycle action. This default works only together with REQ-015: the five lifecycle sites must match the projected `extended` row, or the run reads as terminal until its first new iteration. Decided 2026-11-17: default accepted (ADR-004).
<!-- /ANCHOR:questions -->

---
