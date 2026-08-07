# Iteration 6: Compare Anthropic prompt caching

## Focus

Determine how Anthropic's cache markers and retention windows differ from DeepSeek's implicit prefix cache and what Pi already maps for them.

## Findings

- Anthropic prompt caching is explicitly marked with `cache_control` breakpoints and has distinct cache-write and cache-read accounting. The official pricing documentation describes 5-minute and 1-hour durations, with cache reads priced below ordinary input. [SOURCE: https://docs.anthropic.com/en/docs/about-claude/pricing]
- Pi's model compatibility layer exposes `cacheControlFormat: "anthropic"` and places Anthropic-style markers on the system prompt, the last tool definition, and the last relevant content block. It also exposes long-retention behavior through the model configuration and `PI_CACHE_RETENTION`. [SOURCE: https://pi.dev/docs/latest/models; https://pi.dev/docs/latest/environment-variables]
- The Anthropic path is not equivalent to DeepSeek's exact common-prefix rule. A plugin that blindly reorders or rewrites messages to optimize DeepSeek could move cache breakpoints or change the intended TTL semantics for Anthropic. [INFERENCE: https://api-docs.deepseek.com/guides/kv_cache; https://pi.dev/docs/latest/models]
- A feasible cross-provider plugin should record provider-specific cache mode and counters, then apply only the provider's existing retention/marker configuration. It should not normalize all providers to a single “cache key” abstraction. [INFERENCE: https://pi.dev/docs/latest/models; https://docs.anthropic.com/en/docs/about-claude/pricing]

## Ruled Out

- Treating Anthropic `cache_control` and DeepSeek implicit prefix reuse as interchangeable mechanisms is ruled out.

## Dead Ends

- A generic TTL field independent of provider adapter configuration would conceal billing and expiration differences rather than solve them.

## Questions Remaining

- What provider-level identity and affinity controls does Pi expose for OpenAI-compatible caches?
- Does the existing community optimizer implement these provider distinctions or flatten them?

## Sources Consulted

- `https://docs.anthropic.com/en/docs/about-claude/pricing`
- `https://pi.dev/docs/latest/models`
- `https://pi.dev/docs/latest/environment-variables`
- `https://api-docs.deepseek.com/guides/kv_cache`

## Assessment

- newInfoRatio: 0.68
- Novelty justification: The provider comparison identifies a second cache contract and prevents the proposed plugin from treating DeepSeek behavior as universal.
- Confidence: High for documented marker and retention fields; medium for how custom proxies translate them.

## Reflection

- What worked and why: Provider docs plus Pi's compatibility table exposed the exact adapter boundary.
- What did not work and why: No common provider-neutral cache API is documented.
- What I would do differently: Capture serialized requests for both providers before enabling any automatic reordering.

## Recommended Next Focus

Verify OpenAI-compatible prompt-cache keys, retention, usage counters, and Pi's session-affinity behavior.

