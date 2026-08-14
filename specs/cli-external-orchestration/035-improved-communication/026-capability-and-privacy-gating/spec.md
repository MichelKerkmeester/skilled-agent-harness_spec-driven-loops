---
title: "Feature Specification: Phase 026 Capability and Privacy Gating"
description: "Wire the Phase 008 compatibility doctor into every activation path at the projection seam, gating each runtime, provider, and model combination on capability support, privacy class, and privacy-fact freshness, and failing closed to the exact original on any unknown, stale, or incapable critical fact."
trigger_phrases:
  - "capability-and-privacy-gating"
  - "capability and privacy gating"
  - "compatibility doctor pre-projection gate"
  - "privacy-fact freshness gate"
  - "original-only fail-closed gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/026-capability-and-privacy-gating"
    last_updated_at: "2026-08-14T09:24:23.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed and verified the capability and privacy pre-projection gate."
    next_safe_action: "Consume the completed gate from the evaluation and release closeout."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-026-capability-and-privacy-gating-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The compatibility doctor from Phase 008 is the single pre-projection authority, and the typed gate is the one seam every activation path consumes."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 026 Capability and Privacy Gating

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Before any runtime projects, the projection seam must fail closed on unsafe conditions. This phase wires the compatibility doctor from Phase 008 into every activation path so each runtime, provider, and model combination is gated on capability support, privacy class (local-only vs hosted vs mixed), and privacy-fact freshness. A single pre-projection gate consults the doctor and returns a typed decision; whenever any critical fact is unknown, stale, or incapable, the gate selects original-only and emits the exact bytes, never a partial transform. No hosted routing occurs without a fresh, capable, privacy-approved decision, and the diagnostics the gate exposes are content-free, carrying no message text or secrets.

**Key decision**: make the Phase 008 compatibility doctor the single pre-projection authority and funnel every activation path through one typed gate at the projection seam, rather than scattering per-runtime or per-provider checks.

**Critical dependency**: the compatibility doctor from Phase 008, the runtime wirings from Phases 019-025 (the OpenCode native plugin and the CLI-output wrappers), and the Phase 018 `projectMessage()` entrypoint whose stage order the gate precedes.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 26 of 28 |
| **Predecessor** | `025-cursor-wrapper` |
| **Successor** | `027-evaluation-and-release-gate` |
| **Handoff Criteria** | A pre-projection gate consults the compatibility doctor and returns a typed decision; unknown, stale, or incapable critical facts force exact-original; no hosted routing occurs without a fresh, capable, privacy-approved decision; diagnostics carry no message text or secrets; the gate is exercised on every runtime activation path; local-only configuration makes zero hosted calls; and this phase passes strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This completed phase adds the capability and privacy gate that every activation path crosses before any runtime projects. The compatibility doctor from Phase 008 diagnoses versions, capabilities, endpoint reachability, credential references, privacy-fact freshness, and supported render tiers, failing closed to original-only and returning a blocked report on malformed input. The shared `projectMessage()` seam consumes that surface before any provider routing.

**Scope boundary**: Wire the doctor into every activation path at the projection seam and author the typed gate that each path consumes. The doctor, the Phase 018 entrypoint, and the runtime wirings are consumed, never modified. This packet does not build the doctor, the projection core, or any runtime adapter.

**Dependencies**:

- The compatibility doctor from Phase 008 (`src/doctor/`), the single pre-projection authority
- The runtime wirings from Phases 019-025 (the OpenCode native plugin and the CLI-output wrappers), which provide every activation path the gate must guard
- The Phase 018 `projectMessage()` entrypoint, whose stage order the gate precedes
- The Phase 017 seam contract, whose capability and privacy pre-checks this phase materializes as a typed gate
- The privacy classes (local-only, hosted, mixed) and provider records from Phase 005, which define the egress boundary the gate enforces

**Deliverables**:

- A pre-projection gate that consults the compatibility doctor and returns a typed decision
- Fail-closed exact-original selection on any unknown, stale, or incapable critical fact, with no hosted routing absent a fresh, capable, privacy-approved decision
- Content-free diagnostics with no message text or secrets, and tests covering every runtime activation path
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The projection seams built in Phases 019-025 gate on enablement and fail open to the byte-exact original on error, but none of them yet consult the compatibility doctor before projecting. [SOURCE: Phase 017 seam contract and the 019-025 wiring specs] An incapable runtime, a stale privacy fact, or an unsupported provider-model row can therefore pass the enablement gate and reach the projection stage, and a hosted route can fire without a fresh, capable, privacy-approved decision. The doctor from Phase 008 already detects these conditions and fails closed to original-only, but no activation path calls it, so its authority is not bound to the seam. [SOURCE: Phase 008 compatibility doctor evidence]

### Purpose

