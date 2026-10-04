# Iteration 004 — Alignment folder suggestion: the distractor kill and the state-anchored pick

- **Focus:** The fixture keep (39 vs 30 of 40) against the distractor-state control that turns it to kill (W=0 L=30); what corpus, labels, keep rule and power would prove a live win or settle a kill; accuracy changes; hardening; the save-flow integration shape; tests. (Q4)
- **Read first:** no `steer.md` exists in this lineage yet (checked at iteration start, absent).
- **Lens:** every claim gets a `file:line` or a recorded run line; every "confirmed" names the check that produced it.

## Actions Taken

1. Read the 049/008 build record: `049-jev-feature-improvement-build/008-folder-suggestion-improvements/implementation-summary.md` (what shipped, verification, limitations).
2. Read the recorded re-measure `~/.skilled/.labels/runs/049-008-jev.stdout.txt` (primary, label-swap, distractor-state, confidence-gated arms; pins).
3. Read the scorer's verdict rule, distractor construction and control runner: `score-alignment-suggestion.ts:745-757,931-937,1649-1650,1681-1704`.
4. Read the negative-control and recall/interval output lines in the recorded run.

## Findings

### F-001 — The distractor-state control kills the verdict: the pick follows the state's folder name, not the content (P0, Q4)

With each row's state rotated to the next row's state, the recorded run prints `verdict jev: kill K=40 M=40 A=0 B=30 W=0 L=30 F=0 p=0.0000 baseline=top` and `W+L=30 interval95=[0.000,0.114]` (`049-008-jev.stdout.txt:53-54`). Every one of the 30 discordant rows is a loss where the model picked the folder named in the rotated state (e.g. label `002-advisor-jev-tiebreak-arm`, model `003-goal-verifier-jev-shadow`; label `020-routing-clarify-default`, model `021-stage2-leaf-route-replay`). The scorer's kill branch fires: `killP = binomTail(W+L, L)`; with W=0 L=30 the tail is ≈ 2^-30 ≤ 0.05 (`score-alignment-suggestion.ts:750-752`).

- **Confirmed by:** reading the recorded control arm's verdict, interval and every discordant row; reading `distractorStates` (`:931-937`) and the kill branch (`:750-752`).
- **Implication:** the judgment is state-anchored. In the live save flow the state is the session summary, which routinely names folders; a mention of any folder captures the pick. This is a P0 robustness failure of the *question shape*, not a tuning gap.

### F-002 — The keep survives only with path-resolved descriptions and the original state (P0, Q4)

The 049/008 re-measure printed `verdict jev: keep K=40 M=40 A=39 B=30 W=10 L=1 F=0 p=0.0059 baseline=top` (311 calls, 102 s, `049-008-jev-20261003b`), with `candidate recall: overall=40/40 (100.0%)` and `baseline: target=0 top=30 chosen=top comparator=auto` (`049-008-jev.stdout.txt:3-10`). The ten wins are the rows where the label is neither the target nor the top alternative — real recoveries against the top-comparator baseline.

- **Confirmed by:** reading the recorded run's primary verdict and recall lines; the 049/008 verification table records the same line (`implementation-summary.md:94`).
- **Implication:** the keep is real against the top comparator on this fixture — and it is exactly the result the distractor control invalidates as a live predictor. Both facts must be reported together.

### F-003 — The corpus is a fixture by construction; proving a live win needs real saves, a declared comparator, and far more discordant rows (P0, Q4)

