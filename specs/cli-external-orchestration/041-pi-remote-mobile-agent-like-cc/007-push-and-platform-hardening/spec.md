---
title: "Feature Specification: Push and Platform Hardening"
description: "Adds privacy-minimized Web Push hints and hardens installation, lifecycle, revocation, and stale-state behavior across supported mobile platforms."
trigger_phrases:
  - "pi remote push and platform hardening"
  - "pi mobile phase 7"
  - "push and platform hardening"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/007-push-and-platform-hardening"
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

# Feature Specification: Push and Platform Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

## EXECUTIVE SUMMARY

Adds privacy-minimized Web Push hints and hardens installation, lifecycle, revocation, and stale-state behavior across supported mobile platforms. This phase is planning-complete but implementation has not started.

**Key Decisions**: Send generic hints only after committed state transitions and require authenticated fetch-on-open for all details and actions.

**Critical Dependencies**: Foreground PWA from phase 005; Committed relay transitions from phase 003; Auth/revocation from phase 004; Supported physical devices

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-10 |
| **Branch** | Current workspace; implementation workspace not selected |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 of 9 |
| **Predecessor** | `../006-approval-and-remote-mutation/spec.md` |
| **Successor** | `../008-documentation-and-runbooks/spec.md` |
| **Handoff Criteria** | All P0 checks pass with exact command evidence and the successor's inputs are versioned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Adds privacy-minimized Web Push hints and hardens installation, lifecycle, revocation, and stale-state behavior across supported mobile platforms. Without a separate boundary, evidence and ownership would be mixed with adjacent implementation work and failures could be hidden by aggregate progress.

### Purpose

Deliver a bounded, independently verifiable workstream whose outputs and stop conditions are explicit before its successor relies on them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Encrypted push-subscription storage, preferences, deduplication, foreground suppression, unsubscribe, logout, and revocation.
- Generic opaque notification hints for committed server transitions only.
- Install, kill/restart, stale hint, reinstall, Focus/notification, and fetch-on-open behavior on declared platforms.

### Out of Scope
- Decision-bearing payloads, transcript/tool/workspace content in push, or background mutations.
- Native wrappers unless a measured PWA limitation is separately accepted.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `apps/pi-remote-relay/src/push/` | Create | Encrypted subscriptions, preferences, deduplication, and generic hints |
| `apps/pi-remote-web/src/service-worker/` | Create | Notification handling and authenticated fetch-on-open |
| `apps/pi-remote-web/src/settings/` | Create | Per-device preferences and unsubscribe/logout behavior |
| `tests/pi-remote/device/` | Create | Install, lifecycle, stale-hint, and platform fixtures |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Push carries no authority or sensitive content. | Payload inspection shows only an opaque lookup identifier and generic category; no transcript, tool, workspace, approval, path, or decision data exists. |
| REQ-002 | Opening a hint fetches authoritative state. | The PWA reauthenticates, revalidates revocation and current epoch, then renders live server state before exposing any action. |
| REQ-003 | Subscription lifecycle is complete. | Preferences, encryption, rotation, unsubscribe, logout, revocation, reinstall, and invalid-endpoint cleanup are tested. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Supported mobile lifecycle behavior is explicit. | Declared iOS Home Screen and Android/browser rows document install prerequisites, delivery limits, kill/restart, stale hints, Focus/permission states, and fallback behavior. |
| REQ-090 | Evidence is reproducible and version-pinned. | Every completed claim records exact commands, versions, environment, output, and exit status. |
| REQ-091 | Rollback preserves Pi native sessions and unresolved uncertainty. | The phase rollback is exercised safely and never rewrites or deletes Pi native session history. |
| REQ-092 | Consumers receive an explicit compatibility handoff. | Parent, successor, testing, documentation, and release packets name the final outputs and limitations. |
| REQ-093 | Failed P0 gates disable dependent capability. | Status, policy, and operator guidance never present a failed or unrun boundary as available. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A committed server transition may alert a supported device without leaking context or enabling a stale decision.
- **SC-002**: Revoked or logged-out devices receive no actionable state and invalid subscriptions converge out of storage.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Browser and OS push behavior | Delivery is delayed or unavailable | Treat push as optional hint and document exact supported rows |
| Risk | Sensitive notification exposure | Lock-screen data leak | Generic copy and opaque IDs only |
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
| Risk | 16/25 | Required product capability |
| Research | 12/20 | Research exists; live implementation evidence remains pending |
| Multi-Agent | 5/15 | Single owner by default; delegation requires explicit authorization |
| Coordination | 12/15 | 4 dependency groups |
| **Total** | **71/100** | **Level 3** |


## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Sensitive notification exposure | H | M | Generic copy and opaque IDs only |

---

## 11. USER STORIES

### US-001: Execute this phase safely (Priority: P1)

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
