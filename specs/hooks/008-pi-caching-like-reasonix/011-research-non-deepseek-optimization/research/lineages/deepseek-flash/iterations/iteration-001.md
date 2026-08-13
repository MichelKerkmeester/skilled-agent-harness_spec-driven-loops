# Iteration 1: Provider Coverage Audit

## Focus

Map every enabled model in `.pi/settings.json` to its adapter + hook treatment, verify the `isDeepPiOwned` guard semantics against the "exclusively non-DeepSeek" premise, and inventory which providers are real active surface vs dormant.

## Findings

**F1-1. The active surface is NOT exclusively non-DeepSeek — two enabled DeepSeek-class models remain unguarded.**
`isDeepPiOwned` (index.ts:1462-1465) matches only `provider === 'deepseek'` with `id` exactly `deepseek-v4-flash`/`deepseek-v4-pro`. It is provider-scoped, not model-class-scoped. The fork's own `CHANGES-FROM-UPSTREAM.md:37` states this explicitly: "remains active for every other provider and model, including DeepSeek-family IDs on other providers such as `opencode/deepseek-v4-flash-free`." Empirical post-guard verification (CHANGES-FROM-UPSTREAM.md:49-50) confirms an `opencode/deepseek-v4-flash-free` session "created a new statistics entry." Two of the ten enabled models in settings.json are DeepSeek-class but remain pi-cache-optimizer's active surface: `opencode/deepseek-v4-flash-free` and `opencode-go/deepseek-v4-flash`. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1462-1465] [SOURCE: .pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md:37,49-50] [SOURCE: .pi/settings.json:20,25]

**F1-2. The brief's "no GLM/MiniMax/mimo/Kimi/Qwen-specific handling" is contradicted on existence but confirmed in spirit.**
`CACHE_PROVIDER_ADAPTERS` (index.ts:2983-3950) contains dedicated adapters for Kimi (:3064), Qwen (:3081), GLM (:3098), MiniMax (:3115), Mimo (:3132), Hunyuan (:3149), Mistral (:3167), Grok (:3184), and Llama (:3200). Each is a thin classification wrapper: `id: 'openai'`, `normalizeUsage: normalizeWithFallback(message, getOpenAIRawUsage)`, and the generic OpenAI-proxy compat warning. So per-provider *classification* exists, but per-provider *optimization* is identical to the generic OpenAI-compatible path — no provider-specific cache-control, pricing, or rewrite logic. [SOURCE: index.ts:2983-3950]

**F1-3. Adapter resolution order makes classification order-sensitive for overlapping tokens.**
`selectAdapterForModel` uses `CACHE_PROVIDER_ADAPTERS.find(...)` (index.ts:3952-3954) — first match wins. The adapter array order is: deepseek, claude, openai (GPT), gemini, kimi, qwen, glm, minimax, mimo, hunyuan, mistral, grok, llama. A model id like `opencode/deepseek-v4-flash-free` matches the `deepseek` adapter (deepseek adapter precedes the generic openai adapter). A hypothetical `qwen-deepseek` hybrid id would match deepseek first. For current settings.json ids there is no collision, but the ordering is implicit and un-documented. [SOURCE: index.ts:2983-3950, 3952-3954]

**F1-4. Adapter mapping of the enabled models.**
- `openai-codex/gpt-5.6-sol|terra|luna` → `isOpenAIFamilyModel` (gpt- token) → `openai` adapter (index.ts:3033). Their api is `openai-codex-responses`, which `isOpenAICompatibleApi` (openai-completions|openai-responses only, index.ts:1471-1474) does NOT match — so the optimizer does NOT inject `prompt_cache_key` for codex models (confirmed by `isResponsesPromptRewriteBypassApi` at :1583-1587 which includes openai-codex-responses). The 89% historical hit rate on openai-codex/gpt-5.6-luna therefore comes from Pi's native `prompt_cache_key` = session-id behavior, not from this extension's injection. [SOURCE: index.ts:3033,1471-1474,1583-1587]
- `deepseek/deepseek-v4-pro|flash` → deep-pi-owned → all six guarded hooks return early. [SOURCE: index.ts:7898-8171]
- `opencode/deepseek-v4-flash-free` → deepseek adapter (isDeepSeekLikeModel substring match) → ACTIVE, unguarded. [SOURCE: index.ts:1458-1460]
- `xiaomi/mimo-v2.5-pro`, `xiaomi/mimo-v2.5-pro-ultraspeed` → `isMimoLikeModel` (MIMO_MODEL_PATTERN at :235 matches `mi-?mo`) → mimo adapter. [SOURCE: index.ts:235,1778-1790]
- `minimax/MiniMax-M3` → `isMiniMaxLikeModel` ('minimax') → minimax adapter. [SOURCE: index.ts:1771-1776]
- `opencode-go/qwen3.8-max` → `isQwenLikeModel` ('qwen') → qwen adapter. [SOURCE: index.ts:1757-1762]
- `opencode-go/deepseek-v4-flash` → deepseek adapter, ACTIVE, unguarded. [SOURCE: index.ts:1458-1460]

**F1-5. Gemini adapter has no `warningText`** — unlike the claude/openai adapters, `gemini` (index.ts:3049-3060) never emits a compat warning, so a misconfigured Gemini/Vertex endpoint fails silently on cache compat. [SOURCE: index.ts:3049-3060]

## Ruled Out

- Attempted to statically resolve whether `opencode`/`opencode-go` are router providers (which would change guard evaluation via `resolveRouteModel`). The routing registry is runtime-injected (`Symbol.for('pi.routing.registry.v1')`, index.ts:965-977) and not readable from the repo. Ruled out static resolution; the empirical CHANGES-FROM-UPSTREAM.md:50 record is the authoritative confirmation that opencode/deepseek-v4-flash-free is active surface.

## Assessment

- **newInfoRatio**: 0.95 — F1-1 and F1-2 materially correct the session premise; F1-4 is a precise inventory. Remaining novelty from F1-3/F1-5 is marginal.
- **Confidence**: High for F1-1/F1-2 (direct source + fork changelog + test run). Medium for F1-4's codex claim (depends on Pi native behavior inferred from baseline, not directly observed in this session).

## Reflection

- What worked: reading `CHANGES-FROM-UPSTREAM.md` as a first-class evidence source (it carries the empirical guard verification); running `npm test` (34/34 pass, 8 suites — matches brief).
- What failed: static routing-registry resolution is impossible from repo files.
- Ruled out: static router determination.

## Recommended Next Focus

Iteration 2: cache-hit-rate economics for the real active surface — audit `prompt_cache_key` injection gates (isOpenAICompatibleApi excludes codex-responses), `prompt_cache_retention` gating (gates 1-4 at before_provider_request index.ts:8068-8100), and whether the OpenAI-compatible rewrite path (churn strip, skill compression, stable-prefix reorder) is actually beneficial for the providers in settings.json.
