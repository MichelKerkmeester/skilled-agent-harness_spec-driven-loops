# pi-cache-optimizer non-DeepSeek optimization — deepseek-flash lineage research

Detached fan-out lineage `fanout-deepseek-flash-1786253178211-cxy5n1` (executor cli-opencode / deepseek-v4-flash). 10 forced-depth iterations over the vendored `pi-cache-optimizer` fork at `.pi/extensions/pi-cache-optimizer/index.ts` (9,239 lines), `.pi/settings.json`, the fork's test suite, and `CHANGES-FROM-UPSTREAM.md`. Stop policy: `max-iterations` (convergence treated as telemetry only).

## 1. Executive Verdict

The fork's remaining active surface is **not** exclusively non-DeepSeek as the session premise assumed: two enabled DeepSeek-class models (`opencode/deepseek-v4-flash-free`, `opencode-go/deepseek-v4-flash`) are explicitly excluded from the deep-pi ownership boundary and remain full pi-cache-optimizer surface. On the genuine non-DeepSeek path, the strongest optimization opportunities are: **(P0)** `prompt_cache_key` injection has no 400 self-heal and no per-model opt-out (it is the least-guarded mutation in the fork); **(P0)** a response that echoes an unrecognized provider/model id silently zeroes message_end stats with no context-model fallback; **(P1)** the Anthropic TTL-ordering repair is unreachable for OpenAI-compatible `cacheControlFormat: "anthropic"` endpoints — the exact format the claude adapter recommends; **(P1)** the entire non-DeepSeek provider-specific surface is untested (every classifier, raw normalizer, cache-key injection, TTL repair, and 403/400 diagnostic). Historical economics are unchanged: the 89% baseline hit rate on openai-codex came entirely from Pi-native server-side caching, so this fork adds no provider-side cache-hit contribution for that workload; it still requests `PI_CACHE_RETENTION=long` and provides local stats and diagnostics.

## 2. Method

10 iterations, each with a single focus and 3-5 evidence actions: targeted `read`/`rg` of `index.ts` at line-verified call sites, the enabled-models list in `.pi/settings.json`, the three test files (`tests/hook-guards.test.ts`, `tests/ownership-composition.test.ts`, `tests/review-findings.test.ts`), `CHANGES-FROM-UPSTREAM.md`, `tests/` symbol grep, and a `tsc --noEmit` run. All claims cite `file:line`. Prior confirmed evidence from the session brief was cited and built on, not re-discovered. Every iteration recorded `newInfoRatio`; ruled-out directions were captured in both iteration files and JSONL.

## 3. Source Reliability Classes

- **Class A (direct source proof):** `index.ts` control flow, `tests/*.ts`, `CHANGES-FROM-UPSTREAM.md`, `.pi/settings.json`, `.pi/extensions/shared/deepseek-ownership.json`, `tsc --noEmit`.
- **Class B (runtime-dependent, unobservable statically):** whether `opencode`/`opencode-go` register router adapters (routing registry is runtime-injected), whether third-party endpoints echo/omit usage fields, Pi's host hook-exception handling, upstream `jiangge/pi-cache-optimizer` drift state.

## 4. Key Findings (priority-ranked)

### P0 — Correctness / least-guarded mutation

**K1. `prompt_cache_key` injection has no 400 self-heal and no per-model opt-out.** `before_provider_request` injects `prompt_cache_key` (= clamped Pi session id) into every `openai-completions`/`openai-responses` model whenever the global toggle is on (index.ts:1371-1376, 2599-2616). The only 400 detector is `hasPromptCacheRetentionUnsupportedSignal` (:2714-2735), which requires the header text to mention `prompt_cache_retention`; the `after_provider_response` 400 path further gates on `isPromptCacheRetention400Applicable` (:4768-4773, requires `supportsLongCacheRetention === true`). A third-party proxy rejecting `prompt_cache_key` 400s persistently with no diagnostic and no automatic disable. Contrast with `prompt_cache_retention`, which has a 4-gate self-healing strip (:8068-8100). [iterations 2, 7]

