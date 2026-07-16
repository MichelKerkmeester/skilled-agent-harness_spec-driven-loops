---
title: "Implementation Plan: Convergence Math Unification ADR"
description: "Documents the completed ADR and parity-test plan for unifying convergence profile shape without changing behavior."
trigger_phrases:
  - "convergence profile unification"
  - "convergence math ADR"
  - "unified convergence profile"
  - "convergence fracture deep loop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/003-deep-loop-workflows/002-convergence-profile-unification-adr"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/council/convergence.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts"
      - ".opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Convergence Math Unification ADR

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode deep-loop-runtime JavaScript and TypeScript convergence modules |
| **Framework** | ADR-backed design contract plus Vitest parity coverage |
| **Storage** | Source comments, ADR content, and integration test fixtures |
| **Testing** | `convergence-script.vitest.ts` parity traces across three convergence surfaces |

### Overview
This completed work records a shared convergence profile shape while preserving per-loop metric semantics. The implementation pins current behavior with a parity test before any future migration, and explicitly rejects collapsing all loops into one universal formula.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Fractured convergence surfaces identified across research, council, and coverage-graph code.
- [x] Dependency on leaf 001 settled so `minIterations` remains a STOP-guard input.
- [x] Migration is scoped out until the ADR and parity baseline are complete.

### Definition of Done
- [x] ADR defines `threshold`, `weight`, `role`, `direction`, and `normalizer` fields.
- [x] ADR states per-loop semantics are preserved.
- [x] ADR rejects one universal convergence formula.
- [x] Parity test pins current threshold traces before migration.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Decision-first convergence contract: document the shared profile schema and pin present behavior before moving any runtime caller.

### Key Components
- **`convergence.cjs`**: Research convergence surface that receives the shared profile annotation.
- **`lib/council/convergence.cjs`**: Council convergence surface with separate round semantics.
- **`coverage-graph-signals.ts`**: Coverage-graph convergence signal surface.
- **`convergence-script.vitest.ts`**: Baseline parity test covering the current threshold traces.

### Data Flow
The ADR defines the profile fields, source annotations point each convergence surface to that contract, and the parity test exercises each current implementation. Future migration work must keep the parity baseline green or record an intentional behavior change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Research convergence | Computes research-mode threshold decisions | Add profile-schema contract reference | Parity test covers research threshold traces |
| Council convergence | Computes round-based council convergence | Add contract reference without semantic rewrite | Parity test covers council threshold traces |
| Coverage graph signals | Computes graph convergence signals | Add contract reference | Parity test covers graph threshold traces |
| ADR/test docs | Freezes the decision before migration | Record fields and rejected alternative | ADR validates and test passes |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and confirm the three convergence surfaces.
- [x] Confirm leaf 001 settled `minIterations` semantics.
- [x] Keep runtime migration outside this leaf.

### Phase 2: Core Implementation
- [x] Draft the ADR with shared profile fields and typed semantics.
- [x] Add profile-contract references to all three convergence surfaces.
- [x] Create the parity test that pins current threshold traces.
- [x] Document rejection of one universal formula.

### Phase 3: Verification
- [x] Validate the ADR has no placeholders.
- [x] Run the parity test against the current pre-migration code.
- [x] Confirm no convergence behavior changes are introduced by this leaf.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| ADR validation | Profile fields and rejected alternative | Spec validation |
| Parity | Current traces for all three convergence files | Vitest integration test |
| Regression guard | No runtime behavior change during decision phase | Review of parity output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-anti-convergence-floor` | Internal predecessor | Complete | Profile schema could contradict `minIterations` if semantics are unsettled |
| Future convergence migration | Follow-up | Not part of this leaf | Migration waits on this ADR and baseline |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: ADR fields conflict with loop-specific semantics or the parity test fails on current behavior.
- **Procedure**: Revert ADR references and the parity test, then re-open the convergence profile decision before any migration work proceeds.
<!-- /ANCHOR:rollback -->
