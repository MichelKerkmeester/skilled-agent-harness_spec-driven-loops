---
title: "Decision Record: Relay Protocol and Durable State"
description: "Records the primary architecture choice for relay protocol and durable state."
trigger_phrases:
  - "pi remote relay protocol and state"
  - "pi mobile phase 3"
  - "relay protocol and state"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the relay ownership decision with the implementation"
    next_safe_action: "Use phase 004 for command authentication and phase 009 for operator evidence"
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

# Decision Record: Relay Protocol and Durable State

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Let the relay own process lifetime and durable state

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted for implementation planning |
| **Date** | 2026-08-10 |
| **Deciders** | Operator-approved phase map; technical verification pending |

---

<!-- ANCHOR:adr-001-context -->
### Context

Implements the host-local Pi RPC supervisor, durable replay, session catalog, mutation ledger, and crash-safe reconciliation core. The system handles remote code-agent authority and failure states, so the phase needs one explicit design boundary rather than implicit behavior spread across consumers.

### Constraints
- Phases 001 and 002
- SQLite driver selected during preflight
- Installed Pi runtime
- Dependent capability remains disabled when required evidence is missing or failing.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Use one persistent Pi RPC child per active session plus a relay-owned transactional replay and mutation store.

**How it works**: The adapter translates Pi responses and events into redacted epoch-sequenced envelopes. The relay persists state before broadcast and treats an unacknowledged post-write mutation as indeterminate instead of retryable.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen approach** | Bounded ownership and executable evidence | Requires explicit contracts and gates | 9/10 |
| One child per prompt | Simple process lifecycle | Breaks streaming, queueing, settlement, and session continuity | 2/10 |
| One shared child for all sessions | Fewer processes | Session switches can abort or cross-contaminate active work | 1/10 |

**Why this one**: It is the smallest approach that preserves the phase's safety invariant and gives the successor an objective handoff.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The authority, lifecycle, or evidence boundary has one owner.
- Failed gates keep downstream capability disabled instead of creating ambiguous partial readiness.

**What it costs**:
- More explicit state and verification work. Mitigation: reuse the phase-002 harness and keep evidence machine-readable.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| SQLite transition bug | H | Transactional invariants, restart tests, backups, and down migrations |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The approved product cannot safely omit this phase boundary. |
| 2 | **Beyond Local Maxima?** | PASS | Simpler and more permissive alternatives were compared. |
| 3 | **Sufficient?** | PASS | The decision adds only the state, policy, or evidence needed for its invariant. |
| 4 | **Fits Goal?** | PASS | It directly supports private Claude-app-style Pi control. |
| 5 | **Open Horizons?** | PASS | The boundary permits future clients without weakening authority or replay semantics. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `packages/pi-rpc-protocol/`: Version-pinned RPC adapter and shared transport types.
- `apps/pi-remote-relay/src/rpc/`: Strict framing, demultiplexing, child supervision, and health.
- `apps/pi-remote-relay/src/store/`: SQLite migrations and durable state transitions.
- `apps/pi-remote-relay/src/replay/`: Epoch, sequence, replay, snapshot, and reconciliation logic.
- `apps/pi-remote-relay/src/sessions/`: Workspace-scoped opaque session catalog.

**How to roll back**: Stop the relay, archive or restore the compatible relay database, and continue using Pi locally; never delete Pi native sessions.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
