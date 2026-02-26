---
title: "Feature Specification: Sprint 6 — Graph Deepening"
description: "Deepen graph with centrality, community detection, and consolidation. Optimize indexing with anchor-aware thinning, intent capture, and entity extraction."
trigger_phrases:
  - "sprint 6"
  - "graph deepening"
  - "centrality"
  - "consolidation"
  - "entity extraction"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: Sprint 6 — Graph Deepening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-02-26 |
| **Branch** | `140-hybrid-rag-fusion-refinement` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 7 of 8 |
| **Predecessor** | ../006-sprint-5-pipeline-refactor/ |
| **Successor** | ../008-sprint-7-long-horizon/ |
| **Handoff Criteria** | R7 Recall@20 within 10%, R10 FP <20%, N2 attribution >10%, N3-lite contradiction detection, flag count <=6 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 7** of the Hybrid RAG Fusion Refinement specification.

**Scope Boundary**: Sprint 6 scope boundary — graph deepening and indexing optimization sprint. Maximizes graph channel contribution through centrality/community analysis and establishes lightweight consolidation with contradiction scanning, Hebbian strengthening, and staleness detection.

**Dependencies**:
- Sprint 5 pipeline refactor complete (006-sprint-5-pipeline-refactor)
- Evaluation infrastructure operational (from Sprint 0)
- Graph signal established (from Sprint 1/R4)

**Deliverables**:
- Graph centrality + community detection (N2 items 4-6)
- Lightweight consolidation: contradiction scan, Hebbian strengthening, staleness detection (N3-lite)
- Anchor-aware chunk thinning (R7)
- Encoding-intent capture at index time (R16)
- Auto entity extraction gated on density (R10)
- Spec folder hierarchy as retrieval structure (S4)
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Graph signal was established in Sprint 1 (R4) but lacks sophistication — centrality and community structures remain unexploited, leaving graph channel attribution below potential. Chunk indexing is not anchor-aware, leading to suboptimal retrieval granularity. Entity extraction is absent, meaning the graph may be sparse where automatic entity recognition could densify it. No consolidation process exists — stale edges persist, contradictions go undetected, and edge strengths never adapt to usage patterns. The spec folder hierarchy is unused in retrieval despite being a natural organizational structure.

### Purpose

Maximize graph channel contribution through centrality and community detection, optimize indexing quality with anchor-aware thinning and intent capture, and establish lightweight consolidation to maintain graph health over time.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R7**: Anchor-aware chunk thinning — Recall@20 within 10% of baseline
- **R16**: Encoding-intent capture at index time behind `SPECKIT_ENCODING_INTENT` flag
- **R10**: Auto entity extraction (gated on edge density <1.0) behind `SPECKIT_AUTO_ENTITIES` flag — FP rate <20%
- **N2 (items 4-6)**: Graph centrality + community detection — channel attribution >10%
- **N3-lite**: Contradiction scan (weekly) + Hebbian edge strengthening + staleness detection behind `SPECKIT_CONSOLIDATION` flag
- **S4**: Spec folder hierarchy as retrieval structure — hierarchy traversal functional

### Out of Scope

