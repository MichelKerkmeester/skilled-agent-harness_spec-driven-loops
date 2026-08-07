# Iteration 17: Stress invalidation and failure modes

## Focus

Identify conditions where an automatic cache optimizer can reduce correctness or silently misreport savings.

## Findings

- DeepSeek cache reuse is exact-prefix and best effort; any earlier prompt change, eviction, or provider route change can reduce hits. The plugin must treat a prefix fingerprint change as an invalidation event and never claim that the old generation remains warm. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]
- Anthropic cache breakpoints and TTL ordering are provider-specific. The community optimizer documents downgrade/fallback behavior for invalid short-to-long transitions and warns that proxies may insert hidden breakpoints. Automatic payload repair is therefore a compatibility policy with a provider-specific failure path, not a universal rewrite. [SOURCE: https://github.com/jiangge/pi-cache-optimizer; https://pi.dev/docs/latest/models]
- OpenAI-compatible proxies can route a session across upstream backends or reject unsupported `prompt_cache_retention`; Pi exposes explicit compatibility flags for these cases. A plugin should fail open—preserve the request and emit a warning—when capability is unknown, rather than inject parameters optimistically. [SOURCE: https://pi.dev/docs/latest/models; https://github.com/jiangge/pi-cache-optimizer]
- Compaction, branch navigation, model switching, and concurrent namespace changes are lifecycle invalidations. A plugin that rewrites prompts without tracking these boundaries can produce false attribution, cross-task sharing, or a cache miss loop. [INFERENCE: https://pi.dev/docs/latest/compaction; https://pi.dev/docs/latest/sessions]

## Ruled Out

- Silent automatic mutation of unsupported provider payloads is ruled out as a safe default.
- Treating a cache miss as a correctness failure is ruled out; misses are normal provider behavior and must remain observable without blocking the request.

## Dead Ends

- Retrying every miss with a modified payload is a dead end: it can double cost and alter model behavior while still not guaranteeing a cache hit.

## Questions Remaining

- Which capabilities should be opt-in versus safe by default?
- What is the smallest persistence format for invalidation and provider diagnostics?

## Sources Consulted

- `https://api-docs.deepseek.com/guides/kv_cache`
- `https://github.com/jiangge/pi-cache-optimizer`
- `https://pi.dev/docs/latest/models`
- `https://pi.dev/docs/latest/compaction`
- `https://pi.dev/docs/latest/sessions`

## Assessment

- newInfoRatio: 0.35
- Novelty justification: The failure analysis identifies concrete guardrails for prompt mutation, provider capability detection, and lifecycle invalidation.
- Confidence: High for the documented provider caveats; medium for behavior behind arbitrary proxies.

## Reflection

- What worked and why: Provider compatibility docs and the existing package's warnings expose real failure modes rather than hypothetical abstractions.
- What did not work and why: Proxy behavior remains unobservable until a real endpoint is exercised.
- What I would do differently: Make “diagnose only” the default and require explicit opt-in for prompt rewrites and cross-session namespaces.

## Recommended Next Focus

Assemble the minimum plugin architecture from the verified extension hooks, provider controls, usage counters, namespaces, and invalidation events.

