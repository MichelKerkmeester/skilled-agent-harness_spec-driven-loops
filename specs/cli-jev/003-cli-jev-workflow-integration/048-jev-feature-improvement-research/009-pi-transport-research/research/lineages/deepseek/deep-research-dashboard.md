---
title: "Deep Research Dashboard — Jev Pi native classifier transport (deepseek lineage)"
trigger_phrases: []
---
# Deep Research Dashboard — deepseek lineage

| Field | Value |
|---|---|
| Session | `fanout-deepseek-1790986325077-da6hri` |
| Executor | `cli-pi`, `deepseek-v4.1-flash`, reasoning max |
| Loop type | research |
| Iterations | 5 of 5 (stopPolicy: max-iterations) |
| Stop reason | `maxIterationsReached` |
| Synthesis | `research.md` in this directory |

## Iterations

| # | Focus | newInfoRatio | Status |
|---|---|---|---|
| 1 | Q1: what drove the measured result | 0.85 | complete |
| 2 | Q2: raise accuracy / lower cost | 0.80 | complete |
| 3 | Q3: measurement trustworthiness | 0.75 | complete |
| 4 | Q4: where else the judgment pays off | 0.70 | complete |
| 5 | Q5: default-on needs, cost, risk | 0.65 | complete |

Convergence telemetry only (max-iterations policy): the ratio declined steadily and stayed well above
the 0.05 threshold; no early stop was taken.

## Headline Numbers

- Verdict under study: `pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5
  median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022` — reproduced from the records, one row from
  failure (94.6 would be keep-cli).
- All five disagreements are near-ties; 99 decisive rows agree 100 percent; two flips are metric
  artifacts.
- 1/2/3-call agreement: 92.8 / 94.6 / 95.5 — the three rotations are load-bearing.
- Margin-gated escalation (defer sub-0.10 rows to the CLI): 99.1 percent simulated, Pi serves 104/111.
- Exact 95 percent CI for 106/111: [89.8, 98.5] — adopt vs keep-cli not statistically distinguishable.
- Cost: ~533 input tokens/call at $0.042/M; $0.0022 per 100 calls; ~$0.0075 per 333-call replay;
  free `span-01-lite` arm available but unmeasured.
- Inventory: 7 `choice`, 8 `noul`, 1 `score` call sites in `.skilled`; only 2 (both sk-doc harnesses)
  have adopted the transport.

## Top Recommendations (full list in `research.md` §2)

1. Repair the measurement (same-day paired run, usage/backend/margin records, raw counts).
2. Harden the transport (runtime/gate caching, Pi version pin, quiet fallback).
3. Add margin-gated escalation, then verify by rerun.
4. Adopt in the remaining `choice` harnesses; measure `bool`/`score` arms before the deep-loop scorers.
5. Default-on only as a staged, monitored commitment after the above.
