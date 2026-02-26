---
title: "Feature Specification: Sprint 2 — Scoring Calibration"
description: "Resolve dual scoring magnitude mismatch, add cold-start boost, embedding cache, and investigate double intent weighting."
trigger_phrases:
  - "sprint 2"
  - "scoring calibration"
  - "embedding cache"
  - "cold-start boost"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Sprint 2 — Scoring Calibration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-26 |
| **Branch** | `140-hybrid-rag-fusion-refinement` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 3 of 8 |
| **Predecessor** | ../002-sprint-1-graph-signal-activation/ |
| **Successor** | ../004-sprint-3-query-intelligence/ |
| **Handoff Criteria** | Cache hit >90%, N4 dark-run passes, G2 resolved, score distributions normalized to [0,1] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 3** of the Hybrid RAG Fusion Refinement specification.

**Scope Boundary**: Sprint 2 scope boundary — scoring calibration. Resolves the 15:1 magnitude mismatch between RRF and composite scoring, adds embedding cache for instant rebuild, introduces cold-start boost for new memory visibility, and investigates the G2 double intent weighting anomaly.

**Dependencies**:
- Sprint 1 exit gate MUST be passed (R4 MRR@5 delta >+2%, edge density measured)
- R13-S1 eval infrastructure operational (Sprint 0 deliverable)

**Deliverables**:
- Embedding cache for instant rebuild (R18)
- Cold-start boost with exponential decay (N4)
- G2 double intent weighting resolution
- Score normalization — both RRF and composite in [0,1]
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The dual scoring systems have a ~15:1 magnitude mismatch — RRF fusion scores range ~[0, 0.07] while composite scores range ~[0, 1]. This means composite scoring dominates purely due to scale, not quality, making the RRF fusion contribution nearly invisible. New memories are systematically invisible because FSRS temporal decay penalizes recent items (designed for spaced repetition, not retrieval). Re-indexing unchanged content requires full embedding regeneration, wasting API costs and time. Additionally, the G2 double intent weighting anomaly — where intent weights are applied twice in the pipeline — has unknown status (bug or intentional design).

### Purpose

Calibrate the scoring pipeline so both systems contribute proportionally to final ranking, ensure newly indexed memories are discoverable within 48 hours, eliminate unnecessary embedding regeneration costs, and resolve the G2 anomaly to prevent silent scoring distortion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R18**: Embedding cache — `embedding_cache` table with content_hash + model_id key for instant rebuild
- **N4**: Cold-start boost — exponential decay (`0.15 * exp(-elapsed_hours / 12)`) behind feature flag `SPECKIT_NOVELTY_BOOST`
- **G2**: Double intent weighting investigation — determine if bug or intentional design, fix or document
- **Score normalization**: Both RRF and composite scoring output normalized to [0,1] range

### Out of Scope

