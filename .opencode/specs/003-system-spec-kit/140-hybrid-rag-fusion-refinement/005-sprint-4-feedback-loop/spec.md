---
title: "Feature Specification: Sprint 4 — Feedback Loop"
description: "Close the feedback loop with chunk aggregation, learned relevance feedback, and shadow scoring infrastructure."
trigger_phrases:
  - "sprint 4"
  - "feedback loop"
  - "MPAB"
  - "learned relevance"
  - "R11"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Sprint 4 — Feedback Loop

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
| **Phase** | 5 of 8 |
| **Predecessor** | ../004-sprint-3-query-intelligence/ |
| **Successor** | ../006-sprint-5-pipeline-refactor/ |
| **Handoff Criteria** | R1 MRR@5 within 2%, R11 noise <5%, R13-S2 operational |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 5** of the Hybrid RAG Fusion Refinement specification.

**Scope Boundary**: Sprint 4 scope boundary — feedback and learning. Closes the feedback loop by aggregating chunk scores, learning from user selections with strict safeguards, and establishing full A/B evaluation infrastructure.

**Dependencies**:
- Sprint 3 exit gate (query intelligence complete — R15, R14/N1, R2 verified)
- R13 must have completed at least 2 full eval cycles before R11 mutations enabled

**Deliverables**:
- MPAB chunk-to-memory aggregation with N=0/N=1 guards (R1)
- Learned relevance feedback with separate column and 7 safeguards (R11)
- Shadow scoring + channel attribution + ground truth Phase B (R13-S2)
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Chunked memories are scored individually without aggregation — a memory with 5 matching chunks gets no advantage over one with 1 chunk, losing valuable signal. No mechanism exists to learn from user selections (which memories users actually use), so the system cannot self-improve. Evaluation is limited to basic metrics without shadow scoring or A/B comparison capability, making it impossible to validate changes against production behavior.

### Purpose

Aggregate chunk scores safely with MPAB (preserving N=0/N=1 semantics), learn from user behavior with 7 strict safeguards to prevent FTS5 contamination, and establish full A/B evaluation infrastructure for continuous quality measurement.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R1**: MPAB chunk-to-memory aggregation with N=0/N=1 guards, index-based max removal
- **R11**: Learned relevance feedback with separate `learned_triggers` column + 7 safeguards
- **R13-S2**: Shadow scoring + channel attribution + ground truth Phase B

### Out of Scope

- R6 (pipeline refactor) — Sprint 5 scope
- R12 (query expansion) — Sprint 5 scope
- R15 changes — locked from Sprint 3
- Direct FTS5 index modification — R11 uses separate column exclusively

### Prerequisite

R13 must have completed at least 2 full eval cycles before R11 mutations are enabled. This is a P0 gate check.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `composite-scoring.ts` or fusion layer | Modify | R1: MPAB aggregation with N=0/N=1 guards |
| `memory_index` schema | Modify | R11: `ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'` |
| Search handlers | Modify | R11: 7 safeguards implementation |
| Eval infrastructure | Modify | R13-S2: Shadow scoring + channel attribution + ground truth Phase B |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S4-PRE | **R13 prerequisite**: Verify R13 completed 2+ full eval cycles | Eval cycle count >= 2 verified before R11 work begins |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S4-001 | **R1**: MPAB with N=0/N=1 guards, index-based max removal | MRR@5 within 2% of baseline, N=1 no regression. Chunk ordering: collapsed multi-chunk results maintain original document position order. Flag: `SPECKIT_DOCSCORE_AGGREGATION` |
| REQ-S4-002 | **R11**: Learned feedback with separate `learned_triggers` column + 7 safeguards (provenance, TTL 30d, denylist 100+, cap 3/8, threshold top-3, shadow 1 week, eligibility 72h) | Noise rate <5%. Auto-promotion: memories with >=5 positive validations promoted normal->important; >=10 promoted important->critical. Negative feedback confidence signal active: wasUseful=false reduces score via confidence multiplier (floor=0.3). Flag: `SPECKIT_LEARN_FROM_SELECTION` |
| REQ-S4-003 | **R13-S2**: Shadow scoring + channel attribution + ground truth Phase B | A/B infrastructure operational. Exclusive Contribution Rate computed per channel |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: R1 dark-run: MRR@5 within 2% of baseline, no N=1 regression
- **SC-002**: R11 shadow log: noise rate <5%
- **SC-003**: R13-S2: Full A/B comparison infrastructure operational
- **SC-004**: R11 FTS5 contamination test: `learned_triggers` NOT in FTS5 index
- **SC-005**: Sprint 4 exit gate — all requirements verified
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | **CRITICAL** — R11 FTS5 contamination if separate column not used (MR1) | Critical | Separate `learned_triggers` column, explicit FTS5 exclusion test |
| Risk | R1 N=0 div-by-zero (MR4) | High | Guard: N=0 --> return 0 |
| Risk | R1+N4 double-boost — MPAB bonus on already co-activation-boosted scores | Medium | Verify MPAB operates after fusion, not on pre-boosted scores |
| Risk | N4+R11 transient artifact learning — R11 learns from temporary co-activation patterns | Medium | R11 eligibility requires memory age >= 72h |
| Dependency | Sprint 3 exit gate | Blocks start | Must be verified complete |
| Dependency | R13 2+ eval cycles | Blocks R11 | P0 prerequisite for R11 mutations |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: R11 dark-run overhead must not exceed +15ms p95
- **NFR-P02**: R1 operates on already-fetched data — no additional DB queries

### Security
- **NFR-S01**: R11 `learned_triggers` column MUST NOT be added to FTS5 index
- **NFR-S02**: R11 denylist must contain 100+ stop words to prevent noise injection

### Reliability
- **NFR-R01**: R11 must NOT modify triggers until 1-week shadow period completes
- **NFR-R02**: Schema migration must be atomic with backup (checkpoint recommended)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **N=0 chunks**: Return score 0 — no chunks means no signal
- **N=1 chunk**: Return score as-is — no bonus or penalty applied (single chunk = raw score)
- **R11 memories <72h old**: Excluded from learned feedback eligibility — too new to learn from

### Error Scenarios
- **R11 "not in top 3" safeguard**: Requires R13 query provenance — if provenance unavailable, R11 skip (safe default)
- **Schema migration failure**: Abort and restore from checkpoint — search continues with existing schema
- **R11 denylist miss**: New stop word pattern bypasses denylist — TTL 30d provides self-healing

### State Transitions
- **R11 shadow period**: First 1 week = shadow only (log but don't apply). After 1 week = mutations enabled (if noise <5%)
- **R1+R11 interaction**: R1 aggregates chunks, R11 learns from selections — ensure R11 operates on post-MPAB scores
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 3 features: MPAB aggregation, learned feedback with schema change, eval Phase B |
| Risk | 18/25 | CRITICAL FTS5 contamination risk; schema migration; 7 safeguards complexity |
| Research | 6/20 | Research complete (142 analysis); MPAB formula and R11 safeguards defined |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-S4-001**: Should R11 shadow period be configurable or hardcoded to 1 week?
- **OQ-S4-002**: What is the exact MPAB bonus coefficient? Currently defined as 0.3 — should this be tunable?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Parent Plan**: See `../plan.md`

---

### Schema Change

```sql
ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]';
-- Nullable, default empty JSON array
-- Rollback: ALTER TABLE memory_index DROP COLUMN learned_triggers; (SQLite 3.35.0+)
```

---

<!--
LEVEL 2 SPEC — Phase 5 of 8
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 4: Feedback Loop
-->
