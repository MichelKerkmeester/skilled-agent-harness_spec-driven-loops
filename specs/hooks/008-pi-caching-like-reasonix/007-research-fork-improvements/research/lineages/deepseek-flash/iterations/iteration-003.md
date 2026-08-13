# Iteration 3: Telemetry, Observability, and Cost-Economics

## Focus

Characterize each fork's telemetry and cost-economics surface: deep-pi's missing stats persistence, the report-body transport gap, the cache-hit-rate denominator divergence, and what cold-start cache-write behavior actually is for both forks.

## Findings

1. **NEW — deep-pi's cold-start behavior is now precisely characterized: the establishing cache write is entirely invisible.** A first request on a new conversation is a pure cache-write request (`input: 0`, `cacheRead: 0`, `cacheWrite > 0`). deep-pi's `recordUsage` availability check (`telemetry.ts:52`, `usage.input + usage.cacheRead === 0`) returns early for exactly this shape — so the request that *establishes* the cache is (a) not counted as a response, and (b) flips `usageUnavailable` to true. The parent synthesis flagged cold-start writes as "uncharacterized" for pi-cache-optimizer; for deep-pi the behavior is now characterized as silently dropped, including for the first request of every session. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:52]
2. **Corroborated with mechanism — pi-cache-optimizer *can* structurally characterize cold-start writes; only the measurement is missing.** `totalInput = input + cacheRead + cacheWrite` (`index.ts:2228`, comment at `2159-2161`), `addUsageToCacheStats` tracks `cacheWriteInputTokens` (`index.ts:3645-3651`), and `getOrCreateStatsByModelKey` seeds `emptyCacheStats()` (zeros) for a newly-added model (`index.ts:6931`). So a new model's first request would surface as `totalRequests: 1, cacheWriteInputTokens: N, cachedInputTokens: 0` — the instrumentation exists and the only gap is that no characterization run has been executed. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:2228]
3. **Corroborated at the field level — the cache-hit-rate denominators diverge.** pi-cache-optimizer's footer ratio is `cachedInputTokens / totalInputTokens` where `totalInputTokens` *includes* cacheWrite (`index.ts:3650, 3664`); deep-pi's `cacheHitRate` is `cacheRead / (cacheRead + input)` which *excludes* cacheWrite (`telemetry.ts:70-73`). A combined dashboard that mixes the two percentages would silently mislead unless the denominator is normalized. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:70] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:3650]
4. **Corroborated with 2026-08-08 pricing — cache-write cost is real and volatile, and it is the cache-miss price.** DeepSeek's live pricing page lists cache-hit $0.0028/M vs cache-miss $0.14/M for `deepseek-v4-flash` (and $0.003625 vs $0.435 for pro), with no separate write tier — a cold write is billed at the miss price. So deep-pi's `estimatedSavings` (`(cacheRead/1M) * (cost.input - cost.cacheRead)`, `telemetry.ts:65-66`) credits only the read segment and ignores the write-segment cost entirely, overstating savings on every cold request. The same page announces an imminent significant price increase, reinforcing that no savings figure should be hard-coded or treated as stable. [SOURCE: https://api-docs.deepseek.com/quick_start/pricing] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:65]
5. **Design target — deep-pi's persistent stats file should reuse its own `atomicWriteFile`, not copy pi-cache-optimizer's racy persistence.** pi-cache-optimizer persists a versioned payload (`version: 6`, `sessions` + `totalsByModel` + `legacyFamily` + `lastRoutedModelBySession`) via read-merge-`rename` with a `pid.DateNow().tmp` temp name and no cross-process lock (`index.ts:4264-4321`), matching the parent Tier 2 #7 race. deep-pi already owns `atomicWriteFile` with a write-queue per path and post-rename verification (`hashlines.ts:41-106`) — strictly better — so a deep-pi stats file (versioned schema, session + cumulative-daily scope, mirroring pi-cache-optimizer's `currentLocalDay`/`rollOverStatsIfNeeded`) should be built on that existing primitive rather than replicating the cache-optimizer's unguarded write path. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4264] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/hashlines.ts:41]

## Ruled Out

- A single shared stats file for both extensions: the parent already ruled this out; the two forks have different persistence contracts and should stay separate, privacy-bounded files.
- Copying pi-cache-optimizer's `read-merge-rename` persistence verbatim into deep-pi: it would import the known cross-process race instead of reusing deep-pi's superior `atomicWriteFile`.

## Dead Ends

- No separate DeepSeek "cache write" price tier exists in the current v4 pricing model — write cost is the cache-miss price. This removes the option of pricing writes independently in savings math; the fix is to include `cacheWrite` tokens in both the response count and the cost base, not to add a new price constant.

## Edge Cases

- Partial success: `getDeepSeekRawUsage` returns `cacheWrite: 0` when Pi's usage record omits the field (`index.ts:2174-2186`), so pi-cache-optimizer's write tracking depends on Pi actually reporting the field — a dependency worth a test.
- Contradictory evidence: none.

## Sources Consulted

- `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts`
- `.pi/extensions/deep-pi/extensions/deeppi/hashlines.ts`
- `.pi/extensions/pi-cache-optimizer/index.ts` (lines 2159-2228, 3645-3664, 4264-4321, 6856-6931, 7110-7156)
- `.pi/extensions/deep-pi/package.json`
- `.pi/extensions/pi-cache-optimizer/package.json`
- `.pi/extensions/deep-pi/README.md`
- https://api-docs.deepseek.com/quick_start/pricing (fetched 2026-08-08)

## Assessment

- New information ratio: 0.8
- Novelty justification: One finding precisely characterizes a gap the parent left open (deep-pi cold-start drop), two corroborate prior findings with field-level mechanism and current pricing, and one produces a concrete, better-than-upstream persistence design for deep-pi.
- Questions addressed: Q4 (observability) and Q5 (cost-economics) substantially.
- Questions answered: Q5 — cold-start cache-write behavior is now characterized for both forks.

## Reflection

- What worked and why: combining a live pricing fetch with the two forks' usage-normalization code made the savings-arithmetic gap concrete (write cost = miss price) rather than theoretical.
- What did not work and why: nothing blocked; the pricing page had no separate write tier, which at first looked like missing data and turned out to be the finding itself.
- What I would do differently: verify Pi's `usage.cacheWrite` reporting shape before finalizing the stats-file design, since pco's adapter treats it as optional.

## Recommended Next Focus

Maintainability beyond provenance drift: what a fork-specific stewardship layer looks like — build identity, packaged-script completeness, and the missing live-benchmark wiring — plus the hot-path overhead of deep-pi's per-request prefix digesting.
