---
title: "Feature Specification: 034 Query Expansion Context Size"
description: "Bound embedding expansion combinedQuery construction so low-priority synonym terms cannot silently overflow the llama-cpp query embedding budget."
trigger_phrases:
  - "034 query expansion context size"
  - "combinedQuery context cap"
  - "embedding expansion synonym budget"
  - "llama-cpp query embedding budget"
importance_tier: "important"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/034-query-expansion-context-size"
    last_updated_at: "2026-05-14T15:40:13Z"
    last_updated_by: "main-agent"
    recent_action: "034 implementation and verification complete"
    next_safe_action: "No 034 action needed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedding-expansion-bound.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000034"
      session_id: "034-query-expansion-context-size"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3: E - Phase folder 034-query-expansion-context-size"
      - "Branch: stay on main; no branch, no commit"
      - "Memory MCP and SpawnAgent: forbidden"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 034 Query Expansion Context Size

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | main (no branch; no commit per dispatch) |
| **Parent Spec** | ../spec.md (014-local-embeddings-migration phase parent) |
| **Phase** | 34 |
| **Dependencies** | 037, 039 |
| **Handoff Criteria** | Consumer-side combinedQuery cap implemented; targeted vitest, stage1 regression, build, and strict validation recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 039 made the llama-cpp embedding worker resilient by truncating over-budget input through the model tokenizer. The query expansion consumer still builds `combinedQuery` by appending up to eight expansion terms to the original query before calling the embedder. When the combined text crosses the practical context budget, the worker truncates the tail after the fact, which silently drops lower-priority synonym signal and can degrade retrieval quality.

### Purpose

Cap `combinedQuery` at the consumer boundary so the original query is preserved verbatim and expansion terms are appended only while they fit within the conservative character budget.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Scaffold Level-2 packet documentation for phase 034.
- Add a bounded combined-query builder in `embedding-expansion.ts`.
- Preserve base query text verbatim, even when it exceeds the cap alone.
- Drop low-priority expansion terms from the tail when the next term would exceed the cap.
- Add targeted vitest coverage for short, over-budget expansion, and over-budget base-query cases.
- Run requested build, targeted test, regression test, and strict packet validation.

### Out of Scope

- Changes to the llama-cpp worker in `shared/embeddings/providers/llama-cpp.ts`.
- Passing provider tokenizer access through the search pipeline.
- Branch creation, commits, PR work, network access, Memory MCP calls, or spawned agents.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts` | Modify | Add bounded combinedQuery builder and use it in expansion. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedding-expansion-bound.vitest.ts` | Create | Cover 034 bounded combinedQuery behavior. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/034-query-expansion-context-size/` | Create | Level-2 packet docs and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Bound combined query construction | `combinedQuery.length <= 6500` when the base query alone is below the cap. |
| REQ-002 | Preserve original query | Base query is returned verbatim and remains the prefix of expanded output. |
| REQ-003 | Prefer high-priority expansion terms | Terms are appended in existing `expanded` order and tail terms are dropped when the cap would be exceeded. |
| REQ-004 | Preserve worker fallback for oversized base query | If base query alone exceeds the cap, the original query is returned unchanged for downstream worker truncation. |
| REQ-005 | Add focused regression coverage | New vitest covers short, long-synonym, and long-base-query cases. |
| REQ-006 | Verify requested commands | Build, targeted vitest, stage1 regression, and strict validation results are recorded. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Given a short base query and short expansion terms, when the builder runs, then all terms are preserved unchanged.
- **SC-002**: Given a short base query and long expansion terms, when the builder runs, then the result stays within 6500 characters and preserves the base query.
- **SC-003**: Given an over-budget base query, when the builder runs, then it returns the original query unchanged.
- **SC-004**: Given the full mcp_server build and relevant tests, when verification runs, then build and tests pass or failure evidence is documented.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Character proxy is approximate | Medium | Use a conservative 6500-char cap below the worker's token preflight budget. |
| Risk | A single high-priority term can block later shorter terms | Low | Preserve priority order and drop only from the tail, matching dispatch guidance. |
| Dependency | 037 worker diagnosis | Medium | Graph metadata depends on 037. |
| Dependency | 039 worker token truncation | High | This packet complements worker-side fallback without changing it. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this packet.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

| NFR | Target | Verification |
|-----|--------|--------------|
| Minimality | No provider dependency introduced into expansion pipeline | Source diff contains char-budget helper only. |
| Retrieval quality | Preserve original query and highest-priority expansion terms | T034-01 and T034-02. |
| Resilience | Oversized base query still flows to worker fallback | T034-03. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

1. **Short query, short terms**: all terms fit and output is unchanged from old behavior.
2. **Short query, long terms**: builder stops before adding the first term that would exceed the cap.
3. **Long base query**: builder returns the base query unchanged and lets worker-side tokenizer truncation handle overflow.
4. **No expansion terms**: builder returns the base query.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One source helper, one targeted test, packet docs. |
| Risk | 8/25 | Retrieval behavior changes only for oversized expanded queries. |
| Research | 5/20 | Existing expansion path and requested worker context from 039. |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
