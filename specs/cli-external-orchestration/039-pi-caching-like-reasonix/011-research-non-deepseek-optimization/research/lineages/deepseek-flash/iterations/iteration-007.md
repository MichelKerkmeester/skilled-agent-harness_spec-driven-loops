# Iteration 7: Error Handling / Fallback on the Non-DeepSeek Path

## Focus

Audit the `after_provider_response` 400/403 diagnostics, warn-once sets, `promptCacheRetention400Models` self-heal, rewrite-exception safety in `before_agent_start`, and stats-persistence failure handling.

## Findings

**F7-1. The 400-detection surface is header-text-dependent and body-blind — the retention self-heal can silently fail to arm.**
`hasPromptCacheRetentionUnsupportedSignal` (:2714-2735) only inspects `event.headers`, joins key/value pairs, and requires both `prompt_cache_retention` AND an unsupported-parameter phrase. If Pi delivers the error detail in the response BODY (common for JSON-error APIs) rather than headers, or a proxy rephrases the message, the detector returns false → the model key is never added to `promptCacheRetention400Models` → the gate-2 strip in `before_provider_request` never arms → the 400 repeats every request. Combined with F2-2 (a `prompt_cache_key` rejection is undetectable here by construction), the fork's entire 400 self-heal capability depends on a single brittle text/header heuristic with no body-based fallback. [SOURCE: index.ts:2714-2735, 8114-8129]

**F7-2. The `before_agent_start` prompt-rewrite steps have no outer exception guard.**
The rewrite chain — `stripSessionOverviewChurn` (:732), `compressSkillsInSystemPrompt` (:650), `optimizeSystemPrompt` (:815) — runs in the hook body (index.ts:7982-8049) with no try/catch wrapper. Truncation safety is handled internally via the WORM flag (`promptTruncationDetected`, set at :897), which protects against a specific structural-truncation failure, but any other malformed-prompt shape (e.g. a non-string `event.systemPrompt` oddity or a skills option structure the compressor doesn't expect) would throw and propagate out of the hook. In Pi, a throwing `before_agent_start` hook is a startup-abort risk for the agent turn. The cost of an outer guard is trivial and the surface is exactly the non-DeepSeek rewrite path this research targets. [SOURCE: index.ts:732, 815, 897, 7982-8049]

**F7-3. Self-heal and warn-once sets are correctness-first but permanent per process — no re-probe or cooldown.**
`promptCacheRetention400Models`, `sendSessionAffinityHeaders403Models`, `openAISdkHeader403Models`, and `anthropicTtlOrderErrorModels` are process-local Sets that only ever grow. Warn-once dedup (:8120-8121, :8139-8140, :8157-8158, :8184-8185) is correct UX, and the retention strip is the right self-heal — but a transient provider glitch permanently downgrades that model for the process lifetime (retention stripped / 1h TTLs downgraded) with no cooldown-and-retry. Acceptable for correctness-first, but there is no recovery path short of `/reload`. [SOURCE: index.ts:8114-8194]

**F7-4. Stats-persistence failure handling is the best-guarded subsystem: graceful degradation to in-memory.**
`persistCacheStats` is wrapped in try/catch with a warn-once `persistenceWarningShown` flag (:7634-7647) that notifies "using in-memory stats for this process" — footer stats keep working, only durability is lost. Both the debounced path (:7654-7662) and the flush path (:7666-7672) catch; `session_shutdown` flushes under try/finally (:7905-7913). No fix needed here. [SOURCE: index.ts:7634-7672, 7905-7913]

**F7-5. `before_provider_request` payload mutation is shape-safe.**
Non-object payloads are skipped by `asRecord` guards (`collectAnthropicCacheControlsInWireOrder` :1512, `addOpenAIPromptCacheKey` :2603) and the `typeof payload.prompt_cache_retention === 'string'` check (:8085); `getSessionPromptCacheKey` returns undefined safely when the session id is empty (:921-923). No throw path found on odd payload shapes. [SOURCE: index.ts:1512, 2603, 8085, 921-923]

## Ruled Out

- That `before_provider_request` throws on non-object payloads: disproved via asRecord/typeof guards (F7-5).
- Whether Pi's host catches hook exceptions: unverifiable from this repo; F7-2 is framed as a risk, not a confirmed host behavior.

## Assessment

- **newInfoRatio**: 0.65 — F7-1 sharpens F2-2 with the header-only detection detail; F7-2 is a concrete unguarded surface; F7-3/F7-4/F7-5 are framing of existing design trade-offs.
- **Confidence**: High for F7-1/F7-5 (control-flow proof), Medium for F7-2 (host behavior unobserved), High for F7-3/F7-4 (direct reads).

## Reflection

- What worked: separating "detection" (header heuristic) from "remediation" (self-heal sets) made the fragility obvious.
- What failed: cannot observe Pi's hook-exception handling to confirm F7-2's impact severity.
- Ruled out: payload-shape throw paths.

## Recommended Next Focus

Iteration 8: Gemini-specific path correctness — audit `isGeminiLikeModel`/`isGeminiLikeAssistantMessage` (:1615-1621), the Gemini adapter (:3049-3060) lacking warningText, `getGeminiRawUsage` (:2555-2585) hardcoding cacheWrite=0, and whether the Gemini path's missing cache-write accounting distorts the footer hit-rate.
