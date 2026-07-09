---
title: "Decision Record: 116/004 — Validator v2 Enforcement"
description: "ADR for warnings-first v2 validator rollout."
trigger_phrases:
  - "validator v2 ADR"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/003-deep-review/004-complexity-validator-v2-enforcement"
    last_updated_at: "2026-05-22T12:10:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented validator v2 warnings and enforcement surface."
    next_safe_action: "Verify and handoff."
---
# Decision Record: 116/004 — Validator v2 Enforcement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Three-Phase Rollout (warn -> hard-fail v2 -> STOP wire)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Deciders** | Phase D+E implementer |

<!-- ANCHOR:adr-001-context -->
### Context

Phase 001 found that deep-review needs auditable absence-of-finding proof, not only severity validation after findings exist. Phase 003 defined the v2 schema. Phase D now introduces validator checks, but historical review packets do not contain v2 fields and Phase E reducer visibility is shipping in the same bundled dispatch.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Use a three-phase rollout:

1. **Phase D** ships warning-capable validator results and v2 checks behind `DEEP_REVIEW_V2_ENFORCEMENT`, defaulting to `warn`.
2. **Phase E** makes reducer/dashboard/report state observable so search debt is visible to operators.
3. **Phase F** wires candidate/search coverage into STOP decisions.

Warn-mode converted failures use `warn_<failure_reason>` advisory codes. Transport identity mismatch between state-log and delta rows remains a hard failure because it means reducer rehydration cannot be trusted.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Hard-fail v2 day 1 | Strong enforcement immediately | Breaks legacy migration flow and fails before reducer observability exists | Rejected |
| Warn forever | No migration breakage | Never enforces the v2 contract; agents can keep emitting shallow proof | Rejected |
| Three-phase rollout | Migration-safe, observable, then enforceable | Requires phase discipline across D/E/F | Accepted |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Historical packets remain readable.
- Operators see typed `schema_advisory` warnings.
- Strict behavior can be enabled by environment once Phase E visibility exists.

**Negative**:
- Default warn mode can allow shallow v2 records during rollout.
- Consumers must read optional warnings in addition to `ok`.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five-Check Review

| Lens | Result |
|------|--------|
| Clarity | Rollout flag is explicit and documented. |
| Systems | Validator, reducer, and STOP-gate sequencing is staged. |
| Bias | Avoids assuming old packets can satisfy new schema. |
| Sustainability | Advisory codes are typed and machine-readable. |
| Scope | Phase D avoids reducer, convergence, and graph DB changes. |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
**Implementation Notes**:
- Advisory shape is `{ code, detail, fieldPath? }`.
- Initial advisory codes include `legacy_unversioned_record`, `applicability_strict_unenforced`, and `ledger_present_but_unverified`.
- v2 strict reasons include `v2_missing_ledger`, `v2_uncited_ledger_row`, `v2_broken_linked_finding`, `v2_shallow_finding_details`, and state/delta identity mismatch.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
