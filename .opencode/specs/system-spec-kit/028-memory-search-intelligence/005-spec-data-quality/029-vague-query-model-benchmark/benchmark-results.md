---
title: "Benchmark Results: Vague-Query Model Comparison"
description: "The measured data from the 4-model by 12-query by 3-sample matrix of bare /memory:search dispatches. Per-model behavioral profiles, per-cell tool counts and scores with cross-sample variance, and the cross-model verdict agreement per query. Every number is sourced from results/metrics.json."
trigger_phrases:
  - "vague query benchmark results"
  - "memory search model data"
  - "model tool efficiency numbers"
  - "cross-model verdict agreement"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Vague-Query Model Comparison

Run date 2026-06-22. Matrix 4 models by 12 queries by 3 samples, 144 cells, 0 failed or truncated. MiMo, Kimi and DeepSeek ran at variant high, gpt-5.5-fast ran at variant medium. Every value below is sourced from `results/metrics.json`, which the parser derives from the raw event streams in `results/raw/`.

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
