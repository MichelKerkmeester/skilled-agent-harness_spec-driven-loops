---
title: "Implementation Plan: Phase 003 Core Normalization and Assembly"
description: "Implement the runtime-neutral core that normalizes events and assembles one deterministic message without changing canonical state."
trigger_phrases:
  - "core-normalization-and-assembly"
  - "implementation plan"
  - "portable cli projection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/003-core-normalization-and-assembly"
    last_updated_at: "2026-08-11T17:03:53Z"
    last_updated_by: "codex"
    recent_action: "Completed the Phase 003 implementation and package verification."
    next_safe_action: "Use handover.md to begin the Phase 004 boundary preflight."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "The Phase 002 package and fixture dependencies are available and verified."
      - "The final package gate passes 47 tests with no added production dependencies."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 003 Core Normalization and Assembly

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. Summary

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript reference core with JSON-compatible protocol contracts |
| **Framework** | Runtime-neutral library plus thin provider, runtime, and client adapters |
| **Storage** | Immutable in-memory state and versioned fixture files. No transcript database. |
| **Testing** | Project-selected TypeScript runner, fixture replay, property checks, and smoke harnesses |

### Overview

Build the runtime-neutral core that normalizes events, assembles one deterministic message, selects bounded rewrite context under policy, and emits content-free lifecycle evidence without changing canonical state.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition of Ready

- [x] Problem, scope, and measurable success criteria are documented.
- [x] Dependencies and successor handoff are explicit.
- [x] The primary architecture decision and rollback are recorded.

### Definition of Done

- [x] All P0 and P1 requirements have observed evidence. [evidence: `checklist.md` maps every requirement to final-state tests and scans]
- [x] Focused tests and the authoritative workspace gate pass from final state. [evidence: 17 focused core tests and 47 package tests pass]
- [x] The checklist, task status, current-state summary, and metadata agree. [evidence: final reconciliation on 2026-08-11]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. Architecture

### Pattern

Immutable canonical state with a separate validated display-projection pipeline.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Normalizer | Maps runtime events into the shared envelope without mutation. |
| Assembler | Runs a generation-keyed lifecycle with explicit terminal states. |
| Context provider | Selects the last eligible non-meta user message from the contracted transcript view, enforces freshness and codepoint bounds, and returns typed absent or privacy-denied outcomes. |
| Bound policy | Applies byte, event, timer, retry, and cancellation limits. |
| Evidence emitter | Emits schema-valid content-free lifecycle events throughout core processing. |

### Data Flow

Runtime events -> immutable normalization -> generation-keyed buffer -> deterministic assembly -> bounded context selection -> completed request candidate or typed exact-original fallback. Each transition may emit only contract-approved content-free evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `packages/cli-communication-projection/src/core/` | Implemented Phase 003 core | Created deterministic normalization, bounded input parsing, assembly state and exact-original outcomes | 10 focused normalization and assembly tests |
| `packages/cli-communication-projection/src/context/` | Implemented request-scoped context boundary | Created bounded, privacy-aware context selection | 4 context tests and six contract fixtures |
| `packages/cli-communication-projection/src/observability/` | Implemented evidence boundary | Created closed, content-free lifecycle evidence | 3 evidence tests and secret canaries |
| `packages/cli-communication-projection/test/core/` | Implemented Phase 003 verification surface | Created adversarial and performance coverage | 17 focused tests plus the 47-test package gate |
| Parent and successor phase docs | Own boundaries and handoff | Synchronized final state and next action | Recursive strict packet validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract and Boundary Preflight

- [x] Confirm predecessor artifacts and freeze the input/output boundary.
- [x] Inventory producers, consumers, independent matrix axes, and negative controls.

### Phase 2: Core Implementation

- [x] Implement normalization and ordering invariants.
- [x] Implement the bounded generation state machine, context provider, and evidence emitter.

### Phase 3: Verification and Handoff

