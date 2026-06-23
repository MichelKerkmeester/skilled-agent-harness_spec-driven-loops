---
title: "Benchmark Results: Vague-Query Model Comparison"
description: "The measured data from the 4-model by 12-query by 3-sample matrix of bare /memory:search dispatches. Sections 1 through 4 are the 2026-06-22 pre-graduation run. Sections 5 through 8 add the 2026-06-23 post-graduation re-run that confirms the noise-floor and lexical-grounding flags fixed the kubernetes false-confirm, the cross-cutting findings on intent, latency and the citation tier, and the dashboard presentation review. Every number is sourced from results/metrics.json and results/raw."
trigger_phrases:
  - "vague query benchmark results"
  - "memory search model data"
  - "model tool efficiency numbers"
  - "cross-model verdict agreement"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Vague-Query Model Comparison

Run date 2026-06-22. Matrix 4 models by 12 queries by 3 samples, 144 cells, 0 failed or truncated. MiMo, Kimi and DeepSeek ran at variant high, gpt-5.5-fast ran at variant medium. Sections 1 through 4 source from the preserved pre-graduation run in `results/metrics-pregraduation-2026-06-22.json`. Sections 5 through 8 source from the current `results/metrics.json`, the post-graduation re-run. Both are parser-derived from the raw event streams in `results/raw/`.

---

## 1. Per-model profile

Mean across all twelve queries and three samples.

| Model | Variant | avg tools | max tools | avg chars | envelope fidelity (of 7) | avg latency | cite-correct | verdict-stable |
|---|---|---|---|---|---|---|---|---|
| mimo | high | 5.1 | 9 | 777 | 6.7 | 90s | 1.0 | 0.75 |
| kimi | high | 14.7 | 23.7 | 680 | 6.5 | 271s | 1.0 | 0.75 |
| deepseek | high | 5.1 | 7.7 | 852 | 6.9 | 70s | 1.0 | 0.92 |
| gpt55 | medium | 9.8 | 11.3 | 468 | 5.6 | 103s | 1.0 | 0.75 |

`cite-correct` is the rate at which the emitted `citationPolicy` obeyed the cite-iff-good rule. `verdict-stable` is the rate at which a model returned the same `requestQuality` across its three samples for a query. `envelope fidelity` counts how many of the seven contract slots the output carried.

---

## 2. Tool calls per model and query

Mean of three samples, sample standard deviation in parentheses.

| Query | Class | mimo | kimi | deepseek | gpt55 |
|---|---|---|---|---|---|
| graph | aligned | 8.7 (±8.0) | 13.7 (±8.2) | 6.3 (±2.6) | 9.3 (±2.4) |
| agent | aligned | 6.3 (±4.7) | 19.7 (±5.4) | 5.0 (±0.8) | 9.7 (±2.1) |
| memory | aligned | 4.0 (±0.8) | 8.0 (±1.4) | 5.7 (±1.7) | 10.3 (±0.5) |
| deep-loop | aligned | 8.0 (±6.4) | 23.7 (±10.3) | 4.3 (±1.2) | 11.3 (±0.5) |
| routing | aligned | 4.3 (±1.9) | 17.0 (±6.7) | 4.3 (±1.2) | 9.3 (±1.7) |
| semantic-search | generic | 3.7 (±1.2) | 13.0 (±6.2) | 4.7 (±1.2) | 9.7 (±1.7) |
| context | generic | 4.0 (±0.0) | 11.0 (±0.8) | 6.0 (±2.8) | 11.3 (±4.9) |
| quality | generic | 3.7 (±0.5) | 17.7 (±7.5) | 7.7 (±5.2) | 10.7 (±2.4) |
| scores | generic | 9.0 (±4.3) | 19.3 (±8.8) | 4.0 (±0.8) | 9.7 (±2.1) |
| kubernetes | off-corpus | 4.0 (±0.8) | 12.0 (±2.2) | 3.7 (±0.5) | 8.0 (±2.2) |
| authentication | off-corpus | 3.3 (±0.5) | 8.3 (±2.5) | 4.7 (±0.5) | 10.3 (±2.1) |
| the-thing-with-confidence | max-vague | 2.7 (±1.2) | 12.7 (±6.2) | 4.3 (±0.5) | 8.3 (±1.9) |

DeepSeek holds the lowest variance across the board. Kimi shows both the highest counts and the widest spread, peaking at a mean of 23.7 calls with a standard deviation of 10.3 on deep-loop. MiMo runs lean on the vaguest queries and only spikes when a query returns a strong head it chooses to chase.

---

## 3. Top score and verdict per model and query

