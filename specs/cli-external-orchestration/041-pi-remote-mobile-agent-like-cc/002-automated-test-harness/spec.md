---
title: "Feature Specification: Automated Test Harness"
description: "Builds the recorded, live, integration, security, browser, and crash harness that proves the remote control plane fails closed."
trigger_phrases:
  - "pi remote automated test harness"
  - "pi mobile phase 2"
  - "automated test harness"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/002-automated-test-harness"
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

# Feature Specification: Automated Test Harness

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

## EXECUTIVE SUMMARY

Builds the recorded, live, integration, security, browser, and crash harness that proves the remote control plane fails closed. This phase is planning-complete but implementation has not started.

**Key Decisions**: Build the acceptance and failure harness before the relay and keep it as a cross-cutting workstream.

**Critical Dependencies**: Phase 001 contracts and threat model; Repository-selected test runner; Isolated Pi test workspace; Browser automation runtime

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-10 |
| **Branch** | Current workspace; implementation workspace not selected |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 9 |
| **Predecessor** | `../001-contract-and-threat-baseline/spec.md` |
| **Successor** | `../003-relay-protocol-and-state/spec.md` |
| **Handoff Criteria** | All P0 checks pass with exact command evidence and the successor's inputs are versioned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Builds the recorded, live, integration, security, browser, and crash harness that proves the remote control plane fails closed. Without a separate boundary, evidence and ownership would be mixed with adjacent implementation work and failures could be hidden by aggregate progress.

### Purpose

Deliver a bounded, independently verifiable workstream whose outputs and stop conditions are explicit before its successor relies on them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create deterministic recorded fixtures and opt-in live probes against the pinned Pi version.
- Implement unit, contract, storage, integration, browser, security, and kill-point harnesses.
- Define reusable evidence output consumed by every implementation and release phase.

### Out of Scope
- Owning production relay, PWA, extension, or deployment code.
- Treating mocked tests as substitutes for final live-device evidence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `tests/pi-remote/contract/` | Create | Recorded and live Pi RPC contract suites |
| `tests/pi-remote/integration/` | Create | Isolated relay-to-Pi lifecycle fixtures |
| `tests/pi-remote/chaos/` | Create | Deterministic WebSocket, relay, and Pi kill-point harness |
| `tests/pi-remote/security/` | Create | Auth, approval, containment, and canary matrices |
| `tests/pi-remote/browser/` | Create | PWA reducer and browser end-to-end fixtures |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The harness reproduces strict-LF RPC and settlement behavior. | Recorded fixtures preserve Unicode separators, isolate stderr, correlate responses once, and observe exactly one settled transition. |
| REQ-002 | Crash points are deterministic and state-aware. | Each pre-write, post-write, pre-acknowledgement, post-acknowledgement, persistence, broadcast, and reconnect point has an asserted durable outcome. |
| REQ-003 | Security tests fail closed. | Unauthorized workspace/session/action, wrong Origin, replayed ticket, stale epoch, approval mismatch, escape, and canary cases all start as failing negative controls. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Tests are isolated and diagnosable. | Each case uses an isolated workspace/database/port, bounded timeouts, seeded data, and machine-readable failure evidence. |
| REQ-090 | Evidence is reproducible and version-pinned. | Every completed claim records exact commands, versions, environment, output, and exit status. |
| REQ-091 | Rollback preserves Pi native sessions and unresolved uncertainty. | The phase rollback is exercised safely and never rewrites or deletes Pi native session history. |
| REQ-092 | Consumers receive an explicit compatibility handoff. | Parent, successor, testing, documentation, and release packets name the final outputs and limitations. |
| REQ-093 | Failed P0 gates disable dependent capability. | Status, policy, and operator guidance never present a failed or unrun boundary as available. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The same command proves a regression before and after each production change.
- **SC-002**: No release claim can pass solely through mocks or manual observation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 frozen contracts | Fixtures may encode the wrong behavior | Block harness stabilization until the baseline is approved |
| Risk | Flaky process and browser tests | False confidence or noisy gates | Deterministic clocks, isolated resources, bounded retries, and failure artifacts |
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
| Scope | 20/25 | 5 owned surface groups and cross-phase consumers |
| Risk | 22/25 | Release- or security-critical boundary |
| Research | 12/20 | Research exists; live implementation evidence remains pending |
| Multi-Agent | 5/15 | Single owner by default; delegation requires explicit authorization |
| Coordination | 12/15 | 4 dependency groups |
| **Total** | **71/100** | **Level 3** |


## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Flaky process and browser tests | H | M | Deterministic clocks, isolated resources, bounded retries, and failure artifacts |

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


---

## 12. OPEN QUESTIONS

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
