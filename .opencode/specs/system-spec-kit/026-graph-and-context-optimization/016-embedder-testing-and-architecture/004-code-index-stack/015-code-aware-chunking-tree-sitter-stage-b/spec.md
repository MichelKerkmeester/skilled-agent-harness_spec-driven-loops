---
title: "Spec: 016/004/015 Code-Aware (Tree-Sitter) Chunking — Stage B"
description: "Replaces RecursiveSplitter's blind line-windowing with AST-aware chunking that respects class/function/interface/method boundaries. Uses tree-sitter grammars for TypeScript, Python, JavaScript, Go, Rust, Java, and falls back to RecursiveSplitter for unsupported languages. Each top-level definition becomes its own chunk (with full body + JSDoc/docstring), so the highest-ranked chunk for a query has rich semantic content instead of a 9-line import header. Future-proof: new languages drop in by adding a grammar. Embedder-agnostic, reranker-agnostic. The biggest expected leverage in the future-proofing arc — addresses the 70% load-bearing 'top chunk is starved' amplifier surfaced in 011 deep-research iter 6."
trigger_phrases:
  - "016/004/015 tree-sitter chunking"
  - "code-aware chunker stage b"
  - "ast-aware code chunking"
  - "cocoindex code splitter"
  - "RecursiveSplitter replacement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/015-code-aware-chunking-tree-sitter-stage-b"
    last_updated_at: "2026-05-19T12:31:25Z"
    last_updated_by: "codex"
    recent_action: "Implemented code-aware chunker and tests; re-index blocked by sandbox"
    next_safe_action: "Retry ccc index outside sandbox, then run corrected Phase 2 bench"
    blockers:
      - "CocoIndex core raises RuntimeError: Operation not permitted (os error 1) during coco.Environment initialization"
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004015"
      session_id: "016-004-015"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions:
      - "Tree-sitter or other AST library? Tree-sitter — already a transitive dep (system-code-graph skill uses it for structural-indexer.ts). py-tree-sitter has Python bindings. Multi-language grammars are battle-tested."
      - "Fallback for unsupported languages? RecursiveSplitter (existing behavior). Markdown/text stay on the line-window chunker."
      - "Re-index required? YES — chunk boundaries change, content hashes change, embeddings must regenerate."
      - "Stage B name? Yes — 008-chunking-strategy-tuning was Stage A (RecursiveSplitter tuning). This is the AST upgrade."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 016/004/015 Code-Aware (Tree-Sitter) Chunking — Stage B

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete (2026-05-19) — architecturally correct + mixed bench result honestly documented; recall recovery is 016/017/018's job |
| Type | Indexer rewrite — new CodeAwareSplitter + tree-sitter grammar registry |
| Owner | Codex |
| Parent | `../spec.md` (004-code-index-stack) |
| Position in arc | 3 of 6 (BIGGEST expected leverage — addresses the 70% load-bearing chunking starvation finding) |
| Stage | B (Stage A was 008-chunking-strategy-tuning — RecursiveSplitter parameter tuning. Stage B is the AST upgrade.) |
| Sibling packets | 013/014 shipped, 016 (query expansion), 017 (hybrid recalib), 018 (rerank matrix re-bench) |
| Triggered by | 011/research/cocoindex-internals-deep-dive iter 6 ranked chunking as 70% load-bearing amplifier (chunk 44683 = 9-line import header for structural-indexer.ts beat richer body chunks at dense rank 1) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The current `RecursiveSplitter` (indexer.py:33-39, defaults chunk_size=1500, overlap=200, min=250) produces chunks by line-window, ignoring code structure. For `structural-indexer.ts` (2,234 lines, 67 chunks), the chunk that surfaces at dense rank 1 for the probe "filesystem walker that emits typed structural symbols and import edges" is **chunk 44683 = lines 1-9** — the import header — not the `findFiles` function (1391-1465) or the class body (anywhere). The reranker is starved of content.

Per 011 deep-research iter 6 (DeepSeek synthesis):
- 95% load-bearing: BGE reranker's lexical-overlap preference
- **70% amplifier: chunking gives the reranker information-poor candidates**
- "Fixing EITHER factor would likely resolve probe 14"

Jina-v3 succeeded on the same chunks because its scoring is less lexical-biased — but BGE / mxbai / Qwen3 / future cross-encoders inherit the same starvation. Fix the chunker once, every embedder + reranker benefits.

The fix is tree-sitter-based AST-aware chunking that emits one chunk per top-level definition (class, function, interface, method, struct, enum) WITH its associated JSDoc/docstring and decorator/attribute prefix. Files without grammar support fall through to RecursiveSplitter.