**K2. An unrecognized echoed model id in a response silently zeroes message_end stats.** `selectAdapterForAssistantMessage` (:3956-3967) builds the response model from message metadata; if the echoed provider/id matches no adapter token, `adapter` is `undefined` and `message_end` returns early (:8196-8197) with no stats for that turn. The context-model fallback never fires because the echoed id is non-empty (:2337-2340). Directly relevant to mimo/minimax/qwen/glm endpoints that echo short/alternate backend ids. [iteration 3]

### P1 — Economics

Priority reconciliation keeps K6 at P2 and K8 at P1, matching the canonical findings registry: K8's duplicated ownership boundary can create immediate overlap or gaps, while K6 is masked by Pi-normalized usage and remains evidence-gated.

**K3. The fork adds no provider-side cache-hit contribution to the historical dominant workload (openai-codex/gpt-5.6-*).** `isResponsesPromptRewriteBypassApi` (:1583-1587) skips all prompt mutation for `openai-codex-responses`, and `shouldInjectOpenAIPromptCacheKeyForModel` (:1504-1506) excludes it from cache-key injection. The 89% hit rate / 87% token savings baseline is entirely Pi-native server-side caching; the extension still requests `PI_CACHE_RETENTION=long` and contributes footer stats and diagnostics for codex. [iteration 2]

**K4. The full prompt-rewrite path (churn strip :732, skill compression :650, stable-prefix reorder :815) applies to every non-responses OpenAI-compatible model with no prefix-cache-support compat flag.** For mimo/minimax/qwen/glm-class endpoints the benefit depends on unverified provider prefix-caching; the codex bypass comment (:7941-7966) documents that reordering can trip content-safety filters — the same risk class is unassessed for unknown completions endpoints. [iteration 2]

**K5. Anthropic TTL-ordering repair is unreachable for `cacheControlFormat: "anthropic"` OpenAI-compatible endpoints.** The repair at `before_provider_request` (:8061-8066) is gated to `isAnthropicMessagesApi`. The claude adapter's own `warningText` (:3017-3030) steers users to `cacheControlFormat: "anthropic"` — whose breakpoints are subject to the identical 1h-before-5m ordering constraint but never repaired. Additionally, `downgradeAnthropicLongCacheControls` (:1542-1551) downgrades ALL 1h breakpoints on a single violation (economically blunt), and `hasAnthropicCacheTtlOrderError` (:1553-1562) is a brittle exact-phrase string matcher. [iteration 4]

**K8. The ownership boundary is a hardcoded exact-match allowlist duplicated across two forks (index.ts:1462-1465 and deep-pi eligibility.ts:11-12), aligned only by a shared fixture (`.pi/extensions/shared/deepseek-ownership.json`).** The fixture's `excluded` list confirms `opencode/deepseek-v4-flash-free` and `opencode-go/deepseek-v4-flash` remain pi-cache-optimizer surface. A new deepseek model id requires editing both forks + fixture; a miss silently creates overlap or gap. [iterations 1, 10]

### P2 — Provider coverage / economics display / correctness

**K6. Full-miss accounting is inconsistent on the foreign-provider raw-fallback path.** `getAnthropicRawUsage` returns `undefined` when both cache fields are absent (:2541) and `getGeminiRawUsage` does the same (:2567-2571), so Anthropic/Gemini-shape full misses drop out of the denominator; `getOpenAIRawUsage` counts a full miss because `cached_tokens: 0` is a present value (:2510-2512). Masked under Pi-normalized usage; real for custom/foreign providers. [iteration 9]

**K7. The brief's "no GLM/MiniMax/mimo/Kimi/Qwen handling" is contradicted on existence: all have adapters (index.ts:3064-3200). The adapters are thin classification wrappers over the generic OpenAI normalizer and proxy-compat warning, so the accurate limitation is no specialized per-provider optimization.** [iterations 1, 6]

**K9. Cache-write volume is tracked for all adapters but displayed only for Anthropic** (`showCacheWrite` set only on the claude adapter, index.ts:3008; display gate :4054). OpenAI-compatible proxies that report cache-write have that volume invisible. [iteration 9]

**K10. The footer's first ratio is "requests with any cache hit": it is a binary request metric (`hitRequests += 1` whenever `cacheRead > 0`, :4035), not an unqualified hit rate. It can overstate economics for partial-cache requests; the parallel token ratio is the honest metric. Denominators are consistent "full prompt" across all four raw normalizers (verified identity math), so token-percent comparisons are valid — but token savings ≠ cost savings (per-provider cache-read pricing differs) and the footer shows tokens only.** [iteration 9]

