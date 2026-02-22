---
title: "Decision Record: 006-hybrid-rag-fusion-logic-improvements [template:level_3+/decision-record.md]"
description: "Decision records for audit-first hybrid RAG hardening, unified confidence policy, and prevention-first automation."
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
trigger_phrases:
  - "decision"
  - "adr"
  - "hybrid rag fusion"
  - "confidence policy"
  - "prevention"
importance_tier: "critical"
contextType: "decision"
---
# Decision Record: 006-hybrid-rag-fusion-logic-improvements

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-documentation/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Audit-First Hardening Before Additional Fusion Tuning

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Retrieval Maintainer, Spec Kit Maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

The hybrid pipeline from `002` is active and feature-rich, but seam-level failure risk remains across indexing, retrieval confidence, and session routing. Directly adding more tuning without a deep baseline audit risks introducing regressions that are hard to explain or roll back.

### Constraints

- Preserve existing architecture and avoid schema migrations.
- Keep prior bug-fix invariants from `003`, `004`, and `005` intact.
- Maintain practical latency targets while adding safeguards.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: run an explicit deep system audit first, then apply bounded hardening based on measured findings.

**How it works**: Phase 1 produces fixture baselines, confidence distributions, and seam-risk mapping. Only then do phases 2 and 3 introduce fusion guardrails and automation checks. Each change must map to a baseline gap and an acceptance criterion.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Audit-first hardening (Chosen)** | High traceability, lower regression risk, clear rollback points | Front-loaded analysis time | 9/10 |
| Direct tuning without baseline | Faster initial code changes | Low explainability and high drift risk | 4/10 |
| Full architecture replacement | Potential long-term redesign flexibility | High scope, high risk, violates current constraints | 2/10 |

**Why this one**: It is the lowest-risk path that still yields meaningful quality gains and governance-grade evidence.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Every hardening change has measurable before/after evidence.
- Regression risk is contained by phase boundaries and fixture baselines.

**What it costs**:
- Initial schedule overhead for analysis. Mitigation: bound audit scope to top risk seams.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Audit data becomes stale during long implementation windows | M | Re-run baseline snapshots at phase boundaries |
| Over-analysis delays core fixes | M | Track strict deliverables and stop conditions per phase |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Seam failures are already known from `003` to `005` lineage. |
| 2 | **Beyond Local Maxima?** | PASS | Multiple alternatives were evaluated. |
| 3 | **Sufficient?** | PASS | Audit plus bounded hardening directly targets the gap. |
| 4 | **Fits Goal?** | PASS | Aligns with deep-audit and bug-prevention objective. |
| 5 | **Open Horizons?** | PASS | Preserves architecture while enabling future tuning safely. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Add audit artifacts and baseline fixtures.
- Gate hardening tasks on baseline evidence.
- Update docs and checklist with audit-to-action mapping.

**How to roll back**: revert phase-specific hardening changes while preserving audit fixtures for next iteration.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Unified Confidence Policy Across Retrieval and Session Routing

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-22 |
| **Deciders** | Retrieval Maintainer, Command Workflow Maintainer |

### Context

`memory-search` and folder auto-detection both rely on confidence signals, but their thresholds and fallback behaviors evolved independently. This can create inconsistent user behavior where retrieval marks low confidence while routing proceeds silently, or the reverse.

### Decision

Adopt one policy contract for low-confidence handling: explicit threshold ownership, explicit fallback behavior, and shared escalation semantics, while allowing component-specific numeric tuning where justified by evidence.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared policy contract (Chosen)** | Consistent user behavior, clearer governance | Requires cross-module coordination | 8/10 |
| Fully independent policies | Faster local iteration | Behavioral drift and confusion | 5/10 |
| One global numeric threshold for all modules | Simple mental model | Ignores distribution differences per subsystem | 6/10 |

### Consequences

- Positive: low-confidence behavior becomes predictable across workflows.
- Positive: incident triage becomes easier due to consistent semantics.
- Tradeoff: additional coordination and regression coverage required.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Inconsistent confidence handling is an active risk class. |
| 2 | **Beyond Local Maxima?** | PASS | Independent and unified alternatives evaluated. |
| 3 | **Sufficient?** | PASS | Shared contract with local tuning balances consistency and accuracy. |
| 4 | **Fits Goal?** | PASS | Directly supports automation/interconnection objective. |
| 5 | **Open Horizons?** | PASS | Enables future modules to adopt same confidence semantics. |

**Checks Summary**: 5/5 PASS

### Implementation

- Define policy contract document in this spec.
- Map retrieval and routing handlers to this contract.
- Add boundary tests for ambiguous and low-confidence cases.

---

## ADR-003: Prevention-First Release Gates for 003/004/005 Failure Classes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Engineering Lead, QA Lead |

### Context

Prior specs fixed concrete bugs, but fixes can regress without explicit release gates. Known classes include alias-path duplication (`003`), metadata/tier drift (`004`), and wrong-folder auto-selection (`005`).

### Decision

Promote these classes to release-gated invariants. A release cannot proceed when any mapped invariant fails.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Release-gated invariants (Chosen)** | Strong prevention, objective quality bar | More CI setup and maintenance | 9/10 |
| Best-effort regression tests only | Lower overhead | Easier to bypass under schedule pressure | 5/10 |
| Manual review only | Human judgment flexibility | High miss risk and poor reproducibility | 3/10 |

### Consequences

- Positive: known failures are blocked before deployment.
- Positive: continuity from prior specs becomes enforceable, not narrative only.
- Tradeoff: CI runtime and triage overhead increase.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prior failures justify strict prevention. |
| 2 | **Beyond Local Maxima?** | PASS | Manual and best-effort alternatives considered. |
| 3 | **Sufficient?** | PASS | Invariant gates directly target recurrence risk. |
| 4 | **Fits Goal?** | PASS | Matches bug-prevention objective in this initiative. |
| 5 | **Open Horizons?** | PASS | Adds reusable quality pattern for future specs. |

**Checks Summary**: 5/5 PASS

### Implementation

- Add invariant checks and test fixtures tied to each bug class.
- Fail CI on invariant violations.
- Track remediation evidence in checklist before sign-off.

---

## Continuity Notes

- ADR-001 explicitly carries forward architecture decisions from `002`.
- ADR-003 operationalizes protections for defect classes fixed in `003`, `004`, and `005`.
- ADR-002 connects `005` routing confidence behavior to retrieval confidence behavior from `002`.

---

<!--
DECISION RECORD
Multiple ADRs for Level 3+ governance and continuity enforcement.
-->
