---
round: 2
seat: seat-001
executor: unknown
lens: "critical"
status: ok
timestamp: 1970-01-01T00:00:00.000Z
simulated: false
---

# seat-001: critical / undefined

## Mandate
[No mandate captured]

## Confidence
[No confidence captured]

## Seat Output
## Seat Recommendation

Adopt **guard-frozen, test-first remediation**, not the lineage’s P0–P3 list unchanged.

Final implementation order:

1. **P0 — K1 + K12:** Add model-scoped `prompt_cache_key` rejection recovery and explicit opt-out. Strip keys already serialized by Pi, not merely keys added by the extension.
2. **P1 — K5:** Extend TTL-order handling to OpenAI-compatible models using `cacheControlFormat: "anthropic"`.
3. **P1 gated — K4:** Separate the three prompt transforms and require provider evidence before enabling stable-prefix reordering on unknown models.
4. **P1 accounting — K2:** Fall back to the resolved route/context adapter only when response metadata matches no adapter.
5. **P2 — K6:** Count input-only Anthropic/Gemini raw misses.
6. **P3 optional — K15, K9, K10:** Make Gemini fallback transport-aware, expose nonzero cache writes, and clarify the request-hit label.
7. **Separate workstream — K8:** Ownership-source consolidation directly touches the DeepSeek boundary and should not ride with non-DeepSeek fixes.
8. **No product implementation — K3, K7, K11, K14.** K13 is enabling schema work only if required by K1.

Before each change, add a failing characterization test while preserving the exact DeepSeek-owned no-op behavior.

## Evidence And Assumptions

| Finding | Adjudication | Revised action | Boundary risk |
|---|---|---|---|
| **K1** | **Sound; P0 correct.** Pi core can already serialize `prompt_cache_key` under long retention (`pi-ai/dist/api/openai-completions.js:523-527`), so disabling only `addOpenAIPromptCacheKey` is insufficient. | On configured or observed rejection, delete snake- and camel-case keys from the final payload. Add a model-scoped denylist and exact rejection detector. | High |
| **K2** | **Sound, confirmed; P0 overstated.** It loses telemetry, not the request. | If response metadata selects no adapter, fall back to the resolved route model, then direct context model. Never override a recognized response adapter. | Medium |
| **K3** | Directionally sound but `zero` is a counterfactual economics claim, not a defect. Codex rewrite/key bypass is statically confirmed. | No code. Use an optimizer-on/off measurement if the historical attribution must be proved. | None |
| **K4** | **Sound but under-scoped.** `before_agent_start` has no positive provider gate; it affects every non-owned, non-Responses model, not merely OpenAI-compatible completions. | Split churn stripping, skill compression, and reordering. Default-disable reordering for unverified models unless measured benefit justifies it. | High |
| **K5** | **Sound; P1 correct.** Pi documents `cacheControlFormat: "anthropic"` and 1h controls for OpenAI-compatible transports. | Recognize that compat format in both request repair and error fallback. For visible conflicts, downgrade only offending late 1h controls; retain all-5m fallback only after an observed error. | High |
| **K6** | Sound, but P1 is too high because it affects uncommon raw fallback accounting. | Count input-only raw usage as a full miss when prompt/input totals exist. | Low |
| **K7** | Sound correction of the brief, but “thin adapter” is not itself a defect. | No provider-specific optimization without capability and runtime evidence. | None |
| **K8** | Sound maintainability concern; no current ownership defect. | Separate packet or phase. A shared runtime predicate is preferable only after packaging and rollback are proven. | **Very high** |
| **K9** | Sound, low-value UX gap. | Display nonzero cache-write volume regardless of adapter, with a neutral label. | Low |
| **K10** | Partly overstated. “Requests with any cache read” is valid if labeled clearly; it is not an economic hit rate. K6 also limits cross-provider comparison completeness. | Rename or de-emphasize the request metric. Do not add cost-savings claims without reliable provider pricing. | Low |
| **K11** | Narrow fact is true, but the risk is overstated. Pi’s extension contract says handler errors are logged and the agent continues. | No outer catch unless a test proves the host fails to preserve the original prompt or later handlers. | High if changed |
| **K12** | **Sound and underprioritized.** `after_provider_response` exposes status and headers, not body content. | Merge with K1. Detect exact rejection text from the finalized error message, optionally correlated with the observed 400. | High |
| **K13** | **Partly wrong.** Invalid schema is not silent; `readPersistedFooterMode` logs a warning. Future versions are intentionally rejected. | If K1 adds config, introduce a compatible schema migration and preserve unrelated fields during footer writes. No standalone cleanup. | Medium |
| **K14** | Sound process observation, not a runtime defect. | Keep pinned-source review manual unless upstream-sync policy explicitly requires CI automation. | None |
| **K15** | Partly sound. Missing warning is real; transport mismatch affects only raw fallback because normalized usage is tried first. Gemini is currently dormant. | Select raw normalizer by API transport and reuse generic proxy warnings for OpenAI-compatible Gemini models. | Medium |

