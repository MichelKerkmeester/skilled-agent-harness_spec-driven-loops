---
title: "Feature Specification: Approval, Containment, and Remote Mutation"
description: "Introduces the final-boundary Pi approval extension, containment, shared redaction, and evidence-gated remote mutation."
trigger_phrases:
  - "pi remote approval and remote mutation"
  - "pi mobile phase 6"
  - "approval and remote mutation"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the implemented approval authority loop and lifecycle hardening"
    next_safe_action: "Verify live Pi extension and protected runner under macOS containment before enabling mutation"
    blockers:
      - "Live Pi extension handler ordering remains operator-unverified"
      - "Protected execution under macOS sandbox-exec remains operator-unverified"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 85
---

# Feature Specification: Approval, Containment, and Remote Mutation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3-plus-govern | v2.2 -->

## EXECUTIVE SUMMARY

Introduces the final-boundary Pi approval extension, containment profile, shared redaction, and evidence-gated remote mutation. The authority loop and lifecycle semantics are implemented and machine-tested; live Pi ordering and real macOS containment remain operator-verification pending.

**Key Decisions**: Use a pinned Pi extension that recomputes a canonical action digest immediately before protected execution and consumes one relay-authorized lease. Approval flows as typed `approval.requested` / `approval.decide` / `approval.result` events with a submitted/verifying client state, and an optional session-scoped accept-edits grant mints one one-action lease per use under the same digest and CAS checks — never a wildcard, all-tools, or bypass mode.

**Critical Dependencies**: Phases 001 through 005; Pinned Pi extension surface; Target-host containment primitive

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Implemented (operator-verification pending) |
| **Created** | 2026-08-10 |
| **Branch** | `skilled/0147-pi-remote-experience` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 9 |
| **Predecessor** | `../005-mobile-pwa-and-reconciliation/spec.md` |
| **Successor** | `../007-push-and-platform-hardening/spec.md` |
| **Handoff Criteria** | All P0 checks pass with exact command evidence and the successor's inputs are versioned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Introduces the final-boundary Pi approval extension, containment, shared redaction, and evidence-gated remote mutation. Without a separate boundary, evidence and ownership would be mixed with adjacent implementation work and failures could be hidden by aggregate progress.

### Purpose

Deliver a bounded, independently verifiable workstream whose outputs and stop conditions are explicit before its successor relies on them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pinned final-pre-execution extension for protected tools with immutable canonical payload digests.
- Approval leases, expiry, first-decision compare-and-swap, revocation, epoch invalidation, and metadata-only audit.
- Host containment, redaction before live/durable boundaries, an independent mutation kill switch, and per-command capability enablement.

