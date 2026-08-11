---
title: "Feature Specification: Phase 006 Runtime Adapters and Clients"
description: "Integrate the projection core with six CLIs through their safest supported event and presentation boundaries."
trigger_phrases:
  - "runtime-adapters-and-clients"
  - "runtime adapters and clients"
  - "portable cli projection"
  - "implementation phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/006-runtime-adapters-and-clients"
    last_updated_at: "2026-08-11T10:15:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Phase 006 specification."
    next_safe_action: "Obtain project-owner approval, then begin Phase 006 from tasks.md after the Phase 005 handoff."
    blockers:
      - "Project-owner approval of the Proposed architecture decision is not yet recorded."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-scaffold-20260811"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 006 Runtime Adapters and Clients

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 006 turns the completed research into the runtime adapters and clients implementation boundary. Canonical runtime state remains immutable; the phase may emit only a validated display projection or a typed safe fallback.

**Key decision**: Client-owned presentation whenever native interception is not explicitly safe.

**Critical dependency**: Phases 002 through 005 plus pinned runtime protocols.

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 8 |
| **Predecessor** | `005-provider-adapters-and-privacy` |
| **Successor** | `007-evaluation-and-observability` |
| **Handoff Criteria** | Every pinned runtime declares a full-projection or safe-native tier; fixture replay and tier-specific smoke tests pass for all six runtimes; unsupported atomic replacement falls back to append, sidecar, or original-only. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase converts the completed research into an implementation-ready workstream.

**Scope boundary**: Integrate the projection core with six CLIs through their safest supported event and presentation boundaries.

**Dependencies**:

- Phases 002-005 shared contracts, core, fidelity, rendering, providers, and privacy policy
- Pinned runtime protocol and version matrix from Phase 001

**Deliverables**:

- Claude MessageDisplay and headless path
- Codex App Server, Pi JSON-RPC client, stable OpenCode server/SSE client, Devin ACP, and Cursor ACP full-projection paths
- Claude interactive MessageDisplay and Pi synchronous display-transformer safe-native paths with explicit append, sidecar, or original-only behavior
- A version-pinned capability matrix that assigns one presentation tier and degradation policy to each runtime path
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Integrate the projection core with six CLIs through their safest supported event and presentation boundaries. Without this boundary, later runtime and provider work can drift into incompatible, unsafe, or untestable behavior.

### Purpose

Deliver one communication contract across Claude, Codex, Pi, OpenCode, Devin, and Cursor while stating where 1:1 full projection is achievable and where the native surface can only provide safe degradation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Capture supported runtime events and preserve namespaced extension events.
- Map runtime lifecycle and cancellation to shared generations.
- Present accepted projections through supported client or display boundaries.
- Use explicit degraded modes when a runtime cannot atomically replace visible text.
- Classify client-owned or headless paths as **full projection parity** and constrained native display surfaces as **safe native integration**.

### Out of Scope

- Changing any runtime's canonical transcript or model context.
- Adding undocumented hooks or patching vendor binaries.
- Release support commitments, which belong to Phase 008.

