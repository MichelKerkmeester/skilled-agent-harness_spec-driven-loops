---
title: "Decision Record: Push and Platform Hardening"
description: "Records the primary architecture choice for push and platform hardening."
trigger_phrases:
  - "pi remote push and platform hardening"
  - "pi mobile phase 7"
  - "push and platform hardening"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/007-push-and-platform-hardening"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the lossy-hint decision with the implemented push path"
    next_safe_action: "Verify Web Push on a physical supported iOS device"
    blockers:
      - "Physical iOS Web Push remains operator-unverified"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 85
---

# Decision Record: Push and Platform Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Treat push as a lossy privacy-minimized hint

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted for implementation planning |
| **Date** | 2026-08-10 |
| **Deciders** | Operator-approved phase map; technical verification pending |

---

<!-- ANCHOR:adr-001-context -->
### Context

Adds privacy-minimized Web Push hints and hardens installation, lifecycle, revocation, and stale-state behavior across supported mobile platforms. The system handles remote code-agent authority and failure states, so the phase needs one explicit design boundary rather than implicit behavior spread across consumers.

### Constraints
- Foreground PWA from phase 005
- Committed relay transitions from phase 003
- Auth/revocation from phase 004
- Supported physical devices
- Dependent capability remains disabled when required evidence is missing or failing.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Send generic hints only after committed state transitions and require authenticated fetch-on-open for all details and actions.

**How it works**: The server stores encrypted subscriptions separately from transcript data, applies preferences and deduplication, and sends an opaque lookup ID. The service worker never submits prompts or approval decisions.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen approach** | Bounded ownership and executable evidence | Requires explicit contracts and gates | 9/10 |
| Detailed notification payloads | More useful at a glance | Leaks sensitive agent and tool context on lock screens | 1/10 |
| Push approval actions | Fast response | Stale background state cannot safely carry authority | 1/10 |

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
| Sensitive notification exposure | H | Generic copy and opaque IDs only |
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
- `apps/pi-remote-relay/src/push/`: Encrypted subscriptions, preferences, deduplication, and generic hints.
- `apps/pi-remote-web/src/service-worker/`: Notification handling and authenticated fetch-on-open.
- `apps/pi-remote-web/src/settings/`: Per-device preferences and unsubscribe/logout behavior.
- `tests/pi-remote/device/`: Install, lifecycle, stale-hint, and platform fixtures.

**How to roll back**: Disable push generation, revoke subscriptions, and remove service-worker notification handling without affecting foreground remote control.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
