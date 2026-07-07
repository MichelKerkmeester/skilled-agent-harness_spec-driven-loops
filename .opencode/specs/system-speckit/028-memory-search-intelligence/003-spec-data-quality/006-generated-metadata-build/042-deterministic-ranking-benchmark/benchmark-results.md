---
title: "Benchmark Results: Deterministic-Ranking Flag Graduation"
description: "Measures whether SPECKIT_DETERMINISTIC_RANKING (Fix 5) can graduate to default-on. Flag-ON ranking is perfectly reproducible (determinism 1.0), but removing the wall-clock recency inputs diverges materially from the current default on 5 of 12 queries (mean top-K overlap 0.69, Kendall tau 0.73). Recency is load-bearing on real-match queries, so the flag stays default-off and remains an opt-in reproducibility tool."
trigger_phrases:
  - "deterministic ranking benchmark"
  - "should the determinism flag graduate"
  - "recency load-bearing ranking"
  - "SPECKIT_DETERMINISTIC_RANKING graduation"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Deterministic-Ranking Flag Graduation

## Question
Can `SPECKIT_DETERMINISTIC_RANKING` (the Fix 5 flag, currently default-off) graduate to default-on? The flag removes the wall-clock recency inputs from ranking (vector decay `useDecay=false`, Stage-2 recency zeroed) so a fixed query is reproducible. Graduating it means making deterministic ranking the production default, which only earns its place if it both delivers reproducibility and does not meaningfully change the ranking users get today.

## Method
- **Corpus:** the real live memory DB, 17,599 indexed rows, read-only backup, active embedder `nomic-embed-text-v1.5`. Every row carries populated `created_at` / `last_review` / `updated_at` (2026-06-04 to 2026-06-23), so the flag-off runs genuinely exercise the recency and decay terms the flag removes.
- **Path:** the production `executePipeline` (Stage 1 vector decay and Stage 2 recency both fire). Each query is embedded once and the embedding is reused across all runs, so only ranking, not embedding, varies.
- **Cells:** the 12 vague-query benchmark queries, each run flag-OFF x3 and flag-ON x3 (72 pipeline calls).
- **Metrics:** determinism (distinct ordered-id digests across the 3 runs, 1 = perfectly reproducible), and the off-vs-on divergence (top-10 Jaccard overlap, Kendall tau on shared ids, mean composite-score delta).

## Results

| Metric | Value | Reading |
|--------|-------|---------|
| mean determinism (ON) | **1.0** | flag-ON is perfectly reproducible, 12/12, stable across separate process invocations |
| mean determinism (OFF, control) | 1.0 | over a tight window `julianday('now')` barely advances, so OFF is also stable here |
| mean top-K overlap (OFF vs ON) | **0.686** | only ~69% of the top-10 survives the recency removal |
| mean Kendall tau (OFF vs ON) | **0.731** | moderate rank correlation, well below a 0.95 graduation bar |
| mean score delta | 0.0047 | the absolute score moves are tiny, the reordering is what matters |
| material divergence (overlap < 0.8) | **5 / 12** | `agent`, `deep-loop`, `routing`, `semantic-search`, `quality` |

### Per-query
| query | class | det_on | overlap | tau | diverged |
|-------|-------|--------|---------|-----|----------|
| graph | aligned | 1 | 0.818 | 0.889 | no |
| agent | aligned | 1 | 0.176 | 0.333 | YES |
| memory | aligned | 1 | 1.000 | 1.000 | no |
| deep-loop | aligned | 1 | 0.176 | 0.333 | YES |
| routing | aligned | 1 | 0.429 | 0.733 | YES |
| semantic-search | generic | 1 | 0.667 | 1.000 | YES |
| context | generic | 1 | 1.000 | 1.000 | no |
| quality | generic | 1 | 0.333 | -0.400 | YES |
| scores | generic | 1 | 0.818 | 0.889 | no |
| kubernetes | off-corpus | 1 | 1.000 | 1.000 | no |
| authentication | off-corpus | 1 | 0.818 | 1.000 | no |
| the-thing-with-confidence | max-vague | 1 | 1.000 | 1.000 | no |

## Verdict: STAY DEFAULT-OFF (do not graduate)

The flag passes the reproducibility test but fails the no-harm test.

- **It works.** Flag-ON ranking is perfectly reproducible (determinism 1.0 within a run and across invocations). For benchmark or audit re-runs that need bit-identical results, the flag is the right tool.
- **But recency is load-bearing.** On corpus-aligned and generic queries with strong matches, removing recency reorders a large share of the top-10: `agent` and `deep-loop` keep only ~18% of their top-10, `quality` flips to a negative rank correlation. Five of twelve queries diverge past the 0.8 overlap bar, and the mean Kendall tau of 0.73 is far below a 0.95 graduation threshold.
- **No evidence the deterministic order is better.** There is no labeled ground-truth in the corpus, so the benchmark can show the ranking changes but not that it improves. Defaulting to deterministic ranking would therefore trade away an intended recency behavior on roughly 40% of queries for a reproducibility guarantee that production search does not need.

Off-corpus and maximally-vague queries (`kubernetes`, `authentication`, `the-thing-with-confidence`) show zero divergence, which makes sense: with no strong semantic match there is nothing for recency to tip. The divergence is concentrated exactly where the corpus has real, competing matches, which is where recency is doing useful work.

## Recommendation
- Keep `SPECKIT_DETERMINISTIC_RANKING` default-off.
- Keep it available as an opt-in for reproducible benchmark and audit runs (set it to `true` when bit-identical re-runs matter).
- The always-on trigger id tie-break that shipped with the flag is the pure-win part and needs no flag, it improves ordering stability without removing recency.
- A future graduation would need a labeled-relevance benchmark showing deterministic ranking does not lose relevant results, not just a reproducibility argument.

## Reproduce
`node scripts/deterministic-ranking-benchmark.mjs` rebuilds `results/metrics.json` from the live corpus, exit 0, byte-identical flag-ON orderings across runs.
