---
title: "Feature Specification: 002 Exemplars Retriever"
description: "Level 2 child packet for Coco exemplar retrieval in a separate response group."
trigger_phrases:
  - "027 011 002 exemplars retriever"
  - "coco exemplar retriever"
  - "exemplar_retriever.py"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/008-coco-memory-context-extras/002-exemplars-retriever"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Plan implementation for exemplar_retriever.py"
    blockers: ["001-exemplars-schema"]
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 002 Exemplars Retriever

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/028-code-graph-and-cocoindex/008-coco-memory-context-extras` |
| **Track** | A: Coco Exemplars |
| **Depends On** | `001-exemplars-schema`, `system-spec-kit/028-code-graph-and-cocoindex/005-cocoindex-complete-fork` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Once exemplar rows exist, Coco still needs a query-time retriever that can find similar prior helpful results without changing the canonical search result ranking.

### Purpose
Create `cocoindex_code/exemplars/exemplar_retriever.py` as a separate retrieval path that returns top exemplar matches beside normal results, never mixed into `QueryResult` ranking.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- KNN lookup over the exemplar vector table.
- Top-3 output with similarity threshold at or above 0.80.
- Cold-start behavior that omits `exemplars` when the bank is empty.
- Query response extension that keeps `data.results` ordering bit-identical.

### Out of Scope
- Schema creation and migration.
- TTL cleanup and purge jobs.
- Any score boost or rank blending.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/exemplars/exemplar_retriever.py` | Create | KNN retrieval and response shaping |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modify | Attach separate `exemplars` group when enabled |
| `.opencode/skills/mcp-coco-index/tests/test_exemplar_retriever.py` | Create | Cold-start, threshold, and ordering parity tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Return exemplars as a separate response group | Snapshot proves normal results remain in the same order |
| REQ-002 | Apply top-3 and similarity threshold behavior | Tests cover threshold pass, threshold fail, and cap |
| REQ-003 | Keep cold start as no-op | Empty bank omits `exemplars` and returns current response shape |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Feature flag gates query-time lookup | Flag-off output is bit-identical to today |
| REQ-005 | Retriever validates row identity before output | Missing file or invalid range is suppressed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Flag-off Coco query responses are unchanged.
- **SC-002**: Flag-on responses can include `exemplars` as a distinct group.
- **SC-003**: Retrieval tests cover threshold, cap, cold-start, and ordering parity.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `001-exemplars-schema` | No exemplar table to query | Keep this child sequential after schema |
| Risk | Exemplar group treated as rank authority | Search trust regression | Separate field and snapshot tests |
| Risk | Stale exemplar rows leak | Bad examples surface | Suppress invalid identity rows in retriever |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Exemplar lookup adds bounded overhead under the feature flag.
- **NFR-P02**: Top-3 cap prevents response bloat.

### Security
- **NFR-S01**: Retriever only returns stored identity metadata and cited snippets.
- **NFR-S02**: No free-form feedback comments are returned.

### Reliability
- **NFR-R01**: Empty, corrupt, or unavailable exemplar table fails open to normal results.
- **NFR-R02**: Feature flag disables all query-time exemplar work.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty bank: omit `exemplars`.
- More than three matches: return only top three.
- Similarity below threshold: suppress the row.

### Error Scenarios
- Exemplar table missing: log and return deterministic query results.
- Stale file path: suppress exemplar.
- Invalid line range: suppress exemplar.

### State Transitions
- Flag off to flag on: only separate exemplar group can appear.
- Flag on to flag off: response returns to current shape.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | New retriever plus query response hook |
| Risk | 14/25 | Must preserve ranking immutability |
| Research | 7/20 | Requires query path and schema checks |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None for scaffolding. Implementation should confirm exact response envelope shape in the Phase 005 fork.
<!-- /ANCHOR:questions -->
