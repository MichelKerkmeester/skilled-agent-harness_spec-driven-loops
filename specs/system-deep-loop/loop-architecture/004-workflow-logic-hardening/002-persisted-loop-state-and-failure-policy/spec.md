---
title: "Feature Specification: Phase 2: persisted-loop-state-and-failure-policy"
description: "The deep-research and deep-review workflows keep their stuck counter in orchestrator memory, count failed iterations as zero-novelty evidence and state three different rules for repeated failures. This phase derives every stop counter from the state log by script, excludes failed iterations from the vote, keeps one failure rule and leaves the reducer as the only dashboard writer."
trigger_phrases:
  - "persisted loop state and failure policy"
  - "phase 2 persisted loop state and failure policy"
  - "deep loop stuck counter persistence"
  - "failed iteration convergence exclusion"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: persisted-loop-state-and-failure-policy

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
| **Phase** | 2 of 5 |
| **Predecessor** | 001-deterministic-stop-decision |
| **Successor** | 003-lifecycle-lock-and-limits |
| **Handoff Criteria** | Phase 003 gets three things. Stop reason `error` is the one terminal outcome of repeated failures in all four workflow files, so lifecycle work can rely on it. The loop counters rebuild from the state log on every pass, so lock and resume work never initializes them. `step_init_complete` and `gate_init_approval.on_A` no longer set `stuck_count`, so phase 003 can change init and resume without touching counters. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Fix every deep-research and deep-review workflow logic, drift and doc finding from the 2026-11-14 analysis specification.

**Scope Boundary**: This phase owns the loop counters the stop decision reads, the treatment of failed iterations in that decision and the single dashboard writer. It owns findings F03, F04, F07 and F12. It does not touch the lock, the iteration limits or the run lifecycle, which belong to phase 003. It does not merge the four workflow files into one source, which belongs to phase 004. It does not edit command docs, skill references or playbooks, which belong to phase 005.

**Dependencies**:
- Phase 001 makes `runtime/scripts/convergence.cjs` the owner of the stop decision, as phase 001 confirmed on 2026-11-14. The counter function and the failed-iteration filter attach to that script.
- The research ledger schema already accepts `error` and `timeout` iteration statuses (`runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:139`).
- The lifecycle taxonomy already lists `error` as a stop reason (`runtime/lib/deep-loop/lifecycle-taxonomy.cjs:50`).

**Deliverables**:
- A `deriveLoopCounters` function in `runtime/scripts/convergence.cjs` that rebuilds `stuckCount` and `consecutiveFailureCount` from the state log on every pass.
- Four workflow files that bind those counters from the script, exclude failed iterations from every ratio signal, state one failure rule and no longer write the dashboard.
- A unit test file with fixture state logs that fails before the fix.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-research and deep-review loops keep `stuck_count` only in orchestrator memory, so a resumed run starts with an unbound counter and can stop or continue differently from a run that never paused. A failed iteration is recorded with a novelty ratio of 0.0 and counts as evidence in the stop vote, so repeated failures push the loop toward a converged stop. Three workflow rules describe repeated failures in three different ways, and two writers produce the dashboard.

### Purpose
Every counter the stop decision reads comes from the state log through one script, failed iterations never count as evidence and the loop follows one failure rule.

### Verification of the findings

Each finding was checked against the four workflow files on 2026-11-14.

