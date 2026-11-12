# Iteration 4: Level scaling across Level 1, 2, 3 and 3+

## Focus
Decide which of the three checks runs at each spec Level, using the repo's own level contract as the controlling source rather than the plan command's summary of it, and find the cheapest credible trigger for each gate so Level 1 work is not forced through ceremony. Focus chosen as the next unchecked key question.

## Actions Taken
1. Read the system-spec-kit structural contract's Level Requirements section (Level 1, Level 2, Level 3).
2. Re-read the plan command's `documentation_levels`, `level_selection` and `available_templates` blocks, including the `level_3_plus` entry.
3. Re-used the already-cited gate and skip precedents from both commands rather than re-reading them.

## Findings
1. The controlling level contract is structural, not advisory: Level 1 (<100 LOC) requires spec.md, plan.md, tasks.md and implementation-summary.md; Level 2 (100-499 LOC) adds acceptance-criteria.md as the closure gate; Level 3 (>=500 LOC) requires the same set as Level 2. [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:129] [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:144] [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:162]
2. There is no Level 3+ row in the structural contract. The plan command's template map carries a `level_3_plus` entry whose required files are identical to `level_3`, and `decision-record.md` is an add-on created on request at any level. So "3+" names a risk band, not a distinct file bar. [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:162] [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:296]
3. The level value is computed, not guessed: `recommend-level.sh` scores LOC, file count and risk, and judgment may escalate upward from its answer. Both commands therefore already hold the value a scaling rule needs. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:271]
4. Level-gated ceremony already exists in both commands, so a level-branched check is an established pattern rather than a new concept: the plan rules require a checklist only for `verification_level_2_plus`; implement skips step 4 for Level 1 and marks steps 5.5 and 7.5 optional for quick fixes under 10 LOC. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:877] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:536] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:570]
5. plan.md is required at every level, so a plan-side paraphrase always has a document to read; the level question for that check is cost, not availability. [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:129]
6. Level 1 cost analysis: the document is short, so a naive-reader paraphrase is cheap to produce but a separate dispatch plus a report file is not. Level 1 therefore takes the paraphrase inline and drops the artifact, the severity list and the readiness pass. [INFERENCE: based on folder-structure.md:129 (short Level 1 doc set) and speckit-plan.yaml:811 (step 6 already asks only for a closeout string, so there is no slot for a heavyweight report)]
7. Level 2 cost analysis: acceptance-criteria.md exists as the closure gate, which verifies outcomes after the fact, so the pre-coding readiness check is the only pre-emptive check at this level and it can price into the existing `plan_clarity` 25 points. [INFERENCE: based on folder-structure.md:144 (closure gate at Level 2) and speckit-implement.yaml:382 (plan_clarity 25)]
8. Level 3 and 3+ cost analysis: with >=500 LOC and an optional decision-record, unresolved design choices are the expensive failure, so the readiness verdict should be blocking rather than advisory, and the critic becomes worth its dispatch only when the plan carries competing options or a decision-record exists to audit against. [INFERENCE: based on folder-structure.md:162 and speckit-implement.yaml:382]
9. A single rule covers all four levels without a new level concept: the paraphrase runs at every level in the plan step 5 checkpoint; the readiness check runs from Level 2 up inside the existing pre-implementation gate; the critic is optional from Level 3 up and never gates. Level 1 is touched only by the two-sentence paraphrase, which is why it is not "forced through" the model. [INFERENCE: composed from findings 1-8]

## Ruled Out
- Making Level 1 skip every check: rejected because the comprehension paraphrase costs one short paragraph inside an existing checkpoint, and the model's own claim is about a document whose parts do not connect, which a 60-line plan can still be.
- Treating Level 3+ as a fourth file tier: the structural contract has three tiers, and inventing a fourth would fork the level vocabulary that `recommend-level.sh` and the validators share.
- Gating all three checks on LOC alone: rejected because LOC is already the level input; re-testing it duplicates the level decision and creates two sources of truth for the same threshold.
- Making the critic mandatory at any level: it duplicates the design critique that already exists as an upstream stage and has no blocking output to justify the dispatch cost.

## Dead Ends
- "Scale by document size at check time" is eliminated: it re-derives a value the level contract already fixed, and the first plan revision would move the threshold underneath a running workflow.

## Edge Cases
- Ambiguous input: "scales by Level 1, 2, 3 and 3+" could mean distinct behaviour per level or one behaviour with thresholds. Selected interpretation: distinct behaviour, because the question explicitly names four bands.
- Contradictory evidence: the plan command lists a `level_3_plus` template entry (finding 2) while the structural contract stops at Level 3. Resolved in favor of the structural contract for file requirements, with 3+ retained as a risk band - recorded here rather than silently dropped.
- Missing dependencies: no `3+` definition exists in the repo's level contract; treated as UNKNOWN-by-omission and answered with a risk-band interpretation instead of a fabricated file bar.
- Partial success: none; all planned reads succeeded. Status `complete`.

## Sources Consulted
- .skilled/skills/system-spec-kit/references/structure/folder-structure.md:125-182
- .skilled/commands/speckit/assets/speckit-plan.yaml:255-301
- .skilled/commands/speckit/assets/speckit-plan.yaml:877
- .skilled/commands/speckit/assets/speckit-implement.yaml:382
- .skilled/commands/speckit/assets/speckit-implement.yaml:536
- .skilled/commands/speckit/assets/speckit-implement.yaml:570

## Assessment
- New information ratio: 0.78
- Questions addressed: level scaling of all three checks
- Questions answered: "How should each check scale across spec Levels 1, 2, 3 and 3+ so Level 1 work is not forced through ceremony it does not need?"

## Reflection
- What worked and why: reading the structural contract instead of the command's own summary of levels resolved the 3+ question immediately - the command's summary copies files, the contract owns requirements, and only the contract can say whether a fourth tier exists.
- What did not work and why: the first scaling draft branched on document length at check time. That looked cheap but made the check's behaviour depend on a number that plan revisions move, and it duplicated the level decision `recommend-level.sh` already makes.
- What I would do differently: start from the level contract in any future question about "how should X scale by level" - the command YAMLs restate it but do not own it.

## Recommended Next Focus
Separate what to leave out from what to measure: identify the upstream elements that do not survive contact with this repo (five-stage pipeline, GoldfishContext plumbing, synthesizer, severity rubric duplication), and name the observable signal that would show the adopted checks help, reusing counters the commands already keep.

## Questions Answered
- "How should each check scale across spec Levels 1, 2, 3 and 3+ so Level 1 work is not forced through ceremony it does not need?"

## Questions Remaining
1 of 5 remains: overengineering and measurement.

## Next Focus
Overengineering boundary and the measurable signal.
