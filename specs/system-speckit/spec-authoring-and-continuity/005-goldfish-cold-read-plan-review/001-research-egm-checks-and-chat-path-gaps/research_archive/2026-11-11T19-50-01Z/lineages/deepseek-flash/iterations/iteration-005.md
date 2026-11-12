# Iteration 5: Overengineering boundary and the measurable signal

## Focus
Separate what the repo should take from what it should refuse, and name an observable signal for whether the adopted checks help. Two lenses: the repo's own restraint doctrine (reversal-cost order and pre-write pass) for the leave-out list, and the existing countable surfaces (acceptance-criteria rows, task checklist priorities, deviation markers, failure counter) for the measurement question.

## Actions Taken
1. Read the repository's overengineering rule sections on the reversal-cost order and the pre-write pass.
2. Checked the acceptance-criteria template for its row and status vocabulary.
3. Confirmed the plan command already emits `research/research.md` in step 5 Phase 0, which gives a plan-side host for a durable paraphrase record.
4. Re-used previously gathered evidence on the self-reported PREFLIGHT/POSTFLIGHT measurement and the debug failure counter instead of re-reading.

## Findings
1. The repository's restraint doctrine orders moves by reversal cost, from "build nothing" through "extend an existing function in place" up to "add an abstraction or a dependency", and requires naming what fails at the cheaper move before climbing. Extending step 5's existing checkpoint sits near the cheap end; a new reviewer subcommand sits at the expensive end. [SOURCE: .skilled/repo-rules/prevent-overengineering.md:54]
2. The same rule requires a pre-write pass that names what the change touches - owning module, real caller, and the contract that must not break - before scope freezes. A check whose only consumer is one checkpoint touches nothing else, which is the cheapest form that still works. [SOURCE: .skilled/repo-rules/prevent-overengineering.md:91]
3. Acceptance criteria already provide a stable, countable surface: one row per requirement with `AC-ID`, Given/When/Then, Verification, Status (`Met`, `Waived`, `Superseded`) and a waiver that must name a decision record. Anything the checks catch can land there instead of in a new metric file. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:35]
4. A plan-side paraphrase record already has a host: step 5 Phase 0 generates `research/research.md`, and step 6 has no slot for a separate report. Writing the two paraphrase headings into that existing document costs no new artifact. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:758]
5. LEAVE OUT - the five-stage pipeline. The plan command already runs a seven-checkpoint ladder plus a four-explorer wave; importing zoom-out, comprehension, critique, intermediate zoom-out and readiness as five stages duplicates gates that exist. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:21]
6. LEAVE OUT - the GoldfishContext reading list and its link-resolution, URL-saving and approval flow. It exists because EGM reviewers read a document plus its referenced sources; a check scoped to one document does not need a plumbing subsystem for that. [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/skills/egm-review/SKILL.md]
7. LEAVE OUT - the synthesizer and the Blocker/Major/Nit severity stack as new vocabulary. EGM needs a synthesizer to merge five reviewer reports; two short verdicts fit in one checkpoint message, and the repo already carries P0/P1/P2 for checklists and Met/Waived/Superseded for criteria, so a third scale fragments the closure vocabulary. Map Blocker to P0, Major to P1, Nit to P2 if a mapping is needed at all. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:544]
8. LEAVE OUT - brainstorm-mode variants of the personas, a numeric confidence score for the checks, and any new report file. The repo already has weighted confidence ladders in both commands, and a second score would compete with them rather than inform them. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:765] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:417]
9. MEASURE - the cheapest honest signal is the paraphrase's own verdict marked by the author: correct or wrong. It is binary, it costs one word, and a wrong paraphrase is by construction a caught defect, which makes the check self-labeling rather than dependent on a separate audit. [INFERENCE: based on the upstream instruction that a wrong paraphrase is a finding (iteration 1, finding 2) and the author-only ability to judge it]
10. MEASURE - three counters that already exist and need no new file: open design decisions surfaced by the readiness check that were not P0 items in the checklist; `[DEVIATION: reason]` markers recorded during implementation, which the implement command already requires; and debug delegations triggered at the three-failure threshold. A reduction across a defined window is evidence; a self-reported confidence delta is not. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:431] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:623]
11. MEASURE with a stated caveat: upstream offers no measured effectiveness evidence, so the adoption should ship with the counters and a comparison window rather than a benefit claim, and the first packets should be read as a baseline rather than a result. [SOURCE: https://github.com/google/elephant-goldfish-model/blob/main/README.md]
12. The existing PREFLIGHT/POSTFLIGHT learning index is not usable as that measure: it is optional, skipped for quick fixes, and scored 0-10 by the same context that did the work. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:570]

