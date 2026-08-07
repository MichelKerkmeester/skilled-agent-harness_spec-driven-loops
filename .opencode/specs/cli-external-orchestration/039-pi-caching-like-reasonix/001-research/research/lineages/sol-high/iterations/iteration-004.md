# Iteration 4: Test the cost arithmetic

## Focus

Assess whether a 99.82% token hit rate could plausibly produce the reported cost ratio.

## Findings

- DeepSeek documents automatic context caching and separately reports cache-hit and cache-miss input tokens. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]
- DeepSeek’s original cache announcement describes cache-hit input pricing as roughly an order of magnitude below miss pricing. [SOURCE: https://api-docs.deepseek.com/news/news0802/]
- With a 99.82% token hit rate and a hit price near 10% of miss price, input cost alone is roughly 10.16% of an all-miss baseline: `0.9982×0.1 + 0.0018×1`. The published $12/$61 ratio is about 19.7%, so output tokens and/or differing period-specific prices can plausibly explain the gap.
- Plausible arithmetic does not establish the workload, baseline, or billing export. The metric remains a project report rather than a reproducible controlled comparison.

## Sources Consulted

- `https://api-docs.deepseek.com/guides/kv_cache`
- `https://api-docs.deepseek.com/news/news0802/`
- `https://github.com/esengine/DeepSeek-Reasonix`

## Assessment

- newInfoRatio: 0.72
- Novelty justification: Independent arithmetic shows internal plausibility while preserving the evidence gap.
- Confidence: Medium-high.

## Reflection

- Worked: A bounded calculation falsifies neither figure and clarifies why hit-rate savings do not map one-to-one to total cost.
- Failed/ruled out: Inferring total cost directly from input hit rate is ruled out.

## Recommended Next Focus

Establish DeepSeek’s exact cache semantics and failure conditions.
