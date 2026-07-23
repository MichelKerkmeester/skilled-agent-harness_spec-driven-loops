---
title: "Implementation Plan: system-skill-advisor Non-Hub Rollout"
description: "Target-local build and verification plan for compiling the authored standalone advisor router through frozen shared modules and proving real-scorer compatibility, shadow parity, and rollback."
trigger_phrases:
  - "system skill advisor rollout plan"
  - "advisor compiled router build"
  - "advisor frozen scorer verification"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/003-system-skill-advisor"
    last_updated_at: "2026-07-19T10:55:36Z"
    last_updated_by: "codex"
    recent_action: "Conformed the rollout plan to the Level-2 contract"
    next_safe_action: "Regenerate canonical metadata and run strict validation"
    blockers: []
    key_files:
      - "harness/run-phase.cjs"
      - "harness/support.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-skill-advisor-rollout-20260719"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Plan: system-skill-advisor Non-Hub Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Stack** | Node.js CommonJS, JSON, Markdown |
| **Inputs** | Authored inline router, leaf manifest, leaf aliases, and routed leaf bytes |
| **Compiler** | Frozen shared generic compiler |
| **Oracle** | Protected real router replay and route-gold evaluator |
| **Authority** | Legacy serving authority; compiled candidate remains shadow-only |

Use the shared modules as immutable libraries. The target-local source loader calls the frozen scorer's `parseRouter` so the compiler and legacy comparison see the same authored dictionary semantics. It then validates every routed resource against the committed leaf manifest, aliases, and disk before constructing the generic compiler input.

`DEFAULT_RESOURCES` requires special care. The authored `fallback-only` declaration means both runtime documents remain defer-time support suggestions; neither is represented as `defaultResource` in the compiled routing policy. This keeps zero signal at `defer(no-match)` and prevents a default union.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Scope, write boundary, protected files, authority boundary, and rollback contract are explicit.
- [x] Authored router, routed leaves, frozen compiler, scorer, parity, and activation inputs were read.
- [x] Protected scorer hashes were captured before implementation.

### Definition of Done

- [x] Deterministic policy, projections, typed fixtures, and activation artifacts exist.
- [x] Real scorer, positive-route parity, closed algebra, rollback, hashes, syntax, and comment hygiene pass.
- [x] Documentation preserves the observed hashes, counts, and authority boundary.
- [ ] Strict packet validation and canonical metadata regeneration pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Component | Responsibility |
|---|---|
| `harness/support.cjs` | Resolve immutable dependencies, parse the real authored router, close leaf identities, and build the generic source model. |
| shared compiler modules | Compile, evaluate, generate projections, and derive the N=1 degeneracy view. |
| `harness/run-phase.cjs` | Generate artifacts and activation state only under `--write`; otherwise validate read-only. |
| protected replay subprocess | Execute the real router and route-gold scorer without local copies or edits. |
| shared parity module | Compare all 20 exact positive routes while deriving legacy authority from the checked manifest. |
| shared fenced-manifest module | Validate manifests and exercise stale-fence rejection, generation pinning, activation, and byte-exact rollback. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Parse and validate the inline router, defaults, negative admission, one manifest mode, and typed leaf aliases.
- [x] Capture protected scorer hashes and freeze the target-local source boundary.

### Phase 2: Implementation

- [x] Compile one local standalone destination with 20 intent selectors and 20 routed leaf detectors.
- [x] Generate the policy, advisor projection, typed route gold, policy card, and five fixture families from one snapshot.
- [x] Generate the prior, candidate, checked, and fence-state activation files.

### Phase 3: Verification

- [x] Rebuild twice in memory and compile in isolated processes to prove deterministic bytes.
- [x] Project all typed fixtures through the real scorer and require the deliberate falsifier to fail.
- [x] Compare every authored positive intent/resource route against the real legacy replay with zero mismatches and effects.
- [x] Assert defer, clarify, reject, target and authority withholding, zero ranking, N=1 empties, and document-only replay.
- [x] Activate and roll back generation 1 in the fenced state machine with byte-exact restoration.
- [x] Rehash all protected files and check every CommonJS file.
- [ ] Regenerate canonical metadata and pass strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Evidence |
|------|----------|
| Determinism | Three compile runs, two process runs, and two artifact runs agree on checked bytes |
| Projection integrity | Policy, advisor, policy card, five decisions, and typed gold pass frozen schemas and hashes |
| Real scorer | Five typed rows pass and the extra-resource falsifier fails |
| Shadow parity | All 20 authored positive routes match with zero mismatches and effects |
| Closed algebra | Zero signal defers; ambiguity clarifies once; forbidden admission rejects; rank calls remain zero |
| Rollback | Generation 1 activates, stale epoch rejects, and prior manifest bytes restore at fence 2 |
| Static quality | Five CommonJS files pass `node --check`; comment hygiene passes |
| Documentation | Level-2 template, anchors, frontmatter, metadata, and evidence pass `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Failure Behavior |
|------------|------|--------|------------------|
| Shared generic compiler | Internal read-only | Green | Compilation or schema drift blocks the rollout |
| Protected scorer trio | Internal protected | Green | Import, evaluator, or hash drift blocks compatibility claims |
| Authored advisor router and leaves | Internal read-only | Green | Missing intent, alias, manifest, or leaf bytes block compilation |
| Network or package installation | External | Not required | No impact; the gate is offline and dependency-free |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The checked manifest selects the retained prior generation. If any gate fails, discard the inactive generated child artifacts; no live route or external effect exists to undo. Within the drill, rollback swaps generation 1 back to the retained generation-0 manifest while the monotonic fencing epoch advances to 2.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Exit Gate |
|-------|------------|-----------|
| Setup | Frozen source and scorer bytes | Source closure and baseline hashes captured |
| Implementation | Setup | Checked artifacts generated |
| Verification | Implementation | Executable receipts and strict documentation gate |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Relative Effort |
|-------|------------|-----------------|
| Setup and source closure | Medium | Moderate because every routed leaf must close against manifest, aliases, and disk |
| Target-local generation | Medium | Moderate due to frozen-module reuse |
| Verification and evidence | High | Highest because the scorer, 20-route parity, algebra, rollback, hashes, and strict docs are independent gates |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- **Trigger**: artifact drift, scorer mismatch, parity mismatch, algebra violation, stale-fence acceptance, protected hash change, or strict documentation failure.
- **Action**: withhold the candidate; legacy remains authoritative and the inactive child produces no external effect.
- **Verification**: prior and restored manifest bytes must share SHA-256 `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23` while the fence advances to epoch 2.

No external data reversal is required because this rollout has no live activation or effects.
<!-- /ANCHOR:enhanced-rollback -->
