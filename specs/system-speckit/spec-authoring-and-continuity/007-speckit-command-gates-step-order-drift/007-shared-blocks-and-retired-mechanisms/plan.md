---
title: "Implementation Plan: Phase 7: shared-blocks-and-retired-mechanisms"
description: "Move the blocks the three lifecycle workflows repeat into one shared include, reached through the same path-and-key pointer the save tail uses. Then remove dead paths, retired keys, scoring steps, wall-clock timers and prose blocks, and prove it with rg checks and the two workflow contract tests."
trigger_phrases:
  - "shared blocks and retired mechanisms plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: shared-blocks-and-retired-mechanisms

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow assets and Markdown command routers read by AI agents |
| **Framework** | Smart SpecKit command workflows under `.skilled/commands/speckit/` |
| **Storage** | None |
| **Testing** | `rg` checks, `node --test` for the goal offer contract test, `node` for `test-phase-command-workflows.js` |

### Overview
Create `assets/speckit-lifecycle-shared.yaml` and replace five repeated blocks in plan, implement and complete with `shared_tail` pointers, the key the save step already uses. Rewrite the dead paths to repository-rooted ones and delete the retired keys, the four scoring steps, the timers and the prose blocks. Prove it with the `rg` checks in `acceptance-criteria.md` and the two contract tests, which pass today at `passed=150 failed=0` and `ℹ pass 5`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 6 `acceptance-criteria.md` has no `Unmet` row: `rg -c '\| Unmet \|' specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/006-save-search-handoff-contracts/acceptance-criteria.md` prints nothing, and `ls` of that path prints it.
- [ ] Both contract tests pass before the first edit: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0` and `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` prints `ℹ fail 0`.
- [ ] The block diffs in `spec.md` are rerun on the post-phase-6 tree and any new drift is named before the move.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met` with the observed output in its Verification cell.
- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` exits 0 and prints `failed=0`, and `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` exits 0 and prints `ℹ fail 0`.
- [ ] `validate.sh --strict` prints `RESULT: PASSED` for this folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared block pointer. The include is the one component added. What fails without it is in `spec.md` section 3: two of the four repeated blocks have drifted, and the goal contract is edited three times.

### Key Components
- **`assets/speckit-lifecycle-shared.yaml`**: holds `goal_prompting`, `checkpoint_options` (the `standard` set), `documentation_levels`, `phase_decomposition` and `predicate_grammar` as top-level keys.
- **The three lifecycle workflows**: keep each moved key, holding `shared_tail: "assets/speckit-lifecycle-shared.yaml#<key>"` and a `shared_tail_note`, with any local child beside it.

### Data Flow
The router lists the workflow and the include in Owned Assets. The agent loads the workflow, meets a `shared_tail` pointer, resolves its path from `.skilled/commands/speckit/` and reads the named top-level key from the include. Local children of the key, such as implement's `checkpoint_options.code_review`, apply beside the shared ones. A dotted reference such as `options: checkpoint_options.standard` resolves through the pointer with no change to the step that holds it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assets/speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml` | Producers of every repeated block, dead path and retired key | update | The `rg` checks in `acceptance-criteria.md` |
| `assets/speckit-lifecycle-shared.yaml` | Does not exist | create | `ls` prints the path. `rg -c '^goal_prompting:'` prints 1 |
| `plan.md`, `implement.md`, `complete.md` | Owned Assets tables name the workflow and the save tail | update | `rg -c 'speckit-lifecycle-shared\.yaml'` prints 1 per router |
| `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | Slices `packet_goal` from each lifecycle workflow and confines `goal_prompt_choice` to five YAML files | update | `node --test` prints `ℹ fail 0` |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md` | Lines 34 and 48 cite `speckit-plan.yaml` for `goal_prompting` and `packet_goal` | update | `rg -n 'speckit-lifecycle-shared\.yaml'` prints those lines |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` | T-EM3 requires every `checkpoints:` entry to name a real step. T-EM6 pins the exact `shared_tail` string | unchanged | Passes once the scoring steps leave both the steps and the `checkpoints:` lists |
| `.skilled/skills/system-spec-kit/shared/tests/boolean-expr.test.ts` | Reads complete's `write_continuity` block for `after:` | not a consumer | Phase 7 does not edit `write_continuity`. Phase 6 owns it |
| `generate-context.ts`, `collect-session-data.ts` | Accept optional `preflight` and `postflight` input | unchanged | Out of scope as scripts. No workflow step passes the fields |
| `speckit-resume-auto.yaml`, `speckit-resume-confirm.yaml` | Read `goal_prompting` and carry `.opencode/specs/` | not a consumer | Phase 5 owns them |

Required inventories:
- Same-class producers: `rg -n -e goal_prompting -e packet_goal -e checkpoint_options -e documentation_levels -e phase_decomposition --glob '!specs/**' --glob '!**/node_modules/**' --glob '!**/changelog/**' .` run before the move. On 2026-11-14 it found the five workflows, the goal offer test and the goal-hook playbook.
- Consumers of changed symbols: `rg -n -l 'speckit-(plan|implement|complete)\.yaml' --glob '!specs/**' --glob '!**/node_modules/**' .` lists every reader of the three workflows. Each reader is checked for a moved key.
- Matrix axes: five blocks by three workflows. Rows: `goal_prompting` in three, `checkpoint_options.standard` in three, `documentation_levels` in three, `phase_decomposition` in plan and complete, `predicate_grammar` in three.
- Algorithm invariant: for every moved key K, a workflow that held K before still resolves K, and its local children of K are unchanged.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

- **Setup**: rerun both contract tests and the block diffs on the post-phase-6 tree, and run the consumer inventory.
- **Implementation**: create the include, swap the repeated blocks for pointers, fix the paths and delete the retired mechanisms in plan, implement and complete, then update the routers, the goal offer test and the goal-hook playbook.
- **Verification**: run every `rg` check in `acceptance-criteria.md` and both contract tests, then validate this folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Goal offer contract: `packet_goal` location and `goal_prompt_choice` confinement | `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` prints `ℹ fail 0` |
| Integration | Workflow structure: checkpoint steps, confirm blocks and the save tail pointer | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0` |
| Manual | Each finding's end state in the three workflows and the include | The `rg` command in each `acceptance-criteria.md` row prints what its Verification cell says |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1 to 6 complete | Internal | Yellow | A block moved early carries text a later phase rewrites, such as `phase_decomposition` (L7) or the save steps (S13, S14) |
| `rg` and `node` | External | Green | No check can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: either contract test fails after the move, or an agent run cannot resolve a `shared_tail` pointer.
- **Procedure**: revert the phase 7 commit with `git revert <phase-7-commit>`. The include is new and the other files return to their phase 6 state.
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
| Setup | Phase 6 closed | Implementation |
| Implementation | Setup baselines and rerun diffs | Verification |
| Verification | Implementation | Phase 8 start |
<!-- /ANCHOR:phase-deps -->

---
