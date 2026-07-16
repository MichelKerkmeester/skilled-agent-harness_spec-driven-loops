---
title: "Feature Specification: Fallback-Router Wiring (Optional)"
description: "Wires the existing, fully-tested but zero-caller fallback-router.ts into fanout-pool.cjs so a GLM-5.2 lineage can auto-substitute MiMo-v2.5-Pro on failure, instead of same-model retry-and-salvage. Optional, operator-gated."
trigger_phrases:
  - "fallback router wiring"
  - "deep-loop model fallback"
  - "glm to mimo fallback"
importance_tier: "low"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/004-fallback-router-wiring"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Spec authored from Plan-agent C's confirmed gap finding (fallback-router.ts has zero callers)"
    next_safe_action: "Operator decision: fold into this packet, or track as separate hardening"
    blockers:
      - "Awaiting operator decision on whether this is in-scope"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-004-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should this land as part of the system-deep-loop merge, or ship separately after?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Fallback-Router Wiring (Optional)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned — optional, operator-gated |
| **Created** | 2026-07-08 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 5 (optional; may run parallel to 003 or be deferred entirely) |
| **Predecessor** | 003-external-reference-migration (no strict dependency — independent of 002/003's file moves once they've landed) |
| **Successor** | 005-validation-and-closeout (if this phase runs) |
| **Handoff Criteria** | A failed GLM-5.2 lineage auto-substitutes its configured fallback target instead of exhausting same-model retries |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-loop-runtime/lib/deep-loop/fallback-router.ts` is a fully shipped, unit-tested pure-function library (`resolveFallback`/`createFallbackRouter`/`validateFallbackGraph`, confirmed via direct code read) implementing exactly the "model A fails, route to model B in a different quota pool" pattern the operator asked for on `001-reference-research`'s GLM-5.2 → MiMo-v2.5-Pro lineage. It has **zero callers** outside its own test file — `fanout-pool.cjs` only implements same-model retry-with-backoff (`maxRetries`), never a model swap.

### Purpose
Wire `resolveFallback()` into `fanout-pool.cjs`'s retry-exhausted branch: on `retryCount >= maxRetries` (or a specific `failureKind`), look up a `ModelRegistry` and re-dispatch a *new* lineage with the fallback model instead of continuing to retry the failed one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `ModelRegistry` config (or inline registry) with at least `glm-5.2 -> mimo-v2.5-pro` (confirmed-valid edge: different `quota_pool`s, no cycle, within default max-1-hop).
- `fanout-pool.cjs` retry-exhausted branch calling `resolveFallback()` and re-dispatching.

### Out of Scope
- Any change to `fallback-router.ts` itself — it's already correct and tested.
- A general-purpose fallback UI/config surface beyond what this one use case needs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/lib/deep-loop/` or a new small config file | Create | `ModelRegistry` with the glm-5.2/mimo-v2.5-pro edge |
| `runtime/scripts/fanout-pool.cjs` | Edit | Call `resolveFallback()` on retry exhaustion, re-dispatch fallback lineage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P2 - Optional (can defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | GLM-5.2 lineage auto-substitutes MiMo-v2.5-Pro on retry exhaustion | A forced-failure test on a `glm52` replica produces a `mimo-v2.5-pro` replacement replica, not a fourth same-model retry |
| REQ-002 | `fallback-router.ts` itself remains unmodified | The module's own existing unit tests still pass unchanged |
| REQ-003 | Fallback substitution is logged/attributable | A re-dispatched fallback replica's label makes clear it substituted for a failed `glm52-N` replica, not silently indistinguishable |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `fallback-router.ts` has a real, non-test caller.
- **SC-002**: 001-reference-research's own GLM-5.2 lineage (if this lands before that phase re-runs) no longer needs the manual operator-mediated re-dispatch workaround documented in `001-reference-research/plan.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scope creep — this is real feature work, not part of the merge/rename itself | Low-Medium if bundled carelessly | Kept as its own optional phase, explicitly not required for 002/003/005 to complete |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should this land as part of the `system-deep-loop` merge, or ship separately after? Left to the operator — 001's research synthesis may inform this.
<!-- /ANCHOR:questions -->
