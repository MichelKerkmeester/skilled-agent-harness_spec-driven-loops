---
title: "Feature Specification: Phase 004 Protected Spans, Fidelity, and Render"
description: "Protect non-negotiable content, validate rewritten candidates deterministically, and choose a safe presentation mode."
trigger_phrases:
  - "protected-spans-fidelity-render"
  - "protected spans, fidelity, and render"
  - "portable cli projection"
  - "implementation phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/004-protected-spans-fidelity-render"
    last_updated_at: "2026-08-11T19:25:48Z"
    last_updated_by: "codex"
    recent_action: "Closed the verified protected-span, fidelity and render phase."
    next_safe_action: "Review the Phase 004 handover, then approve and begin the Phase 005 boundary preflight."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "handover.md"
      - "../003-core-normalization-and-assembly/handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "Phase 003 now provides immutable completed-message candidates and exact-original terminal outcomes."
      - "The project owner approved the deterministic-first architecture and Phase 004 implementation."
      - "The final package gate passes 16 test files and 70 tests with exact-original fallback on every seeded failure."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 004 Protected Spans, Fidelity, and Render

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 004 turns the completed research into the protected spans, fidelity and render implementation boundary. Canonical runtime state remains immutable. The phase may emit only a validated display projection or a typed safe fallback.

**Key decision**: Deterministic-first validation with a reject-only model judge.

**Critical dependency**: Phases 002 and 003 canonical byte and assembly contracts.

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
| **Phase** | 4 of 8 |
| **Predecessor** | `003-core-normalization-and-assembly` |
| **Successor** | `005-provider-adapters-and-privacy` |
| **Handoff Criteria** | The protected-span codec is bijective, deterministic vetoes reject every corruption case, and rejected candidates render the exact original. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase implements the protected-span, fidelity and render boundary derived from the completed research.

**Scope boundary**: Protect non-negotiable content, validate rewritten candidates deterministically, and choose a safe presentation mode.

**Dependencies**:

- Phase 002 projection contracts and byte goldens
- Phase 003 completed message candidates and exact-original terminal outcomes

**Deliverables**:

- Pinned Markdown dialect and protected-span codec
- Deterministic structural and semantic veto pipeline
- Atomic replace, append, sidecar, and original-only render decisions
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Protect non-negotiable content, validate rewritten candidates deterministically, and choose a safe presentation mode. Without this boundary, later runtime and provider work can drift into incompatible, unsafe, or untestable behavior.

### Purpose

Make improved communication feel reference-like while guaranteeing that code, commands, paths, identifiers, facts, and requirements cannot be silently changed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Identify and protect fenced code, inline code, paths, commands, URLs, identifiers, tables, and configured literals.
- Use collision-safe placeholders with exact count, order, and byte restoration.
- Validate structure, protected spans, facts, polarity, requirement strength, truncation, refusal, and Markdown.
- Select a render mode without mutating canonical state.

### Out of Scope

