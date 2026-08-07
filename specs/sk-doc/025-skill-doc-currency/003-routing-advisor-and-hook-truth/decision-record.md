---
title: "Decision Record: routing-advisor-and-hook-truth"
description: "One genuine fork with no synthesis ruling behind it: whether the advisor gate is an absolute floor or a bounded delta from a dated snapshot. Not pre-decided by this record; editing the gate numbers before ruling it would just relocate the inaccuracy."
trigger_phrases:
  - "advisor gate absolute floor or bounded delta"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/003-routing-advisor-and-hook-truth"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded DR-6 as a genuine unruled policy fork"
    next_safe_action: "Operator rules DR-6 before any threshold edit lands"
    blockers:
      - "DR-6 is a hard predecessor to the threshold edit"
    key_files:
      - "decision-record.md"
    completion_pct: 0
    open_questions:
      - "DR-6 absolute floor or bounded delta"
    answered_questions: []
---
# Decision Record: Routing-Advisor-and-Hook-Truth

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

The entry below is a **genuine fork with no synthesis ruling behind it** — the research loop asked it twice without answering it. Writing a decision now would fabricate a ruling nobody has made. It stays open until the operator rules it.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: DR-6 — is the advisor gate an absolute floor or a bounded delta from a dated snapshot?

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Undecided |
| **Date** | 2026-07-30 |
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

**Not yet ruled.** The two live options are: (a) the gate is an absolute floor, and the current baseline is stated as failing until the repository's real numbers clear it; or (b) the gate is a bounded delta from a dated snapshot, and the document is rewritten to state the policy that way, carrying the snapshot's date with the number. This phase does not pick between them.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

Deferred until the operator rules DR-6. Evaluating alternatives before the ruling would pre-judge which option "wins."
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**: once ruled, the gate statement and the checked-in baseline stop contradicting each other.

**What it costs**: deferred until the ruling — the cost differs materially between "hold the floor and improve the baseline" and "rewrite the policy to a bounded delta."

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A threshold edit lands before the policy ruling | H | REQ-002 makes the ruling a hard predecessor to any threshold edit; enforced in `tasks.md` and `checklist.md` |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

Deferred. The Five Checks framework evaluates a proposed decision; there is no proposed decision to evaluate until DR-6 is ruled.

**Checks Summary**: Not applicable — no decision proposed
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

Deferred until DR-6 is ruled. This phase's task T008 populates this section once the ruling lands.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
