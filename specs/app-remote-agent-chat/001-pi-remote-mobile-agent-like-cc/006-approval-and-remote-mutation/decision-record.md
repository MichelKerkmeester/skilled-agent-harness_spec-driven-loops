---
title: "Decision Record: Approval, Containment, and Remote Mutation"
description: "Records the primary architecture choice for approval, containment, and remote mutation."
trigger_phrases:
  - "pi remote approval and remote mutation"
  - "pi mobile phase 6"
  - "approval and remote mutation"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the final-boundary decision with the implemented authority loop"
    next_safe_action: "Verify live extension ordering and real macOS containment"
    blockers:
      - "Live Pi extension and protected containment remain operator-unverified"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 85
---

# Decision Record: Approval, Containment, and Remote Mutation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Gate protected tools at Pi's final executable boundary

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted for implementation planning |
| **Date** | 2026-08-10 |
| **Deciders** | Operator-approved phase map; technical verification pending |

---

<!-- ANCHOR:adr-001-context -->
### Context

Introduces the final-boundary Pi approval extension, containment, shared redaction, and evidence-gated remote mutation. The system handles remote code-agent authority and failure states, so the phase needs one explicit design boundary rather than implicit behavior spread across consumers.

### Constraints
- Phases 001 through 005
- Pinned Pi extension surface
- Target-host containment primitive
- Dependent capability remains disabled when required evidence is missing or failing.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Use a pinned Pi extension that recomputes a canonical action digest immediately before protected execution and consumes one relay-authorized lease.

**How it works**: The relay creates a short-lived lease bound to principal, session, epoch, tool, canonical arguments, policy version, and digest. The extension denies unless the current payload exactly matches the first valid unexpired decision and containment is healthy.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen approach** | Bounded ownership and executable evidence | Requires explicit contracts and gates | 9/10 |
| Approve only in the PWA | Good user experience | Cannot prove the executed arguments stayed unchanged | 2/10 |
| Relay-only preflight | Central policy | A later extension or tool transformation can bypass the approved payload | 4/10 |

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
| Approved tool escapes containment | H | OS-level isolation plus adversarial target-host tests |
| Canonicalization mismatch | H | Single canonical serializer shared by card, ledger, and final gate |
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
- `extensions/pi-remote-approval/`: Pinned protected-tool gate with canonical payload binding.
- `apps/pi-remote-relay/src/approval/`: Approval leases, decisions, revocation, and audit metadata.
- `apps/pi-remote-relay/src/policy/`: Per-command mutation enablement and kill switch.
- `deploy/pi-remote/containment/`: Workspace, process, credential, UID, and network restrictions.
- `tests/pi-remote/security/approval/`: TOCTOU, race, escape, restart, and canary evidence.

**How to roll back**: Disable the mutation kill switch, revoke and deny all leases, unload the remote approval extension, and retain read-only remote monitoring.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
