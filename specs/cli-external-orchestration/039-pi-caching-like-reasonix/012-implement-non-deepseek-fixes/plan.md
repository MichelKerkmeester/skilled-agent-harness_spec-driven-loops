---
title: "Implementation Plan: Non-DeepSeek Path Fixes"
description: "4 priority-ordered phases (high, medium, low, minor) implementing 011's research reconciled against the ai-council's adjudication."
trigger_phrases:
  - "non-deepseek fixes plan"
  - "prompt cache key fix plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/012-implement-non-deepseek-fixes"
    last_updated_at: "2026-08-09T10:20:06Z"
    last_updated_by: "claude"
    recent_action: "Aligned code, ran manual K1/K2/K5 scenarios, fixed a discovered gate asymmetry."
    next_safe_action: "None; implementation, alignment, and manual scenario verification are complete."
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-012-non-deepseek-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Non-DeepSeek Path Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | TypeScript, single vendored-fork file + its test suite |
| **Workflow** | `/speckit:implement`, 4 sequential priority phases |
| **Testing** | `npm test` + `npm run typecheck` after every phase, plus a negative control for each P0/P1 fix |
| **Source** | `../011-research-non-deepseek-optimization/research/lineages/deepseek-flash/research.md` (15 findings) reconciled against that packet's ai-council adjudication |

### Overview

Implement the 15 findings from 011's research in 4 phases ordered by the reconciled priority (research priority as corrected by the council's adjudication, not the original research alone). Phase 1 is gated: no P0/P1 code change lands without a regression test proving the `isDeepPiOwned` boundary survives it, per the council's explicit warning that the existing 34-test baseline does not protect these paths.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] 011's research and ai-council adjudication both read in full; findings reconciled into one priority order
- [x] Every finding's `index.ts:line` evidence citation re-confirmed against current source (not re-derived from scratch)

### Definition of Done

- [x] All 4 phases' tasks checked off or explicitly deferred with a cited reason
- [x] `npm test` and `npm run typecheck` clean in `pi-cache-optimizer` from the final state
- [x] `validate.sh --recursive --strict` passes for the whole `039` packet
- [x] K6/K8 priority-tier inconsistency between `research.md` and `findings-registry.json` resolved
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

No new architecture. Every fix works within `pi-cache-optimizer/index.ts`'s existing hook-guard/adapter/config structure. The one structural addition is a regression-test layer around the `isDeepPiOwned` early-return boundary (Phase 1), added because the council found the current 34-test baseline does not exercise it under the conditions these fixes touch.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: High Priority — Boundary Tests + K1

Status: Complete. Evidence: `tasks.md` T003-T006; High-group gate passed with 41 tests across 9 suites and typecheck exit 0.

- [x] Regression tests proving `isDeepPiOwned` stays the first operation across all 6 guarded hooks, with a negative control (deliberately break the guard, confirm the new test fails, then confirm it passes on the real code)
- [x] K1: add a model-scoped `prompt_cache_key` self-heal, mirroring `prompt_cache_retention`'s 4-gate strip pattern (`index.ts:8068-8100`) — disable only on an explicit unsupported-key signal (response header or `message_end.errorMessage`), never on a bare 400
- [x] K1: add a per-model config opt-out for `prompt_cache_key` injection
- [x] Tests: unrelated-400 leaves injection enabled; explicit-rejection-signal disables it for that model only; existing caller-provided keys untouched

### Phase 2: Medium Priority — K2 + K5

Status: Complete. Evidence: `tasks.md` T007-T012; Medium-group gate passed with 45 tests across 11 suites and typecheck exit 0.

- [x] K2: when `selectAdapterForAssistantMessage` (`index.ts:3956-3967`) returns no match, fall back to the resolved-route or direct-context adapter instead of silently dropping stats at `message_end` (`index.ts:8196-8197`)
- [x] K2: confirm the fallback never adopts a virtual-router's shell identity for an unrecognized direct-provider response (resolve the open question on `opencode`/`opencode-go` router-adapter registration first)
- [x] K5: extend the Anthropic TTL-order repair gate (`index.ts:8061-8066`) from `isAnthropicMessagesApi` to also cover OpenAI-compatible endpoints configured with `cacheControlFormat: "anthropic"`
- [x] K5: change `downgradeAnthropicLongCacheControls` (`index.ts:1542-1551`) to downgrade only late invalid 1h controls on a visible conflict, keeping the existing all-breakpoint fallback for hidden conflicts

