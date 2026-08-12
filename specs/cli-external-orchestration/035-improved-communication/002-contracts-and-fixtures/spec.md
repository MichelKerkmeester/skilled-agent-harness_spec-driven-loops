---
title: "Feature Specification: Phase 002 Contracts and Fixtures"
description: "Bootstrap the standalone package and define the versioned context, prompt, event, provider, privacy, projection, telemetry, evaluation, benchmark, error, and fixture contracts shared by every adapter."
trigger_phrases:
  - "contracts-and-fixtures"
  - "contracts and fixtures"
  - "portable cli projection"
  - "implementation phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/002-contracts-and-fixtures"
    last_updated_at: "2026-08-11T15:21:48Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the standalone contract package and fixture corpus."
    next_safe_action: "Begin Phase 003 normalization and assembly from the accepted Phase 002 contracts."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "The standalone package boundary and fixture-first architecture are implemented."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 002 Contracts and Fixtures

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 002 turns the completed research into a runnable package boundary, versioned contracts, and fixtures. Canonical runtime state remains immutable. The package may emit only a validated display projection or a typed safe fallback.

**Key decision**: Fixture-first versioned contracts with immutable originals.

**Critical dependency**: Phase 001 research and the six-runtime capability matrix.

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
| **Phase** | 2 of 8 |
| **Predecessor** | `001-research-strategy` |
| **Successor** | `003-core-normalization-and-assembly` |
| **Handoff Criteria** | The standalone package builds and tests; all shared schemas validate; the reference-parity and six-runtime fixture families exist; exact-original golden outputs pass deterministically. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase converted the completed research into an implementation-ready, self-contained TypeScript package boundary.

**Scope boundary**: Define the versioned contracts and golden fixtures that every core, provider, and runtime adapter must share.

**Dependencies**:

- Phase 001 research synthesis
- Primary-source runtime capability matrix

**Deliverables**:

- A self-contained package manifest, TypeScript configuration, and focused test bootstrap
- Versioned event, bounded-context, prompt-profile, provider, privacy, projection, telemetry, evaluation, benchmark, and error schemas
- Golden fixtures for Claude, Codex, Pi, OpenCode, Devin, and Cursor
- Exact-original byte fixtures with provenance and version fields
- A frozen reference-parity corpus and blinded evaluation manifest
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Define the versioned contracts and golden fixtures that every core, provider, and runtime adapter must share. Without this boundary, later runtime and provider work can drift into incompatible, unsafe, or untestable behavior.

### Purpose

Make all later implementation testable against one portable, immutable, and versioned boundary before any runtime-specific code is written.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Define stable JSON-compatible contracts and validation rules.
- Bootstrap `packages/cli-communication-projection/` as a standalone TypeScript package with its own build and test commands.
- Define bounded rewrite-context selection inputs, prompt profiles, inference controls, privacy decisions, and explicit absent-context behavior.
- Capture normal, streaming, failure, cancellation, and extension-event fixtures for all six runtimes.
- Store exact source bytes separately from normalized views and expected projections.
- Freeze the reference output corpus, blind-review manifest, statistical decision fields, content-free telemetry event shape, and benchmark profile.
- Document schema evolution and fixture provenance.

### Out of Scope

- Message assembly and bounded context-selection algorithms, which belong to Phase 003.
- Provider calls and credential handling, which belong to Phase 005.
- Runtime integration code, which belongs to Phase 006.

