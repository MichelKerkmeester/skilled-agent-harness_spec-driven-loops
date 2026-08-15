---
title: "Feature Specification: Phase 007 Evaluation and Observability"
description: "Measure whether output feels 1:1 with the reference while proving fidelity, latency, cost, privacy, and operational behavior."
trigger_phrases:
  - "evaluation-and-observability"
  - "evaluation and observability"
  - "portable cli projection"
  - "implementation phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/007-evaluation-and-observability"
    last_updated_at: "2026-08-12T09:40:00Z"
    last_updated_by: "claude"
    recent_action: "Completed and verified the Phase 007 framework."
    next_safe_action: "Approve the Phase 008 packaging architecture, then execute T001."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 007 Evaluation and Observability

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 007 turns the completed research into the evaluation and observability implementation boundary. Canonical runtime state remains immutable; the phase may emit only a validated display projection or a typed safe fallback.

**Key decision**: Deterministic safety plus a pre-registered, powered, blind human non-inferiority protocol.

**Critical dependency**: The executable pipeline from Phases 003 through 006.

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
| **Phase** | 7 of 8 |
| **Predecessor** | `006-runtime-adapters-and-clients` |
| **Successor** | `008-packaging-and-release-hardening` |
| **Handoff Criteria** | The secret-free corpus, powered blind-review protocol, frozen non-inferiority margins, deterministic vetoes, and content-free telemetry gates produce reproducible release evidence. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase converts the completed research into an implementation-ready workstream.

**Scope boundary**: Measure whether output feels 1:1 with the reference while proving fidelity, latency, cost, privacy, and operational behavior.

**Dependencies**:

- Phases 003-006 executable projection pipeline
- Phase 001 reference behavior and research corpus guidance

**Deliverables**:

- Versioned secret-free evaluation corpus and baseline
- Blind human rubric plus deterministic fidelity, latency, cost, and fallback metrics
- Content-free telemetry schema with redaction canaries and privacy audit
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Measure whether output feels 1:1 with the reference while proving fidelity, latency, cost, privacy, and operational behavior. Without this boundary, later runtime and provider work can drift into incompatible, unsafe, or untestable behavior.

### Purpose

Turn subjective communication quality into a versioned, blind, repeatable release gate without collecting user content in telemetry.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Run a three-sample pilot per model and prompt only to estimate variance and plan the release study.
- Pre-register release sample sizes, reviewer assignment, randomization, quality dimensions, margins, and stop rules before scoring candidates.
- Stratify results by provider-model, prompt profile, runtime, and presentation tier; never compare `safe-native` output against the `full-projection` 1:1 claim.
- Aggregate the content-free lifecycle events emitted by Phases 003 through 006 without message content.

### Out of Scope

- Training or fine-tuning models on user data.
- Treating automated style metrics as release truth.
- Packaging and distribution decisions, which belong to Phase 008.

