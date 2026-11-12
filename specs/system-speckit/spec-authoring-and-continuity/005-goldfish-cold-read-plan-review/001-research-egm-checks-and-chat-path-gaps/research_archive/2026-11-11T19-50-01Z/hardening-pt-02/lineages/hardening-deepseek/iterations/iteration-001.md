# Iteration 1: Gate arithmetic and gate ownership in `speckit-implement.yaml`

## Focus

Leads 1 and 2 of the dispatch, plus the evaluator question behind lead 4: can the pre-implementation gate pass with `plan_clarity` scored zero, and do other gate thresholds let a zero on a check pass? Reading the gate definitions raised a prior question the leads do not name — whether anything in the three workflows actually *evaluates* a `quality_gates` block — so this iteration answered that first, then the arithmetic.

## Actions Taken

1. Read `.skilled/commands/speckit/assets/speckit-implement.yaml:370-509` (debug contract, both gate blocks, confidence framework, request-analysis framework, workflow enforcement).
2. Read `.skilled/commands/speckit/assets/speckit-implement.yaml:510-639` (steps 2-6, checkpoints, child-dispatch defaults, debug delegation).
3. Read `.skilled/commands/speckit/assets/speckit-implement.yaml:640-720` (confidence checkpoint, step 6.5, step 7 completion block).
4. `rg` for every gate check id across `.skilled/commands/speckit` and `.skilled/skills/system-spec-kit`.
5. `rg "quality_gates"` repo-wide, excluding `specs/` and `node_modules/`.
6. Read `.skilled/commands/speckit/assets/speckit-plan.yaml:396-455` and `:740-833` (plan gates, confidence checkpoint, step 5 post-write validation, checkpoints).
7. Read `.skilled/commands/speckit/assets/speckit-complete.yaml:488-547` (all three gate blocks, circuit breaker).
8. `rg` for `pre_implementation|post_implementation` repo-wide.
9. `rg` for `applies_to` across the three files.

## Findings

1. **The `quality_gates` block has no owner step in any of the three workflows.** Repo-wide, `quality_gates` matches only at its own definition site: `speckit-plan.yaml:403`, `speckit-implement.yaml:382`, `speckit-complete.yaml:492`. No workflow step, no `.md` command file and no skill references the key, and `pre_implementation` / `post_implementation` appear only at `speckit-implement.yaml:384` and `:394`. The only thing binding a gate to a moment in the run is the free-text `location:` field (`"Before Step 6"`, `"After Step 7"`). The step that would have to run it — implement step 5, `speckit-implement.yaml:556-568` — carries `checks: { prerequisites: verified, blockers: none, environment: ready }` with no instruction to score anything, and step 7's completion block (`:681-704`) uses a separate `completion_checkpoint: { enforcement: HARD_BLOCK }`. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:382-403]

2. **Lead 1 confirmed at the exact line: the pre-implementation gate passes at 75/100 with `plan_clarity` at zero.** `threshold: 70`; weights `prerequisites_complete` 30, `plan_clarity` 25, `task_breakdown_quality` 25, `checklist_verified` 20. `30 + 25 + 20 = 75 >= 70`, so a plan whose clarity check scores nothing still clears a gate declared `blocking: hard`. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:386-392]

3. **The same arithmetic is worse one gate later: a run with failing tests passes the post-implementation gate at 75/100.** `threshold: 70`; weights `all_tasks_complete` 30, `tests_pass` 25, `summary_exists` 25, `checklist_verified` 20. `30 + 25 + 20 = 75`, so `tests_pass: 0` clears the gate. Nobody in the three prior reads named this one; the critic concentrated on `plan_clarity`. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:394-403]

4. **Lead 2 confirmed for every id in every gate: none of the 26 scored check ids has a scoring definition.** `rg` over `.skilled/commands/speckit` and `.skilled/skills/system-spec-kit` returns only the `points:` rows themselves plus one unrelated quality list (`speckit-complete.yaml:1414`). `plan_clarity` appears exactly once in the repository — as the 25-point row. So the reader is asked for a number with no rubric: what "clarity" scores 25, 12 or 0 is unspecified, which is what makes an all-or-nothing zero possible in the first place. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:389-392]

5. **The plan post-execution gate's weights sum to 85, not 100, while its failure message prints a percentage of 100.** Checks are `spec_exists` 25, `plan_exists` 25, `tasks_exists` 20, `context_saved` 15; `on_fail` reports `{score}/100`. A fully passing packet therefore reports 85/100, and `context_saved: 0` still yields exactly 70 and passes at the threshold. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:414-424]

6. **Complete's post-execution gate lets a failed validation pass at 90/100.** Weights `tasks_complete` 30, `summary_exists` 25, `summary_sections` 15, `memory_saved` 20, `validation_passed` 10; `validation_passed: 0` still totals 90 against `threshold: 70`. A gate whose only validation-shaped check cannot fail the gate is a report, not a gate. [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:520-530]

