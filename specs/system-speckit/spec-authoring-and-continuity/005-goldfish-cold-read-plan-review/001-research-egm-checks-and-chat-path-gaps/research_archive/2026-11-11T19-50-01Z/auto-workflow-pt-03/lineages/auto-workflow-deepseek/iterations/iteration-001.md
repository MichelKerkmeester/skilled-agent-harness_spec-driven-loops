# Iteration 1: Inventory of workflow-only checks vs the chat path

## Focus

Question 1: which checks live only in the `speckit-plan` / `speckit-implement` / `speckit-complete` command workflows and are absent from the natural-chat write path, and which of them the chat path already duplicates. This iteration builds the checklist every later mechanism comparison is scored against, so it reads the command routers, the three workflow YAMLs, the chat path's binding rules, and the validator rule list.

## Actions Taken

1. Read the three command routers (`.skilled/commands/speckit/plan.md`, `implement.md`, `complete.md`) to separate router duties from workflow duties.
2. Enumerated the plan workflow's checkpoints, gate blocks, validations and step bodies (`speckit-plan.yaml` lines 1-110, 400-520, 560-835).
3. Enumerated the implement workflow's checkpoints, quality gates and validations (`speckit-implement.yaml`).
4. Read `AGENTS.md` gates 1-6 and the `system-spec-kit` SKILL.md core workflow, completion gates and ALWAYS/NEVER lists.
5. Read the validator rule inventory (`validation-rules.md` section headings and rule ids) and the authoring-card/quick-reference section map.

## Findings

1. **The chat path's entire spec-kit binding surface is two skill files plus the validator, while the workflow surface is three YAMLs the chat path never opens.** `.skilled/skills/system-spec-kit/SKILL.md` (28185 bytes) and `ROUTER.md` (26012 bytes) are what Gate 2 and the artifact trigger load; `speckit-plan.yaml` (885 lines), `speckit-implement.yaml` (830 lines) and `speckit-complete.yaml` (1444 lines) are loaded only by the `speckit:*` routers [SOURCE: .skilled/commands/speckit/plan.md:9] [SOURCE: .skilled/commands/speckit/plan.md:24] [SOURCE: .skilled/commands/speckit/implement.md:24].

2. **The plan workflow runs seven checkpoints, each with a named validation state the chat path has no equivalent for.** `checkpoints: [step_1_request_analysis, step_2_pre_work_review, step_3_specification, step_4_clarification, step_5_planning, step_6_save_context, step_7_handover_check]` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:21], and each step closes on a validation token: `understanding_confirmed` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:587], `principles_established` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:599], `spec_complete` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:644], `requirements_clear` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:658], `approach_defined` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:787], `context_saved_successfully` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:801], `workflow_finish_confirmed` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:824]. The chat path's binding rules name none of these states; its ALWAYS list is about level, templates, completion gates and validation [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:200] [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:211].

3. **The workflow has an explicit planning gate that the chat path does not: `spec.md` and `plan.md` must both exist before the run may proceed.** `planning_gate.location: "After Step 5"`, requirements `"spec.md exists, no [NEEDS CLARIFICATION] markers"` and `"plan.md exists with technical approach"`, `action_if_failed: "STOP and return to incomplete step"` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:461]. The chat path is bound by `validate.sh` file-presence rules, which check what a level requires, not whether the technical approach was decided before code started [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:212].

4. **The workflow runs two scored hard-blocking quality gates; the chat path runs none.** Pre-execution gate threshold 70 with `feature_description 30`, `spec_path_valid 30`, `no_blocking_deps 20`, `execution_mode_set 20`; post-execution gate threshold 70 with `spec_exists 25`, `plan_exists 25`, `tasks_exists 20`, `context_saved 15` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:403] [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:407] [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:415]. Both are `blocking: hard` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:406] [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:418]. The chat path has only pass/fail validator rules.

5. **The implement workflow's pre-implementation gate is the single strongest workflow-only check: threshold 70, `blocking: hard`, and 25 of its 100 points are `plan_clarity`.** `prerequisites_complete 30`, `plan_clarity 25`, plus task-breakdown and checklist points, with `on_fail` "Fix blocking issues before coding" [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:384] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:389] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:390]. Its request-analysis counterpart adds `plan_understood` and `confidence_80_plus` to the pre-implementation validation list [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:430].

