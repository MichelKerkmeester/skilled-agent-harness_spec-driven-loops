---
title: "Implementation Plan: Phase 4: code-review-and-dispatch-policy"
description: "Edit three speckit workflow YAML files so implement and complete dispatch @review and act on its verdict, plan keeps one dispatch policy and every agent dispatch matches its agent file. Proof is a set of rg and awk counts plus the command workflow test."
trigger_phrases:
  - "code review and dispatch policy plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: code-review-and-dispatch-policy

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow files read by an AI agent |
| **Framework** | speckit command routers under `.skilled/commands/speckit/` |
| **Storage** | None |
| **Testing** | `rg`, `awk` and `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` |

### Overview
Three workflow files change: `speckit-implement.yaml`, `speckit-complete.yaml` and `speckit-plan.yaml` under `.skilled/commands/speckit/assets/`. Implement and complete gain a review dispatch and a verdict branch, plan loses two of its three dispatch policies and every `@context` dispatch stops overriding its agent file. Each requirement in `spec.md` names an `rg` or `awk` command whose output proves it, and the command workflow test must stay at `failed=0`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phases 1 to 3 are closed: `rg -l '\| Unmet \|' specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/00[123]-*/acceptance-criteria.md` prints nothing
- [ ] The review step keys are known: `rg -n 'available_at_step' .skilled/commands/speckit/assets/speckit-implement.yaml` names a step key that exists under `workflow:`
- [ ] The baseline is recorded: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `Result: passed=150 failed=0`

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints a `Result:` line with `failed=0`
- [ ] Docs updated (spec/plan/tasks) and `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Declarative workflow edits

### Key Components
- **`speckit-implement.yaml` and `speckit-complete.yaml`**: Gain one review activity in an existing step. Without it the blocking `agent_availability.review` entry never runs, so a run completes unreviewed. No new step key is added.
- **`speckit-plan.yaml`**: Keeps `step_5_planning.inline_parallel_exploration` as its one dispatch policy and loses `parallel_dispatch_config` and `multi_agent_config`.

### Data Flow
The agent reads `agent_availability.review` for the agent file, marker and verdict rule, then reaches the step that `available_at_step` names. That step renders the review prompt, dispatches `@review` and reads `review_status` from the result. `APPROVED` or `COMMENTED` lets the step continue to `implementation-summary.md`. `REQUESTED_CHANGES` sends the run back to development once, then halts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `agent_availability.review` in implement and complete | Declares the review agent, marker, verdict and blocking rule. Dispatches nothing | update: single Gate Validation mode, fallback keeps blocking | `rg -n dual_phase .skilled/commands/speckit/assets/` prints nothing |
| `step_7_completion` (implement) and `step_11_acceptance_verify` (complete) | Write the summary and verify criteria with no review | update: first activity dispatches `@review` | `awk` counter on `CODE-REVIEW` per file prints 1 or more |
| `speckit-plan.yaml` dispatch config | Three policies: ask first, always four and unused worker modes | update: keep `step_5_planning` only | `rg -n -e parallel_dispatch_config -e multi_agent_config .skilled/commands/speckit/assets/speckit-plan.yaml` prints nothing |
| `inline_parallel_exploration` in plan and complete | Dispatches `@context` on `opus` and asks for a hypothesis | update: no model, findings only, no Code Graph line | `rg -n -e 'Query Code Graph' -e hypothesis` on both files prints nothing |
| `.claude/agents/context.md` and `.claude/agents/review.md` | Own the model, tools and verdict the workflows must match | unchanged | `rg -n '^model:' .claude/agents/context.md` still prints `model: haiku` |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Owns `research/research.md` | not a consumer of this change | `git diff --stat .skilled/commands/deep/` prints nothing |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | States that implement and complete name `@review` for their review step | unchanged, the sentence stays true | `rg -n 'speckit:implement' .skilled/skills/sk-code/sk-code-review/SKILL.md` prints the same line |
| `test-phase-command-workflows.js` | Reads the three workflow files and asserts their contracts | unchanged, it asserts no key this phase removes | the test prints `failed=0` |

Required inventories:
- Same-class producers: `rg -n -e 'model: opus' -e 'confidence < 60' -e 'confidence_score < 60' -e 'research/research.md' .skilled/commands/speckit/assets/` lists every copy in plan, implement and complete. The complete copies of the D5, D6 and D7 text are fixed with the plan copies.
- Consumers of changed symbols: `rg -n -e multi_agent_config -e parallel_dispatch_config -e quality_standards -e dispatch_mode .skilled/ --glob '*.md' --glob '*.yaml' --glob '*.txt' --glob '*.js'` lists the readers. Today the only readers outside the workflows are the `dispatch_mode` lines in the presentation files, which phase 8 owns.
- Matrix axes: workflow file (plan, implement, complete) by finding (D1 to D7). Each requirement row in `spec.md` names the files it covers.
- Algorithm invariant: a run never writes `implementation-summary.md` while the latest review verdict is `REQUESTED_CHANGES`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup confirms phases 1 to 3 are closed, reads the review step keys and records the test baseline.
Implementation edits `speckit-implement.yaml`, `speckit-complete.yaml` and `speckit-plan.yaml` for the review step, the single dispatch policy and the `@context` and research fixes.
Verification runs each requirement's `rg` or `awk` command, the command workflow test and `validate.sh --strict`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each requirement's text check in the three workflow files | `rg` and `awk`, run per file as each `spec.md` requirement names |
| Integration | The workflow contracts the existing suite asserts | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0`. Baseline before this phase: `Result: passed=150 failed=0` |
| Manual | Read the edited review step in implement and complete end to end | Read the step and confirm the dispatch, the verdict branch and the single re-dispatch appear in that order |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 step order | Internal | Yellow | The review dispatch has no settled step to sit in |
| Phase 2 required-check gates | Internal | Yellow | The review verdict has no gate check to feed |
| Phase 3 mode contract | Internal | Yellow | The FAIL halt and the research trigger have no auto or autopilot behavior to follow |
| `rg`, `awk` and `node` | External | Green | No verification command runs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: `test-phase-command-workflows.js` prints `failed=` above 0, or a review dispatch blocks every run with a verdict the findings do not support.
- **Procedure**: Revert the one commit that edits the three workflow files with `git revert <sha>`. No other file changes in this phase.
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
| Setup | Phases 1 to 3 of the parent closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close of this phase and the start of phase 5 |
<!-- /ANCHOR:phase-deps -->

---
