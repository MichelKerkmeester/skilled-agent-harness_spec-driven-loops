---
title: "Feature Specification: Sprint 1 — Graph Signal Activation"
description: "Activate typed-weighted degree as 5th RRF channel and measure graph signal contribution."
trigger_phrases:
  - "sprint 1"
  - "graph signal"
  - "degree channel"
  - "R4"
importance_tier: "critical"
contextType: "implementation"
---
# Feature Specification: Sprint 1 — Graph Signal Activation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-26 |
| **Branch** | `140-hybrid-rag-fusion-refinement` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 2 of 8 |
| **Predecessor** | ../001-sprint-0-epistemological-foundation/ |
| **Successor** | ../003-sprint-2-scoring-calibration/ |
| **Handoff Criteria** | R4 MRR@5 delta >+2% absolute, edge density measured, no single memory >60% presence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 2** of the Hybrid RAG Fusion Refinement specification.

**Scope Boundary**: Sprint 1 scope boundary — graph signal activation. Adds the 5th RRF channel (typed-weighted degree) and measures graph density to inform future sprints.

**Dependencies**:
- Sprint 0 exit gate MUST be passed (graph channel functional, eval infrastructure operational, BM25 baseline recorded)

**Deliverables**:
- Typed-weighted degree computation as 5th RRF channel (R4)
- Edge density measurement from R13 data
- Agent-as-consumer UX analysis and consumption instrumentation (G-NEW-2)
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The graph channel is now functional after Sprint 0's G1 fix, but it contributes only through graph-search results (traversal). The typed-weighted degree score — measuring how well-connected a memory is via causal, derivation, and support edges — is the most orthogonal signal available (low correlation with vector similarity and FTS5). Edge density is unknown, which blocks decisions about whether R10 (auto entity extraction) needs to be escalated to increase graph coverage.

### Purpose

Activate the graph's structural connectivity signal as a 5th RRF channel, measure its contribution to retrieval quality via the Sprint 0 evaluation infrastructure, and establish edge density as a key health metric for future graph-deepening decisions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R4**: Typed-weighted degree as 5th RRF channel with MAX_TYPED_DEGREE=15, MAX_TOTAL_DEGREE=50, DEGREE_BOOST_CAP=0.15, constitutional memory exclusion
- **A7**: Co-activation boost strength increase — raise multiplier from 0.1x to 0.25-0.3x to make graph signal investment visible in results
- **Edge density measurement**: Compute edges/node ratio from R13 eval data
- **G-NEW-2**: Agent-as-consumer UX analysis and consumption instrumentation

### Out of Scope

- R10 (auto entity extraction) — Sprint 6 scope; may be escalated based on density measurement
- N2 (graph centrality + community detection) — Sprint 6 scope
- N3-lite (contradiction scan) — Sprint 6 scope
- Scoring calibration changes — Sprint 2 scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `graph-search-fn.ts` | Modify | R4: Typed-weighted degree computation SQL + normalization |
| `rrf-fusion.ts` | Modify | R4: Integration as 5th RRF channel |
| `hybrid-search.ts` | Modify | R4: Degree score integration into search pipeline |
| `trigger-extractor.ts` | Modify | TM-08: Add CORRECTION and PREFERENCE signal categories |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S1-001 | **R4**: Typed-weighted degree as 5th RRF channel with configurable parameters: MAX_TYPED_DEGREE=15, MAX_TOTAL_DEGREE=50, DEGREE_BOOST_CAP=0.15, constitutional exclusion | R4 dark-run passes — no single memory >60% of results; MRR@5 delta >+2% absolute |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S1-002 | Edge density measurement from R13 eval data | Edge density (edges/node) computed; R10 escalation decision documented if density < 0.5 |
| REQ-S1-003 | **G-NEW-2**: Agent consumption instrumentation + initial UX analysis | Consumption patterns logged; initial pattern report generated |
| REQ-S1-004 | **A7**: Co-activation boost strength increase — raise base multiplier from 0.1x to 0.25-0.3x with configurable coefficient | Graph channel effective contribution >=15% at hop 2 (up from ~5%). Dark-run verified. |

