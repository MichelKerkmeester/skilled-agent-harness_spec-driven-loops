# Iteration 7: Audit OpenAI-compatible cache identity

## Focus

Verify the cache-key, retention, and usage controls available through OpenAI-compatible providers and their Pi adapter configuration.

## Findings

- OpenAI documents `prompt_cache_key` as a stable identifier used to improve cache-hit rates, `prompt_cache_retention` for extended retention up to 24 hours, and `cached_tokens` in usage. These controls are provider semantics, not a client-side map of prompt text to KV tensors. [SOURCE: https://platform.openai.com/docs/api-reference/responses-streaming/response/refusal/delta]
- Pi's model configuration includes `sendSessionAffinityHeaders` for OpenAI-compatible APIs and says the default is false. This can help a gateway route requests consistently, but it does not guarantee that a provider accepts or honors the header. [SOURCE: https://pi.dev/docs/latest/models]
- Pi also documents provider-specific session affinity for Cloudflare Workers AI. The existence of that adapter behavior reinforces that routing affinity is integration-specific rather than a universal Pi cache guarantee. [SOURCE: https://pi.dev/docs/latest/providers]
- A Reasonix-style Pi plugin could choose a deterministic cache namespace per project/session and expose it as an opt-in setting, but automatic cross-agent sharing would risk cross-task contamination unless the stable prefix and model/provider identity are part of the namespace. [INFERENCE: https://platform.openai.com/docs/api-reference/responses-streaming/response/refusal/delta; https://pi.dev/docs/latest/models]

## Ruled Out

- Assuming that one `prompt_cache_key` works across providers, models, or proxies is ruled out; the key is defined by the OpenAI-compatible API and Pi only forwards provider-specific configuration.

## Dead Ends

- Treating session affinity as evidence of cache sharing is a dead end. Affinity affects routing and may improve locality, but cache reuse still depends on the serialized prompt and provider policy.

## Questions Remaining

- Does `pi-cache-optimizer` merely expose these provider controls, or does it add a distinct stable-prefix policy?
- What security and lifecycle boundaries does Pi apply to third-party packages?

## Sources Consulted

- `https://platform.openai.com/docs/api-reference/responses-streaming/response/refusal/delta`
- `https://pi.dev/docs/latest/models`
- `https://pi.dev/docs/latest/providers`

## Assessment

- newInfoRatio: 0.64
- Novelty justification: OpenAI-compatible cache identity adds a provider-specific sharing mechanism and clarifies why affinity is not proof of cache reuse.
- Confidence: High for the documented fields; medium for proxy behavior and any undocumented routing policy.

## Reflection

- What worked and why: Comparing OpenAI's API reference with Pi's compatibility fields made the forwarding boundary concrete.
- What did not work and why: Provider-specific headers cannot be validated without an actual gateway or model request.
- What I would do differently: Make cache namespace and provider/model identity visible in diagnostics before enabling sharing.

## Recommended Next Focus

Audit the identity, ownership, and behavior of the `pi-cache-optimizer` package against the “official” and feature claims in `lumo.md`.

