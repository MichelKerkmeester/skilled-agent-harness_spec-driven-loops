---
round: 1
seat: seat-001
executor: unknown
lens: "pragmatic"
status: ok
timestamp: 1970-01-01T00:00:00.000Z
simulated: false
---

# seat-001: pragmatic / undefined

## Mandate
[No mandate captured]

## Confidence
[No confidence captured]

## Seat Output
## Seat Recommendation

Use a narrow, test-first remediation plan. Only K1 warrants P0 treatment.

| Finding | Adjudication | Final priority | Recommended action |
|---|---|---:|---|
| K1 | Confirmed and availability-impacting. | P0 | Add model-scoped control plus process-local suppression after an explicit `prompt_cache_key` rejection. Never infer rejection from an unrelated 400. |
| K2 | Confirmed, but it loses telemetry rather than failing requests. | P1 | Fall back to the resolved route adapter or direct context adapter only when response classification fails. Preserve response authority for virtual routing. |
| K3 | Overstated. Bypass and non-injection are proven, but “zero value” is not: the extension still sets `PI_CACHE_RETENTION=long`. | Informational | Do not alter the Responses bypass. Require controlled A/B evidence before asserting zero contribution. |
| K4 | Sound but incomplete: the rewrite path is broader than OpenAI-compatible models; it applies to nearly every non-owned, non-Responses model. Impact remains unverified. | P2, evidence-gated | Add a model-scoped rewrite opt-out only if runtime failures or unsupported caching are demonstrated. Avoid a broad rewrite-policy change now. |
| K5 | Control-flow gap is sound. Actual impact depends on an active `cacheControlFormat: "anthropic"` endpoint and its final payload. | P1 if reproduced; otherwise P2 | Extend repair only to explicitly Anthropic-formatted endpoints. For visible conflicts, downgrade only late invalid 1h controls; retain all-breakpoint fallback for hidden conflicts. |
| K6 | Over-specific and conditional. All raw normalizers depend on explicit cache-signal presence; omitted fields may mean “unknown,” not “full miss.” | P2 investigation | Confirm provider contracts or capture real responses before treating absent cache fields as zero. |
| K7 | Correct premise correction, not a defect. | Informational | No provider-specific implementation without a demonstrated requirement. |
| K8 | Duplication is real, but current fixture and composition tests reduce present risk. Runtime single-sourcing would increase boundary coupling. | P3 | Strengthen exhaustive equality tests before considering shared runtime ownership code. |
| K9 | Sound and low-risk. | P2 | Display cache-write tokens for any adapter when the tracked value is nonzero. |
| K10 | Metric description is sound; “overstating” is interpretive. The footer already presents the token ratio. | Informational | At most relabel it as “requests with any cache hit.” Do not build a cost estimator without pricing data. |
| K11 | Structural observation is sound; runtime impact is unknown. | P3 | Consider a narrow transform-chain fallback after confirming Pi’s hook-exception behavior. |
| K12 | Sound, but primarily a host-contract limitation. | P3 / K1 blocker | The declared response hook exposes status and headers, not body. Use explicit `message_end.errorMessage` signals where available. |
| K13 | Partly overstated. Invalid schema is warned via `console.warn`, and version rejection is fail-closed. | P3 / enabling work | Evolve configuration only as required for K1 or K4; do not perform generic schema modernization. |
| K14 | Sound but expected for a pinned vendored fork. | P3 | Keep manual drift review unless an actual upstream cadence justifies automation. |
| K15 | Transport-based raw-normalizer mismatch is sound. Missing `warningText` is not independently a defect. Gemini is dormant. | P3 now | Select raw normalization by transport if Gemini becomes enabled; defer warning design. |

Implementation order:

1. Focused regression tests preserving the DeepSeek ownership boundary.
2. K1.
3. K2.
4. K5 only after payload-shape confirmation or reproduction.
5. K9.
6. Evidence-gated K4, K6, and K15 work.
7. Leave K3, K7, K10, K13, and K14 without standalone fixes.

## Evidence And Assumptions

Confirmed source evidence:

