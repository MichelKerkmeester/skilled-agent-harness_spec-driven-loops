---
title: "Verification Checklist: Boundaries, Containment and Naming"
description: "Verification Date: TBD"
trigger_phrases:
  - "containment checklist"
  - "boundaries verification"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/005-boundaries-containment-and-naming"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verification checklist for the judgment tier"
    next_safe_action: "Leave unchecked until the phase executes"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Boundaries, Containment and Naming

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P0] Child 001 landed with its rulings and baseline
- [ ] CHK-005 [P0] **[OPERATOR-DECISION: Q3]** resolved and the helper's import path recorded, or the fallback invoked and its shared location recorded
- [ ] CHK-006 [P0] The three evidence corrections reconciled before any edit: the re-scoped ESM-in-`.js` claim, the wait-pattern asset's true count, the vector-index store's true symbol set
- [ ] CHK-007 [P0] Per-package baselines captured: typecheck, build, suite counts
- [ ] CHK-008 [P1] Every decision recorded before its edit: module formats, alias policy with removal conditions, extraction targets
- [ ] CHK-009 [P1] Per-file ordering agreed with child 003 for every shared file
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks — `tsc --noEmit` per package, `node --check` per JS file
- [ ] CHK-011 [P0] No console errors or warnings introduced on any runtime surface
- [ ] CHK-012 [P0] Error handling implemented — containment defines behaviour for a not-yet-existing target rather than crashing on `realpath`
- [ ] CHK-013 [P1] Code follows project patterns — every containment site uses the canonical realpath-plus-`path.relative` form, not a local variant
- [ ] CHK-014 [P0] No second containment helper authored while the shared one is available
- [ ] CHK-015 [P0] Every TypeScript package rebuilt before its runtime verification
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met — REQ-001 through REQ-012 each cite an executed command and its result
- [ ] CHK-021 [P0] Manual testing complete — the MCP server starts and serves after each extraction, against a rebuilt `dist`
- [ ] CHK-022 [P0] Edge cases tested — all 25 containment matrix rows verified: 5 sites × {sibling-prefix, symlinked-ancestor, `..`-segment, legitimate-inside, non-existent-target}
- [ ] CHK-023 [P0] Error scenarios validated — every adversarial containment row demonstrated failing before its fix
- [ ] CHK-024 [P0] Startup ordering preserved after every extraction, asserted rather than assumed
- [ ] CHK-025 [P0] Compiled-routing regenerated outputs byte-identical; the move-simulation test passes
- [ ] CHK-026 [P1] Imported-binding multiset unchanged per file by specifier normalisation
- [ ] CHK-027 [P1] Every touched package's typecheck, build and full suite reported as a delta against its captured baseline
- [ ] CHK-028 [P1] Every consumer of every renamed symbol resolves, through the new name or an explicit alias
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Containment is `algorithmic`; the two pattern anchors are `class-of-bug`; the renames are `cross-consumer`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed — the `startsWith` scan and the bare-specifier scan both run over their full populations, not just the cited files.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — including markdown, because pattern assets and documentation quote these names.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases — the 25-row containment matrix is that table.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — {5 sites} × {5 cases} = 25.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — containment sites read the working directory and environment-derived roots; verified under a changed cwd.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — one commit per unit gives each a pinned range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented — the hub identifier is allowlisted and contained; empty, absolute, separator-containing and `..`-containing values are rejected
- [ ] CHK-032 [P1] Auth/authz working correctly — N/A; containment is the security property here and is covered above
- [ ] CHK-033 [P0] Every containment site rejects a sibling directory sharing a prefix and a symlinked ancestor, proven by test rather than by argument
- [ ] CHK-034 [P1] Case-insensitive-filesystem behaviour of the containment check is defined and tested
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate — each decision's durable reason recorded in place, with no artifact pointer
- [ ] CHK-042 [P2] README updated (if applicable) — no README is touched by this child
- [ ] CHK-043 [P0] The entrypoint's residual line count stated honestly against the 400-line guideline, recorded as an accepted intermediate state rather than claimed closed
- [ ] CHK-044 [P1] Every compatibility alias documented with a removal condition
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P1] Pre-move compiled-routing output copies removed after byte parity is confirmed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 0/22 |
| P1 Items | 19 | 0/19 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable) — the alias removal conditions are that path
- [ ] CHK-104 [P0] The rebuild-before-runtime-verification rule is recorded and followed in both the forward and rollback procedures
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time targets met (NFR-P01) — any containment site on a hot path has its `realpath` call rate measured, and the resolved root is cached where the call is per-request
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02) — MCP startup wall-clock measured before and after the extractions
- [ ] CHK-112 [P2] Load testing completed — N/A
- [ ] CHK-113 [P2] Performance benchmarks documented — startup timings recorded per extraction
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested — a unit-level revert exercised, with a rebuild before re-verification
- [ ] CHK-121 [P0] Feature flag configured (if applicable) — compatibility aliases serve this role for renames
- [ ] CHK-122 [P1] Monitoring/alerting configured — N/A; the startup smoke and package gates are the signal
- [ ] CHK-123 [P1] Runbook created — the containment test matrix and the move-simulation test are reusable
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed — covering all five containment sites and the hub-identifier allowlist
- [ ] CHK-131 [P1] Dependency licenses compatible — no new dependency beyond the shared containment helper
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed — path traversal is the relevant class and is covered by the 25-row matrix
- [ ] CHK-133 [P2] Data handling compliant with requirements — no schema or stored data changed
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable) — every renamed export documented with its alias and removal condition
- [ ] CHK-142 [P2] User-facing documentation updated — the pattern asset's examples reference the new names
- [ ] CHK-143 [P2] Knowledge transfer documented — the containment matrix and the shared-helper import path recorded for reuse
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
| Operator | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