- **F03 holds for `stuck_count` in all four files.** `step_read_state` extracts no stuck counter in any file. The auto files set it in `step_init_complete`. The confirm files set it in `gate_init_approval.on_A` (research line 630, review line 667). `step_update_tracking` changes it in all four.
- **F03 holds only in part for the review severity counters.** `step_read_state` already recounts `p0_count`, `p1_count` and `p2_count` on each pass (`deep-review-auto.yaml:697`). The defect is three competing definitions: the recount in `step_read_state`, "Accumulate from severity_counts" in `step_update_tracking` and the deduplicated `findingsBySeverity` in `runtime/scripts/reduce-state.cjs:1695`.
- **F04 holds for research.** The research vote filters only `thought` iterations, and the failure row carries `"newInfoRatio":0.0` (`deep-research-auto.yaml:2084`). The rolling average (w=0.30) and the MAD noise floor (w=0.35) together give 0.65, which is above the 0.60 bar. That reading is from the algorithm text, not from a run.
- **F04 holds only in part for review.** The review vote filters neither `thought` nor `error`. Its two ratio signals weigh w=0.30 and w=0.25, which is below the 0.60 bar on their own, so failures alone do not make a stop candidate. They still lower the ratio signals, and with the review stuck threshold of 2 two failures in a row trigger stuck recovery. The review failure row carries `"newFindingsRatio":0.0`.
- **F04 in research confirm has no fixed row shape.** `deep-research-confirm.yaml:1535` says only "Mark iteration as 'error', continue to next" and names no ratio value.
- **The recovery reset is already persisted.** The research files append a `stuckRecovery` event (`deep-research-auto.yaml:1061`). The review files append `deep_review.recovery_started` (`deep-review-auto.yaml:1141`). A derived counter can reset on those events.
- **The graph convergence step fails open.** Its research outputs read "else null when unavailable" (`deep-research-auto.yaml:763`). Counters bound from it would be unbound again if the script failed, so REQ-016 makes that case halt.
- **F07 holds in three files and differs in the fourth.** The two research files and `deep-review-auto.yaml` carry the `escalation` line. `deep-review-confirm.yaml` has none. Both confirm files say "present to user with options: Retry / Skip / Cancel" rather than "enter synthesis".
- **F12 holds in all four files.** Each file has a `step_generate_dashboard` step, and both reducers already write the dashboard (`deep-research/scripts/reduce-state.cjs:3260` and `runtime/scripts/reduce-state.cjs:2382`).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n -o -e 'Rolling average \(w=[0-9.]+' -e 'MAD noise floor \(w=[0-9.]+' -e 'Filter: exclude iterations where status == thought' -e 'weighted_stop_score >=? 0\.60: inline' -e 'stuckThreshold: [0-9]+' -e 'stuck_count >= 2' -e 'stuck_count \+ 1' -e 'escalation: "After 3 consecutive failures[^"]*' -e 'consecutive_failures: "[^"]*' -e 'step_generate_dashboard:' -e '"new(Info|Findings)Ratio":0\.0' -e '"event":"stuckRecovery","mode"' -e 'deep_review\.recovery_started' .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-research-confirm.yaml .skilled/commands/deep/assets/deep-review-auto.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml; echo "exit=$?"
.skilled/commands/deep/assets/deep-review-confirm.yaml:522:stuckThreshold: 2
.skilled/commands/deep/assets/deep-review-confirm.yaml:803:stuck_count >= 2
.skilled/commands/deep/assets/deep-review-confirm.yaml:810:Rolling average (w=0.30
.skilled/commands/deep/assets/deep-review-confirm.yaml:813:MAD noise floor (w=0.25
.skilled/commands/deep/assets/deep-review-confirm.yaml:822:weighted_stop_score >= 0.60: inline
.skilled/commands/deep/assets/deep-review-confirm.yaml:1225:deep_review.recovery_started
.skilled/commands/deep/assets/deep-review-confirm.yaml:1562:"newFindingsRatio":0.0
.skilled/commands/deep/assets/deep-review-confirm.yaml:1683:step_generate_dashboard:
.skilled/commands/deep/assets/deep-review-confirm.yaml:1743:stuck_count + 1
.skilled/commands/deep/assets/deep-review-confirm.yaml:2155:consecutive_failures: "After 3 consecutive errors, halt and present to user with options: Retry / Skip / Cancel.
.skilled/commands/deep/assets/deep-review-auto.yaml:535:stuckThreshold: 2
.skilled/commands/deep/assets/deep-review-auto.yaml:787:stuck_count >= 2
.skilled/commands/deep/assets/deep-review-auto.yaml:794:Rolling average (w=0.30
.skilled/commands/deep/assets/deep-review-auto.yaml:797:MAD noise floor (w=0.25
.skilled/commands/deep/assets/deep-review-auto.yaml:806:weighted_stop_score >= 0.60: inline
.skilled/commands/deep/assets/deep-review-auto.yaml:1141:deep_review.recovery_started
.skilled/commands/deep/assets/deep-review-auto.yaml:2016:escalation: "After 3 consecutive failures across iterations, trigger stuck_recovery event with diagnostic context
.skilled/commands/deep/assets/deep-review-auto.yaml:2064:"newFindingsRatio":0.0
.skilled/commands/deep/assets/deep-review-auto.yaml:2151:step_generate_dashboard:
.skilled/commands/deep/assets/deep-review-auto.yaml:2211:stuck_count + 1
.skilled/commands/deep/assets/deep-review-auto.yaml:2532:consecutive_failures: "After 3 consecutive errors, halt loop and enter synthesis with partial findings.
.skilled/commands/deep/assets/deep-research-confirm.yaml:395:stuckThreshold: 3
.skilled/commands/deep/assets/deep-research-confirm.yaml:744:Filter: exclude iterations where status == thought
.skilled/commands/deep/assets/deep-research-confirm.yaml:745:Rolling average (w=0.30
.skilled/commands/deep/assets/deep-research-confirm.yaml:748:MAD noise floor (w=0.35
.skilled/commands/deep/assets/deep-research-confirm.yaml:755:weighted_stop_score > 0.60: inline
.skilled/commands/deep/assets/deep-research-confirm.yaml:1093:"event":"stuckRecovery","mode"
.skilled/commands/deep/assets/deep-research-confirm.yaml:1108:"event":"stuckRecovery","mode"
.skilled/commands/deep/assets/deep-research-confirm.yaml:1366:escalation: "After 3 consecutive failures across iterations, trigger stuck_recovery event with diagnostic context
.skilled/commands/deep/assets/deep-research-confirm.yaml:1573:step_generate_dashboard:
.skilled/commands/deep/assets/deep-research-confirm.yaml:1589:stuck_count + 1
.skilled/commands/deep/assets/deep-research-confirm.yaml:1943:consecutive_failures: "After 3 consecutive errors, halt and present to user with options: Retry / Skip / Cancel.
.skilled/commands/deep/assets/deep-research-auto.yaml:367:stuckThreshold: 3
.skilled/commands/deep/assets/deep-research-auto.yaml:783:Filter: exclude iterations where status == thought
.skilled/commands/deep/assets/deep-research-auto.yaml:784:Rolling average (w=0.30
.skilled/commands/deep/assets/deep-research-auto.yaml:787:MAD noise floor (w=0.35
.skilled/commands/deep/assets/deep-research-auto.yaml:794:weighted_stop_score > 0.60: inline
.skilled/commands/deep/assets/deep-research-auto.yaml:1061:"event":"stuckRecovery","mode"
.skilled/commands/deep/assets/deep-research-auto.yaml:1141:"event":"stuckRecovery","mode"
.skilled/commands/deep/assets/deep-research-auto.yaml:1849:escalation: "After 3 consecutive failures across iterations, trigger stuck_recovery event with diagnostic context
.skilled/commands/deep/assets/deep-research-auto.yaml:2084:"newInfoRatio":0.0
.skilled/commands/deep/assets/deep-research-auto.yaml:2162:step_generate_dashboard:
.skilled/commands/deep/assets/deep-research-auto.yaml:2176:stuck_count + 1
.skilled/commands/deep/assets/deep-research-auto.yaml:2502:consecutive_failures: "After 3 consecutive errors, halt loop and enter synthesis with partial findings.
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `deriveLoopCounters` to `runtime/scripts/convergence.cjs`. It rebuilds `stuckCount` and `consecutiveFailureCount` from the state log on every pass. Without it a resumed run has no stuck counter.
- Bind `stuck_count` and `consecutive_failure_count` from the convergence output in all four workflow files, delete every in-memory `set` and `reset` of `stuck_count` and halt when the counters are missing.
- Bind the review severity counters from the reducer's `findingsBySeverity` and delete "Accumulate from severity_counts".
- Exclude `error` and `timeout` iterations from every ratio signal and from the stuck counter.
- Keep one failure rule in all four files and delete `step_generate_dashboard` from all four.

### Out of Scope
- The packet lock, the iteration limits and the run lifecycle. Phase 003 owns them.
- Merging the four workflow files into one source and adding a drift guard. Phase 004 owns that.
- The loop-protocol references, the dashboard asset templates and the manual testing playbooks that describe the old rules. Phase 005 owns doc alignment.
- The ratio sparkline in the research dashboard. It is a display, not a stop signal.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modify | Add and export `deriveLoopCounters`. Accept a `--state-log` flag and print `loop_counters_json`. Drop `error` and `timeout` records from the ratio inputs. |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modify | Bind the counters from `step_graph_convergence`. Delete the `stuck_count` sets. Add `error` and `timeout` to the vote filter. State one failure rule. Delete `step_generate_dashboard`. |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml` | Modify | Same changes as the research auto file. The init set lives in `gate_init_approval.on_A`. |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modify | Same changes. Bind `p0_count`, `p1_count` and `p2_count` from `findingsBySeverity`. Add a status filter to the vote. |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml` | Modify | Same changes as the review auto file. Point `on_A` and `on_B` at lines 1678 and 1679 to `step_update_tracking`. |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modify | Print the dashboard stuck count from `deriveLoopCounters` instead of the cumulative count at line 3021. |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Modify | Regenerate with `compile-command-contracts.cjs --command deep/research --write`. |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Modify | Regenerate with `compile-command-contracts.cjs --command deep/review --write`. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts` | Create | Fixture state logs for the counters, the failed-iteration filter and the resume case. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-convergence-floor.vitest.ts` | Modify | Update the literal at line 84 that asserts `stuck_count >= config.stuckThreshold`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | F03: `require('.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs').deriveLoopCounters` is a function that takes state-log records and returns `stuckCount` and `consecutiveFailureCount`. |
| REQ-002 | F03: No workflow file sets or resets `stuck_count` in memory. `rg -n -e 'stuck_count: 0' -e 'stuck_count \+ 1' .skilled/commands/deep/assets/deep-re*.yaml` prints nothing. |
| REQ-003 | F03: Each workflow binds `stuck_count` and `consecutive_failure_count` from the `step_graph_convergence` output, which reads the state log after the last append of the pass and before `step_check_convergence`. |
| REQ-004 | F03: Both review files read `p0_count`, `p1_count` and `p2_count` from `findingsBySeverity` in the findings registry. `rg -c 'Accumulate from severity_counts' .skilled/commands/deep/assets/deep-review-*.yaml` prints nothing. |
| REQ-005 | F03: `deriveLoopCounters` over a full state log and over a resumed run that replays a prefix and then the remaining records return equal counter values. |
| REQ-006 | F04: The research ratio signals exclude `error` and `timeout` iterations. A fixture state log with four failed iterations does not produce a converged stop. |
| REQ-007 | F04: The review ratio signals exclude `error` and `timeout` iterations. A review fixture with four failed iterations does not lower the rolling average or the MAD noise floor. |
| REQ-008 | F04: An `error` or `timeout` iteration leaves `stuckCount` unchanged. |
| REQ-009 | F07: Three consecutive `error` or `timeout` iterations set `consecutiveFailureCount` to 3. `step_check_convergence` in the two auto files then halts with stop reason `error` and enters synthesis with partial findings and no question. In the two confirm files it asks the operator Retry / Skip / Cancel before synthesis starts. |
| REQ-010 | F07: All four files state one failure rule, and only the two confirm files add the Retry / Skip / Cancel gate. `rg -c -e 'trigger stuck_recovery event' -e 'After 3 consecutive errors' .skilled/commands/deep/assets/deep-re*.yaml` prints nothing. `rg -c 'Retry / Skip / Cancel' .skilled/commands/deep/assets/deep-research-confirm.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml` prints a count for each of the two files. `rg -c 'Retry / Skip / Cancel' .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-review-auto.yaml` prints nothing. |
| REQ-011 | F12: `rg -c 'step_generate_dashboard' .skilled/commands/deep/assets/deep-re*.yaml` prints nothing, and a reducer run still writes the dashboard file. |
| REQ-015 | F03: `deriveLoopCounters` resets `stuckCount` to 0 at the latest persisted recovery event, `stuckRecovery` in research and `deep_review.recovery_started` in review. |
| REQ-016 | F03: `convergence.cjs --state-log` prints `loop_counters_json` even when the coverage-graph database is absent, and each workflow halts with stop reason `error` when that field is missing from the output. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-012 | F12: The research dashboard stuck count equals `deriveLoopCounters(records).stuckCount` for the same state log. |
| REQ-013 | F03 F07 F12: The compiled contracts for `deep/research` and `deep/review` are regenerated and `check-contract-drift.cjs` exits 0 for both. |
| REQ-014 | F03 F04 F07 F12: `npm --prefix .skilled/skills/system-deep-loop/runtime test` exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts` exits 0, and the same file fails on the commit before the fix.
- **SC-002**: The four-failure research fixture returns a decision other than a converged stop.
- **SC-003**: `rg -c -e 'step_generate_dashboard' -e 'Accumulate from severity_counts' -e 'trigger stuck_recovery event' .skilled/commands/deep/assets/deep-re*.yaml` prints nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 moves the stop vote into `runtime/scripts/convergence.cjs`, and it confirmed that owner on 2026-11-14 | Without it the failed-iteration filter has no function to test, only workflow prose | Build after phase 001 lands. |
| Risk | Derived counters read a stale state log in research, where `step_reduce_state` runs before `step_evaluate_results` appends the failure row | High | Derive in `step_graph_convergence`, which runs on the next pass after every append. A fixture test checks that a failure row appended last is counted. |
| Risk | The confirm files name Retry / Skip / Cancel but never define what each choice does to the failure counter and the loop | Med | The open question in `goal.md` section 4 proposes a meaning for each choice. Tasks T024 and T026 wait for the answer. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: `deriveLoopCounters` reads the state log once per pass and finishes in under 50 ms for a 500-record log.
- **NFR-P02**: N/A. The loop runs one pass at a time, so throughput has no target.

### Security
- **NFR-S01**: N/A. The change reads a local state log and adds no input from outside the packet.
- **NFR-S02**: `--state-log` goes through `validateNamespaceValue` in `runtime/scripts/lib/cli-guards.cjs`, which rejects `..` segments and absolute paths outside the repository root.

### Reliability
- **NFR-R01**: The same state log always gives the same counters, whether read fresh or after a resume.
- **NFR-R02**: A malformed state-log line is skipped with a warning and does not change either counter.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty state log returns `stuckCount` 0 and `consecutiveFailureCount` 0.
- Maximum input: a redispatched run counts once, using its latest record, so a run retried at the cap does not count twice.
- Failure path: a missing state-log file makes the script exit with an input error, and the workflow halts rather than binding a default counter. REQ-016 enforces the halt.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Four workflow files, two scripts, two compiled contracts and two test files |
| Risk | 14/25 | Changes when both loops stop and how they handle failures |
| Research | 6/20 | All four findings were checked against the files on 2026-11-14 |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Settled: Retry resets the failure count and repeats the focus, Skip resets it and moves to the next focus, and Cancel ends the run with no synthesis. The full meaning is in `goal.md` section 4. Adopted as the default on 2026-11-14: announced to the operator, who did not object.
- Answered on 2026-11-14: phase 001 confirmed that `runtime/scripts/convergence.cjs` owns the stop decision.
<!-- /ANCHOR:questions -->

---