## Ruled Out
- Importing the full five-stage review as a plan sub-pipeline: rejected on reversal cost, since it adds stages beside existing gates rather than extending one.
- A dedicated metrics file or dashboard for the checks: rejected because acceptance criteria, the task checklist and deviation markers already carry countable rows.
- Using the learning index as the effectiveness measure: rejected as self-reported by construction.
- Collapsing everything into "just add a review step": rejected because three of the twelve findings are about what to delete, and the deletion is the part that keeps Level 1 cheap.

## Dead Ends
- No further dead ends; the leave-out list is the consolidated dead-end record for the whole lineage and belongs in synthesis.

## Edge Cases
- Ambiguous input: "how to measure whether it helps" could mean a research methodology or an in-product instrument. Selected interpretation: the in-product instrument, because the question asks where the checks belong inside existing steps.
- Contradictory evidence: the repo has measurement machinery (finding 12) and it is unusable for this purpose - a contradiction between "a measurement surface exists" and "it measures nothing verifiable". Resolved by naming the specific defect of the existing instrument rather than asserting measurement is absent.
- Missing dependencies: no upstream effectiveness data exists to baseline against (finding 11); recorded as UNKNOWN and handled with a baseline-window instruction instead of a fabricated number.
- Partial success: none; status `insight` because the iteration's value is synthesis plus a leave-out list rather than new external discovery.

## Sources Consulted
- .skilled/repo-rules/prevent-overengineering.md:54-101
- .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:35
- .skilled/commands/speckit/assets/speckit-plan.yaml:21, 758, 765
- .skilled/commands/speckit/assets/speckit-implement.yaml:417, 431, 544, 570, 623
- https://github.com/google/elephant-goldfish-model/blob/main/skills/egm-review/SKILL.md
- https://github.com/google/elephant-goldfish-model/blob/main/README.md

## Assessment
- New information ratio: 0.65
- Questions addressed: overengineering boundary; measurable signal
- Questions answered: "Which upstream elements are overengineering for system-spec-kit, and what observable signal would show the adopted checks actually help?"

## Reflection
- What worked and why: applying the repo's own reversal-cost order turned the leave-out question from taste into a comparison. Importing the five-stage pipeline is not "too much ceremony" in the abstract; it is the expensive move beside a cheaper one that already exists.
- What did not work and why: the first measurement draft proposed a satisfaction score. It died on the same objection that killed the existing confidence checkpoints as evidence - the scorer is the context being scored.
- What I would do differently: for any "does it help" question, enumerate the counters that already exist before designing a new one. Three of the four usable signals here were already being recorded for other reasons.

## Recommended Next Focus
None for this lineage: all five key questions are answered and the remaining work is synthesis. If a follow-up run is scheduled, the highest-value next focus is a cost test - instrument one Level 2 packet with the paraphrase and readiness counters, then compare two consecutive packets rather than arguing the benefit.

## Questions Answered
- "Which upstream elements are overengineering for system-spec-kit, and what observable signal would show the adopted checks actually help?"

## Questions Remaining
None. All five key questions are answered; unanswered sub-questions are recorded as UNKNOWN (upstream effectiveness data) rather than open questions.

## Next Focus
Synthesis: converge the five iterations into a placement, scaling, leave-out and measurement answer.
