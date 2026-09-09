## Iteration 008 (Sonnet 5, second opinion) — specifying F1 to buildable detail

10 tool calls used (3 grep/ls, 7 targeted reads). Building directly on my own iteration 007 trace (`hasMissingUsageFields` → `missingUsageFields` flag → stored on `CacheUsageSample` → read back only for a trend footnote, never gating `addUsageToCacheStats`). This iteration traces the exact corruption mechanism at the call site and turns it into an implementable change: schema field, migration, four call-site edits, and tests.

### Confirming F1 stays rank 1 — with a sharper mechanism than iteration 007 had

Re-reading `message_end` (`index.ts:9480-9517`) end to end:

```
const missingFields = usage === undefined ||
    (usage.cacheRead === 0 && usage.cacheWrite === 0 && usage.totalInput === 0)
  ? true
  : hasMissingUsageFields(event.message, adapter);
recordRecentSample(sk, usage ?? { cacheRead: 0, cacheWrite: 0, totalInput: 0 }, missingFields);
}
if (!usage) { ... return; }          // (a) fully-undefined usage: dropped, no stats corruption
...
addUsageToCacheStats(getOrCreateStatsByModelKey(sk), usage, pricing);   // (b) all-zero-but-defined usage: NOT dropped
addUsageToCacheStats(getOrCreateProcessStatsForModel(statsModel), usage, pricing);
addUsageToCacheStats(getOrCreateTotalStatsForModel(statsModel), usage, pricing);
```

Two distinct cases hide behind one `missingFields` boolean:
- **(a) `usage === undefined`** — early return at `9494-9497`, nothing added to stats. No corruption here; iteration 007 didn't need to worry about this branch.
- **(b) `usage` is a defined `{cacheRead:0, cacheWrite:0, totalInput:0}`** — this does *not* return early (the object is truthy), so it falls through to `addUsageToCacheStats` (`4183-4198`), which unconditionally does `stats.totalRequests += 1` (`4188`) and, when pricing is resolved, `stats.pricedRequests += 1` (`4194`). Since `usage.totalInput` is 0, `computeInputCostUsd`/`computeUncachedBaselineCostUsd` (`4168-4181`) contribute `$0` — so the dollar *numerators* stay clean, but the request-count *denominators* used for the headline hit ratio (`formatHitRatio`, `4226-4229`, rendered at `4346-4349`) and the "$X over N priced request(s)" line (`4372-4374`) get silently padded with phantom zero-value requests.

This is a more precise mechanism than "the flag is inert" — it's specifically a **denominator-inflation bug limited to case (b)**, and it's what actually happens on the ground: a proxy that returns a 200 with an empty/zero usage block (not an outright missing field) hits exactly this path.

Compared against the rest of my own re-ranked backlog:
- **F3** (zero cached-read pricing, `4123-4129`) withholds a number entirely (renders "unpriced") — a data-loss failure, not a corrupted-but-displayed number.
- **F2** (prefix promotion) only feeds `prefixChurnCount`, itself decorative telemetry (confirmed again at `4159-4161`, `9145-9149`) — no cost/ratio impact.

F1 is the only item where the report displays a number that is wrong, silently, on every affected provider. It stays rank 1.

### The buildable fix

**1. Schema — add a durable counter, `CacheStats.missingSignalRequests: number`**
`interface CacheStats` starts at `index.ts:265`, fields enumerated exhaustively by `emptyCacheStats()` at `4094-4107`:
```
day, totalRequests, hitRequests, cachedInputTokens, cacheWriteInputTokens,
totalInputTokens, inputCostUsd, uncachedBaselineCostUsd, pricedRequests, prefixChurnCount
```
Add `missingSignalRequests: number;` to the interface and to `emptyCacheStats()`'s return object (`4094-4107`).

**2. Migration — `parseCacheStats()` (`index.ts:4427-4471`)**
Follow the exact pattern already used for `pricedRequests`/`prefixChurnCount` at `4456-4457`:
```ts
const missingSignalRequests = getNonNegativeNumber(stats, 'missingSignalRequests') ?? 0;
```
and add it to the returned object (`4459-4470`). No top-level version bump: `PersistedCacheStatsV6.version` stays `6` — this is additive per-record defaulting, the same mechanism proven by the existing "pre-phase stats record migration" test (`tests/cache-economics.test.ts:284-332`, `334-400`), which already demonstrates `inputCostUsd`/`pricedRequests`/`prefixChurnCount` migrating forward from a record that predates them.

**3. Aggregation — `addCacheStatsTotals()` (`index.ts:4477-4487`)**
Add `target.missingSignalRequests += source.missingSignalRequests;` — required because `getOrCreateTotalStatsForModel`'s merge path (`mergeCacheStatsForTotal`, `4489+`) calls this function; skipping it would make the cumulative-totals bucket silently diverge from the session bucket.