The prior lineage reports 34/34 tests and clean TypeScript. This read-only seat did not rerun them. Source inspection confirms the suite does not exercise K1, K2, K5, K6, or K15 behavior.

## Critique

The lineage mixes availability defects, telemetry defects, informational observations, and governance concerns under one priority scale.

Specific corrections:

- **K12 belongs with K1 at P0**, because header-only detection prevents the proposed recovery mechanism from working on ordinary body-reported errors.
- **K2 should be demoted.** Silent statistics loss is important, but it does not make a provider unusable.
- **K4 is broader than reported.** The hook is effectively model-global except for DeepSeek ownership and Responses bypasses.
- **K6 is over-prioritized.** It affects a fallback path rather than normal Pi-normalized usage.
- **K8 should not be bundled.** Editing the ownership predicate is the most direct way to violate the DeepSeek guard.
- **K11 ignores host-level exception containment.**
- **K13 incorrectly calls invalid configuration silent.**
- **K15 overstates a raw-fallback mismatch as a general transport mismatch.**
- K3 and K7 provide useful scope corrections but do not identify implementable defects.

No other active proposal summaries were supplied.

## Risks And Blockers

The strongest assumption is that `message_end.errorMessage` reliably carries the exact provider rejection before Pi retries. Existing Anthropic handling and comments support that expectation, but provider-specific runtime proof is still required.

Other blockers:

- Prefix-cache support for mimo, MiniMax, Qwen, GLM, and proxy DeepSeek remains unknown. K4 policy should not be decided from static code alone.
- Runtime router registration may change which model identity is authoritative.
- A new config field requires non-destructive schema migration; the current footer writer reconstructs a single-key payload.
- Existing green tests are insufficient proof because most accepted paths are uncovered.
- Every modified hook must retain `isDeepPiOwned(...)` as its first effective action. Tests must cover both owned direct models and excluded `opencode`/`opencode-go` models.

## Handoff Recommendation

Implement only after these observable checks exist:

1. An exact `prompt_cache_key` rejection causes the next request to omit the key, including when Pi preinserted it.
2. An unrelated 400 does not disable the key, and one model’s rejection does not affect another.
3. Native Anthropic and OpenAI-compatible Anthropic-format payloads both repair invalid TTL ordering; unrelated payloads remain byte-equivalent.
4. Unknown echoed IDs retain stats through fallback, while recognized routed identities remain authoritative.
5. All six DeepSeek-owned hooks remain no-op, excluded proxy DeepSeek models remain active, and the original 34 tests plus new regressions and `tsc --noEmit` pass.

Change the recommendation if runtime probes show error bodies are unavailable at `message_end`; in that case, prefer explicit model opt-out or safe-default non-injection rather than heuristic self-healing. Likewise, retain K4 rewriting only for providers demonstrating measurable cache benefit without content-safety failures.

Confidence: **0.90 for static adjudication; 0.70 for provider-runtime behavior.**

Council seat option: guard-frozen-test-first-nondeepseek-remediation  
Council seat verdict: SUPPORT_WITH_RISKS

