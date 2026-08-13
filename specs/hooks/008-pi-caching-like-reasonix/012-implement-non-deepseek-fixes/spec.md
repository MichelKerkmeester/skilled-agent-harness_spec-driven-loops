---
title: "Feature Specification: Implement Non-DeepSeek Path Fixes [specs/hooks/008-pi-caching-like-reasonix/012-implement-non-deepseek-fixes]"
description: "Implement the 15 pi-cache-optimizer non-DeepSeek findings from 011's research, reconciled against the ai-council's adjudication, in 4 priority-ordered phases: high, medium, low, minor."
trigger_phrases:
  - "implement non-deepseek fixes"
  - "prompt cache key self-heal implementation"
  - "adapter fallback fix"
  - "anthropic ttl repair extension"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/012-implement-non-deepseek-fixes"
    last_updated_at: "2026-08-09T10:20:06Z"
    last_updated_by: "claude"
    recent_action: "Aligned code, ran manual K1/K2/K5 scenarios, fixed a discovered gate asymmetry."
    next_safe_action: "None; implementation, alignment, and manual scenario verification are complete."
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
      - "../011-research-non-deepseek-optimization/research/lineages/deepseek-flash/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-012-non-deepseek-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator chose the full 4-tier sweep over the council's narrower tests-first/K1/K2-only recommendation; recorded as a deviation, not silently dropped."
      - "Pi catches before_agent_start handler exceptions, emits the extension error, and continues; no outer transform fallback was needed."
      - "Official OpenCode sources showed no runtime router-adapter registration for opencode or opencode-go; unresolved virtual-router shells are not trusted for adapter fallback."
      - "K4 remains deferred without runtime failure evidence, and K15 remains deferred because no Gemini model is enabled."
---
# Feature Specification: Implement Non-DeepSeek Path Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | 011-research-non-deepseek-optimization |
| **Successor** | None (last authored phase of packet 008) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

011's research produced 15 findings (K1-K15) about `pi-cache-optimizer`'s non-DeepSeek code path. A follow-up ai-council review (2 seats: pragmatic and critical lenses, across 3 rounds) endorsed some findings, downgraded others as overstated, and caught a real inconsistency between `research.md` and `findings-registry.json` on K6/K8's priority. The implementation is now complete, with the evidence-gated deferrals and documentation-only corrections recorded alongside the runtime fixes.

### Purpose

