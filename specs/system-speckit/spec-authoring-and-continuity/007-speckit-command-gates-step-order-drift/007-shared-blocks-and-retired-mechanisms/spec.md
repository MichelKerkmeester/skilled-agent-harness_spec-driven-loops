---
title: "Feature Specification: Phase 7: shared-blocks-and-retired-mechanisms"
description: "The plan, implement and complete workflows each carry their own copy of the goal, checkpoint option, documentation level and phase decomposition blocks, and two of those copies have already drifted. They also cite a goal script, a setup script and a specs root by paths that do not resolve, and they keep scoring steps, timers and prose that no step or reader uses."
trigger_phrases:
  - "shared blocks and retired mechanisms"
  - "phase 7 shared blocks and retired mechanisms"
  - "speckit lifecycle shared include"
  - "speckit retired vocabulary and dead paths"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: shared-blocks-and-retired-mechanisms

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `scaffold/007-shared-blocks-and-retired-mechanisms` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 8 |
| **Predecessor** | 006-save-search-handoff-contracts |
| **Successor** | 008-router-readme-presentation-alignment |
| **Handoff Criteria** | Findings B1 to B11 are closed, `acceptance-criteria.md` has no `Unmet` row, both workflow contract tests exit 0 and `validate.sh --strict` prints `RESULT: PASSED` for this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Fix the speckit command workflows: step order, quality gates, execution modes, review dispatch, resume detection, save and search contracts, shared blocks and documentation drift specification.

**Scope Boundary**: The three lifecycle workflows `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml`, one new shared include beside them, the Owned Assets row for that include in the three lifecycle routers and the two files outside `.skilled/commands/speckit/` that pin the goal block's location. The resume workflows, the save tail and the presentation files stay with phases 5, 6 and 8.

**Dependencies**:
- Phase 1 rewrites `optional_workflows.phase_decomposition` (finding L7). The shared include takes the text phase 1 leaves.
- Phase 2 rewrites the quality gates (findings G1 to G7). The `memory_saved` check sits in complete's exit gate, so phase 7 renames whatever check phase 2 keeps.
- Phase 3 defines the mode contract (findings M1 to M7). Phase 7 removes `autonomous_execution` only after any rule phase 3 keeps from it lives in `execution_mode` or `rules`.
- Phase 4 removes or keeps `multi_agent_config`, `circuit_breaker` agents and the plan dispatch policies (findings D1 and D4). Phase 7 removes the timers in whatever remains.
- Phase 6 settles the save step (findings S13 and S14). It may remove implement's `step_6_5_checkpoint_development` and the inline `write_continuity` block that holds the prose `when:`.

**Deliverables**:
- `assets/speckit-lifecycle-shared.yaml`, holding the blocks that are identical in the lifecycle workflows today.
- The three lifecycle workflows with pointers in place of those blocks, and with no dead path, retired key, scoring step, wall-clock timer or philosophy block.
- The goal offer contract test and the Claude Code goal-hook playbook pointing at the include.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An agent that runs `/speckit:plan`, `/speckit:implement` or `/speckit:complete` reads the same goal block, checkpoint options and documentation levels three times, and the copies already disagree. Implement's `documentation_levels` drops the `LOC` unit from all three `loc_guidance` values. Plan and complete word the phase decomposition prompt differently. The same agent is told to run `bin/goal.cjs` and `check-prerequisites.sh`, which do not resolve from the repository root, and to load authoring guidance only for targets under `.opencode/specs/`, a root that does not exist. It also captures preflight and postflight scores that no step passes on, waits on timers it cannot measure and reads prose blocks that change no step.

