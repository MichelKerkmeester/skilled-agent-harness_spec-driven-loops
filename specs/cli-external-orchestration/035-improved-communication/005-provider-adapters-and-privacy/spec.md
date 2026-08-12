---
title: "Feature Specification: Phase 005 Provider Adapters and Privacy"
description: "Add model-scoped hosted and local provider adapters behind privacy-first routing and explicit egress consent."
trigger_phrases:
  - "provider-adapters-and-privacy"
  - "provider adapters and privacy"
  - "portable cli projection"
  - "implementation phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/005-provider-adapters-and-privacy"
    last_updated_at: "2026-08-12T04:11:59Z"
    last_updated_by: "codex"
    recent_action: "Implemented the provider and privacy boundary and passed the 89-test package gate."
    next_safe_action: "Run strict packet validation, reconcile final metadata, and publish the Phase 006 handover."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
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
      - "Phase 004 provides the verified protected request, fidelity outcome and render boundary."
      - "The project owner approved the privacy-first model-scoped provider architecture."
      - "The implementation passes 19 focused provider tests and the 89-test package gate."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 005 Provider Adapters and Privacy

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 005 turns the completed research into the provider adapters and privacy implementation boundary. Canonical runtime state remains immutable; the phase may emit only a validated display projection or a typed safe fallback.

**Key decision**: Model-scoped adapters behind a privacy-first router.

**Critical dependency**: Completed Phase 004 protected requests and fidelity outcomes.

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Ready for validation |
| **Created** | 2026-08-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 8 |
| **Predecessor** | `004-protected-spans-fidelity-render` |
| **Successor** | `006-runtime-adapters-and-clients` |
| **Handoff Criteria** | Provider contract tests pass for local and hosted routes, privacy policy is evaluated before ranking, and no local-to-hosted fallback occurs implicitly. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase implements the provider and privacy workstream derived from the completed research.

**Scope boundary**: Add model-scoped hosted and local provider adapters behind privacy-first routing and explicit egress consent.

**Dependencies**:

- Phase 002 provider and privacy contracts
- Completed Phase 004 protected input, fidelity and render interface

**Deliverables**:

- Model-specific provider registry and capability discovery
- OpenCode Go DeepSeek V4 Flash, Ollama, llama.cpp, and generic hosted adapters
- Privacy classification, egress consent, credential references, and explicit fallback policy

**Observed evidence**:

| Boundary | Evidence |
|----------|----------|
| Model registry | Closed validation, dated capability/privacy/cost evidence, unique IDs, and stale-to-unknown merge behavior |
| Provider adapters | OpenCode Go, generic hosted, Ollama native, and llama.cpp request/response tests |
| Privacy routing | Ranker spy proves denial and consent checks run before ranking; fallback plans contain only explicit policy-approved routes |
| Safe execution | Missing/expired credentials, unsupported controls, timeout, cancellation, transport error, truncation, and malformed output return the immutable exact original |
| Evidence | Shared telemetry allowlist rejects raw fields; secret and raw-content canaries remain absent |
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Add model-scoped hosted and local provider adapters behind privacy-first routing and explicit egress consent. Without this boundary, later runtime and provider work can drift into incompatible, unsafe, or untestable behavior.

### Purpose

Support OpenCode Go with DeepSeek V4 Flash, local Ollama and llama.cpp, and future providers without coupling the core to one vendor or silently moving private text off-device.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Represent capabilities as yes, no, or unknown per provider and model.
- Implement local and hosted adapters behind one request/result boundary.
- Evaluate privacy class and egress consent before cost, quality, or latency ranking.
- Map each versioned prompt profile to provider-specific sampling, thinking, timeout, and response controls; unsupported required controls make the route ineligible.
- Record dated retention, training, and residency facts without storing secret material.

### Out of Scope

- Runtime event capture and UI integration, which belong to Phase 006.
- Human quality evaluation, which belongs to Phase 007.
- Packaging and release UX, which belongs to Phase 008.

