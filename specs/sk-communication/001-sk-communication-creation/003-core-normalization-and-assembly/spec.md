---
title: "Feature Specification: Phase 003 Core Normalization and Assembly"
description: "Build the runtime-neutral core that normalizes events and assembles one deterministic message without changing canonical state."
trigger_phrases:
  - "core-normalization-and-assembly"
  - "core normalization and assembly"
  - "portable cli projection"
  - "implementation phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/003-core-normalization-and-assembly"
    last_updated_at: "2026-08-11T17:03:53Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the Phase 003 core."
    next_safe_action: "Start Phase 004 with the verified Phase 003 handover and exact-original boundary."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
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
      - "Phase 002 contracts, fixtures, package commands, and benchmark profile are available."
      - "The Phase 003 package gate passes 47 tests and the 1 MiB warm benchmark passes at 3.10 ms p95."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 003 Core Normalization and Assembly

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 003 delivers the core normalization and assembly boundary. Canonical runtime state remains immutable. The core emits a completed message candidate or a typed exact-original fallback.

**Key decision**: A generation-keyed state machine with explicit ordering domains.

**Critical dependency**: Phase 002 versioned contracts and fixtures.

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
| **Phase** | 3 of 8 |
| **Predecessor** | `002-contracts-and-fixtures` |
| **Successor** | `004-protected-spans-fidelity-render` |
| **Handoff Criteria** | The generation-keyed assembler and bounded context provider pass reorder, duplicate, concurrency, timeout, cancellation, stale-context, privacy, truncation, corruption, and overflow fixture tests while emitting only content-free evidence. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase implements the runtime-neutral core defined by the completed research and Phase 002 contracts.

**Scope boundary**: Build the runtime-neutral core that normalizes events, assembles one deterministic message, selects bounded rewrite context under policy, and emits content-free lifecycle evidence without changing canonical state.

**Dependencies**:

- Phase 002 versioned contracts
- Phase 002 six-runtime golden fixtures

**Deliverables**:

- Immutable canonical envelope store
- Generation-keyed message assembler state machine
- Bounded context provider with explicit absent, stale, truncated, and privacy-denied outcomes
- Content-free lifecycle event emitter using the Phase 002 telemetry contract
- Deterministic ordering, deduplication, bounds, retry, timeout, and cancellation behavior
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Build the runtime-neutral core that normalizes events, assembles one deterministic message, and selects the bounded conversational context that made the reference effective without changing canonical state. Without this boundary, later runtime and provider work can drift into incompatible, unsafe, or untestable behavior.

### Purpose

Turn unordered and imperfect runtime streams into bounded, replayable message candidates plus a policy-approved context view while preserving every original byte and event.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Normalize six runtime event families into the shared envelope.
- Assemble messages by session, turn, message, and generation keys.
- Track source, arrival, and assembly ordering independently.
- Enforce size, time, retry, and lifecycle bounds with exact-original fallback.
- Select at most the contracted non-meta user context, enforce freshness and codepoint truncation, and return a typed no-context result when policy disallows selection.
- Emit content-free state transitions through the shared evidence contract from the beginning of implementation.

### Out of Scope

