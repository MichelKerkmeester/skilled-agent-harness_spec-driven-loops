---
title: "Implementation Plan: Phase 3: execution-mode-and-autopilot-contract"
description: "Edit the three lifecycle workflows, their routers and their presentation files so auto, confirm and autopilot each have one stated contract. Prove it with rg counts, PyYAML key checks, a scratch checker that walks every stop-and-ask branch and the autopilot contract test."
trigger_phrases:
  - "execution mode and autopilot contract plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: execution-mode-and-autopilot-contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

Commands in this plan run from the repository root. `A` is `.skilled/commands/speckit/assets`, `C` is `specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/003-execution-mode-and-autopilot-contract` and `R` is `.skilled/skills/system-deep-loop/runtime`.

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow assets, Markdown routers and plain-text presentation files |
| **Framework** | The `/speckit` command system under `.skilled/commands/speckit/` |
| **Storage** | None |
| **Testing** | `rg`, PyYAML 6.0.3 through `python3 -c` and the vitest suite in `.skilled/skills/system-deep-loop/runtime/` |

### Overview
The change edits the mode text in three workflow YAML files, three routers and three presentation files under `.skilled/commands/speckit/`. It adds one byte-identical `unattended_autopilot` block to each workflow, a `modes` map to each stop-and-ask branch and autopilot result text to each presentation file, and it removes autopilot's own branch and merge. It is proved by the rg and PyYAML checks named in `acceptance-criteria.md`, by a scratch checker that finds every untagged ask and by the autopilot contract test.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phase 2 `acceptance-criteria.md` has no `Unmet` row: `rg -c '\| Unmet \|' $C/../002-required-artifact-gates/acceptance-criteria.md` prints nothing
- [ ] Plan's task breakdown step exists after phase 1: `rg -n '^  step_5_5_task_breakdown:' $A/speckit-plan.yaml` prints one line

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `python3 $C/scratch/check-mode-tags.py $A/speckit-{plan,implement,complete}.yaml` prints `untagged: 0` and `autopilot_ask: 0`, and `npx vitest run tests/unit/speckit-autopilot-contract.vitest.ts` run from `$R` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Router, workflow and presentation. A thin router binds the mode, the workflow YAML holds the steps and the presentation file holds the text the operator sees.

### Key Components
- **Workflow YAML** (`speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml`): owns the mode contract, the `modes` map on each ask and the `rules` lists. Without the block in plan and implement, `:autopilot` binds to nothing there.
- **Presentation file** (`speckit-*-presentation.txt`): owns the startup question, dashboard and result text. Without the autopilot block, an autopilot run has no text for its result line.
- **Router** (`plan.md`, `implement.md`, `complete.md`): states the execution target. It must not promise a branch or merge that the workflow no longer performs.
- **Scratch checker** (`scratch/check-mode-tags.py`): walks the three YAML files and reports every ask with no mode statement. Without it, the section 3 inventory can only be checked by hand. It is verification tooling inside this phase folder, not a product file.

