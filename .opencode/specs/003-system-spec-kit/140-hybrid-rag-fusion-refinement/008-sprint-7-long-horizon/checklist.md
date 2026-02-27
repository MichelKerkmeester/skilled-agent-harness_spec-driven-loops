---
title: "Verification Checklist: Sprint 7 — Long Horizon"
description: "Verification checklist for Sprint 7: memory summaries, content generation, entity linking, full reporting, R5 INT8 evaluation"
trigger_phrases:
  - "sprint 7 checklist"
  - "long horizon checklist"
  - "sprint 7 verification"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Sprint 7 — Long Horizon

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

- [ ] CHK-001 [P0] Sprint 6a exit gate verified — graph deepening complete (depends on S6a only, not S6b)
- [ ] CHK-002 [P1] Scale gate measured for R8: `SELECT COUNT(*) FROM memories WHERE status != 'archived' AND embedding IS NOT NULL` — result documented; R8 activates only if result >5K
- [ ] CHK-002a [P1] "5K memories" definition confirmed: active (non-archived) memories with embeddings only — draft and archived do not count
- [ ] CHK-002b [P1] S5 scale gate measured: active memory count (>1K threshold) and verified entity count (>50 threshold) — S5 activates only if either threshold met; document measured values
- [ ] CHK-003 [P1] Gating criteria measured: search latency p95 and embedding dimensions for R5
- [ ] CHK-004 [P1] Prior sprint feature flags inventoried for sunset audit — evidence: flag inventory list
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P1] R13-S3 full reporting dashboard implemented — evidence: dashboard renders per-sprint and per-channel metrics
- [ ] CHK-011 [P1] R13-S3 ablation study framework functional — evidence: ablation run shows per-channel Recall@20 delta
- [ ] CHK-012 [P3] R8 gating condition correctly evaluated (>5K active memories with embeddings) — evidence: scale gate query result matches implementation gate check
- [ ] CHK-012a [P3] R8 latency impact validated: p95 search latency remains <500ms with pre-filter enabled — evidence: latency measurement before/after
- [ ] CHK-013 [P3] S1 content extraction improvements implemented — evidence: >=10 before/after content samples reviewed; >=8/10 show improvement
- [ ] CHK-014 [P3] S5 entity linking coordinates with R10 output (if scale threshold met) — evidence: only verified entities (FP <20%) included in cross-document links; S5 scale gate (>1K memories OR >50 entities) verified; if R10 FP rate not confirmed, verify S5 restricted to manually verified entities only
- [ ] CHK-015 [P3] R5 decision documented with measured activation criteria — evidence: memory count, latency, dimensions recorded with go/no-go decision
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P1] R13-S3 full reporting operational — verified via test run
- [ ] CHK-021 [P1] R13-S3 ablation study framework functional — verified via test ablation
- [ ] CHK-022 [P3] R8 gating verified: only implemented if >5K memories
- [ ] CHK-023 [P3] S1 content generation quality improved (manual review)
- [ ] CHK-024 [P3] S5 entity links established across documents (if scale threshold met)
- [ ] CHK-025 [P3] R5 decision documented with activation criteria
- [ ] CHK-026 [P1] All existing tests still pass after all changes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P3] R5 INT8 uses custom quantized BLOB (NOT `vec_quantize_i8`) — if implemented
- [ ] CHK-031 [P3] R5 preserves KL-divergence calibration from Spec 140 — if implemented
- [ ] CHK-032 [P2] R13-S3 ablation framework does not interfere with production retrieval
- [ ] CHK-033 [P2] S5 entity linking gated behind `SPECKIT_ENTITY_LINKING` feature flag — evidence: flag disabled = no entity linking behavior
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized and reflect final implementation
- [ ] CHK-041 [P2] R5 decision documented with measured criteria and rationale
- [ ] CHK-042 [P2] Program completion documented — all sprints summarized
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Sprint 7 findings saved to memory/
<!-- /ANCHOR:file-org -->

---

## Program Completion Gate

> **Note:** Sprint 7 is entirely optional (P2/P3 gated). The true program completion gate is Sprint 6 (graph deepening). Sprint 7 items activate only when gating criteria are met (>5K memories for R8, activation thresholds for R5). R13-S3 full reporting is the capstone of the evaluation infrastructure established in Sprint 1.

- [ ] CHK-060 [P1] R13-S3 full reporting operational — capstone of Sprint 1 eval infrastructure; evidence: test run shows per-sprint metrics
- [ ] CHK-061 [P1] R13-S3 ablation study framework functional — evidence: test ablation isolates >=1 channel contribution
- [ ] CHK-062 [P2] R8 gating verified: only implemented if >5K active memories with embeddings — evidence: scale gate query result documented
- [ ] CHK-062a [P2] R8 latency constraint verified: p95 <500ms with pre-filter active — evidence: measured latency values
- [ ] CHK-063 [P2] S1 content generation quality improved (manual review of >=10 samples) — evidence: before/after comparison documented
- [ ] CHK-064 [P2] S5 entity links established across documents (if scale threshold met: >1K memories OR >50 entities) — evidence: >=3 cross-document links in integration test; if threshold not met, document as skipped with measured values
- [ ] CHK-065 [P2] R5 decision documented with measured activation criteria (memory count, latency, dimensions) — evidence: decision doc with values
- [ ] CHK-066 [P2] Program completion: all health dashboard targets reviewed — evidence: dashboard screenshot or metric summary
- [ ] CHK-067 [P2] Feature flag sunset audit: all sprint-specific flags (Sprints 0-7) inventoried; temporary flags retired or justified — evidence: final flag inventory list with survivor justifications
- [ ] CHK-067a [P2] Zero sprint-specific temporary flags active at program completion — evidence: final flag count confirmed

---

<!-- ANCHOR:pageindex-xrefs -->
## PageIndex Cross-References

- [ ] CHK-PI-S7-001 [P2] PageIndex cross-references from Sprints 0, 5 reviewed and integrated
  - PI-A5 verify-fix-verify pattern considered for long-horizon quality monitoring
  - PI-B1 tree thinning approach applied to R8 summary generation and R13-S3 traversal
<!-- /ANCHOR:pageindex-xrefs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 1 | [ ]/1 |
| P1 Items | 15 | [ ]/15 |
| P2 Items | 14 | [ ]/14 |
| P3 Items | 11 | [ ]/11 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — Phase 8 of 8 (FINAL)
Program completion gate items
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Final sprint — includes program completion and flag sunset audit
-->
