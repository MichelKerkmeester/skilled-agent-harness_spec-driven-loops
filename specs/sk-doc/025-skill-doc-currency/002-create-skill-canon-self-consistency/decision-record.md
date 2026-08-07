---
title: "Decision Record: create-skill-canon-self-consistency"
description: "Two genuine forks with no synthesis ruling behind them: whether the workflow section is required or advisory, and whether the per-hub extension matrix is generated or explicitly illustrative. Neither is pre-decided by this record."
trigger_phrases:
  - "workflow section required or advisory"
  - "extension matrix generated or illustrative"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/002-create-skill-canon-self-consistency"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded DR-4 and DR-5 as genuine unruled forks"
    next_safe_action: "Operator rules DR-4 and DR-5 before the edits each governs"
    blockers:
      - "DR-4 and DR-5 have no synthesis ruling; both edit groups wait on them"
    key_files:
      - "decision-record.md"
    completion_pct: 0
    open_questions:
      - "DR-4 required or advisory"
      - "DR-5 generated or illustrative"
    answered_questions: []
---
# Decision Record: Create-Skill Canon Self-Consistency

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

Both entries below are **genuine forks with no synthesis ruling behind them** — neither was ruled by the research loop, and DR-4 carries an explicit warning from its own finding against changing the validator alone. Writing a decision now would fabricate a ruling nobody has made. Both stay open until the operator rules them.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: DR-4 — is the workflow section required or advisory?

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Undecided |
| **Date** | 2026-07-30 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

`sk-create-skill/scripts/package_skill.py` treats the workflow section as advisory during validation, while the governing prose implies it is required. Finding `RE-009-06` confirms the contradiction and warns explicitly against changing the validator alone — the ruling must cover the prose and the validator together, or the contradiction just moves.

### Constraints

- Whichever way this rules, `package_skill.py` and the governing prose must agree afterwards.
- The ruling is a policy choice, not a bug fix — nothing here indicates which side is "correct" independent of an operator decision.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Not yet ruled.** The two live options are: (a) make the workflow section required, and update `package_skill.py` to enforce it; or (b) make the governing prose explicitly advisory, matching the current validator behavior. This phase does not pick between them.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

Deferred until the operator rules DR-4. Evaluating alternatives before the ruling would pre-judge which option "wins."
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**: once ruled, `package_skill.py` and the governing prose agree, closing the contradiction `RE-009-06` found.

**What it costs**: deferred until the ruling — the cost differs materially between "make it required" (a validator change with its own test surface) and "make it advisory" (a documentation-only change).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Editing the validator alone before the prose ruling lands | M | This phase's tasks explicitly block validator edits on DR-4 landing first (`RE-009-06`'s own warning) |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

Deferred. The Five Checks framework evaluates a proposed decision; there is no proposed decision to evaluate until DR-4 is ruled.

**Checks Summary**: Not applicable — no decision proposed
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

Deferred until DR-4 is ruled. This phase's task T018 populates this section once the ruling lands.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: DR-5 — is the per-hub extension matrix generated or illustrative?

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Undecided |
| **Date** | 2026-07-30 |
| **Deciders** | Operator |

### Context

The hand-maintained per-hub extension matrix is a symptom, not just a stale row: four documents restate another hub's mode topology (`RE-006-11` plus the originally scheduled finding), and at least one restatement has already drifted from the registry it describes.

### Decision

**Not yet ruled.** The two live options are: (a) generate the matrix from each hub's own registry at build or check time, so it cannot drift; or (b) keep it hand-maintained but label it explicitly illustrative and non-authoritative, so a reader does not trust it as current. This phase does not pick between them.

### Alternatives Considered

Deferred until the operator rules DR-5.

### Consequences

Deferred until the ruling. Generating the matrix is more work up front but self-corrects; labeling it illustrative is cheaper but leaves the drift risk in place, mitigated only by the label.
<!-- /ANCHOR:adr-002 -->