6. **Several checks are already duplicated on the chat path, so a fix list must not re-add them.** Level determination before any file change [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:200], scaffold-from-template and placeholder fill [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:201] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:306], both completion gates [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:207], and `validate.sh` before completion [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:211] exist on both paths. The workflow's own step bodies call the same `validate.sh --strict` the chat path is told to run [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:781].

7. **The chat path is actually stronger than the workflow on one check: folder selection.** Gate 3 is a hard block that fires on any write and asks A/B/C/D [SOURCE: AGENTS.md:72], and Gate 5 loads repository rules on the first write [SOURCE: AGENTS.md:91]. The plan workflow's folder logic is an intake classifier that can proceed without asking when the folder is `populated-folder` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:486]. Any mechanism that routes chat into the workflow must not lose Gate 3.

8. **Continuity is a checkpoint in the workflow and a suggestion on the chat path.** Plan step 6 exists to refresh canonical continuity and closes on `context_saved_successfully` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:801], while the chat path's rule is "Create `implementation-summary.md` at end of implementation phase" plus "Suggest `/speckit:save`" [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:212] [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:213].

9. **Ambiguity handling differs in shape: the workflow caps and resolves markers; the chat path only forbids leaving them.** Plan step 4's activity is `Extract [NEEDS CLARIFICATION] markers (max 3)` then resolve and update `spec.md` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:656], while the chat path's rule is "Fill ALL placeholders" [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:202] and the validator's `PLACEHOLDER_FILLED` rule [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:306].

## Ruled Out

- Reading `speckit-complete.yaml` line by line this iteration: the complete workflow composes the plan and implement steps, so its step bodies would duplicate findings 2-5 at 1444 lines of cost. Its router-level contract was enough for the inventory; the composed workflow is the same checks in one run.
- Treating the router Markdown files as check carriers: both routers explicitly disclaim dispatch, step logic and artifact writes and delegate to the YAML [SOURCE: .skilled/commands/speckit/implement.md:13].

## Dead Ends

- None. The inventory resolved cleanly.

## Edge Cases

- Ambiguous input: none. "Chat path" was read as the binding surface a non-`speckit:*` session loads: AGENTS.md + `system-spec-kit` SKILL/ROUTER + validator + templates.
- Contradictory evidence: none found. The workflow's `validate.sh` call and the chat path's validator obligation are the same command, not competing claims.
- Missing dependencies: none.
- Partial success: none; all five source groups were readable.

## Sources Consulted

- `.skilled/commands/speckit/plan.md:9`, `:24`
- `.skilled/commands/speckit/implement.md:13`, `:24`
- `.skilled/commands/speckit/assets/speckit-plan.yaml:21`, `:403-422`, `:461-465`, `:587`, `:599`, `:644`, `:656-658`, `:781`, `:787`, `:801`, `:824`
- `.skilled/commands/speckit/assets/speckit-implement.yaml:384-392`, `:430`
- `.skilled/skills/system-spec-kit/SKILL.md:100-126`, `:200-213`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md:212`, `:306`
- `AGENTS.md:72`, `:91`

## Assessment

- New information ratio: 0.85
- Questions addressed: Which checks exist only in the speckit command workflows and are absent from the natural-chat write path, and which are already duplicated there?
- Questions answered: Which checks exist only in the speckit command workflows and are absent from the natural-chat write path, and which are already duplicated there?
- Novelty justification: the packet had no workflow-vs-chat checklist; 7 of 9 findings are new and 2 (Gate 3 strength, validator overlap) confirm relationships seen only in passing elsewhere.

## Reflection

- What worked and why: reading the workflow's gate blocks before the step bodies produced the scored gates first, which are the workflow-only checks that actually block. Step bodies mostly describe activities; the gate blocks and validation tokens are where refusal lives.
- What did not work and why: an initial pass grepped for `validation:` and collected only step-ending tokens, which made the workflow look like seven named states with no teeth. Adding the `quality_gates` and `workflow_enforcement` blocks changed the picture: the teeth are thresholds, not tokens.
- What I would do differently: pull `speckit-complete.yaml`'s gate block in the same pass, because a composed workflow may carry an additional gate that neither child router shows.

## Recommended Next Focus

Pin the concrete failure the gap admits: find where a plan only its author can follow passes the chat path today (template anchors, validator rules and the authoring card's plan shape) and what the smallest change to an existing line would stop it.
