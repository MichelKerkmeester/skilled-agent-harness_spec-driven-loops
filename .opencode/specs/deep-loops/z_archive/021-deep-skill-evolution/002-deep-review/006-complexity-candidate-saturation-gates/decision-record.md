---
title: "Decision Record: 116/006 - Candidate Saturation and Graphless Gates"
description: "ADR-001 documents named legal-stop gates for candidate coverage and graphless fallback evidence."
trigger_phrases:
  - "ADR candidate coverage gate"
  - "ADR graphless fallback gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/006-complexity-candidate-saturation-gates"
    last_updated_at: "2026-05-22T12:09:15Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Recorded ADR-001 for Phase F legal-stop gate semantics."
    next_safe_action: "Verify YAML mirrors and strict spec validation."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml"
---

# Decision Record: 116/006 - Candidate Saturation and Graphless Gates

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Named Legal-Stop Gates for Candidate Coverage + Graphless Fallback

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Deciders** | Phase F implementation owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

Deep-review already has STOP gates for convergence, dimension coverage, P0 resolution, evidence density, hotspot saturation, claim adjudication, and fix-completeness replay. Those gates are valuable, but none directly ask whether v2 candidate-search obligations have been satisfied.

Phase E made search state durable in the reducer registry: `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage`. Phase F is the first point where STOP legality can consume that reducer-owned state. Graphless fallback also needs to remain a YAML-level policy because the coverage-graph convergence handler intentionally returns `CONTINUE` for empty graphs.

### Constraints

- Keep `coverage-graph/convergence.ts` graph-empty `CONTINUE` behavior unchanged.
- Do not change validator, reducer, graph DB, graph upsert, or tests unless the seeded convergence fixture cannot exercise YAML.
- Keep legacy v1 review records readable and exempt from v2-only gate failures.
- Preserve blocked-stop event schema shape; extension is allowed, rename/removal is not.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Add two explicit legal-stop gate names, `candidateCoverageGate` and `graphlessFallbackGate`, to both deep-review YAML mirrors.

**Details**:

- `candidateCoverageGate` skips legacy records, passes trivial+skip records only with cited evidence, and otherwise requires empty reducer `searchDebt` plus full coverage of `searchCoverage.requiredBugClasses`.
- `graphlessFallbackGate` skips legacy records and `graph` mode, passes `graphless_fallback` only when each required bug class has a cited fallback ledger row using approved search methods, and fails closed for `unavailable_blocked`.
- Both gate names are included in `blockedBy`, output fields, and `blocked_stop.gateResults`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Named `candidateCoverageGate` + `graphlessFallbackGate`** | Preserves concern boundaries, gives operators precise blocker names, consumes reducer state where STOP is decided | Requires mirror updates and runner support for new placeholders | 9/10 |
| Extend `claimAdjudicationGate` semantics | Reuses an existing STOP veto | Rejected: collapses concerns. Claim adjudication is about active P0/P1 severity claims, not no-finding candidate coverage or graphless fallback proof. | 4/10 |
| Hard-fail at validator | Blocks bad v2 records early | Rejected: premature without reducer state. The STOP decision needs lineage-level `searchDebt` and candidate coverage, not only one iteration's shape. | 5/10 |
| Dashboard-only signal | Operator-visible with minimal workflow change | Rejected: operator-visible but does not block STOP. It can still allow a PASS-shaped terminal verdict with unresolved search debt. | 3/10 |

**Why Chosen**: Named legal-stop gates give the workflow precise, auditable STOP blockers while keeping validator, reducer, and graph responsibilities separate.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:

- STOP blockers name the missing obligation directly.
- Graphless mode is evidence-based rather than a waiver.
- Reducer-owned Phase E state now affects termination legality.
- Legacy v1 records remain compatible.

**Negative**:

- YAML runner support must materialize these placeholders for end-to-end execution.
- Handler-level convergence tests may not prove YAML-only policy.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Placeholder drift between mirrors | H | Patch auto and confirm together; grep parity. |
| Over-blocking trivial work | M | Keep explicit trivial+skip evidence exemption. |
| Graphless fallback evidence is underspecified | H | Enumerate accepted search methods and require evidence refs. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Phase E made search debt visible but not STOP-blocking. |
| 2 | Beyond Local Maxima? | PASS | Claim-adjudication, validator, and dashboard-only alternatives were evaluated. |
| 3 | Sufficient? | PASS | Two gate names cover candidate saturation and graphless fallback separately. |
| 4 | Fits Goal? | PASS | The change blocks STOP at the legal-stop decision point. |
| 5 | Open Horizons? | PASS | Phase G graph vocabulary and Phase H runner/default work remain independent. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:

- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`
- `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`
- Phase 006 Level 3 spec packet

**Rollback**: Revert the YAML gate additions and this spec folder's Phase F documentation changes. No data migration is required.
<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->
