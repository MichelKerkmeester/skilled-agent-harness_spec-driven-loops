---
title: "Feature Specification: Phase 027 Evaluation and Release Gate"
description: "Compose the blind non-inferiority evaluation into the production projection path as a reject-only quality signal and gate the multi-runtime rollout on non-inferiority evidence plus the six-runtime smokes and the privacy canaries."
trigger_phrases:
  - "evaluation-and-release-gate"
  - "non-inferiority rollout gate"
  - "reject-only evaluation consult"
  - "rollout readiness evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/027-evaluation-and-release-gate"
    last_updated_at: "2026-08-14T09:24:23.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed and verified the reject-only evaluation consult and release gate."
    next_safe_action: "Proceed to operator rollout documentation with the validated release evidence contract."
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
      session_id: "phase-027-evaluation-release-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The evaluation verdict is composed as a reject-only quality signal at the production offer seam."
      - "Rollout readiness requires fresh, dated, expiring non-inferiority plus six-runtime smoke plus privacy-canary evidence."
      - "A measured regression blocks the gate and no runtime is rollout-ready without passing evidence."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 027 Evaluation and Release Gate

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The projection layer may only ship where it reads at least as well as the original. This planned phase composes the blind non-inferiority evaluation built in Phase 007 into the production projection path as a reject-only quality signal, and gates the multi-runtime rollout on non-inferiority evidence plus the six-runtime smokes and the privacy canaries. Until the production path consults the evaluation verdict, projection is not offered for a runtime / prompt-profile combination. Until the release gate holds fresh, dated, expiring evidence, no runtime is marked rollout-ready.

**Key decision**: compose the evaluation verdict as a reject-only consult at the production offer seam, and gate rollout through the dated release-readiness gate rather than an advisory scoreboard.

**Critical dependency**: the Phase 007 evaluation harness (`evaluateReleaseGate`, `evaluateDimensionNonInferiority`, and the frozen pre-registration), the release evidence contracts (`evaluateReleaseReadiness`), and the runtime and capability wiring from Phases 019 through 026.

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
| **Phase** | 27 of 28 |
| **Predecessor** | `026-capability-and-privacy-gating` |
| **Successor** | `028-wiring-docs-and-operator-rollout` |
| **Handoff Criteria** | The production path consults a fresh, reject-only evaluation verdict before projection is offered for any runtime / prompt-profile combination; a runtime cannot be marked rollout-ready without passing non-inferiority plus all six runtime smokes plus the privacy canaries; every evidence reference is dated and expires; a measured regression blocks the gate; and this phase plus the parent pass strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This completed phase turns the blind non-inferiority evaluation into a production gate. Projection is offered only when a fresh evaluation verdict approves it, and no runtime is marked rollout-ready without passing non-inferiority, its dated runtime smoke, and the privacy canaries. The aggregate release gate separately requires all six runtime smokes.

**Scope boundary**: Wire the Phase 007 evaluation gate into the production offer path and the release-readiness gate into rollout. Implementation touches the projection package offer seam, the release gate wiring, and the rollout evidence surfaces. It does not change the evaluation statistics, the fidelity boundary, the protected spans, or canonical bytes.

**Dependencies**:

- Phases 019 through 026 runtime wiring, adapters, and capability and privacy gating
- The Phase 007 evaluation harness: `evaluateReleaseGate`, `evaluateDimensionNonInferiority`, and the frozen pre-registration
- The release evidence contracts and `evaluateReleaseReadiness` in `src/release/`
- The six-runtime smoke suite and the privacy canary suite

**Deliverables**:

- A reject-only evaluation consult at the production offer seam
- A rollout gate that requires fresh non-inferiority plus the six-runtime smokes plus the privacy canaries
- Dated, expiring evidence whose observed and expiry timestamps are enforced by the gate
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The evaluation harness can already produce a blind non-inferiority verdict and the release gate can already block on dated evidence, but the production projection path does not yet consult the verdict before offering projection for a runtime / prompt-profile combination, and rollout is not yet gated on that evidence. Without the wiring, a runtime can be offered and marked rollout-ready without proof that its output reads at least as well as the original, and a measured regression has no reject-only stop in the production path.

### Purpose

