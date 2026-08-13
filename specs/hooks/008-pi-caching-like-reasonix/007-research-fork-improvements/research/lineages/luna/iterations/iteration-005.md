# Iteration 005 — Cost economics and measurement

## Focus

Compare accounting equations, pricing authorities, metric denominators, and available measurement paths for cold starts, warm hits, retries, and extension overhead.

## Actions Taken

- Read DeepPi's pricing interfaces, savings equation, README claims, and prior live-verification evidence.
- Read the optimizer's provider-neutral stats types and output formatting.
- Compared cache-read, cache-write, uncached-input, response-count, and cost semantics across the forks.
- Searched both implementations for latency/duration instrumentation and checked whether the declared benchmark can produce a controlled baseline.

## Findings

### F-018 — DeepPi mixes Pi-reported actual cost with a separate model-rate savings estimate

DeepPi's actual input cost sums `usage.cost.input + usage.cost.cacheRead`, while estimated savings uses `usage.cacheRead` multiplied by the model's configured input/cache-read rate. The same usage contract also contains output and cache-write costs, but neither enters the displayed input economics; there is no reconciliation check between the reported cost fields and the model rate. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:4-16,47-67,94-118]

Improvement opportunity: report separate values for provider-reported actual input cost, counterfactual uncached input cost, cache-read savings, cache-write cost, and output cost. Mark savings as `unavailable` when pricing or token/cost reconciliation is invalid. This preserves Pi's authoritative observed cost while making the counterfactual assumption explicit instead of presenting two silently mixed pricing authorities.

### F-019 — The optimizer has token economics but no optional dollar model

The optimizer's persisted `CacheStats` records request counts and cached, cache-write, and total input tokens; its output reports token ratios and counts. It has no price metadata or dollar-savings field, which is understandable for a multi-provider/proxy extension because provider prices are not reliably available from the adapter, but it prevents cost comparison across models with different cache rates. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:222-229,3645-3670] [SOURCE: .pi/extensions/pi-cache-optimizer/README.md:29-40,62-70]

Improvement opportunity: keep token statistics as the provider-neutral baseline, then add an explicit optional pricing registry or per-model override with currency, unit, and effective date. If no rate is configured, label output as token-only rather than infer pricing from model names or proxy metadata. Persist the rate identity with derived economics so historical totals are not silently recomputed under new prices.

### F-020 — The two forks' headline cache metrics are not semantically comparable

DeepPi's hit rate is `cacheRead / (cacheRead + input)` and its response totals increment in the same recorder, while the optimizer separately reports hit requests, cached input tokens, cache-write tokens, and total input tokens. DeepPi currently excludes cache writes from its denominator; the optimizer includes them in `totalInputTokens`. A “80% cache” footer from one fork therefore does not have a guaranteed equivalent meaning in the other, especially during cold starts. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:19-24,60-72] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:222-229,3645-3670]

Improvement opportunity: publish a small metric contract with explicit equations: request hit rate, token hit rate, cache-write share, uncached-input share, and cost savings. Each fork can retain its local display, but shared dashboards and tests should name the denominator and show `unknown` when fields are missing.

### F-021 — There is no controlled cold/warm or extension-overhead benchmark path

The source contains timestamps for trend samples and persistence metadata, but no request-duration or hook-overhead measurement. DeepPi declares an opt-in live benchmark, yet its entry point is absent; the prior packet evidence also says the live DeepSeek check used one request and the full `/deeppi` report was not observable non-interactively. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:375-385,7614-7621] [SOURCE: .pi/extensions/deep-pi/package.json:51-56] [SOURCE: specs/hooks/008-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/implementation-summary.md:85-92,141-143] [SOURCE: specs/hooks/008-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md:102-124]

Improvement opportunity: create a credential-aware benchmark that replays a fixed prompt sequence in four modes: optimizer/deep-pi disabled, enabled cold write, enabled warm read, and mixed retry/error. Record request count, cache-read/write/uncached tokens, observed provider cost, wall-clock latency, and blocked prerequisites. Run enough repeated turns to separate first-write effects from network variance; never treat a single live response as a performance claim.

## Questions Answered

- Which changes have measurable cost or latency impact? Answered: cache accounting, retries, and prompt/guard transforms need a controlled enabled/disabled replay; current source has no overhead metric and live evidence is not a benchmark.
- What exact pricing assumptions are needed for comparable economics? Answered: use Pi-reported actual costs where available, keep optional rate-based counterfactuals separate, and declare units, currency, effective date, and missing-data semantics.

## Questions Remaining

- Which maintainability boundaries should be shared, simplified, or documented across the forks?
- Which implementation order gives the highest correctness reduction per unit of work?
- Which prior findings are already covered by sibling packet acceptance evidence versus still needing new tests?

## Ruled Out Directions

- Inferring dollar prices from model names or adapter families is ruled out; proxy routing and pricing are external configuration, not a stable code-level fact. [SOURCE: .pi/extensions/pi-cache-optimizer/README.md:40,106-110]
- Replacing provider-reported costs with a local estimate is ruled out; Pi's usage record is the observed source, while model rates should only support an explicitly labeled counterfactual. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:4-16,60-67]

## Next Focus

Maintainability and integration boundaries: duplicated ownership contracts, monolithic versus modular surfaces, provenance/drift, package verification, and the smallest safe shared interfaces.

## Scope Violations

None. No live provider call or target-package write was performed.
