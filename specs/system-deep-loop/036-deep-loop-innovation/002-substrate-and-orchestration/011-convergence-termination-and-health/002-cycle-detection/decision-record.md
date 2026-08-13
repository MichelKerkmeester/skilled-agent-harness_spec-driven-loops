---
title: "Decision Record: Canonical Additive-Dark Cycle Evidence"
description: "Records the choice to detect cycles from typed canonical state while preserving legacy convergence authority."
trigger_phrases:
  - "cycle detection decision record"
  - "canonical cycle signatures"
  - "additive-dark cycle evidence"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/002-cycle-detection"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/002-cycle-detection"
    last_updated_at: "2026-07-21T11:31:40Z"
    last_updated_by: "codex"
    recent_action: "Accepted ordered independent repetition evidence"
    next_safe_action: "Keep cycle evidence dark until stopping-clock arbitration"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Canonical Additive-Dark Cycle Evidence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Typed Canonical State and Evidence-Only Shadowing

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Deciders** | Cycle-detection implementation owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

The shipped convergence function evaluates one point-in-time snapshot and carries no longitudinal state. Detecting repeated
work from prompt text would make replay depend on mutable wording, while placing the detector in the authoritative stop path
would change behavior before the stopping-clock contract exists.

### Constraints

- Claim and focus source modules are frozen inputs and cannot be modified or re-derived from text.
- The detector must confirm periods one through four on the third complete traversal.
- Missing history or progress must remain unknown rather than becoming negative evidence.
- Legacy convergence remains the only current stop authority.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Canonical typed signatures, a single bounded replay reducer, explicit progress gating, and evidence-only shadow output.

**How it works**: One projector verifies phase-010 claim and focus records at a shared committed watermark, strips presentation
text from semantic signatures, and hashes the canonical typed payloads. The detector reads a 12-entry projection, evaluates
every independently qualifying repetition kind in deterministic order, emits typed health evidence through the authorized
ledger, and returns the opaque authoritative result without modification.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Typed canonical shadow detector** | Replay-stable, bounded, preserves authority | Requires explicit adapters and version contracts | 9/10 |
| Text or embedding similarity | Easy to prototype | Non-deterministic, wording-sensitive, cannot prove replay parity | 2/10 |
| Add memory directly to convergence | Centralized decision path | Violates additive-dark scope and changes current stop behavior | 1/10 |

**Why this one**: Typed state is the only option that satisfies byte-stable replay and the authority boundary at the same time.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Genuine fixed points and short sequences become observable at a deterministic boundary.
- Composite churn and a co-occurring higher-priority repetition kind can no longer hide focus or claim-frontier degeneration.
- Every health transition carries exact cursors, fingerprints, progress basis, and policy identity.

**What it costs**:

- Source adapters must supply a complete progress vector. Mitigation: missing data has an explicit `not_evaluable` path.
- Sensitivity changes require a new policy version. Mitigation: stored history remains interpretable under its original policy.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| False confirmation during productive revisitation | High | Independent evidence, typed claim changes, resolutions, and net end-versus-start coverage gains break the candidate |
| Starvation between independent repetition kinds | High | Evaluate all qualifying focus and claim candidates before selecting the deterministic primary evidence |
| Cross-run evidence reuse | High | Evidence and health payloads bind the run lineage and reject mismatches |
| Accidental stop authority | Critical | The handoff type fixes authority to `evidence_only` and stop decision to `null` |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Point-in-time convergence cannot observe repeated longitudinal state |
| 2 | **Beyond Local Maxima?** | PASS | Typed, text-based, and authoritative-path alternatives were compared |
| 3 | **Sufficient?** | PASS | One projector, one reducer, one detector, one event boundary, and one shadow adapter cover the contract |
| 4 | **Fits Goal?** | PASS | The implementation addresses only cycle health evidence |
| 5 | **Open Horizons?** | PASS | Versioned policy and evidence-only clock input allow later staged cutover without reinterpretation |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `runtime/lib/cycle-detection/` contains the policy, typed projector, history reducer, detector, health events, and shadow adapter.
- `runtime/tests/unit/cycle-detection.vitest.ts` covers canonicalization, period boundaries, co-occurring repetition, required claim watermarks, net progress, replay, authorization, and authority isolation.

**How to roll back**: Stop calling the additive shadow observer and health-event writer, then remove the new cycle-detection
module and its test. No legacy file, claim record, focus decision, or authorized substrate requires reversal.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
