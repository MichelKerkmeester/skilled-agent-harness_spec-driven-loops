---
title: "Implementation Plan: sk-doc Compiled Router Rollout"
description: "Compile immutable sk-doc routing inputs, generate canonical policy artifacts, exercise the real scorer, and prove fenced shadow activation and rollback."
trigger_phrases: ["sk-doc rollout plan", "compile sk-doc router", "validate sk-doc canary"]
importance_tier: "critical"
contextType: "implementation"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/007-sk-doc"
    last_updated_at: "2026-07-19T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Executed rollout plan"
    next_safe_action: "Retain shadow-only candidate"
    blockers: []
    key_files: ["harness/build-artifacts.cjs", "harness/validate-canary.cjs"]
    session_dedup:
      fingerprint: "sha256:ebe37294ba917ca2d186929f0cf3e47aa0eec8a1fce13c01678cffbc523a4e81"
      session_id: "sk-doc-rollout-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-doc Compiled Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---
<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Stack** | Node.js CommonJS |
| **Dependencies** | Built-ins plus frozen shared compiler/projector/evaluator |
| **Output** | Canonical JSON and Markdown |
| **Testing** | Offline real-scorer canary and repository validation |

Read all live hub inputs as immutable bytes, derive the policy locally, and evaluate independent
fixtures through the frozen decision and compatibility contracts.
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- [x] Source identity is SHA-256 pinned before and after validation.
- [x] Frozen schemas accept compiled projections and typed gold.
- [x] Real scorer is GREEN with writeback disabled.
- [x] Rollback restores retained prior bytes exactly.
- [x] Candidate stays shadow-only with legacy serving authority.
<!-- /ANCHOR:quality-gates -->

---
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The registry compiler validates authored closure and calls the shared compiler. The router applies
authored commands, vocabulary weights, ambiguity, exact bundle rules, tie-break, defaults, and
negative admissions. The build harness emits policy projections; the validation harness drives
schemas, scorer, parity, authority, falsifier, digest, determinism, and rollback gates.
<!-- /ANCHOR:architecture -->

---
<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Only this child is written. Live `sk-doc`, shared phases, scorer files, siblings, and external
systems remain read-only.
<!-- /ANCHOR:affected-surfaces -->

---
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Derivation and compilation

1. Read sibling, design, shared, scorer, hub, registry, and packet sources.
2. Compile 12 modes and the exact authored bundle.
3. Generate compiled and activation artifacts.

### Phase 2: Verification and closure

4. Score typed canaries through the shared projector and real scorer.
5. Prove document/advisor parity, authority fencing, hard blocks, and rollback.
6. Run deterministic rebuild, syntax, strict packet, hash, and scope checks.
<!-- /ANCHOR:phases -->

---
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Fixtures cover all 12 exact commands, one ordered bundle, weighted dominance, ambiguity, null
default, and two forbidden paths. Falsifiers corrupt a real observation and mutate default, delta,
tie-break, bundle, resource, and source identity.
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Shared canonical serialization, compiler, fenced manifest, decision parser, projector, scorer,
  and PREPARE→VERIFY→COMMIT plane.
- Authored `sk-doc` hub, router, registry, and packet skills as read-only inputs.
<!-- /ANCHOR:dependencies -->

---
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Install the candidate only into a child-local activation copy, pin its generation, then fenced-CAS
the retained prior bytes back and assert exact equality.
<!-- /ANCHOR:rollback -->

---
<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Any shared schema, projector, scorer, or activation change invalidates this canary and requires a
fresh rollout evaluation.
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

Acceptance binds artifact digests, candidate/prior tuples, prior hash, source hashes, and fence.
Wrong digest, preimage, generation, or epoch blocks authority movement.
<!-- /ANCHOR:enhanced-rollback -->
