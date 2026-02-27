---
title: "Verification Checklist: Sprint 3 — Query Intelligence"
description: "Verification checklist for query complexity routing, RSF evaluation, and channel min-representation."
trigger_phrases:
  - "sprint 3 checklist"
  - "query intelligence checklist"
  - "sprint 3 verification"
importance_tier: "important"
contextType: "implementation"
---
# Verification Checklist: Sprint 3 — Query Intelligence

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

- [ ] CHK-S3-001 [P0] Sprint 2 exit gate verified (predecessor complete)
- [ ] CHK-S3-002 [P0] Requirements documented in spec.md
- [ ] CHK-S3-003 [P0] Technical approach defined in plan.md
- [ ] CHK-S3-004 [P1] Dependencies identified and available (eval infrastructure operational)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-S3-010 [P0] Code passes lint/format checks
- [ ] CHK-S3-011 [P0] No console errors or warnings
- [ ] CHK-S3-012 [P1] Error handling implemented (R15 classifier fallback to "complex")
- [ ] CHK-S3-013 [P1] Code follows project patterns (feature flag gating, pipeline extension)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:sprint-3-verification -->
## Sprint 3 Specific Verification

### R15 — Query Complexity Router
- [ ] CHK-S3-020 [P1] R15 p95 latency for simple queries <30ms
- [ ] CHK-S3-021 [P0] R15 minimum 2 channels even for simple queries (R2 compatibility)
- [ ] CHK-S3-022 [P1] R15 classification accuracy tested with 10+ queries per tier
- [ ] CHK-S3-023 [P1] R15 moderate-tier routing verified (3-4 channels selected)
- [ ] CHK-S3-024 [P1] R15 classifier fallback to "complex" on failure verified
- [ ] CHK-S3-025 [P1] R15+R2 interaction test: R15 minimum 2 channels preserves R2 channel diversity guarantee

### R14/N1 — Relative Score Fusion
- [ ] CHK-S3-030 [P1] R14/N1 shadow comparison: minimum 100 queries executed
- [ ] CHK-S3-031 [P1] Kendall tau computed between RSF and RRF rankings
- [ ] CHK-S3-032 [P1] RSF decision documented (tau <0.4 = reject RSF)
- [ ] CHK-S3-033 [P1] All 3 fusion variants tested (single-pair, multi-list, cross-variant)
- [ ] CHK-S3-034 [P1] **Eval corpus sourcing strategy defined**: 100+ query corpus sourced with stratified tier distribution documented. Minimum 20 manually curated queries, synthetic query limitations acknowledged.
- [ ] CHK-S3-035 [P1] RSF numerical stability: output clamped to [0,1], no overflow on extreme inputs

### R2 — Channel Min-Representation
- [ ] CHK-S3-040 [P1] R2 dark-run: top-3 precision within 5% of baseline
- [ ] CHK-S3-041 [P1] R2 only enforces for channels that returned results
- [ ] CHK-S3-042 [P1] R2 quality floor 0.2 verified (below-threshold results not promoted)

### REQ-S3-004 — Confidence-Based Result Truncation
- [ ] CHK-S3-043 [P1] Score confidence gap detection: truncation triggers when gap between rank N and N+1 exceeds 2x median gap
- [ ] CHK-S3-044 [P1] Minimum 3 results guaranteed regardless of confidence gap
- [ ] CHK-S3-045 [P1] Irrelevant tail results reduced by >30% vs untruncated baseline

### REQ-S3-005 — Dynamic Token Budget Allocation
- [ ] CHK-S3-046 [P1] Simple-tier queries allocated 1500 tokens
- [ ] CHK-S3-047 [P1] Moderate-tier queries allocated 2500 tokens
- [ ] CHK-S3-048 [P1] Complex-tier queries allocated 4000 tokens
- [ ] CHK-S3-049 [P1] Token budget applies to total returned content, not per-result

