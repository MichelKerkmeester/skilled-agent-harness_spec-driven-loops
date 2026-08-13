# Iteration 18: Define the minimum feasible plugin architecture

## Focus

Synthesize the verified boundaries into the smallest Reasonix-style Pi plugin that could be implemented and measured.

## Findings

- The minimum extension can be organized into five responsibilities: observe system-prompt inputs, compute non-reversible fingerprints for stable/volatile sections, delegate provider-specific retention/key/affinity settings, normalize available usage counters, and record lifecycle invalidations. Pi's documented `before_agent_start`, `before_provider_request`, response, compaction, and tree hooks cover these boundaries. [SOURCE: https://pi.dev/docs/latest/extensions; https://pi.dev/docs/latest/compaction]
- Prompt mutation should be an explicit policy mode, not the default. In observe-only mode the plugin reports unstable prefix causes and provider capability gaps; in opt-in mode it can apply narrowly scoped stable-content ordering after provider/model compatibility is confirmed. [INFERENCE: https://pi.dev/docs/latest/extensions; https://api-docs.deepseek.com/guides/kv_cache]
- The persistence model should store provider/model, cache namespace hash, prefix generation, fingerprint, counters, and invalidation reason. It should not store raw prompts, response bodies, API keys, or model output. [INFERENCE: https://pi.dev/docs/latest/extensions; https://pi.dev/packages/pi-cache-optimizer]
- The first version should explicitly exclude raw KV access, guaranteed hit rates, universal cross-provider cache keys, MCP, plan mode, filesystem checkpoints, and custom compaction. Those are either outside Pi's extension boundary, provider-specific, or already covered by separate packages/workflows. [INFERENCE: https://pi.dev/docs/latest/usage; https://pi.dev/docs/latest/compaction; https://api-docs.deepseek.com/guides/kv_cache]

## Ruled Out

- A monolithic “Context Engine v2” that owns Pi session persistence, MCP, plan mode, rewind, provider adapters, and cache state is ruled out as an unnecessarily broad scope.

## Dead Ends

- Importing or coupling directly to another router/package's internal globals is a dead end for a durable plugin; use documented Pi hooks and optional versioned integrations only.

## Questions Remaining

- Which parts of this architecture need live provider tests before implementation approval?
- Is adopting/contributing to `pi-cache-optimizer` lower risk than a separate package?

## Sources Consulted

- `https://pi.dev/docs/latest/extensions`
- `https://pi.dev/docs/latest/compaction`
- `https://pi.dev/docs/latest/usage`
- `https://pi.dev/packages/pi-cache-optimizer`
- `https://api-docs.deepseek.com/guides/kv_cache`

## Assessment

- newInfoRatio: 0.32
- Novelty justification: The evidence is now assembled into a bounded extension architecture with explicit opt-in and privacy rules.
- Confidence: Medium-high for architectural feasibility; low for expected savings until live provider tests.

## Reflection

- What worked and why: The prior gap and failure analysis removed unrelated workflow features from the cache design.
- What did not work and why: Documentation cannot choose between adopting the existing community package and creating a separate one.
- What I would do differently: Audit and pin the existing package before committing to a new implementation.

## Recommended Next Focus

Build a feasibility matrix and validation plan: low-risk diagnostics, medium-risk prompt policy, and high-risk guarantees or provider-internal behavior.

