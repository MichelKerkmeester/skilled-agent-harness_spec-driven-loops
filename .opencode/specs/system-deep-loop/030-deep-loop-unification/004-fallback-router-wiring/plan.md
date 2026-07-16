---
title: "Implementation Plan: Fallback-Router Wiring (Optional)"
description: "Plan for wiring fallback-router.ts's resolveFallback() into fanout-pool.cjs's retry-exhausted branch."
trigger_phrases:
  - "fallback router wiring plan"
importance_tier: "low"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/004-fallback-router-wiring"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan, not yet executed, optional"
    next_safe_action: "Awaiting operator decision on scope"
    blockers:
      - "Awaiting operator decision on whether this is in-scope"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-004-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Fallback-Router Wiring (Optional)

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`fallback-router.ts`, already shipped) + CommonJS (`fanout-pool.cjs`) |
| **Framework** | N/A |
| **Testing** | `tests/unit/fallback-router.vitest.ts` already exists; needs a new integration test for the wired path |

### Overview
`resolveFallback(failedModelId, registry, approvedModelIds, context)` already validates a `ModelRegistry` graph (different quota pools, no cycles, max-1-hop) and returns a `{action: 'fallback', target}` or `{action: 'fail-fast'}` decision. `fanout-pool.cjs:433,628-651` currently only implements same-model retry via `maxRetries`. This plan adds one call site: on retry exhaustion, resolve a fallback target and re-dispatch a new lineage instead of failing the replica.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Operator confirms this phase is in scope for the merge (vs. separate follow-up).

### Definition of Done
- [ ] `ModelRegistry` with the `glm-5.2 -> mimo-v2.5-pro` edge exists and validates.
- [ ] `fanout-pool.cjs` calls `resolveFallback()` on retry exhaustion.
- [ ] A forced-failure integration test confirms the fallback lineage actually dispatches.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Minimal addition at the existing retry-exhaustion decision point in `fanout-pool.cjs`, reusing `fallback-router.ts` as-is (no changes to that module).

### Registry entry

```json
{
  "models": [
    { "id": "glm-5.2", "quota_pool": "zai-coding-plan", "fallback_target": "mimo-v2.5-pro" },
    { "id": "mimo-v2.5-pro", "quota_pool": "xiaomi-token-plan", "fallback_target": null }
  ]
}
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Operator scope decision.
- [ ] Author the `ModelRegistry` entry above.

### Phase 2: Core Implementation
- [ ] Add `resolveFallback()` call in `fanout-pool.cjs`'s retry-exhausted branch; on `action: 'fallback'`, re-dispatch a new lineage with `target` as its model, same label family.

### Phase 3: Verification
- [ ] Forced-failure integration test: a `glm52` replica configured to fail every attempt produces a `mimo-v2.5-pro` replacement, not a 4th same-model retry.
- [ ] Existing `fallback-router.vitest.ts` unaffected (module itself unchanged).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Forced-failure fallback dispatch | New vitest case in `runtime/tests/unit/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `fallback-router.ts` | Internal | Already shipped, unchanged | N/A |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new call site introduces a regression in the existing retry path.
- **Procedure**: Revert the single `fanout-pool.cjs` edit; `fallback-router.ts` and the registry file are additive and harmless to leave in place.
<!-- /ANCHOR:rollback -->