### Cross-Cutting
- [ ] CHK-S3-027 [P1] Independent flag rollback testing: each of 3 flags (COMPLEXITY_ROUTER, RSF_FUSION, CHANNEL_MIN_REP) can be independently disabled without breaking other features
<!-- /ANCHOR:sprint-3-verification -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-S3-050 [P0] All acceptance criteria met (REQ-S3-001 through REQ-S3-005)
- [ ] CHK-S3-051 [P1] 22-28 new tests passing (600-900 LOC)
- [ ] CHK-S3-052 [P1] Edge cases tested (empty channels, all-empty, classifier failure)
- [ ] CHK-S3-053 [P1] Existing 158+ tests still pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:pageindex-verification -->
## PageIndex Verification

### PI-A2 — Search Strategy Degradation with Fallback Chain [DEFERRED]
> **Deferred from Sprint 3.** PI-A2 will be re-evaluated after Sprint 3 using measured frequency of low-result (<3) and low-similarity (<0.4) query outcomes from Sprint 0-3 data. Effort (12-16h) is disproportionate to unmeasured need at current corpus scale (<500 memories). See UT review R1.

### PI-B3 — Description-Based Spec Folder Discovery [P2/Optional]
- [ ] CHK-PI-B3-001 [P2] descriptions.json generated with one sentence per spec folder derived from spec.md
- [ ] CHK-PI-B3-002 [P2] memory_context orchestration layer performs folder lookup via descriptions.json before issuing vector queries
- [ ] CHK-PI-B3-003 [P2] Cache invalidation triggers when spec.md changes for a given folder
- [ ] CHK-PI-B3-004 [P2] descriptions.json absent = graceful degradation to full-corpus search (no error)
<!-- /ANCHOR:pageindex-verification -->

---

<!-- ANCHOR:off-ramp -->
## Off-Ramp Evaluation

- [ ] CHK-S3-060 [P1] Off-ramp evaluated: MRR@5 >= 0.7
- [ ] CHK-S3-061 [P1] Off-ramp evaluated: constitutional accuracy >= 95%
- [ ] CHK-S3-062 [P1] Off-ramp evaluated: cold-start recall >= 90%
- [ ] CHK-S3-063 [P1] Off-ramp decision documented (continue or stop)
- [ ] CHK-S3-064 [P1] **Sprint 2+3 hard scope cap**: If off-ramp thresholds met, Sprint 4-7 require NEW spec approval. Decision documented with metric evidence from Sprint 0-3 actuals. **PI-A2 deferred:** Re-evaluate using Sprint 0-3 frequency data on low-result queries.
<!-- /ANCHOR:off-ramp -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-S3-070 [P1] Spec/plan/tasks synchronized
- [ ] CHK-S3-071 [P1] Code comments adequate
- [ ] CHK-S3-072 [P1] Feature flags documented

## Feature Flag Audit

- [ ] CHK-S3-073 [P1] **Feature flag count**: Active feature flag count at Sprint 3 exit is ≤6. Evidence: list active flags and count.
  - Expected at Sprint 3 exit: `SPECKIT_COMPLEXITY_ROUTER`, `SPECKIT_RSF_FUSION`, `SPECKIT_CHANNEL_MIN_REP` (plus up to 3 from prior sprints)
- [ ] CHK-S3-074 [P1] **Flag sunset decisions documented**: Any flag retired or consolidated has metric evidence supporting the decision recorded.
- [ ] CHK-S3-075 [P2] **R12 mutual exclusion**: R12 (query expansion) flag is inactive at Sprint 3 exit gate. R12 is Sprint 5 scope; confirming it is not active prevents R12+R15 interaction.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-S3-080 [P1] Temp files in scratch/ only
- [ ] CHK-S3-081 [P1] scratch/ cleaned before completion
- [ ] CHK-S3-082 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | [ ]/7 |
| P1 Items | 40 | [ ]/40 |
| P2 Items | 6 | [ ]/6 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — Phase 4 of 8
Sprint 3: Query Intelligence
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