### Implemented Files

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| packages/cli-communication-projection/package.json | Created | Standalone package metadata, build, test, and type-check commands |
| packages/cli-communication-projection/tsconfig.json | Created | Strict TypeScript compiler boundary |
| packages/cli-communication-projection/src/contracts/ | Created | Versioned event, context, prompt, provider, privacy, projection, telemetry, evaluation, benchmark, and error schemas plus validators |
| packages/cli-communication-projection/test/fixtures/ | Created | Six-runtime event and byte-level golden corpus |
| packages/cli-communication-projection/test/contracts/ | Created | Schema, privacy, prompt, round-trip, compatibility, and package smoke tests |
| packages/cli-communication-projection/src/versioning/ | Created | Compatibility and migration rules |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. Requirements

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define a versioned event envelope. | Validation covers runtime, session, turn, message, sequence, event kind, source timestamp, arrival index, payload, and extension fields. |
| REQ-002 | Preserve immutable original bytes. | Every textual fixture stores exact source bytes and a digest that round-trips without normalization. |
| REQ-003 | Define provider and privacy records. | Schemas represent provider, model, endpoint, credential reference, capability state, privacy class, and explicit fallback policy. |
| REQ-004 | Define projection and render outcomes. | Contracts distinguish candidate, accepted projection, rejected projection, and exact-original fallback with reasons. |
| REQ-005 | Cover all six runtimes. | Claude, Codex, Pi, OpenCode, Devin, and Cursor each have normal, streaming, error, cancellation, and extension-event fixtures. |
| REQ-006 | Make ordering fields explicit. | Source order, arrival order, and assembly order are distinct fields with documented semantics. |
| REQ-007 | Define bounded rewrite context. | The contract identifies the selected non-meta user message, truncation unit and limit, privacy result, absent-context reason, transcript freshness, and no-context fallback without persisting raw context in telemetry. |
| REQ-008 | Version prompt and inference profiles. | Every request identifies a prompt version, copy-editing scope, protected-value policy, temperature or equivalent sampling controls, thinking mode, provider capability mapping, and unsupported-control behavior. |
| REQ-009 | Freeze the parity-evaluation contract. | The reference corpus, reference outputs, blinded ordering, reviewer count, rubric, baseline-variance inputs, sample-size rule, non-inferiority margins, confidence rule, and inconclusive-result policy are versioned before candidate implementation. |
| REQ-010 | Bootstrap a runnable package. | The standalone package has deterministic install, build, type-check, and focused test commands before downstream implementation starts. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Version fixtures and provenance. | Every fixture declares schema version, source family, capture method, sanitization status, and expected result. |
| REQ-012 | Fail closed on unknown schema versions. | Validators reject unsupported major versions and preserve the original payload for diagnosis. |
| REQ-013 | Define telemetry and benchmark profiles. | Telemetry permits only versions, durations, byte counts, modes, reason codes, and rotating keyed digests where approved; benchmark records include machine/runtime metadata, warm-up, cold/warm mode, sample count, p50, and p95. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- **SC-001**: All contract examples validate against their declared schema version.
- **SC-002**: Every runtime has at least five representative fixture classes.
- **SC-003**: Exact-original fixtures reproduce identical bytes and digests.
- **SC-004**: The standalone package installs, builds, type-checks, and runs focused tests without relying on the root staging application.
- **SC-005**: Bounded-context and prompt-profile fixtures cover present, absent, stale, truncated, privacy-denied, and unsupported-control cases.
- **SC-006**: Reference outputs and the blind evaluation manifest validate before candidate implementation begins.
- **SC-007**: Later phases can consume contracts without importing a runtime adapter.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 capability matrix | High | Treat unsupported and inferred fields explicitly rather than inventing certainty. |
| Risk | Fixtures leak secrets or user content | High | Use synthetic or redacted fixtures and run secret scanning before acceptance. |
| Risk | Schemas overfit one runtime | Medium | Keep extension fields namespaced and test all six families before freezing v1. |
| Risk | Prompt or context behavior drifts away from the reference feel | High | Version both contracts, freeze reference outputs, and require blind parity evaluation before release. |
| Risk | The new package accidentally depends on the unrelated root staging app | Medium | Give the package its own manifest, compiler config, test command, and clean-install smoke. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. Non-Functional Requirements

### Performance

- **NFR-P01**: The 10 ms p95 schema-validation budget for a 1 MiB fixture remains provisional pending broader hardware sampling. The Phase 002 run recorded OS, CPU, memory, Node version, power mode, warm mode, five warm-ups, 30 measured runs, p50 1.324 ms, and p95 1.680 ms.

### Security and Privacy

- **NFR-S01**: Fixture and bounded-context data must be synthetic or irreversibly redacted, contain no credentials, and never enter telemetry as raw text or an unkeyed digest.

### Reliability

- **NFR-R01**: Unknown fields must survive round-trip processing without mutating original bytes.

## 8. Edge Cases

- empty payload and metadata-only event
- multi-megabyte tool result with binary-looking text
- duplicate sequence numbers and missing final events
- unknown extension event and unsupported major schema version
- missing, stale, meta-only, privacy-denied, or over-limit user context
- unknown prompt version or provider control that cannot disable thinking or apply the requested sampling profile
- evaluation run that reaches its sample cap without a conclusive confidence interval

## 9. Complexity Assessment

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 16/25 | Cross-package contract and implementation surface |
| Risk | 15/25 | Canonical fidelity, privacy, or runtime boundary |
| Research | 12/20 | Phase 001 evidence must remain traceable |
| Multi-Agent | 6/15 | Independent adapters or verification lanes |
| Coordination | 10/15 | Explicit predecessor and successor handoffs |
| **Total** | **59/100** | **Level 3** |

## 10. Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Primary invariant fails silently | High | Medium | Typed failure, negative controls, and exact-original fallback |
| R-002 | External capability or protocol drifts | High | Medium | Pin versions, retain evidence state, and fail closed |
| R-003 | Sensitive content reaches logs or transport | High | Low | Allowlist outputs, privacy gates, and canary tests |

## 11. User Stories

### US-001: Portable input boundary (Priority: P0)

**As a** core implementer, **I want** one event contract for every runtime, **so that** I can build normalization once instead of six times.

**Acceptance Criteria**:

1. **Given** a valid Phase 002 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

### US-002: Reproducible fidelity checks (Priority: P1)

**As a** test author, **I want** exact byte fixtures and expected projections, **so that** I can detect any loss or mutation immediately.

**Acceptance Criteria**:

1. **Given** a valid Phase 002 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

### US-003: Safe schema evolution (Priority: P1)

**As an** adapter maintainer, **I want** version and extension rules, **so that** I can add runtime capabilities without breaking existing clients.

**Acceptance Criteria**:

1. **Given** a valid Phase 002 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

## 12. Open Questions

None blocking. Human baseline variance and perceptual parity remain deliberately unmeasured until Phase 007; Phase 002 represents those values as pending rather than fabricating evidence. Runtime and provider capabilities still require version-pinned live probes in their owning phases.
<!-- /ANCHOR:questions -->

---

## Related Documents

- **Research basis**: `../001-research-strategy/research/research.md`
- **Implementation plan**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Verification checklist**: `checklist.md`
- **Decision record**: `decision-record.md`
