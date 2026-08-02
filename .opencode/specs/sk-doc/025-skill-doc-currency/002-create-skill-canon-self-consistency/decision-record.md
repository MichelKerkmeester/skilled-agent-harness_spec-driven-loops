---
title: "Decision Record: create-skill-canon-self-consistency"
description: "BUILD decisions: the validator fork is refuted at HEAD; topology restatements are illustrative and registry-bound."
trigger_phrases:
  - "workflow section required or advisory"
  - "extension matrix generated or illustrative"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/002-create-skill-canon-self-consistency"
    last_updated_at: "2026-08-02T08:12:30Z"
    last_updated_by: "skd025-002-build"
    recent_action: "Recorded DR-4 refutation, DR-5 decision, and passing gate receipts"
    next_safe_action: "Keep the decision record aligned with the docs-only scope"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Create-Skill Canon Self-Consistency

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

This BUILD leaf records the evidence available at HEAD. DR-4 is not a live fork: the canon and validator agree, so the finding is refuted. DR-5 is resolved for this docs-only scope by keeping topology examples illustrative and directing readers to the live registry.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: DR-4 — is the workflow section required or advisory?

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Refuted at HEAD |
| **Date** | 2026-08-02 |
| **Deciders** | BUILD leaf authority review |

---

<!-- ANCHOR:adr-001-context -->
### Context

The HEAD version of `sk-create-skill/scripts/package_skill.py` and the current canon agree on the required section contract. The earlier prose-versus-validator premise for `RE-009-06` is not reproducible at this HEAD, so there is no validator-only change to make.

### Constraints

- Whichever way this rules, `package_skill.py` and the governing prose must agree afterwards.
- The ruling is a policy choice, not a bug fix — nothing here indicates which side is "correct" independent of an operator decision.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Refuted.** The current validator and canon agree. `RE-009-06` is closed without a production edit; the executable validator remains unchanged.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

No alternative was selected because the alleged fork is absent at HEAD. Introducing a validator or prose change would create a new policy change outside this leaf.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**: the record prevents a refuted validator/prose finding from driving an unnecessary executable change.

**What it costs**: the original research proposal remains historical context; this leaf does not add a conformance test or alter the validator.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Treating a stale or refuted finding as authority | M | Re-read the live canon and validator; preserve the current agreement |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

The Five Checks are satisfied for this narrow disposition: the claim was checked against HEAD, no executable change is required, the stale premise is documented, and the scope boundary is explicit.

**Checks Summary**: Refuted finding; no production change.
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

No implementation change. The child ledger records the validator and canon anchors and closes `RE-009-06` as refuted.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: DR-5 — is the per-hub extension matrix generated or illustrative?

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Resolved — illustrative and registry-bound |
| **Date** | 2026-08-02 |
| **Deciders** | BUILD leaf authority review |

### Context

The hand-maintained per-hub extension matrix is a symptom, not just a stale row: four documents restate another hub's mode topology (`RE-006-11` plus the originally scheduled finding), and at least one restatement has already drifted from the registry it describes.

### Decision

**Resolved for this leaf.** Keep hand-maintained examples explicitly illustrative and non-authoritative, and direct current claims to the live `mode-registry.json`. The docs-only scope does not add a generator or change registry/runtime behavior.

### Alternatives Considered

Generation remains a possible future improvement, but it is not part of this docs-only correction.

### Consequences

The label is cheaper and fits the current scope. It leaves a known maintenance risk, mitigated by requiring the live registry to remain authoritative.
<!-- /ANCHOR:adr-002 -->