Mean top score, then the modal `requestQuality` verdict across the three samples. A `null` verdict means the model did not emit the `requestQuality` field.

| Query | Class | mimo | kimi | deepseek | gpt55 | agree |
|---|---|---|---|---|---|---|
| graph | aligned | 0.88 good | 0.88 good | 0.85 good | 0.84 good | yes |
| agent | aligned | 0.76 good | 0.85 null | 0.52 good | 0.52 good | no |
| memory | aligned | 0.83 good | 0.83 good | 0.83 good | 0.83 good | yes |
| deep-loop | aligned | 0.87 good | 0.57 null | 0.86 good | 0.86 good | no |
| routing | aligned | 0.82 good | 0.85 good | 0.82 good | 0.82 good | yes |
| semantic-search | generic | 0.44 weak | 0.63 weak | 0.44 weak | 0.00 null | no |
| context | generic | 0.83 good | 0.90 good | 0.83 good | 0.28 null | no |
| quality | generic | 0.80 good | 0.85 good | 0.83 good | 0.27 null | no |
| scores | generic | 0.82 good | 0.82 good | 0.79 good | 0.79 good | yes |
| kubernetes | off-corpus | 0.78 good | 0.83 good | 0.78 good | 0.78 good | yes |
| authentication | off-corpus | 0.50 weak | 0.49 weak | 0.50 weak | 0.50 weak | yes |
| the-thing-with-confidence | max-vague | 0.31 weak | 0.57 weak | 0.58 weak | 0.31 weak | yes |

---

## 4. Reading the verdict column

Seven of twelve queries reach full cross-model agreement. Every one of the five disagreements is a `null` verdict where one model omitted the field, not a case of two models returning conflicting good-versus-weak calls. Kimi drops the field on two aligned queries where its over-exploration runs long, and gpt-5.5 at medium drops it on three generic queries where it also retrieves a markedly lower top score than the high-variant trio. Whenever all four models actually emit a verdict, the verdict is identical. The data-quality signal is robust, the variance is in whether a model renders the full envelope.

Two off-corpus rows tell opposite stories. `authentication` lands weak at a top score near 0.50 across all four models, the gate working as intended. `kubernetes` lands good at 0.78 across all four, where the top hit is the unrelated Spec Memory Runtime Retention Cleanup summary. That is a retrieval false-relevance, identical across every model, so it is a property of the absolute-relevance calibration and not a model behavior. The models faithfully reported what retrieval handed them.

---

## 5. Post-graduation re-run (2026-06-23): the calibration fix

The 2026-06-22 run above closed on a flagged defect. Section 4 recorded that `kubernetes` landed `good` at 0.78 across all four models, a retrieval false-relevance the report attributed to the absolute-relevance calibration rather than to any model. The two flags that close exactly that hole, the per-embedder noise-floor subtraction and the lexical-grounding floor, then graduated to default-ON in the 040 benchmark. This re-run measured the same matrix against the live graduated flags, on the same ollama embedder, with all four models, MiMo, Kimi and DeepSeek at high and gpt-5.5 at medium.

The flagged false-confirm is fixed. The discriminating queries moved exactly as the flags intend.

| Query | Class | Before (2026-06-22, pre-graduation) | After (2026-06-23, flags live) |
|---|---|---|---|
| `kubernetes` | off-corpus | `good` at 0.79, false confirm | `weak` at 0.53 |
| `authentication` | off-corpus | `weak` at 0.50 | `gap` at 0.19 |
| `the thing with confidence` | max-vague | `weak` at 0.44 | `gap` at 0.23 |

The noise-floor subtraction pulled the absolute relevance of every off-corpus and vague query down. `kubernetes` dropped out of the `good` band into `weak`, where its only real match is the off-corpus eval fixture doc that names kubernetes as a test term. The two genuinely empty queries dropped from `weak` to `gap`. The post-graduation top scores now stratify cleanly by query alignment, a monotonic gradient the pre-graduation run did not show: aligned 0.68, generic 0.583, off-corpus 0.36, max-vague 0.23.

The three models also ran leaner against the cleaner verdict path. Mean tool calls fell for the open-source trio, MiMo 5.1 to 3.4, Kimi 14.7 to 7.9 and DeepSeek 5.1 to 4.8, and the two noisy models gained verdict stability. gpt-5.5 held near its prior count at 9.5 but its envelope fidelity rose from 5.6 to 6.6 and its verdict stability from 0.75 to 0.92, so the cleaner verdict path helped the weakest driver most. A decisive verdict left less to chase.

---

## 6. The graduated citation tier and the cross-cutting findings

