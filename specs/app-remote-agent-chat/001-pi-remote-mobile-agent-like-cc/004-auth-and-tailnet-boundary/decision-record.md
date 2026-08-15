---
title: "Decision Record: Authentication and Tailnet Boundary"
description: "Records the primary architecture choice for authentication and tailnet boundary."
trigger_phrases:
  - "pi remote auth and tailnet boundary"
  - "pi mobile phase 4"
  - "auth and tailnet boundary"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/004-auth-and-tailnet-boundary"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the auth decision with the implemented loopback boundary"
    next_safe_action: "Run the real Tailscale Serve ingress matrix"
    blockers:
      - "Real Tailscale Serve ingress remains operator-unverified"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 85
---

# Decision Record: Authentication and Tailnet Boundary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Tailscale for private reachability, not application authority

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted for implementation planning |
| **Date** | 2026-08-10 |
| **Deciders** | Operator-approved phase map; technical verification pending |

---

<!-- ANCHOR:adr-001-context -->
### Context

Adds private HTTPS/WSS ingress, application authentication, default-deny authorization, revocation, and a read-only remote API. The system handles remote code-agent authority and failure states, so the phase needs one explicit design boundary rather than implicit behavior spread across consumers.

### Constraints
- Relay core from phase 003
- Security harness from phase 002
- Target host and Tailscale
- Dependent capability remains disabled when required evidence is missing or failing.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Expose a loopback relay through Tailscale Serve and require a separate short-lived application session plus per-action authorization.

**How it works**: Serve provides private TLS reachability. The relay validates the deployment-specific identity signal, exact Origin, a one-use WebSocket ticket, revocation state, and the principal's explicit workspace/session/action grants.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen approach** | Bounded ownership and executable evidence | Requires explicit contracts and gates | 9/10 |
| Tailnet identity only | Fewer auth components | Cannot express per-session or per-action authority and increases proxy-header risk | 3/10 |
| Public hosted relay | Accessible without tailnet | Requires Internet-grade identity, abuse, tenancy, and operations | 2/10 |

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
| Proxy-header trust | H | Strip client headers and trust only the verified deployment boundary |
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
- `apps/pi-remote-relay/src/http/`: Bootstrap, session, ticket, Origin, and rate-limit endpoints.
- `apps/pi-remote-relay/src/auth/`: Principal, workspace, session, action, and revocation policy.
- `deploy/pi-remote/`: Loopback service and Tailscale Serve configuration.
- `tests/pi-remote/security/ingress/`: Spoof, bypass, ticket, Origin, and revocation evidence.

**How to roll back**: Disable the Serve route, revoke relay sessions, and stop the relay listener while preserving local Pi and relay data.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
