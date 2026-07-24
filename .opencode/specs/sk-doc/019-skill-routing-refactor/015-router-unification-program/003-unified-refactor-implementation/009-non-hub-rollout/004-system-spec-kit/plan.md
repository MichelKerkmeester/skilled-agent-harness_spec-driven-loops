---
title: "Implementation Plan: system-spec-kit Non-Hub Router Rollout"
description: "Build the target-local source adapter and real-green harness, emit deterministic projections, then verify real scorer parity and fenced rollback without changing shared or live code."
trigger_phrases:
  - "system spec kit rollout plan"
  - "non hub compiled policy plan"
  - "real scorer fenced rollback plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/004-system-spec-kit"
    last_updated_at: "2026-07-19T10:39:28Z"
    last_updated_by: "codex"
    recent_action: "Executed the isolated compile, scorer, parity, and rollback plan"
    next_safe_action: "Keep the child read-only unless a separate rollout decision is approved"
    blockers: []
    key_files:
      - "harness/support.cjs"
      - "harness/run-rollout.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-spec-kit-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: system-spec-kit Non-Hub Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Stack** | Node.js CommonJS, built-ins only |
| **Inputs** | Authored `SKILL.md`, leaf manifest, leaf aliases, and routable leaf bytes |
| **Compiler** | Frozen generic compiler imported from the original N=1 implementation |
| **Oracle** | Real read-only router replay and route-gold evaluator |
| **Authority** | Legacy serving authority; compiled policy is shadow-only |

The implementation keeps common policy semantics in the frozen modules and limits target-specific code to source-format adaptation, authored default behavior, fixture definition, and verification orchestration.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 resolves to this exact child.
- [x] Frozen template, compiler, projections, parity, activation logic, scorer path, design authority, router, and all leaf bytes were read.
- [x] Target child was absent and the phase parent already had its lean trio.

### Definition of Done

- [x] All generated artifacts byte-match two complete rebuilds.
- [x] Policy and projections satisfy frozen schemas and hashes.
- [x] Real scorer, parity, closed algebra, rollback, syntax, and strict packet validation pass.
- [x] Protected scorer files retain their initial SHA-256 digests.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

1. The real scorer parser reads the multiline authored dictionaries and explicit default.
2. A deterministic parser projection feeds the frozen normalized source builder; actual source hashes replace projection/sentinel hashes.
3. The frozen compiler emits the one-destination policy with empty composition and authority collections.
4. The target evaluator adds the authored always-loaded default to positive routes and emits `bounded-default` only after zero selector evidence.
5. Frozen projection functions generate the advisor, typed gold, and policy card; target adapters preserve the explicit default where the base N=1 example had none.
6. The target gate drives the real scorer in a read-only subprocess, the frozen parity runner, and the frozen fence state machine.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Role | Action | Verification |
|---------|------|--------|--------------|
| `system-spec-kit` authored router and leaves | Read-only source | Hash and compile | 17 intents, 48 leaves, one explicit default |
| Frozen compiler and schemas | Shared dependency | Import only | Policy and projection schema/hash checks |
| Shared benchmark scorer trio | Protected oracle | Invoke read-only | Exact SHA-256 before and after |
| This rollout child | Isolated output | Create | Tree and git status inspection |
| Live routing configuration | Serving path | No action | No file under a live skill is written |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Scaffold Level-2 docs through the inline template renderer.
- [x] Capture protected hashes and source inventory.

### Phase 2: Implementation

- [x] Add target support, scorer bridge, fingerprint, gate, and frozen-module re-exports.
- [x] Generate the policy, projections, fixtures, and activation manifests.

### Phase 3: Verification

- [x] Run deterministic rebuild, schemas, closed algebra, real scorer, parity, rollback, policy-card replay, protected hashes, and syntax.
- [x] Run strict spec validation and reconcile evidence metadata.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test | Evidence |
|------|----------|
| Deterministic build | Two full artifact maps plus three policy compiles and two isolated fingerprints |
| Closed algebra | Bounded default, one clarify, forbidden reject, target-free non-routes, zero effects and rank calls |
| Scorer compatibility | Five explicit-gold rows through `evaluateRouteGold`; extra-resource and fabricated-oracle falsifiers |
| Legacy parity | Three representative real-router rows, zero mismatch, zero effects, legacy authority |
| Rollback | Generation 0 to 1 to 0 with fence 2 and byte-identical prior/restored manifest |
| Static quality | `node --check` on every child-local `.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Status | Failure Behavior |
|------------|--------|------------------|
| Frozen compiler and projection modules | Available | Import or schema failure blocks |
| Frozen canonical contract | Available | Hash or schema mismatch blocks |
| Real scorer trio | Hash-pinned | Any byte drift blocks |
| Authored leaf manifest and leaves | 48/48 present | Missing or unmapped resource blocks compilation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

This child has no live activation. Its executable rollback drill swaps the candidate manifest back to retained prior bytes under a monotonically increasing fence. Operational rollback for the child itself is removal of the isolated additive folder; no serving state or external effect needs reversal.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Exit Gate |
|-------|------------|-----------|
| Setup | Frozen source bytes | Inventory and hashes captured |
| Implementation | Setup | Checked artifacts generated |
| Verification | Implementation | Real-green output and strict validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT & COMPLEXITY

The work is verification-heavy rather than broad: one target adapter, one target gate, two frozen-module re-exports, one scorer bridge, and generated artifacts. Benchmark adjacency and default-semantics preservation justify Level 2 despite the isolated write surface.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- **Trigger**: any artifact drift, scorer mismatch, protected hash drift, parity mismatch, or rollback mismatch.
- **Action**: withhold the candidate; legacy remains authoritative.
- **Verification**: prior and restored manifest byte hashes must match, while the fence advances and rejects stale epochs.
<!-- /ANCHOR:enhanced-rollback -->
