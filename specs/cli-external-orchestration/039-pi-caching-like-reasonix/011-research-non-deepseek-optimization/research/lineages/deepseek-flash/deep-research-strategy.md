---
title: Deep Research Strategy — non-DeepSeek optimization of pi-cache-optimizer
description: Detached fan-out lineage (deepseek-flash) researching further optimization of pi-cache-optimizer's now-exclusively-non-DeepSeek active surface.
trigger_phrases:
  - "pi-cache-optimizer non-deepseek optimization research"
  - "deepseek-flash lineage strategy"
importance_tier: normal
contextType: research
version: 1.0.0
---

# Deep Research Strategy - Session Tracking Template

## 1. OVERVIEW

### Purpose

Detached fan-out lineage for researching concrete, evidence-based optimization opportunities across correctness, cache-hit-rate economics, provider coverage, and maintainability for pi-cache-optimizer's non-DeepSeek path (packet 039, phase 011). Runs 10 forced-depth iterations (convergence treated as telemetry only) with a `max-iterations` stop policy.

### Usage

- **Init:** State written from the confirmed-evidence brief plus source reads of `.pi/extensions/pi-cache-optimizer/index.ts` (9,239 lines), `.pi/settings.json`, and the fork's test suite.
- **Per iteration:** Read Next Focus, execute evidence-gathering, write iteration-NNN.md, append JSONL delta.
- **Owner:** Workflow reducer (this lineage) refreshes machine-owned sections.

---

## 2. TOPIC

How can pi-cache-optimizer be further optimized for non-DeepSeek models? Since packet 039's fork guards pi-cache-optimizer's mutation hooks with an early-return for deep-pi-owned models, its remaining active surface is non-DeepSeek providers. Find concrete, evidence-based optimization opportunities across correctness, cache-hit-rate economics, provider coverage, and maintainability for that path.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Q1: Which specific non-DeepSeek providers in `.pi/settings.json` receive which cache-optimization treatment, and is each correct? (answered: coverage matrix in research.md §5)
- [x] Q2: Does the guard actually leave the surface exclusively non-DeepSeek? (answered: NO — two enabled DeepSeek-class models remain active surface; isDeepPiOwned is provider-scoped)
- [x] Q3: Are the per-provider adapter classifications correct and complete? (answered: classification exists for all; all are thin wrappers over the generic OpenAI normalizer; Gemini normalizer mismatch on openai-completions transport)
- [x] Q4: What are the cache-hit-rate economics levers? (answered: zero contribution to codex workload; prompt_cache_key has no self-heal; retention strip is best-guarded; rewrite unverified for third-party)
- [x] Q5: Is the Anthropic TTL-reordering repair correct for all Anthropic-like models? (answered: unreachable for cacheControlFormat:anthropic endpoints; over-broad downgrade; brittle error matcher)
- [x] Q6: Are the raw usage normalizers correct? (answered: denominators consistent full-prompt; Anthropic/Gemini full misses drop out on foreign-provider path; cacheWrite display Anthropic-only)
- [x] Q7: How wide is the test suite's provider coverage? (answered: entire non-DeepSeek provider-specific surface untested)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do NOT re-litigate the DeepSeek/non-DeepSeek split decision (settled, ADR-recorded in 002-synthesis-and-decision).
- Do NOT modify or recommend modifications to deep-pi's exclusive territory or behavior.
- Do NOT implement fixes — research findings only; implementation is a separate follow-up step.
- Do NOT touch any path outside `specs/cli-external-orchestration/039-pi-caching-like-reasonix/011-research-non-deepseek-optimization/research/lineages/deepseek-flash`.
- Do NOT re-discover evidence already confirmed in the brief (cite and build on it).

---

## 5. STOP CONDITIONS

