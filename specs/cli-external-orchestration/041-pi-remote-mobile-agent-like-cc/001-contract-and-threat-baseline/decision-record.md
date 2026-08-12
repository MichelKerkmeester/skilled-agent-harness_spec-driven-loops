---
title: "Decision Record: Contract and Threat Baseline"
description: "Records the primary architecture choice for contract and threat baseline."
trigger_phrases:
  - "pi remote contract and threat baseline"
  - "pi mobile phase 1"
  - "contract and threat baseline"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline"
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

# Decision Record: Contract and Threat Baseline

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Freeze live contracts and trust boundaries before production code

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted for implementation planning |
| **Date** | 2026-08-10 |
| **Deciders** | Operator-approved phase map; technical verification pending |

---

<!-- ANCHOR:adr-001-context -->
### Context

Pins the live Pi, host, ingress, browser, storage, and extension contracts and freezes the threat model before production implementation. The system handles remote code-agent authority and failure states, so the phase needs one explicit design boundary rather than implicit behavior spread across consumers.

### Constraints
- Existing research lineages
- Installed Pi CLI
- Target host and Tailscale
- Operator-selected device resources
- Dependent capability remains disabled when required evidence is missing or failing.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Use a version-pinned contract and threat baseline as the mandatory entry gate for every implementation phase.

**How it works**: Capture the installed runtime behavior, translate it into typed and state-machine contracts, and bind each dangerous assumption to a negative control. Downstream phases consume the frozen artifacts and stop when drift is detected.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen approach** | Bounded ownership and executable evidence | Requires explicit contracts and gates | 9/10 |
| Start with the PWA | Produces visible progress quickly | Builds on unverified protocol and authority assumptions | 2/10 |
| Rely on research reports | Already available | Cannot prove the implementation host or current versions | 3/10 |

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
| Baseline captures secrets | H | Redact before persistence and scan evidence with canaries |
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
- `packages/pi-rpc-protocol/`: Versioned Pi command, response, event, envelope, and state contracts.
- `tests/pi-remote/fixtures/`: Sanitized recorded RPC and session-layout fixtures.
- `tests/pi-remote/security/`: Threat model, authorization matrix, and negative-control definitions.
- `deploy/pi-remote/baseline/`: Pinned host, Pi, Node, browser, and Tailscale evidence.

**How to roll back**: Discard the baseline artifacts and keep every downstream capability blocked; no production state or Pi session is changed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
