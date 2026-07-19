---
title: "Implementation Plan: sk-design Compiled Router Rollout"
description: "Child-local compilation, canary projection, scorer verification, authority fencing, and rollback plan for sk-design."
trigger_phrases: ["sk-design rollout plan", "sk-design router implementation", "design canary plan"]
importance_tier: "critical"
contextType: "implementation"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/006-sk-design"
    last_updated_at: "2026-07-19T11:08:33.000Z"
    last_updated_by: "codex"
    recent_action: "Recorded the sk-design shadow rollout plan."
    next_safe_action: "Retain the compiled candidate in shadow-only authority."
---
# Implementation Plan: sk-design Compiled Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---
<!-- ANCHOR:summary -->
## 1. SUMMARY

Read live authored bytes, compile hub signals and nested leaf routers through the shared compiler,
evaluate typed decisions, project them through the shared projector, score them through the frozen
read-only scorer, and prove fenced rollback without changing live authority.
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- [x] Authored and scorer bytes hash-identical before and after validation. [VERIFIED: canary output reports all three protected SHA-256 values.]
- [x] Policy, advisor, policy-card, and typed route-gold schemas pass. [VERIFIED: canary output reports `schemaValidation: pass`.]
- [x] Thirteen live and thirteen persisted scorer rows pass with writeback false. [VERIFIED: canary output reports thirteen REAL-GREEN rows and `writeBackAttempted: false`.]
- [x] Corrupted resource observation fails the scorer. [VERIFIED: canary output reports `falsifierRejected: true`.]
- [x] Rollback restores exact prior bytes. [VERIFIED: canary output reports `byteExact: true` and equal prior/restored hashes.]
<!-- /ANCHOR:quality-gates -->

---
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The compiler validates the six-mode registry and hub router, parses each packet's authored Python-like
router map, normalizes its leaf resources, and calls the shared `compile()` implementation. The pure
router emits the closed decision algebra; the build harness projects selected nested leaves through
the shared projector; activation and execution fences preserve authority boundaries.
<!-- /ANCHOR:architecture -->

---
<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Only this additive child is writable. Live `sk-design`, shared contracts, scorer files, siblings,
external systems, git history, and remotes remain unchanged.
<!-- /ANCHOR:affected-surfaces -->

---
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Derive

1. Read the sibling archetypes, authority synthesis, hub, registry, and packet routers.
2. Capture protected hashes and verify the target child is absent.

### Phase 2: Build

3. Implement compiler, router, card, activation, and execution fences.
4. Author canaries and generate compiled plus activation artifacts.

### Phase 3: Verify

5. Run schemas, real scorer, document/advisor parity, authority, falsifier, and rollback checks.
6. Run syntax, strict packet, final hash, and final scope checks.
<!-- /ANCHOR:phases -->

---
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Canaries cover six single modes, the named UI-build bundle, a separate interface-plus-motion bundle,
one clarify, two defers, two rejects, and five advisor states. Falsifiers cover corrupted scorer
observations, default drift, tie-break drift, named-bundle drift, packet resource drift, and source
identity drift.
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Canonical serialization and hashes.
- Shared N-way compiler and JSON-schema validator.
- Shared decision contract, route-gold projector, and read-only replay driver.
- Shared execution plane and fenced manifest swap.
- Live `sk-design` authored bytes as read-only inputs.
<!-- /ANCHOR:dependencies -->

---
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Keep legacy serving authority. In a child-local temporary activation copy, fenced-swap from the prior
manifest to the candidate, pin the candidate tuple, then fenced-swap the exact retained prior bytes
back and verify byte equality plus fence epoch two.
<!-- /ANCHOR:rollback -->

---
<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Any shared schema, compiler, decision parser, projector, scorer, or activation change invalidates
this canary and requires a fresh build and replay.
<!-- /ANCHOR:phase-deps -->

---
<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Five libraries, two harnesses, one fixture, ten generated/activation artifacts, and seven packet
documents or metadata files.
<!-- /ANCHOR:effort -->

---
<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Acceptance binds five artifact digests, candidate and prior tuples, the exact prior hash, every
authored source digest, and fencing epoch. Any mismatch blocks activation.
<!-- /ANCHOR:enhanced-rollback -->
