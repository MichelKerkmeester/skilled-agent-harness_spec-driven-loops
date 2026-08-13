# Iteration 2: Cache-Hit-Rate Economics for the Real Active Surface

## Focus

Audit the optimizer's cache-hit-rate levers — `prompt_cache_key` injection gates, `prompt_cache_retention` gating, and the OpenAI-compatible prompt-rewrite path — and quantify what each contributes for the models actually enabled in `.pi/settings.json`.

## Findings

**F2-1. For the historical dominant workload (openai-codex/gpt-5.6-luna, 100% of baseline traffic), the optimizer contributes ZERO cache-hit-rate improvement.**
- `isResponsesPromptRewriteBypassApi` (:1583-1587) matches `openai-codex-responses`, so `before_agent_start` skips all prompt mutations for codex models.
- `shouldInjectOpenAIPromptCacheKeyForModel` (:1504-1506) requires `isOpenAICompatibleApi` (:1471-1474), which only matches `openai-completions`/`openai-responses` — NOT `openai-codex-responses`. So no `prompt_cache_key` injection either.
- The baseline 89% hit rate / 87% token savings therefore come entirely from Pi-native behavior (server-side caching keyed on the session id Pi already sends), not from this extension. The extension's remaining value for the model family that drives all historical traffic is: footer stats, the process-global `PI_CACHE_RETENTION=long` env, and compat/404 diagnostics. [SOURCE: index.ts:1471-1474, 1504-1506, 1583-1587]

**F2-2. `prompt_cache_key` injection has NO 400 self-heal and NO per-model opt-out for third-party OpenAI-compatible providers.**
`before_provider_request` injects `prompt_cache_key` = session id into the payload of every `openai-completions`/`openai-responses` model whenever the global `shouldInjectOpenAIPromptCacheKey()` (:1371-1376) is on (only global env vars `PI_CACHE_OPTIMIZER_NO_OPENAI_CACHE_KEY` / `PI_CACHE_OPTIMIZER_OPENAI_CACHE_KEY` disable it). The 400 detector `hasPromptCacheRetentionUnsupportedSignal` (:2714-2735) matches ONLY rejections that mention `prompt_cache_retention`; the `after_provider_response` 400 handler (:8114-8129) further gates on `isPromptCacheRetention400Applicable` (:4768-4773, requires `supportsLongCacheRetention === true`). A third-party proxy that rejects `prompt_cache_key` (an OpenAI-specific parameter many proxies don't accept) gets persistent 400s with no diagnostic and no automatic disable — unlike `prompt_cache_retention`, which has a 4-gate self-healing strip. This is the largest unguarded mutation on the non-DeepSeek path. [SOURCE: index.ts:1371-1376, 2599-2616, 2714-2735, 4768-4773, 8114-8129]

**F2-3. `prompt_cache_retention` gating is the best-guarded mutation in the fork — sound design.**
The 4-gate order at `before_provider_request` (:8068-8100): (1) official OpenAI → keep, (2) empirical 400 history → strip (overrides user opt-in), (3) explicit models.json opt-in → keep, (4) everything else → strip (safe default). Gate 2-before-3 ordering is explicitly correct: an opted-in model that 400s must still be stripped or the 400 repeats. Note `supportsLongCacheRetention` is intentionally excluded from the ⚠️ compat marker (:2674-2679) with the strip doing the enforcement. [SOURCE: index.ts:8068-8100, 2674-2679]

**F2-4. The full prompt-rewrite path (churn strip :732, skill compression :650, stable-prefix reorder :815) applies unconditionally to every non-responses OpenAI-compatible model — with no prefix-cache-support compat flag.**
The rewrite is designed for exact-prefix caching providers (DeepSeek/Anthropic-style). It runs for mimo/minimax/qwen/glm-class models routed via openai-completions regardless of whether the endpoint actually caches on prompt prefix. The codex bypass comment (:7941-7966) documents that reordering can trip content-safety filters on some endpoints; the same risk class exists for unknown third-party completions endpoints, with no equivalent assessment gate. Whether mimo/minimax/qwen endpoints benefit from (or tolerate) the reorder is unverified. [SOURCE: index.ts:650, 732, 815, 7941-7966]

**F2-5. `prompt_cache_key` is the same Pi session id (clamped to 64 chars) for every provider and model in a session.**
`getSessionPromptCacheKey` (:921-923) returns `clampPromptCacheKey(ctx.sessionManager.getSessionId())`. A `model_select` within one session reuses the identical key across the old and new model. At a provider that keys its cache solely on `prompt_cache_key`, this is a cross-model collision surface; at a provider that ignores the field it is inert. Per-model or per-provider key namespacing is absent. [SOURCE: index.ts:912-923, 2599-2616]

## Ruled Out

- Whether Pi natively sends `prompt_cache_key` for codex-responses endpoints (vs the extension doing it): the extension does NOT inject for codex (F2-1, gate proof), and the baseline hit rate is real, so Pi-native server-side caching is the only remaining explanation. Not independently reproducible from repo files.

## Assessment

- **newInfoRatio**: 0.90 — F2-1 reframes where the historical economics actually come from; F2-2 is a concrete unguarded-mutation gap with line-level proof. F2-3-F2-5 are secondary.
- **Confidence**: High for F2-1 (pure gate analysis), High for F2-2 (pure gate analysis), Medium for F2-4/F2-5 (depend on unobserved third-party endpoint behavior).

## Reflection

- What worked: tracing each lever from gate function to hook call site gave a precise "who contributes what" map.
- What failed: no per-provider endpoint behavior is observable from the repo; claims about mimo/minimax/qwen prefix-caching remain inferential.
- Ruled out: Pi-native codex cache-key mechanics (unobservable here).

## Recommended Next Focus

Iteration 3: correctness audit of statsModel/ctxModel consolidation and virtual-routing detection — verify `consolidateDirectProviderStatsModel` (:2390-2416) against the adapters, the `selectAdapterForAssistantMessage` request-local override, and whether adapter `matchesAssistantMessage` can misclassify a response (e.g., a qwen response echoed under a mimo model id).