- Full consolidation (N3 complete) — N3-lite is the scoped subset
- Advanced graph algorithms beyond centrality/community — future optimization
- R10 implementation if density >=1.0 — gated condition not met
- Pipeline architecture changes — completed in Sprint 5

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Graph analysis module | Create/Modify | N2: Centrality + community detection algorithms |
| Consolidation module | Create | N3-lite: Contradiction scan, Hebbian strengthening, staleness detection |
| Indexing pipeline | Modify | R7: Anchor-aware chunk thinning logic |
| Indexing pipeline | Modify | R16: Encoding-intent metadata capture |
| Entity extraction module | Create | R10: Auto entity extraction with density gating |
| Spec-kit retrieval | Modify | S4: Spec folder hierarchy traversal |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P2 - Optional (can defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S6-001 | **R7**: Anchor-aware chunk thinning | Recall@20 within 10% of baseline |
| REQ-S6-002 | **R16**: Encoding-intent capture behind `SPECKIT_ENCODING_INTENT` flag | Intent metadata recorded at index time |
| REQ-S6-003 | **R10**: Auto entity extraction (only if density <1.0) behind `SPECKIT_AUTO_ENTITIES` flag | FP rate <20% on manual review |
| REQ-S6-004 | **N2 (items 4-6)**: Graph centrality + community detection | Graph channel attribution >10% of final top-K |
| REQ-S6-005 | **N3-lite**: Contradiction scan (weekly) + Hebbian edge strengthening behind `SPECKIT_CONSOLIDATION` flag | Detects at least 1 known contradiction in test data |
| REQ-S6-006 | **S4**: Spec folder hierarchy as retrieval structure | Hierarchy traversal functional in retrieval queries |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: R7 Recall@20 within 10% of baseline after anchor-aware thinning
- **SC-002**: R10 false positive rate <20% on manual review (if implemented)
- **SC-003**: N2 graph channel attribution >10% of final top-K results
- **SC-004**: N3-lite contradiction scan identifies at least 1 known contradiction
- **SC-005**: N3-lite edge bounds enforced — MAX_EDGES_PER_NODE=20, MAX_STRENGTH_INCREASE=0.05/cycle
- **SC-006**: Active feature flag count <=6 (sunset audit if exceeded)
- **SC-007**: Sprint 6 exit gate — all requirements verified
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | N3-lite edge mutations potentially irreversible | High | Track `created_by` provenance on all auto-created/modified edges for selective cleanup |
| Risk | R10 false positives may pollute graph with incorrect entities | Medium | Gated on density <1.0; auto entities capped at strength=0.5; `created_by='auto'` tag for selective removal |
| Risk | Feature flag count exceeds 6-flag maximum | Medium | Sunset audit required if exceeded; consolidate or retire flags from earlier sprints |
| Risk | HIGH rollback difficulty (12-20h) | High | Checkpoint recommended before sprint start; `created_by` provenance enables selective rollback |
| Dependency | Sprint 5 pipeline refactor complete | Blocks all Sprint 6 work | Sprint 5 exit gate must be passed |
| Dependency | Evaluation infrastructure (Sprint 0) | Required for metric verification | Must be operational |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: R7 chunk thinning must not degrade Recall@20 by more than 10%
- **NFR-P02**: N3-lite consolidation runs as weekly batch — no impact on query-time latency

### Security
- **NFR-S01**: N3-lite edge mutations tracked with `created_by` provenance for audit trail
- **NFR-S02**: R10 auto-extracted entities tagged with `created_by='auto'` for traceability

### Reliability
- **NFR-R01**: N3-lite edge bounds enforced: MAX_EDGES_PER_NODE=20, auto edges capped at strength=0.5
- **NFR-R02**: N3-lite Hebbian strengthening capped: MAX_STRENGTH_INCREASE=0.05 per cycle, 30-day decay of 0.1
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Edge density >=1.0**: R10 auto entity extraction is skipped entirely (gating condition not met)
- **Zero contradictions found**: N3-lite contradiction scan returns empty — not a failure if no contradictions exist in data
- **MAX_EDGES_PER_NODE reached**: New auto-edges rejected; manual edges still allowed

### Error Scenarios
- **N3-lite weekly job failure**: Consolidation skipped for that cycle; edges remain unchanged; retry next cycle
- **R10 extraction produces >20% FP**: Flag `SPECKIT_AUTO_ENTITIES` disabled; auto entities tagged `created_by='auto'` removed

### State Transitions
- **Partial N3-lite completion**: Each sub-component (contradiction, Hebbian, staleness) is independent — partial completion is valid
- **Sprint checkpoint restore**: All `created_by='auto'` edges can be selectively removed to restore pre-sprint state
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 6 requirements across graph, indexing, entity extraction, and spec-kit subsystems |
| Risk | 14/25 | Irreversible edge mutations, FP pollution, flag count risk, HIGH rollback difficulty |
| Research | 8/20 | Research complete (142 analysis); algorithms identified but implementation details TBD |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-S6-001**: What is the actual edge density after Sprint 1-5? Determines if R10 auto entity extraction is activated.
- **OQ-S6-002**: Which centrality algorithm (betweenness, PageRank, eigenvector) is best suited for the memory graph topology?
- **OQ-S6-003**: What is the optimal contradiction similarity threshold? Spec says >0.85 but may need tuning.
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
LEVEL 2 SPEC — Phase 7 of 8
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 6: Graph deepening + indexing optimization
- Internal phasing: Phase A (Graph) + Phase B (Indexing + Spec-Kit)
-->
