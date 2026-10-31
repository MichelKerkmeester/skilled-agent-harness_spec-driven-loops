---
title: Deep Research Strategy - DeepSeek Lineage
contextType: planning
---

# Deep Research Strategy - Session Tracking

## Research Topic
Improve, refine and expand the Jev reviewer verdict fallback (cli-jev feature 025). Its scorer is .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs in system-deep-loop/deep-improvement, and it measures the reviewer scorer's deterministic verdict regex (extractVerdict) in the model-benchmark reviewer-regression profile; Jev answers only when the regex finds no verdict. Measured result: verdict jev: keep K=24 M=24 A=24 B=8 W=16 L=0 F=0 p_win=0.00001526, baselines: majority 8 of 24, loose 0 of 24. Fixture corpus of 24 reviewer reports written so the regex misses every one. Real reviewers rarely write verdicts the regex misses. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk.

## Known Context
The loop ran five inline iterations against the recorded 047 measurement and its artifacts. Result drivers: forced 8/8/8 labels, corpus-level exact-token avoidance, no fixture misses. Cost/accuracy: three calls per miss with no measured order effect, unrecorded usage, unused cache, narrow regex formats, process-heavy CLI grader. Trust: synthetic corpus, author-intent labels with no per-row decisions record, wide K=24 uncertainty, both baselines at floor, instrument provenance gaps, no natural-miss instrument. Transfer: reviewer grader slot first, then residue-severity, deliverable region, sub-scorers; completion detection rejected. Integration: an inert-today grader-enum change gated on a natural corpus, with a small enumerable change set.

## Key Questions
1. What drove the measured Jev result?
2. How can accuracy improve or cost fall?
3. How can the measurement become more trustworthy?
4. Where else in .skilled would the same judgment pay off?
5. What would default-on integration need, cost, and risk?

## Answered Questions
1. What drove the measured Jev result? (iteration 1)
2. How can accuracy improve or cost fall? (iteration 2)
3. How can the measurement become more trustworthy? (iteration 3)
4. Where else in .skilled would the same judgment pay off? (iteration 4)
5. What would default-on integration need, cost, and risk? (iteration 5)

## What Worked
- Reading the verdict line alongside `report.json`, `calls.jsonl`, scorer decisions, corpus text, and provenance records reconciled every printed count with its definition and exposed the construction.
- Recomputation (order stability, confidence intervals, regex probes, intent-file comparison) separated measured effects from design statements.
- Searching for parsers' own miss outputs (`skipped`, confidence labels, zero-score paths) found transfer seams with ready-made corpus sources.
- Reading the workflow YAML alongside the scorer showed the integration surface is a grader-enum change and a fixture gap, not a new subsystem.

## What Failed
- No approach failed in iterations 1-5.

## Exhausted Approaches
- Searching for an existing natural-miss artifact: no `reviewer-report.json` exists anywhere and no 025 decisions file exists under 047's evidence directory.

## Ruled-Out Directions
- Treating the 8-case fixture census as the fallback's measured population.
- Treating loose 0 of 24 as a pure property of the loose rule.
- Treating `p_win=0.00001526` as an error probability.
- Treating the three-order protocol as free accuracy on this population.
- Treating a regex widening as measurable on the current corpus.
- Treating the printed token estimate as measured cost.
- Treating 24 of 24 as establishing a usable precision level.
- Treating the two zero-call baselines as realistic competitors.
- Treating the labels as independent ground truth.
- Treating already-measured 047 features as transfer answers.
- Replacing the artifact-based completion check with a model read.
- Flipping the grader default on the current corpus.

## Divergence Frontier
None recorded; no divergent pivots were taken in this lineage.

## Next Focus
Complete: synthesis written to `research.md`; stop reason recorded as `maxIterationsReached` at the forced-depth cap of 5 iterations.