Future-proof contract:
- Multi-language registry: TypeScript, Python, JavaScript, Go, Rust, Java baseline. Operator extends via `COCOINDEX_TREE_SITTER_LANGUAGES` env or registry plugin.
- Embedder-agnostic — same chunks for every model.
- Reranker-agnostic — same content for every cross-encoder.
- Backward compatible — env flag `COCOINDEX_CODE_AWARE_CHUNKING=false` reverts to RecursiveSplitter.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- **New `CodeAwareSplitter` class** in `cocoindex_code/chunkers/code_aware.py` (or sibling location). Public API matches RecursiveSplitter's contract (`split(text: str, language: str) -> list[Chunk]` returning chunks with `content`, `start_line`, `end_line` fields). Internally uses `tree_sitter` + per-language grammars.
- **Per-language chunking strategy**:
  - **TypeScript/JavaScript** (`.ts`, `.tsx`, `.js`, `.jsx`, `.mts`, `.cts`): emit one chunk per top-level `class_declaration`, `function_declaration`, `interface_declaration`, `type_alias_declaration`, `enum_declaration`, plus arrow-function declarations at module scope. Include preceding JSDoc + decorators in the chunk.
  - **Python** (`.py`, `.pyi`): emit one chunk per top-level `class_definition`, `function_definition`, decorated forms. Include preceding docstring + decorators.
  - **Go** (`.go`): emit one chunk per top-level `function_declaration`, `method_declaration`, `type_declaration` (struct/interface). Include doc comments.
  - **Rust** (`.rs`): emit one chunk per top-level `function_item`, `struct_item`, `enum_item`, `trait_item`, `impl_item`. Include `///` doc comments.
  - **Java** (`.java`): emit one chunk per top-level `class_declaration`, `interface_declaration`, `method_declaration`. Include Javadoc + annotations.
