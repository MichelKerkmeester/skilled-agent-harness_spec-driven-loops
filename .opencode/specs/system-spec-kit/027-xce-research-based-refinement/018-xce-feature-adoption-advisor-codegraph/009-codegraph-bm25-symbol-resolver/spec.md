---
title: "Feature Specification: Optional BM25 fuzzy symbol resolver for code-graph disambiguation"
description: "Code-graph subject matching is exact equality on fq_name or name. Add an optional BM25 fuzzy resolver over symbol fields for disambiguation and context-seed suggestions only - never a Grep-competing text search."
trigger_phrases:
  - "code graph symbol resolver"
  - "BM25 fuzzy symbol lookup"
  - "disambiguation context seed"
  - "fq_name name fuzzy match"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver"
    last_updated_at: "2026-06-10T21:38:20Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented fallback-only BM25 symbol suggestions"
    next_safe_action: "Keep BM25 resolver default-off"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/symbol-bm25-resolver.vitest.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-codegraph-bm25-symbol-resolver"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: codegraph-bm25-symbol-resolver

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Completed |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 003-advisor-packed-bm25-lexical (pattern reuse, soft) |
| **Successor** | None |
| **Source transfers** | Analysis #9 (optional BM25/BM25F symbol resolver, lowest priority) |
| **Handoff Criteria** | Phase validates `--strict`; resolver is disambiguation-only and never competes with Grep |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the spec-027 feature adoption into the advisor and code-graph daemons, and the lowest-priority transfer. It adds an optional fuzzy symbol resolver strictly for disambiguation.

**Scope Boundary**: Subject resolution in `handlers/query.ts`. Add an optional BM25/BM25F resolver over symbol fields (`name`, `fq_name`, `signature`, `docstring`, file path) used only when exact equality fails or is ambiguous, or to suggest `code_graph_context` seeds. Exact-match behavior stays primary and unchanged.

**Dependencies**:
- Soft: reuse phase 003's packed-BM25 helper pattern. Should land only after phase 003 has shadow-validated the approach advisor-side.

**Deliverables**:
- An optional BM25 fuzzy resolver over symbol fields for disambiguation and context-seed suggestions.
- A clear boundary: the resolver never replaces exact matching and never becomes a text-search front door.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Code-graph subject matching is exact equality on `fq_name` or `name` (`handlers/query.ts:202-235`), so a near-miss symbol query returns nothing and the caller has no disambiguation help. A BM25/BM25F resolver over symbol fields would handle fuzzy lookup, but the code graph is intentionally structural - the analysis flags the real risk of competing with Grep for text search.

### Purpose
Adopt a packed BM25/BM25F resolver as an optional, disambiguation-only path: when exact matching fails or is ambiguous, suggest candidate symbols or context seeds, without turning the code graph into a text-search engine.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An optional BM25/BM25F symbol index over `name`, `fq_name`, `signature`, `docstring`, and file path.
- Fuzzy resolution used only when exact equality fails/ambiguates, or for `code_graph_context` seed suggestions.
- A feature flag so the resolver is opt-in.

### Out of Scope
- Replacing or weakening exact `fq_name`/`name` matching - it stays primary.
- Becoming a general code text search or competing with Grep - disambiguation only.
- Indexing file contents/bodies beyond the named symbol fields.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-code-graph/mcp_server/handlers/query.ts` (~:202-235) | Modified | Fall back to symbol suggestions only when exact subject matching returns no symbol and the opt-in flag is enabled |
| `system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | Added a read-only symbol-field row accessor for resolver indexing |
| `system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts` | Created | Packed BM25F index over symbol fields for disambiguation-only candidates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Exact match stays primary; fuzzy only on miss/ambiguity | Test: an exact `fq_name` query resolves identically to today; the resolver only engages when exact match returns 0 or >1 |
| REQ-002 | Resolver does not become a text-search front door | The resolver returns symbol candidates/context seeds, not arbitrary file/text matches; documented as disambiguation-only |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Opt-in via feature flag; default-off | With the flag off, query behavior is identical to today (no resolver path) |
| REQ-004 | Field-weighted scoring across the named symbol fields | BM25F weights name/fq_name above docstring/path; tested on a symbol fixture |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A near-miss or ambiguous symbol query returns useful candidate suggestions instead of an empty result, while exact matches stay unchanged.
- **SC-002**: With the flag off (default), the code graph behaves exactly as today and never acts as a text search.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scope creep into a Grep-competing text search | High - violates code-graph's structural intent | REQ-002 disambiguation-only boundary; symbol candidates only |
| Risk | Lowest value of all phases; effort vs payoff | Med | Default-off (REQ-003); land last, only after phase 003 validates the pattern |
| Dependency | Phase 003 packed-BM25 pattern | Low | Reuse the proven helper; do not duplicate effort |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None remaining.

Answered decisions:
- The resolver shipped because the user explicitly requested phase implementation.
- The trigger threshold is strict: the resolver runs only when `symbol_id`, `fq_name`, and `name` exact matching all miss. Existing exact and ambiguous exact-match behavior remains unchanged.
- The suggestion limit is five candidates.
- The resolver is enabled only by `SPECKIT_CODE_GRAPH_BM25_SYMBOL_RESOLVER` values `1`, `true`, `yes`, `on`, `experimental`, or `fallback`.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