**4. Core logic — `addUsageToCacheStats()` (`index.ts:4183-4198`)**
```ts
function addUsageToCacheStats(
  stats: CacheStats,
  usage: UsageSnapshot,
  pricing: ModelInputPricing | undefined,
  missingSignal: boolean,
): void {
  if (missingSignal) {
    stats.missingSignalRequests += 1;
    return;
  }
  stats.totalRequests += 1;
  if (usage.cacheRead > 0) stats.hitRequests += 1;
  stats.cachedInputTokens += usage.cacheRead;
  stats.cacheWriteInputTokens += usage.cacheWrite;
  stats.totalInputTokens += usage.totalInput;
  if (pricing) {
    stats.pricedRequests += 1;
    stats.inputCostUsd += computeInputCostUsd(usage, pricing);
    stats.uncachedBaselineCostUsd += computeUncachedBaselineCostUsd(usage, pricing);
  }
}
```
Safe because in the excluded branch `usage` is always `{cacheRead:0, cacheWrite:0, totalInput:0}` (that's the only way `missingFields` becomes `true` without going through `hasMissingUsageFields`) — nothing quantitative is lost, only the phantom denominator increment is removed.

**5. Call site — `message_end` handler (`index.ts:9507-9514`)**
`missingFields` is already computed and in scope at `9483-9486`; thread it through instead of recomputing anything:
```ts
if (statsModel) {
  const sk = sessionModelKey(statsModel);
  addUsageToCacheStats(getOrCreateStatsByModelKey(sk), usage, pricing, missingFields);
  addUsageToCacheStats(getOrCreateProcessStatsForModel(statsModel), usage, pricing, missingFields);
  addUsageToCacheStats(getOrCreateTotalStatsForModel(statsModel), usage, pricing, missingFields);
} else {
  addUsageToCacheStats(getStatsForModel(undefined, adapter), usage, undefined, missingFields);
}
```

**6. Report — `buildStatsOutput()` (`index.ts:4322-4417`)**
After the "Requests:" line (`4345-4349`), surface the persisted counter so it survives process restarts, unlike today's in-memory-only `recentSamples` warning (`4399-4409`, capped at `MAX_RECENT_SAMPLES = 50`, `454`):
```ts
if (currentStats.missingSignalRequests > 0) {
  lines.push(`Missing signal: ${currentStats.missingSignalRequests} request(s) excluded above`);
}
```

### The test that fails before, passes after
Add to `tests/cache-economics.test.ts` (pattern matches the existing "addUsageToCacheStats accumulates cost only when priced" test at `109-121`):
```ts
test('a missing-signal response is excluded from totalRequests and pricedRequests', () => {
  const stats = internals.emptyCacheStats('2026-09-08');
  const zeroUsage = { cacheRead: 0, cacheWrite: 0, totalInput: 0 };
  internals.addUsageToCacheStats(stats, zeroUsage, pricing, /* missingSignal */ true);
  assert.equal(stats.totalRequests, 0);
  assert.equal(stats.pricedRequests, 0);
  assert.equal(stats.missingSignalRequests, 1);
});
```
Fails today two ways: it's a compile error under the current 3-arg signature, and if the signature is naively widened without the early-return body change, `totalRequests`/`pricedRequests` both read `1`, not `0` (current unconditional increments at `4188`, `4194`).

### The negative control
```ts
test('a genuine full miss with real billed tokens still counts as a normal request', () => {
  const stats = internals.emptyCacheStats('2026-09-08');
  const realMiss = { cacheRead: 0, cacheWrite: 0, totalInput: 500 };
  internals.addUsageToCacheStats(stats, realMiss, pricing, /* missingSignal */ false);
  assert.equal(stats.totalRequests, 1);
  assert.equal(stats.pricedRequests, 1);
  assert.equal(stats.missingSignalRequests, 0);
});
```
Guards against gating exclusion on `usage.totalInput === 0` instead of the explicit flag — this exact "full miss with real tokens" shape is already asserted legitimate elsewhere (`cache-economics.test.ts:138-144`), so a sloppy implementation that keys off token values instead of the flag would silently break an already-covered invariant.

### What I am NOT certain about
1. I have not read `usageRecordFromAssistant` (used inside `hasMissingUsageFields`, `4270`) or the code that computes the handler's own `usage` variable above line 9450. It's possible that path and `hasMissingUsageFields`'s internal re-derivation disagree in some provider-specific case — I only fully traced the dominant all-zero-and-defined case (branch (b) above), not every path through `hasMissingUsageFields` itself.
2. I found exactly four `addUsageToCacheStats` call sites, all inside this one `message_end` handler (`9507-9514`) — I did not grep the whole file a second time for stray calls elsewhere (e.g., a rollover/reset/backfill path); worth a `grep -n "addUsageToCacheStats("` pass before landing.
3. I read `buildStatsOutput` and `formatCacheStats` (`4209-4220`) but did not check whether any other consumer (a JSON-export command, a different report surface) reads `CacheStats` fields directly and would also need updating for consistency with the new field.