### P3 — Maintainability / robustness

**K11. `before_agent_start` rewrite chain has no outer exception guard** (index.ts:7982-8049); safety relies on the internal WORM truncation flag (:897) only. [iteration 7]

**K12. 400 detection is header-text-dependent and body-blind** — a provider delivering error detail in the response body silently defeats the retention self-heal. [iteration 7]

**K13. The extension's persisted footer config remains single-key (`footerMode`) with all-or-nothing validation** — a corrupted or future-version config is silently discarded (:1307-1333) with no self-heal and no forward-compat reader. K1's per-model opt-out does not require extending this footer schema: it is read from Pi's open `models.json` compat record using the existing model/provider precedence. [iteration 5]

**K14. Vendored-fork drift tracking is manual-only** (historical `diff -rq` in CHANGES-FROM-UPSTREAM.md:45); no upstream-sync mechanism; the vendor boundary is a point-in-time snapshot. [iteration 10]

**K15. Gemini adapter has no `warningText`** (index.ts:3049-3060) — misconfigured Gemini/Vertex endpoints fail silently; and Gemini-served-over-`openai-completions` gets the gemini raw normalizer by model identity, mismatching the transport (:3952-3954). Gemini is dormant surface in current settings (no gemini model enabled). [iterations 1, 8]

### Confirmations (no change needed)

- `prompt_cache_retention` 4-gate strip is the best-guarded mutation (F2-3).
- Stats-persistence failure degrades gracefully to in-memory with warn-once (F7-4).
- Comment hygiene is clean (zero ephemeral artifact labels in index.ts).
- `tsc --noEmit` is clean; 34/34 tests pass across 8 suites.
- FooterMode config write paths sync the in-process cache correctly and write atomically (F5-1).

## 5. Provider Coverage Matrix (enabled models → treatment)

| Enabled model | Adapter | Hook treatment | Deep-pi guarded? |
|---|---|---|---|
| openai-codex/gpt-5.6-sol/terra/luna | openai (gpt- token) | rewrite bypassed; no cache-key injection; stats recorded; retention env | No |
| deepseek/deepseek-v4-pro, deepseek-v4-flash | deepseek | none (guard) | **Yes — no-op** |
| opencode/deepseek-v4-flash-free | deepseek | full rewrite + cache-key + retention strip | No (active) |
| opencode-go/deepseek-v4-flash | deepseek | full rewrite + cache-key + retention strip | No (active) |
| xiaomi/mimo-v2.5-pro, mimo-v2.5-pro-ultraspeed | mimo | full rewrite + cache-key + retention strip | No |
| minimax/MiniMax-M3 | minimax | full rewrite + cache-key + retention strip | No |
| opencode-go/qwen3.8-max | qwen | full rewrite + cache-key + retention strip | No |

## 6. Test Coverage Gap

The 34-test suite covers the guard (positive+negative via fixture), `prompt_cache_retention` strip gates, footer config, adaptive-thinking compat, modelOverrides JSONC, and the fix command. **Zero coverage** for: all non-DeepSeek classifier predicates, all three raw usage normalizers, `addOpenAIPromptCacheKey`, the Anthropic TTL reorder repair, the 403/400 diagnostics, and the `message_end` adapter-selection/consolidation path. Every defect K1, K2, K5, K6 would pass CI unchanged. [iteration 6]

## 7. Recommendation

Priority order for any follow-up (implementation is a separate decision, per research-only scope):
1. P0: give `prompt_cache_key` the same treatment as `prompt_cache_retention` — a 400-history self-heal set plus a per-model/config opt-out (K1); add a context-model fallback in `message_end` when the echoed id matches no adapter (K2).
2. P1: extend the Anthropic TTL-repair gate to `cacheControlFormat: "anthropic"` endpoints (K5); add regression tests for the non-DeepSeek surface (K7/Test-gap).
3. P1: make the ownership boundary resilient to new deepseek model ids (K8) — a shared single-source allowlist rather than two duplicated predicates.
4. P2/P3: surface cache-write and cost-relevant display (K9), consider a per-provider prefix-cache-support flag for the rewrite (K4), and add an outer guard to the rewrite chain (K11).

