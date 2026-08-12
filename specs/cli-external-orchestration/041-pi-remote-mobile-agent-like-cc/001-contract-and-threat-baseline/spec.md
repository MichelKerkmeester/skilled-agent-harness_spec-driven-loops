---
title: "Feature Specification: Contract and Threat Baseline"
description: "Pins the live Pi, host, ingress, browser, storage, and extension contracts and freezes the threat model before production implementation."
trigger_phrases:
  - "pi remote contract and threat baseline"
  - "pi mobile phase 1"
  - "contract and threat baseline"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline"
    last_updated_at: "2026-08-10T18:43:21Z"
    last_updated_by: "codex"
    recent_action: "Authored the approved phase planning packet"
    next_safe_action: "Run this phase's definition-of-ready checks before implementation"
    blockers:
      - "Product implementation for this phase has not started"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 0
---

# Feature Specification: Contract and Threat Baseline

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3-plus-govern | v2.2 -->

## EXECUTIVE SUMMARY

Pins the live Pi, host, ingress, browser, storage, and extension contracts and freezes the threat model before production implementation. This phase is planning-complete but implementation has not started.

**Key Decisions**: Use a version-pinned contract and threat baseline as the mandatory entry gate for every implementation phase.

**Critical Dependencies**: Existing research lineages; Installed Pi CLI; Target host and Tailscale; Operator-selected device resources

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-10 |
| **Branch** | Current workspace; implementation workspace not selected |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 9 |
| **Predecessor** | None |
| **Successor** | `../002-automated-test-harness/spec.md` |
| **Handoff Criteria** | All P0 checks pass with exact command evidence and the successor's inputs are versioned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Pins the live Pi, host, ingress, browser, storage, and extension contracts and freezes the threat model before production implementation. Without a separate boundary, evidence and ownership would be mixed with adjacent implementation work and failures could be hidden by aggregate progress.

### Purpose

Deliver a bounded, independently verifiable workstream whose outputs and stop conditions are explicit before its successor relies on them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pin live versions and observed behavior for Pi RPC, session storage, extension hooks, Tailscale Serve, Node, and target browsers.
- Freeze relay envelopes, stream epochs, durable state, authorization, redaction, retention, and containment invariants.
- Define the supported host/device matrix and executable negative controls before production code.

### Out of Scope
- Implementing the relay, PWA, approval extension, or deployment service.
- Enabling any remote mutation or public ingress.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `packages/pi-rpc-protocol/` | Create | Versioned Pi command, response, event, envelope, and state contracts |
| `tests/pi-remote/fixtures/` | Create | Sanitized recorded RPC and session-layout fixtures |
| `tests/pi-remote/security/` | Create | Threat model, authorization matrix, and negative-control definitions |
| `deploy/pi-remote/baseline/` | Create | Pinned host, Pi, Node, browser, and Tailscale evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pin every version-coupled runtime contract. | A sanitized evidence bundle records exact versions, commands, hashes, observed framing, settlement, session layout, extension loading, and HTTPS/WSS behavior. |
| REQ-002 | Freeze the system invariants and trust boundaries. | Typed contract drafts, state-transition tables, authorization matrix, redaction classes, and retention bounds receive consumer review. |
| REQ-003 | Define fail-closed threat and failure models. | Each auth, path, crash, replay, approval, containment, and leakage risk maps to an executable negative control owned by phase 002. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Declare the first supported host and mobile matrix. | Target OS, deployment identity, iOS/Android/browser rows, and unavailable resources are explicit. |
| REQ-090 | Evidence is reproducible and version-pinned. | Every completed claim records exact commands, versions, environment, output, and exit status. |
| REQ-091 | Rollback preserves Pi native sessions and unresolved uncertainty. | The phase rollback is exercised safely and never rewrites or deletes Pi native session history. |
| REQ-092 | Consumers receive an explicit compatibility handoff. | Parent, successor, testing, documentation, and release packets name the final outputs and limitations. |
| REQ-093 | Failed P0 gates disable dependent capability. | Status, policy, and operator guidance never present a failed or unrun boundary as available. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh implementer can reproduce every pinned contract without relying on a research assertion.
- **SC-002**: No production phase starts with an unresolved security-boundary or mutation-semantics ambiguity.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Installed Pi and undocumented session layout | Adapter cannot be trusted | Pin the live installation and preserve sanitized fixtures |
| Risk | Baseline captures secrets | Credential exposure | Redact before persistence and scan evidence with canaries |
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
- Draft planning becomes active only after definition-of-ready passes; completion requires the phase checklist and parent handoff to agree.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | 4 owned surface groups and cross-phase consumers |
| Risk | 22/25 | Release- or security-critical boundary |
| Research | 12/20 | Research exists; live implementation evidence remains pending |
| Multi-Agent | 5/15 | Single owner by default; delegation requires explicit authorization |
| Coordination | 12/15 | 4 dependency groups |
| **Total** | **81/100** | **Level 3+** |


## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Baseline captures secrets | H | M | Redact before persistence and scan evidence with canaries |

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
- No product implementation or capability enablement occurred.
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
