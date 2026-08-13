# Iteration 5: Cost Economics and Benchmark Design

## Focus

Determine which economic claims the current counters can support, then design a benchmark that isolates provider behavior from extension behavior.

## Findings

1. DeepPi's `estimatedSavings` formula is a valid fully-uncached counterfactual when Pi reports uncached input in `usage.input` and hits in `usage.cacheRead`: `cacheRead × (input price - cache-read price)`. It is not evidence of savings *caused by DeepPi*, because DeepSeek context caching is automatic and the same prefix may have hit without the extension. Rename it `estimatedSavingsVsNoCache` and reserve causal language for an ablation. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:47] [SOURCE: https://api-docs.deepseek.com/guides/kv_cache] [INFERENCE: automatic provider caching makes an uninstrumented counterfactual non-causal]
2. The formula silently omits `usage.cacheWrite` from its availability guard, token denominator, and actual input cost. DeepSeek's current API describes prompt cache hits and misses rather than a separately billed cache-write token class, so zero write tokens are expected for the direct route today. The safe contract is to include cache-write cost when present and increment a schema/usage warning when a model reports nonzero writes unexpectedly. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:50] [SOURCE: https://api-docs.deepseek.com/api/create-completion] [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]
3. Economic tests must not hard-code current DeepSeek rates as behavioral truth. The runtime correctly reads the selected model's Pi cost metadata, while fixture values only test arithmetic; the official price table is mutable and currently varies by model. Persist the provider/model, price snapshot, currency, and capture time beside benchmark results so old runs remain interpretable. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:61] [SOURCE: https://api-docs.deepseek.com/quick_start/pricing?push_animated=1&show_loading=0&theme=light&webview_progress_bar=1]
4. A defensible cache benchmark is a paired, randomized crossover: fixed prompt/tool fixtures; extension disabled versus enabled; request 1 classified cold; identical requests 2 and 3 classified warm; then repeat after a fresh Pi process. Record hit, miss, and write tokens, input/output cost, provider latency, retry counts, request-prefix hash/length, model identity, and cache age. Multiple rounds are required because DeepSeek documents cache construction delay and best-effort availability. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:3645] [INFERENCE: crossover and repeated rounds isolate treatment effects and variance]
5. Provider latency cannot measure extension overhead. Instrument each hook with monotonic local duration and bounded failure counters, then benchmark no-op, cold-transform, and warm-transform paths separately. For DeepPi, add per-feature ablation switches for prompt shaping, tool-description shortening, and hashline edits; otherwise an aggregate on/off result cannot attribute benefit or regression to a module. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:20] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1279] [INFERENCE: local timing plus feature ablation separates extension work from network variance]

## Ruled Out

- Calling `estimatedSavings` a measured extension benefit; it is a model-price counterfactual until an enabled/disabled ablation is run. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:61]
- Comparing one cold request with one warm request. DeepSeek caching is best-effort and cache construction may take seconds, so a single pair confounds warm-up and availability. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]
- Freezing provider prices in source tests. Use synthetic fixtures for arithmetic and timestamped runtime metadata for economics. [SOURCE: https://api-docs.deepseek.com/quick_start/pricing?push_animated=1&show_loading=0&theme=light&webview_progress_bar=1]

## Dead Ends

- `cacheWrite` cannot be priced from the current DeepSeek docs as a distinct charge. Treat it as a provider/model capability field and report it explicitly instead of inventing a price. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]

## Edge Cases

- Ambiguous input: Pi adapters may normalize provider fields differently; record raw numeric usage classes after normalization, not assumptions about upstream names.
- Contradictory evidence: the local type carries cache-write data while the direct DeepSeek API exposes hit/miss accounting; guard the nonzero case rather than deleting it.
- Missing dependencies: a deterministic fake provider can validate bookkeeping, but real economics still require optional credentialed runs.
- Partial success: current price and cache semantics were confirmed from official docs; no live paid request was made.

## Sources Consulted

- DeepPi telemetry and extension hooks
- cache-optimizer usage capture
- official DeepSeek context-cache, completion-usage, and pricing documentation

## Assessment

- New information ratio: 0.85
- Novelty justification: The pass distinguishes valid accounting from causal claims and turns four known limitations into one controlled experiment.
- Questions addressed: cost claims, cold-start characterization, and extension overhead.
- Questions answered: the valid cost vocabulary and minimum benchmark design are now concrete.

## Reflection

- What worked and why: comparing local formulas with provider semantics exposed which labels overclaim rather than which arithmetic is wrong.
- What did not work and why: current documentation cannot supply a separately billed cache-write rate because the direct API does not describe one.
- What I would do differently: capture Pi's normalized usage payload from the fake provider before any paid benchmark.

## Recommended Next Focus

Map maintainability debt, fork provenance, shared contracts, and safe modularization seams without proposing a wholesale rewrite.
