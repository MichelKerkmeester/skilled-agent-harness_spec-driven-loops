---
title: "Verification Checklist: Sprint 6 — Graph Deepening"
description: "Verification checklist for Sprint 6: graph centrality, N3-lite consolidation, anchor-aware thinning, entity extraction, spec folder hierarchy"
trigger_phrases:
  - "sprint 6 checklist"
  - "graph deepening checklist"
  - "sprint 6 verification"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Sprint 6 — Graph Deepening

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

- [ ] CHK-001 [P0] Checkpoint created before sprint start
- [ ] CHK-002 [P0] Sprint 5 exit gate verified — pipeline refactor complete
- [ ] CHK-003 [P1] Edge density measured — R10 gating decision documented
- [ ] CHK-004 [P1] Current feature flag count documented (must be <=6 post-sprint)
- [ ] CHK-004a [P0] Algorithm feasibility spike completed — N2c, N3-lite, R10 approaches validated on actual data; quality tier (heuristic vs production) confirmed
- [ ] CHK-004b [P0] weight_history logging verified functional before any N3-lite Hebbian cycle runs — evidence: T001d complete, test confirms before/after weight values logged
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P2] R7 anchor-aware chunk thinning logic implemented and tested — evidence: unit test covers anchor-present vs. anchor-absent chunk scoring
- [ ] CHK-011 [P2] R16 encoding-intent capture behind feature flag — evidence: `encoding_intent` field visible in memory record when `SPECKIT_ENCODING_INTENT=true`
- [ ] CHK-012 [P2] R10 density gating condition correctly evaluated — evidence: density measurement result documented; skip or proceed decision recorded
- [ ] CHK-013 [P2] N2 centrality + community detection algorithms correct — evidence: N2c community assignments stable across 2 runs on same test graph; log cluster sizes
- [ ] CHK-013a [P2] N2c algorithm choice documented: connected-components or Louvain? Justification recorded with graph density data — evidence: decision doc in scratch/ or spec comment
- [ ] CHK-014 [P1] N3-lite edge bounds enforced in code: MAX_EDGES_PER_NODE=20, MAX_STRENGTH_INCREASE=0.05/cycle — evidence: unit test verifies rejection of 21st auto-edge
- [ ] CHK-015 [P1] N3-lite `created_by` provenance tracked for all auto-created/modified edges — evidence: SQL query `SELECT COUNT(*) FROM causal_edges WHERE created_by='auto'` returns expected count
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P2] R7 Recall@20 within 10% of baseline — evidence: eval output showing pre/post Recall@20 scores (task: T003)
- [ ] CHK-021 [P2] R10 false positive rate <20% on manual review of >=50 entities — evidence: review spreadsheet or audit log with entity sample (task: T005)
- [ ] CHK-022 [P2] R10 gating verified: only implemented if density <1.0 — evidence: density measurement documented; if density >=1.0 record skip decision
- [ ] CHK-023 [P2] N2 graph channel attribution >10% of final top-K — evidence: attribution report from eval run showing graph channel contribution percentage (task: T001)
- [ ] CHK-023a [P2] N2c community detection produces stable clusters on test data — evidence: 2 consecutive runs yield <5% membership divergence on same graph (task: T001c)
- [ ] CHK-024 [P2] N3-lite contradiction scan identifies at least 1 known contradiction — evidence: test data includes manually seeded contradicting memory pair; scan output shows detection (task: T002)
- [ ] CHK-025 [P2] 12-18 new tests added and passing — evidence: test count in Vitest output
- [ ] CHK-026 [P1] All existing tests still pass after all changes — evidence: full Vitest suite run with 0 failures
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security & Provenance

- [ ] CHK-030 [P1] N3-lite `created_by` provenance tracked for all auto-created/modified edges
- [ ] CHK-031 [P2] R10 auto-extracted entities tagged with `created_by='auto'`
- [ ] CHK-032 [P2] Auto edges capped at strength=0.5
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized and reflect final implementation
- [ ] CHK-041 [P2] R10 gating decision documented with density measurement
- [ ] CHK-042 [P2] N3-lite implementation details documented (contradiction threshold, decay parameters)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Sprint 6 findings saved to memory/
<!-- /ANCHOR:file-org -->

---

## Sprint 6a Exit Gate

- [ ] CHK-060 [P1] R7 Recall@20 within 10% of baseline — verified via eval metrics; evidence: before/after recall scores recorded
- [ ] CHK-060a [P1] R16 encoding-intent capture functional behind `SPECKIT_ENCODING_INTENT` flag — evidence: `encoding_intent` field populated for test memories
- [ ] CHK-060b [P1] S4 hierarchy traversal functional — evidence: integration test passes for parent-folder retrieval
- [ ] CHK-060c [P1] T001d weight_history logging verified — evidence: before/after weight values logged for test edge modification
- [ ] CHK-063 [P1] N3-lite contradiction detection functional — verified via manually seeded test pair in curated test data
- [ ] CHK-064 [P1] N3-lite edge bounds enforced — MAX_EDGES_PER_NODE=20, MAX_STRENGTH_INCREASE=0.05/cycle; evidence: unit test for boundary rejection
- [ ] CHK-065 [P1] Feature flag sunset audit: list all active flags, retire any no longer needed, document survivors — evidence: flag inventory table in scratch/ or implementation-summary
- [ ] CHK-065a [P1] Active feature flag count <=6 post-audit — evidence: final flag list with count
- [ ] CHK-066 [P1] All health dashboard targets checked — evidence: dashboard screenshot or metric summary

---

## Sprint 6b Exit Gate (conditional on Sprint 6b execution)

- [ ] CHK-070 [P1] Sprint 6b entry gates satisfied — feasibility spike completed, OQ-S6-001 resolved, OQ-S6-002 resolved, REQ-S6-004 revisited
- [ ] CHK-061 [P1] R10 false positive rate <20% — verified via manual review of >=50 entity sample (if implemented)
- [ ] CHK-062 [P1] N2 graph channel attribution >10% of final top-K OR graph density <1.0 documented with deferral decision — evidence: attribution percentage in eval output or density measurement
- [ ] CHK-062a [P1] N2c community assignments stable across 2 runs on test graph with ≥50 nodes — evidence: <5% membership divergence
- [ ] CHK-071 [P1] Active feature flag count <=6 post-Sprint-6b — evidence: final flag list with count
- [ ] CHK-072 [P1] All health dashboard targets checked — evidence: dashboard screenshot or metric summary

---

<!-- ANCHOR:pageindex-xrefs -->
## PageIndex Cross-References

- [ ] CHK-PI-S6-001 [P2] PageIndex cross-references from Sprints 2, 3 reviewed and integrated
  - PI-A1 folder scoring evaluated as pre-filter for graph traversal
  - PI-A2 fallback chain integrated for empty graph query results
<!-- /ANCHOR:pageindex-xrefs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 4 | [ ]/4 |
| P1 Items | 24 | [ ]/24 |
| P2 Items | 18 | [ ]/18 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — Phase 7 of 8
Sprint 6a exit gate items are P1 (exit gates for metric-gated sprint must not be optional)
Sprint 6b exit gate items are P1 (conditional on Sprint 6b execution)
UT-8 amendments: CHK-004a (feasibility spike P0), CHK-004b (weight_history P0), split exit gates
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