- Protected-span transformation and semantic validation, which belong to Phase 004.
- Provider selection, which belongs to Phase 005.
- Runtime UI presentation, which belongs to Phase 006.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `packages/cli-communication-projection/src/core/` | Create | Runtime-neutral normalization, bounded input parsing, assembly state and exact-original outcomes |
| `packages/cli-communication-projection/src/context/` | Create | Bounded, privacy-aware rewrite-context selection |
| `packages/cli-communication-projection/src/observability/` | Create | Closed, content-free core lifecycle evidence |
| `packages/cli-communication-projection/test/core/` | Create | Normalization, concurrency, lifecycle, context, evidence and performance tests |
| `packages/cli-communication-projection/src/index.ts` | Update | Export the new core, context and observability APIs |
| `packages/cli-communication-projection/package.json` | Update | Extend the public import smoke test to the Phase 003 surface |
| `packages/cli-communication-projection/vitest.config.ts` | Update | Include the Phase 003 test suite in the authoritative package gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. Requirements

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Keep canonical inputs immutable. | The core never overwrites event payloads, transcripts, tool inputs, tool outputs, or original text. |
| REQ-002 | Normalize deterministically. | The same ordered fixture set produces the same envelope sequence and digest on every replay. |
| REQ-003 | Assemble by stable generation key. | Concurrent turns and retries cannot share buffers or completion state. |
| REQ-004 | Separate three orderings. | Source order, arrival order, and assembly order remain inspectable and never collapse into one ambiguous field. |
| REQ-005 | Handle duplicates idempotently. | Duplicate chunks and final events do not duplicate output or trigger multiple projections. |
| REQ-006 | Bound memory and time. | Oversized, stalled, or never-final streams terminate with a typed reason and exact-original fallback. |
| REQ-007 | Select bounded context deterministically. | The same transcript view and policy select the same last eligible non-meta user message, freshness result, and codepoint-bounded output. |
| REQ-008 | Keep context out of canonical state and telemetry. | Raw selected context is request-scoped only. Canonical records, errors, logs and evidence events never copy it. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Honor cancellation and retries. | Cancelled generations ignore late data. Retries receive a new generation and cannot inherit stale buffers. |
| REQ-010 | Retain unknown events. | Unsupported extension events remain attached to provenance even when excluded from message text. |
| REQ-011 | Emit content-free lifecycle evidence. | State transitions emit only contract-approved versions, durations, byte counts, modes and reason codes. Raw content and unkeyed digests are rejected. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- **SC-001**: All Phase 002 fixtures normalize and replay deterministically.
- **SC-002**: Concurrent generations never contaminate one another.
- **SC-003**: Late, duplicate, and out-of-order events produce documented typed outcomes.
- **SC-004**: No failure path loses access to exact original bytes.
- **SC-005**: Context fixtures prove present, absent, stale, truncated, meta-only, and privacy-denied outcomes without persisting selected text.
- **SC-006**: Every terminal transition emits a schema-valid content-free event or a typed evidence-suppression reason.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 contracts and fixtures | High | Import the verified v1 surface and treat any contract change as an explicit compatibility decision. |
| Risk | Cross-session buffer contamination | High | Key all mutable assembly state by immutable generation identity and add adversarial concurrency tests. |
| Risk | Unbounded streams exhaust memory | High | Enforce byte, event, and wall-clock limits before provider work starts. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. Non-Functional Requirements

### Performance

- **NFR-P01**: The initial 25 ms p95 normalization, assembly, and context-selection budget for a 1 MB completed message is provisional and must use the Phase 002 benchmark profile, including recorded machine/runtime metadata, warm/cold mode, warm-up, and at least 30 measured runs.

### Security and Privacy

- **NFR-S01**: No log or error object may copy raw protected or user content by default.

### Reliability

- **NFR-R01**: All terminal paths must be idempotent and leave no live timers or buffers.

## 8. Edge Cases

- out-of-order chunk followed by duplicate final
- cancellation racing a late provider response
- missing final event and idle timeout
- oversized stream, corrupt encoding, and empty message
- missing transcript, stale transcript view, meta-only user events, privacy denial, and codepoint truncation at a multi-byte boundary

## 9. Complexity Assessment

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 18/25 | Cross-package contract and implementation surface |
| Risk | 18/25 | Canonical fidelity, privacy, or runtime boundary |
| Research | 10/20 | Phase 001 evidence must remain traceable |
| Multi-Agent | 7/15 | Independent adapters or verification lanes |
| Coordination | 10/15 | Explicit predecessor and successor handoffs |
| **Total** | **63/100** | **Level 3** |

## 10. Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Primary invariant fails silently | High | Medium | Typed failure, negative controls, and exact-original fallback |
| R-002 | External capability or protocol drifts | High | Medium | Pin versions, retain evidence state, and fail closed |
| R-003 | Sensitive content reaches logs or transport | High | Low | Allowlist outputs, privacy gates, and canary tests |

## 11. User Stories

### US-001: Deterministic message assembly (Priority: P0)

**As a** projection engine, **I want** one stable completed message per generation, **so that** provider calls are reproducible.

**Acceptance Criteria**:

1. **Given** a valid Phase 003 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

### US-002: Safe concurrency (Priority: P1)

**As a** CLI user, **I want** parallel turns to remain isolated, **so that** one conversation cannot corrupt another.

**Acceptance Criteria**:

1. **Given** a valid Phase 003 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

### US-003: Auditable failures (Priority: P1)

**As a** operator, **I want** typed terminal reasons and retained originals, **so that** fallbacks can be explained without exposing content.

**Acceptance Criteria**:

1. **Given** a valid Phase 003 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
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
- **Successor handover**: `handover.md`
