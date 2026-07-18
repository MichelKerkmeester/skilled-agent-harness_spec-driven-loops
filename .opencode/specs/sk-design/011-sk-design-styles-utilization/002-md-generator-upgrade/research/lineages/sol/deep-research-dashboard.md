# Deep Research Dashboard: SOL Lineage

## Lifecycle

- Status: complete
- Session: `fanout-sol-1784377726143-umj0lt`
- Generation: 1
- Executor: `cli-opencode` / `openai/gpt-5.6-sol-fast`
- Stop policy: convergence

## Iteration Table

| Run | Focus | newInfoRatio | Findings | Status |
|---:|---|---:|---:|---|
| 1 | Live pipeline and schema/validator boundaries | 1.00 | 5 | complete |
| 2 | Corpus-calibrated schema and vocabulary | 1.00 | 5 | complete |
| 3 | Bounded STUDY protocol for safe exemplars | 1.00 | 5 | complete |
| 4 | Corpus baselines, validators, fixtures, and leak thresholds | 0.80 | 5 | complete |
| 5 | Ranked upgrade levers and phased delivery | 0.80 | 5 | complete |

## Question Status

- Answered: 5/5 (100%)
- Resolved: Q1, Q2, Q3, Q4, Q5
- Remaining: none

## Convergence Trend

- Ratios: `1.00 -> 1.00 -> 1.00 -> 0.80 -> 0.80`
- Minimum iterations: 3/3, passed
- Rolling average: 0.87, CONTINUE on low-novelty signal
- MAD: latest 0.80 > noise floor 0.00, CONTINUE
- Question coverage: 1.00, STOP
- Legal stop: PASS via all questions answered; minimum depth, source diversity, focus alignment, and no-weak-single-source guards pass
- Stop reason: converged

## Key Findings

- The workflow needs a separate STUDY/pre-WRITE boundary; corpus evidence must not alter EXTRACT, VALIDATE truth, or REPORT.
- `buildWritePrompt` is the narrowest bounded exemplar insertion point.
- A shared versioned schema manifest should unify reference, emitter, prompt, and validator expectations.
- Corpus-calibrated checks should extend, not replace, current fidelity validation.
- Generated corpus summaries and selected edge bundles can supply regression fixtures.
- The calibrated schema should use a stable spine, capability-conditional sections, ordered extension slots, and a shared Quick Start matrix.
- Token and typography calibration should preserve stratified ranges, semantic core roles, valid extensions, and source labels.
- STUDY should hydrate one matched bundle pair and pass only de-literalized observations bound to a target-facts digest.
- Provenance/rights/injection gates and pre-validation leakage checks must fail closed with no-study fallback.
- Hard target/schema/provenance failures and corpus-derived advisory strata belong in the existing validator/report path.
- Compact checked baseline/fixture artifacts should reject staleness and support focused Vitest/mutation gates.
- Exact source spans need calibrated two-signal enforcement; source exclusivity by itself is not proof.
- The phased decision is 10-15 days for schema/fixture/validator MVP, then 8-12 days for optional STUDY hardening.
- Best beyond-retrieval controls are schema-drift sentinels, counterfactual capability probes, and diversity-preserving calibration.

## Dead Ends

- Corpus evidence in EXTRACT or REPORT.
- Exemplar rewrites of deterministic target values.
- Static prompt template as the only enforceable integration point.
- Corpus-majority section homogenization or fixed median token counts.
- Closed typography vocabulary copied from every observed label.
- Two-style exemplar pairing, raw exemplar prompt injection, and rank-only selection.
- Corpus medians as hard gates, raw corpus test snapshots, and automatic fixture blessing in CI.
- Vector replatforming, model fine-tuning, and LLM-as-judge enforcement without a measured residual gap.

## Next Focus

Synthesis complete; proceed to implementation planning from the ranked Phase A/Phase B sequence.

## Active Risks

- Schema-reference, emitter, and validator drift is unresolved.
- Spec Kit Memory unavailable; direct canonical evidence is being used.
- Remaining unknowns are implementation calibration only: exact warning weights, leak precision, retrieval packaging, and measured task duration.
