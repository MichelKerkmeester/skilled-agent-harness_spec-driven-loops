---
title: "Implementation Plan: Phase 007 Evaluation and Observability"
description: "Implement measure whether output feels 1:1 with the reference while proving fidelity, latency, cost, privacy, and operational behavior. using the shared immutable-state architecture."
trigger_phrases:
  - "evaluation-and-observability"
  - "implementation plan"
  - "portable cli projection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/007-evaluation-and-observability"
    last_updated_at: "2026-08-11T10:15:00Z"
    last_updated_by: "codex"
    recent_action: "Repaired the Phase 007 powered-evaluation plan and telemetry ownership."
    next_safe_action: "Obtain project-owner approval, then execute T001 without scoring candidates early."
    blockers:
      - "Project-owner approval of the Proposed architecture decision is not yet recorded."
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-scaffold-20260811"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 007 Evaluation and Observability

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

Measure whether output feels 1:1 with the reference while proving fidelity, latency, cost, privacy, and operational behavior. The implementation keeps canonical runtime state immutable and emits only validated display projections or exact-original fallbacks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition of Ready

- [x] Problem, scope, and measurable success criteria are documented.
- [x] Dependencies and successor handoff are explicit.
- [x] The primary architecture decision and rollback are recorded.

### Definition of Done

- [ ] All P0 and P1 requirements have observed evidence.
- [ ] Focused tests and the authoritative workspace gate pass from final state.
- [ ] The checklist, task status, current-state summary, and metadata agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. Architecture

### Pattern

Immutable canonical state with a separate validated display-projection pipeline.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Corpus and analysis runner | Executes versioned cases, estimates pilot variance, and computes reproducible confidence intervals. |
| Pre-registration and blind review protocol | Freezes sample sizes and margins, randomizes masked comparisons, and collects at least three independent reviews per comparison. |
| Telemetry aggregator and exporter | Consumes allowlisted lifecycle events from Phases 003 through 006, applies rotating keyed digests, and validates redaction canaries. |

### Data Flow

Versioned case -> three-sample variance pilot -> pre-registered sample plan and margins -> powered blinded study -> deterministic vetoes and confidence intervals -> stratified release evidence. In parallel, allowlisted lifecycle events -> redaction and rotating keyed correlation -> aggregate export.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `packages/cli-communication-projection/src/evaluation/` | Proposed Phase 007 implementation surface | Create: Corpus runner, metrics, and blind review protocol | Focused tests plus scoped diff |
| `packages/cli-communication-projection/src/observability/` | Proposed Phase 007 implementation surface | Create: Aggregation, keyed correlation, export controls, and redaction over lifecycle events emitted earlier | Focused tests plus scoped diff |
| `packages/cli-communication-projection/test/evaluation/` | Proposed Phase 007 implementation surface | Create: Power-plan, blinding, confidence-interval, canary, and report reproducibility tests | Focused tests plus scoped diff |
| Parent and successor phase docs | Own boundaries and handoff | Keep synchronized if a contract changes | Recursive strict packet validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract and Boundary Preflight

- [ ] Confirm predecessor artifacts and freeze the input/output boundary.
- [ ] Inventory producers, consumers, independent matrix axes, and negative controls.

### Phase 2: Core Implementation

- [ ] Build the corpus and three-sample variance pilot, then freeze release-critical strata, sample sizes, and quality margins before candidate scoring.
- [ ] Implement deterministic vetoes, randomized blind-review packets, powered sampling, and per-dimension non-inferiority analysis.

### Phase 3: Verification and Handoff

- [ ] Implement lifecycle-event aggregation and export, then run rotating-key and redaction-canary audits.
- [ ] Reconcile checklist, summary, metadata, and successor handoff evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Statistical protocol | Pilot separation, power calculation, frozen margins, confidence intervals, and inconclusive-at-cap failure | Fixed seeds, synthetic distributions, and snapshot reports |
| Human protocol | Identity masking, randomized order, rubric completeness, three-reviewer minimum, and reviewer variance | Protocol fixtures and consistency checks |
| Privacy | Nested error, log, trace, and export canaries | Allowlist assertions and secret scan |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 evaluation and telemetry contracts | Internal | Required; not yet available | Phase 007 implementation cannot start |
| Phases 003-006 executable projection pipeline and lifecycle emitters | Internal | Required; not yet available | Phase 007 implementation cannot close |
| Phase 001 reference behavior and research corpus guidance | Evidence | Available | Phase 007 implementation cannot close |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. Rollback Plan

- **Trigger**: A fidelity, privacy, compatibility, or canonical-state invariant fails.
- **Procedure**: Disable telemetry export and retain local aggregate reports only; evaluation artifacts can be regenerated from the secret-free corpus.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: Phase Dependencies

```text
006-runtime-adapters-and-clients -> 007-evaluation-and-observability -> 008-packaging-and-release-hardening
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Boundary preflight | 006-runtime-adapters-and-clients | Core implementation |
| Core implementation | Boundary preflight | Verification |
| Verification and handoff | Core implementation | 008-packaging-and-release-hardening |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: Effort Estimation

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Boundary preflight | Medium | 3-4 days |
| Core implementation | High | 4-7 days |
| Verification and handoff | High | 2-4 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: Enhanced Rollback

### Pre-Change Checks

- [ ] Capture the authoritative test baseline.
- [ ] Confirm original-only mode remains available.
- [ ] Confirm no canonical transcript or tool-data migration is planned.

### Procedure

1. Stop new projections at the Phase 007 boundary.
2. Disable telemetry export and retain local aggregate reports only; evaluation artifacts can be regenerated from the secret-free corpus.
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
| Corpus and analysis runner | Phase 002 evaluation contracts and 006-runtime-adapters-and-clients | Pilot variance, frozen baselines, and reproducible statistical reports | Pre-registration and blind review protocol |
| Pre-registration and blind review protocol | Corpus and analysis runner plus owner-approved sample plan | Stratified per-dimension non-inferiority decisions | 008-packaging-and-release-hardening |
| Telemetry aggregator and exporter | Phase 002 telemetry contract and lifecycle emitters from Phases 003-006 | Content-free aggregates, keyed correlation, and redaction evidence | 008-packaging-and-release-hardening |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: Critical Path

1. **Freeze the predecessor contract** - 3-4 days - critical.
2. **Implement the primary boundary and failure behavior** - 4-7 days - critical.
3. **Pass negative controls and handoff gates** - 2-4 days - critical.

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

**Decision**: Gate release with deterministic safety plus blind human non-inferiority

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
| TASK-SCOPE | Modify only Phase 007 surfaces named by the approved task; route contract changes through the parent map. |
| TASK-PROOF | Run focused checks during repair, then rerun the authoritative whole gate from final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=007 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If a predecessor contract, pinned external capability, privacy boundary, or authoritative test disagrees with this plan, mark the task blocked, preserve the exact-original path, and update the decision record before resuming. Do not weaken a P0 invariant or expand scope silently.