- K1 injection is globally controlled and reaches all OpenAI-compatible APIs, while existing 400 recovery recognizes only `prompt_cache_retention` (`index.ts:1371-1376`, `2599-2616`, `2714-2735`, `8068-8129`).
- K2 follows from response-derived identity replacing the fallback identity, adapter lookup returning undefined, and `message_end` returning early (`index.ts:2330-2367`, `3956-3967`, `8196-8197`).
- The six model-specific hooks retain an early `isDeepPiOwned` return, and dedicated guard tests cover those returns.
- Existing tests do not positively exercise cache-key injection, unknown echoed-model fallback, TTL normalization, raw normalizers, or positive 400/403 diagnostics.
- `after_provider_response` is declared with only `status` and optional `headers` (`types/pi-coding-agent.d.ts:58`).
- K3’s zero-value conclusion is not established by its cited bypass lines because the extension sets `PI_CACHE_RETENTION=long` at module load and session start (`index.ts:52-55`, `115`, `7898-7902`).
- K13 is not fully silent: invalid configuration produces a warning before falling back (`index.ts:1307-1333`).

Runtime assumptions still requiring confirmation:

- Whether `opencode` and `opencode-go` are virtual routers.
- Whether failed requests reliably emit `message_end.errorMessage`.
- Whether enabled Mimo, MiniMax, and Qwen endpoints benefit from exact-prefix rewriting or accept `prompt_cache_key`.
- Whether omitted Anthropic/Gemini cache counters contractually mean zero.
- Whether any active endpoint uses `cacheControlFormat: "anthropic"`.

## Critique

No other council proposal summaries were provided.

The research correctly identifies K1, K2, and the targeted test gap. Its implementation recommendation is too broad in three places:

1. K2 is not P0. It breaks optimizer accounting, not provider availability.
2. K3’s “zero cache-hit-rate value” exceeds its evidence because long-retention behavior remains active.
3. K8 should not immediately become shared runtime state. The ownership boundary is high-blast, and explicit duplicated predicates plus stronger composition tests are safer than introducing a cross-extension runtime dependency.

The priority records are also internally inconsistent: K6 and K8 receive different tiers between `research.md` and `findings-registry.json`.

K4 should be reworded. The hook does not positively gate on OpenAI-compatible transport; it rewrites broadly after excluding owned DeepSeek and Responses APIs. That widens its theoretical blast radius but does not prove a current defect.

## Risks And Blockers

The strongest blocker is reliable K1 error attribution. A generic HTTP 400 may concern any request field. Disabling `prompt_cache_key` after every 400 would hide unrelated defects and create misleading self-healing.

The safer behavior is:

- suppress only after an explicit unsupported-`prompt_cache_key` signal from headers or `message_end.errorMessage`;
- provide a model-scoped off switch;
- if failed-message details are unavailable in practice, default unknown third-party endpoints to explicit opt-in rather than guessing.

DeepSeek-boundary conditions:

- `isDeepPiOwned` must remain the first operation in every affected hook;
- no config read, state mutation, adapter fallback, or notification may occur before it;
- K2 fallback must not map an unknown virtual-router response to the router shell;
- K5 must require explicit Anthropic transport or `cacheControlFormat: "anthropic"`;
- K8 should remain test-only during this tranche.

The existing 34-test baseline does not protect the affected paths. A green unchanged suite would therefore be insufficient evidence.

## Handoff Recommendation

Bundle each behavior change with these observable checks:

1. **K1:** explicit key rejection suppresses injection on the next request; unrelated 400 does not; existing caller-provided keys remain untouched; per-model off works.
2. **K2:** unknown direct-provider echo uses the context or resolved-route adapter; recognized response identity still wins; unknown virtual routing is not misattributed.
3. **K5:** valid TTL order is unchanged; only late invalid 1h controls are downgraded for visible conflicts; explicitly Anthropic-formatted OpenAI endpoints are covered.
4. **Boundary:** both owned `deepseek/*` models remain no-op across all six hooks, while the two excluded DeepSeek-class models remain optimizer-owned.
5. **Verification:** run the focused negative controls, the complete test suite, and `tsc --noEmit` from final state.

Confidence: **0.88**. I would change this plan if runtime captures show all enabled proxies safely accept and materially benefit from `prompt_cache_key`, if router snapshots provide a stronger K2 fallback identity, or if provider contracts establish that omitted cache counters always mean zero.

Council seat option: narrow-test-first-non-deepseek-remediation  
Council seat verdict: SUPPORT_WITH_RISKS

