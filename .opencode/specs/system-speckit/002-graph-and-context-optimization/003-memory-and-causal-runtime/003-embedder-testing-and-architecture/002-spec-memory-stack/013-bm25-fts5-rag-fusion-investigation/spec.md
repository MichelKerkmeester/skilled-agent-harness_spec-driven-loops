---
title: "Feature Specification: BM25 FTS5 RAG Fusion Investigation"
description: "Read-only Level 3 research packet evaluating whether replacing the in-memory JS BM25 lane with SQLite FTS5 degrades hybrid RAG fusion quality."
trigger_phrases:
  - "bm25 fts5 rag fusion investigation"
  - "sqlite fts5 bm25 swap"
  - "hybrid search lexical lane"
  - "deep research 013"
importance_tier: "high"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Initialized Level 3 research packet and completed five-iteration investigation"
    next_safe_action: "Use research.md recommendation before implementing any BM25 engine change"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
    session_dedup:
      fingerprint: "sha256:0130130130130130130130130130130130130130130130130130130130130130"
      session_id: "res-013-20260519-000000"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Live golden-query metrics remain unmeasured by constraint."
    answered_questions:
      - "SQLite FTS5 can preserve the RAG-fusion lexical lane, but not every JS-only recall behavior without schema/query changes."
---
# Feature Specification: BM25 FTS5 RAG Fusion Investigation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

## EXECUTIVE SUMMARY

This packet investigates whether the memory-saving recommendation from deep-research-005, "make SQLite FTS5 the default BM25 engine and stop warming the JS BM25 index", risks degrading the current RAG-fusion retrieval design. The answer is calibrated: SQLite FTS5 preserves the lexical BM25 lane, but the current JS path contributes synonym expansion, lightweight custom stemming, stop-word filtering, underscore and hyphen preservation, and markdown normalization that are only partially matched by the production FTS5 schema.

**Key Decisions**: recommend Option B with guardrails, keep Option C as a fallback if golden-query tests show synonym or identifier regressions.

