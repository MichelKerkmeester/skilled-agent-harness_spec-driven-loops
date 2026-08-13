---
round: 3
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

Adopt a **test-first, active-surface remediation**, not a 15-finding sweep.

**Adjudicated implementation order:**

1. **P0 — K1:** Add model-scoped `prompt_cache_key` self-healing. Detect exact unsupported-parameter errors in both response headers and `message_end.errorMessage`, then suppress injection for that model in-process. Defer persistent per-model configuration until repeated cross-process failures justify a schema change.
2. **P1 — K2:** Fall back to the resolved request model only when response metadata matches no adapter. Use the fallback for both adapter selection and stats identity. Preserve recognized virtual-route metadata and fail closed when no route is resolvable.
3. **P2 — K5:** Extend TTL repair to Anthropic-shaped payloads on compatible OpenAI transports. Gate on actual `cache_control` structure or explicit compat, not a broad provider heuristic.
4. **P2 — K8 test hardening only:** Strengthen ownership exhaustiveness tests. Do not replace the exact-match runtime guard with a broad shared classifier.
5. **P3 optional:** K9 display refinement and K15’s missing Gemini compatibility warning.

K4, K6, and K15’s transport-normalizer claim require runtime evidence before implementation. K3, K7, K10, K11, K13, and K14 should not become standalone fixes. Fold K12 into K1.

## Evidence And Assumptions

| Finding | Adjudication |
|---|---|
| **K1** | **Confirmed.** Injection is broad while self-healing only covers `prompt_cache_retention` (`index.ts:1371-1376,2599-2616,4768-4773,8068-8100`). Request failure makes this the only P0 item. |
| **K2** | **Confirmed.** Unknown echoed identity causes early return (`3956-3967,8196-8197`). It is P1 because it corrupts observability rather than requests. |
| **K3** | **Overstated.** Rewrite and extension key injection are bypassed, but the extension also sets `PI_CACHE_RETENTION=long` (`52-55`). “Zero cache-hit-rate value” needs an A/B run. Informational only. |
| **K4** | Static scope is sound (`7982-8049`), but provider benefit and content-filter harm are unverified. Treat as a measurement task; the existing global opt-out limits immediate risk. |
| **K5** | **Sound reachability defect** (`3017-3030,8061-8066`). Current settings enable no Claude model, so P2 locally; elevate to P1 for package-wide proxy support. |
| **K6** | Plausible only on raw fallback (`2484-2585`). Missing cache fields do not unambiguously prove a full miss. Require captured payloads before changing denominators. |
| **K7** | Correct correction: adapters exist (`3064-3200`). Thin adapters are not independently defective. Do not invent provider-specific optimizations without evidence. |
| **K8** | Duplication is real, but fixture and composition tests already reduce drift. Runtime centralization could break the DeepSeek ownership boundary. Prefer an exhaustive contract assertion. |
| **K9** | Correct display gap (`3008,4054`), but low impact. Show nonzero writes in detailed stats before expanding the footer. |
| **K10** | Arithmetic is correct (`4035`), but “overstating” is interpretive: request-hit count and token ratio are separate metrics already. Do not estimate cost without provider pricing. |
| **K11** | **Risk overstated.** There is no local outer guard, but Pi’s extension contract states extension errors are logged and the agent continues. A blanket catch could hide defects. |
| **K12** | Body blindness is imposed by Pi’s `after_provider_response` API, which exposes status and headers before stream consumption. Supplement via `message_end.errorMessage`; do not treat it as an independent hook bug. |
| **K13** | Single-version validation is true, but “silently discarded” is false: `readPersistedFooterMode` warns (`1307-1333`). Use an explicit version migration only if persistent K1 opt-outs are approved. |
| **K14** | True process debt, not runtime optimization. The fork is pinned and documented. Automation is unwarranted without a recurring upstream-sync workflow. |
| **K15** | Missing warning is confirmed. Transport mismatch affects only raw fallback because Pi-normalized usage is attempted first. It is dormant in current settings. |

The reported 34/34 tests and clean `tsc --noEmit` are accepted as the research baseline. This read-only seat did not rerun commands.

## Critique

No other council proposal summaries were provided.

The lineage recommendation correctly centers K1 and K2, but it mixes request defects, metrics semantics, dormant integrations, and maintenance observations into one priority scale. Its largest overstatements are:

- K3’s categorical causal claim.
- K6’s classification as P1 without captured raw responses.
- K8’s preference for runtime single-sourcing despite an ownership-sensitive package boundary.
- K11’s implied agent-safety risk, contradicted by Pi’s documented error handling.
- K13’s claim of silent config rejection.

The non-DeepSeek test gap should be a prerequisite to K1/K2, not attached indirectly to K7.

## Risks And Blockers

The strongest risk is **K2 fallback misattribution**. An unknown routed response must not be assigned to whichever context model happens to be active. Fallback should use the resolved request route, apply only after response-adapter failure, and skip stats if that route is unavailable.

DeepSeek ownership is the highest-blast boundary. Every modified hook must retain `isDeepPiOwned(...)` as its first operation. Tests must cover both owned direct models and the intentionally non-owned `opencode`/`opencode-go` DeepSeek-class models.

K4, K6, and K15 lack provider captures. Implementing them from static inference could reduce caching, distort metrics, or mutate prompts unnecessarily.

## Handoff Recommendation

1. Capture the authoritative baseline with `npm run check`.
2. Add negative-control tests:
   - K1: model A rejects `prompt_cache_key`; its retry omits the key; model B remains enabled.
   - K2: unknown short response id falls back to the resolved request model; recognized routed metadata remains authoritative; unresolved routes remain uncounted.
   - Both: direct DeepSeek stays untouched while excluded DeepSeek-class proxies remain active.
3. Implement K1, then K2, rerunning focused tests after each.
4. Rerun the full package gate.
5. Validate K4 against enabled Qwen, Mimo, and MiniMax endpoints before adding per-model rewrite configuration.
6. Implement K5 only with Anthropic-shaped payload tests.
7. Leave all remaining items closed or conditional unless runtime evidence changes their status.

**Confidence:** 0.90. Elevate K4 if provider traces show rewrite harm, K5 if an Anthropic-compatible proxy is enabled, K6 if captured full misses omit cache fields, and K8 if new DeepPi-owned model IDs are planned.

Council seat option: test-first-active-surface-remediation  
Council seat verdict: SUPPORT_WITH_RISKS