- Provider transport and privacy routing, which belong to Phase 005.
- CLI-specific display integration, which belongs to Phase 006.
- Human quality evaluation, which belongs to Phase 007.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| packages/cli-communication-projection/src/fidelity/ | Create | Protected-span codec and deterministic validators |
| packages/cli-communication-projection/src/render/ | Create | Projection acceptance and render decisions |
| packages/cli-communication-projection/test/fidelity/ | Create | Bijection, corruption, and exact-fallback tests |
| packages/cli-communication-projection/src/index.ts | Update | Export the runtime-neutral Phase 004 API |
| packages/cli-communication-projection/package.json | Update | Extend the built-package import smoke to the Phase 004 API |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. Requirements

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pin one Markdown interpretation. | Protection and validation use the same documented dialect and parser version. |
| REQ-002 | Protect spans bijectively. | Encoding then decoding restores identical bytes, count, and order for every protected span. |
| REQ-003 | Prevent placeholder collisions. | Tokens cannot collide with source text, model output, or one another, including adversarial inputs. |
| REQ-004 | Run deterministic checks first. | Missing, duplicated, reordered, or changed spans veto a candidate before any heuristic or model judge. |
| REQ-005 | Veto semantic regressions. | New facts, polarity changes, weakened or strengthened requirements, refusals, truncation, and empty output are rejected. |
| REQ-006 | Keep model judging reject-only. | An optional judge may veto a deterministically valid candidate but can never override a deterministic rejection. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Verify canonical identity before display. | A compare-and-swap digest check prevents presenting a projection for changed source text. |
| REQ-008 | Guarantee exact-original fallback. | Every rejection and validator failure returns the stored original bytes and a content-free reason code. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- **SC-001**: Protected-span round trips are byte-identical across the adversarial corpus.
- **SC-002**: Every seeded corruption is rejected by a named deterministic rule.
- **SC-003**: A judge outage cannot block exact-original fallback.
- **SC-004**: Render decisions never alter transcripts, tool data, or future model context.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 stable message candidate | High | Validate the canonical digest at projection and render boundaries. |
| Risk | Parser ambiguity misses protected content | High | Pin the dialect and maintain adversarial fixtures for nesting and malformed Markdown. |
| Risk | Fluent rewrite changes meaning | High | Use deterministic vetoes, optional reject-only judging, and original fallback. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. Non-Functional Requirements

### Performance

- **NFR-P01**: The initial 50 ms p95 protection and deterministic-validation budget for a 1 MB message is provisional and must use the Phase 002 benchmark profile, including recorded machine/runtime metadata, warm/cold mode, warm-up, and at least 30 measured runs.

### Security and Privacy

- **NFR-S01**: Validator diagnostics must expose rule identifiers and counts, never raw protected content.

### Reliability

- **NFR-R01**: A validator crash or timeout must select original-only rendering.

## 8. Edge Cases

- nested fences and unmatched delimiters
- source text that resembles placeholder tokens
- duplicate identifiers with distinct byte ranges
- candidate with changed negation, modal strength, or reordered table cells

## 9. Complexity Assessment

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 19/25 | Cross-package contract and implementation surface |
| Risk | 20/25 | Canonical fidelity, privacy, or runtime boundary |
| Research | 12/20 | Phase 001 evidence must remain traceable |
| Multi-Agent | 6/15 | Independent adapters or verification lanes |
| Coordination | 11/15 | Explicit predecessor and successor handoffs |
| **Total** | **68/100** | **Level 3** |

## 10. Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Primary invariant fails silently | High | Medium | Typed failure, negative controls, and exact-original fallback |
| R-002 | External capability or protocol drifts | High | Medium | Pin versions, retain evidence state, and fail closed |
| R-003 | Sensitive content reaches logs or transport | High | Low | Allowlist outputs, privacy gates, and canary tests |

## 11. User Stories

### US-001: Immutable technical details (Priority: P0)

**As a** CLI user, **I want** code, commands, paths, and identifiers to survive unchanged, **so that** clearer prose never makes instructions unsafe.

**Acceptance Criteria**:

1. **Given** a valid Phase 004 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

### US-002: Objective rejection (Priority: P1)

**As a** maintainer, **I want** named deterministic vetoes, **so that** fidelity failures are reproducible.

**Acceptance Criteria**:

1. **Given** a valid Phase 004 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
2. **Given** an unsupported, unsafe, or failed condition, **When** the same boundary is exercised, **Then** it returns a typed reason and the exact-original or fail-closed outcome.

### US-003: Safe presentation (Priority: P1)

**As a** runtime adapter, **I want** one explicit render decision, **so that** unsupported replacement falls back without canonical mutation.

**Acceptance Criteria**:

1. **Given** a valid Phase 004 input, **When** the primary behavior runs, **Then** its output satisfies the relevant contract and preserves the canonical original.
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
- **Predecessor handover**: `../003-core-normalization-and-assembly/handover.md`
