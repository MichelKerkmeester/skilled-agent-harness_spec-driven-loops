---
title: "Verification Checklist: Fleet-Wide Routing Consistency (3-tier standard)"
description: "Verification checklist for the fleet routing-consistency packet. The route-gold slice items are verified with evidence; convergence and fleet-verification items remain open."
trigger_phrases:
  - "fleet routing consistency checklist"
  - "route-gold verification checklist"
  - "3-tier standard checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/001-3-tier-consistency-standard"
    last_updated_at: "2026-07-17T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Route-gold gate full-fix: 7/7 hubs PASS (91 scenarios), pushed to v4"
    next_safe_action: "REQ-001 harness de-skill-specific + REQ-002 convergence, then REQ-006 fleet verification"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 45
    open_questions:
      - "REQ-006 fleet verification (mutation/blind-holdout/live-mode) not yet run"
    answered_questions:
      - "Route-gold reconciliation ratified as FULL-FIX hub-by-hub, done for all 7 hubs"
---
# Verification Checklist: Fleet-Wide Routing Consistency (3-tier standard)

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

- [x] CHK-001 [P0] Route-gold gate semantics documented in `plan.md` (exact mode set + exact leaf set)
- [x] CHK-002 [P0] Anti-circularity rule defined: derive from prose, fix router, then set gold `intent-derived`
- [x] CHK-003 [P1] Fan-out brief validated on mcp-tooling before the concurrent dispatch `13/13`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every added leaf resource path exists on disk (no phantoms) `disk-checked`
- [x] CHK-011 [P0] Each `leaf-manifest.json` byte-stable after the router fix `byte-stable`
- [ ] CHK-012 [P1] REQ-004 tier-shape validator enforces the per-tier delta
- [ ] CHK-013 [P1] REQ-002 one canonical router shape across all 49 units
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Route-gold gate PASS on a clean committed tree `7/7 hubs`
- [x] CHK-021 [P0] Full fleet route-gold sweep `91 scenarios, 0 violations`
- [ ] CHK-022 [P1] REQ-006 mutation test proves recall drops on corruption
- [ ] CHK-023 [P1] REQ-006 blind independently-authored holdout + live-mode with precision
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each blocked hub classified: stale gold vs genuine router defect vs frontmatter/prose mismatch `three classes`
- [x] CHK-FIX-002 [P0] Over-emission root cause fixed by removing the generic catch-all class from specialized modes `catch-all removal`
- [x] CHK-FIX-003 [P0] Frontmatter intent corrected to the scenario's own prose where they disagreed `prose is source of truth`
- [ ] CHK-FIX-004 [P1] REQ-001 shared harness de-skill-specified so every tier scores identically
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No shared benchmark/scorer machinery edited in this slice `scope-locked`
- [x] CHK-031 [P1] No git history rewritten; each hub fix landed as its own commit `per-hub commits`
- [ ] CHK-032 [P2] Advisor `skill-graph.json` uniform fleet coverage (REQ-007)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks synchronized on the shipped slice and staged remainder `docs synced`
- [x] CHK-041 [P1] Route-gold result table records verdict, counts, and commit per hub `result table`
- [ ] CHK-042 [P2] Reference doc updated once convergence lands
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No task-created residue outside the packet folder `scope clean`
- [x] CHK-051 [P1] Fixes confined to each owned hub's routing artifacts `hub-local`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 10 | 5/10 |
| P2 Items | 3 | 0/3 |

**Verification Date**: 2026-07-17
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`
- [x] CHK-101 [P1] The route-gold reconciliation decision recorded with status Accepted `ADR-001`
- [ ] CHK-102 [P1] Per-tier delta validator documented (REQ-004)
- [ ] CHK-103 [P2] Full convergence migration path documented
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Live-mode routing quality measured with precision, not just recall (REQ-006)
- [ ] CHK-111 [P1] Confusion matrices reported for the blind holdout (REQ-006)
- [ ] CHK-112 [P2] Aggregate scores tracked per hub over time
- [ ] CHK-113 [P2] Benchmark runtime tracked as unit count grows
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback documented: revert the offending hub commit (hub-local, no shared edits) `plan.md rollback`
- [x] CHK-121 [P1] Working tree clean; all slice commits pushed to `skilled/v4.0.0.0`
- [ ] CHK-122 [P2] CI freshness gate regenerates and diffs every manifest (REQ-005)
- [ ] CHK-123 [P2] Committed baselines refreshed by the CI gate (REQ-005)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Independent honesty re-verification run per returned agent `finding = hypothesis`
- [ ] CHK-131 [P1] Oracle circularity retired by live measurement (3-model finding, REQ-006)
- [ ] CHK-132 [P2] Non-router units documented rather than forced into a false surface
- [ ] CHK-133 [P2] Advisor scorer treats every tier identically (REQ-007)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All packet spec documents reconciled to the actual shipped state `docs reconciled`
- [ ] CHK-141 [P1] Convergence and verification results documented when they land
- [ ] CHK-142 [P2] Per-tier authoring guide published for new units
- [ ] CHK-143 [P2] Knowledge transfer for the de-skill-specified harness
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Ratifier (full-fix, not gold-only) | Approved | 2026-07-17 |
| claude-code | Executor + independent verifier | Approved (route-gold slice) | 2026-07-17 |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - route-gold slice verified with evidence; convergence and fleet-verification items open.
-->
