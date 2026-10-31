# Iteration 4: Alignment-folder suggestion and state leakage

## Focus

Inspect feature 022's measured keep and distractor-state control, determine whether a masked-state ablation can separate semantic destination choice from copying a folder named in session state, and define the next evidence and tests. This answers the fourth key question without making model calls or touching files outside this lineage.

## Actions Taken

- Re-read the lineage's append-only state and strategy; iterations 1–3 address the shared gate, feature 017, and feature 020, so this iteration follows the planned feature-022 focus.
- Read feature 022's original evidence contract and keep rule, the current scorer's baseline selection and distractor-state implementation, its negative-control test, and the pinned 049-008 run output.
- Compared the primary and confidence-gated arms with the negative-control arm; did not rerun any model arm.

## Findings

1. **P0 — The distractor-state control invalidates the current question shape as a live predictor; it does not yet prove the whole feature should be retired.** The primary run keeps Jev at K=40, A=39 versus B=30, W=10/L=1, but its negative control kills at K=40, A=0/B=30, W=0/L=30; all 30 discordant control rows are losses. In those rows the model pick follows the folder named by the rotated state rather than the row's label. The scorer constructs that treatment by replacing each row's state with the next row's session state. This is direct evidence of state anchoring, not a small accuracy regression. **Confirm:** retain the current question only if a predeclared masked-state ablation passes while the same pinned rows, options, order, labels, and scorer identity are held fixed; if it still kills, retire this question shape. [SOURCE: /Users/michelkerkmeester/.skilled/.labels/runs/049-008-jev.stdout.txt:10-12,52-85] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:930-935] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:1697-1704]

2. **P0 — Keep the measured keep and confidence-gated result offline; neither clears the negative control or authorizes serving.** The same run says every row is an `other` save (content=0, folder=0), target baseline is correct on 0/40, the automatically selected top comparator is correct on 30/40, and the primary keep rests on 11 discordant rows. The confidence-gated arm repeats the same 39/30 verdict while reducing calls from 120 to 70; it is a cost result, not evidence that the state-copying failure is fixed. The feature packet explicitly excludes serving: a keep serves nothing, and a live suggestion requires the save owner, a later phase, and operator approval. **Confirm:** do not add a live call site from this measurement; reconsider only after the masked-state control and prospective evidence below pass, followed by separate save-flow and fail-open tests. [SOURCE: /Users/michelkerkmeester/.skilled/.labels/runs/049-008-jev.stdout.txt:1-12,36-54] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md:123-130,206-208]

3. **P1 — Run a true masking ablation, not an instruction-only prompt tweak.** The rows writer supplies the session summary as `state`, and the fixed question asks which folder the save should go to. The existing negative control rotates complete summaries between rows. A decisive follow-up should compare the original state, the existing next-row distractor, and a current-row state with folder identifiers replaced by neutral tokens while preserving the remaining prose and keeping option descriptions unchanged. If the masked-current-state arm retains the useful signal while the distractor arm fails, that clears this specific lexical leakage concern but does not establish production value. If masking makes the current arm fail, the question is dependent on folder names in state and should be retired or redesigned before any real-save corpus expansion. **Confirm:** record per-row picks for each arm, verify the masking transformation removes all numbered folder identifiers without changing the option set or label, and apply the already-fixed verdict rule without tuning it after seeing results. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md:111-120,184-204] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:930-935,1650-1651,1697-1704]

4. **P1 — A deployment-quality keep needs prospective real-save rows, independently sourced destinations, a frozen comparator, and power planned before evaluation.** The measured corpus is 40/40 `other` saves, with zero content- or folder-save cases; the run reports `comparator=auto`. The scorer's automatic comparator chooses target versus top alternative using the labeled rows themselves, so a future test-set result should not select its comparator from that same evaluation set. The 30-label minimum is only a gate, while the verdict's coverage, exact kill/sign tests, margin, and flip constraints are separate conditions. **Confirm:** collect consented low-alignment saves with final destination and save-path type, retain row/state/label provenance, obtain labels independently of Jev, split development from a time-separated holdout, freeze the strongest safe baseline before holdout scoring, and derive the needed discordant-pair count from a pre-registered minimum useful win rate and exact-binomial power target. Do not treat the present 11 discordant rows as a powered real-traffic test. [SOURCE: /Users/michelkerkmeester/.skilled/.labels/runs/049-008-jev.stdout.txt:1-12] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:1631-1638] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md:111-120,184-204]