The target is wrong on 0 of 40 rows by construction (prior research, session-verified), the labels are one delegated arbiter read, and the recorded run used `comparator=auto` (the comparator is chosen on the same labels it is scored against). Discordant rows number 11 (10W + 1L). Exact one-sided sign-test power (from iteration 3's computation, same rule family): 80% power needs 69 discordant pairs at a 0.65 win rate, 37 at 0.70 — the fixture's 11 cannot prove a live win. What would: real low-match saves with the final destination, save path and label provenance recorded; a pre-declared comparator (the flag now exists); a time/row holdout; and either ≥69 discordant pairs or an explicit acceptance that the fixture can only screen, not prove.

- **Confirmed by:** the recorded `comparator=auto` line; the fixture construction from prior research (`048.../008-folder-suggestion-research/research/research.md:51,73-75`); the power numbers from iteration 3's script.
- **Implication:** the corpus question and the state-anchoring question are independent; both must be fixed before a live path, and the state-anchoring one dominates.

### F-004 — f022-001 still loses with both options described: description resolution did not convert the one loss (P1, Q4)

The 049/008 limitation records: "Jev picks `007-classifier-deep-research` at 0.48, 0.58 and 0.43 against the label `001-deep-research`, even with both described" (`implementation-summary.md:103`). The path-resolved describer fix (built) removed the "undescribed option" defect but the model still prefers the more specific-sounding name.

- **Confirmed by:** reading the limitation entry and the dry-run verification line (`implementation-summary.md:93,103`).
- **Implication:** one irreducible loss remains on this row; it should be adjudicated (is `001-deep-research` really the better destination?) rather than chased with describer edits.

### F-005 — The trust upgrades landed: kill branch, W+L interval, discordant list, pins, gated arm, controls (P1, Q4)

The scorer now prints the keep rule including the kill condition (`:1649-1650`), a Wilson interval over W+L and the discordant rows (`:1480-1483`), corpus/report/scorer pins (`pins: corpus_sha256=… report_sha256=… scorer_sha256=…`), a label-swap control reusing saved picks (`:1681-1686`, `W+L=10 interval95=[0.722,1.000]` — the wins sit on rows whose label is neither target nor top), and the distractor-state arm (`:1697-1704`). The confidence-gated arm kept the same verdict at 70 choice calls against 120 (`049-008-jev.stdout.txt:36-51`). Tests grew to 43 from 35 (`implementation-summary.md:92`).

- **Confirmed by:** reading the code sites and the recorded run's control lines.
- **Implication:** the measurement kit now surfaces the very evidence that kills the live case — the right failure for a measurement tool to have.

### F-006 — Integration shape: an interactive, flag-gated save-flow suggestion; the hard block stays (P2, Q4)

Add `'alignment-suggestion': { env: 'JEV_FEATURE_ALIGNMENT_SUGGESTION', aliases: [] }` to `FEATURES` and a call site in the interactive save-flow alignment suggestion that asks `featureReady('alignment-suggestion')`, shows one folder with a reason, and lets the existing selection step authorize any switch. Constraints from prior research that still bind: interactive only, never override the below-20% hard block, CLI-explicit saves keep their folder and log `ALIGNMENT_BYPASSED`, consent + timeout + kill switch, and a 047 D6 amendment ("No Jev arm joins a default path").

- **Confirmed by:** the gate contract (iteration 1); prior research's integration section (`048.../008/research/research.md:91-103`).
- **Implication:** after the state-anchoring fix and a real-save corpus, the serving shape is the smallest one — one suggestion, confirmed by the user.

### F-007 — Tests to cover (P2, Q4)

Covered today (43 cases): basename collision through runArm for labeled and census rows, recall, comparator, pins, controls, gated-arm scoring (`implementation-summary.md:63`). Missing and needed: a masked-state variant test (state with folder names removed), a real-save corpus validation fixture with final destinations, label-provenance assertions, an f022-001 acceptance/adjudication record, and interactive-flow integration tests with a stub `jev` (fail-open, timeout, consent).

- **Confirmed by:** reading the 049/008 files-changed table; the control implementation's test coverage claim.
- **Implication:** the highest-value new test is the masked-state ablation, because it directly probes the failure F-001 found.

### F-008 — Ranked next step for this feature: mask the state and rerun the control; retire the question if it still kills (P1, Q4)

The cheapest decisive experiment: build the same 40-row arm with folder names masked out of the state (or with an explicit instruction to ignore folder names in the state and judge by content), rerun the distractor-state control. If the kill persists, the current question shape should be retired with that evidence; if it survives, the feature has an accuracy story worth a real-save corpus.

- **Confirmed by:** this iteration's control evidence plus the question-shape reasoning in prior research (`048.../008/research/research.md:63,112`).
- **Implication:** this is a P1 next step (it gates everything else) and costs one arm run plus a small scorer change.

## Ruled Out

- **Reading the fixture keep as production superiority.** The distractor control flips it to kill; the target is wrong 0/40 by construction (F-001, F-003).
- **Chasing f022-001 with describer edits.** Both options are described and it still loses; adjudication is the next step (F-004).
- **A non-interactive or hard-block-overriding suggestion.** Policy (prior research; D6).

## Dead Ends

None. All four research actions produced evidence.

## Edge Cases

- Ambiguous input: none; the topic names the scorer and the control.
- Contradictory evidence: the primary arm keeps while the control kills — recorded as F-001/F-002 with both runs cited; the contradiction is the finding.
- Missing dependencies: `steer.md` absent; no live Jev call made.
- Partial success: none.

## Sources Consulted

- `~/.skilled/.labels/runs/049-008-jev.stdout.txt:3-10,24,31,36-54,86` (primary, label-swap, distractor, gated arms; pins)
- `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:745-757,925-937,1477-1486,1649-1650,1681-1704`
- `specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/008-folder-suggestion-improvements/implementation-summary.md:52,63,92-105`
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/008-folder-suggestion-research/research/research.md:51,63,73-75,91-118`

## Assessment

- New information ratio: 0.9 (the distractor arm's full row-level record, the current keep-rule/kill code, the recorded control lines and the gated-arm result are new; the corpus critique carries forward with the controls now built)
- Questions addressed: Q4
- Questions answered: Q4 in all five sub-parts — corpus/labels/keep-rule/power (F-003), accuracy changes (F-004, F-005), hardening (F-001, F-008), integration (F-006), tests (F-007).

## Reflection

- What worked and why: reading the control arm's per-row discordant lines turned "a distractor control turns it to kill" into the mechanism — the pick follows the state's folder name on 30 of 30 rows.
- What did not work and why: nothing failed; the label-swap control's semantics are subtle (it only swaps rows whose label is the top alternative), so its "unchanged" result is weaker evidence than the distractor arm and is reported as such.
- What I would do differently: for iteration 5, verify the cross-feature claims that depend on shared machinery (the shared scorer-report kit, the gate, the keep-rule family) before writing the decision framework.

## Recommended Next Focus

Iteration 5 — cross-feature synthesis and claim verification (Q5): re-verify the shared claims (scorer-report kit exports, gate FEATURES table, the keep-rule family across the three scorers), consolidate the ranked next step per feature, and assemble the proof-or-retire decision framework (corpus, labels, keep rule, power, hardening, integration, tests) for `research.md`.
