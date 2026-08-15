---
title: "Feature Specification: Release Verification and Rollout"
description: "Runs the independent whole-system, security, performance, device, accessibility, rollback, and sign-off gates for staged release."
trigger_phrases:
  - "pi remote release verification and rollout"
  - "pi mobile phase 9"
  - "release verification and rollout"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/009-release-verification-and-rollout"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the passing machine release gate and fail-closed rollout state"
    next_safe_action: "Collect operator evidence and require each intended rollout stage explicitly"
    blockers:
      - "Live Pi extension, real macOS containment, real Tailscale Serve, and physical iOS push evidence are unrun"
      - "Read-only, protected-mutation, and optional-push stages are NOT-READY"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 85
---

# Feature Specification: Release Verification and Rollout

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3-plus-govern | v2.2 -->

## EXECUTIVE SUMMARY

Implements the independent whole-system, security, performance, rollback, operator-evidence, and staged-rollout machinery. The latest stored machine gate passes, but operator-only evidence is unrun and every rollout stage remains NOT-READY.

**Key Decisions**: Use three separately controllable stages: private read-only monitoring, protected mutation, then optional push.

**Critical Dependencies**: Phases 001 through 008 complete or explicitly deferred where allowed; Target host and physical devices; Technical, security, accessibility, and operator reviewers

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
| **Phase** | 9 of 9 |
| **Predecessor** | `../008-documentation-and-runbooks/spec.md` |
| **Successor** | None |
| **Handoff Criteria** | All P0 checks pass with exact command evidence and the successor's inputs are versioned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Runs the independent whole-system, security, performance, device, accessibility, rollback, and sign-off gates for staged release. Without a separate boundary, evidence and ownership would be mixed with adjacent implementation work and failures could be hidden by aggregate progress.

### Purpose

Deliver a bounded, independently verifiable workstream whose outputs and stop conditions are explicit before its successor relies on them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Independent rerun of contract, unit, integration, security, chaos, browser, target-host, real-device, accessibility, performance, backup, restore, and rollback gates.
- Staged rollout from local/read-only to protected mutation and optional push, with explicit kill switches and sign-offs.
- Final reconciliation of supported versions, limitations, evidence, packet state, and operator handoff.

### Out of Scope
- Waiving P0 security, crash, containment, redaction, rollback, or accessibility failures.
- Public Internet, native wrapper, multi-host, or multi-tenant expansion.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/pi-remote/release/evidence/` | Implemented | Versioned machine-gate, rollback, threshold, and rollout evidence |
| `.pi/pi-remote/release/` and `.pi/pi-remote/scripts/` | Implemented | Numeric thresholds, rollout configuration, release verification, and rollback drill |
| `.pi/pi-remote/tests/` and package/app test folders | Implemented | Protocol, relay, extension, PWA, rollback, threshold, and rollout tests |
| `.pi/pi-remote/deploy/` | Implemented; operator execution pending | Serve configuration, containment profile, and deployment cleanup |
| `.pi/pi-remote/docs/` | Implemented | Supported matrix, operator limitations, rollback, and evidence guidance |
| `specs/cli-external-orchestration/001-pi-remote-mobile-agent-like-cc/` | Modify | Phase statuses and final planning/implementation evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The authoritative whole gate passes from final state. | Format, lint, type, build, unit, contract, integration, browser, security, chaos, and package checks exit 0 with exact versions and commands recorded. |
| REQ-002 | Live deployment boundaries pass independently. | Target-host HTTPS/WSS identity, Origin, tickets, authorization, direct-backend rejection, Funnel absence, revocation, approval, containment, and canary scans fail closed. |
| REQ-003 | Real mobile and accessibility evidence passes. | Declared iOS/Android/browser rows cover install, streaming, reconnect, kill/restart, stale approval, push, logout, keyboard, VoiceOver, TalkBack, zoom/reflow, reduced motion, and live regions. |
| REQ-004 | Rollback is executed, not described. | Mutation disablement, ingress removal, approval drain, relay stop, database restore/down-migration, session preservation, and local Pi smoke test succeed. |
| REQ-007 | Release thresholds are numeric and gated. | Foreground p95 latency, streaming cadence, queue memory, replay size, storage growth, restart recovery, and a declared WCAG conformance level each have a pass/fail number the release check enforces; a "measured" value without a declared threshold does not pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Performance and resource bounds meet declared targets. | Relay-added foreground p95 latency, streaming cadence, queue memory, replay size, storage growth, and restart recovery are measured under stated conditions. |
| REQ-006 | Every launch approval is explicit. | Technical, security, device/accessibility, and operator reviewers sign the exact supported matrix and any P1 deferrals. |
| REQ-090 | Evidence is reproducible and version-pinned. | Every completed claim records exact commands, versions, environment, output, and exit status. |
| REQ-091 | Rollback preserves Pi native sessions and unresolved uncertainty. | The phase rollback is exercised safely and never rewrites or deletes Pi native session history. |
| REQ-092 | Consumers receive an explicit compatibility handoff. | Parent, successor, testing, documentation, and release packets name the final outputs and limitations. |
| REQ-093 | Failed P0 gates disable dependent capability. | Status, policy, and operator guidance never present a failed or unrun boundary as available. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Read-only release, protected mutation, and push are each enabled only when their own evidence subset is green.
- **SC-002**: A fresh whole-gate rerun, rollback drill, and scoped diff/status sweep produce no hidden blocker or unsupported claim.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | All implementation and documentation phases | Missing capability or stale doc blocks launch | Use explicit dependency and evidence ledger |
| Risk | Green automation but broken mobile reality | Unsafe release | Require physical-device and assistive-technology evidence |
| Risk | Rollback damages Pi sessions | Data loss | Backup, restore rehearsal, and native-session preservation assertions |
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
- Release machinery is implemented; rollout acceptance remains blocked until operator evidence and sign-offs pass.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | 4 owned surface groups and cross-phase consumers |
| Risk | 22/25 | Release- or security-critical boundary |
| Research | 12/20 | Research exists; live implementation evidence remains pending |
| Multi-Agent | 5/15 | Single owner by default; delegation requires explicit authorization |
| Coordination | 12/15 | 3 dependency groups |
| **Total** | **71/100** | **Level 3+** |


## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Green automation but broken mobile reality | H | M | Require physical-device and assistive-technology evidence |
| R-002 | Rollback damages Pi sessions | H | M | Backup, restore rehearsal, and native-session preservation assertions |

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
- Subsequent release machinery is recorded in `implementation-summary.md`; no rollout stage has been enabled.
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