### Data Flow
The operator types a command with a mode suffix. The router binds `execution_mode` and loads the workflow and the presentation file. At each stop-and-ask branch the agent reads that branch's `modes` entry for the bound mode and either asks, takes the named default or emits the autopilot result line. The presentation file renders the result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `speckit-complete.yaml` `unattended_autopilot`, `step_0_autopilot_envelope`, `step_13_5_autopilot_archive_verify_merge` | Producer of the autopilot contract and its merge | update | `rg -n -e merge_on_clean -e '"merged":true' -e branch_first .skilled/commands/speckit` prints nothing |
| `speckit-plan.yaml`, `speckit-implement.yaml` | Bind `autopilot` with no block behind it | update | `rg -c SPECKIT_AUTOPILOT_RESULT $A/speckit-plan.yaml $A/speckit-implement.yaml` prints a count above 0 for each |
| `plan.md`, `implement.md`, `complete.md` | Router text that promises branch-first and merge. The plan-side task metadata section stays true now that plan writes `tasks.md` | update | `rg -n -e 'Merge only after' -e 'Branch before any' .skilled/commands/speckit/complete.md` prints nothing and `rg -n -i 'task breakdown' .skilled/commands/speckit/plan.md` prints a line |
| `pre_phase_parallel_check` in implement `step_6_development` and complete `step_3_specification`, `step_8_analysis` and `step_10_development` | Asks through `parallel_dispatch_config.thresholds.ask_min` in every mode | update: `modes` map, `direct` under `auto` and `autopilot` | The AC-012 one-liner prints `[]` for both files |
| Three lifecycle presentation files | Render startup, dashboard and result text with no autopilot | update | `rg --count --include-zero SPECKIT_AUTOPILOT_RESULT $A/speckit-{plan,implement,complete}-presentation.txt` prints a count above 0 for each |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/speckit-autopilot-contract.vitest.ts` | Consumer. Pins `branch_first`, `merge_on_clean`, the four `failure_policy` lines and `touched-files` in `plan.md` | update the sequence. The `touched-files` assertion on `plan.md` stays | `npx vitest run tests/unit/speckit-autopilot-contract.vitest.ts` from `$R` exits 0 |
| `.skilled/skills/system-spec-kit/feature-catalog/lifecycle/speckit-autopilot-lifecycle.md` | Consumer doc. Line 35 says merge only on clean verification. Its Planning Metadata paragraph stays true | update | `rg -n -i 'merge only on clean' .skilled/skills/system-spec-kit/feature-catalog/lifecycle/speckit-autopilot-lifecycle.md` prints nothing |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/lifecycle/speckit-autopilot-lifecycle.md` | Consumer doc. Line 14 names clean-verification merge behavior. Step 3, which expects task metadata from `/speckit:plan`, stays true | update | `rg -n -i 'merge behavior' .skilled/skills/system-spec-kit/manual-testing-playbook/lifecycle/speckit-autopilot-lifecycle.md` prints nothing. On 2026-11-14 it printed line 14 |
| `.skilled/skills/system-spec-kit/README.md` | Consumer doc. Line 363 calls autopilot the branch-preserved lifecycle | update | `rg -n 'operator chooses the workspace' .skilled/skills/system-spec-kit/README.md` prints one line |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Consumer. Line 140 lists `autopilot merges git branches after clean verification` | update | `rg -n 'merges git branches' .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` prints nothing |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json` | Holds the phrase `SPECKIT_AUTOPILOT_RESULT` | not a consumer | The phrase stays, so the fixture is unchanged |

Required inventories:
- Same-class producers: `rg -n -e 'wait_for' -e 'STOP - Ask' -e 'ask user' -e '\[Y/n/review\]' -e 'prompt_user' -e 'user must approve' -e 'still pause' .skilled/commands/speckit/assets/speckit-{plan,implement,complete}.yaml`. The result is the `spec.md` section 3 inventory. The ask-first parallel checks hold no ask wording, so `rg -n 'pre_phase_parallel_check' .skilled/commands/speckit/assets/speckit-{implement,complete}.yaml` lists them separately for REQ-012.
- Consumers of changed symbols: `rg -n --glob '!specs/**' -e SPECKIT_AUTOPILOT_RESULT -e unattended_autopilot -e merge_on_clean -e '"merged"' .`. The result is the table above.
- Matrix axes: mode (`auto`, `confirm`, `autopilot`) by command (`plan`, `implement`, `complete`), nine rows. Each row is checked by the mode statement on every inventory key in that command's workflow.
- Algorithm invariant: under `autopilot` no branch after startup asks, and no step creates a branch except through `git worktree add -b` or merges at all.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup re-reads the step keys after phases 1 and 2, writes the scratch checker and captures the baseline counts and the baseline test run.
Implementation edits the three workflows, the three routers, the three presentation files and the five consumer files.
Verification reruns every check in `acceptance-criteria.md`, the scratch checker and the autopilot contract test, and compares each to the baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The autopilot contract: reason codes, sequence and task metadata. Baseline on 2026-11-14 printed `Tests  4 passed (4)` with exit 0 | `npx vitest run tests/unit/speckit-autopilot-contract.vitest.ts` from `$R` |
| Integration | Every stop-and-ask branch in the three workflows carries a mode statement, and the copied blocks are identical | `python3 $C/scratch/check-mode-tags.py $A/speckit-{plan,implement,complete}.yaml` prints `untagged: 0` and `autopilot_ask: 0`. The PyYAML one-liners in `acceptance-criteria.md` print `1` |
| Manual | Read one autopilot path end to end in `speckit-complete.yaml` and check each branch it passes names its autopilot action | `rg -n 'autopilot:' $A/speckit-complete.yaml` lists each tagged key |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1 and 2 complete | Internal | Yellow | Step keys may move. Setup re-reads them before any edit |
| Plan's `step_5_5_task_breakdown` from phase 1 | Internal | Yellow | REQ-002 has no plan step to put the task metadata rule on |
| `rg`, `python3` with PyYAML 6.0.3, `npx vitest` | External | Green | No check can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A workflow file fails `yaml.safe_load`, the autopilot contract test fails after its update or a run under `:auto` waits for an answer at a key the inventory lists.
- **Procedure**: Revert the phase's single commit with `git revert <sha>`. The change touches only text files, holds no data and needs no migration.
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
| Setup | Phase 2 closed | Implementation |
| Implementation | The Setup baseline and the rebuilt inventory | Verification |
| Verification | Every Implementation task done | Phase close and the handoff to phase 4 |
<!-- /ANCHOR:phase-deps -->

---
