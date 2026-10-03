# Iteration 5: Default-on integration — needs, cost, risk

## Focus

Define what a default-on integration of the measured fallback would need, what it would cost, and what risks it carries, using the reviewer scorer's grader slot as the reference design; close with the ranked recommendation list that feeds synthesis.

## Findings

1. **Default-on has one concrete home today: the benchmark lane's grader branch, and enabling it there would be inert.** `scoring_method=reviewer` routes the workflow to `reviewer-scorer.cjs` with `--grader noop|mock|llm`, gated on `SPECKIT_REVIEWER_BENCHMARKS`; `-grader llm` requires `target_model` and dispatches a CLI. The shipped reviewer profile contains only fixtures that hit the pattern (census: 8 hits, 0 misses), so a Jev grader on that profile would never be invoked and would change no current score. The measurable integration becomes meaningful only when miss-case fixtures exist. [SOURCE: .skilled/commands/deep/assets/deep-model-benchmark-auto.yaml:39-65,204-206] [SOURCE: reviewer-scorer.cjs:155-171,273-279] [SOURCE: ~/.skilled/.labels/runs/047-025-jev.stdout.txt census line] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/reviewer-regression.json]

2. **The minimum integration surface is small and enumerable.** (a) A `jev` grader value in `reviewer-scorer.cjs` that reuses the frozen question and three option descriptions from `score-verdict-fallback.cjs`; (b) a decision on `verdictMethod` naming, because the D4 dimension and mismatch messages currently key on `llm-grader` (`reviewer-scorer.cjs:166,235`); (c) availability behavior: `jev` on PATH, exact `jev 0.6.2`, `auth status` exit 0, otherwise a recorded skip rather than a silent green; (d) a payload policy, since reviewer outputs can carry diffs and repo state off the machine (the offline scorer's `--accept-payload` rule is the precedent); (e) telemetry: usage tokens, model id, latency, requalify; (f) enablement order: add `--grader jev` as opt-in, exercise it on miss fixtures, and only then discuss a default change, consistent with 047 D6 and feature 025 D5. [SOURCE: score-verdict-fallback.cjs:34-60,505-548,758-773] [SOURCE: reviewer-scorer.cjs:155-171,235] [SOURCE: 025 spec.md Out of Scope and REQ-007] [SOURCE: 047 goal.md D6]

3. **The reference design's cost is measurable and small at benchmark volume; the one-call variant is recomputable.** The measured protocol spent 73 calls for 24 rows at p50 334 ms and a 16,767-token pre-run estimate (serial about 24 s). Recomputation shows all 24 rows unanimous across orders, so a one-call protocol would have used 24 calls (about 8 s) with identical picks on this corpus; a batched `run` request carrying the three option orders as named questions on one state is untested but would preserve order checks with one request (`jev run` sends a batched request object). The reviewer-regression profile has 4 fixtures (8 merged cases), so even the 3-call protocol costs a trivial number of calls per benchmark run; cost matters only if the fallback reaches high-volume review traffic, which is outside this phase. [SOURCE: iteration 2 findings 1-2] [SOURCE: ~/.skilled/.labels/runs/047-025-jev.stdout.txt] [SOURCE: .skilled/skills/cli-classifier/cli-jev/references/cli-reference.md:49,118-122] [SOURCE: .skilled/skills/cli-classifier/cli-jev/SKILL.md activation triggers: batched classification]

4. **The risk ledger, ordered by what would invalidate a default-on decision.** (1) Corpus validity: a default flip justified by the current synthetic corpus would generalize nothing; the natural-miss corpus and independent labels come first. (2) Egress: reviewer outputs and diffs leave the machine to a hosted provider; the payload-acceptance rule and the cli-jev "state is a secret" boundary must be policy, not an afterthought. (3) False confidence: 24/24 has a one-sided 95 percent floor of 88.3 percent, and a fail-to-pass error in a review gate is asymmetric; per-class reporting and an abstention path (or advisory-only use) are prerequisites. (4) Drift and availability: the version pin is exact, a model change silently invalidates comparability without `requalify`, and an absent client must fail visibly. (5) Forced choice: the three-key contract has no abstain; `block` is defined as "cannot give a verdict", which the scorer's option text already treats as the abstention term. (6) Cost creep: 3 calls per miss times unknown live miss volume; one-call default, batching, caching and a budget cap are the mitigations. [SOURCE: iterations 2-3] [SOURCE: score-verdict-fallback.cjs:36-40,505-548,845-850] [SOURCE: reviewer-scorer.cjs:273-279]

5. **The measurement-to-integration loop is already designed end to end; the missing piece is capture, not code.** A reviewer run writes `reviewer-report.json` with `per_test[].verdictMethod`; the fallback scorer's `--reports` arm counts `pattern`, `llm-grader` and `none` per report; only misses would need labels; the same keep rule would then judge a Jev grader column. Every stage exists in files today, and none has ever been exercised because no reviewer report exists and live runs keep only a hashed output. The cheapest path to a trustworthy default-on decision is therefore: run the reviewer benchmark with `--grader noop` on a miss-bearing fixture set, save outputs under an opt-in flag, label the misses independently, and measure. [SOURCE: score-verdict-fallback.cjs:244-258,1030-1044] [SOURCE: reviewer-scorer.cjs:203,280-300] [SOURCE: deep-model-benchmark-auto.yaml:152,209]

6. **Final ranked recommendations, with basis and effort.**

| Rank | Recommendation | Basis | Effort | Risk |
|------|----------------|-------|--------|------|
| 1 | Required: build the natural-miss corpus and independent labels before any default change (opt-in output save or collected reviewer outputs; two blind drafts plus an arbiter blind to intent; report per-class metrics). | Q3 findings; Q5 finding 1 | Medium | Low; no behavior change |
| 2 | Required: extend the report trust package (repo commit, scorer/profile version, run time, corpus provenance, usage/cost, binomial CIs, per-class confusion; keep `labels_sha256`). | Q3 findings 3, 5 | Small | None |
| 3 | Recommended: seed the measurement protocol change (one call plus a second only on a missing or low-confidence pick) and record `usage` tokens; add a content-hash cache keyed with model identity. | Q2 findings 1-4 | Small | Needs a fresh run to price |
| 4 | Recommended: add `jev` as an opt-in grader value and add miss-case fixtures to `reviewer-regression` so the fallback path is exercised; keep the default unchanged until ranks 1-2 land. | Q5 findings 1-2 | Small to medium | Low; inert until fixtures exist |
| 5 | Recommended: reuse the shared question/options/transport discipline for the next candidates (residue-severity first) via one harness rather than per-scorer code. | Q4 findings 1-3, 6 | Medium | None measured yet |
| 6 | Optional: price a regex widening study and a batched `run` protocol on the natural corpus. | Q2 findings 2, 5 | One run each | Cheap either way |
| 7 | Not recommended: any model read in runtime completion detection. | Q4 finding 5 | - | Reintroduces self-report trust |

## Ruled Out

- Flipping the grader default on today's corpus: with 8 fixture hits and 0 misses the fallback is inert there, and the only miss population is synthetic; a default change would be an unearned claim. [SOURCE: census line; iteration 3]
- Treating the version pin as drift protection by itself: an exact pin detects a version change only when a stored report exists to compare against; the integration needs its own recorded model identity. [SOURCE: score-verdict-fallback.cjs:845-850]
- Treating the payload question as settled by `--accept-payload`: that flag is an offline scorer affordance; a live policy for reviewer text needs an explicit decision, not a flag default. [SOURCE: 025 spec.md REQ-007]

## Dead Ends

- Searching for an existing reviewer-report.json to price natural-miss volume: none exists; the report path is defined by the workflow but has never been produced in this repository. [SOURCE: repository find; deep-model-benchmark-auto.yaml:152]

## Edge Cases

- If a Jev grader replaces the CLI `--grader llm` path, D4 (`perTest.some(verdictMethod === 'llm-grader')`) and mismatch messaging must be updated in the same change or the reviewer benchmark's dimension math silently shifts. [SOURCE: reviewer-scorer.cjs:235]
- A fail-open skip keeps CI green while the fallback is absent; a fail-closed choice turns a missing client into a benchmark failure. The current offline scorer chooses recorded skips; a benchmark default-on must state which one it wants. [SOURCE: score-verdict-fallback.cjs:505-548; reviewer-scorer.cjs:273-279]

## Sources Consulted

- .skilled/commands/deep/assets/deep-model-benchmark-auto.yaml:39-65, 152, 204-209 (and the confirm YAML mirror lines)
- reviewer-scorer.cjs:155-171, 235, 273-279, 280-300
- score-verdict-fallback.cjs:34-60, 244-258, 505-548, 758-773, 845-850, 1030-1044
- cli-jev/references/cli-reference.md:49, 118-122; cli-jev/SKILL.md (batched classification trigger)
- reviewer-regression.json; 047 results.md; 047 goal.md D6; 025 spec.md (Out of Scope, REQ-007)
- ~/.skilled/.labels/runs/047-025-jev.stdout.txt; report.json
- deep-research-strategy.md (read before iteration 5); steer.md (checked before iteration 5; absent)

## Assessment

- New information ratio: 0.80
- Novelty: the workflow-route citations, the inertness observation (8 hits, 0 misses), the D4 method-naming dependency, the batched `run` proposal, and the ranked recommendation table are new.
- Questions addressed: Q5 fully; all five questions now have answered iterations.
- Questions answered: What would default-on integration need, cost, and risk?
- Confidence: High for the route and file citations and for the inertness claim; cost extrapolation beyond benchmark volume is marked unknown.

## Reflection

- What worked and why: reading the workflow YAML alongside the scorer showed that the integration surface is a grader-enum change and a fixture gap, not a new subsystem.
- What did not work and why: no reviewer-report.json exists, so natural-miss volume cannot be priced; that absence is itself the gating finding.
- What I would do differently: start integration planning from the workflow's persisted report path; it is the loop that connects measurement to enablement.

## Recommended Next Focus

Synthesis: consolidate the five answers into the lineage's final ranked recommendation set with the convergence report.
