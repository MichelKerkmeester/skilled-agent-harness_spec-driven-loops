# Iteration 5: Establish DeepSeek cache semantics

## Focus

Identify provider guarantees, best-effort behavior, and client-controllable levers.

## Findings

- DeepSeek caching is enabled by default; clients do not need cache-control directives. Subsequent requests can reuse overlapping prefixes that have already been persisted. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]
- The cache operates on complete persisted prefix units. Matching arbitrary repeated material in the middle of a request does not qualify. [SOURCE: https://api-docs.deepseek.com/news/news0802/]
- Cache construction takes time, entries may be cleared within hours to days, and the service explicitly does not guarantee 100% hits. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]
- Therefore a Pi extension cannot “implement DeepSeek caching.” It can only stabilize serialized prefixes, avoid needless churn, preserve session affinity where intermediaries support it, and expose usage telemetry.

## Sources Consulted

- `https://api-docs.deepseek.com/guides/kv_cache`
- `https://api-docs.deepseek.com/news/news0802/`

## Assessment

- newInfoRatio: 0.69
- Novelty justification: Converts the high-level caching claim into a provider/client responsibility boundary.
- Confidence: High.

## Reflection

- Worked: Official provider documentation clearly separates automatic server caching from client-side prefix discipline.
- Failed/ruled out: A local extension owning or resetting the upstream KV cache is ruled out.

## Recommended Next Focus

Map Reasonix’s cache-first loop onto these provider semantics.
