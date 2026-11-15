---
title: "Implementation Plan: Phase 2: persisted-loop-state-and-failure-policy"
description: "Add a deriveLoopCounters function to the convergence script so the stuck counter and the failure counter come from the state log on every pass. Exclude failed iterations from the ratio signals, keep one failure rule and remove the model-written dashboard step from all four workflow files."
trigger_phrases:
  - "persisted loop state and failure policy plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: persisted-loop-state-and-failure-policy

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts and YAML workflow files |
| **Framework** | None. The workflows are YAML instructions the orchestrator follows. |
| **Storage** | Append-only JSONL state log under each run's artifact directory |
| **Testing** | Vitest 4.1.12 through `npm --prefix .skilled/skills/system-deep-loop/runtime test` |

### Overview
The change adds one exported function to `runtime/scripts/convergence.cjs` and binds its output in the four deep-research and deep-review workflow files. It also deletes three conflicting failure wordings and the model-written dashboard step. A new unit test file with fixture state logs proves the counters, the failed-iteration filter and the resume case.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 has landed: `rg -n 'stop decision' specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/001-deterministic-stop-decision/implementation-summary.md` prints the owner it chose.
- [ ] The baseline suite result is recorded: `npm --prefix .skilled/skills/system-deep-loop/runtime test` output and exit status are written to `goal.md` section 4.
- [ ] The Retry, Skip and Cancel open question in `goal.md` section 4 has an operator answer.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`.
- [ ] `npm --prefix .skilled/skills/system-deep-loop/runtime test` exits 0 with no failed test.
- [ ] `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs --command deep/research` and the same command for `deep/review` exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Derived state from log. The counters are a pure function of the state log, recomputed each pass.

### Key Components
- **`deriveLoopCounters(records, options)` in `runtime/scripts/convergence.cjs`**: Takes parsed state-log records and the loop type. It keeps the latest record per run, drops `thought`, `error` and `timeout` records from the stuck walk, resets on `insight` or on a `stuckRecovery` event, counts trailing low-novelty iterations into `stuckCount` and counts trailing `error` or `timeout` runs into `consecutiveFailureCount`. Without it a resumed run has no stuck counter.
- **The `--state-log` flag on `runtime/scripts/convergence.cjs`**: Lets `step_graph_convergence` pass the log path so the script prints `loop_counters_json` beside the graph decision. Without it the workflows would need a second script call per pass.

### Data Flow
The executor appends an iteration row to the state log. On the next pass `step_graph_convergence` runs `convergence.cjs --state-log {state_paths.state_log}`, which reads the whole log and prints the counters. The workflow binds `stuck_count` and `consecutive_failure_count` from that output, and `step_check_convergence` reads them. The review files read the severity counters from `findingsBySeverity`, which `runtime/scripts/reduce-state.cjs` writes each pass. The reducers remain the only writers of the dashboard.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/scripts/convergence.cjs` | Graph convergence decision, and the stop-decision owner after phase 001 | update | `node -e "console.log(typeof require('./.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs').deriveLoopCounters)"` prints `function` |
| `step_update_tracking` and `step_init_complete` in the auto files, `gate_init_approval.on_A` in the confirm files | Set and change `stuck_count` in memory | update | `rg -n -e 'stuck_count: 0' -e 'stuck_count \+ 1' .skilled/commands/deep/assets/deep-re*.yaml` prints nothing |
| `step_read_state` and `step_update_tracking` in both review files | Two competing severity counts | update | `rg -c 'Accumulate from severity_counts' .skilled/commands/deep/assets/deep-review-*.yaml` prints nothing |
| `post_dispatch_validate.on_failure.escalation` and `error_recovery.consecutive_failures` | Two of the three failure rules | update | `rg -c -e 'trigger stuck_recovery event' -e 'After 3 consecutive errors' .skilled/commands/deep/assets/deep-re*.yaml` prints nothing, `rg -c 'Retry / Skip / Cancel' .skilled/commands/deep/assets/deep-research-confirm.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml` prints a count for each of the two files and `rg -c 'Retry / Skip / Cancel' .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-review-auto.yaml` prints nothing |
| `step_generate_dashboard` in all four files | Second dashboard writer | update | `rg -c 'step_generate_dashboard' .skilled/commands/deep/assets/deep-re*.yaml` prints nothing |
| `deep-review-confirm.yaml` lines 1678 and 1679 | Route `on_A` and `on_B` to `step_generate_dashboard` | update | `rg -n 'proceed_to: step_update_tracking' .skilled/commands/deep/assets/deep-review-confirm.yaml` prints two lines |
| `deep-research/scripts/reduce-state.cjs:3021` | Prints a cumulative stuck count that includes failed rows | update | The REQ-012 test compares it with `deriveLoopCounters` |
| `runtime/scripts/reduce-state.cjs` | Writes the review dashboard and `findingsBySeverity` | unchanged | `rg -n 'writeUtf8\(dashboardPath' .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` prints one line |
| `tests/unit/deep-research-convergence-floor.vitest.ts:84` | Asserts the literal `stuck_count >= config.stuckThreshold` | update | The file passes under the runtime suite |
| `compiled/deep-research.contract.markdown` and `compiled/deep-review.contract.markdown` | Generated from the workflow files | update | `check-contract-drift.cjs` exits 0 for both commands |
| Loop-protocol references, dashboard asset templates and playbooks | Describe the old rules | not a consumer here | Handed to phase 005 |

Required inventories:
- Same-class producers: `rg -n 'stuck_count' .skilled/commands/deep/assets/deep-re*.yaml` and `rg -n 'Stuck count' .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`.
- Consumers of changed symbols: `rg -ln -e 'step_generate_dashboard' -e 'consecutive_failures' -e 'stuck_count' .skilled/skills/system-deep-loop .skilled/commands/deep`.
- Matrix axes: loop type (research, review) by mode (auto, confirm) by iteration status (complete, insight, thought, error, timeout). That makes 4 workflow rows and 5 status rows in the fixture tests.
- Algorithm invariant: the counters are a pure function of the state log. The same log gives the same counters in a fresh run and in a resumed run.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup records the baseline suite result and writes the failing fixture tests in `runtime/tests/unit/loop-counters-derivation.vitest.ts`. Implementation adds `deriveLoopCounters` to `runtime/scripts/convergence.cjs` and edits the four workflow files and the research reducer. Verification runs the runtime suite, regenerates the compiled contracts and runs `check-contract-drift.cjs` for both commands.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `deriveLoopCounters`, the failed-iteration filter and the resume case over fixture state logs | Vitest through `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts` |
| Integration | The workflow text for all four files and the compiled contracts | `rg` counts and `check-contract-drift.cjs` |
| Manual | N/A. Phase 005 owns the playbooks that exercise a live loop. | None |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 stop-decision owner | Internal | Yellow | The four-failure fixture has no vote function to test until phase 001 lands |
| Vitest 4.1.12 in `runtime/package.json` | Internal | Green | No new package is needed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A live loop stops with stop reason `error` while its last three iterations completed, or the runtime suite fails after the change.
- **Procedure**: Revert the implementation commit with `git revert <sha>`. That restores the four workflow files, both scripts and both compiled contracts together. The state-log format does not change, so existing runs need no migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 landed and the Retry, Skip and Cancel answer | Implementation |
| Implementation | Failing fixture tests from Setup | Verification |
| Verification | All implementation tasks | Packet close and phase 003 |
<!-- /ANCHOR:phase-deps -->

---
