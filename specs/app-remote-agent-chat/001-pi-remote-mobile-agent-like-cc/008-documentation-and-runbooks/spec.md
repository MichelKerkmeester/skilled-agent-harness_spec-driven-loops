---
title: "Feature Specification: Documentation and Operator Runbooks"
description: "Turns the implemented contracts and observed operations into accurate API, security, setup, maintenance, incident, and rollback documentation."
trigger_phrases:
  - "pi remote documentation and runbooks"
  - "pi mobile phase 8"
  - "documentation and runbooks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/008-documentation-and-runbooks"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the eight implemented operator and security runbooks"
    next_safe_action: "Keep operator-only release boundaries labeled pending until phase 009 evidence is supplied"
    blockers:
      - "No phase-specific implementation blocker"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 90
---

# Feature Specification: Documentation and Operator Runbooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-08-10 |
| **Branch** | `skilled/0147-pi-remote-experience` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 8 of 9 |
| **Predecessor** | `../007-push-and-platform-hardening/spec.md` |
| **Successor** | `../009-release-verification-and-rollout/spec.md` |
| **Handoff Criteria** | All P0 checks pass with exact command evidence and the successor's inputs are versioned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Turns the implemented contracts and observed operations into accurate API, security, setup, maintenance, incident, and rollback documentation. Without a separate boundary, evidence and ownership would be mixed with adjacent implementation work and failures could be hidden by aggregate progress.

### Purpose

Deliver a bounded, independently verifiable workstream whose outputs and stop conditions are explicit before its successor relies on them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Architecture, protocol, database, authentication, approval, containment, redaction, retention, and compatibility documentation.
- Operator setup, configuration, health, backup/restore, upgrade, revocation, rotation, incident, and rollback runbooks.
- Mobile installation, notification, stale/offline, privacy, troubleshooting, and supported-version guidance.

### Out of Scope
- Marketing claims or unsupported compatibility promises.
- Duplicating generated reference data that can be linked or produced reproducibly.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/pi-remote/docs/architecture.md` | Relocated and implemented | System boundaries, data flow, event/command split, approval transport, and failure semantics; canonical protocol/API compatibility surface together with `.pi/pi-remote/packages/pi-rpc-protocol/` |
| `.pi/pi-remote/docs/security.md` | Relocated and implemented | Threat model, authentication, authorization, approval, containment, redaction, and retention |
| `.pi/pi-remote/docs/setup.md` and `operations.md` | Relocated and implemented | Install, configure, start, stop, health, mutation, migration, retention, device, and push operations |
| `.pi/pi-remote/docs/incident-playbooks.md` and `rollback.md` | Relocated and implemented | Incident response, authority drain, uncertainty preservation, restore/down-migration, and smoke testing |
| `.pi/pi-remote/docs/platform-support.md` | Relocated and implemented | PWA install, permissions, push limits, stale behavior, and supported-device guidance |
| `.pi/pi-remote/docs/release-verification.md` | Relocated and implemented | Machine gate, operator evidence, thresholds, rollout readiness, and compatibility limitations |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Operational commands are executable and safe. | Every setup, start, stop, backup, restore, revoke, rotate, and rollback sequence is tested on the target host with prerequisites and expected results. |
| REQ-002 | Security boundaries are documented without exposing secrets. | Docs explain authority, failure, retention, and privacy behavior using sanitized examples and no credential-bearing output. |
| REQ-003 | Documentation matches the implemented contracts. | API/envelope/schema/extension/deployment descriptions are checked against final source and evidence, not the initial plan. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The supported matrix and limitations are explicit. | Pi, Node, host, Tailscale, browser, device, accessibility, push, and containment versions plus known limitations are listed. |
| REQ-005 | Incident and recovery guidance preserves uncertainty. | Runbooks explain mutation indeterminate states, pending approvals, data backups, native Pi session preservation, and escalation. |
| REQ-090 | Evidence is reproducible and version-pinned. | Every completed claim records exact commands, versions, environment, output, and exit status. |
| REQ-091 | Rollback preserves Pi native sessions and unresolved uncertainty. | The phase rollback is exercised safely and never rewrites or deletes Pi native session history. |
| REQ-092 | Consumers receive an explicit compatibility handoff. | Parent, successor, testing, documentation, and release packets name the final outputs and limitations. |
| REQ-093 | Failed P0 gates disable dependent capability. | Status, policy, and operator guidance never present a failed or unrun boundary as available. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A new operator can deploy, monitor, revoke, back up, restore, and roll back the system from the docs on the supported host.
- **SC-002**: A reviewer can trace every security and compatibility claim to implementation or phase-009 evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Stable implemented interfaces | Docs can drift during late changes | Start structure early but freeze claims only after phase 007 |
| Risk | Unsafe copy-paste commands | Operator outage or data loss | Use bounded placeholders, preconditions, dry-runs, and tested rollback steps |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- Evidence-producing checks have bounded timeouts and report the stated environment.

### Security
- Raw credentials, host paths, transcripts, tool payloads, and approval inputs never enter remote or durable evidence unless explicitly redacted.

### Reliability
- Every failure produces a named state and keeps dependent capability disabled.

---

## L2: EDGE CASES

### Data Boundaries
- Empty, oversized, malformed, foreign-workspace, stale-epoch, and retention-expired inputs have explicit outcomes.

### Error Scenarios
- Dependency unavailable: stop the phase and preserve the last known-safe capability set.
- Evidence conflict: mark the claim unresolved and re-run against the pinned target.

### State Transitions
- The runbooks are implemented; commands requiring live infrastructure or devices remain operator-verification pending.

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | 5 owned surface groups and cross-phase consumers |
| Risk | 16/25 | Required product capability |
| Research | 12/20 | Research exists; live implementation evidence remains pending |
| Multi-Agent | 5/15 | Single owner by default; delegation requires explicit authorization |
| Coordination | 12/15 | 3 dependency groups |
| **Total** | **60/100** | **Level 2** |



---

## 10. OPEN QUESTIONS

- Which exact repository package paths and commands does implementation preflight confirm?
- Which P1 items, if any, does the operator explicitly defer after seeing evidence?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent phase map**: [../spec.md](../spec.md)
- **Implementation plan**: [plan.md](plan.md)
- **Task ledger**: [tasks.md](tasks.md)
- **Verification checklist**: [checklist.md](checklist.md)
- **Current state**: [implementation-summary.md](implementation-summary.md)
