# Lane C — scoring contract

Authoritative computation for the Skill Benchmark Report. Source of truth: the converged design in `122-.../001-skill-benchmark-deep-research/research/research.md` §3 and the implementation playbook in `002-implementation-deep-research/research/research.md`.

## Point weights (full / live mode)

`D1 = 25` (inter 12 + intra 13) · `D2 = 20` · `D3 = 15` · `D4 = 25` · `D5 = 15` (hard gate).

## Mode A (router-replay, deterministic)

Scores only what needs no live model; the aggregate normalizes over the measured weights (D1-intra + D2 + D3) so the number is honest about coverage. D5 is computed statically and gates.

- **D1-intra** = `0.4 * intentRecall + 0.6 * resourceRecall` vs private `expected.intentKeys` / `expected.resources`. Empty expected = not-applicable (treated as 1.0, non-penalizing). Negative-activation scenarios invert: routing the expected resources is a failure.
- **D2** (Mode A proxy) = recall of expected resources in the routed set. Live mode replaces this with Hit@1 / Hit@3 / Recall@5 / MRR over the observed file-load trace.
- **D3** (Mode A proxy) = `1 - wastedRouted / totalRouted` (over-routing penalty). Live mode replaces with calls/tokens-to-first-expected.
- **D5** = `100 - Σ penalties` (P0 40, P1 12, P2 3), floored at 0. Any P0 sets `gateFailed`.

## Deferred to live mode (Mode B)

- **D1-inter** — advisor selection score via the advisor scorer (`scoreAdvisorPrompt` / `skill_advisor.py`), captured out-of-band with the advisor hook disabled so the answer cannot leak.
- **D4** — usefulness via skill-on vs skill-off ablation through the pluggable grader (`noop|mock|llm`). Reuse the Lane B grader harness (claude-graded, single-dimension) per the playbook; namespace its cache dir to avoid Lane B collision.

Both are reported as `status: unscored-mode-a` until built — never faked.

## Funnel + bottleneck ranking

Per-scenario `firstFailingStage` ∈ {router-unparseable, routed-intra, discovered}. The headline bottleneck is the stage with the largest first-failure count (attrition). Bottlenecks list D5 findings + the headline funnel finding, each mapped through `assets/skill-benchmark/remediation_taxonomy.json` to (file, locus, one-line fix, handoff lane).