5. **P1 — Add tests for the masking transformation and its causal contrast; the current suite only checks that a distractor verdict is produced.** The scorer test exercises the general controls, checks that a distractor-state verdict exists, and asserts its output line, but there is no masked-state arm or assertion that masking removes folder-name leakage while preserving unrelated state. **Confirm:** add a deterministic test with synthetic states containing folder identifiers and unrelated content; assert all identifiers are masked, unrelated text and options are unchanged, and the result report distinguishes original, distractor, and masked arms. Keep the existing pinned-corpus/report/scorer checks and per-row discordance diagnostics. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts:840-892] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:930-935,1697-1704]

## Ruled Out

- Treating the fixture's primary keep as evidence of a live content- or folder-save improvement: the run contains no rows of either save type.
- Treating the confidence-gated call reduction as an accuracy or state-leakage correction: it reproduces the primary counts while only reducing calls.
- Treating a prompt instruction to ignore folder names as equivalent to removing those names from the input; the lexical cue must actually be masked to test reliance on it.
- Advancing to a serving integration from a scorer `keep`; the feature packet explicitly says the measurement serves nothing.

## Dead Ends

- A larger fixture with the same visible state cue would increase call cost without resolving whether the model chooses from save content or copies a folder name.
- Choosing `target` versus `top` on the eventual evaluation labels (`comparator=auto`) cannot establish an unbiased held-out comparison; freeze that choice outside the holdout.

## Edge Cases

- The negative control is deliberately adversarial: it rotates a different row's session summary, not an ordinary failed save. Its 30/30 losses are strong evidence of susceptibility to state content, but not a direct estimate of live error rate.
- All 40 rows have non-null state, yet all are classed as `other`; state availability does not repair the missing save-type coverage.
- A masked-state pass would clear one confound only. It would not establish label validity, real-traffic representativeness, adequate power, or authorization to serve.
- The confidence-gated arm reports 70 calls versus 120 for a full pass and the same keep counts; its cost advantage must remain separate from the validity decision.

## Sources Consulted

- `/Users/michelkerkmeester/.skilled/.labels/runs/049-008-jev.stdout.txt:1-12,36-85`
- `specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md:111-130,184-208`
- `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:930-935,1631-1638,1640-1651,1697-1704`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts:840-892`

## Assessment

- New information ratio: 0.5.
- Novelty justification: this iteration directly rechecks the known distractor-state result against the pinned output, current treatment construction, baseline-selection logic, and test assertions. It adds implementation-level confirmation and a controlled masked-state protocol, but supplies no new real-save sample or independent label evidence.
- Questions addressed: feature 022's evidence, controls, hardening, integration boundary, and tests.
- Questions answered: “What evidence, controls, hardening, integration, and tests would settle alignment folder suggestion?” — the state-leakage control is decisive against current live use; a masked ablation can determine whether the present question is salvageable, while real-save validity remains open.
- Questions remaining: the unified cross-feature proof-or-retire rule and ranked next step.

## Reflection

- What worked and why: reading the pinned control output together with the transformation code linked each of the 30 discordant losses to the next row's state, exposing the mechanism rather than relying on the aggregate kill alone.
- What did not work and why: neither the 40-row fixture nor the confidence-gated arm answers whether folder choice generalizes to actual saves; the current corpus has no content- or folder-save examples.
- What I would do differently: before proposing any broader benchmark, test the minimal masked-state contrast with frozen choices and then design a real-save holdout around the actual save classes.

## Questions Answered

- What evidence, controls, hardening, integration, and tests would settle alignment folder suggestion?

## Questions Remaining

- What unified proof-or-retire rule and ranked next step applies across the three candidates?

## Next Focus

Verify the shared gate and scorer claims across the three candidates, consolidate their ranked next steps, and state a common proof-or-retire rule that separates fixture evidence from real-traffic validity and staged integration.
