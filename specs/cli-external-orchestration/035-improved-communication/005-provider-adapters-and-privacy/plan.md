---
title: "Implementation Plan: Phase 005 Provider Adapters and Privacy"
description: "Implement add model-scoped hosted and local provider adapters behind privacy-first routing and explicit egress consent. using the shared immutable-state architecture."
trigger_phrases:
  - "provider-adapters-and-privacy"
  - "implementation plan"
  - "portable cli projection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/005-provider-adapters-and-privacy"
    last_updated_at: "2026-08-12T04:11:59Z"
    last_updated_by: "codex"
    recent_action: "Implemented all provider and privacy surfaces and passed the focused and package gates."
    next_safe_action: "Run strict packet validation and publish the Phase 006 handover."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "specs/cli-external-orchestration/035-improved-communication/004-protected-spans-fidelity-render/handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-scaffold-20260811"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "Phase 004 is complete and its handover is available for T001."
      - "The project owner approved continuing with the privacy-first provider architecture."
      - "Nineteen focused provider tests and all eighty-nine package tests pass."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 005 Provider Adapters and Privacy

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

Add model-scoped hosted and local provider adapters behind privacy-first routing and explicit egress consent. The implementation keeps canonical runtime state immutable and emits only validated display projections or exact-original fallbacks.
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
| Provider registry | Stores model-specific protocol, capability, cost, and dated privacy facts. |
| Privacy router | Classifies input, checks consent, then ranks only permitted routes. |
| Provider adapters | Map versioned prompt controls and translate one privacy-approved protected request into OpenCode Go, Ollama, llama.cpp, or generic hosted calls. |

### Data Flow

Protected request -> privacy classification -> egress consent -> eligible model records -> capability filter -> provider call -> typed candidate or original fallback.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `packages/cli-communication-projection/src/providers/` | Proposed Phase 005 implementation surface | Create: Provider registry, discovery, and adapters | Focused tests plus scoped diff |
| `packages/cli-communication-projection/src/privacy/` | Proposed Phase 005 implementation surface | Create: Classification, consent, and routing policy | Focused tests plus scoped diff |
| `packages/cli-communication-projection/test/providers/` | Proposed Phase 005 implementation surface | Create: Contract tests with local and hosted stubs | Focused tests plus scoped diff |
| Parent and successor phase docs | Own boundaries and handoff | Keep synchronized if a contract changes | Recursive strict packet validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract and Boundary Preflight

- [x] Confirm predecessor artifacts and freeze the input/output boundary.
- [x] Inventory producers, consumers, independent matrix axes, and negative controls.

### Phase 2: Core Implementation

- [x] Implement model records, credential references, conservative discovery, and privacy-first eligibility.
- [x] Implement prompt-control mappings plus OpenCode Go, Ollama, llama.cpp, and generic adapter contracts.

### Phase 3: Verification and Handoff

- [x] Implement privacy-first selection, explicit fallback, and transport negative controls.
- [ ] Reconcile checklist, summary, metadata, and successor handoff evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | Request, stream, timeout, cancellation, and error mapping | Provider stubs and local fixtures |
| Privacy | Denied egress, unknown policy facts, and redaction canaries | Network-spy negative controls |
| Integration | Protected request to typed candidate and original fallback | Deterministic provider fakes |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 provider and privacy contracts | Internal | Complete and consumed | None |
| Phase 004 protected input and fidelity interface | Evidence | Complete and consumed | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. Rollback Plan

- **Trigger**: A fidelity, privacy, compatibility, or canonical-state invariant fails.
- **Procedure**: Disable hosted routes and select local-only or original-only policy; no canonical data migration is required.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: Phase Dependencies

```text
004-protected-spans-fidelity-render -> 005-provider-adapters-and-privacy -> 006-runtime-adapters-and-clients
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Boundary preflight | 004-protected-spans-fidelity-render | Core implementation |
| Core implementation | Boundary preflight | Verification |
| Verification and handoff | Core implementation | 006-runtime-adapters-and-clients |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: Effort Estimation

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Boundary preflight | Medium | 2-3 days |
| Core implementation | High | 5-8 days |
| Verification and handoff | High | 2-4 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: Enhanced Rollback

### Pre-Change Checks

- [x] Capture the authoritative test baseline.
- [x] Confirm original-only mode remains available.
- [x] Confirm no canonical transcript or tool-data migration is planned.

### Procedure

1. Stop new projections at the Phase 005 boundary.
2. Disable hosted routes and select local-only or original-only policy; no canonical data migration is required.
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
| Provider registry | Phase 002 provider, prompt, and evidence contracts | Stores model-specific protocol, control mappings, capability, cost, and dated privacy facts. | Privacy router |
| Privacy router | Phase 002 privacy/context contracts and provider registry facts | Classifies input, checks consent, and ranks only permitted routes without invoking transport. | Eligible route decision |
| Provider adapters | Eligible route decision and Phase 004 protected request | Map required prompt controls and translate only an approved request into OpenCode Go, Ollama, llama.cpp, or generic hosted calls. | 006-runtime-adapters-and-clients |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: Critical Path

1. **Freeze the predecessor contract** - 2-3 days - critical.
2. **Implement the primary boundary and failure behavior** - 5-8 days - critical.
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

**Decision**: Use model-scoped adapters behind a privacy-first router

**Status**: Accepted. Project-owner approval was recorded on 2026-08-11. Full rationale and alternatives are in `decision-record.md`.

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
| TASK-SCOPE | Modify only Phase 005 surfaces named by the approved task; route contract changes through the parent map. |
| TASK-PROOF | Run focused checks during repair, then rerun the authoritative whole gate from final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=005 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If a predecessor contract, pinned external capability, privacy boundary, or authoritative test disagrees with this plan, mark the task blocked, preserve the exact-original path, and update the decision record before resuming. Do not weaken a P0 invariant or expand scope silently.
