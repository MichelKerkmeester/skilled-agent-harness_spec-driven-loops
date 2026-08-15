---
title: "Feature Specification: Phase 008 Packaging and Release Hardening"
description: "Package the system with explicit provider privacy choices, a tested compatibility matrix, diagnostics, rollback, and six-runtime release gates."
trigger_phrases:
  - "packaging-and-release-hardening"
  - "packaging and release hardening"
  - "portable cli projection"
  - "implementation phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/008-packaging-and-release-hardening"
    last_updated_at: "2026-08-13T04:36:10.000Z"
    last_updated_by: "claude"
    recent_action: "Linked Phase 008 forward to the 009-013 projection-quality follow-on phases."
    next_safe_action: "Run the operator release prerequisites, then record the parent release decision."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 008 Packaging and Release Hardening

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 008 turns the completed research into the packaging and release hardening implementation boundary. Canonical runtime state remains immutable; the phase may emit only a validated display projection or a typed safe fallback.

**Key decision**: A dated support matrix and fail-closed compatibility doctor.

**Critical dependency**: Accepted evidence from Phases 002 through 007.

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 8 of 13 |
| **Predecessor** | `007-evaluation-and-observability` |
| **Successor** | `009-prompt-token-contract` (parent release decision preserved) |
| **Handoff Criteria** | Clean-install and six-runtime smoke tests pass, privacy facts and support rows are fresh, rollback reviews pass, the doctor fails closed on unknown or stale critical facts, and the parent packet receives the signed release evidence. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase converts the completed research into an implementation-ready workstream.

**Scope boundary**: Package the system with explicit provider privacy choices, a tested compatibility matrix, diagnostics, rollback, and six-runtime release gates.

**Dependencies**:

- Phases 002-007 complete with accepted evidence
- Current runtime, protocol, provider, model, privacy, and retention facts

**Deliverables**:

- Install and configuration model for local and hosted providers
- Supported runtime/provider version matrix and compatibility doctor
- Release, privacy, rollback, migration, and operator documentation
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Package the system with explicit provider privacy choices, a tested compatibility matrix, diagnostics, rollback, and six-runtime release gates. Without this boundary, later runtime and provider work can drift into incompatible, unsafe, or untestable behavior.

### Purpose

Make the portable projection safe to install and operate without hiding unsupported versions, stale provider facts, privacy boundaries, or recovery steps.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Harden the Phase 002 package boundary and publish only core, adapter, provider-preset, and client surfaces with release evidence.
- Expose explicit local-only, hosted, and mixed policies with no hidden fallback.
- Diagnose runtime, protocol, model, endpoint, credential reference, privacy-fact freshness, capability compatibility, and supported presentation tier.
- Rehearse clean install, upgrade, downgrade, rollback, and original-only emergency mode.

### Out of Scope

- Adding new runtime families beyond the six requested.
- Fine-tuning or hosting a model service.
- Guaranteeing compatibility with untested future CLI majors.

