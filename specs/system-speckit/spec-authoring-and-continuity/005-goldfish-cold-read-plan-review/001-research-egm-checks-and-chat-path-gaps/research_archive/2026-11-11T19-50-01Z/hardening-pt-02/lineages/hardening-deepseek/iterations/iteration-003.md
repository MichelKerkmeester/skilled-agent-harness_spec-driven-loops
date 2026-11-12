# Iteration 3: Copy drift across plan, implement and complete; the three emission leads

## Focus

Lead 5 (copies of the same steps and gates that may have drifted apart), then leads 6, 7 and 8, which are all questions about whether a required emission or a required detection actually happens outside the YAML. Lead 5's structural claim had to be settled before the emission leads, because the same defect class — a rule written in three places — is what makes an emission count ambiguous.

## Actions Taken

1. Read the level and template tables in `speckit-plan.yaml:250-305`, `speckit-implement.yaml:228-250` and `speckit-complete.yaml:140-152`.
2. Read `speckit-complete.yaml:545-562` (`confidence_framework`, `request_analysis_framework`) and `:690-760` (intake, step 1, step 2, phase research).
3. Compared `confidence_framework`, `circuit_breaker`, `request_analysis_framework` and `workflow_enforcement` across the three files.
4. `rg recommend-level` across the three files and `rg selected_level` for any other level source.
5. Counted on disk under `specs/` with `find` and `rg`: `[DEVIATION:` carriers, `debug-delegation*.md`, non-archived `plan.md`, `research/research.md`, `acceptance-criteria.md`, `implementation-summary.md` and its deviations section.
6. Read the `:with-phases` pre-workflow block in `speckit-plan.yaml:80-95` and `speckit-complete.yaml:140-152`.

## Findings

1. **Lead 5 is confirmed structurally, and it is bigger than "copies": `speckit-complete.yaml` is a second implementation of plan and implement.** Its checkpoint list (`:21`) runs `step_1` through `step_14` plus four auxiliary steps, and steps 1-7 repeat plan's seven (`request_analysis`, `pre_work_review`, `specification`, `clarification`, `acceptance_criteria`, `planning`, `task_breakdown`) while steps 8-12 repeat implement's. Every gate, confidence block and mode rule therefore exists in two copies, and the copies are free to drift. [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:21]

2. **The same key `confidence_framework.scoring_weights` names three different scoring models, so a confidence percentage is not comparable across the three commands.** Plan scores `requirements_clarity` 0.30 / `technical_approach` 0.25 / `pattern_alignment` 0.25 / `risk_awareness` 0.20; implement scores `pattern_alignment` 0.30 / `side_effect_awareness` 0.25 / `implementation_clarity` 0.25 / `test_coverage` 0.20; complete scores seven factors — `requirements_clarity` 0.25, `api_design` 0.15, `state_flow` 0.15, `type_safety` 0.10, `performance` 0.10, `accessibility` 0.10, `tooling_risk` 0.15. Complete's is a web/API review scale; the other two are planning scales. A "70%" written by one command says nothing to a reader of another. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:443] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:422] [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:551]

3. **`circuit_breaker.states` diverges on what happens after the third failure, which is a behavioural contradiction rather than a wording difference.** Plan: `OPEN: workflow_halted`. Implement: `OPEN: skip_affected_step`. Complete: `OPEN: use_fallback`, backed by an `agents` map that downgrades research and review to `general`. The same key, triggered by the same threshold (`failures: 3`), produces halt in one command, silent skipping in the second and agent substitution in the third. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:429-433] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:408-412] [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:535-540]

4. **The pre-change discipline has three names and three lengths.** Plan's `request_analysis_framework.pre_change_validation` lists 5 items; complete's lists 9, adding `user_approval` and `checklist_verified_L2_plus`; implement renames the key to `pre_implementation_validation` with 5 different items (`plan_understood`, `tasks_clear`, `patterns_identified`, `confidence_80_plus`, `scope_bounded`). Nothing checks that the renaming kept the same conditions, and complete's extra `checklist_verified_L2_plus` appears nowhere else in the family. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:452] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:430] [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:563]

5. **Refuted within lead 5: the documentation-level tables have not drifted.** Plan, implement and complete carry identical `required_files` per level (`[spec.md, plan.md, tasks.md]`, then `+ acceptance-criteria.md` at Level 2 and again at Level 3); the only difference is the `loc_guidance` string (`"<100 LOC"` in plan versus `"<100"` elsewhere). The copies drifted in the behavioural blocks, not in the structural contract, which is the opposite of what a "copies have drifted apart" hypothesis predicts. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:256-272] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:231-247]

6. **Lead 6 is confirmed for the marker and reframed by the summary section.** `[DEVIATION:` appears in 14 non-archived files under `specs/`, 7 of them `.md`, against 4,060 non-archived `plan.md` packets; `debug-delegation*.md` exists exactly once and it is inside `z_archive`. But the workflow's other located channel — the required `deviations_from_plan` section of `implementation-summary.md` — is present in only 212 of 3,945 summaries (5.4%). So the emission is near-zero on both channels, and the marker is not the one the run is most likely to use. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:431] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:679]

