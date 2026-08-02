---
title: "Decision Record: routing-advisor-and-hook-truth"
description: "DR-6 records the operator's bounded-delta policy for advisor validation against the dated 2026-07-30 snapshot."
trigger_phrases:
  - "advisor gate absolute floor or bounded delta"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/003-routing-advisor-and-hook-truth"
    last_updated_at: "2026-08-02T13:01:10.000Z"
    last_updated_by: "skd025-003-build"
    recent_action: "Recorded the operator's bounded-delta ruling for DR-6"
    next_safe_action: "Keep the child In Progress until strict validation is evidenced"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "DR-6 is a bounded delta from the dated 2026-07-30 snapshot."
      - "Q3 admits all four supplementary findings into this child."
      - "Q4 limits installation-drift work to project documentation; user-global repair is deferred to the operator."
---
# Decision Record: Routing-Advisor-and-Hook-Truth

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

The entry below records the operator's ruling. The policy is applied to the reference statement; the dated snapshot and all scoring code remain unchanged.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: DR-6 — is the advisor gate an absolute floor or a bounded delta from a dated snapshot?

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-02 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

`system-skill-advisor/references/scoring/validation-baselines.md` publishes hard gate thresholds that exceed the repository's own checked-in dated baseline on all three scoring axes. As written, the document makes the repo's own baseline an automatic failure against its own stated gate — finding `RE-007-01`. Editing the threshold numbers before ruling the underlying policy would only relocate the inaccuracy, not remove it.

### Constraints

- No threshold number may be rewritten before this decision is ruled (REQ-002; enforced as a hard predecessor).
- Whichever way this rules, the gate statement and the checked-in dated baseline must read as consistent afterward.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Accepted — bounded delta from a dated snapshot.** The advisor validation gate must state that a run must not regress beyond a bounded delta below the baseline captured on **2026-07-30**. The policy thresholds are therefore derived from that snapshot: full-corpus top-1 must remain at or above `0.7544` (`0.7744` baseline minus `0.0200`, both captured on 2026-07-30); holdout top-1 must remain at or above `0.7261` (`0.7361` baseline minus `0.0100`, captured on 2026-07-30); and UNKNOWN must remain at or below `15` (`13` baseline plus `2`, captured on 2026-07-30). These are policy bounds, not edits to the scorer, snapshot JSON, or threshold-consuming code.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

The absolute floors previously published in the reference are rejected for this packet because they are not re-derived from the checked-in measurement. A dated bounded delta preserves regression sensitivity without declaring the repository's own 2026-07-30 snapshot an automatic failure.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**: the gate statement is now comparable to the checked-in 2026-07-30 measurement without treating that measurement as an automatic hard failure.

**What it costs**: the policy must be revisited when a new authoritative baseline is captured; the date and bounded deltas must move together.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A threshold edit lands before the policy ruling | H | The accepted policy is recorded here before the dated gate statement is edited |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

- **Truth**: the policy cites the measured 2026-07-30 snapshot instead of retyping an aspirational floor.
- **Scope**: only the reference policy statement changes; the snapshot, scorer, and threshold-consuming code remain untouched.
- **Reversibility**: restore the prior policy paragraph if a later operator ruling replaces this bounded delta.
- **Observability**: every post-edit validation result is reported as a delta against the 2026-07-30 capture.
- **Ownership**: the operator owns future re-baselining; this packet owns the documentation statement.
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

Update `validation-baselines.md` to use the dated bounded-delta wording and make `lane-weight-tuning.md` link to that policy. Do not modify the baseline snapshot JSON, scorer, or threshold-consuming code.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