### Proposed Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| packages/cli-communication-projection/package.json | Modify | Harden Phase 002 metadata, scripts, entry points, exports, and supported engines |
| packages/cli-communication-projection/src/doctor/ | Create | Compatibility and privacy diagnostics |
| packages/cli-communication-projection/src/release/ | Create | Release gates, typed aborts, rollback coordination, and evidence manifest |
| packages/cli-communication-projection/docs/ | Create | Install, configuration, privacy, support, rollback, and runbook docs |
| packages/cli-communication-projection/test/release/ | Create | Clean-install, compatibility, upgrade, rollback, and six-runtime release rehearsals |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. Requirements

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ship a coherent package boundary. | The existing Phase 002 package exposes only core, provider, runtime, client, schema, and diagnostic entry points backed by current release evidence. |
| REQ-002 | Make privacy choices explicit. | Setup distinguishes local-only, hosted, and explicitly mixed routing before any text is sent. |
| REQ-003 | Publish a tested support matrix. | Runtime, protocol, provider, model, operating-system, prompt-profile, and presentation-tier rows include evidence links, tested dates, expiry dates, and release status. OpenCode Go privacy and retention facts are revalidated before 2026-08-31 and again for every release. |
| REQ-004 | Provide a compatibility doctor. | Diagnostics check versions, endpoint reachability, credential references, capabilities, privacy-fact freshness, and supported render tiers without exposing secrets. |
| REQ-005 | Fail closed on unknown critical facts. | Unknown or stale capability, retention, training, residency, or protocol-major facts block unsafe routes and select original-only when needed. |
| REQ-006 | Prove clean install and upgrade. | A fresh environment can install, configure, smoke test, upgrade, and downgrade using documented commands. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Rehearse rollback. | Operators can disable projection, select original-only, and restore the previous package without changing canonical transcripts. |
| REQ-008 | Gate release on six-runtime evidence. | All runtime smokes, provider contracts, fidelity negatives, privacy canaries, evaluation thresholds, and strict packet checks pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- **SC-001**: A clean environment completes install and doctor checks without undocumented steps.
- **SC-002**: All six runtime smoke paths pass against published provider-model, prompt-profile, and presentation-tier rows whose evidence has not expired.
- **SC-003**: Local-only configuration produces zero hosted network calls.
- **SC-004**: Rollback to original-only and the previous package is rehearsed and documented.
- **SC-005**: OpenCode Go privacy and retention facts are revalidated before 2026-08-31 and at release; a stale result blocks hosted routing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | All prior phase gates | High | Release blocks if any required evidence is missing or stale. |
| Risk | Published support matrix drifts | High | Date every row, automate doctor probes, and fail closed on unsupported majors. |
| Risk | Configuration hides egress | High | Make privacy class and fallback visible at setup and runtime diagnostics. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. Non-Functional Requirements

### Performance

- **NFR-P01**: Compatibility doctor local checks should finish within a provisional 5 seconds under the Phase 002 benchmark profile; network probes are timed separately and use explicit per-probe and total deadlines.

### Security and Privacy

- **NFR-S01**: Diagnostics and support bundles must never include credential values or raw message content.

### Reliability

- **NFR-R01**: Original-only emergency mode must work without any provider or network dependency.

## 8. Edge Cases

- unsupported runtime major after upgrade
- stale privacy facts with otherwise healthy endpoint
- partial installation or missing optional client
- rollback during an active generation or after provider failure

## 9. Complexity Assessment

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 20/25 | Cross-package contract and implementation surface |
| Risk | 22/25 | Canonical fidelity, privacy, or runtime boundary |
| Research | 12/20 | Phase 001 evidence must remain traceable |
| Multi-Agent | 8/15 | Independent adapters or verification lanes |
| Coordination | 15/15 | Explicit predecessor and successor handoffs |
| **Total** | **77/100** | **Level 3** |

## 10. Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Primary invariant fails silently | High | Medium | Typed failure, negative controls, and exact-original fallback |
| R-002 | External capability or protocol drifts | High | Medium | Pin versions, retain evidence state, and fail closed |
| R-003 | Sensitive content reaches logs or transport | High | Low | Allowlist outputs, privacy gates, and canary tests |

## 11. User Stories

### US-001: Predictable installation (Priority: P0)

**As a** CLI user, **I want** one documented setup for my chosen runtimes and providers, **so that** I can start without reverse engineering configuration.

**Acceptance Criteria**:

1. **Given** a valid Phase 008 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

### US-002: Compatibility diagnosis (Priority: P1)

**As a** operator, **I want** a doctor that explains safe and unsafe combinations, **so that** failures are actionable before content is processed.

**Acceptance Criteria**:

1. **Given** a valid Phase 008 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

### US-003: Recoverable release (Priority: P1)

**As a** maintainer, **I want** tested original-only and package rollback paths, **so that** a bad release cannot trap users or alter history.

**Acceptance Criteria**:

1. **Given** a valid Phase 008 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

## 12. Open Questions

Project-owner approval of the Proposed architecture decision blocks implementation. Release also remains blocked until Phase 007 evidence is accepted and all expiring provider and privacy facts pass their release-time freshness checks.
<!-- /ANCHOR:questions -->

---

## Related Documents

- **Research basis**: `../001-research-strategy/research/research.md`
- **Implementation plan**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Verification checklist**: `checklist.md`
- **Decision record**: `decision-record.md`
