# Iteration 3: Implement-side placement in speckit-implement.yaml

## Focus
Find the seat and the reusable inputs for the decision-free implementation readiness check inside `.skilled/commands/speckit/assets/speckit-implement.yaml`: where an implementer first reads plan.md, which existing gate already blocks coding, and what the command already computes that the check could consume instead of re-reading.

## Actions Taken
1. Enumerated the implement command's twelve checkpoints and top-level sections.
2. Read steps 1-5.5 (plan review, task breakdown, analysis, acceptance criteria, implementation check, preflight).
3. Read step 6 (development) including its parallel dispatch and debug delegation, plus step 7 (completion) and step 7.5 (postflight).
4. Read the quality_gates, circuit_breaker, confidence_framework and request_analysis_framework blocks.

## Findings
1. Step 1 is where the implementer first reads plan.md: it requires spec.md and plan.md, runs `check-prerequisites.sh --json --require-tasks`, and its deep analysis already outputs `requirements_summary`, `technical_approach_understanding`, `identified_dependencies` and `potential_challenges` under the validation name `planning_artifacts_understood`. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:472]
2. A hard-blocking pre-implementation quality gate already sits before step 6: threshold 70, with `prerequisites_complete` 30, `plan_clarity` 25, `task_breakdown_quality` 25 and `checklist_verified` 20, and failure stops the run with "Fix issues before coding". [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:382]
3. The readiness precondition is already named: `request_analysis_framework.pre_implementation_validation` lists `plan_understood`, `tasks_clear`, `patterns_identified`, `confidence_80_plus` and `scope_bounded`. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:430]
4. Both existing readiness signals are self-assessed by the context that read the plan - the `plan_clarity` points and the `plan_understood` flag - so the Goldfish contribution at this seat is a different evaluator, not a new field or a new score. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:382] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:430]
5. The command contains exactly one automatic subagent dispatch, and it is unusable as a readiness seat: `pre_phase_parallel_check` in step 6 spawns implementation and test agents, complexity-gated, after coding has started. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:602]
6. The command's only existing fresh-context practice is debug delegation: at three failures it offers an agent that "runs a 5-phase fresh-perspective root-cause pass with no prior context", but the workflow itself never invokes the Task tool - the user dispatches. That is an existing boundary an automated readiness dispatch would cross, so adoption has to either reuse a mechanism that exists or stay advisory. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:623]
7. Level gating is already explicit in two places: step 4 is "Skip for Level 1, MANDATORY for Level 2+", and steps 5.5 and 7.5 are `optional: true` with `skip_if: ["Quick fix (<10 LOC)", ...]`. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:536] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:570] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:709]
8. The command's only measurement machinery is self-reported and optional: PREFLIGHT captures knowledge/uncertainty/context 0-10 before development and POSTFLIGHT computes a learning index afterwards, both skipped for quick fixes. It cannot validate a new check because the same context supplies both the baseline and the result. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:570] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:709]
9. A hard-blocking completion gate already exists after step 7 (`all_tasks_complete`, `tests_pass`, `summary_exists`, `checklist_verified`), which means a readiness verdict has somewhere to be honoured without inventing a termination path. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:394]

## Ruled Out
- Seating the readiness check in step 6's parallel dispatch: the dispatch happens after implementation begins, so a "do not start coding yet" verdict would arrive too late.
- Seating it in step 3 (consistency analysis): that step maps requirements to task coverage, which is traceability, not decision freedom. It answers "is every requirement covered", not "can an implementer proceed without choosing".
- Seating it in step 4 (acceptance criteria): the right rubric shape, but the wrong question - acceptance rows verify outcomes after the fact, and the step is already skipped for Level 1.
- Reusing the debug delegation contract: it is user-dispatched by design, so wrapping it would turn an operator prompt into an automated gate, which is a larger change than the research question permits.

## Dead Ends
- "The quality gate already covers plan clarity, so nothing is needed": eliminated because the gate is scored by the same reader that must later execute the plan, which is the exact blind spot the fresh-context check exists to remove.

## Edge Cases
- Ambiguous input: "inside implement" could mean the pre-coding review (steps 1-5) or the coding loop (step 6 onwards). Selected interpretation: pre-coding only, because a readiness check that fires after the first edit cannot prevent a wrong start.
- Contradictory evidence: the command both forbids automatic Task dispatch for its freshest-perspective agent (finding 6) and wants a readiness verdict before coding (finding 2). Not resolved here; recorded as the adoption's central constraint and carried to the scaling iteration.
- Missing dependencies: none; all evidence is in the target file.
- Partial success: all reads succeeded. Status `complete`.

## Sources Consulted
- .skilled/commands/speckit/assets/speckit-implement.yaml:382-430 (quality gates, circuit breaker, confidence framework, request analysis framework)
- .skilled/commands/speckit/assets/speckit-implement.yaml:472-595 (steps 1 through 5.5)
- .skilled/commands/speckit/assets/speckit-implement.yaml:602-720 (step 6, 6.5, 7, 7.5)

## Assessment
- New information ratio: 1.0
- Questions addressed: implement-side placement and reusable inputs
- Questions answered: "Which step inside `.skilled/commands/speckit/assets/speckit-implement.yaml` can host a decision-free readiness check, and what does implement already compute that the check can reuse instead of re-reading?"

## Reflection
- What worked and why: reading the quality_gates block before the step bodies changed the answer. Step 1 looks like the natural seat, but the blocking gate before step 6 is where a verdict has leverage, and it already prices plan clarity at 25 points - so the check inherits an existing scoring slot rather than creating one.
- What did not work and why: the first hypothesis (step 6's parallel dispatch is the fresh-context hook) collapsed on sequencing: the dispatch is inside the coding phase, so any verdict is retrospective.
- What I would do differently: check the level-gating and optional-step precedents before the step bodies in both commands; they are the cheapest evidence for "how does this command already scale ceremony", and they constrain the design more than the step prose does.

## Recommended Next Focus
Level scaling: decide which of the three checks run at Levels 1, 2, 3 and 3+, using the level vocabulary and gate precedents both commands already carry, and name the exact trigger for each gate rather than inventing a new level concept.

## Questions Answered
- "Which step inside `.skilled/commands/speckit/assets/speckit-implement.yaml` can host a decision-free readiness check, and what does implement already compute that the check can reuse instead of re-reading?"

## Questions Remaining
2 of 5 remain: Level scaling, and overengineering/measurement.

## Next Focus
Level 1/2/3/3+ scaling of the three checks.
