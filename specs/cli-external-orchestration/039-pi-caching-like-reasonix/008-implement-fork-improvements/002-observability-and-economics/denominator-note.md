# Cache Hit-Rate Denominator Note

The two forks expose different token denominators. Their percentages must not be combined directly.

DeepPi computes its rate in `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts` as:

```text
hitTokens / (hitTokens + missTokens)
```

`cacheWriteTokens` is tracked separately and excluded from this denominator.

The pi-cache-optimizer fork reconstructs total input as `input + cacheRead + cacheWrite` in `.pi/extensions/pi-cache-optimizer/index.ts:2159-2167`, then renders `cachedInputTokens / totalInputTokens` at `index.ts:3663-3667`. Its denominator therefore includes cache-write tokens.

These are different measures. A combined comparison requires normalizing both forks to the same token population first; this phase deliberately does not reconcile or rewrite either denominator.
