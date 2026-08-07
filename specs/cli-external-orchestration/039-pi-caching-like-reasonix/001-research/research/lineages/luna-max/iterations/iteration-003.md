# Iteration 3: Audit the Reasonix quantitative report

## Focus

Check the published 99.82% hit-rate and $61-to-$12 figures for arithmetic consistency, denominator ambiguity, and reproducibility requirements.

## Findings

- The arithmetic reduction from $61 to $12 is about 80.3% (`1 - 12/61`). That is not the same quantity as a 99.82% cache-hit rate. A hit rate counts tokens or cache units, while total spend also includes cache misses, output tokens, model mix, and any uncached requests. [INFERENCE: https://github.com/esengine/deepseek-reasonix; https://api-docs.deepseek.com/quick_start/pricing-details-usd]
- The Reasonix README gives the 435M-input-token and 99.82% figures as a single user report but does not expose the hit/miss token counters, output-token total, request sequence, model, or baseline run. The report is therefore documented but not independently reproducible from the public artifact. [SOURCE: https://github.com/esengine/deepseek-reasonix]
- DeepSeek exposes `prompt_cache_hit_tokens` and `prompt_cache_miss_tokens` in usage, which is the minimum telemetry needed to recompute a token-level hit ratio. A plugin should preserve these counters per request rather than infer hits from elapsed time or estimated cost. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]
- Current DeepSeek pricing is provider- and model-specific, with separate cache-hit and cache-miss rates. Historical Reasonix prose may have used a different price sheet, so the $61/$12 comparison needs a dated model, price table, and token accounting before it can support a forward-looking savings estimate. [SOURCE: https://api-docs.deepseek.com/quick_start/pricing-details-usd]

## Ruled Out

- Inferring an 80.3% cost saving directly from a 99.82% cache-hit ratio is ruled out; the variables do not match and the published report omits the required ledger.

## Dead Ends

- A web search cannot reconstruct the missing request-level accounting. Only provider usage data or a controlled replay can close that gap.

## Questions Remaining

- What are DeepSeek's exact cache-unit and eviction semantics?
- Does Pi surface provider usage and cache counters without an extension rewrite?

## Sources Consulted

- `https://github.com/esengine/deepseek-reasonix`
- `https://api-docs.deepseek.com/guides/kv_cache`
- `https://api-docs.deepseek.com/quick_start/pricing-details-usd`

## Assessment

- newInfoRatio: 0.78
- Novelty justification: The numbers are arithmetically separated and the missing evidence needed for reproduction is explicit.
- Confidence: High for the arithmetic and telemetry requirement; medium for historical-price interpretation because the report's date and exact model configuration are not fully specified.

## Reflection

- What worked and why: Recasting the claim as a token-and-cost ledger prevented the hit-rate percentage from being treated as a savings percentage.
- What did not work and why: Public documentation does not include the raw usage ledger behind the reported day.
- What I would do differently: Use a fixed model and archived price sheet for any future reproduction.

## Recommended Next Focus

Verify DeepSeek's official cache semantics: exact-prefix matching, cache units, expiration, and best-effort behavior.

