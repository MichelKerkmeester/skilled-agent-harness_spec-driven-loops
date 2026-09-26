# Iteration 8 — mimo-08: The usefulness proof for each new surface

**Lineage:** `mimo` (UX and measurement lens) — wave 3
**Session:** `fanout-mimo-1790438758756-5mso8j`
**Focus Area:** `mimo-08` — The usefulness proof for each new surface
**Angle question:** For each surface kept in mimo-07 and the other lineages' wave 3, what is the proof plan of one to five pass or fail checks, written before the build?

## Sibling check

Read `deepseek/iterations/iteration-008.md` (Harness A and B designs) and `grok/iterations/iteration-008.md` (the contest; its wrapper rule for the goal verifier). Grok-08 recorded this lineage as having no iterations and its stop-shadow, severity and screen ideas as single-lens; those are now covered by my iterations 4 to 6 and get cross-lens marks in the synthesis. One sibling design detail is corrected below from code both lines missed.

## The correction: which scorer consumes the reviewer fixtures

`reviewer-regression.json` (opened) says in its own note: "Run through the reviewer scorer, NOT run-benchmark.cjs --scorer pattern/5dim: `--scorer reviewer` routes here via the /deep:model-benchmark YAML, gated on `SPECKIT_REVIEWER_BENCHMARKS`." And the scoring block is correctness-gated: `correctnessGate.threshold: 1.0`, `requiredAggregateScore: 100`, "a fixture passes only when the extracted verdict and required findings match the oracle" (opened). Two consequences: deepseek-08's Harness B run command (`run-benchmark.cjs --profile reviewer-regression --scorer 5dim --grader jev`) may not consume these fixtures at all, so wiring the `jev` grader branch must first verify which scorer reads them; and the fixtures are pass/fail regression assertions over 8 single-class cases (mimo-05's census), not a graded agreement corpus. Both facts belong in the grader's proof plan as check 1 and check 2.

Stability has a real formula to copy (opened `benchmark-stability.cjs:20-28`): minimum 3 replays, coefficient `1 - (stddev / mean)`, warning threshold 0.95.

## Proof plans (Q1: metric, baseline, harness. Q2: 1 to 5 checks before the build)

### A. Routing tie-break arm (all three lineages' first slice)

