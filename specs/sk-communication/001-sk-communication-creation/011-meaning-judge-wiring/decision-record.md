---
title: "Decision Record: Phase 011 Meaning-Judge Wiring"
description: "Architecture decision to compose a local post-restoration reject-only meaning judge with exact-original failure behavior."
trigger_phrases:
  - "meaning-judge-wiring"
  - "architecture decision"
  - "local reject-only judge"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/011-meaning-judge-wiring"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Proposed the local reject-only judge decision."
    next_safe_action: "Confirm the local judge runtime, then implement through tasks.md."
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
# Decision Record: Phase 011 Meaning-Judge Wiring

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Compose a local post-restoration reject-only meaning judge

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-08-13 |
| **Deciders** | Package maintainer and privacy owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

The meaning judge exists but is absent from production composition. Because it sees decoded source and restored candidate text, placing it behind a hosted endpoint would create a second plaintext egress.

### Constraints

- Deterministic restoration must run before the meaning judge.
- The judge may reject meaning loss but may not rank fluency or override deterministic rejection.
- Every negative, unavailable, or malformed outcome returns exact-original.
- Offline proxy reviewers remain evaluation-only.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We propose**: Compose a local reject-only judge after deterministic restoration and before render selection.

**How it works**: A production composition feeds only valid restored candidates to the local judge. Acceptance permits render evaluation; rejection, timeout, cancellation, exception, absence, or invalid output selects exact-original.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Local post-restoration reject-only judge | Meaning veto without second hosted egress | Requires a local runtime and bounded deadline | 9/10 |
| Keep the judge disabled | No runtime cost | Meaning loss remains unchecked in production | 3/10 |
| Hosted judge over restored plaintext | Easy model access | Creates a prohibited second plaintext egress | 1/10 |
| Use the masked proxy reviewer | Existing comparative lane | Provisional evaluator, not a runtime reject-only validator | 2/10 |

**Why this one**: The local reject-only boundary is the only option that supplies the missing meaning veto without weakening privacy or deterministic fidelity.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Meaning-loss candidates are rejected before display.
- Every judge failure has deterministic exact-original behavior.

**What it costs**:

- Projection latency includes a bounded local judge call. Mitigation: enforce a deadline and fail closed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Local runtime is unavailable or returns an invalid result. | High | Treat every unavailable or invalid state as exact-original. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Source-anchored inspection confirms the judge is missing from production. |
| 2 | Beyond local maxima? | PASS | Disabled, local, hosted, and proxy-reviewer options were compared. |
| 3 | Sufficient? | PASS | One composition and reject-only interface are the smallest safe wiring. |
| 4 | Fits goal? | PASS | Meaning preservation is required for reference-like output. |
| 5 | Open horizons? | PASS | The typed local boundary can accept future local judges without core rewrites. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- Production composition: connect provider output, deterministic validator, local judge, and render decision.
- Terminal-state handling: map every unavailable or negative judge outcome to exact-original.
- Tests: prove stage order, local egress, evaluation separation, and canonical immutability.

**How to roll back**: Disable the composition entry point, select exact-original for affected candidates, and rerun terminal-state and egress canaries.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
