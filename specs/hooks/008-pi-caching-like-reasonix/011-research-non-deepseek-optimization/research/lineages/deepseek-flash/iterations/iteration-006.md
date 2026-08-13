# Iteration 6: Test Coverage Breadth Audit

## Focus

Inventory exactly which provider paths the 34-test suite actually exercises vs assumes, and confirm whether any non-DeepSeek provider-specific behavior is tested.

## Findings

**F6-1. The entire non-DeepSeek provider-specific surface is untested.**
A targeted grep across all `tests/*.ts` for the provider-specific symbols returns ZERO coverage of: `getOpenAIRawUsage`, `getAnthropicRawUsage`, `getGeminiRawUsage` (the three raw fallback normalizers, index.ts:2502-2585), `addOpenAIPromptCacheKey`/`prompt_cache_key` injection (:2599-2612), `normalizeAnthropicCacheControlTtlOrder`/`downgradeAnthropicLongCacheControls` (:1542-1581), and ALL non-DeepSeek classifier predicates (`isMimoLikeModel`, `isMiniMaxLikeModel`, `isQwenLikeModel`, `isGLMLikeModel`, `isKimiLikeModel`, plus hunyuan/mistral/grok/llama, index.ts:1750-1810). Also untested: `selectAdapterForAssistantMessage`, `modelFromAssistantMessage`, `consolidateDirectProviderStatsModel`, `isVirtualRoutingModel`, and the 403/400 diagnostics (`isPromptCacheRetention400Applicable`, `isSessionAffinity403Applicable`, `isOpenAISdkHeader403Applicable`, `hasPromptCacheRetentionUnsupportedSignal`). Consequence: every concrete defect found in iterations 1-4 (F1-2's adapter inventory, F2-2's prompt_cache_key no-self-heal, F3-1's silent stat loss on unrecognized echoed ids, F4-1's TTL-repair unreachable for cacheControlFormat endpoints) would pass CI unchanged. [SOURCE: tests/hook-guards.test.ts, tests/ownership-composition.test.ts, tests/review-findings.test.ts — symbol grep]

**F6-2. hook-guards.test.ts tests only the guard's suppression side on the owned model — never the intended non-DeepSeek behavior.**
All six hook-guard tests use `ownedModel()` (provider `deepseek`, id `deepseek-v4-flash`, tests/hook-guards.test.ts:38-53) and assert side-effect COUNTERS stay at zero (sessionReads, statuses, notifications). There is no negative-case test where a mimo/qwen/glm/minimax/gpt model actually flows through `before_agent_start` (rewrite applied) or `before_provider_request` (cache_key injected, retention stripped). The fork's core non-DeepSeek mutations are therefore only exercised indirectly (stable-reorder/compat tests in review-findings) and by live sessions — no regression harness pins the actual non-DeepSeek behavior. [SOURCE: tests/hook-guards.test.ts:111-186]

**F6-3. The only provider-behavior-adjacent tests are the `prompt_cache_retention` strip gates — well covered.**
review-findings.test.ts:642-652 verifies the before_provider_request retention gate both ways (denied payload strips the field; allowed payload preserves it), and :670-955 covers modelOverrides/fix-command compat edits including `supportsLongCacheRetention`. This is the best-tested non-DeepSeek mutation path — consistent with F2-3's assessment that retention gating is the best-guarded logic. But the adjacent `prompt_cache_key` injection (same hook, same payload mutation class) has no equivalent test. [SOURCE: tests/review-findings.test.ts:642-652]

**F6-4. The ownership-composition fixture is single-purpose (boundary alignment), not behavior coverage.**
`deepseek-ownership.json` keeps `eligibility.isDeepPiModel` and `__internals_for_tests.isDeepPiOwned` aligned across both forks (tests/ownership-composition.test.ts:24-26, 85-103) — valuable for preventing guard drift, but it pins only the ownership boundary, not any non-DeepSeek provider behavior. The `excluded` fixture set (non-owned models) is asserted for no-ownership, not for correct cache-optimizer behavior. [SOURCE: tests/ownership-composition.test.ts:84-141]

## Ruled Out

- That `prompt_cache_key` injection is tested under a different name: the grep for `prompt_cache_key` (and `addOpenAIPromptCacheKey`) returns no test-file matches; only `prompt_cache_retention` appears.

## Assessment

- **newInfoRatio**: 0.70 — F6-1 quantifies a broad blind spot with line-level symbol proof; F6-2/F6-3/F6-4 frame what IS vs ISN'T pinned.
- **Confidence**: High (systematic symbol grep + full read of two test files).

## Reflection

- What worked: symbol-level grep against the test suite produced an exhaustive coverage inventory quickly.
- What failed: nothing material; the coverage picture is unambiguous.
- Ruled out: prompt_cache_key test existence.

## Recommended Next Focus

Iteration 7: error handling/fallback on the non-DeepSeek path — audit the after_provider_response 400/403 diagnostics, the warned-sets (dedup/warn-once), the promptCacheRetention400Models self-heal, and what happens to a provider whose payload mutations fail (rewrite exceptions, cache-key clamp edge cases).
