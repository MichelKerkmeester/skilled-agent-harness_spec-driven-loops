---
title: "Decision Record: Release Verification and Rollout"
description: "Records the primary architecture choice for release verification and rollout."
trigger_phrases:
  - "pi remote release verification and rollout"
  - "pi mobile phase 9"
  - "release verification and rollout"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/009-release-verification-and-rollout"
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

# Decision Record: Release Verification and Rollout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Release capabilities in evidence-gated stages

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted for implementation planning |
| **Date** | 2026-08-10 |
| **Deciders** | Operator-approved phase map; technical verification pending |

---

<!-- ANCHOR:adr-001-context -->
### Context

Runs the independent whole-system, security, performance, device, accessibility, rollback, and sign-off gates for staged release. The system handles remote code-agent authority and failure states, so the phase needs one explicit design boundary rather than implicit behavior spread across consumers.

### Constraints
- Phases 001 through 008 complete or explicitly deferred where allowed
- Target host and physical devices
- Technical, security, accessibility, and operator reviewers
- Dependent capability remains disabled when required evidence is missing or failing.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Use three separately controllable stages: private read-only monitoring, protected mutation, then optional push.

**How it works**: Each stage has an explicit evidence subset, independent disable switch, supported matrix, and rollback check. A later stage cannot compensate for a failed earlier security or reliability gate.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen approach** | Bounded ownership and executable evidence | Requires explicit contracts and gates | 9/10 |
| Single all-features launch | Simple release story | Couples optional push to security-critical mutation and increases rollback blast radius | 2/10 |
| Documentation-only sign-off | Low effort | Does not prove live host, crash, device, or accessibility behavior | 1/10 |

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
| Green automation but broken mobile reality | H | Require physical-device and assistive-technology evidence |
| Rollback damages Pi sessions | H | Backup, restore rehearsal, and native-session preservation assertions |
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
- `tests/pi-remote/evidence/`: Versioned whole-gate, security, performance, device, and accessibility evidence.
- `deploy/pi-remote/`: Release configuration, feature gates, monitoring, and rollback proof.
- `docs/pi-remote/`: Supported matrix, limitations, and evidence links.
- `specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/`: Phase statuses and final planning/implementation evidence.

**How to roll back**: Disable mutation first, remove ingress, revoke sessions/subscriptions, drain approvals, stop the relay, unload the extension, restore the compatible database, and verify local Pi sessions.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