### Proposed Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| packages/cli-communication-projection/src/evaluation/ | Create | Corpus runner, metrics, and blind review protocol |
| packages/cli-communication-projection/src/observability/ | Create | Content-free events, counters, and redaction |
| packages/cli-communication-projection/test/evaluation/ | Create | Variance, canary, and report reproducibility tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. Requirements

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Use a versioned secret-free corpus. | Every case has provenance, category, expected protected spans, privacy class, and corpus version. |
| REQ-002 | Separate the variance pilot from release proof. | Each provider-model and prompt profile gets at least three pilot samples; the release study uses a precomputed sample size with at least 80 percent power, alpha 0.05, at least 30 paired ratings, and no more than 100 paired ratings per release-critical stratum. |
| REQ-003 | Use independent blind human evaluation. | At least three independent reviewers score each comparison; packets hide provider, model, prompt, runtime, candidate, and presentation-tier identity, and record randomized display order. |
| REQ-004 | Freeze non-inferiority rules before candidate scoring. | Reference-versus-reference and original-versus-reference baselines determine a negative margin per quality dimension before unblinding; candidate output passes only when the lower bound of its two-sided 95 percent confidence interval is no worse than that frozen margin. |
| REQ-005 | Keep automated metrics diagnostic. | Similarity and style metrics can flag cases but cannot approve release without deterministic and human gates. |
| REQ-006 | Measure operational cost. | Reports include p50 and p95 latency, provider cost, rejection, fallback, timeout, and degraded-render rates. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Use content-free telemetry. | Phase 007 aggregates allowlisted lifecycle events from earlier phases; correlation uses rotating keyed digests and never raw text, stable unkeyed hashes, prompts, candidates, or protected spans. |
| REQ-008 | Prove redaction. | Canary secrets and synthetic personal data never appear in logs, traces, reports, or exported telemetry. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- **SC-001**: The pilot estimates variance, and the release sample size is recorded before candidate scoring for every release-critical stratum.
- **SC-002**: Every comparison has at least three independent blinded reviews with reproducible randomization records.
- **SC-003**: Deterministic fidelity passes 100 percent; each quality dimension meets its frozen non-inferiority margin, and an inconclusive result at the sample cap fails the release gate.
- **SC-004**: Release reports separate provider-model, prompt-profile, runtime, and presentation-tier results while preserving the distinction between `safe-native` and `full-projection` claims.
- **SC-005**: Redaction canaries produce zero content leaks across logs and exports.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Executable six-runtime pipeline | High | Start corpus authoring early but block release scoring until adapter outputs are stable. |
| Risk | Small samples overstate style quality | High | Use the three-sample pilot only for variance planning, then run the precomputed powered study. |
| Risk | Tier mixing creates a false 1:1 claim | High | Stratify by presentation tier and prohibit `safe-native` evidence from satisfying a `full-projection` gate. |
| Risk | Telemetry leaks content | High | Use an allowlist schema, redaction canaries, and export inspection. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. Non-Functional Requirements

### Performance

- **NFR-P01**: The evaluation runner must produce deterministic case ordering and reproducible aggregate calculations.

### Security and Privacy

- **NFR-S01**: Telemetry must default off for export and must never contain raw prompts, candidates, or protected spans.

### Reliability

- **NFR-R01**: Metric collection overhead should remain below a provisional 5 percent of end-to-end latency under the Phase 002 benchmark profile; Phase 002 must freeze the environment, workload, and measurement method before this becomes a release threshold.

## 8. Edge Cases

- model refusal during the variance pilot or powered release study
- baseline disagreement and high reviewer variance
- an inconclusive confidence interval after reaching the pre-registered sample cap
- a `safe-native` result accidentally grouped with `full-projection` output
- timeout or fallback with no candidate
- canary appearing in nested provider error metadata

## 9. Complexity Assessment

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 20/25 | Cross-package contract and implementation surface |
| Risk | 19/25 | Canonical fidelity, privacy, or runtime boundary |
| Research | 15/20 | Phase 001 evidence must remain traceable |
| Multi-Agent | 8/15 | Independent adapters or verification lanes |
| Coordination | 13/15 | Explicit predecessor and successor handoffs |
| **Total** | **75/100** | **Level 3** |

## 10. Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Primary invariant fails silently | High | Medium | Typed failure, negative controls, and exact-original fallback |
| R-002 | External capability or protocol drifts | High | Medium | Pin versions, retain evidence state, and fail closed |
| R-003 | Sensitive content reaches logs or transport | High | Low | Allowlist outputs, privacy gates, and canary tests |

## 11. User Stories

### US-001: Reference-like quality (Priority: P0)

**As a** product owner, **I want** blind evidence that output feels like the reference, **so that** release decisions are not based on anecdotes.

**Acceptance Criteria**:

1. **Given** a valid Phase 007 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

### US-002: Operational tradeoffs (Priority: P1)

**As a** operator, **I want** latency, cost, fallback, and privacy metrics together, **so that** model and route choices are transparent.

**Acceptance Criteria**:

1. **Given** a valid Phase 007 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

### US-003: Private observability (Priority: P1)

**As a** CLI user, **I want** useful diagnostics without content capture, **so that** improving the system does not expose my work.

**Acceptance Criteria**:

1. **Given** a valid Phase 007 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

## 12. Open Questions

Project-owner approval of the Proposed architecture decision blocks implementation. Before candidate scoring, the owner must also approve the pre-registered sample plan, frozen quality margins, and release-critical strata.
<!-- /ANCHOR:questions -->

---

## Related Documents

- **Research basis**: `../001-research-strategy/research/research.md`
- **Implementation plan**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Verification checklist**: `checklist.md`
- **Decision record**: `decision-record.md`
