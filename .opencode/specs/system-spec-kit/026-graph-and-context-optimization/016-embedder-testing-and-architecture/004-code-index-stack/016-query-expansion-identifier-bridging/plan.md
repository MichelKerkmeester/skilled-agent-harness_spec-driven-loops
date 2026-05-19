---
title: "Implementation Plan: 016 Query Expansion Identifier Bridging"
description: "Level 2 implementation plan for deterministic CocoIndex query expansion before hybrid dense and FTS5 retrieval."
trigger_phrases:
  - "016 query expansion plan"
  - "identifier bridging plan"
  - "COCOINDEX_QUERY_EXPANSION"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/016-query-expansion-identifier-bridging"
    last_updated_at: "2026-05-19T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Bench gate failed after implementation"
    next_safe_action: "Tune retrieval or defer to 017"
---
# Implementation Plan: 016 Query Expansion Identifier Bridging

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language/Stack | Python 3.11+ |
| Surface | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code` |
| Search path | Hybrid dense vector + SQLite FTS5 + RRF + optional rerank |
| Testing | Pytest, ruff, Phase 2 corrected bench, spec strict validation |

### Overview

This packet adds deterministic query expansion before CocoIndex hybrid retrieval. It bridges natural-language queries to code identifiers with compound splitting, identifier-style variant generation, and a bounded synonym dictionary. The implementation preserves embedder and reranker independence and keeps a runtime rollback through `COCOINDEX_QUERY_EXPANSION=false`.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Binding spec read and requirements R1-R14 identified.
- [x] Hybrid query entry in `query.py` read before edits.
- [x] Post-015 baseline read for hit-rate and p95 comparison.
- [x] Sequential-thinking MCP invoked five times before edits; tool returned cancellation each time.

### Definition of Done

- [ ] Query expansion module, config, and query integration implemented.
- [ ] Unit and integration tests passing.
- [ ] Phase 2 bench hit rate is at least the post-015 baseline.
- [ ] README, ADR-019, packet docs, metadata, and strict validation complete.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pure query-transform module plus narrow integration in the hybrid search entrypoint.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| `query_expansion.py` | Pure helper functions, `_DEFAULT_SYNONYMS`, and `ExpandedQuery` dataclass |
| `config.py` | Four env vars and malformed-input fallback behavior |
| `query.py` | One expansion call per query, dense fanout merge, FTS5 expanded clause, trace logging |
| `fts_index.py` | Optional prebuilt `MATCH` clause parameter for safe FTS5 OR expressions |
| Tests | Pure helper coverage, config validation, FTS5 clause syntax, hybrid fanout behavior |

### Data Flow

1. `query_codebase()` receives the user query.
2. `expand_query()` returns dense variants and an FTS5 `OR` clause.
3. Dense retrieval embeds variants separately when fanout is enabled.
4. Vector rows are OR-merged by `(file_path, chunk_id)` with best distance retained.
5. FTS5 receives the expanded quoted clause.
6. Existing RRF, mirror dedup, and rerank paths consume merged candidates unchanged.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Expansion Module

- [x] Add `ExpandedQuery`.
- [x] Implement compound splitting, identifier variants, synonyms, and orchestration.
- [x] Keep helpers pure with no I/O or hot-path logging.

### Phase 2: Config

- [x] Add query expansion env vars.
- [x] Add JSON synonym-dict parser with warnings and fallback.
- [x] Preserve existing config behavior and tests.

### Phase 3: Query Integration

- [x] Call expansion once per user query.
- [x] Implement dense fanout and concat fallback.
- [x] Pass expanded FTS5 clause without double-normalizing.
- [x] Add JSONL trace row when rerank logging is enabled.

### Phase 4: Verification And Bench

- [x] Add targeted unit and integration tests.
- [ ] Run full MCP server pytest.
- [ ] Run corrected Phase 2 bench against post-015 DB.
- [ ] Write comparison and delta evidence.

### Phase 5: Docs And Validation

- [x] Update code README.
- [x] Append ADR-019.
- [ ] Finalize checklist and implementation summary with evidence.
- [ ] Run strict spec validation.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Splitter, variants, synonyms, expansion no-op paths | Pytest |
| Config | Env parsing, defaults, malformed fallback | Pytest |
| Integration | Hybrid dense fanout, FTS5 clause plumbing | Pytest |
| Static | Ruff over changed Python files | Ruff |
| Bench | 18-probe corrected fixture vs post-015 baseline | `run-phase2-smoke.sh` |
| Spec | Level 2 docs and metadata contract | `validate.sh --strict` |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Post-015 DB | Runtime data | Available from main-agent recovery | Bench cannot prove packet value |
| Corrected fixture | Bench input | Available | Hit-rate comparison would be invalid |
| SQLite FTS5 | Runtime search | Existing | Expanded lexical channel unavailable |
| Existing embedder interface | Runtime search | Existing single-query async embed | Dense fanout runs sequentially rather than batched |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Set `COCOINDEX_QUERY_EXPANSION=false` and restart the `ccc` daemon. Full code rollback reverts `query_expansion.py`, `query.py`, `fts_index.py`, `config.py`, tests, README, ADR-019, and packet evidence.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Module + Config -> Query Integration -> Tests -> Bench -> Docs/Validate
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Module | Spec + query read | Config, query integration |
| Config | Module defaults | Query integration, config tests |
| Query integration | Module + config | Integration tests, bench |
| Bench | Tests + live DB | Completion claim |
| Docs/validate | Code + evidence | Commit handoff |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Expansion module | Medium | 45-60 minutes |
| Config | Low | 20 minutes |
| Query integration | Medium | 30-45 minutes |
| Tests | Medium | 45 minutes |
| Bench/docs/validate | Medium | 45-60 minutes |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Trigger | Action | Evidence Needed |
|---------|--------|-----------------|
| Query expansion worsens hit rate | Set `COCOINDEX_QUERY_EXPANSION=false` | Bench delta showing restored baseline |
| Dense fanout latency too high | Set `COCOINDEX_QUERY_EXPANSION_DENSE_FANOUT=false` | p95 comparison before/after |
| Synonym dictionary adds noise | Override `COCOINDEX_QUERY_EXPANSION_SYNONYMS` with smaller dict | Probe-level top-5 comparison |

<!-- /ANCHOR:enhanced-rollback -->