**Critical Dependencies**: implementation must add golden-query parity tests before switching the default away from the in-memory JS BM25 warmup.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation` |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Deep-research-005 ranked the JS in-memory BM25 index as the top resident-memory target, but its recommendation noted that SQLite FTS5 tokenization and weights may not be identical. The user asked whether replacing the JS BM25 lane degrades hybrid-search intelligence because the system is RAG fusion: lexical BM25 and vector semantic retrieval are combined by reciprocal rank fusion.

### Purpose

Produce a read-only, evidence-cited decision packet that identifies JS-only lexical behavior, maps FTS5 parity, predicts query-level divergence, inspects test coverage, and recommends one path for the BM25-to-FTS5 swap.
<!-- /ANCHOR:problem -->

---
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Five independent research iterations under `research/iterations/`.
- Final synthesis at `research/research.md`.
- Level 3 packet docs: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `decision-record.md`, `description.json`, and `graph-metadata.json`.
- Read-only inspection of BM25, FTS5, RRF, schema, predecessor research, and tests.

### Out of Scope

- Source changes to BM25, FTS5, RRF, schema, tests, or handlers.
- Live production daemon queries.
- Sub-agent dispatch or external CLI self-invocation.
- Commits or branch changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create/Update | Level 3 research specification |
| `plan.md` | Create/Update | Investigation plan and verification route |
| `tasks.md` | Create/Update | Completed research task ledger |
| `implementation-summary.md` | Create/Update | Research completion summary and commit handoff paths |
| `decision-record.md` | Create/Update | ADR for Option B with guardrails |
| `description.json` | Create/Update | Packet metadata for memory/spec discovery |
| `graph-metadata.json` | Create/Update | Packet graph metadata |
| `research/iterations/iteration-001.md` through `iteration-005.md` | Create | Iteration findings |
| `research/research.md` | Create | Final synthesis |
| `research/deep-research-state.jsonl` | Append/Create | Iteration state records |
<!-- /ANCHOR:scope -->

---
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Read predecessor research first. | Iteration files cite deep-research-005 iter-001, iter-009, and iter-010 context. |
| REQ-002 | Inventory JS BM25 behavior beyond BM25 scoring. | `iteration-001.md` enumerates tokenizer, stemming, synonyms, stop words, normalization, field handling, query rewriting, and warmup behavior. |
| REQ-003 | Map FTS5 parity and implementation cost. | `iteration-002.md` maps PARTIAL and NOT_AVAILABLE features to FTS5 built-ins, query syntax, schema options, or custom tokenizers. |
| REQ-004 | Predict 30 query divergences without live daemon queries. | `iteration-003.md` contains 30 representative queries and labels uncertain rows as `REQUIRES_LIVE_TEST`. |
| REQ-005 | Inspect test fixtures and quantify breakage. | `iteration-004.md` identifies absent fixtures, covered files, likely failures, updates, and stable tests. |
| REQ-006 | Analyze RRF impact across Options A, B, and C. | `iteration-005.md` compares quality, memory, and query classes for each option. |
| REQ-007 | Write final synthesis with all requested sections. | `research/research.md` contains Summary, Findings, Decision matrix, Recommendation, Negative knowledge, Open questions, and Cross-references. |
| REQ-008 | Keep source files unchanged. | `git status` shows only packet documentation/research files changed for this task. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Cite file:line evidence for code claims. | Iteration and synthesis findings include local file-line citations. |
| REQ-010 | Cite primary FTS5 documentation for capability claims. | `iteration-002.md` cites official SQLite FTS5 docs and FTS5 extension API documentation. |
| REQ-011 | Run strict spec validation. | `validate.sh <013> --strict` passes or any residual warning is documented. |
<!-- /ANCHOR:requirements -->

---
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five iteration files exist and have at least 30 lines.
- **SC-002**: `research/research.md` contains the seven requested synthesis sections.
- **SC-003**: Standard Level 3 docs and metadata files exist.
- **SC-004**: Strict spec validation passes for the packet.
- **SC-005**: Final recommendation chooses one option with explicit revisit gates.
- **SC-006**: **Given** a maintainer reviewing the BM25 swap, **When** they read `research/research.md`, **Then** they can identify which JS lexical features are at risk.
- **SC-007**: **Given** a future implementer, **When** they read `decision-record.md`, **Then** they know why Option B is recommended and which tests must gate it.
<!-- /ANCHOR:success-criteria -->

---
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Constraint | No live production daemon queries | No measured nDCG, recall, or rank correlation | Mark predictions as `REQUIRES_LIVE_TEST` where needed |
| Risk | FTS5 schema column order/weights may drift | Weighted BM25 quality could be misinterpreted | Cite production schema and test schema separately |
| Risk | Research docs could be mistaken for shipped code | Implementation may skip required parity testing | State source files were not modified and make guardrails explicit |
| Dependency | SQLite FTS5 behavior | Capability map depends on official FTS5 features | Cite official SQLite docs |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Research must preserve the memory target context: Option B saves the full in-memory JS BM25 resident index, previously estimated at roughly 30-50 MB steady state and higher during warmup probes.

### Security
- **NFR-S01**: Do not run production daemon queries or mutate source/search behavior.

### Reliability
- **NFR-R01**: Every claim about current behavior must be tied to code, tests, predecessor research, or official SQLite documentation.

---
## 8. EDGE CASES

### Data Boundaries
- Empty queries: both JS BM25 and FTS5 paths return empty arrays after query tokenization.
- Queries with boolean/proximity syntax: production sanitization strips FTS operators before both lexical lanes.
- Unicode and punctuation: JS lexical splitting is ASCII-biased; default FTS5 uses `unicode61`.

### Error Scenarios
- FTS5 unavailable: `sqlite-fts.ts` reports capability state and returns empty lexical results.
- BM25 cold or disabled: RRF can still fuse vector, FTS, trigger, graph, and degree lanes, but the `bm25` channel disappears.

---
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Five research iterations plus Level 3 packet docs |
| Risk | 18/25 | Retrieval quality and memory architecture decision |
| Research | 18/20 | Code, tests, predecessor research, SQLite docs |
| Multi-Agent | 0/15 | User prohibited sub-agents |
| Coordination | 8/15 | Depends on prior deep-research-005 recommendation |
| **Total** | **62/100** | **Level 3** |

---
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | FTS5-only route loses synonym recall. | Medium | Medium | Preserve JS query expansion in FTS query builder or gate with golden queries |
| R-002 | FTS5-only route loses custom stem behavior. | Low-Medium | Medium | Use `porter` only if tests show recall loss; do not port the JS stemmer blindly |
| R-003 | Tests give false confidence because they are mostly smoke tests. | Medium | High | Add golden-query top-k assertions before default switch |

---
## 11. USER STORIES

### US-001: Decide BM25 engine path (Priority: P0)

**As a** maintainer, **I want** a concrete recommendation on JS BM25 versus SQLite FTS5, **so that** memory optimization does not accidentally reduce retrieval quality.

**Acceptance Criteria**:
1. **Given** the final synthesis, **When** the maintainer compares Option A, B, and C, **Then** one option is clearly recommended with revisit gates.
2. **Given** the JS BM25 feature inventory, **When** an implementer reviews parity, **Then** every non-BM25 feature has a parity status.
3. **Given** the test coverage analysis, **When** an implementer scopes follow-up work, **Then** likely breaking tests and missing tests are explicit.

### US-002: Preserve RAG-fusion semantics (Priority: P1)

**As a** search-system reviewer, **I want** to understand the RRF impact of changing the lexical engine, **so that** vector plus lexical fusion remains intentional.

**Acceptance Criteria**:
1. **Given** Option B, **When** FTS5 remains available, **Then** RRF still receives a lexical keyword list.
2. **Given** synonym-heavy or identifier-heavy queries, **When** FTS5-only behavior is considered, **Then** expected divergences are listed for live test design.
3. **Given** a regression in golden queries, **When** the recommendation is revisited, **Then** the packet names Option C as the targeted fallback.

---
## 12. OPEN QUESTIONS

- What are measured nDCG@5 and recall@10 for the 30 proposed golden queries once a safe non-production fixture runner exists?
- Should the production FTS5 table be recreated with `tokenize='porter unicode61'`, or should query expansion stay in TypeScript to minimize schema migration risk?
- Should the `fts` and `bm25` lanes remain separate labels if both are ultimately backed by SQLite FTS5, or should RRF receive one consolidated `keyword` list earlier?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Synthesis**: See `research/research.md`
