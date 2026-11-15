---
title: "Feature Specification: Phase 1: deterministic-stop-decision"
description: "The deep-research and deep-review stop decision is computed by the orchestrating model from prose in four workflow files. The review vote ignores the configured threshold, a quality-guard call has no implementation and the two loops treat a missing graph decision in opposite ways. This phase moves the whole decision into convergence.cjs and makes the workflows branch on its JSON."
trigger_phrases:
  - "deterministic stop decision"
  - "phase 1 deterministic stop decision"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: deterministic-stop-decision

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-persisted-loop-state-and-failure-policy |
| **Handoff Criteria** | The `stop_decision` JSON shape and its error surface are frozen and tested. See Phase Context. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Fix every deep-research and deep-review workflow logic, drift and doc finding from the 2026-11-14 analysis specification.

**Scope Boundary**: The stop decision only. That covers the convergence vote, the quality guards, the review legal-stop gates, the graph combination rule, the stop-reason contract and the `step_check_convergence` step in the four workflow files. Persisted loop state, lock and limit handling, single-sourcing the four workflow files and the broader doc sweep belong to phases 002 to 005.

**Dependencies**:
- None. This phase starts from the current `main` tree.

**Deliverables**:
- `convergence.cjs` emits a `stop_decision` object for research and review.
- The four workflow files branch on that object and hold no vote arithmetic.
- Unit and integration tests that fail on today's tree and pass after the change.
- The eight-member stop-reason enum with `maxDurationReached`, ready for phase 003's duration cap.
- Handoff to phase 002: the frozen `stop_decision` field list, the `reasonDetail` value list and the script error surface (`{"status":"error"}` JSON with exit 3 for input errors, 2 for database errors and 1 otherwise, from `classifyExitCode` in `runtime/scripts/lib/cli-guards.cjs`). Phase 002 owns what the loop does when the script itself fails.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The orchestrating model computes the stop vote by hand from prose in `step_check_convergence`, so two runs over the same state can stop at different iterations. The prose also calls a quality-guard function that does not exist, hardcodes the review thresholds so `--convergence` does nothing to the review vote and treats a missing graph decision as "allow" in research but "block" in review. Operators of both loops get stop points they cannot reproduce or tune.

### Purpose
A runtime script computes the whole stop decision and its reason, and the workflows only branch on its output.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Read-only command run from the repository root on 2026-11-14:

