# Iteration 8: Verify Pi’s built-in cache surface

## Focus

Inspect provider-model compatibility and usage telemetry documented by Pi.

## Findings

- Pi model compatibility exposes `supportsLongCacheRetention`, `supportsCacheControlOnTools`, and `sendSessionAffinityHeaders`; these are concrete provider-specific cache controls, not a single provider-neutral algorithm. [SOURCE: https://pi.dev/docs/latest/models]
- Pi’s normalized usage model includes uncached input, `cacheRead`, and `cacheWrite`, enabling per-message and session accounting when providers report those values. [SOURCE: https://pi.dev/docs/latest/rpc]
- Pi 0.79+ includes a built-in footer cache-hit marker according to the published optimizer package, while the extension adds persisted aggregates and diagnostics. [SOURCE: https://pi.dev/packages/pi-cache-optimizer]
- Verdict: built-in provider-aware caching support and cache telemetry are verified; the claim of a monolithic built-in “prompt-caching layer” that independently caches all static context is too broad.

## Sources Consulted

- `https://pi.dev/docs/latest/models`
- `https://pi.dev/docs/latest/rpc`
- `https://pi.dev/packages/pi-cache-optimizer`

## Assessment

- newInfoRatio: 0.62
- Novelty justification: Identifies the actual Pi knobs and separates normalized telemetry from cache ownership.
- Confidence: High.

## Reflection

- Worked: Model and RPC documentation provides contract-level evidence.
- Failed/ruled out: Describing Pi as maintaining a local cross-provider KV cache is ruled out.

## Recommended Next Focus

Compare Anthropic’s explicit cache-control model with DeepSeek automatic caching.
