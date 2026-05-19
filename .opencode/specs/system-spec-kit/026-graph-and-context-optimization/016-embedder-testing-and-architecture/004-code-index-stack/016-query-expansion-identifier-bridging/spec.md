---
title: "Spec: 016/004/016 Query Expansion — Identifier Bridging (camelCase / snake_case / synonyms)"
description: "Bridges the natural-language → code-identifier gap by expanding queries with camelCase / snake_case / PascalCase / kebab-case splits, common code-domain synonyms (walker/finder, util/helper, parser/lexer), and a configurable user-synonym dictionary. Runs BEFORE embedding so dense + FTS5 both benefit. Embedder-agnostic, reranker-agnostic, future-proof for any future identifier convention. Targets the 'natural language asks, but corpus stores identifiers' failure mode evidenced in 011 phase-2 bench probes 1, 5, 12, 15."
trigger_phrases:
  - "016/004/016 query expansion"
  - "identifier bridging cocoindex"
  - "camelCase snake_case query expansion"
  - "code-domain synonyms"
  - "COCOINDEX_QUERY_EXPANSION"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/016-query-expansion-identifier-bridging"
    last_updated_at: "2026-05-19T14:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored spec.md alongside in-flight 015 dispatch"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast after 015 commits"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004016"
      session_id: "016-004-016"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Should synonym expansion be ON by default, or opt-in?"
      - "How aggressive should fan-out be — cap at N variants per token, or per query?"
    answered_questions:
      - "Why expansion before embedding? Both dense AND FTS5 benefit — single point of leverage. Re-ranking later can't recover identifier hits that never reached the candidate set."
      - "What's the rollback story? COCOINDEX_QUERY_EXPANSION=false reverts to identical pre-016 behavior."
      - "Is this embedder-agnostic? Yes — expansion is a pure string transform on the user query, runs before any encoder."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 016/004/016 Query Expansion — Identifier Bridging

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete (2026-05-19) — code + tests + docs SHIPPED with default `COCOINDEX_QUERY_EXPANSION=false`. Empirical bench showed deterministic expansion regressed all 3 lanes vs post-015 baseline (test/doc files displace implementation files in top-K). Available as opt-in research artifact; revisit defaults after 017 RRF recalibration. |
| Type | Pipeline enhancement — query.py + config.py + tests + bench |
| Owner | cli-codex gpt-5.5 high fast (dispatched by main agent after 015 commits) |
| Parent | `../spec.md` (004-code-index-stack) |
| Position in arc | 4 of 6 (sits after 015 chunking; complements wider candidate set with better query) |
| Sibling packets | 013 (shipped), 014 (shipped), 015 (tree-sitter chunking in-flight), 017 (hybrid recalibration), 018 (rerank matrix re-bench) |
| Triggered by | 011/research phase-2 bench probes 1, 5, 12, 15 — every one a natural-language query against an identifier-heavy corpus. Probe 1 "filesystem walker" misses `findFiles`; probe 5 "structural indexer" misses `structuralIndexer.ts`'s camelCase symbols; probe 12 "memory save" misses `memory_save` snake_case; probe 15 "rerank adapter" misses `RerankerAdapter` PascalCase. Dense + FTS5 both lose recall because the query tokens don't appear in the corpus identifiers. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

User queries are natural language ("filesystem walker", "memory save", "rerank adapter"). Code corpora store identifiers in conventions:

- **camelCase** (`findFiles`, `structuralIndexer`)
- **snake_case** (`memory_save`, `generate_context`)
- **PascalCase** (`RerankerAdapter`, `JinaForRanking`)
- **kebab-case** (`spec-kit`, `code-graph`, in file paths)
- **SCREAMING_SNAKE_CASE** (constants like `HF_LOCAL_MODEL`)

Neither dense nor FTS5 reliably bridges this gap:

