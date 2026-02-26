---
title: "Verification Checklist: Sprint 2 — Scoring Calibration"
description: "Verification checklist for Sprint 2: embedding cache, cold-start boost, G2 investigation, score normalization"
trigger_phrases:
  - "sprint 2 checklist"
  - "scoring calibration checklist"
  - "embedding cache checklist"
importance_tier: "important"
contextType: "implementation"
---
# Verification Checklist: Sprint 2 — Scoring Calibration

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

- [ ] CHK-001 [P0] Sprint 1 exit gate verified as passed
- [ ] CHK-002 [P1] R18 cache schema reviewed: `embedding_cache (content_hash, model_id, embedding, dimensions, created_at, last_used_at)`
- [ ] CHK-003 [P1] N4 formula confirmed: `0.15 * exp(-elapsed_hours / 12)`
- [ ] CHK-004 [P1] G2 double intent weighting code location identified in `hybrid-search.ts`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P1] R18 cache hit >90% on unchanged content re-index
- [ ] CHK-011 [P1] N4 dark-run passes — new memories visible when relevant, old results not displaced
- [ ] CHK-012 [P1] G2 resolved: fixed (if bug) or documented as intentional design with rationale
- [ ] CHK-013 [P1] Score distributions normalized to [0,1] — 15:1 magnitude mismatch eliminated
- [ ] CHK-014 [P1] N4 formula has no conflict with FSRS temporal decay — applied BEFORE FSRS, capped at 0.95
- [ ] CHK-015 [P2] N4 feature flag `SPECKIT_NOVELTY_BOOST` defaults to disabled
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] 8-12 new tests added and passing
- [ ] CHK-021 [P0] 158+ existing tests still pass after all changes
- [ ] CHK-022 [P1] R18 cache hit/miss paths tested (content_hash match, model_id match, both)
- [ ] CHK-023 [P1] N4 boost values tested at key timestamps: 0h, 12h, 24h, 48h, >48h
- [ ] CHK-024 [P1] Score normalization tested — both RRF and composite produce values in [0,1]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] R18 stores only content_hash (not raw content) — no sensitive data duplication
- [ ] CHK-031 [P1] `embedding_cache` migration follows protocol: backup, nullable defaults, atomic execution
- [ ] CHK-032 [P2] Cache eviction policy defined (or documented as future work)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized and reflect final implementation
- [ ] CHK-041 [P1] G2 investigation outcome documented with evidence
- [ ] CHK-042 [P2] R18 cache schema and eviction strategy documented for future reference
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Sprint 2 findings saved to memory/
<!-- /ANCHOR:file-org -->

---

## Sprint 2 Exit Gate

- [ ] CHK-060 [P1] R18 embedding cache hit rate >90% on re-index of unchanged content
- [ ] CHK-061 [P1] N4 dark-run: new memories (<48h) surface when relevant without displacing highly relevant older results
- [ ] CHK-062 [P1] G2 double intent weighting resolved — fixed or documented as intentional
- [ ] CHK-063 [P1] Score distributions normalized — both RRF and composite in [0,1] range
- [ ] CHK-064 [P1] `embedding_cache` migration follows protocol (backup, nullable, atomic)
- [ ] CHK-065 [P1] No MRR@5 regression after normalization change

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 3 | [ ]/3 |
| P1 Items | 17 | [ ]/17 |
| P2 Items | 4 | [ ]/4 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — Phase 3 of 8
Sprint 2 exit gate items are P1 (sprint priority is P1)
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Off-ramp: Recommended minimum viable stop after Sprint 2+3 (phases 3+4)
-->
