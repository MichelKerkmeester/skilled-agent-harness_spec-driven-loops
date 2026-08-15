---
title: "Feature Specification: Relay Protocol and Durable State"
description: "Implements the host-local Pi RPC supervisor, durable replay, session catalog, mutation ledger, and crash-safe reconciliation core."
trigger_phrases:
  - "pi remote relay protocol and state"
  - "pi mobile phase 3"
  - "relay protocol and state"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the implemented relay, transcript projection, and command transport"
    next_safe_action: "Use phase 004 for command-channel authentication and phase 009 for live operator evidence"
    blockers:
      - "No phase-specific implementation blocker"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 90
---

# Feature Specification: Relay Protocol and Durable State

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3-plus-govern | v2.2 -->

## EXECUTIVE SUMMARY

Implements the host-local Pi RPC supervisor, durable replay, session catalog, transcript projection, phone-to-Pi command transport, mutation ledger, and crash-safe reconciliation core. The command protocol is implemented here; phase 004 provides its application-authentication boundary.

**Key Decisions**: Use one persistent Pi RPC child per active session plus a relay-owned transactional replay and mutation store. All state rides one versioned typed event envelope (kind, epoch, sequence, causedBy, redaction, replay/snapshot eligibility); unknown event kinds are ignored safely; commands are a separate authenticated protocol and are never replayed as events.

**Critical Dependencies**: Phases 001 and 002; phase 004 as the provider for command-channel application authentication; better-sqlite3; installed Pi runtime

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Implemented |
| **Created** | 2026-08-10 |
| **Branch** | `skilled/0147-pi-remote-experience` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 9 |
| **Predecessor** | `../002-automated-test-harness/spec.md` |
| **Successor** | `../004-auth-and-tailnet-boundary/spec.md` |
| **Handoff Criteria** | All P0 checks pass with exact command evidence and the successor's inputs are versioned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Implements the host-local Pi RPC supervisor, durable replay, session catalog, mutation ledger, and crash-safe reconciliation core. Without a separate boundary, evidence and ownership would be mixed with adjacent implementation work and failures could be hidden by aggregate progress.

### Purpose

Deliver a bounded, independently verifiable workstream whose outputs and stop conditions are explicit before its successor relies on them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Strict LF-delimited Pi RPC framing, serialized writes, stderr isolation, response/event demultiplexing, and bounded child supervision.
- One active child per active session, immutable stream epochs, durable redacted envelopes, replay floors, snapshots, and entry reconciliation.
- Durable mutation IDs/digests with explicit indeterminate outcomes and a workspace-scoped session catalog using opaque client identifiers.

### Out of Scope
- Remote network admission and application authentication.
- PWA presentation, protected-tool approval, push, or production rollout.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/pi-remote/packages/pi-rpc-protocol/` | Relocated and implemented | Version-pinned RPC adapter and shared transport types |
| `.pi/pi-remote/apps/pi-remote-relay/src/rpc/` | Relocated and implemented | Strict framing, demultiplexing, child supervision, and health |
| `.pi/pi-remote/apps/pi-remote-relay/src/store/` and `migrations/` | Relocated and implemented | SQLite migrations and durable state transitions through migration 004 |
| `.pi/pi-remote/apps/pi-remote-relay/src/replay/`, `prompt/`, and transcript projector | Relocated and implemented | Epoch, replay, snapshots, transcript projection, and phone-to-Pi commands |
| `.pi/pi-remote/apps/pi-remote-relay/src/sessions/` | Relocated and implemented | Workspace-scoped opaque session catalog |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each active session has an isolated persistent Pi child. | Opening, aborting, or switching one session cannot observe or mutate another; reuse requires a verified-idle exclusive lock. |
| REQ-002 | Replay state is durable and monotonic. | Redacted envelopes persist before broadcast with epoch/sequence ordering, duplicate suppression, gap detection, retention floors, and snapshot barriers. |
| REQ-003 | Mutations never retry ambiguously. | The principal/session/clientMutationId/digest ledger returns recorded outcomes, conflicts on digest mismatch, and records crash-after-write uncertainty as indeterminate. |
| REQ-004 | The protocol adapter matches pinned Pi behavior. | Strict LF framing, Unicode preservation, stderr separation, response correlation, tool events, entries, and settlement pass recorded and live contract suites. |
| REQ-006 | State rides one versioned typed event envelope. | Every broadcast event carries version, kind, opaque ids, epoch, sequence, causedBy, redaction metadata, and replay/snapshot eligibility; consumers ignore unknown kinds without error and request an explicit `sync.snapshot` or `sync.gap` instead of blending state; commands travel a separate authenticated channel with idempotency keys and preconditions and are never replayed as events. |
| REQ-007 | Sync events have defined schemas. | `sync.delta`, `sync.snapshot`, and `sync.gap` are specified message shapes each bound to a `coversThrough` sequence; a client applies a snapshot then resumes deltas strictly after its covered sequence, and a detected gap forces a fresh snapshot rather than a blend. |
| REQ-008 | Durable truth and presentation are distinct. | The append-only envelope sequence is the source of truth; draft-to-terminal message replacement and tool-state coalescing are presentation projections that never rewrite durable sequence identity, and retention floors carry explicit defaults and maxima. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Queues, payloads, child output, replay, and storage are bounded. | Configured limits expose high-water metrics and preserve a reserved control lane under slow-client load. |
| REQ-090 | Evidence is reproducible and version-pinned. | Every completed claim records exact commands, versions, environment, output, and exit status. |
| REQ-091 | Rollback preserves Pi native sessions and unresolved uncertainty. | The phase rollback is exercised safely and never rewrites or deletes Pi native session history. |
| REQ-092 | Consumers receive an explicit compatibility handoff. | Parent, successor, testing, documentation, and release packets name the final outputs and limitations. |
| REQ-093 | Failed P0 gates disable dependent capability. | Status, policy, and operator guidance never present a failed or unrun boundary as available. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A socket disconnect does not own Pi process lifetime or lose committed replay state.
- **SC-002**: Every crash point yields replay, explicit interruption, or indeterminate rather than a silent duplicate mutation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pinned Pi protocol and sessions | Runtime drift breaks supervision or catalog behavior | Run phase-001 drift check before build and on upgrade |
| Provider | Phase 004 application authentication | The command channel must not treat transport reachability as authority | Authenticate sessions and authorize every command through phase 004 |
| Risk | SQLite transition bug | Corrupt replay or mutation outcome | Transactional invariants, restart tests, backups, and down migrations |
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
- The implementation is built; phase status remains distinct from rollout readiness and operator-only evidence.

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
| R-001 | SQLite transition bug | H | M | Transactional invariants, restart tests, backups, and down migrations |

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
- Subsequent implementation is recorded in `implementation-summary.md`; capability enablement remains governed by phase 009 evidence.
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
