# Iteration 4: Verify DeepSeek cache semantics

## Focus

Establish the official provider contract a Reasonix-style client can optimize against, including matching, units, expiration, and telemetry.

## Findings

- DeepSeek prompt caching is enabled by default and requires no API-side cache-control request. A later request benefits when its prompt begins with the same cached prefix; changing an earlier prefix prevents reuse beyond the common prefix. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]
- DeepSeek describes caching in fixed token units and reports hit and miss token counts in the response usage object. This makes cache optimization an ordering and serialization problem at the request boundary, not a promise that an extension can force a hit. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]
- The official guide describes the cache as best effort: cached content can expire or be evicted, and the provider does not guarantee a 100% hit rate. This is the operational caveat missing from the absolute tone of `lumo.md`'s savings discussion. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]
- The safe plugin invariant is therefore “keep stable material first and measure the returned counters.” It is not “pin the cache,” “share KV state,” or “guarantee 70–90% savings.” [INFERENCE: https://api-docs.deepseek.com/guides/kv_cache]

## Ruled Out

- A plugin-level guarantee of cache persistence or a 100% hit rate is ruled out by DeepSeek's best-effort eviction contract.

## Dead Ends

- Treating cache keys as an API-controlled object is a dead end for native DeepSeek caching; the documented interface is the serialized prompt plus response usage counters.

## Questions Remaining

- Which Pi provider adapters already serialize stable prefixes and expose retention settings?
- Which providers use different cache-control mechanisms from DeepSeek?

## Sources Consulted

- `https://api-docs.deepseek.com/guides/kv_cache`
- `https://api-docs.deepseek.com/news/news0802/`
- `.opencode/specs/cli-external-orchestration/039-pi-caching-like-reasonix/lumo.md:50-64`

## Assessment

- newInfoRatio: 0.74
- Novelty justification: The provider contract turns the earlier architectural inference into explicit implementation constraints and removes the possibility of cache guarantees.
- Confidence: High for DeepSeek semantics; low for behavior behind proxies that may add routing or caching layers.

## Reflection

- What worked and why: The official guide provides concrete A+B versus A+B+C examples and usage fields instead of relying on marketing language.
- What did not work and why: Provider eviction and routing behavior cannot be established from client documentation alone.
- What I would do differently: Record response headers and provider/model identity in any benchmark harness.

## Recommended Next Focus

Audit Pi's built-in provider configuration and extension hooks for prompt-cache retention, cache-control markers, session affinity, and payload inspection.

