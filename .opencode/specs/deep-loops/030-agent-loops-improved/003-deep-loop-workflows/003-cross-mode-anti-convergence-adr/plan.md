---
title: "Implementation Plan: Cross-Mode Anti-Convergence Contract ADR"
description: "Documents the completed cross-mode antiConvergence contract, fail-closed stopPolicy, and optimizer invariant work."
trigger_phrases:
  - "cross-mode anti-convergence"
  - "antiConvergence contract ADR"
  - "optimizer invariant groups"
  - "stopPolicy fail-closed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/003-deep-loop-workflows/003-cross-mode-anti-convergence-adr"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json"
      - ".opencode/skills/deep-loop-workflows/deep-review/assets/deep_review_config.json"
      - ".opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json"
      - ".opencode/skills/deep-loop-workflows/deep-loop-council/assets/deep_council_config.json"
      - ".opencode/skills/deep-loop-runtime/assets/runtime_capabilities.json"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs"
      - ".opencode/skills/deep-loop-runtime/assets/optimizer-manifest.json"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cross-Mode Anti-Convergence Contract ADR

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode deep-loop workflow JSON config, runtime capability JSON, and JavaScript enforcement |
| **Framework** | `deep-loop-workflows` modes plus `deep-loop-runtime` optimizer and capability loading |
| **Storage** | Mode configs, runtime capabilities, and optimizer manifest |
| **Testing** | Config parse checks, capability-load rejection tests, optimizer invariant tests |

### Overview
This completed work projected a shared `antiConvergence` contract across research, review, context, and council modes. It also made stop-policy capability loading fail-closed and added optimizer invariants that reject impossible `minIterations > maxIterations` candidates while keeping `convergenceMode` non-tunable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research-mode semantics from leaf 001 are available.
- [x] Shared convergence-profile shape from leaf 002 is settled.
- [x] Cross-mode scope is limited to contract projection, not convergence math migration.

### Definition of Done
- [x] All four mode configs include `antiConvergence`.
- [x] Council mode uses `minRounds` for round-based semantics.
- [x] Runtime capabilities require `stopPolicy:"fail-closed"`.
- [x] Optimizer invariant group rejects invalid paired limits and leaves `convergenceMode` locked.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared policy projection: mode configs declare the same anti-convergence contract, runtime capabilities enforce fail-closed loading, and optimizer metadata prevents invalid candidates.

### Key Components
- **Mode config files**: Carry `antiConvergence.minIterations` or council `minRounds`, `convergenceMode`, and `stopPolicy`.
- **`runtime_capabilities.json`**: Declares fail-closed stop-policy capability for each mode.
- **`runtime-capabilities.cjs`**: Rejects missing stop-policy capability at load time.
- **`optimizer-manifest.json`**: Adds the invariant group for paired iteration limits and locked convergence mode.

### Data Flow
Each mode config exposes the anti-convergence settings, runtime capability loading verifies the policy exists, and optimizer candidate evaluation checks invariants before scoring. Invalid candidates are rejected before they can become loop configuration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Research/review/context configs | Mode-level loop controls | Add `antiConvergence.minIterations` contract | Config parse succeeds |
| Council config | Round-based mode controls | Add `antiConvergence.minRounds` contract | Config parse succeeds |
| Runtime capabilities | Stop-policy enforcement | Require `stopPolicy:"fail-closed"` | Missing field causes load error |
| Optimizer manifest | Candidate parameter constraints | Add invariant group and lock `convergenceMode` | Invalid candidate rejects before scoring |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and capture the four mode targets.
- [x] Confirm dependency on leaves 001 and 002.
- [x] Keep convergence math changes out of scope.

### Phase 2: Core Implementation
- [x] Add `antiConvergence` to research, review, and context configs.
- [x] Add council `antiConvergence.minRounds`.
- [x] Set `stopPolicy:"fail-closed"` in runtime capabilities.
- [x] Update `runtime-capabilities.cjs` to reject missing stop-policy capability.
- [x] Add optimizer invariant group for `minIterations <= maxIterations` and non-tunable `convergenceMode`.

### Phase 3: Verification
- [x] Confirm all four configs parse without schema errors.
- [x] Confirm missing `stopPolicy` causes a clear capability-load failure.
- [x] Confirm optimizer rejects an invalid min/max candidate before scoring.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Config validation | Four mode config files | JSON/schema validation |
| Capability failure | Missing `stopPolicy` | Runtime capability load test |
| Optimizer invariant | `minIterations:5`, `maxIterations:3` candidate | Optimizer manifest/unit test |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-anti-convergence-floor` | Internal predecessor | Complete | `minIterations` semantics would be undefined |
| `002-convergence-profile-unification-adr` | Internal predecessor | Complete | `convergenceMode` semantics could drift before optimizer constraints are written |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Mode configs fail to parse, capability loading rejects valid configs, or optimizer constraints block valid candidates.
- **Procedure**: Revert the four config projections, runtime capability enforcement, and optimizer invariant group, then re-open the ADR contract before reapplying cross-mode policy.
<!-- /ANCHOR:rollback -->
