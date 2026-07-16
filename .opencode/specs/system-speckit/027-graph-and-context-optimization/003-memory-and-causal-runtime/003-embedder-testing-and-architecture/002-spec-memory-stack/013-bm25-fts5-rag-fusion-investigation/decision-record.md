---
title: "Decision Record: BM25 FTS5 RAG Fusion Investigation"
description: "ADR for choosing the BM25-to-FTS5 path after the five-iteration retrieval-quality investigation."
trigger_phrases:
  - "bm25 fts5 decision record"
  - "sqlite fts5 default bm25 engine"
  - "rag fusion lexical lane adr"
importance_tier: "high"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/013-bm25-fts5-rag-fusion-investigation"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Accepted ADR-001 recommending FTS5 default with guardrails"
    next_safe_action: "Use ADR-001 as the implementation decision gate"
    blockers: []
    key_files:
      - "decision-record.md"
---
# Decision Record: BM25 FTS5 RAG Fusion Investigation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---
<!-- ANCHOR:adr-001 -->
## ADR-001: Default to SQLite FTS5 BM25 with parity guardrails

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-19 |
| **Deciders** | Codex research executor, pending maintainer approval for implementation |

---
<!-- ANCHOR:adr-001-context -->
### Context

Deep-research-005 recommended making SQLite FTS5 the default BM25 engine to avoid retaining the in-memory JS BM25 index. The concern is valid: the current JS path is not just a raw BM25 formula. It includes custom tokenization, lightweight stemming, stop-word filtering, synonym expansion, markdown normalization, and a separate RRF lane.

### Constraints

- No source implementation in this packet.
- No live production daemon query.
- Preserve RAG fusion semantics: semantic vector and lexical keyword evidence must both remain available.
- Reduce always-resident memory where quality risk is bounded by tests.
<!-- /ANCHOR:adr-001-context -->

---
<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option B, switch the default lexical BM25 engine to SQLite FTS5, but only behind golden-query parity gates and with TypeScript query expansion preserved in front of FTS5.

**How it works**: A future implementation should stop default startup warmup of the JS in-memory BM25 index when FTS5 is available. The FTS5 path remains the lexical BM25 provider; TypeScript sanitization and synonym expansion should remain in the query builder unless a measured FTS5 tokenizer change replaces it cleanly. If golden-query parity fails for synonym-heavy or identifier-heavy queries, use Option C only for those feature classes.
<!-- /ANCHOR:adr-001-decision -->

---
<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Option B: FTS5-only default** | Saves resident JS index memory, keeps lexical BM25, fits existing FTS5 wrapper, simpler than two engines | Needs golden-query gates for synonyms, stemming, and identifiers | 8/10 |
| Option A: Keep JS BM25 | Preserves all current behavior | Retains memory cost and duplicate lexical engine | 5/10 |
| Option C: Hybrid routing | Can preserve JS-only behavior for risky query classes | More complexity, less memory saved, needs routing and fallback tests | 6/10 |

**Why this one**: FTS5 already provides the stronger weighted lexical scorer, and RRF groups FTS plus BM25 into a keyword list. The JS-specific features are real but small enough to protect with query expansion and golden-query tests before accepting permanent dual-engine complexity.
<!-- /ANCHOR:adr-001-alternatives -->

---
<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The default context-server path can avoid warming and retaining the JS BM25 document/token maps.
- RRF still receives lexical evidence through the FTS5 BM25 lane.
- Future ranking tests become more explicit because synonym and identifier behavior must be encoded in golden queries.

**What it costs**:
- FTS5-only does not exactly reproduce JS stemming or ASCII tokenization. Mitigation: add golden-query parity and preserve query expansion.
- Production FTS schema changes, such as `porter` tokenization or tokenchars, require migration care. Mitigation: first use query-side behavior; migrate schema only when evidence justifies it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Synonym recall drops | Medium | Preserve TypeScript expansion and test ephemeral/temporary/short-term queries |
| Identifier query recall shifts | Medium | Test snake_case, kebab-case, camelCase, and Unicode query classes |
| Existing JS implementation tests fail | Low | Reclassify as implementation-detail tests if FTS5 becomes the default engine |
<!-- /ANCHOR:adr-001-consequences -->

---
<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | BM25 warmup and in-memory maps are documented memory roots in predecessor research. |
| 2 | **Beyond Local Maxima?** | PASS | Options A, B, and C were evaluated. |
| 3 | **Sufficient?** | PASS | Option B keeps one lexical engine and adds tests instead of permanent dual routing. |
| 4 | **Fits Goal?** | PASS | It targets resident memory while preserving RAG-fusion lexical evidence. |
| 5 | **Open Horizons?** | PASS | Golden-query gates and Option C fallback keep a path for feature-specific regressions. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---
<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Future implementation should skip JS BM25 warmup by default when FTS5 is available.
- Future implementation should keep query expansion/sanitization shared for FTS5.
- Future implementation should add golden-query parity tests before removing the JS default lane.

**How to roll back**: Re-enable JS BM25 warmup/default lane with the existing `ENABLE_BM25` path or a new engine flag, then rerun golden-query tests.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
