# Iteration 9: Cache Economics / Token Accounting Accuracy (Non-DeepSeek)

## Focus

Reconcile the footer metric definitions against each adapter's accounting — binary hit metric, token-savings denominators, cache-write display, and cross-provider comparability — for the non-DeepSeek surface.

## Findings

**F9-1. The headline "hit rate" is a binary request metric (`hitRequests` increments whenever `cacheRead > 0`), which overstates economics for partial-cache requests.**
`addUsageToCacheStats` (:4033-4039) sets `hitRequests += 1` when `cacheRead > 0` regardless of the cached fraction. A request that caches 1 token of a 10k-token prompt counts as a hit. The baseline's "89/100 requests, 89% hit rate" is this binary metric; the parallel "6.29M/7.19M tokens (~87%)" is the honest token metric. Both appear in the footer (`formatCacheStats` :4050-4061 shows `hitRequests/totalRequests` AND the token ratio), so a reader can see the truth — but any headline single-number summary uses the optimistic binary ratio. [SOURCE: index.ts:4033-4061]

**F9-2. Token-savings denominators are consistent "full prompt" across providers — cross-provider token comparison is valid; but token savings ≠ cost savings.**
Verified the identity math for each family:
- DeepSeek raw: `totalInput = prompt_tokens = hit + miss` (:2492-2494).
- OpenAI raw: `totalInput = prompt_tokens` (:2516-2521).
- Anthropic raw: `totalInput = input_tokens + cache_read + cache_creation` (:2544-2548) — matches Anthropic's documented total-input identity.
- Gemini raw: `totalInput = promptTokenCount` (includes cached content) (:2573-2582).
So the denominator consistently means "full prompt tokens" and a token-percent cross-provider comparison is apples-to-apples. The limitation is economic, not arithmetic: cache-read/write pricing differs by provider (Anthropic read ~0.1x input, Gemini context-cache read ~0.25x, OpenAI cached-input ~0.1x), so the same 87% token ratio means very different cost savings per provider — and the footer shows only tokens, never cost. [SOURCE: index.ts:2484-2585]

**F9-3. Cache-write volume is tracked for every adapter but displayed only for Anthropic.**
`cacheWriteInputTokens` accumulates for all adapters (:4037), but `formatCacheStats` shows the write line only when `adapter.showCacheWrite` is true (:4054), and only the `claude` adapter sets it (:3008). OpenAI-compatible proxies that do report `cache_write_tokens`/`cacheWriteTokens` (parsed by `getOpenAIRawUsage` :2514-2515) have their write volume silently invisible. A display-consistency gap that under-reports economics on the very providers F2-2 targets. [SOURCE: index.ts:3008, 4037, 4054-4056, 2514-2515]

**F9-4. Full-miss accounting is inconsistent across foreign-provider raw fallbacks: Anthropic-family full misses drop out of the denominator.**
`getOpenAIRawUsage` returns a snapshot on a full miss because `cached_tokens: 0` is a present value → `cacheRead = 0` is not `undefined` (:2510-2512). `getAnthropicRawUsage` returns `undefined` when BOTH `cache_read_input_tokens` AND `cache_creation_input_tokens` are absent (:2541) — a full miss with neither field present is not counted, so the request increments neither numerator nor denominator. Same for `getGeminiRawUsage` (F8-4). `message_end` then skips the stats update (:8261-8264). Under Pi-normalized usage this is masked (Pi guarantees present fields), but for the custom/foreign-provider path — the exact audience the raw fallbacks serve — a full Anthropic-shape miss quietly loses denominator data. [SOURCE: index.ts:2502-2524, 2529-2550, 2555-2585, 8261-8264]

**F9-5. Zero-usage requests dilute the request denominator.**
A message with present-but-zero usage (`input:0, cacheRead:0, cacheWrite:0`) passes `getPiNormalizedUsage` (hasCacheSignal true, :2464) and `addUsageToCacheStats` increments `totalRequests` with `totalInputTokens += 0` (:4033-4039). The error/aborted guard (:8206-8208) filters failed attempts, but a legitimate provider response with an empty usage block still registers a request that can only deflate the hit ratio. Low-severity edge case, distinct from the F3-1 zero-stats path. [SOURCE: index.ts:2457-2478, 4033-4039, 8206-8208]

## Ruled Out

- A denominator inconsistency across providers: verified all four raw normalizers produce full-prompt totals (F9-2) — the denominators are consistent; the gap is cost-economics display, not arithmetic.

## Assessment

- **newInfoRatio**: 0.60 — F9-4 (Anthropic/Gemini full-miss denominator loss on the foreign-provider path) and F9-3 (write display asymmetry) are the concrete findings; F9-1/F9-2/F9-5 frame the metric semantics.
- **Confidence**: High for F9-1/F9-2/F9-3/F9-5 (direct arithmetic), Medium for F9-4 (depends on provider field-omission behavior).

## Reflection

- What worked: writing out each normalizer's identity math made the consistency conclusion verifiable rather than asserted.
- What failed: cannot observe a real foreign-provider response to confirm whether Anthropic-style fields are omitted on full misses.
- Ruled out: cross-provider denominator inconsistency.

## Recommended Next Focus

Iteration 10: maintainability / drift / comments / structure — assess the vendored-fork drift risk (CHANGES-FROM-UPSTREAM vs upstream v2.8.0), the comment-hygiene of the non-DeepSeek sections, the 9,239-line monolith's structure, and which maintainability levers would reduce the risk of the findings in iterations 1-9 regressing.
