# Iteration 2: Reasonix cache invariants

## Focus

Verify the mechanism behind Reasonix's claimed savings and distinguish hard provider requirements from Reasonix-specific design choices.

## Findings

- Reasonix's architecture document says DeepSeek caching is prefix-based and requires the serialized prefix to remain byte-identical. Agent loops can accidentally reorder messages or inject timestamps, so the project keeps a stable immutable prefix, an append-only log, and volatile scratch. [SOURCE: https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md]
- The official DeepSeek integration note describes Reasonix as a DeepSeek-native, cache-first loop that uses the direct DeepSeek API and a Flash-first strategy. The note supports the product's DeepSeek orientation, not a general Pi-compatible caching protocol. [SOURCE: https://github.com/deepseek-ai/awesome-deepseek-agent/blob/main/docs/reasonix.md]
- Reasonix's public documentation advertises deterministic serialization and long-lived sessions as the means to sustain high cache reuse. Those are application-level context-management policies layered on top of provider caching, not a client-side cache of model KV tensors. [SOURCE: https://reasonix.io/docs/]
- A Pi plugin can reproduce the stable-prefix policy only for the material it controls. It cannot guarantee that provider-side tokenization, cache eviction, model routing, or an upstream proxy will preserve a hit. This is an inference from the provider contract and Reasonix's own invariants. [INFERENCE: https://api-docs.deepseek.com/guides/kv_cache; https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md]

## Ruled Out

- A portable implementation that assumes all providers accept the same cache marker, retention policy, or prefix semantics is ruled out by Reasonix's DeepSeek-specific architecture and Pi's provider-specific configuration fields.

## Dead Ends

- No public Reasonix document exposes a client-side KV store that could be transplanted into Pi; pursuing raw KV reuse would exceed the documented API boundary.

## Questions Remaining

- What exactly does DeepSeek guarantee, and which parts are best effort?
- How much of prefix construction is already handled by Pi's provider adapters?

## Sources Consulted

- `https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md`
- `https://github.com/deepseek-ai/awesome-deepseek-agent/blob/main/docs/reasonix.md`
- `https://reasonix.io/docs/`
- `https://api-docs.deepseek.com/guides/kv_cache`

## Assessment

- newInfoRatio: 0.83
- Novelty justification: The first pass established what is claimed; this pass identifies the stable-prefix and append-only invariants that could be carried into Pi and the provider-specific limits that cannot.
- Confidence: High for the documented architecture; medium for the portability inference because proxy behavior is deployment-dependent.

## Reflection

- What worked and why: Comparing the project architecture with the official provider guide separated application policy from provider behavior.
- What did not work and why: The public docs do not expose a portable cache object or a provider-neutral serialization contract.
- What I would do differently: Test a minimal fixed-prefix request sequence against each target provider before designing abstractions.

## Recommended Next Focus

Audit the quantitative Reasonix report: define the hit-rate denominator and test whether 99.82% can imply the reported cost reduction.