## 8. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Static resolution of whether opencode/opencode-go are router providers | Routing registry is runtime-injected (`Symbol.for('pi.routing.registry.v1')`), not readable from repo | index.ts:965-977 | 1, 3 |
| Case-only echoed-id bucket fragmentation as a bug | `consolidateDirectProviderStatsModel` overwrites id on ANY difference, so case-only drift is consolidated | index.ts:2409-2415 | 3 |
| `/cache-optimizer fix` TTL-order suggestion as wrong-knob | Long retention is the 1h-TTL source; `supportsLongCacheRetention: false` is a coherent root-cause fix | index.ts:7371-7379 | 4 |
| Stale in-process footer-mode cache after config command | Both CLI and menu write paths set the module var after atomic write | index.ts:8392-8395, 9143-9146 | 5 |
| Gemini `cacheWrite: 0` as accounting bug | Official Gemini usageMetadata has no cache-write counter | index.ts:2584 | 8 |
| Cross-provider denominator inconsistency | All four raw normalizers compute full-prompt totals; denominators consistent | index.ts:2484-2585 | 9 |
| Comment-hygiene violation in index.ts | Grep returns zero ephemeral artifact labels | index.ts grep | 10 |
| `before_provider_request` throwing on non-object payloads | asRecord/typeof guards skip non-object shapes safely | index.ts:1512, 2603, 8085 | 7 |

## 9. Open Questions

- Do `opencode`/`opencode-go` register router adapters at runtime (changing all their stats to virtual-routing semantics)? (runtime state; F3-4)
- Do mimo/minimax/qwen/glm endpoints actually support exact-prefix caching, justifying the rewrite? (K4)
- Which of these findings the operator authorizes for implementation, and in what order (P0-before-P1-before-P2). This mirrors the phase-8 decision pattern.

## 10. References

- `.pi/extensions/pi-cache-optimizer/index.ts` (all line citations; primary source, Class A)
- `.pi/extensions/pi-cache-optimizer/tests/hook-guards.test.ts`, `ownership-composition.test.ts`, `review-findings.test.ts` (Class A)
- `.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md` (Class A)
- `.pi/settings.json` (Class A)
- `.pi/extensions/shared/deepseek-ownership.json` (Class A)
- `.pi/extensions/deep-pi/extensions/deeppi/eligibility.ts` (Class A)
- Session brief confirmed evidence (historical baseline `pi-cache-optimizer-stats.json` 2026-08-06; source-read provider logic inventory) — cited and built on, not re-discovered

## 11. Convergence Report

- Stop reason: `maxIterationsReached` (10 of 10; stop policy `max-iterations`)
- Total iterations: 10 | statuses: all `complete`
- newInfoRatio series: 0.95, 0.90, 0.85, 0.75, 0.60, 0.70, 0.65, 0.55, 0.60, 0.60
- Average newInfoRatio: 0.72 (far above the 0.05 telemetry threshold — the loop was intentionally run to full depth, not to convergence)
- Trend: descending 0.95→0.55 with two upticks (iterations 6, 9 were re-focus angles), ending flat ~0.60 — consistent with a broadening-coverage strategy rather than a collapsing-novelty signal
- Key questions: 7 identified; answered 3 (q2 guard semantics, q6 normalizer accounting, q7 test coverage); q1/q3/q4/q5 partially answered with citations; quality guards (source diversity, focus alignment) satisfied across Class A/B framing

## 12. Research Conclusion

The fork is in sound overall shape for a vendored monolith — clean comments, clean tsc, best-guarded retention strip, graceful persistence degradation — but its non-DeepSeek path has four concrete, line-verifiable gaps (prompt_cache_key no-self-heal, message_end silent stat loss on unknown echoed ids, unreachable Anthropic TTL repair for cacheControlFormat endpoints, and zero test coverage over the entire provider-specific surface) plus one premise correction (two enabled DeepSeek-class models remain active surface because the guard is provider-scoped). All findings are research-only; implementation is a separate operator decision, consistent with the packet's phase-8 precedent.