### Out of Scope
- Offline or push approvals.
- Unrestricted arbitrary paths, credentials, processes, networks, or public access.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/pi-remote/extensions/pi-remote-approval/` | Relocated and implemented | Pinned protected-tool gate with canonical payload binding |
| `.pi/pi-remote/apps/pi-remote-relay/src/approval/` | Relocated and implemented | Approval leases, CAS decisions, grants, revocation, restart invalidation, and audit metadata |
| `.pi/pi-remote/apps/pi-remote-relay/src/policy/` | Relocated and implemented | Default-off, exactly-one-family mutation policy and authority drain |
| `.pi/pi-remote/deploy/containment/` | Relocated and implemented | macOS sandbox profile and operator escape-test instructions |
| `.pi/pi-remote/apps/pi-remote-relay/tests/approval.test.ts`, `authority-loop.test.ts`, and `tests/security/` | Relocated and implemented | Digest, race, revocation, restart, grant, and policy evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Approval binds to the executed action. | The final handler recomputes tool name and canonical arguments and rejects mismatch, stale epoch, expiry, duplicate, restart, revocation, or extension-integrity failure. |
| REQ-002 | Exactly one current decision can settle a lease. | Atomic version/CAS semantics accept the first valid authorized responder and reject races from other devices. |
| REQ-003 | Containment limits approved tools. | Workspace, filesystem, process, credential, UID, and network escape tests fail on the target host. |
| REQ-004 | Redaction precedes every remote and durable boundary. | Canary secrets produce zero matches in replay, snapshots, catalog, logs, audit, cache, push inputs, and test artifacts. |
| REQ-005 | Mutation is independently disableable. | Server-side kill switch defaults off; command families enable one at a time only after their auth, crash, approval, containment, and redaction rows pass. |
| REQ-007 | Approval separates broadcast state from the decision command. | `approval.requested` and `approval.result` are redacted envelope events; `approval.decide` is an authenticated command on the separate command channel (idempotency key plus epoch/revision/digest precondition) and is never replayed as an event. The client shows a submitted/verifying state until the result settles; stale, duplicate, expired, revoked, or raced decisions fail closed under CAS. |
| REQ-009 | The containment primitive is a named, testable mechanism. | The host containment mechanism (OS sandbox/namespace, UID, and network policy) is chosen and pinned rather than left abstract; each escape class — workspace, filesystem, process, credential, UID, network — maps to a concrete confinement control the escape tests exercise. |
| REQ-010 | Leases have a full lifecycle. | Every lease carries a TTL, an expiry that drains or kills in-flight execution, and a relay-restart reconciliation that re-derives or fails outstanding leases closed; no lease outlives its epoch. |
| REQ-011 | The mutation switch has explicit operational semantics. | `PI_REMOTE_MUTATION_ENABLED` and the exactly-one-family selection are startup-local controls authenticated by the per-process loopback authority capability. Changing policy requires a controlled stop and restart: disablement drains pending/approved leases and active grants, aborts tracked in-flight work, restart invalidates remaining active authority through migration 004 state, and the process returns read-only unless the startup conditions are explicitly re-established. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Audit and observability retain metadata, not sensitive payloads. | Approval request, digest, principal, decision, reason, epoch, timing, and policy version are queryable without raw arguments. |
| REQ-008 | Accept-edits is a bounded grant, not a mode. | An optional session-scoped grant mints exactly one one-action lease per use under the same digest and CAS validation, with deny precedence, a remaining-action count, and expiry; no wildcard, all-tools, arbitrary-path, or permission-bypass behavior exists. |
| REQ-090 | Evidence is reproducible and version-pinned. | Every completed claim records exact commands, versions, environment, output, and exit status. |
| REQ-091 | Rollback preserves Pi native sessions and unresolved uncertainty. | The phase rollback is exercised safely and never rewrites or deletes Pi native session history. |
| REQ-092 | Consumers receive an explicit compatibility handoff. | Parent, successor, testing, documentation, and release packets name the final outputs and limitations. |
| REQ-093 | Failed P0 gates disable dependent capability. | Status, policy, and operator guidance never present a failed or unrun boundary as available. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A foreground authorized operator can approve one exact protected action, and every stale, altered, duplicate, raced, or unavailable-boundary case denies execution.
- **SC-002**: Disabling mutation leaves read-only monitoring and local Pi use intact.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pi extension hook ordering and integrity | Gate may not be final | Pin implementation, assert handler ordering, and fail closed on drift |
| Risk | Approved tool escapes containment | Host or credential compromise | OS-level isolation plus adversarial target-host tests |
| Risk | Canonicalization mismatch | False allow or denial | Single canonical serializer shared by card, ledger, and final gate |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- Evidence-producing checks have bounded timeouts and report the stated environment.

### Security
- Raw credentials, host paths, transcripts, tool payloads, and approval inputs never enter remote or durable evidence unless explicitly redacted.

### Reliability
- Every failure produces a named state and keeps dependent capability disabled.

---

## 8. EDGE CASES

### Data Boundaries
- Empty, oversized, malformed, foreign-workspace, stale-epoch, and retention-expired inputs have explicit outcomes.

### Error Scenarios
- Dependency unavailable: stop the phase and preserve the last known-safe capability set.
- Evidence conflict: mark the claim unresolved and re-run against the pinned target.

### State Transitions
- The implementation is built; live Pi extension and real containment acceptance remain operator-verification pending.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | 5 owned surface groups and cross-phase consumers |
| Risk | 22/25 | Release- or security-critical boundary |
| Research | 12/20 | Research exists; live implementation evidence remains pending |
| Multi-Agent | 5/15 | Single owner by default; delegation requires explicit authorization |
| Coordination | 12/15 | 3 dependency groups |
| **Total** | **71/100** | **Level 3+** |


## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Approved tool escapes containment | H | M | OS-level isolation plus adversarial target-host tests |
| R-002 | Canonicalization mismatch | H | M | Single canonical serializer shared by card, ledger, and final gate |

---

## 11. USER STORIES

### US-001: Execute this phase safely (Priority: P0)

**As a** Pi remote-control implementer, **I want** this phase's boundary and evidence gates to be explicit, **so that** downstream capabilities cannot silently depend on unverified behavior.

**Acceptance Criteria**:
1. Given the phase dependencies are satisfied, when every P0 acceptance check passes, then the documented handoff is usable by the successor without widening scope.

### US-002: Stop on a failed boundary (Priority: P1)

**As an** operator, **I want** failed gates to keep dependent capability disabled, **so that** planning progress cannot be mistaken for release readiness.

**Acceptance Criteria**:
1. Given any P0 check fails, when status is reconciled, then the phase remains incomplete and the rollback or containment action is recorded.


<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

1. The implementer records exact commands, versions, outputs, and failures.
2. The technical reviewer confirms contract and architecture fidelity.
3. The security reviewer approves any authority, mutation, containment, or data-boundary change.
4. The operator approves capability enablement only after the named gate is green.

---

<!-- /ANCHOR:approval-workflow -->

<!-- ANCHOR:compliance-checkpoints -->
## 13. COMPLIANCE CHECKPOINTS

### Security Compliance
- Default-deny behavior and secret-free evidence are mandatory.
- P0 security failures block every dependent capability.

### Code Compliance
- Implementation must route through the repository's detected code surface.
- Final evidence must include format, lint, type, build, and relevant test exits.

---

<!-- /ANCHOR:compliance-checkpoints -->

<!-- ANCHOR:stakeholder-matrix -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Responsibility | Approval |
|-------------|----------------|----------|
| Operator | Scope, supported environment, and enablement | Required for launch-affecting changes |
| Technical reviewer | Contracts and architecture | Required before handoff |
| Security reviewer | Authority, data, and containment | Required where applicable |
| Device/accessibility reviewer | Mobile release evidence | Required for supported device claims |

---

<!-- /ANCHOR:stakeholder-matrix -->

<!-- ANCHOR:change-log -->
## 15. CHANGE LOG

### v0.1 (2026-08-10)
- Created the approved planning packet for this phase.
- Subsequent implementation is recorded in `implementation-summary.md`; mutation remains default-off and operator-verification pending.
<!-- /ANCHOR:change-log -->

---

## 16. OPEN QUESTIONS

- Which exact repository package paths and commands does implementation preflight confirm?
- Which P1 items, if any, does the operator explicitly defer after seeing evidence?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent phase map**: [../spec.md](../spec.md)
- **Implementation plan**: [plan.md](plan.md)
- **Task ledger**: [tasks.md](tasks.md)
- **Verification checklist**: [checklist.md](checklist.md)
- **Decision record**: [decision-record.md](decision-record.md)
- **Current state**: [implementation-summary.md](implementation-summary.md)
