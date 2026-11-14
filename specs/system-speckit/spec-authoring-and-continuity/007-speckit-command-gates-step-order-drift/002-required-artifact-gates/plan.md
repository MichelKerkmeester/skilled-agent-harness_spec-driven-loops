---
title: "Implementation Plan: Phase 2: required-artifact-gates"
description: "Rewrite the quality_gates blocks of the plan, implement and complete workflows as lists of required checks with a producer and a decision rule each, move the tasks.md prerequisite after the step that writes it and give both consistency analysis steps a failure branch."
trigger_phrases:
  - "required artifact gates plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: required-artifact-gates

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow files read and executed by an AI agent |
| **Framework** | The `/speckit` command workflows under `.skilled/commands/speckit/assets/` |
| **Storage** | None |
| **Testing** | `rg`, `awk` and `sed` checks plus `test-phase-command-workflows.js` and `validate.sh` |

### Overview
The change rewrites the `quality_gates` blocks of `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml` so each gate passes only when every listed check passes. Plan's exit gate requires the filled `tasks.md` that plan's new task breakdown step writes. It also edits implement steps 1 and 2 and the two consistency analysis steps. The `rg`, `awk` and `sed` commands in `acceptance-criteria.md` prove each change, and the workflow contract test proves nothing else broke.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Phase 1 is Complete: `rg -c '\| Unmet \|' ../001-step-order-acceptance-after-development/acceptance-criteria.md` prints nothing.
- [x] The baseline is captured: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `Result: passed=150 failed=0` or the count phase 1 left.
- [x] Phase 1 has inserted plan's task breakdown step: `rg -c '^  step_5_5_task_breakdown:' .skilled/commands/speckit/assets/speckit-plan.yaml` prints 1. Today it prints nothing and exits 1.

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is `Met` with its command output recorded.
- [x] `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0` with a pass count no lower than the baseline.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Declarative required checks.

### Key Components
- **`quality_gates` block in each lifecycle workflow**: lists the checks a gate requires. Each check carries `from:` for its producer and `criteria:` for its decision rule, and the block carries one `exists_rule`.
- **Consistency analysis steps** (implement `step_3_analysis`, complete `step_8_analysis`): gain an `on_fail` branch that returns to the step that wrote the faulty artifact.
- **Implement `step_2_task_breakdown`**: validates an existing `tasks.md` and writes one only when the file is missing or fails `exists_rule`, because plan now writes it.

### Data Flow
A producing step writes an artifact or binds a value. The gate reads each check's `criteria:` against that artifact or value. The gate passes when every check passes. Otherwise its `on_fail` stops the run and names every failed check.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `quality_gates` in the three lifecycle workflows | Owns every gate check and the pass rule | update | The `awk` commands in `acceptance-criteria.md` |
| Implement `step_1_review_plan_and_spec` | Runs the prerequisite check with `--require-tasks` | update | `sed` range over step 1 finds no `require-tasks` |
| Implement `step_2_task_breakdown` | Creates or validates `tasks.md` with no rule for which | update | `sed` range over step 2 finds `exists_rule` |
| Plan `step_5_5_task_breakdown` | Writes `tasks.md` once phase 1 inserts it | unchanged here, read by `tasks_exists` | `sed` range over the step finds `tasks.md` |
| Implement `step_3_analysis` and complete `step_8_analysis` | Report findings with no failure branch | update | `sed` range over each step finds one `on_fail:` |
| Complete `workflow_enforcement.phase_gate` and `phase_gate_checkpoint` | Restate the planning gate with a different list | update | `rg -c 'quality_gates.planning_gate'` prints at least 2 |
| `assets/*-presentation.txt` | Show no gate score. The implement `Quality gate:` field reads the sk-code runner verdict | not a consumer | `rg -n -i 'score\|/100\|threshold' assets/speckit-*-presentation.txt` prints no gate score line |
| `test-phase-command-workflows.js` and other tests or docs outside `.skilled/commands/speckit/` | Assert workflow structure but not gate content | update only where an assertion breaks. At authoring, `rg -n -i 'speckit:plan' .skilled --glob '*.md' --glob '!.skilled/commands/speckit/**' --glob '!**/node_modules/**' \| rg -i 'tasks\.md\|step 7\|seven steps'` printed nothing | `rg -n 'quality_gates\|threshold\|points' .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints nothing |
| `check-prerequisites.sh` and `create.sh` | Exit 1 on a missing `tasks.md` under `--require-tasks`. Write a `tasks.md` scaffold at levels 1 to 3+ | unchanged | Scripts are out of scope for the parent packet |

Required inventories:
- Same-class producers: `awk '/^[a-z_]+:/{f=($0 ~ /^quality_gates:/)} f' .skilled/commands/speckit/assets/speckit-*.yaml | rg 'id:'` lists every gate check in the three files.
- Consumers of changed symbols: `rg -n 'quality_gates|planning_gate|pre_implementation|post_execution' .skilled --glob '*.{ts,js,cjs,mjs,sh,py}' -g '!**/node_modules/**'` prints nothing at review time.
- Matrix axes: three workflows by their gates (plan 2, implement 2, complete 3) by the two rules (required checks and `from:` producer).
- Algorithm invariant: a gate passes if and only if every check it lists passes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup re-reads the three `quality_gates` blocks after phase 1 and records the contract test baseline.
Implementation rewrites the gates in `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml`, then edits implement step 1 and both analysis steps.
Verification runs each `acceptance-criteria.md` command, the workflow contract test and `validate.sh --strict` on this folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each gate block and each edited step, read by the `rg`, `awk` and `sed` commands in `acceptance-criteria.md` | `rg`, `awk`, `sed` |
| Integration | The workflow contract suite: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0` | `node` |
| Manual | Read each `on_fail` and `exists_rule` line as the agent would and confirm it names what failed | Reading the YAML |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 step order and step keys, including plan's `step_5_5_task_breakdown` | Internal | Yellow | `from:` fields and `sed` ranges would name keys phase 1 then moves, and plan's `tasks_exists` would have no producer |
| `rg`, `awk`, `sed` and `node` | External | Green | The verify commands cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: The contract test reports `failed` above 0, or a gate check names a producer step that cannot make it true, so every run blocks.
- **Procedure**: Revert the commit that changed the three workflow files with `git revert <commit>`. The change touches no script and no data.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 1 of the parent is Complete | Implementation |
| Implementation | Setup baseline and the current step keys | Verification |
| Verification | Every implementation task | Closing this phase |
<!-- /ANCHOR:phase-deps -->

---

