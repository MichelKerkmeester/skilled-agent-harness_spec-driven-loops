# Iteration 004 — Cost-economics and cold-start cache-write

## Focus

What cost-economics and cold-start cache-write behaviors remain uncharacterized or under-instrumented?

## Actions Taken

- Read deep-pi `recordUsage` / `estimatedSavings` math
- Read optimizer `addUsageToCacheStats` / `cacheWriteInputTokens` / footer write display
- Anchored on the known open limitation that optimizer cold-start cache-write for newly-added models is uncharacterized
- Checked deep-pi "warming" footer semantics

## Findings

1. **deep-pi savings omit cache-write establishment cost.** `estimatedSavings` adds `(cacheRead/1e6)*(model.cost.input - model.cost.cacheRead)` only. It never subtracts `cacheWrite` priced at `model.cost.cacheWrite`. Early-session economics can look better than cash reality while the provider is filling the KV/prefix cache. Improvement: report `estimatedSavingsNet = estimatedSavings - cacheWriteCost` (or show write cost as a separate line in `/deeppi`). [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:60-67,94-108]

2. **Optimizer tracks writes but does not characterize cold-start windows.** `addUsageToCacheStats` accumulates `cacheWriteInputTokens`; footer can show `· write N tok` when `adapter.showCacheWrite`. There is no per-model "first N requests after new model key" analysis, no write/read ratio trend, and no documented expected write spike when a newly-added model first appears in `statsByModel` / `totalsByModel`. This is exactly the known open limitation — confirmed still unaddressed in fork source. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:3645-3668] [SOURCE: user research brief / 007 topic]

3. **"Warming" is a null-rate label, not a measured cold-start phase.** deep-pi footer returns `DeepPi · warming` when `cacheHitRate` is null (zero recorded input). That conflates "no usage yet" with "usage exists but still write-dominated." Improvement: define an explicit warm-up predicate (e.g. responses < K or writeShare > threshold) and surface write share in the report. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:70-78]

4. **No paired baseline/optimized DeepSeek workload harness in the vendored forks' default verify path.** deep-pi exposes opt-in `DEEPPI_LIVE=1 npm run benchmark:live`, but default `npm run verify` never measures economics. Optimizer `npm test` is unit-only. Improvement opportunity: a small fixture that records write→read transition over N identical-prefix turns for one DeepSeek-direct and one non-DeepSeek model, emitting a JSON artifact for packet 007 follow-up. [SOURCE: .pi/extensions/deep-pi/README.md:38-48] [SOURCE: .pi/extensions/deep-pi/package.json:51-56]

5. **Cost-math guards protect totals but not narrative overclaim.** After 006, missing `model.cost` / `usage.cost` increments `costMathErrors` and skips mutation of totals — good. Operators can still quote footer hit-rate without seeing write costs or error counters (ties to iteration 3 footer gap).

## Questions Answered

- Concrete cost improvements: net savings after write cost; cold-start window metrics for new model keys; distinguish warming vs write-dominated; optional live write→read transition fixture.

## Ruled Out

- Promising universal savings percentages — neither fork should; deep-pi README already disclaims fixed hit rates. [SOURCE: .pi/extensions/deep-pi/README.md:33-34]

## Next Focus

Maintainability: fork drift, dual ownership, shared predicates.

## Assessment

Cost angle yields measurement improvements distinct from observability plumbing. Convergence telemetry only; continue.
