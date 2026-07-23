---
title: "Feature Specification: sk-design Compiled Router Rollout"
description: "Activate the compiled router contract for the six-axis sk-design parent hub in a shadow-only child. Preserve the null default, exact UI-build bundle, nested mode-leaf projection, frozen scorer, and byte-exact rollback."
trigger_phrases:
  - "sk-design compiled router rollout"
  - "sk-design parent hub canary"
  - "design axis ordered bundle"
importance_tier: "critical"
contextType: "implementation"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/006-sk-design"
    last_updated_at: "2026-07-19T11:08:33.000Z"
    last_updated_by: "codex"
    recent_action: "Recorded the sk-design shadow rollout evidence."
    next_safe_action: "Retain the compiled candidate in shadow-only authority."
---
# Feature Specification: sk-design Compiled Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
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
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In progress — REAL-GREEN shadow candidate; legacy serving-authoritative |
| **Created** | 2026-07-19 |
| **Branch** | `0069-skilled-router-refactor-impl` |
| **Migration stage** | Per-hub canary |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-design` has six public design-axis modes, one authored named bundle, a null default, and a
nested resource router inside every mode. Without a compiled policy, those destinations and leaf
selections cannot be replayed through the shared typed decision and frozen route-gold contracts.

### Purpose

Compile the live authored bytes into one deterministic `CompiledPolicyV1`, prove the closed
decision algebra and nested leaf projection against the real read-only scorer, and retain legacy
serving authority with a byte-exact rollback preimage.
<!-- /ANCHOR:problem -->

---
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Six injective destinations in authored tie-break order.
- Single, clearly separate ordered-bundle, clarify, defer, and reject outcomes.
- Exact `ui-build-bundle` preservation plus structurally legal two-axis compositions.
- Reference-following into every mode's authored nested router and typed leaf projection.
- Deterministic generated policy, advisor, policy-card, route-gold, activation, and rollback artifacts.
- Level-2 verification documents and generated metadata.

### Out of Scope

- Live skill or router edits — all live authored inputs remain read-only.
- Shared scorer, compiler, projector, or evaluator edits — this child consumes them unchanged.
- Network, dependency installation, commit, push, or live authority flip.
- External Open Design effects — the transport remains read-only for this canary.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `lib/*.cjs` | Create | Compiler, router, policy-card, activation, and execution fences |
| `harness/*.cjs` | Create | Deterministic artifact build and REAL-GREEN validator |
| `fixtures/canary-cases.v1.json` | Create | Route, bundle, negative, and advisor canaries |
| `compiled/*`, `activation/*` | Create | Generated candidate and retained rollback state |
| Root packet documents and metadata | Create | Level-2 contract and evidence |
<!-- /ANCHOR:scope -->

---
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Compile the six authored modes through the shared compiler. | Six schema-valid, injective destinations; byte-identical rebuild. |
| REQ-002 | Preserve null default and exact named bundle. | Zero signal defers; UI-build routes interface then foundations. |
| REQ-003 | Support clearly separate two-axis ordered bundles. | Interface plus motion routes in tie-break order through a compiled composition rule. |
| REQ-004 | Follow each mode router to its authored leaf resources. | Ninety manifest leaves compile; canaries project selected defaults and intent resources. |
| REQ-005 | Preserve the closed negative algebra. | Clarify, defer, and reject carry no target and withhold authority. |
| REQ-006 | Stay green on the frozen scorer without writeback. | Live and persisted rows pass through the shared projector and real scorer; corruption fails. |
| REQ-007 | Prove fenced, byte-exact rollback. | Candidate pin succeeds; prior bytes restore exactly at fence epoch two. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Preserve advisor and document parity. | Advisor drift/absence cannot rewrite decisions; policy-card replay matches. |
| REQ-009 | Enforce destination authority roles. | Only the mutating actor can COMMIT after VERIFY; read-only actor and transport commits fail. |
<!-- /ANCHOR:requirements -->

---
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node harness/build-artifacts.cjs` is deterministic.
- **SC-002**: `node harness/validate-canary.cjs` exits zero with `status: REAL-GREEN`.
- **SC-003**: The three protected scorer hashes match before and after validation.
- **SC-004**: Strict packet validation reports zero errors.
<!-- /ANCHOR:success-criteria -->

---
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shared canonical compiler and projector | No valid policy or scorer projection without them | Import the frozen modules; never duplicate them. |
| Risk | Transport receives commit authority | Violates destination-local authority | Compile its authority edge as evidence-only and reject transport COMMIT. |
| Risk | Ordered bundle absent from policy | Real parser rejects the decision | Compile every supported two-axis order while retaining one named authored rule. |
| Risk | Nested router drift | Projected leaves become stale | Hash packet and router bytes; fail source-identity mismatch. |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The candidate intentionally remains shadow-only.
<!-- /ANCHOR:questions -->

---
<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism

- **NFR-D01**: Identical authored bytes produce byte-identical artifacts.
- **NFR-D02**: One request observes one pinned policy tuple.

### Authority

- **NFR-A01**: Non-route decisions are target-free and authority-withheld.
- **NFR-A02**: Only a workspace-mutating actor can cross the COMMIT fence.

### Reversibility

- **NFR-R01**: Activation retains and restores the exact prior manifest bytes.
<!-- /ANCHOR:nfr -->

---
<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Zero signal: `defer(no-match)` because `defaultMode` is null.
- Forbidden prompt or constraint: `reject(forbidden)` before scoring.
- Tied unjoined axes: one bounded `clarify` with `none_of_these`.
- Exact interface and foundations signals: named UI-build ordered bundle.
- Explicitly joined interface and motion signals: derived legal ordered pair.
- Advisor unavailable or stale: annotation or zero evidence; local decision unchanged.
<!-- /ANCHOR:edge-cases -->

---
<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | One additive child; five libraries, two harnesses, generated artifacts |
| Risk | 18/25 | Authority, composition, frozen scorer, and rollback gates |
| Research | 10/20 | Two archetype siblings plus six nested router forms |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
