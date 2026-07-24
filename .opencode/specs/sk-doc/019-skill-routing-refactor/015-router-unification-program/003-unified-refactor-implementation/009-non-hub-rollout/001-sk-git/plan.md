---
title: "Implementation Plan: sk-git Non-Hub Router Rollout"
description: "Build a target-local sk-git rollout by adapting authored facts into the shared generic compiler, then verify deterministic projections, real-scorer compatibility, zero-authority parity, and fenced rollback."
trigger_phrases:
  - "sk-git rollout plan"
  - "sk-git target-local harness"
  - "sk-git rollback verification"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/001-sk-git"
    last_updated_at: "2026-07-19T10:40:49Z"
    last_updated_by: "codex"
    recent_action: "Completed the implementation plan and verification gates"
    next_safe_action: "No remaining packet work"
    blockers: []
    key_files:
      - "harness/run-sk-git.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-rollout-20260719"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-git Non-Hub Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, JSON, Markdown |
| **Framework** | Shared `CompiledPolicyV1` compiler and canonical contract modules |
| **Storage** | Deterministic child-local files only |
| **Testing** | Target-local harness, protected scorer subprocess, parity, syntax, hashes, strict packet validation |

### Overview

Parse the existing `sk-git/SKILL.md` router through the generic source model, adapt only the standalone destination facts, compile one immutable policy, and generate all projections from that snapshot. Verify the checked artifacts against the real scorer and legacy router without granting the compiled lane any live authority.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem, scope, source skill, write boundary, and protected files are explicit.
- [x] The full shared compiler archetype and authored `sk-git` resources were read.
- [x] The target-local gate avoids the known stale baseline artifact.

### Definition of Done

- [x] Compiled policy, projections, fixtures, manifests, and harness are emitted.
- [x] Real scorer, parity, algebra, rollback, hashes, and syntax checks pass.
- [x] Documentation reflects the implemented evidence.
- [x] Strict packet validation exits zero and completion metadata is reconciled.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Thin target adapter over frozen shared modules.

### Key Components

- **Source contract**: Freezes the authored standalone leaf set and destination metadata without inventing router behavior.
- **Build harness**: Calls the shared compiler, derives projections and fixtures, and byte-compares checked output.
- **Protected replay boundary**: Runs the frozen route-gold scorer in a read-only child process.
- **Parity adapter**: Reuses the shared shadow comparator while keeping legacy authoritative.
- **Activation adapter**: Reuses the shared fenced state machine for candidate selection and exact rollback.

### Data Flow

`sk-git/SKILL.md` plus the local source contract flow into the shared source model and compiler. One compiled snapshot feeds the advisor projection, typed route-gold, policy card, fixtures, and manifests; the target-local harness then evaluates those outputs through the protected scorer, legacy replay, algebra checks, and rollback drill.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read all frozen compiler, scorer, parity, activation, design, and authored skill inputs.
- [x] Capture the three protected scorer hashes.
- [x] Freeze the child-local source contract.

### Phase 2: Core Implementation

- [x] Build the target-local source adapter and deterministic compiler driver.
- [x] Generate the policy, three projections, activation artifacts, and typed fixture set.
- [x] Add protected scorer, parity, algebra, and rollback gates.

### Phase 3: Verification

- [x] Run explicit generation and read-only deterministic verification.
- [x] Run all CommonJS syntax checks and re-hash protected files.
- [x] Synchronize Level-2 documentation with observed evidence.
- [x] Run strict packet validation and set the final completion state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Determinism | Five compiles, two isolated processes, 13 generated artifacts | `node harness/run-sk-git.cjs` |
| Compatibility | Nine typed rows plus a deliberate false resource | Frozen scorer subprocess |
| Behavioral parity | Positive, zero-signal, ambiguous, and forbidden cases | Shared shadow parity module and legacy replay |
| Safety algebra | Non-route target/authority closure and zero ranking calls | Target-local assertions |
| Recovery | One-generation pin, stale epoch rejection, exact rollback | Shared fenced-manifest module |
| Static | Six CommonJS parse checks and protected SHA-256 values | `node --check`, `shasum -a 256` |
| Documentation | Level-2 templates, anchors, metadata, evidence | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Generic compiler modules | Internal read-only | Green | No policy can be compiled |
| Canonical contract modules | Internal read-only | Green | Hashes and schema validation cannot be trusted |
| Frozen scorer modules | Internal protected | Green | Real route-gold compatibility cannot be proven |
| Authored `sk-git` router and leaves | Internal read-only | Green | Intents, leaves, and defaults cannot be derived faithfully |
| Network or package installation | External | Not required | No impact; the gate is offline and dependency-free |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Artifact drift, scorer mismatch, parity classification failure, algebra violation, stale-fence acceptance, or protected hash change.
- **Procedure**: Stop without touching live routing; discard this additive child. The activation drill restores the retained prior manifest bytes while preserving the advanced fence epoch.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Frozen sources and scorer bytes | Implementation |
| Implementation | Setup source contract | Verification |
| Verification | Generated checked artifacts | Completion claim |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Relative Effort |
|-------|------------|-----------------|
| Setup and source study | Medium | High because the write boundary is strict |
| Target-local implementation | Medium | Moderate due to shared-module reuse |
| Verification and documentation | Medium | High because real scorer and rollback receipts are required |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Activation Checks

- [x] Legacy authority remains selected.
- [x] Candidate manifest is shadow-only.
- [x] Prior manifest bytes are retained.

### Rollback Procedure

1. Reject any stale activation epoch.
2. Select the retained prior manifest at the next fence epoch.
3. Compare restored bytes and SHA-256 to the pre-activation manifest.
4. Confirm the live routing surface was never modified.

### Data Reversal

No external data or effect exists. The rollout is additive and shadow-only.
<!-- /ANCHOR:l2-rollback -->
