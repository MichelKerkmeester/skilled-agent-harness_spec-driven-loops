---
title: "Decision Record: Automated Test Harness"
description: "Records the primary architecture choice for automated test harness."
trigger_phrases:
  - "pi remote automated test harness"
  - "pi mobile phase 2"
  - "automated test harness"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/002-automated-test-harness"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the accepted harness decision with implemented evidence"
    next_safe_action: "Retain machine evidence while phase 009 collects operator-only gates"
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

# Decision Record: Automated Test Harness

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Make the evidence harness a product dependency

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted for implementation planning |
| **Date** | 2026-08-10 |
| **Deciders** | Operator-approved phase map; technical verification pending |

---

<!-- ANCHOR:adr-001-context -->
### Context

Builds the recorded, live, integration, security, browser, and crash harness that proves the remote control plane fails closed. The system handles remote code-agent authority and failure states, so the phase needs one explicit design boundary rather than implicit behavior spread across consumers.

### Constraints
- Phase 001 contracts and threat model
- Repository-selected test runner
- Isolated Pi test workspace
- Browser automation runtime
- Dependent capability remains disabled when required evidence is missing or failing.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Build the acceptance and failure harness before the relay and keep it as a cross-cutting workstream.

**How it works**: Recorded fixtures provide fast deterministic coverage, while explicit live, process, browser, and device lanes prove boundaries that mocks cannot. Every downstream capability names the exact harness rows that gate it.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen approach** | Bounded ownership and executable evidence | Requires explicit contracts and gates | 9/10 |
| Test after implementation | Less up-front work | Cannot provide a safe negative control and encourages implementation-shaped tests | 2/10 |
| Manual testing only | Simple tooling | Not repeatable across crash and race matrices | 1/10 |

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
| Flaky process and browser tests | H | Deterministic clocks, isolated resources, bounded retries, and failure artifacts |
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
- `tests/pi-remote/contract/`: Recorded and live Pi RPC contract suites.
- `tests/pi-remote/integration/`: Isolated relay-to-Pi lifecycle fixtures.
- `tests/pi-remote/chaos/`: Deterministic WebSocket, relay, and Pi kill-point harness.
- `tests/pi-remote/security/`: Auth, approval, containment, and canary matrices.
- `tests/pi-remote/browser/`: PWA reducer and browser end-to-end fixtures.

**How to roll back**: Remove the harness additions and keep implementation phases blocked; never weaken a failing negative control to unblock production code.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
