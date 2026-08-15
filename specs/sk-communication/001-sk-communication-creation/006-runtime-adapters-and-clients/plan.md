---
title: "Implementation Plan: Phase 006 Runtime Adapters and Clients"
description: "Implement integrate the projection core with six clis through their safest supported event and presentation boundaries. using the shared immutable-state architecture."
trigger_phrases:
  - "runtime-adapters-and-clients"
  - "implementation plan"
  - "portable cli projection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/006-runtime-adapters-and-clients"
    last_updated_at: "2026-08-12T04:14:38Z"
    last_updated_by: "codex"
    recent_action: "Received the verified Phase 005 provider and privacy handover."
    next_safe_action: "Approve the Phase 006 architecture, then execute T001."
    blockers:
      - "Project-owner approval of the Proposed architecture decision is not yet recorded."
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "specs/sk-communication/001-sk-communication-creation/005-provider-adapters-and-privacy/handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-scaffold-20260811"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "Phase 005 is complete with a verified 89-test provider/privacy baseline."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 006 Runtime Adapters and Clients

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. Summary

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript reference core with JSON-compatible protocol contracts |
| **Framework** | Runtime-neutral library plus thin provider, runtime, and client adapters |
| **Storage** | Immutable in-memory state and versioned fixture files; no transcript database |
| **Testing** | Project-selected TypeScript runner, fixture replay, property checks, and smoke harnesses |

### Overview

Integrate the projection core with six CLIs through their safest supported event and presentation boundaries. The implementation keeps canonical runtime state immutable and emits only validated display projections or exact-original fallbacks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition of Ready

- [x] Problem, scope, and measurable success criteria are documented.
- [x] Dependencies and successor handoff are explicit.
- [x] The primary architecture decision and rollback are recorded.

### Definition of Done

- [x] All P0 and P1 requirements have observed evidence.
- [x] Focused tests and the authoritative workspace gate pass from final state.
- [x] The checklist, task status, current-state summary, and metadata agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. Architecture

### Pattern

Immutable canonical state with a separate validated display-projection pipeline.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Runtime adapters | Translate supported event lifecycles into shared envelopes and generations. |
| Capability mapper | Turns pinned runtime evidence into a `full-projection` or `safe-native` tier plus allowed degradation modes. |
| Client presentation | Owns complete-message replacement for full-projection paths and append, sidecar, or original-only output for safe-native paths. |

### Data Flow

Runtime event surface -> adapter -> tiered capability decision -> shared core and provider pipeline -> render decision -> atomic client-owned projection, native append, sidecar, or original-only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `packages/cli-communication-projection/src/runtimes/` | Proposed Phase 006 implementation surface | Create: Six runtime adapters and capability records | Focused tests plus scoped diff |
| `packages/cli-communication-projection/src/clients/` | Proposed Phase 006 implementation surface | Create: Client-owned display and sidecar integrations | Focused tests plus scoped diff |
| `packages/cli-communication-projection/test/runtimes/` | Proposed Phase 006 implementation surface | Create: Pinned fixture replay and smoke harnesses | Focused tests plus scoped diff |
| Parent and successor phase docs | Own boundaries and handoff | Keep synchronized if a contract changes | Recursive strict packet validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract and Boundary Preflight

- [ ] Confirm predecessor artifacts and freeze the input/output boundary.
- [ ] Inventory producers, consumers, independent matrix axes, and negative controls.

### Phase 2: Core Implementation

- [ ] Implement adapter contract and shared conformance harness.
- [ ] Implement the six runtime mappings, tier decisions, and client-owned or safe-native presentation paths.

### Phase 3: Verification and Handoff

- [ ] Run pinned fixture replay, disconnect, cancellation, and degraded-mode smoke tests.
- [ ] Reconcile checklist, summary, metadata, and successor handoff evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Conformance | All adapters emit shared contracts and retain extensions | Pinned fixture replay |
| Smoke | Accepted, rejected, timeout, cancellation, disconnect, and degradation flows stratified by presentation tier | Headless runtime or protocol harness |
| Negative control | No canonical writes and no undocumented hook use | State snapshots and boundary spies |
| Tier claims | Complete-message ownership and atomic render proof for full projection; no suppression-before-validation for safe native | Pinned capability probes and render snapshots |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 002-005 shared contracts, core, fidelity, rendering, providers, and privacy policy | Internal | Available; Phase 005 is complete and verified | None |
| Pinned runtime protocol and version matrix from Phase 001 | Evidence | Available | Phase 006 implementation cannot close |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. Rollback Plan