### Phase 3: Low Priority — Evidence-Gated Items

Status: Complete. Evidence: `tasks.md` T013-T018; Low-group gate passed with 50 tests across 13 suites and typecheck exit 0.

- [x] K6: reconcile the priority-tier inconsistency the council found between `research.md` and `findings-registry.json`; confirm whether `getAnthropicRawUsage`/`getGeminiRawUsage` (`index.ts:2541`, `2567-2571`) returning `undefined` on absent cache fields is a real provider-contract gap before changing behavior
- [x] K8: strengthen exhaustive equality tests between `index.ts`'s allowlist (`index.ts:1462-1465`) and `deep-pi/eligibility.ts`'s allowlist (`:11-12`) against the shared fixture — no runtime restructuring
- [x] K9: extend cache-write token display (`index.ts:3008`, gate `:4054`) to any adapter reporting a nonzero tracked value, not only the claude adapter
- [x] K11: first confirm Pi's actual hook-exception behavior for `before_agent_start` (open question); only if confirmed unsafe, add a narrow outer transform-chain fallback beyond the existing WORM truncation flag (`:897`)
- [x] K4: defer unless runtime evidence (a real failure or unsupported-caching report) demonstrates the need for a per-model prefix-cache-support opt-out on the prompt-rewrite chain (`:650`, `:732`, `:815`)

### Phase 4: Minor — Documentation-Only Corrections

Status: Complete. Evidence: `tasks.md` T019-T025; final Minor/final gate passed with 50 tests across 13 suites and typecheck exit 0.

- [x] K3: reword the `CHANGES-FROM-UPSTREAM.md` and `research.md` claim that the fork has "zero cache-hit-rate value" for the openai-codex workload — the extension still sets `PI_CACHE_RETENTION=long` (`index.ts:52-55`, `115`, `7898-7902`); no code change
- [x] K7: correct the "no provider-specific handling" framing — GLM/MiniMax/mimo/Kimi/Qwen adapters already exist (`index.ts:3064-3200`) as thin OpenAI-normalizer wrappers; no code change
- [x] K10: relabel the footer's hit-rate metric to "requests with any cache hit" instead of an unqualified hit rate; no cost-estimator work
- [x] K12: no host-contract workaround — confirm `message_end.errorMessage` is the correct existing signal to use where 400-detail is needed, since `after_provider_response`'s declared type has no body field (`types/pi-coding-agent.d.ts:58`)
- [x] K13: touch the footerMode config schema only if Phase 1's K1 opt-out needs a new key; no standalone modernization
- [x] K14: explicit no-op — keep manual vendored-fork drift review; no automation
- [x] K15: explicit deferral — no Gemini-transport fix until a Gemini model is enabled in `.pi/settings.json`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative control | `isDeepPiOwned` boundary (Phase 1) | Deliberately break the guard, confirm the new test catches it, then confirm the real code passes |
| Regression | K1, K2, K5 (Phases 1-2) | New `pi-cache-optimizer` test cases per REQ-002/004/005 |
| Full suite | Every phase | `npm test` + `npm run typecheck` in `pi-cache-optimizer`; re-confirm `deep-pi`'s suite unaffected |
| Contract | Whole packet | `validate.sh --recursive --strict` on `039` after each phase closes |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pi's real `before_agent_start` exception behavior (K11) | Investigation | Confirmed | Host catches handler exceptions and continues; no outer fallback was needed |
| `opencode`/`opencode-go` router-adapter registration (K2) | Investigation | Confirmed | No runtime router-adapter registry was found; unresolved virtual-router shells are rejected |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any phase's `npm test`/`npm run typecheck` fails after a fix, or `validate.sh --recursive --strict` regresses.
- **Procedure**: revert that phase's specific commit/change; the phases are independent enough (each touches distinct functions) that an earlier phase's fix does not need to be reverted to roll back a later one.
<!-- /ANCHOR:rollback -->