- [x] Replay adversarial fixture matrices and prove cleanup.
- [x] Reconcile checklist, summary, metadata, and successor handoff evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Ordering, deduplication, lifecycle, and bounds | Deterministic table tests |
| Concurrency | Parallel sessions, retries, cancellation, and late events | Controlled scheduler and fixture replay |
| Property | Replay determinism and immutable originals | Digest and invariant assertions |
| Context | Present, absent, stale, truncated, meta-only, and privacy-denied transcript views | Phase 002 context fixtures and no-persistence assertions |
| Evidence | Allowed fields, typed suppression, rotating keyed digest use, and secret canaries | Schema tests and exported-event scan |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 versioned contracts | Internal | Available and verified | Incompatible changes block Phase 003 |
| Phase 002 six-runtime, context, prompt, and telemetry fixtures | Evidence | Available and verified | Fixture replay failure blocks Phase 003 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. Rollback Plan

- **Trigger**: A fidelity, privacy, compatibility, or canonical-state invariant fails.
- **Procedure**: Disable the projection core entry point and return original runtime text. Canonical event storage remains untouched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: Phase Dependencies

```text
002-contracts-and-fixtures -> 003-core-normalization-and-assembly -> 004-protected-spans-fidelity-render
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Boundary preflight | 002-contracts-and-fixtures | Core implementation |
| Core implementation | Boundary preflight | Verification |
| Verification and handoff | Core implementation | 004-protected-spans-fidelity-render |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: Effort Estimation

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Boundary preflight | Medium | 1-2 days |
| Core implementation | High | 4-6 days |
| Verification and handoff | High | 2-3 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: Enhanced Rollback

### Pre-Change Checks

- [x] Capture the authoritative test baseline. [evidence: 30 pre-phase tests and absent-export negative control]
- [x] Confirm original-only mode remains available. [evidence: timeout, cancellation, overflow, corrupt-input and empty-output tests]
- [x] Confirm no canonical transcript or tool-data migration is planned. [evidence: package-only implementation and immutable input assertions]

### Procedure

1. Stop new projections at the Phase 003 boundary.
2. Disable the projection core entry point and return original runtime text. Canonical event storage remains untouched.
3. Replay the exact failing fixture and the six-runtime smoke subset.
4. Record the rollback evidence before resuming work.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Projection artifacts can be removed. Immutable canonical runtime data is never rewritten.
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
| Normalizer | 002-contracts-and-fixtures | Maps runtime events into the shared envelope without mutation. | Assembler |
| Assembler | Normalizer | Runs a generation-keyed lifecycle with explicit terminal states. | Bound policy and context provider |
| Bound policy | Assembler | Applies byte, event, timer, retry, and cancellation limits. | Completed message candidate |
| Context provider | Completed message candidate and Phase 002 context policy | Selects bounded request-scoped user context or a typed no-context result. | 004-protected-spans-fidelity-render |
| Evidence emitter | Phase 002 telemetry contract | Emits content-free state and reason events for every core boundary. | 007-evaluation-and-observability aggregation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: Critical Path

1. **Freeze the predecessor contract** - 1-2 days - critical.
2. **Implement the primary boundary and failure behavior** - 4-6 days - critical.
3. **Pass negative controls and handoff gates** - 2-3 days - critical.

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

**Decision**: Use a generation-keyed state machine with explicit ordering domains

**Status**: Accepted and implemented. The project owner directed the work to continue on 2026-08-11. Full rationale, alternatives and implementation evidence are in `decision-record.md`.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the predecessor handoff and authoritative baseline before T001.
- Re-read every target file before editing and keep writes inside the frozen phase scope.
- Translate each requirement into an observable check before implementation.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow `tasks.md` in order. Implementation cannot precede boundary preflight. |
| TASK-SCOPE | Modify only Phase 003 surfaces named by the approved task. Route contract changes through the parent map. |
| TASK-PROOF | Run focused checks during repair, then rerun the authoritative whole gate from final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=003 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If a predecessor contract, pinned external capability, privacy boundary, or authoritative test disagrees with this plan, mark the task blocked, preserve the exact-original path, and update the decision record before resuming. Do not weaken a P0 invariant or expand scope silently.
