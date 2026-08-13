# Iteration 4: Maintainability and Genuinely New Surface

## Focus

Beyond the disclosed provenance-drift finding, hunt for concrete maintainability/test-infra issues and correct an error this lineage made in iteration 1.

## Findings

1. **CORRECTION — the parent's `f-014` was right and this lineage's iteration-1 refutation was wrong: `errorsEnhanced` *does* exist and is un-surfaced.** `errorsEnhanced` lives in `stormbreaker.ts:33` and is incremented at `stormbreaker.ts:144`, but the `/deeppi` report handler passes only `loopsGuarded`/`loopsAborted` from the storm state (`deeppi.ts:75-76`) — never `errorsEnhanced`. Same for `prunedThinking`/`preservedThinking` (stability). So the parent's Tier 3 finding ("report omits counters it already maintains") stands, and this lineage's earlier "counter does not exist" dead-end was a false negative caused by grepping the wrong module. Documented here so the synthesis does not inherit the error. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/stormbreaker.ts:144] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:75]
2. **NEW — deep-pi's `before_provider_request` digests the entire conversation history on every single request.** `stability.ts:192-206` runs `structuredClone(event.payload)`, `sortProviderTools`, then `capturePrefixShape` which sha256-digests every non-system message in the conversation (`stability.ts:104-123`). The `previousShape.messageDigests` array grows unboundedly with conversation length. For an eligible DeepSeek model this runs on the hot path of every provider request purely to compute the `latestChurn` diagnostic. The parent only gestured at this (sol's `f-local-overhead-ablation`); the concrete mechanism — O(conversation) hashing per request plus unbounded digest retention — is new. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/stability.ts:192]
3. **Corroborated and extended — deep-pi's `benchmark:live` is doubly broken.** The script target `scripts/live-benchmark.mjs` is absent (`ls .pi/extensions/deep-pi/scripts/` → no such directory), corroborating Tier 2 #6. The second break: deep-pi's `package.json` `files` allowlist is `["LICENSE", "README.md", "extensions", "tsconfig.json"]` — a `scripts/` directory would be excluded from `npm pack` even if the script were added. Any fix must update both the script and the files allowlist, or the "fixed" script silently never ships. [SOURCE: .pi/extensions/deep-pi/package.json:30] [SOURCE: .pi/extensions/deep-pi/package.json:44]
4. **NEW — the composition-test seam already exists in deep-pi's harness, but the two forks use divergent test runners.** `deeppi.integration.test.ts` drives the real `deepPi()` through a `FakePi` (`fake-pi.ts`) with event emission and command dispatch — the exact harness a combined-host composition test needs. The concrete blocker: pi-cache-optimizer runs its suite with `node --import jiti/register tests/review-findings.test.ts` using node:test's `assert` (see `review-findings.test.ts:50,67,69`), while deep-pi runs vitest (`telemetry.test.ts:2`). A cross-fork test therefore must pick one runner or add a vitest adapter for the cache-optimizer package. This is a test-infra decision the parent synthesis's P0 composition test did not name. [SOURCE: .pi/extensions/deep-pi/tests/deeppi.integration.test.ts:1] [SOURCE: .pi/extensions/pi-cache-optimizer/package.json:22]
5. **NEW — the read-only `/deeppi` report command mutates shared telemetry state.** `deeppi.ts:67` (`telemetry.latestChurn = stability.latestChurn`) writes into telemetry from a command whose purpose is rendering. It is harmless today (only the report reads `latestChurn`) but it couples the two modules' state in a way that a structured-report refactor (separate data from rendering) must explicitly break, and it is the kind of side effect that makes a command non-idempotent under concurrent invocation. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:67]

## Ruled Out

- Treating the test-runner difference as a non-issue: a combined-host composition test cannot be written once and run under both current setups; a runner decision must be made first.
- Recommending any change to the report transport before separating report data from rendering: the mutation in finding 5 is only safe because today's single consumer is the report itself.

## Dead Ends

- This iteration's own previous error: iteration 1's claim that `errorsEnhanced` does not exist is false — it exists in `stormbreaker.ts` and is simply not wired to the report. Corrected in finding 1.

## Edge Cases

- Partial success: `recordToolOutcome` matches expected tool calls by id only (`stormbreaker.ts:63`); a stale id collision is theoretically possible but Pi's per-call id generation makes it unlikely — logged as low-severity, not a headline finding.
- Contradictory evidence: none remaining.

## Sources Consulted

- `.pi/extensions/deep-pi/extensions/deeppi/stormbreaker.ts`
- `.pi/extensions/deep-pi/extensions/deeppi/stability.ts`
- `.pi/extensions/deep-pi/extensions/deeppi.ts`
- `.pi/extensions/deep-pi/tests/deeppi.integration.test.ts`
- `.pi/extensions/deep-pi/tests/fake-pi.ts`
- `.pi/extensions/deep-pi/package.json`
- `.pi/extensions/deep-pi/tests/hashlines.test.ts`
- `.pi/extensions/pi-cache-optimizer/package.json`
- `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts`

## Assessment

- New information ratio: 0.85
- Novelty justification: Four findings are new (hot-path digesting, packaging double-break, test-runner blocker, report-command side effect) and one is an explicit correction of this lineage's own earlier false negative that restores a parent Tier 3 finding.
- Questions addressed: Q3 (test-infra blocker) and Q6 (maintainability).
- Questions answered: Q6 — concrete maintainability items beyond provenance drift; Q3 — the composition-test seam and its runner blocker are now concrete.

## Reflection

- What worked and why: reading the stormbreaker module plus the integration harness surfaced both the `errorsEnhanced` correction and the test-runner divergence — two things a grep-only pass would miss.
- What did not work and why: iteration 1's `errorsEnhanced` grep was too narrow (extensions root) and missed the stormbreaker module; the correction is now explicit.
- What I would do differently: when a parent-synthesis counter "does not exist," grep the whole tree before refuting.

## Recommended Next Focus

Synthesis: consolidate the four iterations into a ranked improvement set that separates corroborated Tier 1/2 items from this lineage's new mechanisms, records the one correction, and documents the test-runner and packaging decisions the parent synthesis left open.