- R1 (MPAB chunk aggregation) — Sprint 4 scope
- R11 (learned relevance feedback) — Sprint 4 scope; requires R13 2 eval cycles
- R15 (query complexity router) — Sprint 3 scope
- Pipeline refactoring — Sprint 5 scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `embedding_cache` table | Create | R18: Cache table in primary DB |
| `composite-scoring.ts` | Modify | N4: Cold-start boost + score normalization |
| `hybrid-search.ts` | Modify | G2: Double intent weighting investigation/fix |
| `rrf-fusion.ts` | Modify | Score normalization to [0,1] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S2-001 | **R18**: Embedding cache with content_hash + model_id key | Cache hit rate >90% on re-index of unchanged content |
| REQ-S2-002 | **N4**: Cold-start boost with exponential decay (12h half-life) behind `SPECKIT_NOVELTY_BOOST` flag | New memories (<48h) surface when relevant; dark-run passes (old results not displaced) |
| REQ-S2-003 | **G2**: Double intent weighting investigation and resolution | Resolved: fixed (if bug) or documented as intentional design with rationale |
| REQ-S2-004 | Score normalization — both RRF and composite in [0,1] | Both scoring systems produce outputs in [0,1] range; 15:1 mismatch eliminated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Embedding cache hit rate >90% on re-index of unchanged content
- **SC-002**: N4 dark-run passes — new memories visible, highly relevant older results not displaced
- **SC-003**: G2 resolved — either fixed or documented as intentional with rationale
- **SC-004**: Score distributions normalized — both RRF and composite in [0,1] range
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | N4 conflicts with FSRS temporal decay — double-penalizing or double-boosting | Medium | Apply N4 BEFORE FSRS; verify no interaction with cap at 0.95 |
| Risk | G2 is intentional design — fixing it changes ranking behavior | Medium | Dark-run before/after comparison; document decision with evidence |
| Risk | R18 cache invalidation — stale embeddings used after content change | Low | Cache key includes content_hash; any content change = cache miss |
| Risk | Score normalization changes ranking order | Medium | Dark-run comparison; verify MRR@5 not regressed |
| Dependency | Sprint 1 exit gate | Blocking | Sprint 1 must pass before Sprint 2 begins |
| Dependency | R13-S1 eval infrastructure | Required | Needed for dark-run comparisons |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: R18 cache lookup adds <1ms p95 to re-index path
- **NFR-P02**: N4 cold-start computation adds <2ms p95 to search (dark-run overhead budget)
- **NFR-P03**: Score normalization adds negligible overhead (<1ms)

### Security
- **NFR-S01**: Embedding cache stores only content_hash (not raw content) — no sensitive data duplication
- **NFR-S02**: N4 behind feature flag `SPECKIT_NOVELTY_BOOST` — disabled by default

### Reliability
- **NFR-R01**: Cache miss = normal embedding generation (graceful fallback)
- **NFR-R02**: N4 disabled state = no behavior change from pre-Sprint-2
- **NFR-R03**: G2 fix/documentation does not break existing 158+ tests
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **R18 content_hash collision**: Astronomically unlikely with SHA-256; if occurs, embedding regenerated (correct but wasteful)
- **N4 memory exactly 48h old**: Boost = `0.15 * exp(-48/12)` = ~0.0028 — effectively zero; smooth transition
- **N4 + constitutional memory**: Constitutional tier guarantee applied AFTER N4; no conflict

### Error Scenarios
- **R18 cache table missing**: Embedding regeneration proceeds normally; no search impact
- **N4 memory with unknown creation time**: Default to no boost (elapsed_hours = infinity)
- **G2 removal causes ranking regression**: Roll back G2 fix; document as intentional design

### State Transitions
- **R18 model_id change**: All cache entries for old model are misses; gradual replacement
- **N4 flag toggled mid-search**: In-progress search completes with flag state at query start
- **Score normalization applied retroactively**: Only affects live scoring; historical R13 metrics use original scales (documented)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 4 files, 1 new table, 3 independent features |
| Risk | 8/25 | N4/FSRS interaction needs care; G2 outcome uncertain |
| Research | 6/20 | R18 schema defined in research; N4 formula specified; G2 needs investigation |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-S2-001**: G2 double intent weighting — is it a bug or intentional design? Sprint 2 investigation will resolve this.
- **OQ-S2-002**: N4 interaction with FSRS — does the cold-start boost correctly complement (not conflict with) temporal decay? Requires empirical verification via dark-run.
- **OQ-S2-003**: Score normalization method — linear scaling vs. min-max vs. z-score? Research recommends linear to [0,1] but empirical comparison may be needed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Parent Plan**: See `../plan.md`
- **Predecessor**: See `../002-sprint-1-graph-signal-activation/`

---

<!--
LEVEL 2 SPEC — Phase 3 of 8
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 2: Scoring calibration — R18 cache, N4 cold-start, G2 investigation, normalization
- Off-ramp: Recommended minimum viable stop after Sprint 2+3 (phases 3+4)
-->
