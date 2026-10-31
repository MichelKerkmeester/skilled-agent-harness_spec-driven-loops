# Iteration 1 — Why the measured keep result is strong

## Focus

Trace the recorded result to the deterministic folder scorer, the model input and repeat protocol, and the comparator rule. Separate confirmed mechanics from explanations that still need an ablation.

## Actions Taken

- Read the alignment validator’s topic, domain, folder-score and alternatives code.
- Read the scorer’s row-label, baseline, call-shape and keep-rule code.
- Compared the two save-validation functions and their feature 022 scope notes.
- Checked the lineage steer.md before starting; it was absent.

## Findings

1. **The recorded result is a large head-to-head gain over the selected baseline.** The packet reports K=40, M=40, A=39, B=30, W=10, L=1, F=0, p=0.0059, baseline=top, with the target right on 0 of 40 rows (008-folder-suggestion-research/spec.md:72). By the scorer’s definitions, Jev is right on 39/40 (97.5%), while the top alternative baseline is right on 30/40 (75%); the net gain is 9 rows, or 22.5 percentage points. With 10 wins and 1 loss among disagreements, the sign-test tail is 12/2048 = 0.005859375, which rounds to the reported p. All rows were measured, the gain exceeds the 10-point margin, and the flip count is within the 10% limit (score-alignment-suggestion.ts:653-690). The target’s zero correct answers makes this a Jev-versus-top comparison; it does not measure an improvement over the target.

2. **Jev receives richer semantic input than the validator’s folder-name score.** The validator extracts request/title tokens, optional observation text and filenames, then scores folder-name tokens with a fixed infrastructure bonus (alignment-validator.ts:299-350, 412-470). The Jev arm presents the row state and descriptions of target/alternative folders, asks a fixed choice question, and rotates option order across three calls (score-alignment-suggestion.ts:836-878, 980-989, 1011-1019, 1081-1087, 1115-1139). That gives it evidence about save context and folder meaning that a name-token ranking may miss. This is a plausible explanation for the margin, not a demonstrated cause: the result contains no name-only, description-only or state-only ablation.

3. **The two save validators do not produce equivalent judgments.** validateContentAlignment combines conversation topics with observation keywords from up to ten observations; validateFolderAlignment uses conversation topics only (alignment-validator.ts:477-491, 601-613). Their low-match candidate lists also differ: the content path keeps only higher-scoring alternatives, while the folder path ranks siblings and presents the list only when its top entry beats the current folder (alignment-validator.ts:522-537, 641-684). A measured result should therefore identify the path and row construction, rather than treating “alignment on saves” as one uniform population. Feature 022 also documents that the CLI and data save paths differ, and says only the data path can switch to a selected alternative (022-alignment-folder-suggestion/spec.md:86-89).

4. **“Keep” is a scorer gate, not approval to serve the suggestion.** The feature contract explicitly says a keep serves nothing; a later phase and operator decision are needed (022-alignment-folder-suggestion/spec.md:184-208). This makes the result evidence for further measured consideration, not evidence that default-on behavior is already safe.

## Questions Answered

- **What drove the measured comparison?** Confirmed: the scorer chooses the top listed alternative when it is more often correct than the target (score-alignment-suggestion.ts:579-592); the packet reports that baseline and zero correct targets (008-folder-suggestion-research/spec.md:72). Jev’s richer state-plus-description input is a strong candidate explanation, but causality remains untested.
- **How trustworthy is the keep rule mechanically?** It requires at least 90% coverage, a minimum 10-point advantage, a one-sided sign test below 0.05, and no more than 10% answer flips (score-alignment-suggestion.ts:653-690). All four measured counters satisfy those conditions in the supplied result.

## Questions Remaining

- Which of state, folder descriptions, option set, or model behavior accounts for the gain?
- Does the result generalize across both save paths and a held-out, operator-labeled sample?
- Can the same quality be retained with fewer calls or bounded live latency?

## Sources Consulted

- steer.md — checked before iteration 1; absent, so there was no steering text to weigh.
- specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/008-folder-suggestion-research/spec.md:72
- .skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts:73-90, 299-470, 477-537, 601-684
- .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:58-67, 579-690, 836-878, 980-1019, 1081-1139
- specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md:86-89, 184-208

## Assessment

- newInfoRatio: 0.82
- Justification: This pass links the supplied counters to the baseline-selection and keep-rule code, and identifies the validator/model evidence gap. Causal attribution and generalization remain open, so the finding set is substantial but not conclusive.
- Confidence: High for the arithmetic and source-code mechanics; medium for the semantic-input explanation; low for any claim of production lift.

## Reflection

The strongest explanation is currently structural: a semantic chooser sees save state and folder descriptions while the baseline is a lexical ranker. The result is consistent with that advantage, but only an ablation or held-out comparison can establish it. The feature’s own contract also prevents reading “keep” as a rollout decision.

## Recommended Next Focus

Iteration 2: audit the checked-in fixture and label provenance, comparator selection, and measurement representativeness; then quantify model-call and latency cost from the scorer’s call plan.