### P2 - Optional (can defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S1-005 | **TM-08**: Expand importance signal vocabulary in `trigger-extractor.ts` — add CORRECTION signals ("actually", "wait", "I was wrong") and PREFERENCE signals ("prefer", "like", "want") from true-mem's 8-category vocabulary | CORRECTION and PREFERENCE signal categories recognised and classified correctly by trigger extractor |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: R4 MRR@5 delta >+2% absolute over Sprint 0 baseline
- **SC-002**: No single memory appears in >60% of R4 dark-run results (hub domination check)
- **SC-003**: Edge density measured and R10 escalation decision recorded
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Graph too sparse (density < 0.5) — R4 has minimal effect | Medium | Escalate R10 to earlier sprint; R4 still correct (returns zero when no edges) |
| Risk | Preferential attachment — well-connected memories dominate via R4 | High | MAX_TOTAL_DEGREE=50 cap, DEGREE_BOOST_CAP=0.15, constitutional exclusion |
| Risk | R4 dark-run fails (MRR@5 delta < +2%) | Medium | Keep R4 behind flag; investigate sparse graph or weight miscalibration |
| Dependency | Sprint 0 exit gate | Blocking | Sprint 0 must pass before Sprint 1 begins |
| Dependency | R13-S1 eval infrastructure | Required | Needed for dark-run measurement and density computation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: R4 degree computation adds <10ms p95 to search latency (dark-run overhead budget)
- **NFR-P02**: Degree cache invalidated only on graph mutation (not per-query)

### Security
- **NFR-S01**: Constitutional memories excluded from degree boost (prevents artificial inflation)

### Reliability
- **NFR-R01**: R4 behind feature flag `SPECKIT_DEGREE_BOOST` — disabled by default
- **NFR-R02**: R4 gracefully returns 0 if graph has no edges for a memory
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Zero edges for a memory**: R4 returns 0 — no boost applied; correct behavior
- **MAX_TOTAL_DEGREE exceeded**: Score capped at DEGREE_BOOST_CAP=0.15 — prevents unbounded boost
- **Constitutional memory with many edges**: Excluded from degree boost to prevent domination

### Error Scenarios
- **Graph DB unavailable**: R4 returns 0 for all memories; other 4 channels continue normally
- **Cache invalidation race**: Stale degree score used — acceptable for short window; refreshed on next mutation

### State Transitions
- **R4 flag disabled mid-search**: In-progress search completes with flag state at query start; next search uses updated flag
- **Edge density < 0.5**: R10 escalation decision triggered but R4 still operational (just low-impact)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 3 files, degree SQL + normalization + RRF integration |
| Risk | 10/25 | Preferential attachment risk mitigated by caps; sparse graph possible |
| Research | 8/20 | R4 formula defined in research; edge type weights specified |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-S1-001**: Actual edge density after Sprint 0 — will R4 have meaningful data, or is the graph too sparse?
- **OQ-S1-002**: Optimal edge type weights — research specifies caused=1.0, derived_from=0.9, etc. — do these need tuning based on actual data?
<!-- /ANCHOR:questions -->

---

### PageIndex Integration

**Recommendation**: PI-A3 — Pre-Flight Token Budget Validation

**Description**: Before assembling the final result set for a search response, compute the total token count across all candidate results and validate it against the configured token budget. If the candidate set exceeds the budget, truncate to the highest-scoring results that fit within budget (greedy highest-first). If `includeContent=true` and a single result alone exceeds the budget, return a summary of that result instead of full content. All budget overflow events are logged for observability.

**Rationale**: Sprint 1 introduces the 5th RRF channel (R4 typed-degree) and increases co-activation boost strength (A7), both of which expand the result set's potential scoring surface and can cause previously marginal results to surface. This increases the risk of token budget overflow in downstream consumers. Sprint 1 is therefore the natural point to install a pre-flight budget guard — it closes the latent overflow risk before Sprint 2's scoring calibration work makes result composition even more dynamic. PI-A3 is low-risk (4-6h, additive logic, no schema changes) and extends the R-004 baseline scoring benchmarks already established by Sprint 0's evaluation infrastructure.

**Extends Existing Recommendations**:
- **R-004 (baseline scoring benchmarks)**: Token budget overflow events are logged to the eval infrastructure as a new diagnostic, extending the benchmark dataset with token-cost-per-query signal.

**Constraints**:
- Truncation strategy: highest-scoring results first (greedy, not round-robin).
- `includeContent=true` single-result overflow: return summary (not truncated raw content, not an error).
- Log all overflow events with: query_id, candidate_count, total_tokens, budget_limit, truncated_to_count.
- Effort: 4-6h, Low risk.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Parent Plan**: See `../plan.md`
- **Predecessor**: See `../001-sprint-0-epistemological-foundation/`

---

<!--
LEVEL 2 SPEC — Phase 2 of 8
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 1: Graph signal activation via R4 typed-degree channel
-->
