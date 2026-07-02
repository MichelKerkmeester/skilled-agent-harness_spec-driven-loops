---
title: "Implementation Plan: Phase 15: Fallback Router Typed Reroute"
description: "Plan for the shipped typed fallback outcome routing, trace metadata, and startup graph preflight."
trigger_phrases:
  - "fallback-router typed reroute"
  - "failure-kind routing"
  - "route-trace metadata"
  - "fallback graph preflight"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/002-deep-loop-runtime/015-fallback-router-typed-reroute"
    last_updated_at: "2026-07-01T21:48:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped fallback-router typed-reroute content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed typed fallback router"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts"
    session_dedup:
      fingerprint: "sha256:015a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5e1a"
      session_id: "scaffold-content-remediation-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 15: Fallback Router Typed Reroute

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript deep-loop fallback router |
| **Framework** | Typed route selection with startup graph validation |
| **Storage** | In-memory/configured fallback route graph; no persistence changes |
| **Testing** | Spec acceptance requires cyclic graph startup rejection, timeout failure-kind route selection, and trace metadata on every routing decision; no dedicated test file is named in spec.md |

### Overview
This phase shipped typed outcome routing in `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`. Fallback config now distinguishes success and failure targets by failure kind, every routing decision emits `routeGroupId` and `hopIndex`, and `validateFallbackGraph()` runs at startup to reject missing routes, cycles, scope widening, and max-hop violations before dispatch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: executor failures retried flat with no failure-kind routing or trace.
- [x] Success criteria measurable: cyclic config throws at startup; timeout failure routes to typed `onFailureTarget` with trace metadata.
- [x] Dependencies identified: existing fallback route schema and startup initialization hook point are available.

### Definition of Done
- [x] Typed `onSuccess`, `onFailureTarget`, and `failureKind` fields added to route config.
- [x] `routeGroupId` and `hopIndex` trace metadata emitted on every routing decision.
- [x] `validateFallbackGraph()` checks missing routes, cycles, scope widening, and max-hop violations.
- [x] Preflight runs at startup before first dispatch, not lazily.
- [x] Multi-hop fallback chains and cross-scope routing remain out of scope/blocked.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Typed outcome routing over a preflight-validated fallback graph with per-decision trace metadata.

### Key Components
- **Typed route config**: `onSuccess`, `onFailureTarget`, and `failureKind` describe routing outcomes explicitly.
- **`validateFallbackGraph()`**: Pure startup preflight that rejects invalid route graphs before dispatch.
- **Trace metadata**: `routeGroupId` groups a routing flow and `hopIndex` identifies the decision hop.
- **Scope guard**: Prevents routing from silently widening scope across disallowed boundaries.

### Data Flow
Startup loads fallback route config and runs `validateFallbackGraph()`. If valid, dispatch can route executor outcomes by success/failure and failure kind; each routing decision returns trace metadata. Invalid graphs fail before any executor dispatch, preventing runtime infinite retry loops or untraceable reroutes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | Selects fallback routes after executor outcomes | Add typed config fields, trace metadata, and startup preflight | Spec acceptance covers cyclic rejection and failure-kind route selection |
| Fallback route config | Defines route graph | Validated at startup | Missing/cyclic/scope-widening/max-hop invalid configs reject before dispatch |

Required inventories:
- Same-class producers: inspect existing fallback route config schema and startup hook before extending.
- Consumers of changed symbols: executor routing consumes trace metadata; startup consumes graph validation errors.
- Matrix axes: success route, typed failure route, timeout failure, missing route, cycle, scope widening, max-hop violation, and startup-vs-lazy validation.
- Algorithm invariant: invalid fallback graphs must fail before dispatch; routing decisions must always be traceable with `routeGroupId` and `hopIndex`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm implementation scope is only `fallback-router.ts`.
- [x] Read existing fallback route config schema and startup initialization path.
- [x] Confirm multi-hop chains and cross-scope routing are out of scope.

### Phase 2: Core Implementation
- [x] Add typed `onSuccess`, `onFailureTarget`, and `failureKind` config fields.
- [x] Route failures by `failureKind` when typed failure targets are provided.
- [x] Emit `routeGroupId` and `hopIndex` trace metadata for every decision.
- [x] Implement pure `validateFallbackGraph()` checks for missing routes, cycles, scope widening, and max-hop violations.
- [x] Register graph validation at startup before first dispatch.

### Phase 3: Verification
- [x] Verify cyclic fallback graph is rejected at startup with a clear error.
- [x] Verify `failureKind: "timeout"` routes to the typed `onFailureTarget`.
- [x] Verify trace metadata includes `routeGroupId` and `hopIndex`.
- [x] Verify invalid graph validation is not deferred lazily until dispatch.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration/preflight | Cyclic fallback config rejects at startup before dispatch | Spec acceptance criteria; no dedicated test file named |
| Unit/routing | `failureKind: "timeout"` resolves to typed `onFailureTarget` | Router unit fixture |
| Trace | Routing result includes `routeGroupId` and `hopIndex` | Trace assertion |
| Validation | Missing route, scope widening, and max-hop violations reject descriptively | Preflight fixtures |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing fallback route config schema | Internal | Available | Typed fields extend the existing config contract |
| Startup initialization hook | Internal | Available | Needed to run `validateFallbackGraph()` before dispatch |
| Multi-hop chain design | Future design | Deferred | Larger fallback chains require separate cycle/routing design |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Startup preflight rejects valid configs, failure-kind routing selects wrong targets, or trace metadata is missing.
- **Procedure**: Revert typed routing fields, trace metadata, and startup preflight in `fallback-router.ts`; fallback routing returns to the previous flat retry path until the graph validation and route selection are corrected.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
