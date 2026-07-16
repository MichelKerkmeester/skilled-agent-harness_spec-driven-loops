---
title: "Fallback Router Typed Outcome-Routed Reroute"
description: "On executor failure the fallback router retries flat without discriminating by failure kind and produces no routing trace, making post-hoc debugging impossible and preventing targeted per-failure-kind recovery paths."
trigger_phrases:
  - "fallback-router typed reroute"
  - "failure-kind routing"
  - "route-trace metadata"
  - "fallback graph preflight"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/002-deep-loop-runtime/015-fallback-router-typed-reroute"
    last_updated_at: "2026-06-28T14:02:03Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/015-fallback-router-typed-reroute"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Fallback Router Typed Outcome-Routed Reroute

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 18 |
| **Predecessor** | 014-coverage-graph-fuzzy-merge |
| **Successor** | 016-llm-judge-hardening |
| **Handoff Criteria** | Typed route config fields added; `validateFallbackGraph()` runs at startup; trace metadata emitted on every routing decision |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the deep-loop-runtime recs specification.

**Scope Boundary**: `fallback-router.ts` only — typed config fields, route-trace metadata, and startup preflight; no multi-hop chain logic.

**Dependencies**:
- Existing fallback route config schema must be readable before extending
- Startup initialization path must have a hook point for `validateFallbackGraph()`

**Deliverables**:
- Typed `onSuccess/onFailureTarget` + `failureKind` fields in the fallback route config
- Route-trace metadata: `routeGroupId`, `hopIndex` emitted per routing decision
- Pure `validateFallbackGraph()` preflight checking for missing routes, cycles, scope-widening, and max-hop violations

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On executor failure the fallback router retries flat without knowing the failure kind, routing all failures identically and producing no trace of the routing decision. There is no typed contract distinguishing timeout from auth-failure from quota-exceeded, so operators cannot configure different recovery paths per failure class. Without a preflight check, misconfigured fallback graphs (cycles, missing routes, max-hop violations) are discovered only at runtime during active runs.

### Purpose
Add typed `onSuccess/onFailureTarget` + `failureKind` fields, route-trace metadata, and a `validateFallbackGraph()` preflight so failures route correctly per kind and every routing decision is traceable from the call-site.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `onSuccess/onFailureTarget` + `failureKind` typed fields in the fallback route config
- Route-trace metadata fields: `routeGroupId`, `hopIndex` attached to every routing decision
- Pure `validateFallbackGraph()` preflight: missing-route check, cycle detection, scope-widening guard, max-hop violation check; runs at startup before first dispatch

### Out of Scope
- Multi-hop fallback chains — deep-rewrite; cycle detection at multi-hop scale needs careful independent design; separate ticket
- Cross-scope routing — intentionally blocked by preflight validation; enabling it requires explicit design review

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | Modify | Add typed route config fields, `routeGroupId`/`hopIndex` trace metadata, and `validateFallbackGraph()` startup preflight |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `validateFallbackGraph()` must run at startup (not lazily) and reject configs containing cycles, missing target routes, or max-hop violations with a descriptive error before any dispatch occurs | Integration test: supply a cyclic fallback config → assert startup throws with a clear error message before any dispatch is attempted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Every routing decision must emit `routeGroupId` + `hopIndex` trace metadata; `failureKind` must influence route selection when `onFailureTarget` is provided | Unit test: simulate a `failureKind:"timeout"` failure → assert `routeGroupId` and `hopIndex` are populated in trace, and route resolves to the typed `onFailureTarget` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A cyclic fallback graph is rejected at startup with a clear error — confirmed by integration test fixture with a seeded cycle in the config.
- **SC-002**: A `failureKind:"timeout"` failure routes to the typed `onFailureTarget` (not the generic retry path) and the resulting trace contains both `routeGroupId` and `hopIndex` — confirmed by unit test.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A misconfigured fallback graph with a cycle causes infinite retry if preflight is skipped or run lazily | High | `validateFallbackGraph()` must be registered at startup initialization, not deferred; lazy invocation is a hard violation |
| Evidence | `external/loop-cli-main/src/core/loop-controller.ts:394,444`; `external/kasper/src/evaluate.ts:1689,1733` | Low | Read-only citation from research.md §5.1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

> **Provenance:** research.md §5.1, (iters 7, 23)

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