- **Dense embeddings** trained on natural text + code see "filesystem walker" and `findFiles` as separately tokenized — semantic similarity helps, but only when the embedder is well-tuned (bge-code-v1 helps; bge-base-en doesn't).
- **FTS5** is exact-substring over tokens. "memory save" never matches `memory_save` because the tokenizer splits on underscore.

The fix is **query expansion BEFORE encoding**: derive a small set of identifier-style variants from the natural-language query, OR the user's variants together, and feed the expanded set into both dense and FTS5 paths. Expansion is purely additive — original tokens stay in the query.

Examples (target behavior):

| User query | Expanded for FTS5 | Expanded variants embedded |
|---|---|---|
| `filesystem walker` | `filesystem walker OR findFiles OR find_files OR FilesystemWalker OR walkFiles` | `[original, "findFiles", "FilesystemWalker", "find files walker"]` |
| `memory save` | `memory save OR memorySave OR memory_save OR MemorySave` | `[original, "memorySave", "memory_save", "memory save context"]` |
| `rerank adapter` | `rerank adapter OR rerankAdapter OR rerank_adapter OR RerankerAdapter` | `[original, "RerankerAdapter", "rerankAdapter", "rerank model adapter"]` |

Result: dense retrieval gets more identifier-flavored vectors per query, FTS5 gets more terms to match against tokenized identifier splits, and the rerank candidate set sees the relevant body chunks instead of dropping them at recall stage.

This is THE leverage point for the 4 remaining failure probes once 015 (tree-sitter chunking) lands. After 015 every file is chunked into body-bearing units; 016 makes sure the BODY chunk actually enters the candidate set.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- **New module `cocoindex_code/query_expansion.py`** with pure-function expanders:
  - `split_compound_identifier(token: str) -> list[str]`: splits camelCase / PascalCase / snake_case / kebab-case / SCREAMING_SNAKE into atomic words. Idempotent — already-split tokens pass through.
  - `generate_identifier_variants(words: list[str]) -> list[str]`: emits camelCase / snake_case / PascalCase / kebab-case versions of a multi-word phrase. Capped at 6 variants per phrase.
  - `expand_query(query: str, synonym_dict: dict[str, list[str]], max_variants: int) -> ExpandedQuery`: orchestrates split + variant + synonym OR-fan-out. Returns `ExpandedQuery(original, dense_variants, fts5_clause)`.
  - `apply_synonyms(words: list[str], synonym_dict: dict) -> list[list[str]]`: substitutes each synonym position with original + dictionary alternatives.
- **Code-domain synonym dictionary** as a curated default:
  - `{"walker": ["finder", "iterator", "traverser"], "finder": ["walker", "search"], "save": ["persist", "store", "write"], "load": ["fetch", "read", "get"], "util": ["helper", "tool"], "parser": ["lexer", "tokenizer"], "config": ["settings", "options"], "init": ["initialize", "setup", "bootstrap"], "delete": ["remove", "purge"], "create": ["add", "make", "new"]}` (~20 high-leverage pairs; document selection rationale in ADR-019).
- **Env-var contract**:
  - `COCOINDEX_QUERY_EXPANSION` bool, default `true`. Master kill-switch.
  - `COCOINDEX_QUERY_EXPANSION_MAX_VARIANTS` int, default `6`. Per-query cap to bound dense fan-out.
  - `COCOINDEX_QUERY_EXPANSION_SYNONYMS` JSON dict, default = curated dict above. Operator-extensible.
  - `COCOINDEX_QUERY_EXPANSION_DENSE_FANOUT` bool, default `true`. Whether to embed multiple variants (true) or concatenate variants into a single embed (false). Tradeoff: fan-out = more vectors → more candidates; concat = one vector → cheaper.
- **Integration in `query.py`**:
  - Before `_run_hybrid_search()` (or its equivalent), call `expand_query()` once per user query.
  - **Dense path**: if `DENSE_FANOUT=true`, embed each variant separately, do a single vec-search per variant, OR-merge candidate sets, dedup by `(file_path, chunk_id)`. Else, concat variants into one embed.
  - **FTS5 path**: use the `ExpandedQuery.fts5_clause` (OR-joined identifier variants quoted appropriately for SQLite FTS5 syntax) as the FTS5 query string.
  - Surface `ExpandedQuery` in result metadata for observability (logged at debug, included in JSONL trace when `COCOINDEX_RERANK_LOG_PATH` is set).
- **Bench gate**:
  - Run 18-probe corrected fixture against post-016 pipeline (with 015 chunking + 014 dedup active).
  - Expectation: hit rate ≥14/18, ideally improves on probes 1, 5, 12, 15.
  - Compare with `phase2-comparison-015-treesitter.md` (post-015 baseline) → save as `phase2-comparison-016-query-expansion.md`.
  - Write `phase2-comparison-015-vs-016-delta.md`.
- **Test coverage** ≥12 tests in `tests/test_query_expansion.py`:
  - camelCase split correctness
  - snake_case split correctness
  - PascalCase split correctness
  - kebab-case split correctness
  - SCREAMING_SNAKE split correctness
  - Already-split idempotence
  - Variant generation cap honored
  - Synonym expansion picks all alternatives
  - `expand_query` produces fts5_clause with correct SQLite OR syntax
  - Dense variants list is deduplicated
  - `COCOINDEX_QUERY_EXPANSION=false` returns single-variant ExpandedQuery (no-op)
  - Empty/whitespace query returns no-op safely

Out of scope:
- LLM-based query rewriting (operator wants deterministic; can be follow-on packet)
- Per-language identifier conventions (Java method naming vs Go naming) — start with universal rules, refine if bench shows per-language gaps
- Synonym dictionary curation tooling (manual JSON for now)
- Rewriting the FTS5 tokenizer itself — we expand the query, not the index
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | `cocoindex_code/query_expansion.py` exists with `split_compound_identifier`, `generate_identifier_variants`, `apply_synonyms`, `expand_query`, and an `ExpandedQuery` dataclass. All pure functions. |
| R2 | `COCOINDEX_QUERY_EXPANSION` env var added to `config.py` with default `true`. `=false` reverts pipeline to identical pre-016 behavior. |
| R3 | `COCOINDEX_QUERY_EXPANSION_MAX_VARIANTS` int env var with default `6`. Bounds dense fan-out. |
| R4 | `COCOINDEX_QUERY_EXPANSION_SYNONYMS` JSON dict env var, default = curated `~20`-entry synonym dictionary in §3 SCOPE. Operator can fully override or extend. |
| R5 | `COCOINDEX_QUERY_EXPANSION_DENSE_FANOUT` bool env var, default `true`. `=false` uses single concat'd embed. |
| R6 | `query.py` integration: `expand_query()` called once per user query before dense + FTS5 dispatch. Dense path honors `DENSE_FANOUT`. FTS5 path uses `ExpandedQuery.fts5_clause`. |
| R7 | Dense-fanout merge: candidate sets from each variant OR-merged, deduplicated by `(file_path, chunk_id)`, sorted by best-of variant score. Bounded by existing top-K config. |
| R8 | ≥12 unit tests in `tests/test_query_expansion.py` (cases enumerated in §3 SCOPE). All pass under `.venv/bin/python -m pytest tests/test_query_expansion.py`. |
| R9 | Bench gate: `bash phase2-bench/run-phase2-smoke.sh` with `FIXTURE_OVERRIDE=...corrected.json OUTPUT_TAG=-016-query-expansion`. Hit rate ≥ post-015 baseline. Probes 1/5/12/15 inspected for flip miss→hit. |
| R10 | Latency: p95 within 25% of post-015 baseline. Dense fan-out adds N-1 extra embed + vec-search calls (where N = variant count). Acceptable if hit-rate improves. If latency explodes, reduce `MAX_VARIANTS` default to 4. |
| R11 | ADR-019 appended to `004-spec-memory-embedder-bake-off/decision-record.md`. Cover: defect (NL→identifier gap), fix (pre-encode expansion + synonym OR-merge), env-var contract, rollback (`COCOINDEX_QUERY_EXPANSION=false`), latency tradeoff, synonym dict selection rationale. |
| R12 | Strict-validate PASSED on the 016 packet. |
| R13 | Existing pytest suite still green (zero regression). |
| R14 | `cocoindex_code/README.md` updated with a "Query expansion" section describing the env vars + behavior. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- R1-R14 satisfied.
- Bench: ≥14/18 holds; ideally ≥1 of probes {1, 5, 12, 15} flips miss → hit.
- Latency: p95 stays within 25% of post-015 baseline.
- All new and existing tests green.
- ADR-019 shipped.
- Strict-validate PASSED.
- `COCOINDEX_QUERY_EXPANSION=false` produces byte-identical query path to pre-016 (verifiable by side-by-side trace).
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Phase 1 — `query_expansion.py` module (~60 min):
1. `ExpandedQuery` dataclass: `original: str`, `dense_variants: list[str]`, `fts5_clause: str`, `expansion_applied: bool`.
2. `split_compound_identifier(token)`: regex-based split on case-transitions + separators (`_`, `-`).
3. `generate_identifier_variants(words)`: emit `joined_lower`, `camelCase`, `snake_case`, `PascalCase`, `kebab-case`, `SCREAMING_SNAKE`. Cap at 6.
4. `apply_synonyms(words, synonym_dict)`: returns expanded word-lists (each position can be original + alternatives). Combinatorial cap = 8 (sane default).
5. `expand_query(query, synonym_dict, max_variants)`: split query into tokens → identify candidate tokens → split → generate variants → apply synonyms → cap → build fts5_clause via `OR`-join with `"phrase"` quoting.
6. Unit tests for each pure function.

Phase 2 — config + env (~20 min):
1. Add 4 env vars to `config.py` with defaults + validators.
2. Curated synonym dictionary in module constant. Validators handle malformed JSON / empty dict by falling back to default + logging warning.

Phase 3 — `query.py` integration (~30 min):
1. Locate the query-entry hook in `query.py` (the function called by `query()` or `_run_hybrid_search()`).
2. Call `expand_query()` once per query.
3. Dense path: if `DENSE_FANOUT=true`, parallelize variant embeddings (use the same encoder, batch if available); else concat.
4. FTS5 path: pass `fts5_clause` as the FTS5 MATCH expression.
5. Merge candidate sets by `(file_path, chunk_id)`; sort by best-of variant similarity.
6. Log `ExpandedQuery` to debug log + `COCOINDEX_RERANK_LOG_PATH` JSONL when set.

Phase 4 — bench gate (~30 min):
1. Restart ccc daemon to pick up env defaults.
2. Run `phase2-bench/run-phase2-smoke.sh` with `OUTPUT_TAG=-016-query-expansion`.
3. Save to `evidence/phase2-comparison-016-query-expansion.md` + delta vs 015 baseline.
4. Inspect rerank-scores JSONL for probes 1/5/12/15: confirm body chunks now reach dense top-20.

Phase 5 — docs + ADR + validate (~30 min):
1. ADR-019.
2. `cocoindex_code/README.md` update.
3. L2 packet docs (plan/tasks/checklist/impl-summary/description/graph-metadata) per 013/014/015 shape.
4. Strict-validate. Iterate.

Total: ~2.5-3 hours wall.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

Risks:
- **Latency blow-up from dense fan-out**: 6 variants × 1 embed each = 6× embed latency. Mitigation: `MAX_VARIANTS=6` default keeps it bounded; `DENSE_FANOUT=false` falls back to single concat embed. Also: encoder batching when supported.
- **Over-expansion noise**: synonym OR-merge might pull irrelevant candidates into the rerank window, harming top-K precision. Mitigation: rerank still scores them; per-variant best-of merge minimizes dilution. Bench gate catches it.
- **FTS5 clause syntax**: SQLite FTS5 has specific OR/AND/NEAR syntax. Mitigation: dedicated test for `fts5_clause` correctness; fuzz with edge-case queries (single-quotes, parentheses).
- **Synonym dictionary bias**: curated dictionary may have blind spots. Mitigation: operator-extensible via env var; selected pairs documented in ADR-019 with rationale.
- **Interaction with 015 chunking**: tree-sitter chunks (post-015) may not contain identifier names if they're docstrings only. Mitigation: rerank corrects ranking even when expansion brings in noise.
- **Interaction with 014 dedup**: mirror-collapse already runs after candidate merge. No conflict expected (mirror prefixes are file_path-level, not content-level).

Dependencies:
- 015 SHIPPED (tree-sitter chunking) — REQUIRED. Bench gate compares to post-015 baseline.
- 014 SHIPPED (mirror dedup) — REQUIRED for clean candidate set.
- 013 SHIPPED (corrected fixture) — REQUIRED. Bench uses corrected fixture.
- Live `target_sqlite.db` built under bge-code-v1.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Per-query embed count ≤ `MAX_VARIANTS` (default 6).
- **NFR-P02**: p95 query latency within 25% of post-015 baseline.
- **NFR-P03**: Expansion logic itself adds < 1 ms per query (pure string ops).

### Reliability
- **NFR-R01**: `COCOINDEX_QUERY_EXPANSION=false` produces byte-identical query path to pre-016 (verifiable trace).
- **NFR-R02**: Malformed `COCOINDEX_QUERY_EXPANSION_SYNONYMS` JSON falls back to default dict with logged warning.

### Compatibility
- **NFR-C01**: Expansion is embedder-agnostic — runs on the query string before any encoder.
- **NFR-C02**: Expansion is reranker-agnostic — the reranker sees candidates merged from variants but doesn't need to know about expansion.
- **NFR-C03**: SQLite FTS5 v5+ syntax compliance.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Empty/whitespace query**: returns `ExpandedQuery(original=query, dense_variants=[query], fts5_clause=query, expansion_applied=false)`.
- **Single-word query** (`"walker"`): generates synonyms only (no compound split).
- **Already-identifier query** (`"findFiles"`): splits into ["find", "files"] → generates variants → may match the original itself; dedup handles.
- **All-stopwords query**: no expansion; behaves as pre-016.
- **Very long query** (>20 words): expand only first N tokens; remaining tokens passthrough.
- **Quoted phrase**: skip identifier splitting inside quotes; preserve verbatim.
- **`MAX_VARIANTS=0`**: disables variant generation; equivalent to `EXPANSION=false`.
- **Synonym dict has cycle** (`"a"→"b"`, `"b"→"a"`): expansion is single-hop only; no recursive expansion.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|------:|-------|
| Scope | 22/25 | New module, 4 env vars, query.py integration, bench, ≥12 tests, ADR, docs |
| Risk | 18/25 | Behavior-changing pipeline addition; rollback env + bench gate reduce blast radius |
| Research | 14/20 | 011 phase-2 bench evidence + identifier convention rules are well-understood; synonym dict needs curation judgment |
| **Total** | **54/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- **Default `DENSE_FANOUT=true` vs `false`?** Recommendation: start `true` (more recall); flip if latency unacceptable.
- **Synonym dictionary versioning?** For now, the dict is a module constant + env override. Future: ship as JSON file under `cocoindex_code/data/synonyms.json` for git-history visibility.
- **Should expansion run for non-natural-language queries (e.g., already-identifier strings)?** Yes — split + variants still help (e.g., `findFiles` → also try `find_files`). Cheap and additive.
- **Per-language tuning?** Out of scope for this packet. Universal rules first.
- **LLM-based rewriting follow-on?** Deferred. Deterministic expansion is the floor; LLM expansion can layer on later.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Arc parent: `../spec.md` (004-code-index-stack)
- Predecessor packets (shipped): `../013-bench-harness-and-fixture-audit/`, `../014-mirror-dedup-canonical-preference/`, `../015-code-aware-chunking-tree-sitter-stage-b/`
- Trigger evidence: `../011-rerank-model-fit-investigation/research/phase2-bench/phase2-comparison-corrected.md` (probes 1, 5, 12, 15 are NL→identifier gap)
- Successor packets: `../017-hybrid-fusion-empirical-recalibration/`, `../018-rerank-matrix-rebench/`
- ADR target: `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` (append ADR-019)
- Reuses helpers from: `../014-mirror-dedup-canonical-preference/` (path_utils.py — not directly used here, but same module style)
<!-- /ANCHOR:cross-links -->