Implement the reconciled finding set — research plus council correction — in 4 priority-ordered phases (high, medium, low, minor), each gated on the prior phase's tests passing, so `pi-cache-optimizer`'s non-DeepSeek path gets measurably safer without expanding its blast radius beyond what the evidence supports.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.pi/extensions/pi-cache-optimizer/index.ts`: code changes for K1, K2, K5, K6, and K9; K4 and K11 were closed by their evidence gates without runtime changes.
- `.pi/extensions/pi-cache-optimizer/tests/*.test.ts`: new regression tests for the `isDeepPiOwned` boundary (prerequisite, Phase 1) and per-finding coverage as each fix lands.
- `.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md` and `../011-research-non-deepseek-optimization/research/lineages/deepseek-flash/research.md`: documentation-only corrections for K3, K7, K10, K12, K13, K14, K15 (no code change for these).
- Reconciling the K6/K8 priority-tier inconsistency between `research.md` and `findings-registry.json` that the council flagged.

### Out of Scope

- K15's Gemini-transport fix — explicitly deferred until a Gemini model is actually enabled in `.pi/settings.json`; do not implement against dormant surface.
- Any change to `deep-pi`'s own code or the DeepSeek-guard boundary itself — this phase touches the non-DeepSeek path only, and every fix must preserve `isDeepPiOwned`'s early-return as the first operation in all 6 guarded hooks.
- Building a cost estimator or per-provider pricing model (K10) — relabeling the existing metric's text is in scope, a new pricing feature is not.
- A shared runtime ownership module unifying the two forks' DeepSeek allowlists (K8) — this phase strengthens tests only, per the council's explicit caution against cross-extension coupling.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modify | K1, K2, K5, K6, and K9; K4/K11 evidence gates required no runtime change |
| `.pi/extensions/pi-cache-optimizer/tests/*.test.ts` | Modify/Create | Boundary regression tests (Phase 1 prerequisite) plus per-finding coverage |
| `.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md` | Modify | K3 reword (Phase 4) |
| `../011-research-non-deepseek-optimization/research/lineages/deepseek-flash/research.md` | Modify | K6/K8 priority-tier reconciliation with `findings-registry.json` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Regression tests for the `isDeepPiOwned` boundary land before or alongside K1 | New tests fail on a deliberately-reintroduced boundary violation (negative control), then pass on the real fix |
| REQ-002 | K1's `prompt_cache_key` self-heal never disables on an unrelated 400 | A test asserts a non-`prompt_cache_key` 400 leaves injection enabled; only an explicit unsupported-key signal (header or `message_end.errorMessage`) disables it, and only for the matching model |
| REQ-003 | Every fix preserves both forks' full test suites | `npm test` and `npm run typecheck` exit 0 in `pi-cache-optimizer` (and `deep-pi`, unaffected but re-confirmed) after each phase |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | K2's adapter fallback never misattributes an unknown virtual-routing response | A test asserts an unrecognized echoed model id on a known direct provider falls back correctly, while an unrecognized id on a virtual router does not silently adopt the router's shell identity |
| REQ-005 | K5's TTL-repair gate extends only to `cacheControlFormat: "anthropic"` endpoints, not all OpenAI-compatible ones | A test asserts the repair fires for that explicit config and does not fire for a plain OpenAI-compatible endpoint without it |
| REQ-006 | The K6/K8 priority-tier inconsistency between `research.md` and `findings-registry.json` is resolved, not left standing | Both documents agree on K6 and K8's final tier after this phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 4 phases' in-scope findings are implemented or explicitly deferred with a cited reason (K15's deferral is a success criterion being met, not a gap).
- `npm test` and `npm run typecheck` pass in `pi-cache-optimizer` from the final state; `deep-pi`'s suite is unaffected.
- `validate.sh --recursive --strict` passes for the whole `039` packet.
- No phase's fix widens the `isDeepPiOwned` guard's blast radius or touches `deep-pi`'s own code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | K1's self-heal misfires on an unrelated 400 | Silently disables a working optimization for the wrong reason | Require an explicit unsupported-`prompt_cache_key` signal before disabling, never a bare 400 (REQ-002) |
| Risk | K2's fallback misattributes a virtual-router response | Corrupts stats for a different reason than the original bug | Test both the direct-provider and virtual-router fallback paths explicitly (REQ-004) |
| Risk | Phase 3's evidence-gated items (K4, K6, K9, K11) get implemented preemptively without the gating evidence | Adds complexity or behavior change the research never proved necessary | Each Phase 3 task states its exact gating evidence in `tasks.md`; do not implement past what the evidence shows |
| Dependency | K11 needs Pi's real hook-exception behavior confirmed first (open question) | Wrong assumption produces a fallback that never fires or over-fires | Investigate and record the answer in `tasks.md` before writing the fallback code |
| Deviation | Operator chose the full 4-tier sweep; the ai-council's own recommendation was narrower (tests-first, then K1, then K2, then evidence-gated items only — leave K3/K7/K10/K13/K14 without standalone fixes) | None of K3/K7/K10/K12/K13/K14/K15 are code changes (Phase 4 is documentation-only), so this deviation adds no runtime risk beyond what the council already reviewed | Recorded here and in `plan.md`'s Key Decisions, not silently dropped |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Pi's installed `before_agent_start` runner catches each handler exception, emits the extension error, and continues; K11 required no outer transform fallback.
- Official OpenCode sources expose provider loading, hooks, and workspace adapters but no runtime router-adapter registry; K2 therefore rejects an unresolved virtual-router shell identity.
- No runtime failure or unsupported-caching report demonstrates a need for K4's per-model prompt-rewrite opt-out, so K4 is deferred as planned.
- No Gemini model is enabled in `.pi/settings.json`, so K15's Gemini transport fix is deferred as planned.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Predecessor**: `../011-research-non-deepseek-optimization/spec.md` (source research and council adjudication)
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Verification**: `checklist.md`
