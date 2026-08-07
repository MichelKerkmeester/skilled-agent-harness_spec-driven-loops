# Iteration 3: Audit Reasonix quantitative claims

## Focus

Determine what the 99.82% hit rate and $61→$12 cost comparison actually prove.

## Findings

- The Reasonix project publishes a dated single-day user report: 435M input tokens, 99.82% cache hit, approximately $12 versus an estimated $61 uncached on `v4-flash`. [SOURCE: https://github.com/esengine/DeepSeek-Reasonix]
- The source is a project-hosted user case, not an independent benchmark. The public claim lacks provider billing exports, raw per-request usage, cache-warmup details, and a replay harness sufficient to reproduce the result.
- The hit-rate denominator is documented by the v1 architecture as `prompt_cache_hit_tokens / (hit + miss)`, which is a token-weighted rate rather than the percentage of requests that hit. [SOURCE: https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md]
- Verdict: “reported 99.82%” and “reported $61→$12” are verified as project-published claims; the corresponding general performance guarantee remains unknown.

## Sources Consulted

- `https://github.com/esengine/DeepSeek-Reasonix`
- `https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md`

## Assessment

- newInfoRatio: 0.80
- Novelty justification: Establishes the source class, metric denominator, and reproducibility limits.
- Confidence: High for provenance; low for independent reproducibility.

## Reflection

- Worked: Separating “published” from “independently verified” yields a precise verdict.
- Failed/ruled out: Secondary articles repeating the same numbers are not independent confirmations.

## Recommended Next Focus

Check whether the cost arithmetic is plausible under provider cache pricing.