Bind the Phase 008 compatibility doctor to every activation path at the projection seam, so each runtime, provider, and model combination is gated on capability support, privacy class, and privacy-fact freshness, and the seam fails closed to the exact original whenever any critical fact is unknown, stale, or incapable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A pre-projection gate that consults the compatibility doctor and returns a typed decision for a runtime, provider, and model combination.
- Fail-closed exact-original selection on any unknown, stale, or incapable critical fact, so projection is refused and the exact bytes are emitted.
- A hard rule that hosted routing never happens without a fresh, capable, privacy-approved decision.
- Content-free diagnostics: the typed decision carries no message text or secrets, only enum-style reason codes.
- Wiring the gate into every activation path from Phases 019-025 and the Phase 018 entrypoint.
- Tests covering unknown, stale, incapable, and privacy-denied matrices plus the local-only zero-hosted-calls control.

### Out of Scope

- Any change to the compatibility doctor, runtime adapters, or the Phase 016 enablement gate beyond integrating the typed consult at the shared `projectMessage()` seam.
- Changing provider records, privacy classes, or the privacy-fact refresh process from Phase 005 and Phase 008.
- Rewriting canonical transcripts, events, tool inputs, or tool results.
- Any hosted projection egress beyond what the fresh, capable, privacy-approved decision already permits.

### Technical Approach

Place one typed pre-projection gate at the projection seam, before `projectMessage()` and before every native or wrapper activation path projects. The gate asks the Phase 008 compatibility doctor for the runtime, provider, and model combination, maps the doctor's report onto a typed `GateDecision`, and emits the exact original on every unknown, stale, incapable, or privacy-denied terminal. Diagnostics expose only reason codes, never content.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Pre-projection gate module | Create | Consult the doctor and return a typed `GateDecision` |
| Projection seam wiring | Modify | Call the gate before `projectMessage()` and on every activation path |
| Gate tests | Create | Unknown, stale, incapable, privacy-denied, and zero-hosted-call coverage |
| `026-capability-and-privacy-gating/` | Create | Record the planned Level-3 packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Provide a pre-projection gate that consults the compatibility doctor. | The gate asks the Phase 008 doctor for a runtime, provider, and model combination and returns a typed `GateDecision`, never a raw or unstructured report. |
| REQ-002 | Fail closed to exact-original on unknown, stale, or incapable critical facts. | Any unknown, stale, or incapable capability, privacy-class, or privacy-fact input selects original-only and emits the exact bytes, never a partial transform. |
| REQ-003 | Block hosted routing without a fresh, capable, privacy-approved decision. | A hosted route fires only when the decision is fresh, capable, and privacy-approved; every other terminal emits the exact original with no hosted egress. |
| REQ-004 | Keep diagnostics content-free. | The typed decision and any surfaced diagnostic contain no message text, credential values, or protected spans, only enum-style reason codes. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Exercise the gate on every runtime activation path. | The OpenCode native plugin and each CLI-output wrapper seam call the gate before projecting, and the gate is verified for every runtime. |
| REQ-006 | Keep local-only configuration zero-hosted. | A local-only privacy configuration makes zero hosted calls regardless of provider health or capability. |
| REQ-007 | Make the gate deterministic and testable. | The gate is a pure function of the doctor report and the privacy policy, and its decision matrix is exhaustively testable without network access. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A stale, incapable, or unknown critical fact forces the gate to exact-original.
- **SC-002**: A local-only privacy configuration makes zero hosted calls.
- **SC-003**: The gate is exercised on every runtime activation path from Phases 019-025 and the Phase 018 entrypoint.
- **SC-004**: No hosted routing occurs without a fresh, capable, privacy-approved decision.
- **SC-005**: Diagnostics carry no message text or secrets.
- **SC-006**: The gate decision matrix and the zero-hosted-call control pass.

### Acceptance Scenarios

1. **Given** a runtime, provider, and model combination with a stale privacy fact, **When** the gate consults the doctor, **Then** it returns exact-original and no hosted route fires.
2. **Given** an incapable runtime or an unsupported provider-model row, **When** the gate runs, **Then** it returns exact-original and no projection runs.
3. **Given** a fresh, capable, privacy-approved decision, **When** the gate runs, **Then** it proceeds and `projectMessage()` or the activation path projects.
4. **Given** a local-only privacy configuration, **When** the seam runs, **Then** zero hosted calls occur.
5. **Given** any blocked or failed gate terminal, **When** the seam resolves, **Then** the exact original is emitted and the diagnostic carries no message text or secrets.
6. **Given** every runtime activation path, **When** the gate is exercised, **Then** each path consults the same typed gate before projecting.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Compatibility doctor from Phase 008 | High | This phase is blocked until the doctor surface lands; the gate consumes it, never rebuilds it. |
| Dependency | Runtime wirings from Phases 019-025 | High | The gate has no activation path to guard until the wirings land; each path is verified against the same gate. |
| Risk | An activation path skips the gate and projects on unsafe facts | High | REQ-005 requires the gate on every path, with a per-runtime verification matrix. |
| Risk | A hosted route fires on a stale or incapable decision | High | REQ-003 blocks hosted routing unless the decision is fresh, capable, and privacy-approved. |
| Risk | A diagnostic leaks message text or secrets | High | REQ-004 restricts diagnostics to enum-style reason codes, with content-free lint coverage. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The gate is local and synchronous with no network access on the fallback path, and adds bounded latency before projection.
- **NFR-P02**: Network probe deadlines follow the Phase 008 doctor's explicit per-probe and total deadlines; the gate never waits on an unbounded probe.

