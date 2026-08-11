---
title: "Implementation Plan: Phase 004 Protected Spans, Fidelity, and Render"
description: "Implement protect non-negotiable content, validate rewritten candidates deterministically, and choose a safe presentation mode. using the shared immutable-state architecture."
trigger_phrases:
  - "protected-spans-fidelity-render"
  - "implementation plan"
  - "portable cli projection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/004-protected-spans-fidelity-render"
    last_updated_at: "2026-08-11T19:25:48Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation, focused verification and the whole package gate."
    next_safe_action: "Consume handover.md from Phase 005 after owner approval."
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
      session_id: "phase-004-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "The project owner approved the Phase 004 architecture and implementation."
      - "The protected-span, fidelity, render and evidence implementation passes the final package gate."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 004 Protected Spans, Fidelity, and Render

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

Protect non-negotiable content, validate rewritten candidates deterministically, and choose a safe presentation mode. The implementation keeps canonical runtime state immutable and emits only validated display projections or exact-original fallbacks.
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
| Protected-span codec | Parses, tokenizes, restores, and proves exact span identity. |
| Fidelity validator | Runs deterministic structural and semantic vetoes, then an optional reject-only judge. |
| Render decision | Selects atomic replace, append, sidecar, or original-only from capabilities and verdicts. |

### Data Flow

Completed original -> protect spans -> provider candidate -> restore spans -> deterministic vetoes -> optional reject-only judge -> canonical digest check -> render decision.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `packages/cli-communication-projection/src/fidelity/` | Phase 004 implementation surface | Created protected-span codec and deterministic validators | 23 focused tests plus whole package gate |
| `packages/cli-communication-projection/src/render/` | Phase 004 implementation surface | Created projection acceptance, render decisions and content-free evidence | Capability, fallback and telemetry tests |
| `packages/cli-communication-projection/test/fidelity/` | Phase 004 test surface | Created bijection, corruption, semantic, render and performance tests | 4 files and 23 tests pass |
| Parent and successor phase docs | Own boundaries and handoff | Keep synchronized if a contract changes | Recursive strict packet validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract and Boundary Preflight

- [x] Confirm predecessor artifacts and freeze the input/output boundary.
- [x] Inventory producers, consumers, independent matrix axes, and negative controls.

### Phase 2: Core Implementation

- [x] Pin the dialect and implement collision-safe bijection.
- [x] Implement deterministic vetoes and exact-original fallback.

### Phase 3: Verification and Handoff

- [x] Implement capability-aware render decisions and negative controls.
- [x] Reconcile checklist, summary, metadata, and successor handoff evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Property | Encode/decode bijection and collision resistance | Generated adversarial strings plus goldens |
| Negative control | Missing, changed, reordered, duplicated, and invented content | Seeded mutation matrix |
| Integration | Validator verdict to render decision and exact fallback | Fixture replay with provider stubs |
<!-- /ANCHOR:testing -->

### Predeclared Verification Matrix

| Independent axis | Expected focused rows | Covered behavior |
|------------------|----------------------:|------------------|
| Protected-span codec | 6 | Pinned dialect, adversarial round trip, token-shaped source, generated corpus, placeholder mutations, nested and unmatched fences |
| Deterministic fidelity | 8 | Safe rewrite, provider terminals, semantic vetoes, Markdown and source digest, judge ordering, judge failures, malformed input, validator exception containment |
| Render and evidence | 5 | Four capability modes, stale and incomplete fallbacks, explicit preference, malformed capabilities, content-free evidence |
| Performance | 1 | One mebibyte, 5 warmups, 30 measured runs and a 50 ms p95 budget |
| **Total** | **20 minimum rows** | The final focused suite contains 23 tests, exceeding the predeclared minimum |

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 projection contracts and byte goldens | Internal | Required | Phase 004 implementation cannot close |
| Phase 003 completed message candidates and bounded context outcomes | Evidence | Complete; verified handover consumed | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. Rollback Plan

- **Trigger**: A fidelity, privacy, compatibility, or canonical-state invariant fails.
- **Procedure**: Switch rendering to original-only and bypass provider projection; canonical messages and runtime streams remain unchanged.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: Phase Dependencies

```text
003-core-normalization-and-assembly -> 004-protected-spans-fidelity-render -> 005-provider-adapters-and-privacy
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Boundary preflight | 003-core-normalization-and-assembly | Core implementation |
| Core implementation | Boundary preflight | Verification |
| Verification and handoff | Core implementation | 005-provider-adapters-and-privacy |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: Effort Estimation

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Boundary preflight | Medium | 2-3 days |
| Core implementation | High | 4-6 days |
| Verification and handoff | High | 2-3 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: Enhanced Rollback

### Pre-Change Checks

- [x] Capture the authoritative test baseline.
- [x] Confirm original-only mode remains available.
- [x] Confirm no canonical transcript or tool-data migration is planned.

### Procedure

1. Stop new projections at the Phase 004 boundary.
2. Switch rendering to original-only and bypass provider projection; canonical messages and runtime streams remain unchanged.
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
| Protected-span codec | 003-core-normalization-and-assembly | Parses, tokenizes, restores, and proves exact span identity. | Fidelity validator |
| Fidelity validator | Protected-span codec | Runs deterministic structural and semantic vetoes, then an optional reject-only judge. | Render decision |
| Render decision | Fidelity validator | Selects atomic replace, append, sidecar, or original-only from capabilities and verdicts. | 005-provider-adapters-and-privacy |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: Critical Path

1. **Freeze the predecessor contract** - 2-3 days - critical.
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

**Decision**: Use deterministic-first validation with a reject-only model judge

**Status**: Accepted and implemented. The project owner approved Phase 004 implementation in the active session. Full rationale and alternatives are in `decision-record.md`.

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
| TASK-SCOPE | Modify only Phase 004 surfaces named by the approved task; route contract changes through the parent map. |
| TASK-PROOF | Run focused checks during repair, then rerun the authoritative whole gate from final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=004 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If a predecessor contract, pinned external capability, privacy boundary, or authoritative test disagrees with this plan, mark the task blocked, preserve the exact-original path, and update the decision record before resuming. Do not weaken a P0 invariant or expand scope silently.