- **Grammar registry** in `cocoindex_code/chunkers/grammars.py`: `LANGUAGE_GRAMMARS: dict[str, GrammarSpec]` mapping language id → tree-sitter language object + node-type list. Operator can extend via `COCOINDEX_TREE_SITTER_LANGUAGES` (JSON map from language id to grammar/node-type pair).
- **Chunk size safety**: if a single definition exceeds `chunk_size * 2`, split it via RecursiveSplitter within the AST node (so a 5,000-line god-function doesn't produce one 5,000-line chunk). Split boundary preference: nested function/class > paragraph break > line.
- **Fallback path**: unsupported languages (markdown, sql, html, css, json, text) continue to use RecursiveSplitter. Operator can disable code-aware chunking globally via `COCOINDEX_CODE_AWARE_CHUNKING=false`.
- **Indexer integration**: `indexer.py:process_file()` dispatches to CodeAwareSplitter for grammar-supported languages, RecursiveSplitter otherwise. The dispatch lives in `indexer.py` or a small `chunker_dispatch.py` helper.
- **Re-index step**: `ccc reset --force && ccc index` with `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/BAAI/bge-code-v1`. Wall time expected 15-40 min on MPS per 008 historical data + 011/research iter 8. This rebuilds the 628 MB target_sqlite.db under the new chunks.
- **Bench gate**: re-run 18-probe corrected bench against new chunks. Compare to 014's 14/18 baseline. EXPECTED: ≥1 of probes {1, 5, 12, 15} flips miss → hit (those are the code-pipeline failures most plausibly addressable by chunking). NO regression on existing 14/18 hits.
- **Test coverage**: ≥10 unit tests in `tests/test_code_aware_chunker.py` covering: per-language grammar dispatch (5+ langs), small file (single chunk), large file (multi-chunk), nested classes, decorated functions, fallback for unsupported language, env flag disables chunking, oversized definition split, JSDoc/docstring inclusion, line-range accuracy.
- **Documentation**: ADR-018 appended to `004-spec-memory-embedder-bake-off/decision-record.md`. Update `cocoindex_code/README.md` chunker section. Update `INSTALL_GUIDE.md` to mention tree-sitter dependencies.

Out of scope:
- Cross-file chunk linking (multi-chunk dependency graph) — separate concern
- Symbol-level granularity below function (statement-level chunks) — overkill for retrieval
- mk-spec-memory chunker (different codebase, different stack)
- Query expansion (that's 016)
- Hybrid recalibration (that's 017)
- Reranker swap (that's 018)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | `CodeAwareSplitter` class exists in `cocoindex_code/chunkers/code_aware.py` with `split(text, language) -> list[Chunk]` API matching RecursiveSplitter's contract. |
| R2 | Grammar registry in `cocoindex_code/chunkers/grammars.py` with TypeScript, JavaScript, Python, Go, Rust, Java baseline support. Operator extensibility via `COCOINDEX_TREE_SITTER_LANGUAGES` JSON env. |
| R3 | Per-language node-type maps documented in code comments AND in chunkers/README.md. Each grammar's top-level definition node types listed exhaustively. |
| R4 | Oversized definition safety: if a single AST-node-derived chunk exceeds `chunk_size * 2`, fall back to RecursiveSplitter within the node. |
| R5 | `COCOINDEX_CODE_AWARE_CHUNKING` env flag (default `true`). Setting `false` reverts to RecursiveSplitter for all languages — clean opt-out. |
| R6 | Indexer dispatch: `process_file()` checks language + flag, dispatches to CodeAwareSplitter when applicable, RecursiveSplitter otherwise. No double-chunking. |
| R7 | ≥10 unit tests in `tests/test_code_aware_chunker.py`, all pass. Existing test suite unchanged (104+ tests stay green). |
| R8 | Full re-index against bge-code-v1 completes successfully. Wall time documented in implementation-summary (informational, not a hard gate). |
| R9 | Bench gate: 18-probe corrected bench under CodeAwareSplitter chunks → ≥14/18 hits (no regression) AND ≥1 of probes {1, 5, 12, 15} flips miss → hit. If no flips, document the reason (probes might need 016 query expansion too — that's the next packet). |
| R10 | ADR-018 appended. `cocoindex_code/README.md` chunker section updated. `INSTALL_GUIDE.md` mentions `py-tree-sitter` + per-language `tree-sitter-<lang>` package install (use the pip wheels — `tree-sitter-python`, `tree-sitter-typescript`, `tree-sitter-go`, `tree-sitter-rust`, `tree-sitter-java`, `tree-sitter-javascript`). |
| R11 | Strict-validate PASSED on the 015 packet. |
| R12 | `git diff --check` clean (no trailing whitespace, no merge conflict markers). |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:nfr -->
## 5. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|---|---|
| Compatibility | Unsupported languages and `COCOINDEX_CODE_AWARE_CHUNKING=false` must preserve pre-015 `RecursiveSplitter` behavior. |
| Performance | Tree-sitter parsing must be lazy and bounded to indexing-time work; query-time behavior is unchanged. |
| Extensibility | New grammars should be addable through the registry or `COCOINDEX_TREE_SITTER_LANGUAGES` without editing `indexer.py`. |
| Operability | Chunk-boundary changes require an explicit re-index and a documented runtime rollback path. |
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 6. EDGE CASES

| Edge Case | Handling |
|---|---|
| Unsupported language | Fall back to `RecursiveSplitter`. |
| Parser failure or syntax-error tree | Fall back to `RecursiveSplitter`. |
| File with no definition nodes | Fall back to `RecursiveSplitter` so content is still indexed. |
| Oversized function/class | Split inside that definition with `RecursiveSplitter`. |
| Decorated or documented definitions | Include decorators when the grammar wraps them and immediately preceding doc comments. |
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 7. COMPLEXITY

This is Level 2 work: it changes production indexing behavior and requires unit coverage, docs, a re-index, and retrieval bench evidence, but it does not introduce a schema migration or cross-service architecture change.
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:success-criteria -->
## 8. SUCCESS CRITERIA

- R1-R12 satisfied.
- Probe 14 ("filesystem walker"): the chunk that reaches dense rank 1 for structural-indexer.ts is NOT the 9-line import header anymore — it's a body chunk containing `findFiles`, `StructuralIndexer`, or `indexFiles`. Verify via rerank-scores JSONL inspection.
- ≥1 of probes {1, 5, 12, 15} flips miss → hit in baseline-bge lane on the corrected fixture. If 0 flips, document as "chunking necessary-but-not-sufficient; 016 query expansion is the next leverage point."
- ZERO probe regressions on the existing 14/18 hits.
- Strict-validate PASSED.
- Tree-sitter packages installable and importable from the mcp-coco-index venv.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 9. APPROACH

Phase 1 — install tree-sitter + grammars (~10 min):
1. Add `tree-sitter`, `tree-sitter-python`, `tree-sitter-typescript`, `tree-sitter-go`, `tree-sitter-rust`, `tree-sitter-java`, `tree-sitter-javascript` to `pyproject.toml` (or `requirements.txt`) of mcp-coco-index.
2. `.venv/bin/pip install -e .` to refresh.
3. Smoke-test: `python -c "from tree_sitter import Language, Parser; ..."` for each grammar.

Phase 2 — grammar registry + CodeAwareSplitter (~60 min):
1. `chunkers/grammars.py`: `GrammarSpec` dataclass + `LANGUAGE_GRAMMARS` registry.
2. `chunkers/code_aware.py`: `CodeAwareSplitter.split()`. Walk AST top-level nodes, build chunks. Include doc-comment prefix. Oversize fallback to RecursiveSplitter.
3. Helper: `_extract_top_level_definitions(tree, language_spec) -> list[Node]`.
4. Helper: `_node_to_chunk(node, source_text, include_preceding_comment) -> Chunk`.

Phase 3 — indexer integration + tests (~60 min):
1. `indexer.py:process_file()` dispatch logic.
2. `chunker_dispatch.py` (or inline in indexer.py): language → splitter resolution.
3. ≥10 unit tests in `tests/test_code_aware_chunker.py`. Use real grammar files where practical; mock only when grammar load is too slow.
4. Run full test suite: `pytest tests/` — must stay green.

Phase 4 — re-index + bench gate (~30-50 min):
1. `ccc reset --force && ccc index` with `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/BAAI/bge-code-v1`.
2. Verify chunk count for structural-indexer.ts changed (should DROP from 67 — fewer chunks but each richer).
3. Run `bash phase2-bench/run-phase2-smoke.sh` with `FIXTURE_OVERRIDE=...corrected.json OUTPUT_TAG=-015-treesitter` + `COMPARISON_OUTPUT=015/evidence/phase2-comparison-015-treesitter.md`.
4. Inspect rerank-scores JSONL for probe 14: confirm body chunk reaches rank 1 instead of import header.

Phase 5 — docs + validate (~20 min):
1. ADR-018 append.
2. README + INSTALL_GUIDE updates.
3. L2 packet docs (plan/tasks/checklist/impl-summary/description/graph-metadata) per 013/014 pattern.
4. Strict-validate. Iterate.

Total: ~2.5-3 hours wall.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 10. RISKS & DEPENDENCIES

Risks:
- **Tree-sitter pip wheel availability on macOS arm64**: most grammars ship as pip wheels but quality varies. Mitigation: verify install in Phase 1; if any grammar fails, fall back gracefully + document the gap.
- **Chunk count drops dramatically**: tree-sitter chunks are bigger (whole functions/classes vs line windows). The corpus may have FEWER total chunks, which could hurt FTS5 recall. Mitigation: monitor chunk count post-reindex; if recall drops, consider hybrid (AST chunk + fine-grained sub-chunks).
- **Oversize definitions** (5000-line god-functions): need the chunk_size*2 fallback. Mitigation: test coverage requirement R4.
- **Re-index wall time**: 15-40 min wall blocks bench. Mitigation: run in background per memory `feedback_bash_daemon_via_python_setsid`.
- **Performance**: tree-sitter parsing adds overhead vs line-windowing. On 8,440 files × ~5KB avg, expect parsing overhead ~5-10 min addition to index time. Mitigation: profile if needed; cache parsed trees.

Dependencies:
- 014 shipped (mirror dedup). REQUIRED — clean candidate set for bench.
- bge-code-v1 model cached (already pulled from prior packets).
- Tree-sitter ecosystem (pip wheels for grammars).
- Live filesystem access for re-indexing.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 11. OPEN QUESTIONS

- Should the chunker emit OVERLAPPING chunks at definition boundaries (e.g., include the previous function's signature for context) like RecursiveSplitter does? Recommendation: NO for v1 — AST chunks should be self-contained. Reconsider if recall hurts.
- Should we add a `_class_aware` mode that emits class-level chunks PLUS per-method chunks (hierarchical)? Recommendation: defer to a follow-on packet (would double chunk count).
- Tree-sitter language IDs vs file-extension mapping: who owns the source of truth? Recommendation: `chunkers/grammars.py` LANGUAGE_GRAMMARS uses language ID; `indexer.py` already has extension → language mapping; reuse that.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 12. CROSS-LINKS

- Arc parent: `../spec.md` (004-code-index-stack)
- Predecessor shipped: `../013-bench-harness-and-fixture-audit/`, `../014-mirror-dedup-canonical-preference/`
- Stage A (existing): `../008-chunking-strategy-tuning/` (RecursiveSplitter parameter defaults)
- Trigger evidence: `../011-rerank-model-fit-investigation/research/cocoindex-internals-deep-dive/iterations/iteration-002.md` (chunk 44683 evidence), `iteration-006.md` (70% amplifier ranking)
- Successor packets: 016 (query expansion), 017 (hybrid recalib), 018 (rerank matrix re-bench)
- ADR target: `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` (ADR-018)
- Bench baseline: `../014-mirror-dedup-canonical-preference/evidence/phase2-comparison-014-dedup.md` (14/18 ceiling 015 must hold or improve)
<!-- /ANCHOR:cross-links -->
