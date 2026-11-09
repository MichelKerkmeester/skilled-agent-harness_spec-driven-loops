---
title: "Implementation Plan: Phase 7: deep-loop-state-and-stop-policy"
description: "Fix iteration counting and delta integrity in the research reducer, the state row, readiness binding, quota handling and confirm-gate locks in the workflow YAMLs, up-front max-iterations validation in fan-out, unknown-option refusal across deep-loop scripts, and the council confirm post-dispatch check."
trigger_phrases:
  - "deep loop state and stop policy plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: deep-loop-state-and-stop-policy

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS runtime scripts, YAML workflow assets, TypeScript tests |
| **Framework** | system-deep-loop runtime and the deep-research reducer |
| **Storage** | JSONL state logs and delta files under each run's artifact directory |
| **Testing** | vitest in `runtime/` and `deep-ai-council/`; `node --test` for the reducer script tests; a reducer replay over temp copies of the five 047 research logs |

### Overview
Each finding is fixed where its value is produced: the reducer for counts and delta integrity, the gateway projection or YAML for the state row, the review YAML for the readiness binding, the YAML dispatch-failure path for quota errors, the confirm YAMLs for lock refresh, `fanout-run.cjs` for the stop-policy check and each script's own argument parser for unknown options. The reducer replay is the end-to-end proof for the counting fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Runtime vitest at least 2853 passed plus new tests, council vitest at least 118, node script tests 2 of 2, and the replay prints 20 for 004
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer.

### Key Components
- **`reduce-state.cjs`**: derives iteration metrics, latest iteration and delta records from the state log and delta files.
- **Workflow YAMLs**: own the state row template, the dispatch-failure branch, the closeout arguments and the lock refresh steps.
- **`fanout-run.cjs`**: validates lineage inputs before any spawn.

### Data Flow
An iteration writes its delta and hands its record to the append gateway; the reducer reads the state log and deltas and writes the registry and dashboard; the YAML reads the reducer's output to decide the next iteration or stop.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `reduce-state.cjs` metrics and latest-iteration selection | Counts rows | update | reducer replay, unit test with a duplicated run |
| `reduce-state.cjs` delta parse | Pads corrupt rows with null | update | unit test with a corrupt delta row |
| research YAML state row and `step_read_state` | Drops focus; counts rows | update | `rg` on the row template; contract test |
| review YAML closeout | Passes an unbound placeholder | update | `rg -n release_readiness_state` shows a binding step |
| deep YAML dispatch-failure branch | Writes an `error` iteration | update | YAML text plus the reducer ignoring the event in counts |
| confirm YAML operator gates | Refresh only before gates | update | `rg` shows a refresh after each gate |
| `fanout-run.cjs` input validation | Validates after the run | update | unit test: uncapped max-iterations throws before spawn |
| deep-loop CLI scripts | Some accept any `--key` | update | per-script unknown-option test |
| `deep-ai-council-confirm.yaml` | Lacks post-dispatch validation | update | diff against the auto twin |
| `deep-review/scripts` reducer | Counts review iterations | not a consumer of the research reducer | unchanged |

Required inventories:
- Same-class producers: `rg -n "type === 'iteration'|iterationsCompleted|concat\(new Array" .skilled/skills/system-deep-loop`.
- Consumers of changed symbols: `rg -n "append-mode-event|loop-lock.cjs refresh|release-readiness-state" .skilled/commands/deep`.
- Matrix axes: workflow (research, review, council) by mode (auto, confirm) for the lock, quota and validation fixes.
- Algorithm invariant: completed iterations equal the number of distinct `run` values on non-error iteration rows.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup baselines the runtime, council and node suites and replays the reducer over the five research logs. Implementation runs one worker per finding in the order of `tasks.md`. Verification reruns every baseline and the replay, then the cross-family review.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Reducer counting and delta integrity, fan-out validation, script option parsing | vitest, `node --test` |
| Integration | Reducer replay over temp copies of the five research logs | `replay-reducer.sh` in the orchestrator scratchpad |
| Manual | N/A: no live executor dispatch; YAML changes are checked by text and contract tests | shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex `gpt-6-luna` high fast | External | Green | Fall back to DeepSeek and log it |
| cli-pi `opencode-go/deepseek-v4.1-flash` max | External | Green (cli-devin quota exhausted) | Mechanical edits move to Luna |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A deep loop stops on a state it previously accepted and the stop is wrong.
- **Procedure**: `git revert` the phase commit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 006 commit | Implementation |
| Implementation | Baselines recorded | Verification |
| Verification | Implementation and review | Phase 008 |
<!-- /ANCHOR:phase-deps -->

---
