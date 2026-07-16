---
title: "Feature Specification: Hybrid Search Scope Then Limit"
description: "The in-memory BM25 lane applied the caller limit before resolving spec-folder and deprecated-tier filters, which could under-return scoped lexical results. This phase makes BM25 collect enough ranked candidates to filter first and truncate second while preserving existing ranking behavior."
trigger_phrases:
  - "hybrid search scope then limit"
  - "bm25 spec folder filter"
  - "deprecated tier bm25 recall"
  - "lexical search under return"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/012-hybrid-search-scope-then-limit"
    last_updated_at: "2026-06-11T09:55:00Z"
    last_updated_by: "opencode"
    recent_action: "Implemented scope-then-limit behavior for in-memory BM25 and added regression coverage."
    next_safe_action: "Review implementation-summary before commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts"
      - ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/012-hybrid-search-scope-then-limit/spec.md"
      - ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/012-hybrid-search-scope-then-limit/plan.md"
      - ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/012-hybrid-search-scope-then-limit/tasks.md"
      - ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/012-hybrid-search-scope-then-limit/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:4f9b6e36f4f5c6c7c7b9e4f24d6bb7cf7b334b7d9ea2db6ab7f88fd4d923a13f"
      session_id: "2026-06-11-hybrid-search-scope-then-limit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "FTS5 already filters spec folder and deprecated tier inside SQL before LIMIT, so no FTS code change was needed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Hybrid Search Scope Then Limit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 21 of 21 |
| **Predecessor** | `020-vector-resilience-durability` |
| **Successor** | None |
| **Handoff Criteria** | `npx tsc --noEmit`, `npx vitest run tests/hybrid-search.vitest.ts`, strict spec validation, and changed-code comment-hygiene check all pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 21 of the research-based refinement packet. It closes a lexical recall defect in the in-memory BM25 lane used by hybrid search.

**Scope Boundary**: Only the in-memory BM25 result collection inside `bm25Search`, the existing hybrid-search vitest file, and the phase documentation are in scope.

**Dependencies**:
- Existing BM25 index API: `search(query, limit)` and `getStats().documentCount`.
- Existing memory metadata lookup for `spec_folder` and `importance_tier`.
- Existing strict fail-closed behavior for scoped BM25 metadata lookup failures.

**Deliverables**:
- BM25 candidate collection that applies spec-folder and deprecated-tier filtering before final limit truncation.
- Regression tests for scoped survivor count, deprecated survivor count, and unscoped no-filter order preservation.
- Completed Level 1 documentation for this phase.

**Changelog**:
- No packet-local changelog file was changed in this scoped phase. The implementation summary records the completed evidence.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The in-memory BM25 path fetched only the caller-requested number of lexical hits before resolving `specFolder` scope and deprecated-tier exclusions. If out-of-scope or deprecated memories occupied those top slots, the filter removed them and returned fewer than the requested limit even when enough valid matches existed deeper in the BM25 ranking.

### Purpose
Return the requested number of valid BM25 lexical results whenever the indexed corpus contains enough in-scope, non-deprecated matches, without changing BM25 scoring or unfiltered ordering.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change legacy in-memory BM25 candidate collection so metadata filters run before final `limit` truncation.
- Preserve fail-closed scoped metadata lookup behavior.
- Add regression tests that fail under the old limit-then-filter behavior.
- Audit the FTS5 lane for the same defect.
- Fill the phase documentation with complete status and verification evidence.

### Out of Scope
- BM25 scoring formula changes, field weights, normalization, or ranking math.
- Vector, graph, trigger, MMR, confidence truncation, or fusion behavior.
- Live memory shards, host daemons, persisted databases, or production corpus data.
- Broad test refactors outside the existing hybrid-search test file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modify | Fetch a corpus-bounded BM25 candidate pool when metadata filters can remove hits, then filter and slice to the caller limit. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts` | Modify | Add in-memory fixtures covering scoped under-return, deprecated under-return, and unscoped order preservation. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/012-hybrid-search-scope-then-limit/spec.md` | Modify | Replace scaffold content with the completed specification. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/012-hybrid-search-scope-then-limit/plan.md` | Modify | Replace scaffold content with the completed implementation plan. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/012-hybrid-search-scope-then-limit/tasks.md` | Modify | Replace scaffold tasks with completed work items and evidence. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/012-hybrid-search-scope-then-limit/implementation-summary.md` | Modify | Record the completed implementation and verification results. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | BM25 must resolve metadata filters before truncating to the caller limit when filters can drop results. | Scoped search with higher-ranked out-of-scope hits returns the requested count when enough in-scope hits exist deeper in the ranking. |
| REQ-002 | Deprecated-tier filtering must not consume the caller limit window. | Search with higher-ranked deprecated hits still returns non-deprecated hits up to the requested limit when enough exist. |
| REQ-003 | Existing scope-resolution security must remain fail-closed. | Existing scoped lookup failure test still returns `[]` and warns rather than leaking unscoped candidates. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Unscoped, non-filtered BM25 behavior must preserve previous order and count. | Regression test compares `bm25Search` output to the raw index top limit when metadata filtering removes nothing. |
| REQ-005 | FTS5 lane must be audited for the same defect. | Audit confirms FTS5 SQL applies spec-folder and deprecated-tier predicates before `LIMIT`, so no code change is needed. |
| REQ-006 | Verification must avoid live memory shards and host daemons. | Tests use in-memory fixtures and mocked database objects only. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Scoped BM25 queries return `limit` in-scope survivors when the corpus contains at least `limit` valid matches.
- **SC-002**: Deprecated BM25 rows do not cause unscoped queries to under-return when valid non-deprecated matches exist deeper in the ranking.
- **SC-003**: Unscoped searches with no metadata exclusions keep the same result order and count as the raw BM25 top-limit call.
- **SC-004**: TypeScript, the hybrid-search vitest file, strict spec validation, and changed-code comment-hygiene checks pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | In-memory BM25 index statistics | Candidate pool sizing needs a corpus bound. | Use `index.getStats().documentCount`, which is already used by availability checks and caps the candidate request at the indexed corpus size. |
| Risk | Large broad-term queries | Fetching all indexed candidates for metadata-filtered BM25 can do more in-memory work than top-limit fetching. | This path is bounded by indexed document count and only activates when post-score metadata filters can otherwise under-return. |
| Risk | FTS and in-memory BM25 diverge | Changing both lanes unnecessarily could alter SQL-backed behavior. | Leave FTS unchanged because SQL predicates already run before `LIMIT`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
