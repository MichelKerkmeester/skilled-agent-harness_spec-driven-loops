---
title: "Decision Record: 116/005 — Search Ledger Persistence and Reporting"
description: "ADR for extending reducer registry state with search-ledger persistence."
trigger_phrases:
  - "reducer registry shape extension"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/003-deep-review/005-complexity-search-ledger-persistence"
    last_updated_at: "2026-05-22T12:10:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented reducer search ledger persistence and reporting surface."
    next_safe_action: "Run final validation and use bundled commit handoff."
---
# Decision Record: 116/005 — Search Ledger Persistence and Reporting

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reducer Registry Shape Extension

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Deciders** | Phase D+E implementer |

<!-- ANCHOR:adr-001-context -->
### Context

Phase 001 found that reports and dashboards can hide search debt. Phase 004 now validates v2 search-depth fields, but validation alone does not preserve them. Phase 006 convergence gates need machine-readable state, not prose-only report text.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Extend the reducer-owned registry with:

- `candidateCoverage`
- `searchDebt`
- `ruledOutCandidates`
- `cleanSearchProof`
- `searchCoverage`

Dashboard verdict uses the existing P1-style threshold: search debt downgrades PASS to CONDITIONAL, while active P0 findings still produce FAIL.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Report-only enrichment | Quick and visible in final synthesis | Future STOP gates cannot consume prose reliably | Rejected |
| New sidecar registry | Keeps old findings registry untouched | Duplicates persistence and creates two reducer truths | Rejected |
| Collapse into findings | Reuses existing severity UI | Loses null-search evidence and conflates search obligations with bugs | Rejected |
| Extend reducer registry | Durable, visible, future-gate ready | Adds fields to shared registry shape | Accepted |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Search debt survives reducer processing.
- Dashboard and reports expose no-finding proof and obligations.
- Phase F can consume machine state directly.

**Negative**:
- Registry consumers must tolerate additional fields.
- Dashboard gets more verbose when search proof exists.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five-Check Review

| Lens | Result |
|------|--------|
| Clarity | Field names match frozen Phase E output names. |
| Systems | Registry feeds dashboard/report now and STOP gates later. |
| Bias | Avoids equating clean search proof with active findings. |
| Sustainability | Zero-shape v1 output keeps consumers stable. |
| Scope | Phase F/G files remain untouched. |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
**Implementation Notes**:
- v1 records emit zero-shape fields.
- `searchCoverage` is latest-v2 passthrough; ledger-derived rows aggregate across all v2 iterations.
- `CONDITIONAL` was chosen over `PASS hasSearchDebt=true` because existing dashboard semantics already use CONDITIONAL for non-P0 required debt.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
