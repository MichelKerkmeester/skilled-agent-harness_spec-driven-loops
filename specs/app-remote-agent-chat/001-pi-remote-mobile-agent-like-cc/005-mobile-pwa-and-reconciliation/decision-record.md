---
title: "Decision Record: Mobile PWA and Reconciliation"
description: "Records the primary architecture choice for mobile pwa and reconciliation."
trigger_phrases:
  - "pi remote mobile pwa and reconciliation"
  - "pi mobile phase 5"
  - "mobile pwa and reconciliation"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/005-mobile-pwa-and-reconciliation"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the reducer decision with the implemented PWA"
    next_safe_action: "Use phase 009 for physical-device and accessibility evidence"
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

# Decision Record: Mobile PWA and Reconciliation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Model mobile state as orthogonal reducers over authoritative envelopes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted for implementation planning |
| **Date** | 2026-08-10 |
| **Deciders** | Operator-approved phase map; technical verification pending |

---

<!-- ANCHOR:adr-001-context -->
### Context

Builds the installable foreground mobile experience for sessions, streaming work, reconnect reconciliation, explicit controls, and offline read-only state. The system handles remote code-agent authority and failure states, so the phase needs one explicit design boundary rather than implicit behavior spread across consumers.

### Constraints
- Relay core from phase 003
- Read-only auth boundary from phase 004
- Harness/browser lane from phase 002
- Dependent capability remains disabled when required evidence is missing or failing.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep connection, mutation, run, message, tool, approval, and queue state separate and reconcile them through epoch-sequenced relay envelopes.

**How it works**: The PWA applies retained replay when possible, freezes transient reduction during snapshot replacement, and resumes live events after the barrier. Local optimistic state never overrides a later authoritative server transition.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen approach** | Bounded ownership and executable evidence | Requires explicit contracts and gates | 9/10 |
| Single conversation state machine | Simple first implementation | Conflates independent failure and progress axes | 4/10 |
| Render raw RPC events | Minimal adapter work | Leaks protocol details and cannot safely reconcile reconnects | 2/10 |

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
| Browser background behavior | H | Foreground revalidation, visible timestamps, read-only offline mode |
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
- `apps/pi-remote-web/src/session/`: Opaque session list and navigation state.
- `apps/pi-remote-web/src/thread/`: Transcript, message, tool, queue, and approval reducers.
- `apps/pi-remote-web/src/connection/`: Authentication, replay, snapshot, and reconnect flow.
- `apps/pi-remote-web/src/composer/`: Prompt, steer, follow-up, abort, retry, and uncertain-state UI.
- `apps/pi-remote-web/public/`: Installable manifest and offline read-only shell.

**How to roll back**: Unpublish or disable the PWA route and revoke its application sessions; local Pi and relay operation remain intact.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
