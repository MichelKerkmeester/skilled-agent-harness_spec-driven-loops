# Iteration 4: Anthropic TTL-Reordering Path Correctness

## Focus

Verify the Anthropic cache_control TTL-ordering repair chain — `collectAnthropicCacheControlsInWireOrder` (:1508-1534), `normalizeAnthropicCacheControlTtlOrder` (:1564-1581), `downgradeAnthropicLongCacheControls` (:1542-1551), `hasAnthropicCacheTtlOrderError` (:1553-1562), and the process-local `anthropicTtlOrderErrorModels` set — including coverage for OpenAI-compatible Anthropic-format endpoints.

## Findings

**F4-1. The TTL-ordering repair is gated to `isAnthropicMessagesApi` — OpenAI-compatible Claude-proxy endpoints that the adapter itself steers users toward are never repaired.**
`before_provider_request` runs the repair only `if (requestModel && isAnthropicMessagesApi(requestModel.api))` (:8061-8066). But the `claude` adapter's own `warningText` (:3017-3030) tells users with Claude-like models on OpenAI-compatible APIs to set `cacheControlFormat: "anthropic"` so Pi places Anthropic cache_control breakpoints — precisely the breakpoints subject to the same 1h-before-5m ordering constraint. Those endpoints (api = openai-completions) never hit the repair branch, so a 1h-after-5m ordering error on such an endpoint 400s with no visible repair and no error-set fallback. The repair logic exists for exactly this failure and is unreachable for the format the adapter recommends. [SOURCE: index.ts:3017-3030, 8061-8066]

**F4-2. `downgradeAnthropicLongCacheControls` is over-broad: one invalid 1h-after-5m transition downgrades ALL 1h breakpoints to default 5m, including valid 1h breakpoints that precede the first 5m.**
`normalizeAnthropicCacheControlTtlOrder` (:1564-1581) detects a single `1h` after any short/default breakpoint and then `downgradeAnthropicLongCacheControls` (:1542-1551) deletes `ttl` from EVERY control with `ttl === '1h'` in wire order. A payload shaped `[1h][1h][5m][1h]` keeps the first two 1h breakpoints but downgrades them anyway. Correctness-safe (Anthropic accepts 5m anywhere), but economically blunt: the valid 1h prefix loses long retention, so the subsequent turns re-write cache at the more expensive default TTL. [SOURCE: index.ts:1542-1581]

**F4-3. `hasAnthropicCacheTtlOrderError` is a brittle string matcher on Anthropic's exact error phrasing.**
The matcher (:1553-1562) requires the stopReason error to contain all of `cache_control`, `ttl='1h'`, `ttl='5m'`, and `must not come after`. A proxy that rephrases the same 400 (e.g. "cache breakpoints are out of order" or a JSON error body that Pi folds into errorMessage differently) fails the matcher → the model key is never added to `anthropicTtlOrderErrorModels` → the next-request fallback downgrade never arms → repeated 400s with no repair. The visible-payload repair at :8062 covers only breakpoints visible before the proxy; proxy-injected breakpoints depend entirely on this matcher (acknowledged at :8059-8060). [SOURCE: index.ts:1553-1562, 8059-8066]

**F4-4. The fallback is process-local and permanent once armed: no re-escalation attempt within the process.**
`message_end` adds `modelKey(errorModel)` to the set (:8183) and no code path removes it before process exit. Every subsequent request for that model is downgraded to 5m TTL for the process lifetime (until `/reload`). The `/cache-optimizer fix` suggestion (`supportsLongCacheRetention: false`, :7371-7379) is directionally consistent because long retention is the source of the 1h TTLs — so the remediation and the process-local repair both remove 1h breakpoints. The trade-off: a transient proxy misordering permanently (for the process) eliminates 1h retention for that model. [SOURCE: index.ts:7371-7379, 8183-8194]

## Ruled Out

- That the `/cache-optimizer fix` suggestion for TTL-order errors is a wrong-knob: long retention is the 1h-TTL source, so `supportsLongCacheRetention: false` is a coherent root-cause fix (verified against the 1h breakpoint source). Documented rather than flagged.

## Assessment

- **newInfoRatio**: 0.75 — F4-1 is the strongest (a repair path unreachable for the exact endpoint family the adapter recommends); F4-2/F4-3/F4-4 are real but lower-severity economics/robustness issues.
- **Confidence**: High for F4-1/F4-2 (direct gate + control-flow proof), Medium for F4-3 (proxy rephrasing is inferential), High for F4-4 (no removal path found in a targeted grep).

## Reflection

- What worked: checking every call site of the downgrade/normalize functions showed the repair is only wired to the anthropic-messages gate.
- What failed: the exact trigger conditions of proxy-side breakpoint injection are not observable from the repo.
- Ruled out: fix-suggestion wrong-knob hypothesis (remediation is coherent).

## Recommended Next Focus

Iteration 5: footerMode/config persistence maintainability — audit the versioned JSON config lifecycle (:1299-1362), env-vs-config precedence, atomic write path, and whether the config surface scales for future per-model options (given F2-2's prompt_cache_key finding needs a per-model opt-out).
