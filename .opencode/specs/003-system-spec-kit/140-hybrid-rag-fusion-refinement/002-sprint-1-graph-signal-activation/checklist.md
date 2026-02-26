---
title: "Verification Checklist: Sprint 1 — Graph Signal Activation"
description: "Verification checklist for Sprint 1: R4 typed-degree channel, edge density, agent UX"
trigger_phrases:
  - "sprint 1 checklist"
  - "graph signal checklist"
  - "R4 checklist"
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist: Sprint 1 — Graph Signal Activation

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] CHK-001 [P0] Sprint 0 exit gate verified as passed
- [ ] CHK-002 [P0] R4 formula and edge type weights confirmed from research
- [ ] CHK-003 [P1] `causal_edges` table structure verified and queryable
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] R4 dark-run: no single memory appears in >60% of results
- [ ] CHK-011 [P0] R4 MRR@5 delta >+2% absolute over Sprint 0 baseline
- [ ] CHK-012 [P1] Constitutional memories excluded from degree boost
- [ ] CHK-013 [P1] MAX_TYPED_DEGREE cached and refreshed on graph mutation (not per-query)
- [ ] CHK-014 [P1] Degree scores capped at DEGREE_BOOST_CAP=0.15
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] 6-10 new tests added and passing
- [ ] CHK-021 [P0] 158+ existing tests still pass
- [ ] CHK-022 [P1] Degree SQL tested against known edge data (expected scores verified)
- [ ] CHK-023 [P1] Normalization output verified in [0, 0.15] range
- [ ] CHK-024 [P1] Cache invalidation tested (stale after mutation, fresh after recompute)
- [ ] CHK-025 [P1] NFR-P01: R4 degree computation adds <10ms p95 to search latency — measured
- [ ] CHK-026 [P1] NFR-R02: R4 gracefully returns 0 when memory has zero edges (no errors thrown)
- [ ] CHK-027 [P1] Co-activation boost strength (A7) — effective contribution >=15% at hop 2 verified in dark-run
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] R4 behind feature flag `SPECKIT_DEGREE_BOOST` — disabled by default
- [ ] CHK-031 [P1] No degree boost applied to constitutional tier memories
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized and reflect final implementation
- [ ] CHK-041 [P1] Edge density measurement and R10 escalation decision documented
- [ ] CHK-042 [P2] R4 formula and parameters documented for future reference
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Sprint 1 findings saved to memory/
<!-- /ANCHOR:file-org -->

---

## Sprint 1 Exit Gate

- [ ] CHK-060 [P0] R4 MRR@5 delta >+2% absolute — verified via R13 eval metrics
- [ ] CHK-061 [P0] No single memory >60% presence in dark-run results
- [ ] CHK-062 [P0] Edge density measured; R10 escalation decision made if density < 0.5
- [ ] CHK-063 [P1] G-NEW-2 consumption instrumentation active and logging patterns
- [ ] CHK-064 [P1] Feature flag `SPECKIT_DEGREE_BOOST` permanently enabled (or disable-decision documented)

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | [ ]/8 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — Phase 2 of 8
Sprint 1 exit gate items are P0 HARD BLOCKERS
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
