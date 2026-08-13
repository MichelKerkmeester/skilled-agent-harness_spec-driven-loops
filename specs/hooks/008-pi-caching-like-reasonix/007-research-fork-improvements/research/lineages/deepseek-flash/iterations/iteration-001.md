# Iteration 1: Independent Corroboration of Tier 1/2 Findings

## Focus

Read both forks' source directly (not via the parent synthesis) to independently corroborate or refute the top findings from the completed 3-lineage run, and sharpen the mechanisms behind them.

## Findings

1. **Corroborated — ownership predicate is duplicated and hardcoded in both forks.** deep-pi declares `DEEPPI_MODEL_IDS = ["deepseek-v4-flash", "deepseek-v4-pro"]` in `eligibility.ts:1-4`; pi-cache-optimizer independently hardcodes the identical pair in `isDeepPiOwned` at `index.ts:1279-1281` (`model?.provider === "deepseek" && (model.id === "deepseek-v4-flash" || model.id === "deepseek-v4-pro")`). No shared source of truth; the lists can diverge silently. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1279]
2. **Corroborated — `/deeppi` report is UI-notify-only.** The `deeppi` command handler (`deeppi.ts:64-82`) calls `ctx.ui.notify(formatDeepPiReport({...}), "info")` and returns; there is no file, RPC, or structured output path. The full report body is therefore unavailable to any non-interactive consumer, matching the disclosed 006 limitation. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:64]
3. **Corroborated — deep-pi resets all telemetry in-memory at every `session_start`.** `resetTelemetry` (`telemetry.ts:123-128`) rebuilds `byModel` from `emptyTotals()`; `deeppi.ts:46-58` calls it on every session start. No persistent stats file exists anywhere in the deep-pi tree, while pi-cache-optimizer persists versioned session/total buckets via `readPersistedCacheStats`/`writePersistedCacheStats` (`index.ts:4066-4103`). Structural asymmetry confirmed. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:123] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:46]
4. **Corroborated with a sharper mechanism — deep-pi's savings arithmetic omits cache-write cost, and the availability check drops pure-cache-write usage entirely.** `recordUsage` (`telemetry.ts:52`) returns early (marks `usageUnavailable = true`) when `usage.input + usage.cacheRead === 0` — a message whose only usage is `cacheWrite` is silently dropped from all counters. `estimatedSavings` (`telemetry.ts:65-66`) computes `(cacheRead / 1M) * (cost.input - cost.cacheRead)`, never referencing `cacheWrite`. Meanwhile pi-cache-optimizer's `addUsageToCacheStats` (`index.ts:3645-3651`) explicitly tracks `cacheWriteInputTokens`. The two forks' accounting models diverge at the field level. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:52] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:65] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:3645]
5. **Refined mechanism (builds on Tier 1 #5) — the cache-optimizer's DeepSeek-guard short-circuits stats restore and status publishing for deep-pi-owned models.** At `index.ts:7278-7281`, the `session_start` handler returns early when `isDeepPiOwned(ctx.model)`: `restoreCacheStats`, `requestLongCacheRetention`, and `publishStatus` are all skipped. This is the operational enforcement of the ownership split, and it means the exact seam a combined-host composition test must assert (exactly one extension activates per model id) is the early-return in this hook — a concrete test target. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7278]

## Ruled Out

- The ownership split is not enforced by a shared runtime module; it is enforced at one guarded early-return in pi-cache-optimizer's `session_start` plus deep-pi's own eligibility gating. A shared helper would couple the packages; a test fixture is the right seam. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7278] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:14]

## Dead Ends

- No `errorsEnhanced` counter exists in the current deep-pi source; the parent synthesis's mention of it (luna `f-014`) appears to reference an earlier revision. The live counters are `prunedThinking`/`preservedThinking` (`stability.ts:170-171`), which are maintained but NOT wired into `formatDeepPiReport` — the substantive gap stands, the counter name in the parent synthesis is stale.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: parent synthesis referenced `index.ts:1275-1281` for the cache-optimizer predicate; the actual `isDeepPiOwned` sits at `1279-1281`, with `isDeepSeekLikeModel` (broader) at `1275-1277`. Both confirmed present.
- Missing dependencies: no `resource-map.md`; direct source inventory substituted.

## Sources Consulted

- `.pi/extensions/deep-pi/extensions/deeppi/eligibility.ts`
- `.pi/extensions/deep-pi/extensions/deeppi.ts`
- `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts`
- `.pi/extensions/deep-pi/extensions/deeppi/stability.ts`
- `.pi/extensions/deep-pi/extensions/deeppi/utils.ts`
- `.pi/extensions/pi-cache-optimizer/index.ts` (lines 1270-1290, 2535-2550, 2610-2625, 3630-3680, 4060-4110, 6075-6090, 7270-7290)

## Assessment

- New information ratio: 0.8
- Novelty justification: Four of five findings are line-exact independent corroborations of the parent Tier 1 set (new evidence for this lineage, not new to the packet); one finding sharpens the guard mechanism into a concrete test target.
- Questions addressed: Q1 (corroboration), partially Q2 (correctness seams).
- Questions answered: Q1 partially — Tier 1 #1-#4 corroborated with exact line evidence.

## Reflection

- What worked and why: reading the two small deep-pi modules end-to-end plus targeted slices of the 8,390-line `index.ts` gave high-confidence corroboration without re-reading the whole monolith.
- What did not work and why: chasing `errorsEnhanced` wasted a grep; the counter does not exist in the live tree.
- What I would do differently: trust the parent synthesis's finding shapes but always re-verify counter/module names against current source before quoting them.

## Recommended Next Focus

Deep-dive correctness and test coverage: the `message_end` telemetry hook's missing `stopReason` guard, numeric input validation, hashlines edit path, and what pi-cache-optimizer's tests actually exercise (and omit).