### Proposed Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| packages/cli-communication-projection/src/runtimes/ | Create | Six runtime adapters and capability records |
| packages/cli-communication-projection/src/clients/ | Create | Client-owned display and sidecar integrations |
| packages/cli-communication-projection/test/runtimes/ | Create | Pinned fixture replay and smoke harnesses |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. Requirements

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Integrate Claude safely. | Use MessageDisplay where available and a documented headless or append path otherwise, without transcript mutation. |
| REQ-002 | Integrate Codex through App Server. | Consume supported events and let the client own presentation instead of patching the native terminal UI. |
| REQ-003 | Integrate Pi through supported surfaces. | Use a JSON-RPC client for asynchronous full projection; treat the synchronous display transformer as safe-native only; never replace finalized canonical messages. |
| REQ-004 | Integrate OpenCode through stable server interfaces. | Use server, SSE, and the generated stable client boundary; do not depend on a private beta SDK for the release path; keep provider selection independent from runtime capture. |
| REQ-005 | Integrate Devin and Cursor through ACP. | Map ACP lifecycle, content, errors, and cancellation into shared envelopes without assuming identical extensions. |
| REQ-006 | Preserve canonical state. | No adapter writes projections back into transcripts, tool inputs, tool results, or future model context. |
| REQ-007 | Declare a presentation tier. | Every runtime path is `full-projection` or `safe-native`; only client-owned or headless paths with complete-message and atomic render ownership can claim full 1:1 parity. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Degrade presentation explicitly. | Unsupported atomic replacement selects append, sidecar, or original-only with a typed reason and never suppresses uncommitted original output. |
| REQ-009 | Pin and test supported versions. | Each adapter declares tested runtime and protocol versions, capability evidence date, presentation tier, and fail-closed behavior for incompatible majors. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- **SC-001**: All six adapters replay their Phase 002 fixtures into identical shared contract shapes.
- **SC-002**: Each runtime completes a smoke flow with accepted and rejected projection paths.
- **SC-003**: No adapter mutates canonical messages or tool data.
- **SC-004**: Unsupported capabilities produce explicit degraded modes, not silent UI hacks.
- **SC-005**: Release evidence reports full-projection and safe-native results separately; no safe-native result is counted toward the 1:1 full-projection claim.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Runtime protocols and hooks change | High | Pin supported versions and use compatibility doctor checks in Phase 008. |
| Risk | Native UI cannot replace content atomically | High | Move presentation to a client-owned view or degrade to append, sidecar, or original-only. |
| Risk | Extension events are dropped | Medium | Retain namespaced unknown events in provenance and fixture replay. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. Non-Functional Requirements

### Performance

- **NFR-P01**: The initial 30 ms p95 adapter-overhead budget before provider inference is provisional and must use the Phase 002 benchmark profile, including recorded machine/runtime metadata, warm/cold mode, warm-up, and at least 30 measured runs per presentation tier.

### Security and Privacy

- **NFR-S01**: Adapters must not log raw transcript, tool, or protected-span content.

### Reliability

- **NFR-R01**: Disconnect, cancellation, and restart must cleanly terminate active generations.

## 8. Edge Cases

- runtime reconnect with replayed events
- unsupported protocol major or missing capability
- partial stream followed by client disconnect
- extension event unknown to the shared message extractor
- Claude interactive batch delivery where earlier chunks have already rendered
- Pi synchronous transformer invoked before an asynchronous projection exists
- runtime path whose pinned capability evidence does not justify either declared tier

## 9. Complexity Assessment

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 23/25 | Cross-package contract and implementation surface |
| Risk | 20/25 | Canonical fidelity, privacy, or runtime boundary |
| Research | 14/20 | Phase 001 evidence must remain traceable |
| Multi-Agent | 10/15 | Independent adapters or verification lanes |
| Coordination | 14/15 | Explicit predecessor and successor handoffs |
| **Total** | **81/100** | **Level 3** |

## 10. Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Primary invariant fails silently | High | Medium | Typed failure, negative controls, and exact-original fallback |
| R-002 | External capability or protocol drifts | High | Medium | Pin versions, retain evidence state, and fail closed |
| R-003 | Sensitive content reaches logs or transport | High | Low | Allowlist outputs, privacy gates, and canary tests |

## 11. User Stories

### US-001: One experience across CLIs (Priority: P0)

**As a** developer using multiple agents, **I want** the same communication projection in six runtimes, **so that** switching tools does not change readability.

**Acceptance Criteria**:

1. **Given** a valid Phase 006 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

### US-002: No transcript corruption (Priority: P1)

**As a** runtime owner, **I want** presentation isolated from canonical state, **so that** native history and model context remain trustworthy.

**Acceptance Criteria**:

1. **Given** a valid Phase 006 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

### US-003: Honest degradation (Priority: P1)

**As a** CLI user, **I want** clear fallback when replacement is unsupported, **so that** the tool never pretends a fragile integration is safe.

**Acceptance Criteria**:

1. **Given** a valid Phase 006 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

## 12. Open Questions

None blocking. Implementation may refine internal file placement without changing the frozen phase boundary or handoff.
<!-- /ANCHOR:questions -->

---

## Related Documents

- **Research basis**: `../001-research-strategy/research/research.md`
- **Implementation plan**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Verification checklist**: `checklist.md`
- **Decision record**: `decision-record.md`
