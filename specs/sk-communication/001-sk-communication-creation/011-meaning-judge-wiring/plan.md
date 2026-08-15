---
title: "Implementation Plan: Phase 011 Meaning-Judge Wiring"
description: "Compose the production provider, validator, local reject-only judge, and render path with exact-original behavior for every negative or unavailable judge outcome."
trigger_phrases:
  - "meaning-judge-wiring"
  - "implementation plan"
  - "reject-only meaning gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/011-meaning-judge-wiring"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned local meaning-judge composition scaffold."
    next_safe_action: "Inventory the production module graph and freeze the local judge boundary."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 011 Meaning-Judge Wiring

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript provider, fidelity, judge, and render modules |
| **Framework** | Runtime-neutral projection composition |
| **Storage** | Immutable canonical runtime state; no judge persistence |
| **Testing** | Composition tests, egress canaries, terminal-state matrix, and package gate |

### Overview

Compose the existing provider output, deterministic validator, local reject-only judge, and render decision into one production path. Preserve exact-original behavior and prevent hosted egress of decoded or restored text.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Production producers, consumers, and evaluation-only modules are inventoried.
- [ ] Stage order and local judge boundary are frozen.
- [ ] Every judge terminal state has an expected exact-original outcome.

### Definition of Done

- [ ] All eight requirements and six scenarios have observed evidence.
- [ ] No hosted egress contains decoded source or restored candidate text.
- [ ] The package gate and strict packet validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fail-closed production composition with a local post-restoration reject-only policy gate.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Provider executor | Produces the candidate under existing privacy routing |
| Deterministic validator | Restores and rejects structural or fidelity failures before judgment |
| Local meaning judge | Rejects meaning loss only after restoration |
| Render decision | Selects projection only after all gates pass; otherwise exact-original |

### Data Flow

Assemble -> protect -> privacy route/provider -> deterministic restore/validate -> local reject-only judge -> render projection or exact-original.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Provider executor | Produces candidates | Feed output into the production composition | Composition test |
| Fidelity validator | Restores and validates candidates | Bind the local reject-only judge after deterministic checks | Stage-order tests |
| Render decision | Chooses display output | Consume explicit gate result and retain exact-original fallback | Terminal-state matrix |
| Proxy evaluation modules | Offline provisional comparison | Remain outside production composition | Import/module-boundary assertion |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Inventory module graph, boundaries, and current terminal states.
- [ ] Freeze stage order, local-only egress policy, and reject-only judge contract.

### Phase 2: Implementation

- [ ] Add one production composition and local judge binding.
- [ ] Map rejection, timeout, cancellation, exception, absence, and invalid output to exact-original.
- [ ] Keep proxy evaluation imports outside the runtime path.

### Phase 3: Verification

- [ ] Run composition, terminal-state, module-boundary, and egress tests.
- [ ] Prove canonical state is unchanged.
- [ ] Run the package gate and strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Composition | Provider -> validator -> local judge -> render order | TypeScript integration tests |
| Failure matrix | Rejected, timeout, cancellation, exception, missing, invalid result | Deterministic stubs and exact-byte assertions |
| Privacy | No hosted egress of decoded/restored text | Transport canaries and local-boundary assertions |
| Regression | Canonical immutability and evaluation separation | Existing suite plus `npm run check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing provider, validator, judge, and render contracts | Internal | Available | Composition cannot be wired |
| Local judge implementation | Runtime | Required for projection; absence must fail closed | Projection stays exact-original |
| Phases 009 and 010 | Related | Optional | Candidate quality may be lower, but composition remains testable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Hosted egress occurs, stage order is wrong, a judge failure accepts, or canonical state changes.
- **Procedure**: Disable the production judge composition, return all affected candidates to exact-original, rerun transport canaries and byte assertions, and restore the prior module graph.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Boundary inventory -> Production composition -> Failure/privacy/canonical verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Boundary inventory | Existing module graph | Composition |
| Composition | Frozen local reject-only contract | Verification |
| Verification | Implemented composition | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Boundary inventory | Medium | 1 day |
| Production composition | High | 2-4 days |
| Verification and handoff | High | 2-3 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [ ] Capture current exact-original behavior and module graph.
- [ ] Confirm no hosted judge route exists.
- [ ] Seed every judge terminal state.

### Procedure

1. Disable the new composition entry point.
2. Route candidate handling to exact-original.
3. Rerun egress canaries and terminal-state tests.
4. Confirm canonical transcript and event bytes remain unchanged.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Remove the composition wiring only; canonical state is never rewritten.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Provider candidate -> Deterministic restore/validate -> Local reject-only judge -> Render decision
                              |                            |                     |
                              +---------------- exact-original ----------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Deterministic validator | Provider candidate and protected map | Restored valid candidate or rejection | Judge |
| Local judge | Valid restored candidate and local boundary | Accept or reject-only outcome | Render |
| Render decision | Gate outcome and exact original | Projection or exact-original | Handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Freeze production and privacy boundaries** - 1 day - critical.
2. **Implement composition and terminal-state mapping** - 2-4 days - critical.
3. **Pass failure, egress, and canonical-state gates** - 2-3 days - critical.

**Parallel opportunities**:

- Terminal-state fixtures and egress canaries can be authored after the boundary freeze.
- Module-boundary checks can proceed beside composition implementation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Boundary frozen | Stage order, local egress, and terminal states defined | Stage 1 |
| M2 | Composition wired | Valid candidates reach the local judge and render gate | Stage 2 |
| M3 | Handoff accepted | Every negative fails closed and no hosted plaintext egress occurs | Stage 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION SUMMARY

**Decision**: Compose a local post-restoration reject-only judge and return exact-original for every negative or unavailable outcome.

**Status**: Proposed. Full rationale and alternatives are in `decision-record.md`.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the module graph, stage order, local judge boundary, and exact-original baseline.
- Re-read every target module before editing and keep evaluation-only imports outside production.
- Enumerate every judge terminal state and expected render outcome before implementation.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Deterministic restoration must precede judgment; judgment must precede render selection. |
| TASK-SCOPE | Compose existing boundaries only; do not add hosted plaintext judgment or fluency ranking. |
| TASK-PROOF | Run terminal-state, egress, module-boundary, and canonical-byte negatives before the whole package gate. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=011 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If the judge cannot remain local, a terminal state lacks an exact-original mapping, or evaluation-only code enters production, stop the task and retain exact-original behavior until the boundary is corrected.