7. **Lead 7 is confirmed: `recommend-level.sh` runs only on the `:with-phases` path, and implement never runs it at all.** The script is invoked in plan `:86` and complete `:147`, both inside the `:with-phases` pre-workflow (`insert_point: "before_step_1"`, `flag: ":with-phases"`). Implement instead carries a `level_selection.note` that *cites* the script and a `default: "Level 1 for simple tasks"`, and its Level-2-only acceptance step is skipped for Level 1 (`:539`). The level that decides whether the acceptance gate runs is therefore inherited from a run that may never have computed it. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:80-95] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:248] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:539]

8. **Lead 8 is confirmed for plan and refuted as "optional everywhere": plan requires `research/research.md` as an output, implement calls it optional, and 7.3% of packets have one.** Plan step 5 lists "Phase 0: Generate research/research.md" in `activities` and `outputs: [plan.md, research/research.md]`, and its `post_write_validation.on_fail` mentions only plan.md template drift — so the second declared output is never validated. Implement step 1 lists `research/research.md` under `optional_documents`. On disk: 298 `research/research.md` files against 4,060 non-archived `plan.md`. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:758-759] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:482]

## Questions Answered

- Have plan, implement and complete drifted apart where they duplicate the same steps and gates? — Yes, and complete is a full second copy; three behavioural blocks disagree (confidence weights, circuit-breaker failure action, pre-change checklist), while the level tables agree.
- Are the DEVIATION marker and debug delegation required by the workflow but almost never present in specs/? — Yes: 14 marker files and one archived debug-delegation file across 4,060 packets; the required summary section is populated in 5.4%.
- Does recommend-level.sh run on only one path, and is level derived anywhere else without it? — Yes to the first (`:with-phases` only, in plan and complete); implement never runs it and inherits the level.
- Is research/research.md listed as generated by planning, optional in implement, and mostly absent on disk? — Yes in plan (`outputs`), yes in implement (`optional_documents`), and 7.3% present on disk.

## Questions Remaining

None of the eight dispatch leads remains unresolved. Two new questions were opened by this iteration and are carried forward: whether the circuit-breaker divergence (Finding 3) or the gate-ownership defect (iteration 1, Finding 1) does more damage, and whether complete's duplicate plan/implement steps are worth reconciling at all or should be allowed to diverge as an "all-in-one" surface.

## Ruled Out

- **Reading the level tables as drifted.** Compared field by field; `required_files` are identical, so the "copies drifted" claim does not extend to the structural contract. Recorded as a refutation rather than dropped, because the lead predicted it.
- **Using `[DEVIATION:` counts alone as the emission evidence.** The marker is one of two channels; the summary section is the other and is far more populated. Counting markers only would have overstated the absence by roughly 15x.

## Dead Ends

- Searching for a second level source in implement (`rg selected_level`): no binding, no re-derivation, no reference to a frontmatter field. The absence is Finding 7.

## Edge Cases

- Ambiguous input: "copies of the same steps and gates" can mean duplicated step bodies or duplicated config blocks. Selected both and separated them: Finding 1 for the bodies, Findings 2-4 for the config.
- Contradictory evidence: `circuit_breaker.states` cannot be reconciled — the three values describe different recovery behaviours. Preserved as conflicting rather than picking one; recorded in Finding 3 with all three citations.
- Missing dependencies: `z_archive` exclusion is a judgement call; the counts exclude archives because prior reads did, and one debug-delegation file lives only in an archive.
- Partial success: on-disk counts are a snapshot at 2026-11-11 and include packets written before any marker existed, so they bound the emission rate rather than measure it per version.

## SCOPE VIOLATIONS

None executed.

## Sources Consulted

- `.skilled/commands/speckit/assets/speckit-plan.yaml:80-95`, `:250-305`, `:429-433`, `:443`, `:452`, `:758-759`
- `.skilled/commands/speckit/assets/speckit-implement.yaml:228-250`, `:408-412`, `:422`, `:430-431`, `:482`, `:539`, `:679`
- `.skilled/commands/speckit/assets/speckit-complete.yaml:21`, `:140-152`, `:535-563`, `:690-760`
- `find specs -name "plan.md" -not -path "*/z_archive/*" | wc -l` → 4060
- `find specs -path "*/research/research.md" -not -path "*/z_archive/*" | wc -l` → 298
- `rg -l "\[DEVIATION:" specs | wc -l` → 14 files (7 `.md`)
- `find specs -name "debug-delegation*.md" | wc -l` → 1, archived
- `find specs -name "implementation-summary.md" -not -path "*/z_archive/*" | wc -l` → 3945; deviations section present in 212

## Assessment

- New information ratio: 0.81
- Questions addressed: leads 5, 6, 7, 8
- Questions answered: 4 of 8 strategy questions (8 of 8 cumulative)

## Reflection

- What worked and why: separating the structural tables from the behavioural blocks before claiming drift. Lead 5 predicted drift everywhere; the tables refuted it and the blocks confirmed it, and that split is what makes the finding actionable — you reconcile behaviour, not structure.
- What did not work and why: counting `[DEVIATION:` files first and treating the result as the emission rate understated the real channel by 15x. The summary section was in the same file family and only showed up when I asked what else records a deviation.
- What I would do differently: when a lead says "required but never appears", enumerate every channel the requirement names before counting the first one.

## Recommended Next Focus

Sweep the three files for defect classes the leads did not name — dead config keys with no consumer, gate conditions stated as points, and required sections with no validator — then rank every confirmed defect by the damage it allows and attach the smallest existing-line change and an overengineering verdict to each.