- **Metric, baseline, harness:** held-out MRR and right@3, plus top-1 on eligible rows; baseline is the similarity-only arm on the identical split (H1 baselines: holdout 53/70, slice 18/24); harness H1/H2 with deepseek-08's Phase 0 census.
- **Threshold for keeping:** beats similarity-only on held-out MRR or right@3 (grok-010's kill criterion, cross-lens accepted) AND stability coefficient at least 0.95 over 3 reruns.
1. Run the census phase with no key. Command: `node score-jev-tiebreak.mjs --census`. Artifact: `census-<date>.json`. Boundary: zero margin-eligible rows means the arm reports "no headroom" and the family stops before any call.
2. Run the arm with key. Artifact: `<date>-report.json` plus `<date>-calls.jsonl` carrying per-call latency, exit and version. Boundary: an exit 4 row becomes `unmeasured`, never a pick.
3. Read the held-out delta. Boundary: wins on the 0.03 slice alone do not count; the slice was chosen by low margin.
4. Rerun three times. Boundary: flip rate above the 0.95 stability line fails the keep even if the mean improves.
5. Confirm `scorer-eval-baseline.json` and the ratchet are untouched. Boundary: any write to them fails the arm regardless of results.

### B. D4 `jev` grader kind (deepseek's second slice)

- **Metric, baseline, harness:** agreement with `expectedVerdict` and `expectedFindings`; baseline is the `llm` grader's agreement on the same fixtures, recorded fresh since no agreement number exists (gap row); harness H9 through whichever scorer actually consumes reviewer fixtures (see correction above).
- **Threshold for keeping:** agreement at least the `llm` grader's at materially lower cost and latency, measured on a fixture set covering all three verdict classes.
1. Expand the fixtures. Artifact: reviewer fixtures carrying at least two `pass`, two `fail` and two `block` cases. Boundary: without class coverage the agreement number is not quotable (8 all-fail cases today, mimo-05).
2. Verify the runner path. Artifact: one run command that visibly grades the reviewer fixtures end to end. Boundary: if the fixtures only route through `--scorer reviewer`, the grader kind is wired into the scorer that consumes them, not into `score-model-variant.cjs`'s D4 factory.
3. No-key refusal at startup with a named stderr message; a `jev`-requested run never falls through to `mock`. Boundary: exit 3 produces no graded score at all.
4. Not-measured is representable: a failed call yields a skip or `failed` status, never `score 0.0` (fixing `score-model-variant.cjs:222-224` if that path is reused). Boundary: any silent zero fails the check.
5. Agreement run `--grader llm` versus `--grader jev` plus 3-rerun stability. Boundary: flip rate over 0.95 fails the keep.

### C. Confirm-mode stop suggestion (mimo-04's operator surface)

- **Metric, baseline, harness:** suggestion precision (share of suggestions whose stop loses zero first-appearance sources) and iterations saved; baseline is the heuristic's replayed trade curve, not "no signal"; harness the H11 replay over archived lineages.
- **Threshold for keeping:** precision at least 0.9 AND at least one iteration saved on at least 20% of eligible lineages.
1. Local arms run over the corpus (target 25 sampled for the Jev arm, all eligible for local arms). Artifact: trade-curve report. Boundary: fewer than 25 eligible lineages means the report says so and stops.
2. Heuristic baseline recorded before the Jev arm. Boundary: if the heuristic already stops at the derived gold, the Jev arm is unnecessary and the idea dies here (kill criterion).
3. Jev arm rows: exits and malformations become `unmeasured`. Boundary: a stop judgment is never synthesized from a transport failure.
4. Gold sanity: a manual read of 5 lineages comparing the derived marker with the iteration prose. Boundary: wrong on 2 or more of 5 means redesign the gold before trusting any curve.
5. Only then the confirm-line build. Boundary: without calibrated precision the line never appears.

### D. P0 reread order (mimo-05's operator surface)

- **Metric, baseline, harness:** P0-survival recall and reread-set reduction; baseline is rereading 100% of post-replay P0s; harness the transitions-derived gold over archived deep-review findings (H14 adapter keeps the arm blinded).
- **Threshold for keeping:** recall at least 0.9 on surviving P0s AND reduction at least 30%; below both, the operator-facing change is none.
1. Corpus-wide P0 census. Artifact: census JSON of initial-P0 findings, surviving and downgraded counts. Boundary: under 20 surviving-P0 positives corpus-wide means the arm cannot prove recall and is parked.
2. Replay arm against transitions gold, initial discoveries (`from: null`) excluded as gold. Boundary: unmeasured rows on failure, never `not_a_finding` by default.
3. Operator gold sanity on 10 findings. Boundary: if the operator's judgment contradicts the adjudicated severity on 3 or more of 10, the gold is the model's own opinion and the arm drops or its threshold rises.
4. Report-ordering build only past the thresholds. Boundary: below them, no report change at all.

### E. Done-gate advisory suppression (mimo-06/07's surface)

- **Metric, baseline, harness:** false-fire rate and missed-claim rate on the shared labeled turns; baseline is the current regex (with its `occurred`/`happened` words); harness H12-style labeled scoring plus the sentinel advisory log as fired-set history.
- **Threshold for keeping:** a measured false-fire rate above 0.10 justifies action; missed claims always outweigh false fires in the choice of fix.
1. The shared 30 to 50 excerpt set exists with both labelings (goal classes and claim classes). Boundary: under 30 excerpts proves nothing.
2. Score regex versus Jev on the set. Boundary: a Jev arm that misses a real completion claim at a higher rate than the regex fails regardless of false-fire wins.
3. Outcome selection by cost: if narrowing the regex alone cuts false fires with zero added misses, ship the regex change and no Jev code. Boundary: this is a passing outcome of the program, not a fallback.
4. Advisory-log audit within its 30-day retention window. Boundary: too small a fired set and check 2 alone decides.

### F. Goal verifier shadow (stays `later`, grok-08's contest accepted)

- **Metric, baseline, harness:** three-class accuracy and false `not-met` rate on the shared labeled set; baseline the heuristic's numbers on it (H12); harness H12 plus the set.
- **Threshold for keeping:** false `not-met` rate cut at least 30% with zero missed blockers.
1. Shared labeled set as in E.
2. Heuristic baseline first.
3. Shadow arm, heuristic authoritative, `source` distinguishing.
4. Grok-08's wrapper rule is a build constraint: when `VERIFIER_BLOCKING_PATTERN` matches, the verdict stays `not-met` and Jev is not asked (its hand-off; `goal-core.cjs:603-605` opened in mimo-03).
5. Boundary for the whole idea: no labeled set, no build.

## Cross-cutting checks every plan inherits

- The package probe (`jev --version` expecting `jev 0.6.2`, then `jev auth status`) runs before any arm interprets an exit code (deepseek-09's failure table, cross-lens accepted).
- Every report records version, provider and model beside its numbers (deepseek-07's finding).
- The egress announcement prints before the first call of any arm (mimo-07's requirement).
- No arm ever writes a ratchet baseline, a registry or a frozen contract file.

## Hand-off

- Proof plan per surface with metric, baseline, harness and keep-threshold: A (routing arm) keeps at held-out MRR or right@3 gain plus stability 0.95; B (grader) keeps at llm-level agreement on class-complete fixtures via the verified runner path; C (stop suggestion) keeps at precision 0.9 plus 20% lineage savings; D (P0 order) keeps at recall 0.9 plus 30% reduction; E (done gate) keeps at false-fire over 0.10 with the cheapest-fix-first rule; F (goal) stays later behind the shared set and grok's wrapper rule.
- The two checks that gate everything else: the shared 30 to 50 excerpt set (E/F) and the fixture class-complete expansion (B). Neither needs a key and both are pure labeling or fixture authoring.
- The runner-path verification (B check 2) is the one place the sibling plans cite a command the fixture profile itself disowns; the synthesis should carry this correction.