### Purpose
Each block that the lifecycle workflows share lives in one file, and every path, key, step and timer left in those workflows resolves or is used by a step.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n -o 'loc_guidance: "[^"]*"|Continue (planning first|with first) child|[^/]bin/goal\.cjs bind|[^/]check-prerequisites\.sh|\.opencode/specs/|memory_saved|memory_action: save|recovery_s: 60|timebox_minutes: 10|session_preference_s: 3600|step_[0-9]+_5_(pre|post)flight:' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml
.skilled/commands/speckit/assets/speckit-implement.yaml:154:'bin/goal.cjs bind
.skilled/commands/speckit/assets/speckit-implement.yaml:235:loc_guidance: "<100"
.skilled/commands/speckit/assets/speckit-implement.yaml:240:loc_guidance: "100-499"
.skilled/commands/speckit/assets/speckit-implement.yaml:245:loc_guidance: ">=500"
.skilled/commands/speckit/assets/speckit-implement.yaml:314:session_preference_s: 3600
.skilled/commands/speckit/assets/speckit-implement.yaml:410:recovery_s: 60
.skilled/commands/speckit/assets/speckit-implement.yaml:424:timebox_minutes: 10
.skilled/commands/speckit/assets/speckit-implement.yaml:477: check-prerequisites.sh
.skilled/commands/speckit/assets/speckit-implement.yaml:571:step_5_5_preflight:
.skilled/commands/speckit/assets/speckit-implement.yaml:664:memory_action: save
.skilled/commands/speckit/assets/speckit-implement.yaml:710:step_7_5_postflight:
.skilled/commands/speckit/assets/speckit-plan.yaml:111:Continue planning first child
.skilled/commands/speckit/assets/speckit-plan.yaml:183:'bin/goal.cjs bind
.skilled/commands/speckit/assets/speckit-plan.yaml:259:loc_guidance: "<100 LOC"
.skilled/commands/speckit/assets/speckit-plan.yaml:264:loc_guidance: "100-499 LOC"
.skilled/commands/speckit/assets/speckit-plan.yaml:269:loc_guidance: ">=500 LOC"
.skilled/commands/speckit/assets/speckit-plan.yaml:357:session_preference_s: 3600
.skilled/commands/speckit/assets/speckit-plan.yaml:431:recovery_s: 60
.skilled/commands/speckit/assets/speckit-plan.yaml:445:timebox_minutes: 10
.skilled/commands/speckit/assets/speckit-plan.yaml:758: check-prerequisites.sh
.skilled/commands/speckit/assets/speckit-complete.yaml:172:Continue with first child
.skilled/commands/speckit/assets/speckit-complete.yaml:236:'bin/goal.cjs bind
.skilled/commands/speckit/assets/speckit-complete.yaml:296:loc_guidance: "<100 LOC"
.skilled/commands/speckit/assets/speckit-complete.yaml:301:loc_guidance: "100-499 LOC"
.skilled/commands/speckit/assets/speckit-complete.yaml:306:loc_guidance: ">=500 LOC"
.skilled/commands/speckit/assets/speckit-complete.yaml:408:session_preference_s: 3600
.skilled/commands/speckit/assets/speckit-complete.yaml:477:.opencode/specs/
.skilled/commands/speckit/assets/speckit-complete.yaml:528:memory_saved
.skilled/commands/speckit/assets/speckit-complete.yaml:537:recovery_s: 60
.skilled/commands/speckit/assets/speckit-complete.yaml:552:timebox_minutes: 10
.skilled/commands/speckit/assets/speckit-complete.yaml:941: check-prerequisites.sh
.skilled/commands/speckit/assets/speckit-complete.yaml:998:memory_action: save
.skilled/commands/speckit/assets/speckit-complete.yaml:1015: check-prerequisites.sh
.skilled/commands/speckit/assets/speckit-complete.yaml:1089: check-prerequisites.sh
.skilled/commands/speckit/assets/speckit-complete.yaml:1108:step_9_5_preflight:
.skilled/commands/speckit/assets/speckit-complete.yaml:1130:.opencode/specs/
.skilled/commands/speckit/assets/speckit-complete.yaml:1130:.opencode/specs/
.skilled/commands/speckit/assets/speckit-complete.yaml:1192:memory_action: save
.skilled/commands/speckit/assets/speckit-complete.yaml:1235:step_11_5_postflight:
```

The block diffs below were run on 2026-11-14 with each block cut from its top-level key to the next one and comment lines removed.

| Block | Files | Result | Drifted lines |
|-------|-------|--------|---------------|
| `goal_prompting` | plan, implement, complete | Identical. 71 lines plus one trailing blank line in each | None |
| `checkpoint_options.standard` | plan, implement, complete | Identical | None. Implement also carries `checkpoint_options.code_review`, which only implement uses |
| `documentation_levels` | plan, complete | Identical | None |
| `documentation_levels` | implement against plan | Drifted | The three `loc_guidance` values lack the `LOC` unit (implement lines 235, 240 and 245 in the output above) |
| `optional_workflows.phase_decomposition` | plan, complete | Drifted | The checkpoint prompt reads `Continue planning first child ({first_child_folder})? [Y/n/review]` in plan and `Continue with first child ({first_child_folder})? [Y/n/review]` in complete. Implement has no `phase_decomposition` |
| Predicate grammar header comment | plan, complete | Drifted | The example literal is `intake_only == TRUE` in plan and `folder_state == populated-folder` in complete. Only plan carries `(regression: T-TEST-NEW-19)`. Implement has no header |

`ls .skilled/hooks/goal/bin/goal.cjs` prints the path and `ls bin/goal.cjs` from the repository root prints `No such file or directory`. `check-prerequisites.sh` lives at `.skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh`. `ls .opencode/specs` prints `No such file or directory`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `assets/speckit-lifecycle-shared.yaml` and move into it the blocks the table above shows identical or drifted: `goal_prompting`, `checkpoint_options` (the `standard` set), `documentation_levels`, `phase_decomposition` and the predicate grammar. Each workflow keeps the key and points at the include with `shared_tail: "assets/speckit-lifecycle-shared.yaml#<key>"` and a `shared_tail_note`. This is the mechanism the save step already uses with `shared_tail: "assets/speckit-save-context-tail.yaml#save_context_core"`: a string `<path>#<top-level key>` resolved from `.skilled/commands/speckit/`, a sibling note, local keys beside the pointer and a row in each router's Owned Assets table. What fails today without the file: two of the four repeated blocks have already drifted (the table above), and every edit to the goal contract is made three times. The cheaper option, three copies held equal by a byte-identical test, is what `packet_goal` has today. It catches drift only in the one sub-block it slices, and every run still reads three copies.
- Add the include's Owned Assets row to `plan.md`, `implement.md` and `complete.md`, as the save tail has. Without the row the router never names the file the agent must load. This is a deliberate phase 7 router edit. Phase 8 aligns the rest of each router.
- Replace the dead paths with repository-rooted ones: the goal script, `check-prerequisites.sh`, `.opencode/specs/`, `prevent-overengineering.md`, the sk-create-goal references, `../deep/assets/deep-research-auto.yaml` and the `sk-code/...` and `system-spec-kit/...` partial paths in complete. The `assets/...#key` pointers stay as they are, because they share the save tail's base and a test pins the tail string.
- Remove what no step uses. That is the `memory_saved` check id and the `memory_action: save` keys. It is the four preflight and postflight steps with their `checkpoints:` entries. It is the wall-clock fields `recovery_s`, `timebox_minutes` and `session_preference_s` with the inline `10 minutes` escalation triggers. It is the prose blocks `planning_philosophy`, `implementation_philosophy`, `development_philosophy` and `autonomous_execution`. It is the `# ─` banner rules and the comment ids `S7 / M11`, `T-TEST-NEW-19` and `F-019-D4-02`.
- Update the two consumers that pin the goal block's location: the goal offer contract test and the Claude Code goal-hook playbook.

