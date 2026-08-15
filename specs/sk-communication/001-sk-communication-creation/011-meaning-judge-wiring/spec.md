---
title: "Feature Specification: Phase 011 Meaning-Judge Wiring"
description: "Compose the missing production path so a local reject-only meaning judge runs after restoration, with any failure staying exact-original and no hosted egress of restored values."
trigger_phrases:
  - "meaning-judge-wiring"
  - "meaning judge wiring"
  - "reject-only meaning gate"
  - "projection quality"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/011-meaning-judge-wiring"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase spec from deep-research priority C."
    next_safe_action: "Plan the production composition and the local-boundary constraint for the judge."
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 011 Meaning-Judge Wiring

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The optional meaning judge exists but is never composed into production: the provider candidate is never connected to `validateProjectionCandidate` or the judge outside the evaluation modules, and `evaluateFidelityVeto` hard-codes the judge disabled. This phase wires a local (or separately privacy-approved) reject-only meaning judge into the production path after restoration, so meaning loss is rejected and any failure falls back to the exact original.

**Key decision:** the judge boundary must be local — it receives decoded source and restored candidate (real values), so a hosted judge would be a second egress and is disallowed.

**Critical dependency:** a local judge implementation or a separately approved redacted boundary; restored plaintext cannot be sent to a hosted judge.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-13 |
| **Branch** | Current worktree |
| **Parent Spec** | `../spec.md` |
| **Phase** | 11 of 13 |
| **Predecessor** | `010-adjacent-span-coalescing` |
| **Successor** | `012-no-op-rejection` |
| **Handoff Criteria** | The production composition invokes a local reject-only judge after restoration, all negative or unavailable outcomes return exact-original, no restored plaintext reaches hosted transport, and the package gate passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This planned phase connects the existing fidelity validator and meaning judge to one production composition.

**Scope boundary**: Compose the current modules; do not turn the offline proxy reviewer into a runtime gate or use the judge as a fluency ranker.

**Dependencies**:

- Existing provider executor, projection validator, judge interface, and render decision
- A local judge boundary or separately approved redacted representation
- Phases 009 and 010 may improve candidates but are not required

**Deliverables**:

- One production composition module
- Local reject-only judge binding after restoration
- Exact-original tests for rejection, timeout, cancellation, absence, and failure
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

- No production source connects the candidate to `validateProjectionCandidate`, `evaluateFidelityVeto`, or `runProxyReviewers` outside evaluation. [SOURCE: packages/cli-communication-projection/src/providers/executor.ts:102-147] [SOURCE: packages/cli-communication-projection/src/render/decision.ts:39-90]
- `evaluateFidelityVeto` hard-codes `judgeMode: 'disabled'`. [SOURCE: packages/cli-communication-projection/src/evaluation/fidelity-veto.ts:30-50]
- The judge, when enabled, sees decoded source and restored candidate text. [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:175-181,315-370]
- The offline masked proxy reviewer is a comparative provisional lane, not a runtime reject-only validator. [SOURCE: packages/cli-communication-projection/src/evaluation/proxy-judge.ts:18-84]

### Purpose

Make production rendering reject meaning loss through a local post-restoration judge while preserving exact-original behavior for every negative or unavailable outcome.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Compose one production path: assemble -> protect -> privacy route + provider rewrite -> deterministic fidelity/restoration checks -> local reject-only meaning judge -> render decision.
- The judge runs after restoration and only when its boundary is local or separately privacy-approved.
- Every judge failure, timeout, cancel, or absence remains exact-original.

### Out of Scope

- Any hosted judge over restored plaintext (second egress).
- Using the masked proxy reviewer as the runtime gate.
- Ranking variants for fluency; the judge rejects meaning loss, it does not score prose.

### Technical Approach

Add a production composition module that threads `executeProviderRoute` output through `validateProjectionCandidate` with a locally-bound reject-only judge, then into `decideRender`; keep exact-original on every failure path.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `packages/cli-communication-projection/src/` | Create/Modify | Add the production composition and public boundary |
| `packages/cli-communication-projection/src/fidelity/validator.ts` | Modify if required | Accept the locally bound reject-only judge through the existing validation path |
| `packages/cli-communication-projection/src/render/decision.ts` | Modify if required | Consume explicit validation and judge outcomes without changing canonical state |
| `packages/cli-communication-projection/test/` | Modify | Add composition, local-boundary, failure, and exact-original coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Provide one production composition. | A public path composes provider output, validation, judge, and render decision. |
| REQ-002 | Preserve the required stage order. | Tests show assemble, protect, route/rewrite, deterministic restoration, judge, and render in order. |
| REQ-003 | Run the judge after restoration. | The judge receives decoded source and restored candidate only after deterministic checks succeed. |
| REQ-004 | Keep the judge local. | The wired judge is local or uses a separately approved redacted representation; restored plaintext never reaches hosted transport. |
| REQ-005 | Keep the judge reject-only. | The judge may reject meaning loss but cannot rank variants or authorize a candidate that deterministic checks rejected. |
| REQ-006 | Fail closed for every unavailable outcome. | Rejection, timeout, cancellation, exception, missing judge, or invalid result yields exact-original. |
| REQ-007 | Keep evaluation lanes separate. | The offline masked proxy reviewer remains outside the runtime gate. |
| REQ-008 | Preserve canonical state. | Composition and all judge outcomes leave canonical transcripts, events, tool inputs, and tool results unchanged. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One production composition invokes the local judge after deterministic restoration.
- **SC-002**: Rejected, timed-out, cancelled, missing, exceptional, and invalid judge outcomes return exact-original.
- **SC-003**: No hosted egress contains decoded source or restored candidate text.
- **SC-004**: Evaluation-only proxy reviewers remain separate from the runtime composition.

