---
title: "Feature Specification: Sprint 7 — Long Horizon"
description: "Address scale-dependent features (memory summaries, content generation, entity linking), complete evaluation infrastructure, and evaluate INT8 quantization."
trigger_phrases:
  - "sprint 7"
  - "long horizon"
  - "memory summaries"
  - "entity linking"
  - "R5 evaluation"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: Sprint 7 — Long Horizon

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2-P3 |
| **Status** | Draft |
| **Created** | 2026-02-26 |
| **Branch** | `140-hybrid-rag-fusion-refinement` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 8 of 8 |
| **Predecessor** | ../007-sprint-6-graph-deepening/ |
| **Successor** | None (final phase) |
| **Handoff Criteria** | N/A (program completion) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 8** of the Hybrid RAG Fusion Refinement specification.

**Scope Boundary**: Sprint 7 scope boundary — final sprint addressing scale-dependent optimizations, evaluation infrastructure completion, and deferred-item decisions. All items are parallelizable with no internal dependencies.

**Dependencies**:
- Sprint 6 graph deepening complete (007-sprint-6-graph-deepening)
- Evaluation infrastructure operational (from Sprint 0, enhanced in Sprint 4)
- Full pipeline operational (from Sprint 5 refactor)

**Deliverables**:
- Memory summary generation gated on >5K memories (R8)
- Smarter memory content generation from markdown (S1)
- Cross-document entity linking (S5)
- Full reporting + ablation study framework (R13-S3)
- R5 INT8 quantization evaluation decision
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Memory summaries are only valuable at scale (>5K memories) — implementing them prematurely adds overhead without benefit. Content generation from markdown is suboptimal, producing lower-quality memory content than possible. Cross-document entity links are absent, limiting the graph's ability to connect related concepts across documents. The R13 evaluation infrastructure lacks ablation studies and full reporting, making it difficult to attribute improvements to specific changes. The R5 INT8 quantization decision was deferred pending scale data — a final evaluation is needed.

### Purpose

Address scale-dependent optimizations that become valuable at maturity, complete the evaluation infrastructure with full reporting and ablation capabilities, and make the final deferred R5 INT8 quantization decision based on measured criteria.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R8**: Memory summaries (gated on >5K memories) behind `SPECKIT_MEMORY_SUMMARIES` flag — summary pre-filtering reduces search space
- **S1**: Smarter memory content generation from markdown — improved content quality
- **S5**: Cross-document entity linking — entity links established across documents
- **R13-S3**: Full reporting + ablation studies — complete evaluation capability
- **R5**: Evaluate INT8 quantization need — decision documented based on activation criteria

### Out of Scope

- R8 implementation if <5K memories — gated condition not met
- R5 INT8 implementation unless activation criteria met (>10K memories OR >50ms latency OR >1536 dimensions)
- New retrieval channels — all channel work completed in prior sprints
- Pipeline architecture changes — completed in Sprint 5

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Summary generation module | Create | R8: Memory summary generation with pre-filter integration |
| Content generation handlers | Modify | S1: Smarter content generation from markdown |
| Entity linking module | Create/Modify | S5: Cross-document entity linking |
| Eval infrastructure | Modify | R13-S3: Full reporting dashboard + ablation study framework |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P2 - Optional (can defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S7-004 | **R13-S3**: Full reporting + ablation studies | Complete evaluation capability with ablation framework |

### P3 - Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S7-001 | **R8**: Memory summaries (only if >5K memories) behind `SPECKIT_MEMORY_SUMMARIES` flag | Summary pre-filtering reduces search space |
| REQ-S7-002 | **S1**: Smarter memory content generation from markdown | Content quality improved (manual review) |
| REQ-S7-003 | **S5**: Cross-document entity linking | Entity links established across documents |
| REQ-S7-005 | **R5**: Evaluate INT8 quantization need — implement ONLY if >10K memories OR >50ms latency OR >1536 dimensions | Decision documented with activation criteria |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: R13-S3 full reporting operational — ablation study framework functional
- **SC-002**: R8 gating verified — only implemented if >5K memories
- **SC-003**: S1 content generation quality improved (manual review confirmation)
- **SC-004**: S5 entity links established across documents
- **SC-005**: R5 decision documented with activation criteria measurements
- **SC-006**: Program completion — all health dashboard targets reviewed
- **SC-007**: Final feature flag audit — sunset all sprint-specific flags
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | R8 overhead not justified at small scale | Low | Gated on >5K memories — no implementation cost if threshold not met |
| Risk | S5 overlaps with R10 (auto entity extraction from Sprint 6) | Medium | Coordinate with R10 output — S5 links existing entities, R10 creates them |
| Risk | R5 INT8 quantization may cause 5.32% recall loss | High | Only implement if activation criteria met; use custom quantized BLOB (NOT sqlite-vec's vec_quantize_i8); preserve Spec 140's KL-divergence calibration note |
| Dependency | Sprint 6 graph deepening complete | Blocks Sprint 7 | Sprint 6 exit gate must be passed |
| Dependency | Evaluation infrastructure (Sprint 0/4) | Required for R13-S3 | Must be operational |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: R8 summary pre-filtering must reduce search space (measured reduction in candidate set)
- **NFR-P02**: R5 INT8 quantization only considered if search latency >50ms

### Security
- **NFR-S01**: R5 INT8 quantization must use custom quantized BLOB — NOT sqlite-vec's `vec_quantize_i8`
- **NFR-S02**: R5 must preserve KL-divergence calibration from Spec 140 analysis

### Reliability
- **NFR-R01**: R8 degrades gracefully if memory count drops below 5K after activation
- **NFR-R02**: R13-S3 ablation framework must not interfere with production retrieval
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Memory count <5K**: R8 memory summaries skipped entirely (gating condition not met)
- **Memory count >10K OR latency >50ms OR dimensions >1536**: R5 INT8 activation criteria met — proceed with evaluation
- **Zero cross-document entities**: S5 linking returns empty — not a failure if no cross-document entities exist

### Error Scenarios
- **R5 INT8 recall loss >5.32%**: Do not implement — document decision and rationale
- **R13-S3 ablation study with insufficient data**: Defer ablation until sufficient eval cycles accumulated
- **S5 conflicts with R10 entities**: S5 links only verified entities; R10 auto-entities excluded from S5 linking if FP rate unknown

### State Transitions
- **R8 activated then memory count drops below 5K**: Summaries become stale — disable flag, summaries persist but are not regenerated
- **Program completion**: All sprint-specific feature flags audited for sunset
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 5 items but all are independent; moderate LOC per item |
| Risk | 8/25 | R5 recall loss is main risk; other items are low-risk |
| Research | 6/20 | R5 evaluation criteria defined; S5/R8 design straightforward |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-S7-001**: Current memory count — does it exceed 5K threshold for R8 activation?
- **OQ-S7-002**: Current search latency, memory count, and embedding dimensions — do any meet R5 INT8 activation criteria?
- **OQ-S7-003**: How does S5 cross-document entity linking interact with R10 auto-extracted entities from Sprint 6?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Parent Plan**: See `../plan.md`

---

<!--
LEVEL 2 SPEC — Phase 8 of 8 (FINAL)
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 7: Long horizon — scale-dependent optimizations + eval completion
- All items parallelizable
- R5 activation criteria: >10K memories OR >50ms latency OR >1536 dimensions
-->