### Out of Scope
- The resume workflows' `.opencode/specs/` roots and `memory_*` keys - phase 5 rewrites and merges resume (findings R4 and R5).
- The save tail and its `pre_index_instruction` key - phase 6 owns the save contract (findings S1 and S2).
- The `memory_choice` field in the four lifecycle presentation files - phase 8 owns presentation text and renames the field as finding X3.
- The `preflight` and `postflight` input fields that `generate-context.ts` and `collect-session-data.ts` accept - the parent puts script changes out of scope. No workflow step passes these fields to the writer.
- The rest of each router: flag tables, step counts and README rows - phase 8 (findings A1 to A10).
- Repeated text in the presentation files - phase 8 (finding A7).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/assets/speckit-lifecycle-shared.yaml` | Create | Holds `goal_prompting`, `checkpoint_options`, `documentation_levels`, `phase_decomposition` and `predicate_grammar` once |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Modify | Pointers, repository-rooted paths, no timers, no philosophy blocks, no banners |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modify | Pointers, repository-rooted paths, no preflight or postflight steps, no timers, no `memory_action`, no prose `when:` |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modify | Pointers, repository-rooted paths, no `.opencode/specs/`, no preflight or postflight steps, no timers, no `memory_*` keys |
| `.skilled/commands/speckit/plan.md`, `implement.md`, `complete.md` | Modify | One Owned Assets row for the include |
| `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | Modify | Pins `packet_goal` once in the include, a pointer in each lifecycle workflow and the include in the `goal_prompt_choice` confinement list |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md` | Modify | Lines 34 and 48 name the include as the home of `goal_prompting` and `packet_goal` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

Every check below reads the final state by key or text pattern, so it holds wherever phases 1 to 6 moved the lines. `A` stands for `.skilled/commands/speckit/assets` and `W` for the three files `$A/speckit-plan.yaml $A/speckit-implement.yaml $A/speckit-complete.yaml`.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every goal script command in the lifecycle workflows and the include names `.skilled/hooks/goal/bin/goal.cjs` (closes B4). `rg -n '[^/]bin/goal\.cjs' $A` prints nothing. |
| REQ-002 | Every `check-prerequisites.sh` call in the lifecycle workflows names `.skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh` (closes B5). `rg -n '[^/]check-prerequisites\.sh' $W` prints nothing. |
| REQ-003 | `speckit-complete.yaml` names no `.opencode/specs/` root, and its authoring-time load condition matches targets under `specs/` (closes B6). `rg -n '\.opencode/specs' $A/speckit-complete.yaml` prints nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `goal_prompting` lives once, in `$A/speckit-lifecycle-shared.yaml`. Each lifecycle workflow keeps a `goal_prompting:` key that holds only `shared_tail: "assets/speckit-lifecycle-shared.yaml#goal_prompting"` and its note (closes B1). `rg -n '^  packet_goal:' $W` prints nothing, `rg -c '^  packet_goal:' $A/speckit-lifecycle-shared.yaml` prints 1 and `rg -c '#goal_prompting"' <file>` prints 1 for each file in `W`. |
| REQ-005 | `checkpoint_options.standard`, `documentation_levels` and `phase_decomposition` live once, in the include, through the same pointer form. The canonical text is plan's and complete's `loc_guidance` values with the `LOC` unit, and complete's prompt `Continue with first child ({first_child_folder})? [Y/n/review]` unless phase 1 replaced it. Implement's `code_review` set stays local beside its pointer, and every `options: checkpoint_options.standard` reference resolves through the pointer unchanged (closes B2). `rg -n 'loc_guidance' $W $A/speckit-lifecycle-shared.yaml` prints three lines, all in the include and all ending `LOC"`. `rg -n '^  standard:' $W` prints nothing. `rg -n -e 'Continue planning first child' -e 'Continue with first child' $W $A/speckit-lifecycle-shared.yaml` prints at most one line, in the include. The same prompt in the plan and complete presentation files is phase 8's. |
| REQ-006 | `plan.md`, `implement.md` and `complete.md` each list the include in their Owned Assets table (closes B1 and B2 for the router). `rg -c 'speckit-lifecycle-shared\.yaml' .skilled/commands/speckit/plan.md .skilled/commands/speckit/implement.md .skilled/commands/speckit/complete.md` prints 1 for each file. |
| REQ-007 | The goal offer contract test pins the new location: `packet_goal` once in the include, the `#goal_prompting` pointer in each lifecycle workflow and a `goal_prompt_choice` confinement list that holds the include and the files that still carry the field (closes B1 for its test). `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` exits 0 and prints `ℹ fail 0`. |
| REQ-008 | The goal-hook playbook names the include as the home of `goal_prompting.set_mutation.dispatch_by_runtime` and `packet_goal.bind_by_runtime` (closes B1 for its playbook). `rg -n 'speckit-lifecycle-shared\.yaml' .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md` prints the lines that name those keys. |
| REQ-009 | The predicate grammar lives once, as the include's `predicate_grammar` key, with no ephemeral id and one neutral example literal. Each lifecycle workflow points at it, and no `when:` in the lifecycle workflows or the include holds a prose string (closes B3). `rg -n 'when: "' $W $A/speckit-lifecycle-shared.yaml` prints nothing. `rg -c '#predicate_grammar"' <file>` prints 1 for each file in `W`. `rg -n 'YAML PREDICATE GRAMMAR CONTRACT' $W` prints nothing. |
| REQ-010 | No retired memory vocabulary remains in the lifecycle workflows. The save check and save steps that remain use `continuity` wording, as the save tail does (closes B7). `rg -n -e memory_saved -e memory_action $W` prints nothing. |
| REQ-011 | The preflight and postflight steps are removed from implement and complete, with their `checkpoints:` entries: `step_5_5_preflight`, `step_7_5_postflight`, `step_9_5_preflight` and `step_11_5_postflight` (closes B8, decided 2026-11-14). `rg -n -i -e preflight -e postflight -e 'learning.index' $W` prints nothing. `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` exits 0 and prints `failed=0`. |
| REQ-012 | No wall-clock timer remains in the lifecycle workflows. A breaker or escalation that remains triggers on a count of failures (closes B9). `rg -n -e recovery_s -e timebox_minutes -e session_preference_s -e 'minutes elapsed' -e '10 minutes' $W` prints nothing. |
| REQ-013 | Every file reference in the lifecycle workflows and the include resolves from the repository root, except the `assets/...#key` pointers, which resolve from `.skilled/commands/speckit/` as the save tail pointer does (closes B10). `rg -n -e '[^/]prevent-overengineering\.md' -e '\.\./deep/assets' -e 'sk-create-goal.s references' -e '[^/]sk-code/' -e '[^/]system-spec-kit/references' -e '[^/]references/workflows/' $W $A/speckit-lifecycle-shared.yaml` prints nothing. |
| REQ-014 | The prose blocks, every `# ─` banner rule and the ephemeral comment ids are gone from the lifecycle workflows. A one-line title comment may stay. A rule from a removed block that no other key states moves into `rules` first (closes B11). `rg -n -e '^planning_philosophy:' -e '^implementation_philosophy:' -e '^development_philosophy:' -e '^autonomous_execution:' $W` prints nothing. `rg -n '^# ─' $W` prints nothing. `rg -n -e 'S7 / M11' -e 'T-TEST-NEW-19' -e 'F-019-D4-02' $W` prints nothing. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `diff` of any shared block between two lifecycle workflows has nothing to compare, because `rg -n -e '^  packet_goal:' -e '^  standard:' -e '^  level_1_baseline:' $W` prints nothing and the include holds each block once.
- **SC-002**: The measured command in this spec, run on the final tree, prints no line from `speckit-plan.yaml`, `speckit-implement.yaml` or `speckit-complete.yaml`.
- **SC-003**: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0` and `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` prints `ℹ fail 0`, both with exit 0. The 2026-11-14 baseline is `passed=150 failed=0` and `ℹ pass 5`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 1 to 6 edit the same three workflows | A block moved before phase 1 rewrites `phase_decomposition` would move stale text | Start only after phase 6's `acceptance-criteria.md` has no `Unmet` row, and move each block as it stands then |
| Risk | An agent reads a workflow and skips the pointer | The goal contract or checkpoint options go unread for that run | Keep the Owned Assets row in each router and the `shared_tail_note` beside each pointer, as the save tail does |
| Risk | A consumer outside the speckit folder pins a moved block | A test or playbook fails after the move | Run the consumer inventory in `tasks.md` before the move. Two consumers are known: the goal offer test and the goal-hook playbook |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A. The change edits workflow text that an agent reads. It runs no service and has no latency, security boundary or uptime to measure.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a workflow with no copy of a block, such as implement for `phase_decomposition`, gets no pointer for that block.
- Maximum input: a block with a local extension, implement's `checkpoint_options.code_review`, keeps the extension beside the pointer and the dotted reference `checkpoint_options.code_review` still resolves in implement.
- Failure path: a pointer that names a key missing from the include fails REQ-004, REQ-005 or REQ-009, because `rg -c '^<key>:' $A/speckit-lifecycle-shared.yaml` prints nothing for it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Three workflows, one new include, three router rows, one test and one playbook |
| Risk | 9/25 | Text read by agents. Two known consumers and one structural test pin the moved keys |
| Research | 5/20 | Diffs and consumer inventory done at spec time |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Decided 2026-11-14: preflight and postflight scoring is removed from implement and complete (finding B8). No workflow step passes the scores to the writer, and complete's `step_9_5_preflight` appends to `implementation-summary.md` before `step_12_completion` generates that file. REQ-011 is written to this.
- Decided 2026-11-14: the pointer key stays `shared_tail`. REQ-004, REQ-005 and REQ-009 reuse `shared_tail` and `shared_tail_note`, so no reader, router or test meets a new key.
- Decided 2026-11-14: a phase may edit the tests and docs outside `.skilled/commands/speckit/` that assert the current text, and it updates the ones it invalidates. This phase updates the goal offer contract test and the Claude Code goal-hook playbook (REQ-007 and REQ-008).
- Phase 8 owns finding X3: the `memory_choice` field in the four lifecycle presentation files, retired vocabulary of the same class as B7.
<!-- /ANCHOR:questions -->

---