- maxIterations (10) reached — forced-depth policy; convergence before that is telemetry only, not a stop.
- Escalation: 3+ consecutive failures, state corruption, or all approaches exhausted with questions remaining.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Q2 (guard scope): isDeepPiOwned is provider-scoped; opencode/deepseek-v4-flash-free and opencode-go/deepseek-v4-flash remain active surface (CHANGES-FROM-UPSTREAM.md:37,49-50; fixture excluded list). (iteration 1)
- Q6 (normalizer accounting): all four raw normalizers produce full-prompt denominators; Anthropic/Gemini full misses drop out on the foreign-provider path; cacheWrite display is Anthropic-only. (iterations 3, 9)
- Q7 (test coverage): zero coverage over all non-DeepSeek classifier predicates, raw normalizers, prompt_cache_key injection, TTL repair, and 403/400 diagnostics. (iteration 6)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading CHANGES-FROM-UPSTREAM.md as first-class evidence: it carries the empirical post-guard verification (opencode/deepseek-v4-flash-free creates stats entries). (iteration 1)
- Tracing each mutation lever from gate function to hook call site (prompt_cache_key, prompt_cache_retention, TTL repair) produced a precise who-contributes-what economics map. (iterations 2, 4)
- Symbol-level grep against the test suite produced an exhaustive coverage inventory. (iteration 6)
- Writing out each raw normalizer's identity math made the denominator-consistency conclusion verifiable. (iteration 9)
- Grepping for ephemeral comment labels gave a definitive hygiene verdict cheaply. (iteration 10)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Static resolution of router-provider status for opencode/opencode-go: the routing registry is runtime-injected; fell back to empirical CHANGES-FROM-UPSTREAM verification. (iteration 1)
- Observing real third-party endpoint response shapes (usage omission, error phrasing, prefix-cache support): claims remain inferential for K4/K5/K6. (iterations 2, 4, 8, 9)
- Confirming Pi's host hook-exception handling for the before_agent_start rewrite risk (K11). (iteration 7)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Static runtime-state resolution -- BLOCKED (iterations 1, 3, 7)
- What was tried: resolving router-provider status and host hook-exception behavior from repo files.
- Why blocked: routing registry is injected at runtime (Symbol.for('pi.routing.registry.v1')); Pi host behavior not in this repo.
- Do NOT retry: statically; use live-session observation instead.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Static router determination for opencode/opencode-go (runtime-injected registry, index.ts:965-977). (iteration 1, 3)
- Case-only echoed-id bucket fragmentation as a bug (consolidation overwrites on any id difference, index.ts:2409-2415). (iteration 3)
- TTL-order fix suggestion as wrong-knob (supportsLongCacheRetention:false is coherent, index.ts:7371-7379). (iteration 4)
- Stale in-process footer-mode cache (write paths sync module var, index.ts:8392-8395). (iteration 5)
- Gemini cacheWrite:0 as accounting bug (official API has no write counter, index.ts:2584). (iteration 8)
- Cross-provider denominator inconsistency (all normalizers full-prompt, index.ts:2484-2585). (iteration 9)
- Comment-hygiene violation in index.ts (zero ephemeral labels). (iteration 10)
- before_provider_request payload-shape throw paths (asRecord/typeof guards safe, index.ts:1512, 2603, 8085). (iteration 7)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: live-session verification of router-provider status, third-party endpoint usage shapes, and prefix-cache support — the only unobservable factors behind K4/K5/K6.
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- Do opencode/opencode-go register router adapters at runtime (virtual-routing stats semantics)? — needs live observation.
- Do mimo/minimax/qwen/glm endpoints support exact-prefix caching (justifying the rewrite)?
- Which findings the operator authorizes for implementation, and in what order (P0-before-P1-before-P2).
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Synthesis complete (10/10 iterations, stopReason maxIterationsReached). Follow-up is an operator decision: implement P0 items (K1 prompt_cache_key self-heal + K2 message_end fallback), then P1 (K5 TTL-repair scope + non-DeepSeek test coverage). Live-session verification recommended for the runtime-dependent open questions before implementation.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Confirmed Evidence (this session, cite and build on; do not re-discover)

- `index.ts` is 9,239 lines (post comments/structure pass), vendored fork of jiangge/pi-cache-optimizer; 6 guarded hooks (session_start, model_select, before_agent_start, before_provider_request, after_provider_response, message_end) + hidden 7th (session_shutdown).
- Historical live baseline (`pi-cache-optimizer-stats.json`, 2026-08-06, pre-guard): 100 requests, 89 hits, 89% hit rate, 6.29M/7.19M tokens cached (~87%), ALL on openai-codex/gpt-5.6-luna — zero DeepSeek traffic even before the guard existed.
- Provider-specific logic present: Anthropic cache-control TTL breakpoint reordering (1h-before-5m), isClaudeLikeModel/isClaudeLikeAssistantMessage, isGeminiLikeModel/isGeminiLikeAssistantMessage, isOpenAICompatibleApi/isOpenAICompatibleProxyApi (llama.cpp proxy detection), footerMode config (FooterStatsMode, versioned JSON config), statsModel-vs-ctxModel reconciliation.
- Historical baseline had zero DeepSeek traffic; the guard formalizes a boundary already true in practice.

### Source-derived correction to brief (found during init, line-cited)

- The brief states "No GLM, MiniMax, Xiaomi/mimo, Kimi, or Qwen-specific handling was found in a direct grep." Source read contradicts this: `CACHE_PROVIDER_ADAPTERS` includes Kimi (index.ts:3064), Qwen (:3081), GLM (:3098), MiniMax (:3115), Mimo (:3132), Hunyuan (:3149), Mistral (:3167), Grok (:3184), Llama (:3200) — all with `id: 'openai'`, `normalizeUsage: normalizeWithFallback(message, getOpenAIRawUsage)`, and the generic OpenAI-proxy compat warning. So classification EXISTS but per-provider optimization is generic-only.
- The hook guard uses `isDeepPiOwned` (index.ts:1462: provider==='deepseek' AND id in {deepseek-v4-flash, deepseek-v4-pro}), NOT `isDeepSeekLikeModel`. Two enabled DeepSeek-class models under non-deepseek providers (opencode/deepseek-v4-flash-free, opencode-go/deepseek-v4-flash) are NOT deep-pi-owned and remain pi-cache-optimizer active surface.

### Bounded Context Snapshot

- Source pointers: `.pi/extensions/pi-cache-optimizer/index.ts` (hook block 7898-8300, adapters 2983-3250, model detection 1431-1900, usage normalizers 2484-2597, config persistence 1299-1362).
- Integration points: `.pi/settings.json` (enabledModels list), `.pi/extensions/pi-cache-optimizer/tests/` (hook-guards, ownership-composition, review-findings), `specs/cli-external-orchestration/039-pi-caching-like-reasonix/002-synthesis-and-decision/decision-record.md` (settled split).
- Constraints: research-only, no implementation; stay inside the lineage dir.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only; stop policy is max-iterations)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: resume, restart (live); fork, completed-continue (deferred)
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-08-09T05:26:18Z
