# Iteration 9: Test Pi extension-hook feasibility

## Focus

Map the smallest cache-observability and stable-prefix policy to Pi's documented extension lifecycle, while recording the boundaries that prevent a raw cache implementation.

## Findings

- `before_agent_start` exposes structured system-prompt inputs, including selected tools, tool snippets, context files, and skills. A plugin can use this to identify stable versus volatile inputs without rediscovering Pi's resource loader state. [SOURCE: https://pi.dev/docs/latest/extensions]
- `before_provider_request` fires after Pi builds a provider-specific payload and can inspect or replace that payload. This is sufficient for payload fingerprinting, provider-specific diagnostics, and narrowly scoped policy checks; it also means a plugin can accidentally diverge from `ctx.getSystemPrompt()` if it rewrites the payload. [SOURCE: https://pi.dev/docs/latest/extensions]
- `before_provider_headers` can add or override headers, while `after_provider_response` can inspect response status and headers before the stream is consumed. These hooks support routing and timing diagnostics, but the public hook contract does not promise a normalized response-usage object across providers. [SOURCE: https://pi.dev/docs/latest/extensions]
- The documented extension surface has no raw provider KV-cache handle. The smallest safe plugin is therefore a policy/observability layer: stable-prefix checks, request fingerprints, opt-in affinity configuration, and provider-specific hit/miss reporting where the payload or response exposes it. [INFERENCE: https://pi.dev/docs/latest/extensions; https://api-docs.deepseek.com/guides/kv_cache]

## Ruled Out

- Implementing a client-side KV cache through ordinary Pi extension hooks is ruled out; the hooks operate on prompts, payloads, headers, and responses, not model-internal tensors.

## Dead Ends

- Logging complete prompts as cache keys is a privacy and storage dead end. A production plugin should hash or structurally summarize stable sections and make raw logging opt-in.

## Questions Remaining

- How should session persistence, branching, and compaction interact with stable-prefix fingerprints?
- Can concurrent Pi agents safely share an affinity namespace?

## Sources Consulted

- `https://pi.dev/docs/latest/extensions`
- `https://pi.dev/docs/latest/rpc`
- `https://api-docs.deepseek.com/guides/kv_cache`

## Assessment

- newInfoRatio: 0.58
- Novelty justification: The extension lifecycle gives a concrete feasible boundary and excludes raw KV caching from the plugin scope.
- Confidence: High for hook capabilities; medium for provider usage visibility because adapters can differ and the public hook contract is intentionally generic.

## Reflection

- What worked and why: Reading the lifecycle order and mutability rules together clarifies where a cache policy can observe without replacing provider serialization.
- What did not work and why: The generic response hook does not establish one cross-provider hit counter.
- What I would do differently: Build provider-specific adapters only after collecting actual payload and usage examples.

## Recommended Next Focus

Examine Pi sessions, branches, and package claims about concurrent agents sharing cached content; separate namespace design from provider cache guarantees.