### Acceptance Scenarios

1. **Given** a candidate that passes deterministic restoration, **When** production composition runs, **Then** the local reject-only judge is invoked before render selection.
2. **Given** a candidate that fails deterministic validation, **When** composition runs, **Then** the judge cannot authorize it and exact-original is selected.
3. **Given** judge rejection, **When** render selection runs, **Then** the exact original is returned.
4. **Given** judge timeout, cancellation, exception, absence, or malformed output, **When** composition handles the outcome, **Then** the exact original is returned.
5. **Given** decoded source and restored candidate text, **When** the judge boundary is inspected, **Then** no hosted provider receives either value.
6. **Given** the offline masked proxy reviewer, **When** the production module graph is inspected, **Then** that reviewer is not used as the runtime gate.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Local judge implementation or approved redacted boundary | High | Keep exact-original when the judge is unavailable; never fall back to hosted plaintext. |
| Risk | Judge is invoked before deterministic restoration | High | Freeze stage order and test invocation boundaries. |
| Risk | Judge becomes a positive scorer | High | Type and test the interface as reject-only. |
| Risk | Offline proxy reviewer leaks into runtime | High | Keep evaluation imports outside the production composition and assert the module boundary. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Judge execution must have an explicit bounded deadline so unavailable local inference returns exact-original.

### Security and Privacy

- **NFR-S01**: Decoded source and restored candidate text must remain inside the local or separately approved judge boundary.

### Reliability

- **NFR-R01**: Every judge terminal state must map deterministically to accept or exact-original, with no ambiguous fail-open state.

## 8. EDGE CASES

- Judge missing at startup or removed during a request.
- Judge timeout, cancellation, exception, or malformed response.
- Deterministic validator rejects before the judge stage.
- Judge returns an unsupported or ambiguous outcome.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 20/25 | Crosses provider, fidelity, judge, and render modules |
| Risk | 24/25 | Restored plaintext privacy and fail-closed rendering |
| Research | 11/20 | Existing modules are known; production composition is missing |
| Multi-Agent | 7/15 | Composition and adversarial verification can separate |
| Coordination | 12/15 | Related candidate-quality phases and evaluation boundary |
| **Total** | **74/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Restored plaintext reaches a hosted judge | High | Medium | Local-only binding and egress canary tests. |
| R-002 | Judge failure is treated as acceptance | High | Medium | Exhaustive terminal-state mapping to exact-original. |
| R-003 | Proxy evaluation becomes a runtime dependency | High | Low | Separate module graph and import-boundary checks. |

## 11. USER STORIES

### US-001: Meaning-safe projection (Priority: P0)

**As a** CLI user, **I want** meaning-loss candidates rejected before display, **so that** readable output does not distort intent.

**Acceptance Criteria**:

1. **Given** a meaning-preserving restored candidate, **When** the local judge accepts, **Then** render selection may consider the projection.
2. **Given** a meaning-loss candidate, **When** the local judge rejects, **Then** exact-original is displayed.

### US-002: Private local judgment (Priority: P0)

**As a** privacy operator, **I want** restored plaintext judged locally, **so that** the runtime does not create a second hosted egress.

**Acceptance Criteria**:

1. **Given** source and restored candidate text, **When** the judge runs, **Then** both remain within the local boundary.
2. **Given** no local judge, **When** composition runs, **Then** it returns exact-original instead of calling a hosted judge.

### US-003: Predictable failure (Priority: P1)

**As a** maintainer, **I want** every unavailable judge state to fail closed, **so that** runtime behavior is deterministic.

**Acceptance Criteria**:

1. **Given** timeout, cancellation, exception, absence, or malformed output, **When** the outcome is handled, **Then** exact-original is returned.
2. **Given** an evaluation-only proxy reviewer, **When** production composition loads, **Then** the proxy is not invoked.

## 12. OPEN QUESTIONS

No unresolved question blocks planning. A hosted judge over restored plaintext remains explicitly disallowed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Parent Packet**: `../spec.md`
