---
title: "Verification Checklist: Bi-temporal Window for Spec-Kit Memory Causal + Lineage"
description: "P0/P1/P2 verification gates for the event-time fact-invalidation spearhead, the additive four-timestamp window, chronology-scoped supersession and the C3-D separation note, skip-closed-in-sweep pre-verified as SHIPPED."
trigger_phrases:
  - "bitemporal window memory checklist"
  - "event-time invalidation checklist"
  - "four timestamp window verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/007-bitemporal-window"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author bi-temporal-window verification checklist from 028/001 research"
    next_safe_action: "Verify CHK items as candidates land"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-007-bitemporal-window"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Bi-temporal Window for Spec-Kit Memory Causal + Lineage

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [x] CHK-002 [P0] Technical approach + sequencing defined in plan.md (spearhead → C3-B → GR-temporal → C3-D)
- [x] CHK-003 [P1] Canonical event-time source decided (lineage) and recorded in decision-record.md
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Typecheck/build passes (`tsc` on mcp_server)
- [x] CHK-011 [P0] No new lint warnings in `temporal-edges.ts` / `contradiction-detection.ts` / `vector-index-schema.ts`
- [ ] CHK-012 [P1] `invalidateEdge()` keeps its fail-open contract (warn, no throw)
- [x] CHK-013 [P1] Additive columns nullable + forward-compatible (unread until a consumer opts in)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Spearhead test: event-time close written (not `now()`), missing event-time falls back to `now()`
- [x] CHK-021 [P0] skip-closed regression: closed generated edge not re-touched (SHIPPED guard reconfirmed)
- [x] CHK-022 [P1] C3-B additivity test: existing `IS NULL` readers byte-identical
- [ ] CHK-023 [P1] Chronology scope test: conflicting pair invalidates earlier `valid_at`, co-valid non-conflicting untouched
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each candidate has a finding class: spearhead = `algorithmic` (wrong-time correctness), C3-B = `schema/matrix`, GR-temporal = `algorithmic`, C3-D = decision note, skip-closed = `instance-only` (SHIPPED).
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'invalid_at = |invalidateEdge|new Date\(\).toISOString' lib/graph lib/causal` (any other site that closes an edge at `now()`).
- [ ] CHK-FIX-003 [P0] Consumer inventory for `invalid_at`/`valid_at`/`valid_from`/`valid_to`/`ingested_at`/`expired_at` across `*.ts` + `*.md` (readers must stay `IS NULL`).
- [ ] CHK-FIX-004 [P0] Reader-transparency invariant: no reader added that compares a temporal column to a clock, adversarial cases (already-closed edge no-op, missing-event-time fallback, fixture-without-column) covered.
- [ ] CHK-FIX-005 [P1] Matrix axes listed: {edge has lineage event-time | not} × {already closed | open} × {conflicting pair | co-valid pair}.
- [ ] CHK-FIX-006 [P1] `SPECKIT_TEMPLATE_EDGES`-on path exercised (flag already ON), confirm the spearhead does not depend on a flip.
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA / explicit diff range (skip-closed pinned to `e1c6a3c793`).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced
- [x] CHK-031 [P0] Temporal columns carry timestamps only - no recalled content surface added
- [x] CHK-032 [P1] No new untrusted-content read path (out of scope, C8 render-escaper is a separate phase)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist/decision-record synchronized
- [x] CHK-041 [P1] C3-D separation-of-concerns note recorded (tombstone-sweep vs temporal-close)
- [ ] CHK-042 [P2] Comment hygiene: no spec/packet ids embedded in production comments (keep durable WHY)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | [ ]/11 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: 2026-06-19
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 lineage canonical, ADR-002 retention-TTL excluded, ADR-003 C3-D separation)
- [x] CHK-101 [P1] All ADRs have status (ADR-001/002/003 = Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (causal-projection source, fold-TTL-in, hard-gate skip-closed all scored + rejected)
- [x] CHK-103 [P2] Migration path documented: C3-B columns additive/nullable, forward-compatible
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Spearhead adds no read-path cost (single-site writer change, no new reader, NFR-P01)
- [x] CHK-111 [P2] C3-B additive columns add no required index for the spearhead path
- [x] CHK-112 [P2] No load regression in causal/temporal focused suite
- [x] CHK-113 [P2] Benefit number is structural inference only (no benchmark exists per research §6) - documented, not claimed
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback documented: per-candidate scoped commits, additive columns forward-compatible if writer reverts (plan.md §7)
- [x] CHK-121 [P1] `SPECKIT_TEMPLATE_EDGES` flag already ON, spearhead does not depend on a flip
- [x] CHK-122 [P2] No new monitoring surface introduced (timestamps only)
- [x] CHK-123 [P2] Branch-only, nothing pushed/deployed without explicit user go
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] No new untrusted-content read path (C8 render-escaper is a separate phase)
- [x] CHK-131 [P2] No new external dependency / license surface
- [x] CHK-132 [P2] Temporal columns carry timestamps only - no PII / content
- [x] CHK-133 [P2] Data handling unchanged for non-temporal columns
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] spec/plan/tasks/checklist/decision-record synchronized
- [x] CHK-141 [P1] Candidate status (SHIPPED vs PENDING) consistent across spec §3, tasks Phase 2 and 030 §14 reference
- [x] CHK-142 [P2] C3-D separation note carried into both spec.md REQ-006 and decision-record ADR-003
- [x] CHK-143 [P2] Research citations (file:line + [CONFIRMED]/[INFERRED]) preserved
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Pending] | Memory MCP maintainer | [ ] Approved | |
| [Pending] | 028 packet owner | [ ] Approved | |
| [Pending] | Reviewer (adversarial verify) | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