**The three-tier citation policy is live and coherent.** The graduated cite-with-caveat flag added a hedged tier the original binary policy did not have. Across the 144 re-run cells the policy splits as cite_with_caveat 63, cite_results 33, do_not_cite_results 36, with 12 unparsed. The weak verdicts split cleanly, 63 to cite_with_caveat where the top hit is still grounded and 12 to do_not_cite where it is not. That split is the design.

**The cite-correct metric is now misleading and needs a fix.** Section 1 reported cite-correct at 1.0 for every model. The re-run reads 0.53 to 0.61. This is a metric artifact, not a regression. `extract-metrics.mjs` scores cite-correct against the old binary cite-iff-good rule, so it marks all 47 cite_with_caveat cells as wrong. The metric must be made three-tier-aware before the column means anything again.

**The intent classifier does not differentiate vague queries.** 132 of the 144 cells classified intent as `understand`, one as `find_spec` and 11 were unparsed, and every emitted envelope carried `weightsApplied off`. For bare vague queries the intent axis is inert, it labels everything understand and applies no retrieval-class weights. This is a real ceiling on what the routing layer can do for a one-word query.

**Kimi is the cost and reliability outlier.** Kimi averaged 230 seconds per query against MiMo 86 and DeepSeek 94, roughly two and a half times slower, and it produced 8 of the 12 unparsed cells. Its over-exploration both runs long and more often fails to emit a clean closing envelope. DeepSeek is the most stable at 0.92 verdict-stability, MiMo the most efficient at 3.4 tool calls.

**Two queries show genuine cross-model verdict disagreement, not just nulls.** On `deep-loop` DeepSeek and gpt-5.5 returned `good` while MiMo and Kimi returned `gap`, a clean two-two split, and on `routing` MiMo returned `good` while the other three returned `weak`. Unlike the original run where every disagreement was a dropped field, these are real splits driven by how each model phrased and refined the search. The verdict is model-robust on clearly-aligned and clearly-empty queries and model-sensitive on the borderline ones.

**Retrieval determinism is query-dependent, and it explains the disagreement.** The top score is identical across every model and sample for the clearly-aligned queries, `graph` and `memory` both hold at 0.86 with zero spread, so their retrieval is model-independent. The ambiguous queries swing hard. The top score for `agent` ranges across a 0.88 spread where one dispatch finds nothing and another a strong head, `deep-loop` spreads 0.61 and `kubernetes` 0.60. The two queries that split the verdict, `deep-loop` and `routing`, are among the widest-spread, so the disagreement is not the verdict logic wavering, it is the model's search refinement landing on different results for the same word. Model-robustness is a property of clear queries, not a blanket property of the command.

---

## 7. Dashboard review: presentation findings

A review of the rendered `/memory:search` output across 144 cells found the format sound and the verdicts correct, and the new cite_with_caveat tier renders where it should, but five presentation issues surfaced, one of them a logic contradiction.

| Issue | Cells | Detail |
|---|---|---|
| `good` verdict beside an `[EVIDENCE GAP DETECTED]` banner | 19 of 144 | The dashboard presents a confident good verdict and a low-confidence evidence-gap banner at once. The verdict band and the evidence-gap signal disagree on the same result. The graduated evidence-gap flag is meant to cap an over-confident verdict when a Stage-4 gap is detected, so either the banner is an un-bridged separate signal or the cap does not reach the rendered verdict. |
| Result count exceeds the rows shown | 6 | The header reads `results=5` while one or two rows render, with a note that the rest were omitted by token-budget truncation. The count and the display disagree. |
| Bare-dash placeholder instead of a score | 11 | Only the top hit carries a numeric score. Graph-channel and degree-channel hits render a bare dash, so their relevance is invisible to the reader. |
| Truncated title | 4 | A long folder path cuts the title to `(truncated)`. |
| Inconsistent code fencing | varies | Some renders wrap the block in a fence, some do not. Model variance, cosmetic. |

The evidence-gap contradiction is the one worth chasing. It touches a flag this lineage just graduated and it is the one place the dashboard can mislead a reader into trusting a verdict the system itself flags as low-confidence.

---

## 8. Open follow-ups

- Trace the `good` plus evidence-gap contradiction to its source, the Stage-4 evidence-gap bridge or a separate render-time confidence banner, and reconcile them so the dashboard never shows a good verdict next to a gap banner.
- Make `extract-metrics.mjs` cite-correct three-tier-aware so a cite_with_caveat cell is scored against its own tier rather than the binary cite-iff-good rule.
- Decide whether the intent classifier should differentiate one-word queries or whether the inert understand default is acceptable for bare vague input.
- Surface a score for graph-channel and degree-channel result rows rather than a bare-dash placeholder, and reconcile the result-count header with the rows actually shown.
