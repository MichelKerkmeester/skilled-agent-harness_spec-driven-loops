# Iteration 2: Plan-side placement in speckit-plan.yaml

## Focus
Locate the seat for the document-alone comprehension paraphrase inside `.skilled/commands/speckit/assets/speckit-plan.yaml`, and test whether the file already contains the machinery the check needs (a dispatch wave, a validation gate, a level ladder, an approval surface) so that adoption adds no command, agent or artifact. Focus chosen over the reducer-derived Next Focus, which had collapsed onto the last finding of iteration 1 rather than an open question; the first unchecked key question was used instead (documented deviation).

## Actions Taken
1. Enumerated the plan command's checkpoint list and top-level sections.
2. Read step 5 (planning) in full, including its parallel explorer dispatch, activities, confidence checkpoint and post-write validation.
3. Read steps 6 and 7 plus the termination, autonomous-execution and rules sections.
4. Read the documentation_levels and available_templates sections to establish the Level 1/2/3/3+ ladder as the command states it.

## Findings
1. The plan command runs seven named checkpoints and terminates after step 7; step 7 is already flagged `mandatory_check: true` but its only activities are emitting a closeout status and reminding the operator about a later continuity save. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:816]
2. Step 5 already ends in a self-scored confidence checkpoint: five weighted factors (technical approach clarity 0.25, risk identification 0.20, dependency mapping 0.20, pattern alignment 0.15, affected-surface coverage 0.20) produce a percentage with a >=80 / 40-79 / <40 action ladder. The scorer is the same context that wrote plan.md. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:765]
3. Step 5 already runs mechanical validation after the write: `validate.sh --strict` with "STOP and repair plan.md template drift before proceeding", plus example-drift and card-sync guards whose failures are reported but do not block. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:781]
4. Step 5 already dispatches four fresh subagents in one parallel wave - architecture, feature, dependency and test explorers, each `subagent_type: context`, `model: opus`, `parallel: true` - so a read-back brief can ride the existing dispatch wave instead of requiring a new command, agent definition or file. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:668]
5. That wave's contract is deliberately conclusion-free: every explorer prompt ends "Do NOT draw conclusions - just report findings". A comprehension paraphrase is itself a conclusion about whether the document's parts connect, so folding it into the same wave changes the wave's contract rather than extending it. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:692]
6. The command already carries a level ladder and a precedent for level-gated ceremony: Level 1 requires spec.md, plan.md and tasks.md under 100 LOC; Level 2 adds acceptance-criteria.md at 100-499 LOC; Level 3 is >=500 LOC with a lazy decision-record add-on; 3+ has the same required files as 3. Separately, the rules require a checklist for "verification_level_2_plus" only. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:255] [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:877]
7. The command's rules forbid adding an approval prompt in the autonomous path (`do_not_prompt_for_user_approval`) while confirm-mode checkpoints ask the operator to approve plan.md, so a new check must report into an existing checkpoint rather than introduce a gate of its own. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:870]
8. Level selection is delegated to `recommend-level.sh`, which scores LOC, file count and risk, and judgment may only escalate upward from its answer; this makes any level-based scaling rule in the check read a value the command has already computed. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:271]

## Ruled Out
- Placing the paraphrase in step 7 (handover check): the step's purpose is workflow closeout after planning, its validation is `workflow_finish_confirmed`, and its outputs are a status string. Putting a comprehension verdict there separates the finding from the approval decision that the operator makes in step 5, which is the moment the check is meant to inform.
- Placing it in step 3 (specification) or step 4 (clarification): both precede plan.md authoring, so there is no plan document to paraphrase. Step 4's `[NEEDS CLARIFICATION]` cap of 3 is an ambiguity extractor for spec.md, not a comprehension test of a plan.
- Treating the existing confidence checkpoint as already satisfying the requirement: rejected on evaluator identity, not on rubric quality. It scores the same context's own draft.
- Adding a fifth explorer to the existing parallel wave without qualification: rejected as-is because of the conclusion-free contract (finding 5); it survives only as a separate dispatch under a different brief.

## Dead Ends
- "Put it in step 7 because step 7 is already mandatory" is now eliminated: mandatory status there refers to closeout emission, not to a document judgment.

## Edge Cases
- Ambiguous input: "inside the existing plan step" could mean the *step* (step 5) or the *command* (any of steps 0.5-7). Selected interpretation: the step whose post-write state is a finished plan.md, i.e. step 5, with step 7 recorded as the rejected alternative.
- Contradictory evidence: two facts pull against each other - step 5 already has a validation surface (finding 3), yet it has no independent reader (findings 2, 4-5). Recorded as a tension, not resolved by choosing one: mechanical validation and independent comprehension answer different questions, so the check is additive only if it stays in the comprehension dimension.
- Missing dependencies: none; every claim comes from the target file.
- Partial success: all four read actions succeeded. Status `complete` with one documented focus deviation.
- Untrusted-content note: none encountered in this iteration; local repository files are data.

## Sources Consulted
- .skilled/commands/speckit/assets/speckit-plan.yaml:255-273 (documentation_levels, level selection)
- .skilled/commands/speckit/assets/speckit-plan.yaml:665-796 (step 5 planning, explorers, confidence checkpoint, post-write validation)
- .skilled/commands/speckit/assets/speckit-plan.yaml:797-833 (steps 6 and 7)
- .skilled/commands/speckit/assets/speckit-plan.yaml:837-885 (termination, autonomous execution, rules)

## Assessment
- New information ratio: 1.0
- Questions addressed: plan-side placement; whether new machinery is required
- Questions answered: "Which step inside .skilled/commands/speckit/assets/speckit-plan.yaml can host a document-alone comprehension paraphrase without adding a command, agent, or new artifact?"

## Reflection
- What worked and why: reading step 5 end to end, instead of grepping for "validate", surfaced the three surfaces that decide the answer at once - the self-scored confidence checkpoint, the post-write validation gate, and the four-agent explorer wave. Each alone would have suggested a different placement.
- What did not work and why: trusting the reducer-derived Next Focus. It is generated from the latest finding text, so it names the last thing learned rather than the next open question, and following it would have spent an iteration re-checking measurement evidence already marked UNKNOWN.
- What I would do differently: read the level ladder before the step body, because the level semantics govern whether the check is ceremony or substance, and they change how the step-5 finding should be phrased.

## Recommended Next Focus
Read `.skilled/commands/speckit/assets/speckit-implement.yaml` and find where it consumes plan.md: the readiness check has to sit at the boundary where an implementer first reads the plan, and the command may already compute a prerequisite or task-extraction signal the check can reuse instead of re-reading the plan.

## Questions Answered
- "Which step inside `.skilled/commands/speckit/assets/speckit-plan.yaml` can host a document-alone comprehension paraphrase without adding a command, agent, or new artifact?"

## Questions Remaining
3 of 5 remain: implement-side placement, Level scaling, and overengineering/measurement.

## Next Focus
Implement-side readiness seat in speckit-implement.yaml.