### Security and Privacy

- **NFR-S01**: Capability and privacy pre-checks run before any hosted routing, and a failing pre-check blocks hosted routing.
- **NFR-S02**: The gate, its diagnostics, and the packet contain no credentials, message content, or protected spans.

### Reliability

- **NFR-R01**: The gate fails closed: any unknown, stale, incapable, or malformed-doctor-report input emits the exact original and never a partial transform.
- **NFR-R02**: The typed decision is a deterministic function of the doctor report and the privacy policy, so the same input always yields the same decision.

## 8. EDGE CASES

- A privacy fact is stale but the endpoint is healthy: exact-original, no hosted route.
- A runtime declares capability but the doctor reports it incapable for the provider-model row: exact-original.
- A doctor report is malformed or missing a required fact: exact-original, with a content-free reason code.
- The privacy configuration is local-only: zero hosted calls even when a hosted route is otherwise available.
- A hosted route is requested without a fresh, capable, privacy-approved decision: blocked.
- The gate is invoked twice for the same message: the decision is deterministic and the original is retained for byte-exact restore.
- The doctor surface is temporarily unavailable: the gate fails closed to exact-original rather than proceeding on unknown facts.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 19/25 | One typed gate wired across the native plugin and every wrapper seam |
| Risk | 22/25 | Privacy egress, fail-closed original selection, and every activation path |
| Research | 12/20 | Mapping the doctor report surface to a typed decision across runtime, provider, and model |
| Multi-Agent | 8/15 | Independent per-runtime gate verification lanes |
| Coordination | 15/15 | Explicit dependency on the doctor and the 019-025 wirings |
| **Total** | **76/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | An activation path skips the gate and projects on unsafe facts | High | Medium | REQ-005 requires the gate on every path with a per-runtime verification matrix |
| R-002 | A hosted route fires on a stale or incapable decision | High | Medium | REQ-003 blocks hosted routing absent a fresh, capable, privacy-approved decision |
| R-003 | A diagnostic leaks message text or secrets | High | Low | REQ-004 restricts diagnostics to enum-style reason codes |
| R-004 | The doctor surface is unavailable or the report is malformed | High | Low | The gate fails closed to exact-original with a content-free reason code |

## 11. USER STORIES

### US-001: Safe projection by default (Priority: P0)

**As a** CLI user, **I want** the seam to refuse projection when capability, privacy-class, or privacy-fact facts are unknown, stale, or incapable, **so that** my output is only ever the exact original unless the combination is proven safe.

**Acceptance Criteria**:

1. **Given** a stale or unknown critical fact, **When** the gate runs, **Then** the exact original is emitted and no projection runs.
2. **Given** an incapable runtime or provider-model row, **When** the gate runs, **Then** the exact original is emitted.

### US-002: Privacy before hosted routing (Priority: P0)

**As a** privacy-conscious operator, **I want** hosted routing to require a fresh, capable, privacy-approved decision, **so that** no content leaves the machine on an unproven route.

**Acceptance Criteria**:

1. **Given** a hosted route without a fresh, capable, privacy-approved decision, **When** the gate runs, **Then** the route is blocked and the exact original is emitted.
2. **Given** a local-only configuration, **When** the seam runs, **Then** zero hosted calls occur.

### US-003: Content-free diagnostics (Priority: P0)

**As a** support operator, **I want** the gate's diagnostics to carry reason codes only, **so that** troubleshooting never exposes message content or credentials.

**Acceptance Criteria**:

1. **Given** any blocked gate terminal, **When** a diagnostic is surfaced, **Then** it contains only enum-style reason codes and never message text or secrets.

### US-004: One gate for every runtime (Priority: P1)

**As an** implementer, **I want** every activation path to consult the same typed gate, **so that** the fail-closed rule cannot diverge between the native plugin and the wrappers.

**Acceptance Criteria**:

1. **Given** each runtime activation path from Phases 019-025, **When** the gate is exercised, **Then** each path consumes the same typed gate before projecting.

## 12. OPEN QUESTIONS

No unresolved question blocks planning. The exact doctor report schema, the privacy-fact expiry thresholds, and the pinned runtime and provider versions are recorded as versioned gate inputs at validation time, not open design questions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent Packet**: `../spec.md`
