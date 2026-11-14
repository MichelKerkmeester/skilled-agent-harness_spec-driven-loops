---
title: "Tasks: Phase 7: shared-blocks-and-retired-mechanisms"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "shared blocks and retired mechanisms tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: shared-blocks-and-retired-mechanisms

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Run every command from the repository root. `A` is `.skilled/commands/speckit/assets`. `I` is `$A/speckit-lifecycle-shared.yaml`. `W` is `$A/speckit-plan.yaml $A/speckit-implement.yaml $A/speckit-complete.yaml`. `P` is `specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/007-shared-blocks-and-retired-mechanisms` and `S` is `$P/scratch`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Run the workflow structure test on the post-phase-6 tree (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` exits 0 and prints `failed=0`.
- [ ] T002 Run the goal offer contract test on the post-phase-6 tree (`.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs`). Verify: `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` exits 0 and prints `ℹ fail 0`.
- [ ] T003 Diff the four repeated key blocks across the workflows that hold them with comment lines removed and the predicate grammar header comments as they are, and record the output (`$S/block-diffs.txt`). Verify: `rg -c -e goal_prompting -e checkpoint_options -e documentation_levels -e phase_decomposition -e 'PREDICATE GRAMMAR' $S/block-diffs.txt` prints a number of at least 5.
- [ ] T004 Run the consumer inventory for the moved keys and record it (`$S/consumers.txt`). Verify: `rg -n -e speckit-goal-offer-contract -e goal-hook.md $S/consumers.txt` prints two lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Shared include
- [ ] T005 Create the include with `goal_prompting` copied from plan as it stands after phase 6 (`.skilled/commands/speckit/assets/speckit-lifecycle-shared.yaml`). Verify: `rg -c '^goal_prompting:' $I` prints 1 and `rg -c '^  packet_goal:' $I` prints 1.
- [ ] T006 Add `checkpoint_options` with the `standard` set, `documentation_levels` with the `LOC` unit and `phase_decomposition` with the prompt `Continue with first child ({first_child_folder})? [Y/n/review]` unless phase 1 replaced it (`.skilled/commands/speckit/assets/speckit-lifecycle-shared.yaml`). Verify: `rg -n 'loc_guidance' $I` prints three lines ending `LOC"`.
- [ ] T007 Add `predicate_grammar` as a key with one neutral example literal and no ephemeral id (`.skilled/commands/speckit/assets/speckit-lifecycle-shared.yaml`). Verify: `rg -c '^predicate_grammar:' $I` prints 1 and `rg -n -e 'S7 / M11' -e 'T-TEST-NEW-19' $I` prints nothing.
- [ ] T008 Rewrite the goal script and sk-create-goal reference paths in the include to repository-rooted paths (`.skilled/commands/speckit/assets/speckit-lifecycle-shared.yaml`). Verify: `rg -n -e '[^/]bin/goal\.cjs' -e 'sk-create-goal.s references' $I` prints nothing.

### Pointers
- [ ] T009 Replace plan's five moved blocks with `shared_tail` pointers and notes (`.skilled/commands/speckit/assets/speckit-plan.yaml`). Verify: `rg -c 'shared_tail: "assets/speckit-lifecycle-shared.yaml#' $A/speckit-plan.yaml` prints 5.
- [ ] T010 Replace implement's four moved blocks with pointers and keep `checkpoint_options.code_review` beside its pointer (`.skilled/commands/speckit/assets/speckit-implement.yaml`). Verify: `rg -c 'shared_tail: "assets/speckit-lifecycle-shared.yaml#' $A/speckit-implement.yaml` prints 4 and `rg -c '^  code_review:' $A/speckit-implement.yaml` prints 1.
- [ ] T011 Replace complete's five moved blocks with pointers and notes (`.skilled/commands/speckit/assets/speckit-complete.yaml`). Verify: `rg -c 'shared_tail: "assets/speckit-lifecycle-shared.yaml#' $A/speckit-complete.yaml` prints 5.

### Paths
- [ ] T012 Rewrite plan's dead paths to repository-rooted ones: `check-prerequisites.sh` and `prevent-overengineering.md` (`.skilled/commands/speckit/assets/speckit-plan.yaml`). Verify: `rg -n -e '[^/]check-prerequisites\.sh' -e '[^/]prevent-overengineering\.md' $A/speckit-plan.yaml` prints nothing.
- [ ] T013 Rewrite implement's `check-prerequisites.sh` call to its repository-rooted path (`.skilled/commands/speckit/assets/speckit-implement.yaml`). Verify: `rg -n '[^/]check-prerequisites\.sh' $A/speckit-implement.yaml` prints nothing.
- [ ] T014 Rewrite complete's dead paths: `.opencode/specs/` to `specs/`, `check-prerequisites.sh`, `prevent-overengineering.md`, `../deep/assets/deep-research-auto.yaml` and the `sk-code/`, `system-spec-kit/references/` and `references/workflows/` partial paths (`.skilled/commands/speckit/assets/speckit-complete.yaml`). Verify: `rg -n -e '\.opencode/specs' -e '[^/]check-prerequisites\.sh' -e '[^/]prevent-overengineering\.md' -e '\.\./deep/assets' -e '[^/]sk-code/' -e '[^/]system-spec-kit/references' -e '[^/]references/workflows/' $A/speckit-complete.yaml` prints nothing.

### Retired mechanisms
- [ ] T015 Replace `memory_action: save` with continuity wording in whatever save step phase 6 kept (`.skilled/commands/speckit/assets/speckit-implement.yaml`). Verify: `rg -n -e memory_saved -e memory_action $A/speckit-implement.yaml` prints nothing.
- [ ] T016 Replace the `memory_saved` check id and both `memory_action: save` keys with continuity wording (`.skilled/commands/speckit/assets/speckit-complete.yaml`). Verify: `rg -n -e memory_saved -e memory_action $A/speckit-complete.yaml` prints nothing.
- [ ] T017 Delete `step_5_5_preflight` and `step_7_5_postflight` and their `checkpoints:` entries (`.skilled/commands/speckit/assets/speckit-implement.yaml`). Verify: `rg -n -i -e preflight -e postflight -e 'learning.index' $A/speckit-implement.yaml` prints nothing.
- [ ] T018 Delete `step_9_5_preflight` and `step_11_5_postflight` and their `checkpoints:` entries (`.skilled/commands/speckit/assets/speckit-complete.yaml`). Verify: `rg -n -i -e preflight -e postflight $A/speckit-complete.yaml` prints nothing.
- [ ] T019 Delete the wall-clock fields and the inline `10 minutes` trigger, keeping count thresholds (`.skilled/commands/speckit/assets/speckit-plan.yaml`). Verify: `rg -n -e recovery_s -e timebox_minutes -e session_preference_s -e 'minutes elapsed' -e '10 minutes' $A/speckit-plan.yaml` prints nothing.
- [ ] T020 Delete the wall-clock fields, keeping count thresholds (`.skilled/commands/speckit/assets/speckit-implement.yaml`). Verify: `rg -n -e recovery_s -e timebox_minutes -e session_preference_s -e 'minutes elapsed' -e '10 minutes' $A/speckit-implement.yaml` prints nothing.
- [ ] T021 Delete the wall-clock fields and the inline `10 minutes` trigger, keeping count thresholds (`.skilled/commands/speckit/assets/speckit-complete.yaml`). Verify: `rg -n -e recovery_s -e timebox_minutes -e session_preference_s -e 'minutes elapsed' -e '10 minutes' $A/speckit-complete.yaml` prints nothing.
- [ ] T022 Delete `planning_philosophy`, `autonomous_execution`, the `# ─` banner rules and the `S7 / M11` and `T-TEST-NEW-19` comment ids, moving any rule no other key states into `rules` first (`.skilled/commands/speckit/assets/speckit-plan.yaml`). Verify: `rg -n -e '^planning_philosophy:' -e '^autonomous_execution:' -e '^# ─' -e 'S7 / M11' -e 'T-TEST-NEW-19' $A/speckit-plan.yaml` prints nothing.
- [ ] T023 Delete `implementation_philosophy`, `autonomous_execution`, the `# ─` banner rules and the `F-019-D4-02` comment id, and turn any prose `when:` into `after:` (`.skilled/commands/speckit/assets/speckit-implement.yaml`). Verify: `rg -n -e '^implementation_philosophy:' -e '^autonomous_execution:' -e '^# ─' -e 'F-019-D4-02' -e 'when: "' $A/speckit-implement.yaml` prints nothing.
- [ ] T024 Delete `development_philosophy`, `autonomous_execution`, the `# ─` banner rules and the `S7 / M11` comment id (`.skilled/commands/speckit/assets/speckit-complete.yaml`). Verify: `rg -n -e '^development_philosophy:' -e '^autonomous_execution:' -e '^# ─' -e 'S7 / M11' $A/speckit-complete.yaml` prints nothing.

### Routers and consumers
- [ ] T025 [P] Add the include row to Owned Assets (`.skilled/commands/speckit/plan.md`). Verify: `rg -c 'speckit-lifecycle-shared\.yaml' .skilled/commands/speckit/plan.md` prints 1.
- [ ] T026 [P] Add the include row to Owned Assets (`.skilled/commands/speckit/implement.md`). Verify: `rg -c 'speckit-lifecycle-shared\.yaml' .skilled/commands/speckit/implement.md` prints 1.
- [ ] T027 [P] Add the include row to Owned Assets (`.skilled/commands/speckit/complete.md`). Verify: `rg -c 'speckit-lifecycle-shared\.yaml' .skilled/commands/speckit/complete.md` prints 1.
- [ ] T028 Repoint the goal offer test: `packet_goal` once in the include, the `#goal_prompting` pointer in each lifecycle workflow and the include in the `goal_prompt_choice` confinement list (`.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs`). Verify: `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` exits 0 and prints `ℹ fail 0`.
- [ ] T029 Repoint the source rows at lines 34 and 48 to the include (`.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md`). Verify: `rg -n 'speckit-lifecycle-shared\.yaml' .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md` prints the lines that name `goal_prompting` and `packet_goal`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Run the workflow structure test (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` exits 0 and prints `failed=0`.
- [ ] T031 Run the goal offer contract test (`.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs`). Verify: `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` exits 0 and prints `ℹ fail 0`.
- [ ] T032 Rerun the Measured Behavior command from `spec.md` on the final tree (`spec.md`). Verify: the command prints no line from `speckit-plan.yaml`, `speckit-implement.yaml` or `speckit-complete.yaml`.
- [ ] T033 Run the Verification command of every row and mark each row `Met` with its observed output (`acceptance-criteria.md`). Verify: `ls $P/acceptance-criteria.md` prints the path and `rg -c '\| Unmet \|' $P/acceptance-criteria.md` prints nothing.
- [ ] T034 Validate this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/007-shared-blocks-and-retired-mechanisms --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `acceptance-criteria.md` has no `Unmet` row and both contract tests print zero failures
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Parent**: See `../spec.md` for the Findings Ledger rows B1 to B11
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task that cannot run is marked `[B]` with the reason on the same line. A `[B]` task blocks close.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 6 is closed: `rg -c '\| Unmet \|' specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/006-save-search-handoff-contracts/acceptance-criteria.md` prints nothing, and `ls` of that path prints it.
- [ ] CHK-002 [P0] Both contract tests pass before the first edit (T001 and T002).
- [ ] CHK-003 [P1] The block diffs and the consumer inventory are recorded in `scratch/` (T003 and T004).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The include and the three workflows parse as YAML. Run `NODE_PATH=.skilled/skills/system-spec-kit/node_modules node -e "require('js-yaml').load(require('fs').readFileSync(process.argv[1],'utf8'))" <file>` once for `$I` and once for each file in `W`. Each run exits 0. The three workflows parse this way on 2026-11-14.
- [ ] CHK-011 [P0] Every `shared_tail` pointer names a key the include holds. For each key name that `rg -o -N -I 'speckit-lifecycle-shared\.yaml#[a-z_]+"' $W` prints, `rg -c '^<key name>:' $I` prints 1.
- [ ] CHK-012 [P1] No comment in the changed files holds a spec path, packet number or finding id: `rg -n -e '#.*REQ-' -e '#.*ADR-' -e '#.*T-TEST' -e '#.*F-0[0-9]' $I $W` prints nothing.
- [ ] CHK-013 [P1] Each pointer has a `shared_tail_note` sibling: `rg -c 'shared_tail_note:' $W` prints the same per-file count as `rg -c 'shared_tail:' $W`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met` (T033).
- [ ] CHK-021 [P0] `test-phase-command-workflows.js` prints `failed=0` and the goal offer test prints `ℹ fail 0` (T030 and T031).
- [ ] CHK-022 [P1] Edge case: implement's `checkpoint_options.code_review` still resolves: `rg -n 'options: checkpoint_options.code_review' $A/speckit-implement.yaml` prints a line and `rg -c '^  code_review:' $A/speckit-implement.yaml` prints 1.
- [ ] CHK-023 [P1] Failure path: a pointer to a missing key is caught by CHK-011.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each finding has a class. B1 and B2 are `cross-consumer`. B3 is `instance-only`. B4 to B11 are `class-of-bug`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory is complete for the three lifecycle workflows. The resume workflows and the presentation files are named as out of scope in `spec.md`.
- [ ] CHK-FIX-003 [P0] Consumer inventory is complete: the goal offer test, the goal-hook playbook and `test-phase-command-workflows.js` are checked (T004).
- [ ] CHK-FIX-004 [P0] N/A. The change touches no security, path parser or redaction code. The paths it rewrites are text that an agent reads.
- [ ] CHK-FIX-005 [P1] Matrix axes are listed in `plan.md` Affected Surfaces: five blocks by three workflows.
- [ ] CHK-FIX-006 [P1] N/A. The tests read files, not process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence in `acceptance-criteria.md` names the phase 7 commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] N/A. The changed files hold workflow text and read no credential.
- [ ] CHK-031 [P1] No rewritten path points outside the repository: every new path starts with `.skilled/` or `specs/`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same include path: `rg -c 'speckit-lifecycle-shared\.yaml' $P/spec.md $P/plan.md $P/tasks.md` prints a number above 0 for each.
- [ ] CHK-041 [P1] The three routers list the include beside the save tail (T025 to T027).
- [ ] CHK-042 [P2] The README tree entry for the include is left to phase 8 and named in its spec.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The block diffs and the consumer inventory live in `scratch/` only.
- [ ] CHK-051 [P1] `scratch/` holds only `.gitkeep` before close: `ls -A $P/scratch` prints `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
