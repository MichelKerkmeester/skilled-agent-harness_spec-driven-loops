---
title: "Implementation Plan: Unified Router Rollout — sk-prompt"
description: "Compile the authored two-mode hub through shared contracts. Preserve its bounded default and ordered bundle, generate deterministic projections, and prove real-green through the frozen scorer and rollback drill."
trigger_phrases:
  - "sk-prompt rollout plan"
  - "bounded default compile plan"
  - "sk-prompt canary verification plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/005-sk-prompt"
    last_updated_at: "2026-07-19T23:59:59Z"
    last_updated_by: "codex"
    recent_action: "Executed the complete implementation and verification plan"
    next_safe_action: "Keep the compiled candidate shadow-only"
    blockers: []
    key_files:
      - "harness/build-artifacts.cjs"
      - "harness/validate-canary.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-prompt-rollout-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Unified Router Rollout — sk-prompt

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | Shared router compiler, evaluator, and projector |
| **Storage** | Canonical child-local JSON artifacts |
| **Testing** | Node syntax checks, deterministic rebuild, frozen scorer, strict packet validation |

### Overview

Read authored hub files as immutable bytes, adapt them into shared compiler inputs, and generate
one canonical policy plus read-only projections. The request adapter preserves the bounded default
because the frozen policy schema has no free-standing default-mode field.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem, scope, and measurable success criteria are documented. [EVIDENCE: spec.md requirements and success criteria]
- [x] Dependencies and protected boundaries are identified. [EVIDENCE: source and scorer hash baselines]
- [x] Required siblings, hub inputs, contracts, and design authority were read. [EVIDENCE: implementation intake]

### Definition of Done

- [x] Shared compiler artifacts are schema-valid and byte-stable. [EVIDENCE: build-artifacts deterministic recompile]
- [x] Delivered typed route-gold scores 8/8 real-green. [EVIDENCE: validate-canary realGreenRows=8]
- [x] Default, bundle, algebra, document, fence, source, and rollback gates pass. [EVIDENCE: validate-canary status=real-green]
- [x] Level-2 docs and generated metadata pass strict validation. [EVIDENCE: strict packet validator exit 0]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Content-addressed compiler adapter with pure decision projection and shadow-only activation fence.

### Key Components

- **Registry compiler adapter**: validates source identity and calls the shared compiler.
- **Canary router**: applies authored weighted signals, composition, ambiguity, and bounded default.
- **Compatibility projector**: maps selected mode/resource pairs through the shared projector.
- **Policy card**: embeds routing metadata for independent document replay.
- **Activation gate and fence**: hard-blocks semantic drift and proves exact rollback.

### Data Flow

`authored hub bytes → shared compiler → policy and routing metadata → typed decisions → shared
projector → real read-only scorer → fenced shadow canary`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Bind and hash all five authored input files. [EVIDENCE: compiled sourceHashes]
- [x] Validate modes, default, tie-break, outcomes, weights, and packet resources. [EVIDENCE: build status=built]

### Phase 2: Core Implementation

- [x] Compile destinations, signals, resources, authority edges, and ordered composition. [EVIDENCE: compiled/policy.json]
- [x] Implement weighted singles, one clarify, explicit bundle, defer, reject, and bounded default. [EVIDENCE: fixtures and router]
- [x] Generate policy, advisor, graph, policy card, typed route-gold, and activation artifacts. [EVIDENCE: compiled and activation trees]

### Phase 3: Verification

- [x] Score in-memory and delivered observations through the real scorer. [EVIDENCE: 8 real-green, 0 shadow-partial]
- [x] Drive corruption, algebra, bundle-order, document, execution, and generation falsifiers. [EVIDENCE: validate-canary hard-block output]
- [x] Prove byte-identical rebuild and byte-exact rollback. [EVIDENCE: deterministic rebuild and rollback hashes]
- [x] Re-read protected scorer bytes and validate the packet strictly. [EVIDENCE: pinned hashes and strict exit 0]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Syntax | Every child-local CommonJS file | `node --check` |
| Determinism | Complete compiled and activation artifact sets | Two builds plus SHA-256 comparison |
| Integration | Shared compile/projector and real frozen scorer | `node harness/validate-canary.cjs` |
| Contract | Level-2 packet structure and metadata | strict spec-kit validator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Shared canonical library and compiler | Internal | Green | Cannot construct or hash the frozen policy contract |
| Shared projector and decision evaluator | Internal | Green | Cannot prove real route-gold parity |
| Three protected scorer files | Internal, read-only | Green | Any hash drift blocks REAL-GREEN |
| Five live authored hub files | Internal, read-only | Green | Any hash drift blocks source-bound compilation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any scorer/source digest drift, algebra failure, generation mismatch, lost default,
  reversed bundle, or COMMIT without VERIFY.
- **Procedure**: Keep legacy serving authority, reject candidate eligibility, and restore the
  retained prior activation manifest byte-for-byte. Workspace rollback is deletion of this
  isolated uncommitted child.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

`Source binding → shared compilation and routing → real scorer and rollback verification`.

| Phase | Depends On | Blocks |
|---|---|---|
| Setup | Authored and shared inputs | Core implementation |
| Core implementation | Setup | Verification |
| Verification | Core implementation | REAL-GREEN claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup and study | Medium | Completed in this implementation session |
| Core implementation | High | Completed in this implementation session |
| Verification and packet reconciliation | High | Completed in this implementation session |
| **Total** | **High** | **One bounded rollout child** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Prior manifest retained. [EVIDENCE: activation/manifest.prior.json]
- [x] Candidate is shadow-only and legacy-authoritative. [EVIDENCE: activation manifests]
- [x] Hard blockers include scorer/source drift and mixed generations. [EVIDENCE: activation gate validation]

### Rollback Procedure

1. Refuse candidate eligibility.
2. Swap the retained prior bytes through the fence.
3. Verify restored and prior SHA-256 values match.
4. Leave legacy serving authority unchanged.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: No data state exists; restore the prior manifest and remove the child if required.
<!-- /ANCHOR:enhanced-rollback -->

