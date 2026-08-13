# Iteration 15: Audit cache observability and compaction invalidation

## Focus

Identify the measurements and lifecycle transitions a plugin can retain, and determine why compaction is a cache-prefix invalidation boundary.

## Findings

- DeepSeek reports prompt-cache hit and miss tokens in usage, while OpenAI-compatible responses report cached tokens and Anthropic usage reports cache creation/read tokens. These counters are provider-specific and should remain provider-labeled in diagnostics. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache; https://platform.openai.com/docs/api-reference/responses-streaming/response/refusal/delta; https://docs.anthropic.com/en/docs/about-claude/pricing]
- Pi exposes `showCacheMissNotices`, provider payload hooks, and compaction lifecycle hooks. A plugin can persist compact metadata such as provider/model, prefix fingerprint, namespace, cache counters, and invalidation reason without persisting raw prompts. [SOURCE: https://pi.dev/docs/latest/settings; https://pi.dev/docs/latest/extensions; https://pi.dev/docs/latest/compaction]
- Pi's documented compaction path replaces older messages with a generated summary and keeps later messages from a cut point. Since the serialized prefix changes, a provider-side exact-prefix cache should be treated as invalidated or partially reusable after compaction; the plugin should start a new prefix generation rather than claim continuity. [INFERENCE: https://pi.dev/docs/latest/compaction; https://api-docs.deepseek.com/guides/kv_cache]
- The lumo performance target and cache-persistence language need an explicit invalidation model. Without one, a plugin could report a high lifetime hit rate while hiding misses after compaction, model changes, branch navigation, or provider routing changes. [INFERENCE: .opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:50-64]

## Ruled Out

- Treating one cumulative session hit rate as sufficient performance evidence is ruled out; rates must be segmented by prefix generation, provider, model, and cache namespace.

## Dead Ends

- Persisting full prompt text in a cache ledger is a dead end for privacy and storage; fingerprints and counters are sufficient for first-pass diagnostics.

## Questions Remaining

- What exact minimal plugin data model supports these segments without coupling to provider-specific usage schemas?
- Which performance claims can be tested without implementing the plugin?

## Sources Consulted

- `https://api-docs.deepseek.com/guides/kv_cache`
- `https://platform.openai.com/docs/api-reference/responses-streaming/response/refusal/delta`
- `https://docs.anthropic.com/en/docs/about-claude/pricing`
- `https://pi.dev/docs/latest/settings`
- `https://pi.dev/docs/latest/extensions`
- `https://pi.dev/docs/latest/compaction`
- `.opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:50-64`

## Assessment

- newInfoRatio: 0.41
- Novelty justification: The observability model and compaction invalidation boundary turn broad performance claims into measurable segments.
- Confidence: High for provider counter fields and Pi lifecycle hooks; medium for exact partial-reuse behavior after each provider's compaction sequence.

## Reflection

- What worked and why: Cross-provider usage docs plus Pi lifecycle docs define a bounded diagnostics model.
- What did not work and why: No common usage schema exists, so normalization must preserve raw provider fields.
- What I would do differently: Build a provider-neutral envelope with an opaque provider-specific usage object.

## Recommended Next Focus

Design the smallest feasible plugin architecture and explicit non-goals: prefix fingerprints, provider adapters, counters, namespaces, and invalidation events.

