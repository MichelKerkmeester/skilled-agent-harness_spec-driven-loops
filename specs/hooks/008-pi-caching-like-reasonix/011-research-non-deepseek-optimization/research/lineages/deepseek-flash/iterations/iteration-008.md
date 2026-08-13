# Iteration 8: Gemini-Specific Path Correctness

## Focus

Audit the Gemini/Vertex surface — `isGeminiLikeModel`/`isGeminiLikeAssistantMessage` (:1615-1621), the Gemini adapter (:3049-3060), `getGeminiRawUsage` (:2555-2585) — and its interaction with the hook mutations, including the "Gemini served over an OpenAI-compatible proxy" scenario.

## Findings

**F8-1. The Gemini path is entirely passive for native-API Gemini, but NOT for Gemini-via-OpenAI-compatible-proxy — and the latter gets the wrong usage normalizer.**
For a Gemini model using its native API (no openai-completions/responses transport), none of the mutation hooks apply: `before_agent_start`'s rewrite only fires for non-responses models but the retention/cache-key injection gates (`shouldInjectOpenAIPromptCacheKeyForModel` :1504) require an OpenAI-compatible api, and Gemini has no cache_control rewrite — so the model gets footer measurement only. But a Gemini model served via `openai-completions` IS subject to the full rewrite + `prompt_cache_key` injection + retention strip (none of the gates exclude gemini models). Critically, adapter selection keys on MODEL identity, not transport: `selectAdapterForModel` matches the `gemini` adapter (:3049) for a Gemini id regardless of api, so `normalizeUsage` uses `getGeminiRawUsage` (:2555) — which parses `usageMetadata.cachedContentTokenCount`. If such a proxy returns OpenAI-shaped raw usage (`prompt_tokens_details.cached_tokens`, no `usageMetadata`), the raw fallback returns `undefined` → no stats bucket for that turn. The mismatch is invisible only when Pi-normalized usage is present (the common case). [SOURCE: index.ts:1504-1506, 2555-2585, 3049-3060, 3952-3954]

**F8-2. The Gemini adapter has no `warningText` — asymmetric with the claude adapter, so misconfiguration fails silently.**
`claude` adapter emits a compat warning when a Claude-like model on an OpenAI-compatible api lacks `cacheControlFormat: "anthropic"` (:3017-3030); `openai`/kimi/qwen/glm/minimax/mimo adapters emit the generic proxy-compat warning. The `gemini` adapter (:3049-3060) has NO `warningText` property at all — `notifyCacheCompatIfNeeded` (:3991-3999) finds no text and stays silent. A Gemini/Vertex endpoint misconfigured for cache (wrong api, missing compat) produces zero diagnostics. Same gap as F1-5, now scoped. [SOURCE: index.ts:3017-3030, 3049-3060, 3991-3999]

**F8-3. `getGeminiRawUsage` hardcodes `cacheWrite: 0` — correct for official Gemini, but cache-write economics are invisible.**
Official Gemini uses a server-managed context cache with no per-request cache-write token counter in `usageMetadata`, so `cacheWrite: 0` is the right value for the official API (:2584). The side effect: the footer cannot reflect Gemini's cache-write cost asymmetry (context-cache writes are billed at a premium TTL), so the "savings" number for a Gemini model is purely read-side. Not a bug; an economics-observability limitation. [SOURCE: index.ts:2555-2585]

**F8-4. A full Gemini cache miss on the raw-fallback path records nothing.**
`getGeminiRawUsage` returns `undefined` when `cachedContentTokenCount` is absent (:2567-2571) — i.e. a raw Gemini response with no cache read. `normalizeWithFallback` then yields undefined and `message_end` records only a "recent sample" with missing fields, not a stats-bucket update (:8248-8263). Contrast with the DeepSeek path where `allowInputOnlyPiUsage: true` (:2993) lets a full miss still count toward the denominator. The Gemini raw path has no equivalent miss-counting. Low severity (Pi normalization normally masks it). [SOURCE: index.ts:2555-2585, 2993, 8248-8263]

**F8-5. Gemini is dormant surface for this user — correctness is future-facing.**
No `gemini`/`vertex` model appears in `.pi/settings.json` enabledModels. `CACHE_PROVIDER_IDS` (:133) and the legacy-family rollover (:7705) still carry `gemini`, so the family bucket is maintained, but no live Gemini traffic exercises these paths today. The F8-1 normalizer mismatch would only bite when a Gemini model is actually added. [SOURCE: .pi/settings.json:14-26, index.ts:133, 7704-7711]

## Ruled Out

- That `cacheWrite: 0` is an accounting bug for official Gemini: official usageMetadata has no cache-write counter, so the value is correct (F8-3).

## Assessment

- **newInfoRatio**: 0.55 — F8-1's normalizer-mismatch (gemini raw parser on an openai-completions transport) is the novel correctness finding; F8-2 reframes F1-5; F8-3/F8-4/F8-5 are lower-severity framing.
- **Confidence**: High for F8-1/F8-2 (control-flow proof), Medium for F8-3/F8-4 (depend on provider-specific response shapes), High for F8-5 (settings read).

## Reflection

- What worked: separating "passive for native-API" from "active-with-wrong-normalizer for openai-completions" clarified the conditional surface.
- What failed: cannot observe a real Gemini response to confirm the raw-fallback shapes.
- Ruled out: Gemini cache-write accounting bug.

## Recommended Next Focus

Iteration 9: cache economics / token accounting accuracy across non-DeepSeek providers — reconcile the footer hit-rate metric definition (cacheRead/totalInput) against each adapter's accounting, the `getPiNormalizedUsage` denominator floor, and whether per-provider token denominators (Anthropic input_tokens semantics vs OpenAI prompt_tokens) distort cross-provider hit-rate comparisons.
