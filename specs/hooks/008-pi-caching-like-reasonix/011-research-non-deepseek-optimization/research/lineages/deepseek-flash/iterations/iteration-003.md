# Iteration 3: Correctness Audit — statsModel/ctxModel Consolidation and Virtual Routing

## Focus

Audit `consolidateDirectProviderStatsModel` (:2390-2416), the response-driven `selectAdapterForAssistantMessage` (:3956-3967), `modelFromAssistantMessage` (:2330-2367), and `isVirtualRoutingModel` (:1137-1144) for correctness holes on the non-DeepSeek stats path.

## Findings

**F3-1. An unrecognized echoed model id in a response silently zeroes out all stats for that request — no fallback to the context model.**
`message_end` picks the adapter via `selectAdapterForAssistantMessage(event.message, ctx.model)` (:8196). That function builds `responseModel = modelFromAssistantMessage(message, model)` and finds the FIRST adapter whose `matchesAssistantMessage(message, responseModel)` is true (:3963-3966). When the response echoes a provider/id that matches NO adapter token (e.g. a mimo/minimax/qwen/glm backend that echoes a short or alternate id, or an aggregator that echoes a backend id like `gpt-4o`), `modelFromAssistantMessage` returns the echoed model (not the ctx fallback, because the message carries its own provider/id — :2337-2340). No adapter matches → `adapter` is `undefined` → `message_end` returns early at :8197 with NO stats recorded for that turn. The context-model fallback never fires because the echoed id is non-empty. Impact: silently missing stats buckets for exactly the third-party OpenAI-compatible providers this research targets. [SOURCE: index.ts:2330-2367, 3956-3967, 8196-8197]

**F3-2. Direct-provider id-drift consolidation is robust for case/shape drift but refuses cross-provider or cross-adapter merges by design.**
`consolidateDirectProviderStatsModel` (:2390-2416) overwrites `id` with `ctxModel.id` whenever provider matches, adapter-object matches, and ids differ (case-insensitivity is irrelevant because ANY difference triggers the overwrite). So the GLM `GLM-5.2-FP8` → `GLM5.2-FP8` echo case is handled. The refusal is reserved for genuine cross-provider or cross-adapter drift: `statsAdapter !== ctxAdapter` → return statsModel unmerged (:2407). For aggregator/backend-echo endpoints this means the footer legitimately shows a different provider bucket than the selected model — intentional, but undocumented for direct providers (the comment frames consolidation around name-drift only). [SOURCE: index.ts:2390-2416]

**F3-3. The elaborate per-provider adapter classification is load-bearing only in the raw-usage fallback path.**
`normalizeWithFallback` (:2591-2597) tries `getPiNormalizedUsage` FIRST (Pi's normalized `input/cacheRead/cacheWrite`), falling back to the per-provider raw reader only when Pi-normalized fields are absent. Pi guarantees normalized fields for messages through its provider pipeline (:2451-2453). So in the common path, the adapter choice only changes the footer LABEL and `warningText` — the usage math is Pi's. The provider-specific raw readers (OpenAI :2502, Anthropic :2529, Gemini :2555) matter only for custom/foreign providers outside Pi's pipeline. Any future "provider X has different cache accounting" fix must target the raw fallback path (or a new Pi-integration surface), not the adapter. [SOURCE: index.ts:2451-2453, 2591-2597]

**F3-4. `isVirtualRoutingModel` flips the whole stats-identity semantic for any provider with a registered router adapter — runtime-dependent and undocumented at the provider level.**
`isVirtualRoutingModel` (:1137-1144) is true when the provider has a router in the runtime-injected registry (`Symbol.for('pi.routing.registry.v1')`). If `opencode`/`opencode-go` register router adapters, ALL their stats become message-local-identity driven (no consolidation, `lastActualRoutedModel` tracking at :8227-8245, upstream-bucket footer). The `modelFromAssistantMessage` name-preservation branch (:2343-2346) also flips. Whether these providers are routers is runtime-state, not statically visible, so the semantics of the two enabled `opencode*`/`opencode-go` deepseek-family models' stats are unknowable from the repo alone — an observability gap in the fork's own code. [SOURCE: index.ts:1137-1144, 2330-2367, 8227-8245]

## Ruled Out

- Case-only echoed-id fragmentation as a bug: consolidation overwrites on ANY id difference, so case-only drift is consolidated, not fragmented (corrected from initial hypothesis during source re-read).
- Whether opencode/opencode-go are router providers: runtime-injected registry, unverifiable statically (same as iteration 1).

## Assessment

- **newInfoRatio**: 0.85 — F3-1 is a concrete silent-stat-loss bug with a clear trigger; F3-2 corrects my own iteration-1 hypothesis; F3-3 reframes where adapter precision matters; F3-4 documents a runtime-dependent semantic.
- **Confidence**: High for F3-1/F3-2/F3-3 (direct control-flow proof); Medium for F3-4 (depends on unobserved runtime registry state).

## Reflection

- What worked: tracing the message_end control flow end-to-end (adapter select → fallback → early return) exposed F3-1 that a grep alone would miss.
- What failed: my initial hypothesis (case-only fragmentation) was disproved by re-reading the consolidation body — captured under Ruled Out per the honesty protocol.
- Ruled out: static router determination.

## Recommended Next Focus

Iteration 4: Anthropic TTL-reordering path correctness — verify `collectAnthropicCacheControlsInWireOrder` (:1508-1534) tools→system→messages ordering, `normalizeAnthropicCacheControlTtlOrder` (:1564-1581), the `hasAnthropicCacheTtlOrderError` matcher (:1553-1562), and the process-local fallback set (`anthropicTtlOrderErrorModels`) for non-Anthropic-origin Anthropic-like endpoints (cacheControlFormat: "anthropic" OpenAI-compatible proxies).