- **Trigger**: A fidelity, privacy, compatibility, or canonical-state invariant fails.
- **Procedure**: Disable the affected adapter or select original-only rendering for that runtime; no transcript migration or vendor patch reversal is needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: Phase Dependencies

```text
005-provider-adapters-and-privacy -> 006-runtime-adapters-and-clients -> 007-evaluation-and-observability
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Boundary preflight | 005-provider-adapters-and-privacy | Core implementation |
| Core implementation | Boundary preflight | Verification |
| Verification and handoff | Core implementation | 007-evaluation-and-observability |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: Effort Estimation

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Boundary preflight | Medium | 2-3 days |
| Core implementation | High | 8-12 days |
| Verification and handoff | High | 3-5 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: Enhanced Rollback

### Pre-Change Checks

- [ ] Capture the authoritative test baseline.
- [ ] Confirm original-only mode remains available.
- [ ] Confirm no canonical transcript or tool-data migration is planned.

### Procedure

1. Stop new projections at the Phase 006 boundary.
2. Disable the affected adapter or select original-only rendering for that runtime; no transcript migration or vendor patch reversal is needed.
3. Replay the exact failing fixture and the six-runtime smoke subset.
4. Record the rollback evidence before resuming work.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Projection artifacts can be removed; immutable canonical runtime data is never rewritten.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: Dependency Graph

```text
Predecessor evidence
        |
        v
Boundary contracts -> Core implementation -> Focused verification
        |                                      |
        +------------ negative controls -------+
                                               |
                                               v
                                      Successor handoff
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Runtime adapters | 005-provider-adapters-and-privacy plus pinned runtime protocols | Translate supported event lifecycles into shared envelopes and generations. | Capability mapper |
| Capability mapper | Runtime adapters and pinned evidence | Assigns full-projection or safe-native plus allowed degradation modes. | Client presentation |
| Client presentation | Capability mapper | Owns atomic complete-message output for full projection or append, sidecar, and original-only output for safe native. | Tier-stratified 007-evaluation-and-observability |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: Critical Path

1. **Freeze the predecessor contract** - 2-3 days - critical.
2. **Implement the primary boundary and failure behavior** - 8-12 days - critical.
3. **Pass negative controls and handoff gates** - 3-5 days - critical.

**Parallel opportunities**:

- Fixture authoring and focused unit-test harnesses can proceed after boundary preflight.
- Documentation and observability fields can progress alongside core code if contracts remain frozen.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: Milestones

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Boundary frozen | Inputs, outputs, invariants, and failure modes approved | Stage 1 |
| M2 | Core behavior implemented | Primary and failure paths pass focused tests | Stage 2 |
| M3 | Phase handoff accepted | Checklist evidence and strict validation pass | Stage 3 |
<!-- /ANCHOR:milestones -->

---

## L3: Architecture Decision Summary

**Decision**: Use client-owned presentation whenever native interception is not explicitly safe

**Status**: Proposed. Project-owner approval is required before implementation. Full rationale and alternatives are in `decision-record.md`.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the predecessor handoff and authoritative baseline before T001.
- Re-read every target file before editing and keep writes inside the frozen phase scope.
- Translate each requirement into an observable check before implementation.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow `tasks.md` in order; implementation cannot precede boundary preflight. |
| TASK-SCOPE | Modify only Phase 006 surfaces named by the approved task; route contract changes through the parent map. |
| TASK-PROOF | Run focused checks during repair, then rerun the authoritative whole gate from final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=006 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If a predecessor contract, pinned external capability, privacy boundary, or authoritative test disagrees with this plan, mark the task blocked, preserve the exact-original path, and update the decision record before resuming. Do not weaken a P0 invariant or expand scope silently.