```text
$ A=.skilled/commands/deep/assets R=.skilled/skills/system-deep-loop; rg -n 'stop if avg <= 0\.08|latest ratio <= 0\.05|newFindingsRatio <= 0\.05|guardResult = checkQualityGuards|graph_decision is absent\):|STOP is legal AND graph_decision == "STOP_ALLOWED"|stop_reasons_enum|Skip hard stops \(1\)|max_repeats|^  convergence_threshold' $A/deep-research-auto.yaml $A/deep-research-confirm.yaml $A/deep-review-auto.yaml $A/deep-review-confirm.yaml; rg -c checkQualityGuards $R/runtime || echo "runtime checkQualityGuards matches: 0"; rg -n 'totalNodes === 0' $R/runtime/scripts/convergence.cjs; rg -n 'Stop reason \(' $R/deep-research/SKILL.md
.skilled/commands/deep/assets/deep-research-auto.yaml:46:  convergence_threshold: "[CONVERGENCE_THRESHOLD] - Stop threshold. Default: 0.05."
.skilled/commands/deep/assets/deep-research-auto.yaml:594:    max_repeats: "{max_iterations}"
.skilled/commands/deep/assets/deep-research-auto.yaml:809:               else if inline_stop_candidate and (graph_decision == "STOP_ALLOWED" or graph_decision is absent):
.skilled/commands/deep/assets/deep-research-auto.yaml:822:               guardResult = checkQualityGuards(state, strategy)
.skilled/commands/deep/assets/deep-research-auto.yaml:1135:        stop_reasons_enum: [converged, maxIterationsReached, blockedStop, stuckRecovery, error, manualStop, userPaused]
.skilled/commands/deep/assets/deep-review-auto.yaml:37:  convergence_threshold: 0.10
.skilled/commands/deep/assets/deep-review-auto.yaml:663:    max_repeats: "{max_iterations}"
.skilled/commands/deep/assets/deep-review-auto.yaml:780:               Skip hard stops (1) and composite convergence (4); proceed directly to step 5 legal-stop decision-tree assembly so blocked_by_json, gate outputs, and the blocked_stop event still populate consistently.
.skilled/commands/deep/assets/deep-review-auto.yaml:796:                  stop if avg <= 0.08
.skilled/commands/deep/assets/deep-review-auto.yaml:804:               if latest ratio <= 0.05: mark no_progress_threshold_reached
.skilled/commands/deep/assets/deep-review-auto.yaml:848:               a) if STOP is legal AND graph_decision == "STOP_ALLOWED": decision = "STOP"
.skilled/commands/deep/assets/deep-review-auto.yaml:2211:            if newFindingsRatio <= 0.05: stuck_count + 1
.skilled/commands/deep/assets/deep-review-confirm.yaml:37:  convergence_threshold: 0.10
.skilled/commands/deep/assets/deep-review-confirm.yaml:677:    max_repeats: "{max_iterations}"
.skilled/commands/deep/assets/deep-review-confirm.yaml:796:               Skip hard stops (1) and composite convergence (4); proceed directly to step 5 legal-stop decision-tree assembly so blocked_by_json, gate outputs, and the blocked_stop event still populate consistently.
.skilled/commands/deep/assets/deep-review-confirm.yaml:812:                  stop if avg <= 0.08
.skilled/commands/deep/assets/deep-review-confirm.yaml:820:               if latest ratio <= 0.05: mark no_progress_threshold_reached
.skilled/commands/deep/assets/deep-review-confirm.yaml:864:               a) if STOP is legal AND graph_decision == "STOP_ALLOWED": decision = "STOP"
.skilled/commands/deep/assets/deep-review-confirm.yaml:1743:            if newFindingsRatio <= 0.05: stuck_count + 1
.skilled/commands/deep/assets/deep-research-confirm.yaml:32:  convergence_threshold: "[CONVERGENCE_THRESHOLD] - Stop threshold. Default: 0.05."
.skilled/commands/deep/assets/deep-research-confirm.yaml:640:    max_repeats: "{max_iterations}"
.skilled/commands/deep/assets/deep-research-confirm.yaml:770:               else if inline_stop_candidate and (graph_decision == "STOP_ALLOWED" or graph_decision is absent):
.skilled/commands/deep/assets/deep-research-confirm.yaml:783:               guardResult = checkQualityGuards(state, strategy)
.skilled/commands/deep/assets/deep-research-confirm.yaml:1102:        stop_reasons_enum: [converged, maxIterationsReached, blockedStop, stuckRecovery, error, manualStop, userPaused]
runtime checkQualityGuards matches: 0
753:    if (stats.totalNodes === 0) {
271:- Stop reason (converged, max_iterations, all_questions_answered, stuck_unrecoverable)
```

Finding check against this block and the files it names:

| Finding | Holds | Evidence |
|---------|-------|----------|
| F01 | Yes | The vote arithmetic lives in prose in all four `step_check_convergence` steps. `convergence.cjs` runs one step earlier in `step_graph_convergence` and returns only the graph half. |
| F02 | Yes | `checkQualityGuards` is called at research auto line 822 and confirm line 783. The runtime has 0 matches. Its three rules live only in `deep-research/references/convergence/convergence.md` §4 and the DR-020 to DR-022 playbook scenarios. |
| F05 | Yes | The review vote uses `0.08` and `0.05` while the review default is `0.10` at line 37 of both review files. The stuck counter repeats the `0.05` literal at auto line 2211 and confirm line 1743. |
| F08 | Yes | Research allows "STOP_ALLOWED or absent" at auto line 809. Review requires `STOP_ALLOWED` at auto line 848 and falls through to its keep-existing branch otherwise. An empty graph is not "absent" because `convergence.cjs` returns `CONTINUE` at line 753. |
| F11 | Yes | The frozen enum is at research auto line 1135. The vote emits `composite_converged`, `all_questions_answered` and `minIterationsNotReached`. `deep-research/SKILL.md` line 271 lists a third set. |
| F22 | Partly | Review step 0 at auto line 780 skips step 1, which holds the 1a max-iteration cap. The `phase_loop` bound `max_repeats` at auto line 663 still caps dispatch, so the loop does not run forever. The defect is the decision itself: a run that hits the cap with a failed claim adjudication records `blockedStop` and "Continuing review" instead of `maxIterationsReached`. Step 1's own note and the step 5 heading both say terminal stops bypass the veto, so step 0 contradicts its own step. |
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend `convergence.cjs` with a `--stop-decision` mode that reads the loop config, the state log and the findings registry and returns a `stop_decision` object beside the existing graph payload.
- Implement the research quality guards and the review legal-stop gates inside that mode, with the max-iteration cap evaluated before any veto.
- Replace the vote prose in `step_check_convergence` of the four workflow files with a branch on `stop_decision`, and point both divergent-pivot `branch_on` lines at `stop_decision.reasonDetail`.
- Map the review rolling-average and no-progress cutoffs onto `convergenceThreshold`, including the review stuck counter that repeats the `0.05` literal.
- Correct the stop-reason list in `deep-research/SKILL.md` line 271 to the frozen enum.
- Append the `maxDurationReached` member to the frozen enum where it is defined, so phase 003 can emit it when it enforces the duration cap.