7. **Complete's `planning_gate` (marked `critical: true`) passes at 85/100 with every content check at zero.** Existence checks total 60 (`spec_exists` 20, `plan_exists` 20, `tasks_exists` 20); `checklist_verified` 15 and `review_approval` 10 bring the total to 85. The three content checks that distinguish a real plan from an empty one — `spec_no_clarification` 5, `plan_has_approach` 5, `tasks_has_format` 5 — are worth 15 between them and cannot fail a 70 threshold. `review_approval`, a human approval, is worth 10 points and is also skippable. [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:504-519]

## Questions Answered

- Is the pre-implementation gate able to pass at 75 of 100 with plan_clarity scored zero, and is plan_clarity defined anywhere? — Yes to both halves: 75 clears 70, and the id appears exactly once in the repository, as a points row.
- Which other gate check ids are scored with no scoring definition, and which other thresholds let a zero on one check pass? — All 26 ids across the three files have no definition, and every gate in all three files lets at least one zero pass: implement pre (plan_clarity), implement post (tests_pass), plan post (context_saved), complete planning (all three content checks), complete post (validation_passed).

## Questions Remaining

- Lead 3 (confirm-only checkpoints skipped under auto), lead 4's second half (whether an existing line can make the evaluator independent), lead 5 (drift between the three files), lead 6 (DEVIATION/debug emissions), lead 7 (`recommend-level.sh` paths), lead 8 (`research/research.md`).
- New: whether the `quality_gates` block's lack of an owner step is one fixable line (point a step at it) or whether the real enforcement lives elsewhere and the block should be deleted rather than wired.

## Ruled Out

- **Reading the gates as already wired through a validator.** Checked: no `.md` command file under `.skilled/commands/speckit/` mentions `quality_gates` or `threshold`, and `.skilled/skills/system-spec-kit` contains no reader for it. Ruled out; the block is YAML-only.
- **Treating `location:` as sufficient instruction.** It names a moment but no step re-reads the block at that moment; the two step bodies at those locations contain their own unrelated checks. Treated as a defect rather than a naming convention.

## Dead Ends

- Searching for a scoring rubric for any check id: `rg` across commands and the spec-kit skill returns only the points rows. There is no hidden rubric to cite, which is itself the finding.

## Edge Cases

- Ambiguous input: the dispatch calls the gate "pre-implementation gate passes at 75 of 100". `speckit-implement.yaml` has both a `pre_implementation` gate at `:384` and a `prerequisites_gate` at `:440`. Selected the `quality_gates.pre_implementation` block because it is the one with a threshold and `plan_clarity`; the other is an existence check with prose `action_if_failed`.
- Contradictory evidence: the block declares `blocking: hard` while nothing invokes it — recorded as Findings 1 and 2-7 rather than collapsing to "the gate blocks" or "the gate does not exist".
- Missing dependencies: none.
- Partial success: `speckit-complete.yaml` was read only in the gate region; its step bodies are deferred to iteration 3, so findings 6-7 describe declared arithmetic, not observed enforcement.
- Scope violation: `phase_init`'s `step_preinit_spec_branch` and the synthesis `step_writeback_spec_findings` both target `{spec_folder}/spec.md` and `{spec_folder}/research/research.md`, which are outside this lineage's write surface. Both are recorded here as would-be mutations and deliberately not executed.

## SCOPE VIOLATIONS

None executed. Recorded and refused: pre-init spec seeding, bounded spec findings write-back, and any `validate.sh --strict` run against the parent packet.

## Sources Consulted

- `.skilled/commands/speckit/assets/speckit-implement.yaml:382-403` (both quality gates)
- `.skilled/commands/speckit/assets/speckit-implement.yaml:384-393`, `:394-403` (arithmetic)
- `.skilled/commands/speckit/assets/speckit-implement.yaml:556-568` (step 5, the would-be owner of the pre gate)
- `.skilled/commands/speckit/assets/speckit-implement.yaml:681-704` (step 7 completion checkpoint)
- `.skilled/commands/speckit/assets/speckit-plan.yaml:403-424`, `:781-786`
- `.skilled/commands/speckit/assets/speckit-complete.yaml:492-530`
- `rg quality_gates` over `.skilled/**` excluding `specs/` and `node_modules/` (three hit sites, all definitions)
- `.skilled/commands/speckit/*.md` (no `quality_gates` or `threshold` reference)

## Assessment

- New information ratio: 0.86
- Questions addressed: lead 1, lead 2, and the ownership question the leads did not ask
- Questions answered: 2 of 8 strategy questions

## Reflection

- What worked and why: reading the *use site* before the definition. The arithmetic the dispatch asked about is a real defect, but it sits on a block nothing executes, and only the repo-wide `rg` for the key showed that; reading gate blocks alone would have produced a confident, incomplete answer.
- What did not work and why: an initial pass assumed the gates were invoked by step name and searched for `speckit-implement step 5 gate`-style wording. The files have no such back-reference, so the search returned nothing and looked like a failed query rather than a negative result.
- What I would do differently: query for the *key* (`quality_gates`) before querying for plausible callers; a config block with no consumer is cheaper to detect from the definition side.

## Recommended Next Focus

Lead 3 and lead 4: enumerate the checkpoints under auto, determine which gate verdicts live only inside a confirm-only checkpoint (so auto never reads them), and record who scores the confidence checkpoints in each of the three files. This settles whether "nobody reads the review" is architectural or an artifact of `applies_to: confirm` having captured a gate.
