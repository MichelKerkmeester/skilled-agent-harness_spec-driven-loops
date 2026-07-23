---
title: "Implementation Plan: cli-external-orchestration Per-Hub Rollout"
description: "Compile the authored external-executor hub, generate shadow activation artifacts, validate typed decisions through the real scorer, and prove fenced execution and rollback."
trigger_phrases:
  - "cli external orchestration rollout plan"
  - "external executor compiled policy"
  - "cli canary implementation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/004-cli-external-orchestration"
    last_updated_at: "2026-07-19T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed the rollout implementation plan"
    next_safe_action: "Retain the verified shadow candidate"
    blockers: []
    key_files: ["plan.md", "harness/build-artifacts.cjs", "harness/validate-canary.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-07-19-cli-external-rollout-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: cli-external-orchestration Per-Hub Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

| Field | Value |
|-------|-------|
| Scope | One parent hub, shadow-only |
| Runtime | Node.js CommonJS, no external packages |
| Source authority | Live hub router, mode registry, and four skill documents |
| Verification | Real shared projector and frozen read-only scorer |

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The shared compiler accepts an authored model and emits `CompiledPolicyV1`; the shared projector converts typed decisions to legacy route-gold; the frozen scorer evaluates that projection. The hub contains three homogeneous actor destinations with equal weights and authored tie-break order.

### Overview

Read and hash the live authored sources, validate their mutual alignment, compile a policy and destination graph, generate all artifacts canonically, then run canaries across positive, ambiguous, empty, and forbidden requests. Exercise the shared execution and fenced-manifest implementations without any real external effect.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The target child is the only writable scope.
- The three completed siblings, shared contracts, hub sources, executor skills, and design authority have been read.
- Protected scorer SHA-256 values are captured before implementation.

### Definition of Done

- All seven `.cjs` files pass `node --check`.
- Two consecutive builds produce identical compiled and activation bytes.
- Eight typed cases pass the real scorer; a corrupted row fails.
- Closed-algebra, advisor, policy-card, execution, activation, rollback, source, and static gates pass.
- Level-2 docs and metadata reflect the verified state.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Use a read-only compiler adapter around the shared compiler, a typed evaluator around the shared decision contract, and generated compatibility artifacts around the shared projector. Keep activation and execution as shadow-only proofs.

### Key components (and the contracts they touch)

| Component | Responsibility | Shared contract |
|-----------|----------------|-----------------|
| `registry-compiler.cjs` | Validate source identity and compile policy/graph/projection | canonical serializer; shared compiler |
| `router.cjs` | Score authored selectors and emit typed decisions | decision contract |
| `policy-card.cjs` | Generate and replay document-only compiled payload | typed evaluator |
| `execution-fence.cjs` | Commit actors only through the shared execution plane | PREPARE→VERIFY→COMMIT |
| `activation-gate.cjs` | Aggregate hard blocks and pin checks | activation tuple |
| `build-artifacts.cjs` | Emit deterministic artifacts | shared projector |
| `validate-canary.cjs` | Exercise real scorer and all gates | frozen scorer; shared activation/execution |

### Data flow

Authored bytes → validated model → shared compiler → compiled policy/graph → typed decision → shared projector → frozen read-only scorer. The same policy feeds document replay, execution preparation, activation pinning, and rollback verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Effect |
|---------|--------|
| New child | New libraries, harnesses, fixture, artifacts, and docs |
| Live CLI hub | Read-only source input; unchanged |
| Shared contracts | Imported; unchanged |
| Protected scorer | Read-only oracle; unchanged |
| External CLIs | Not invoked |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Compile and shape

Validate router/registry/skill identity, derive the three actor destinations and selector classes, encode all authored explicit bundles, and emit canonical hashes.

### Phase 2: Fixtures and parity (scorer untouched)

Cover singles, pair/triple bundles, semantic ambiguity, zero signal, and forbidden input. Project every typed decision through the shared projector and score it with the real read-only scorer. Generate and replay the policy card.

### Phase 3: Fenced execution and rollback

Prove COMMIT is unreachable without READY, simulate one actor effect after VERIFY, reject wrong preimages and mixed generations, and CAS back to byte-identical prior manifest bytes.

### Phase 4: Reconciliation

Run syntax, deterministic build, canary, strict packet, source-digest, and scope checks. Record exact evidence in the Level-2 documentation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Evidence |
|-----------|----------|
| Syntax | `node --check` on every `.cjs` |
| Determinism | Hash manifests before and after a second build |
| Contract | Shared schemas, parser, compiler, projector, and execution plane |
| Compatibility | Real read-only scorer on eight rows plus corrupted control |
| Safety | Negative smuggling, hard blocks, commit-before-verify, pin mismatch, mixed generation |
| Reversibility | Wrong-preimage refusal and byte-exact rollback |
| Protection | Before/after authored and scorer digests |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Shared canonical and schema contracts.
- Shared N-1 compiler and fenced-manifest implementation.
- Shared typed decision parser, projector, and read-only scorer driver.
- Shared destination execution plane.
- Live authored hub files as read-only inputs.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The build never changes serving authority. The drill copies retained prior bytes into a child-local temporary activation directory, swaps to the candidate under fencing epoch 0, then swaps back under epoch 1 and compares exact bytes. Cleanup removes only the validated temporary child directory. This rollback restores routing selection only; it cannot undo an external effect after COMMIT.
<!-- /ANCHOR:rollback -->