### Out of Scope
- What the loop does when `convergence.cjs` exits non-zero - phase 002 owns the failure policy.
- Making the four workflow files one source - phase 004 owns single-sourcing and the drift guard.
- The `stopReason` table in `deep-research/references/convergence/convergence.md` §2, which also omits `manualStop`, §3 step 7 and the other reference docs - the operator decided on 2026-11-14 that phase 005 owns `convergence.md` §2 and §3.
- The context and council loop types of `convergence.cjs` - no finding names them and `--stop-decision` rejects them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modify | Add `--stop-decision` and its input flags, the vote, guards, gates and decision functions, and export them for tests. |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modify | Pass the stop-decision flags in `step_graph_convergence` and branch on `stop_decision` in `step_check_convergence`. |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml` | Modify | Same change as research auto. |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modify | Same change, plus the stuck counter reads the threshold. |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml` | Modify | Same change as review auto. |
| `.skilled/skills/system-deep-loop/deep-research/SKILL.md` | Modify | Line 271 lists the frozen enum. |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs` | Modify | Append `maxDurationReached` to `STOP_REASONS` and its typedef. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/lifecycle-taxonomy.vitest.ts` | Modify | The expected `STOP_REASONS` array ends with `maxDurationReached`. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision.vitest.ts` | Create | Pure-function tests for the vote, guards, gates, threshold mapping and graph rule. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision-yaml-contract.vitest.ts` | Create | Asserts the four workflow files carry no vote arithmetic and branch on `stop_decision`. |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts` | Modify | CLI cases for `--stop-decision` output, determinism and graph failure. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-policy-yaml-parity.vitest.ts` | Modify | Its `step_check_convergence` text assertions follow the new step body. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | F01. `convergence.cjs --loop-type research` or `review` with `--stop-decision` prints JSON whose `stop_decision` object holds `decision`, `stopReason`, `reasonDetail`, `weightedStopScore`, `signals`, `gates`, `blockedBy`, `graphDecision` and `inputs`. |
| REQ-002 | F01. Two runs of the same `--stop-decision` command over unchanged input files print byte-identical `stop_decision` objects. |
| REQ-003 | F01 and D5. Each of the four `step_check_convergence` steps holds no `MAD(`, `mean(last` or weight literal and names `stop_decision` as the source of `decision` and `reason`. |
| REQ-004 | F02. In research mode `stop_decision.gates` holds a `qualityGuards` entry with one result per guard (`sourceDiversity`, `focusAlignment`, `singleWeakSource`), and a failed guard turns a STOP candidate into `CONTINUE` with `reasonDetail` `qualityGuardFailed`. The string `checkQualityGuards` appears 0 times in the four workflow files. |
| REQ-005 | F05 and D3. The review rolling-average cutoff is `0.8 x convergenceThreshold` and the no-progress mark is `0.5 x convergenceThreshold`. With the threshold absent the default `0.10` gives today's `0.08` and `0.05`. With `0.20` the cutoffs are `0.16` and `0.10`. |
| REQ-006 | F08 and D4. When the graph decision is missing, research and review both return no non-terminal STOP: `decision` `CONTINUE`, `stopReason` `null` and `reasonDetail` `graphDecisionMissing`. The rule covers the composite vote, `all_questions_answered` and `all_dimensions_clean`. |
| REQ-007 | F11 and D2. `stop_decision.stopReason` is `null` when `decision` is `CONTINUE` and otherwise one of `converged`, `maxIterationsReached`, `blockedStop`, `stuckRecovery`, `error`, `manualStop`, `userPaused` and `maxDurationReached`. Finer causes travel only in `reasonDetail`. |
| REQ-008 | F22. With `iteration_count >= maxIterations` and a latest `claim_adjudication` event with `passed: false`, review returns `decision` `STOP`, `stopReason` `maxIterationsReached`, and `claimAdjudicationGate` in its failed-gate evidence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | F05. The review stuck counter in both review files counts a no-progress iteration at `newFindingsRatio <= 0.5 x convergenceThreshold`, and the `0.05` literal appears 0 times in either file. |
| REQ-010 | F11. Both divergent-pivot `branch_on` lines read `stop_decision.reasonDetail`, and `deep-research/SKILL.md` line 271 lists the eight frozen enum values and no other stop reason. |
| REQ-011 | F01. The review inputs that need model judgment (`securitySensitiveFixScope`, `fixReplayRequiredRows`, `fixReplayPassingRows`) enter as explicit flags and appear unchanged in `stop_decision.inputs`. Every other gate input is read from files. |
| REQ-012 | F01. Each workflow runs `convergence.cjs` once per iteration, so the graph snapshot and observability event are written once. |
| REQ-013 | F10 and F11. `STOP_REASONS` in `runtime/lib/deep-loop/lifecycle-taxonomy.cjs` ends with `maxDurationReached`, and every place the four workflow files list the enum names it: `step_normalize_pause_events`, the synthesis `reason` output and the `excluded_reasons` lists. Phase 003 enforces the duration cap that emits it. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node_modules/.bin/vitest run --no-coverage tests/unit/stop-decision.vitest.ts tests/unit/stop-decision-yaml-contract.vitest.ts tests/integration/convergence-script.vitest.ts tests/unit/stop-policy-yaml-parity.vitest.ts` run from the runtime folder reports 0 failed.
- **SC-002**: The Measured Behavior command prints 0 lines for `stop if avg <= 0.08`, `latest ratio <= 0.05`, `newFindingsRatio <= 0.05`, `guardResult = checkQualityGuards`, `graph_decision is absent` and `Skip hard stops (1)`.
- **SC-003**: The full runtime suite (`npm test` in the runtime folder) reports the same passed count as its baseline plus the new tests and 0 failed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The coverage graph database read by `convergence.cjs` | A database error would take the vote down with it | Catch graph evaluation errors inside `--stop-decision` and apply the REQ-006 rule. A whole-script failure is phase 002's. |
| Risk | Fail-closed on a missing graph decision changes research behavior | High: a research run whose graph always errors now runs to `maxIterations` instead of stopping early | `reasonDetail` `graphDecisionMissing` makes the cause visible on every iteration. The cap still ends the run. |
| Risk | A graph result of `CONTINUE` now vetoes research `all_questions_answered` | Med: a research run whose graph stays empty can no longer stop when every question is answered, which it can today | Record `reasonDetail` `graph_convergence_continue` so the cause is visible. The cap still ends the run. Phase 005 aligns `convergence.md` §3 step 7, which says graph blockers apply only when graph events exist. |
| Risk | The divergent pivots read fine reasons | Med: the review pivot's option check throws unless it gets `all_dimensions_clean` | Pass `reasonDetail` to the pivots. Their `triggerReason` types stay unchanged. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: One `convergence.cjs` process per iteration per loop, counted as one `convergence.cjs` bash line inside `phase_loop` of each workflow file.
- **NFR-P02**: N/A. No throughput target applies because the script runs once per iteration.

### Security
- **NFR-S01**: `--stop-decision` reads only the files named by its flags and writes nothing beyond what `step_graph_convergence` writes today.
- **NFR-S02**: N/A. The script reads no credential and serves no network request.

### Reliability
- **NFR-R01**: The same input files give a byte-identical `stop_decision` object (REQ-002).
- **NFR-R02**: An unknown flag still exits 3 through `assertKnownFlags`, so a typo never yields a silent default decision.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a state log with no evidence iterations gives every signal `unavailable`, `weightedStopScore` 0 and `decision` `CONTINUE`. An empty graph still returns `graphDecision` `CONTINUE`, not missing, so no STOP candidate below the cap stands, `all_questions_answered` included.
- Maximum input: `iteration_count >= maxIterations` returns `STOP` with `maxIterationsReached` before any guard, gate or graph veto runs, and records failed gates as evidence.
- Failure path: a graph evaluation error inside `--stop-decision` gives `graphDecision` `null` and the REQ-006 result with exit 0. A missing config or state file exits 3 with `{"status":"error"}`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One script, four workflow files, one skill doc line and four test files |
| Risk | 15/25 | Changes when every deep-research and deep-review run stops |
| Research | 8/20 | Formulas already exist in prose. The single-weak-source input is unknown. |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- No file in the state docs or the runtime defines a `sourceStrength` field, so the single-weak-source guard has no input today. The plan reports it as `notEvaluated` and non-blocking until an owner names the field. The question is recorded in `goal.md`.
- Settled: the fail-closed graph rule (D4) does not apply when the operator passes `--convergence-mode off`, because `off` already blocks every convergence STOP. Adopted as the default on 2026-11-14: announced to the operator, who did not object.
<!-- /ANCHOR:questions -->

---