Make non-inferiority evidence the reject-only gate in front of every projection offer and every rollout-ready claim, so the projection layer ships only where it reads at least as well as the original.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A production offer-seam consult that calls the evaluation verdict before projection is offered for a runtime / prompt-profile combination.
- A reject-only policy: any fail or inconclusive verdict returns the exact original and never a rewrite.
- Rollout gate wiring: a runtime is marked rollout-ready only when non-inferiority plus all six runtime smokes plus all privacy canaries pass.
- Dated evidence: every evidence reference carries observed and expiry timestamps, and stale or invalid references block the gate.
- Recording the planned phase and its evidence contract for Phase 028 and the parent packet.

### Out of Scope

- Any change to the Phase 007 evaluation statistics, blinding, frozen pre-registration, or margins.
- Any change to the fidelity boundary, protected spans, validators, or canonical bytes.
- Changing the six runtime adapters' presentation tiers or their degraded-mode behavior.
- Rewriting historical spec or research references under `specs/`, which stay an append-only record.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-communication/cli-communication-projection/src/runtimes/adapter.ts` | Modify | Consult the evaluation verdict before projection is offered for a runtime / prompt-profile combination |
| `.opencode/skills/sk-communication/cli-communication-projection/src/release/release-gate.ts` | Modify | Require fresh non-inferiority plus six-runtime smoke plus privacy-canary evidence before a runtime is rollout-ready |
| `.opencode/skills/sk-communication/cli-communication-projection/src/release/evidence.ts` | Modify | Extend dated evidence references and expiry handling as required by the rollout gate |
| `.opencode/skills/sk-communication/cli-communication-projection/test/runtimes/smoke.test.ts` | Modify | Prove the six runtime smokes and the reject-only consult together |
| `.opencode/skills/sk-communication/cli-communication-projection/test/release/` | Create | Prove the rollout gate blocks on missing, stale, invalid, and failing evidence |
| `027-evaluation-and-release-gate/` | Create | Record the planned Level-3 packet and its evidence contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Consult the evaluation verdict before offering projection. | For each runtime / prompt-profile combination, the production path calls the evaluation verdict before projection is offered. |
| REQ-002 | Keep the consult reject-only. | Any fail or inconclusive verdict yields the exact original and never a rewrite. |
| REQ-003 | Gate rollout on non-inferiority plus smokes plus canaries. | A runtime is marked rollout-ready only when non-inferiority passes together with all six runtime smokes and all privacy canaries. |
| REQ-004 | Date and expire all evidence. | Every evidence reference carries observed and expiry timestamps, and stale or invalid references block the gate. |
| REQ-005 | A measured regression blocks the gate. | When any non-inferiority dimension fails or the paired lower bound crosses the frozen margin, the gate returns blocked and no runtime is marked rollout-ready. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Keep the gate reproducible and content-free. | Diagnostic metrics never affect approval, and the same frozen inputs produce the same decision. |
| REQ-007 | Require human-certifiable evidence for rollout readiness. | An `llm-proxy` provisional pass is never treated as rollout-ready; only human-certifiable, non-provisional evidence unblocks a runtime. |
| REQ-008 | Prove the wiring end to end. | The package gate passes, new gate tests cover missing, stale, invalid, failing, and regression cases, and this phase passes strict validation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The production path consults a fresh evaluation verdict before projection is offered for any runtime / prompt-profile combination.
- **SC-002**: A fail or inconclusive verdict returns the exact original; no rewrite is offered.
- **SC-003**: No runtime is marked rollout-ready without passing non-inferiority plus all six runtime smokes plus the privacy canaries.
- **SC-004**: Every evidence reference is dated, expires, and a stale or invalid reference blocks the gate; a measured regression blocks the gate.
- **SC-005**: Phase 027 passes strict validation with `Errors: 0  Warnings: 0` from the final state.

### Acceptance Scenarios

1. **Given** a runtime / prompt-profile combination with a failing non-inferiority verdict, **When** the production path resolves the offer, **Then** projection is not offered and the exact original is returned.
2. **Given** an inconclusive verdict, **When** the offer consult runs, **Then** the result is reject-only and no rewrite is emitted.
3. **Given** a runtime with passing non-inferiority but missing or stale smokes or canaries, **When** the release gate runs, **Then** the runtime is not marked rollout-ready.
4. **Given** evidence whose expiry timestamp has passed, **When** the gate runs, **Then** the gate reports blocked with the stale evidence lane named.
5. **Given** a measured regression on any dimension, **When** the gate runs, **Then** the gate returns blocked and rollout is held.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 019 through 026 runtime and capability wiring | High | Keep the consult and the gate independent of adapter internals so the wiring consumes only the verified offer seam |
| Dependency | Phase 007 evaluation harness and frozen pre-registration | High | Reuse `evaluateReleaseGate` and `evaluateDimensionNonInferiority` unchanged; never re-derive margins in this phase |
| Risk | A failing verdict is ignored and projection is offered anyway | High | The consult is reject-only and sits before the offer; an unapproved combination returns the exact original |
| Risk | Stale evidence marks a runtime rollout-ready | High | Every reference carries observed and expiry timestamps and the gate rejects stale and invalid entries |
| Risk | The gate blocks rollout on provisional evidence | Medium | `llm-proxy` evidence stays provisional and is never treated as rollout-ready; only human-certifiable evidence unblocks a runtime |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The evaluation consult and the release gate are local, synchronous reads with no network access. The verdict reference is cached by runtime / prompt-profile combination after first read.

### Security and Privacy

- **NFR-S01**: Evidence references stay content-free. The gate and the packet record evidence classes, reason codes, and timestamps, never message content or protected spans.
- **NFR-S02**: The packet contains no credentials, message content, or protected spans.

### Reliability

- **NFR-R01**: The consult and the gate are fail-closed: missing, invalid, or stale evidence blocks the offer or the rollout instead of defaulting open.
- **NFR-R02**: The release decision is a pure function of its frozen inputs and the current time, so it is deterministic and exhaustively testable.

## 8. EDGE CASES

- The evaluation evidence is absent for a runtime / prompt-profile combination, which blocks the offer.
- The verdict is inconclusive at the sample cap, which is reject-only and never rewritten to a pass.
- An evidence reference has an expiry timestamp in the past, which the gate reports as stale.
- An evidence reference is missing or has invalid timestamps, which the gate reports as invalid.
- A diagnostic metric improves while non-inferiority fails, which still blocks the gate because metrics never affect approval.
- An `llm-proxy` provisional pass is present, which never marks a runtime rollout-ready.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 18/25 | A production offer consult plus a rollout gate across the projection package |
| Risk | 20/25 | Production offers and rollout readiness now depend on evaluation evidence |
| Research | 12/20 | The Phase 007 harness and release contracts already exist and are available |
| Multi-Agent | 8/15 | Independent offer-path and release-gate verification lanes |
| Coordination | 13/15 | Explicit predecessor, successor, and rollout handoffs |
| **Total** | **71/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Projection is offered without a passing verdict | High | Low | Reject-only offer-seam consult that returns the exact original on fail or inconclusive |
| R-002 | A runtime is marked rollout-ready on stale evidence | High | Medium | Dated evidence with enforced observed and expiry timestamps in the gate |
| R-003 | Provisional LLM-proxy evidence unblocks rollout | Medium | Low | Only human-certifiable, non-provisional evidence marks a runtime rollout-ready |
| R-004 | The gate depends on unfinished phases | High | Medium | Recorded dependency on Phases 019 through 026; the gate is wired only after their handoff |

## 11. USER STORIES

### US-001: Only as good as the original (Priority: P0)

**As a** consumer of the projection layer, **I want** projection offered only where it reads at least as well as the original, **so that** I never receive a rewrite that measured evaluation shows is worse.

**Acceptance Criteria**:

1. **Given** a failing or inconclusive verdict, **When** the offer consult runs, **Then** projection is not offered and the exact original is returned.
2. **Given** an approved verdict, **When** the offer consult runs, **Then** projection is offered for that runtime / prompt-profile combination.

### US-002: Rollout needs evidence (Priority: P0)

**As an** operator, **I want** a runtime marked rollout-ready only on fresh non-inferiority, smoke, and canary evidence, **so that** rollout never precedes proof.

**Acceptance Criteria**:

1. **Given** passing non-inferiority but missing or stale smokes or canaries, **When** the release gate runs, **Then** the runtime is not marked rollout-ready.
2. **Given** all evidence fresh and passing, **When** the release gate runs, **Then** the runtime is marked rollout-ready.

### US-003: Stale evidence fails closed (Priority: P1)

**As a** maintainer, **I want** every piece of gate evidence dated and expiring, **so that** old proof never keeps a runtime marked rollout-ready.

**Acceptance Criteria**:

1. **Given** evidence whose expiry timestamp has passed, **When** the gate runs, **Then** the gate reports blocked with the stale lane named.
2. **Given** a measured regression on any dimension, **When** the gate runs, **Then** the gate returns blocked and rollout is held.

## 12. OPEN QUESTIONS

No unresolved question blocks planning. The first rollout gate's prompt-profile baseline and evidence expiry horizon are recorded as gate inputs during implementation, not open design questions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent Packet**: `../spec.md`