### Proposed Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| packages/cli-communication-projection/src/providers/ | Create | Provider registry, discovery, and adapters |
| packages/cli-communication-projection/src/privacy/ | Create | Classification, consent, and routing policy |
| packages/cli-communication-projection/test/providers/ | Create | Contract tests with local and hosted stubs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. Requirements

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Use model-scoped provider records. | Protocol, endpoint, model, auth mode, timeouts, privacy class, costs, and capabilities are explicit per model. |
| REQ-002 | Support OpenCode Go DeepSeek V4 Flash. | The hosted adapter can select the named model through configured OpenCode Go credentials without embedding secrets. |
| REQ-003 | Support local inference. | Ollama native APIs and llama.cpp OpenAI-compatible endpoints pass the same provider contract tests. |
| REQ-004 | Allow additional hosted providers. | A generic adapter can add configured providers without changing core or runtime contracts. |
| REQ-005 | Route privacy first. | Classification and egress consent run before provider ranking or fallback selection. |
| REQ-006 | Never imply local-to-hosted fallback. | A local route failure returns original text unless a user-configured hosted fallback is explicitly allowed. |
| REQ-007 | Apply prompt controls per provider and model. | Each route either proves its mapping for the requested prompt version, sampling, thinking, timeout, and response shape or returns a typed unsupported-control result before transport. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Discover capabilities conservatively. | Undocumented or stale streaming, JSON, prompt-control, and retention capabilities resolve to unknown and fail closed where required. |
| REQ-009 | Keep credentials out of records and telemetry. | Configuration stores credential references only; errors and metrics never expose tokens or raw content. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- **SC-001**: OpenCode Go DeepSeek V4 Flash and both local provider families pass one contract suite.
- **SC-002**: Privacy-denied input never reaches a hosted transport stub.
- **SC-003**: Local provider failure does not call a hosted adapter without explicit policy.
- **SC-004**: Capability and privacy facts include source and observation dates.
- **SC-005**: Provider stubs prove the versioned prompt profile or reject the route before any request bytes leave the process.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Provider terms and API behavior can change | High | Treat claims as dated records. Revalidate OpenCode Go retention and zero-data-retention terms before 2026-08-31 and again during release hardening. |
| Risk | Sensitive text leaves the device unexpectedly | High | Classify and require egress consent before provider ranking. |
| Risk | Capability discovery overstates support | Medium | Use yes, no, unknown and fail closed on unknown safety-critical facts. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. Non-Functional Requirements

### Performance

- **NFR-P01**: The initial 20 ms p95 privacy and routing budget excluding model inference is provisional and must use the Phase 002 benchmark profile, including recorded machine/runtime metadata, warm/cold mode, warm-up, and at least 30 measured runs.

### Security and Privacy

- **NFR-S01**: Credentials and raw prompt content must never enter logs, traces, caches, or provider records.

### Reliability

- **NFR-R01**: Timeout, retry, and cancellation behavior must be bounded and identical across adapter families.

## 8. Edge Cases

- missing credential reference and expired token
- provider capability changes between discovery and request
- local endpoint unavailable with hosted fallback configured or forbidden
- retention or residency fact missing, stale, or contradictory
- required thinking or sampling control unsupported by the selected provider-model route

## 9. Complexity Assessment

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 19/25 | Cross-package contract and implementation surface |
| Risk | 22/25 | Canonical fidelity, privacy, or runtime boundary |
| Research | 14/20 | Phase 001 evidence must remain traceable |
| Multi-Agent | 8/15 | Independent adapters or verification lanes |
| Coordination | 12/15 | Explicit predecessor and successor handoffs |
| **Total** | **75/100** | **Level 3** |

## 10. Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Primary invariant fails silently | High | Medium | Typed failure, negative controls, and exact-original fallback |
| R-002 | External capability or protocol drifts | High | Medium | Pin versions, retain evidence state, and fail closed |
| R-003 | Sensitive content reaches logs or transport | High | Low | Allowlist outputs, privacy gates, and canary tests |

## 11. User Stories

### US-001: Preferred hosted model (Priority: P0)

**As a** CLI user, **I want** OpenCode Go DeepSeek V4 Flash as a selectable route, **so that** I can use high-quality hosted rewriting without vendor lock-in.

**Acceptance Criteria**:

1. **Given** a valid Phase 005 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

### US-002: Private local mode (Priority: P1)

**As a** privacy-sensitive user, **I want** Ollama or llama.cpp with no network egress, **so that** source text stays on my machine.

**Acceptance Criteria**:

1. **Given** a valid Phase 005 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

### US-003: Explicit provider choice (Priority: P1)

**As a** operator, **I want** model-specific capabilities and fallback policy, **so that** routing decisions are predictable and auditable.

**Acceptance Criteria**:

1. **Given** a valid Phase 005 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
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
