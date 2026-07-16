---
title: "Plan: 016/004/015 Code-Aware Tree-sitter Chunking"
description: "Implementation plan for CocoIndex Code tree-sitter code-aware chunking, grammar registry, indexer dispatch, tests, re-index, bench evidence, ADR-018, and validation."
trigger_phrases: ["016/004/015 plan", "code-aware chunking plan", "tree-sitter chunking plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/015-code-aware-chunking-tree-sitter"
    last_updated_at: "2026-05-19T12:31:25Z"
    last_updated_by: "codex"
    recent_action: "Implemented code-aware chunker; re-index blocked by sandbox"
    next_safe_action: "Retry ccc index outside sandbox, then run corrected Phase 2 bench"
    blockers:
      - "CocoIndex core raises RuntimeError: Operation not permitted (os error 1) during coco.Environment initialization"
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/chunkers/code_aware.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/chunkers/grammars.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_code_aware_chunker.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004015"
      session_id: "016-004-015-plan"
      parent_session_id: "016-004-015"
    completion_pct: 75
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 016/004/015 Code-Aware Tree-sitter Chunking

<!-- ANCHOR:summary -->
## 1. SUMMARY

This packet replaces blind line-window chunking for supported source languages with tree-sitter definition chunks. The code path is complete and unit-verified. The live DB re-index and corrected Phase 2 bench remain blocked in this sandbox because CocoIndex core cannot initialize its environment.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria | Status |
|---|---|---|
| Grammar install | All six grammar wheels import and parse tiny snippets | Passed |
| Splitter API | `CodeAwareSplitter.split(text, language) -> list[Chunk]` | Passed |
| Fallback | Unsupported language and opt-out preserve `RecursiveSplitter` | Passed |
| Oversize safety | Single definition above `2 * chunk_size` splits internally | Passed |
| Tests | Targeted and full pytest suites pass | Passed |
| Re-index | `ccc reset --force && ccc index` with `bge-code-v1` | Blocked |
| Bench | Corrected 18-probe Phase 2 smoke | Blocked by re-index |
| Docs | ADR, README, install guide, packet docs | In progress |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`chunkers/grammars.py` owns the `GrammarSpec` registry and lazy tree-sitter language loading. `chunkers/code_aware.py` owns AST traversal, doc-comment inclusion, `Chunk` position construction, and oversize fallback. `indexer.py` keeps dispatch narrow: supported grammar plus enabled flag gets code-aware chunking; everything else uses the original module-level `RecursiveSplitter`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Dependencies And Grammar Smoke

- Add tree-sitter and six grammar wheels to `pyproject.toml`.
- Refresh the editable install.
- Smoke-test parser creation for Python, TypeScript/TSX, JavaScript, Go, Rust, and Java.

### Phase 2: Splitter And Registry

- Add `GrammarSpec`, baseline registry, and env-driven override parsing.
- Add `CodeAwareSplitter` with top-level definition extraction.
- Include immediately preceding doc comments.
- Split oversized definitions with `RecursiveSplitter`.

### Phase 3: Indexer Dispatch And Tests

- Add `COCOINDEX_CODE_AWARE_CHUNKING` and `COCOINDEX_TREE_SITTER_LANGUAGES`.
- Dispatch in `process_file()` via `_split_chunks()`.
- Add unit coverage for six languages, doc comments, oversize fallback, unsupported fallback, and opt-out.

### Phase 4: Re-index And Bench

- Stop daemon.
- Run `ccc reset --force && ccc index` with `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/BAAI/bge-code-v1`.
- Inspect `structural-indexer.ts` chunk count and body chunk placement.
- Run corrected Phase 2 bench and write comparison/delta evidence.

Current status: reset ran, but index failed because CocoIndex core raises `Operation not permitted` during `coco.Environment(...)`. Bench is blocked until the DB is rebuilt.

### Phase 5: Docs And Validation

- Append ADR-018.
- Update README and install guide.
- Write packet docs and evidence placeholders.
- Run diff check and strict validation where possible.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Result |
|---|---|
| Grammar smoke | Passed |
| `python -m pytest tests/test_code_aware_chunker.py tests/test_config.py -q` | Passed, `38 passed` |
| `python -m pytest tests/ -q` | Passed, `118 passed` |
| `python -m ruff check cocoindex_code tests/test_code_aware_chunker.py tests/test_config.py` | Passed |
| Full re-index | Blocked by CocoIndex core environment error |
| Corrected Phase 2 bench | Blocked by missing rebuilt DB |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Tree-sitter Python bindings and grammar wheels: `tree-sitter`, `tree-sitter-python`, `tree-sitter-typescript`, `tree-sitter-javascript`, `tree-sitter-go`, `tree-sitter-rust`, `tree-sitter-java`.
- Existing CocoIndex `RecursiveSplitter` for unsupported languages and oversize fallback.
- Corrected 014 bench baseline at `phase2-comparison-corrected.md`.
- bge-code-v1 embedding model for the required re-index and bench lane.
- CocoIndex core environment creation; currently blocked in this sandbox.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Set `COCOINDEX_CODE_AWARE_CHUNKING=false`, restart the daemon, and run `ccc reset --force && ccc index`. Full rollback reverts the chunkers module, config/indexer dispatch, dependency additions, tests, README/install updates, ADR-018, and packet docs.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. L2: PHASE DEPENDENCIES

```
Dependencies -> Splitter -> Dispatch/tests -> Re-index -> Bench -> Docs/validate
```

| Phase | Depends On | Blocks |
|---|---|---|
| Dependencies | Existing venv and pyproject | Splitter smoke |
| Splitter | Grammar registry | Dispatch and tests |
| Dispatch/tests | Config and indexer reads | Re-index |
| Re-index | CocoIndex core environment creation | Bench |
| Bench | Fresh bge-code-v1 DB | Completion claim |
| Docs/validate | Code and evidence state | Handoff |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|---|---|---|
| Dependencies | Low | Added packages and refreshed editable install |
| Splitter | High | Implemented registry, AST extraction, positions, fallbacks |
| Tests | Medium | Added 12 splitter/dispatch tests plus config coverage |
| Re-index/bench | High | Attempted; blocked by sandbox environment error |
| Docs | Medium | ADR, README, install guide, packet docs, evidence placeholders |
| Total | High | Code complete; operational validation blocked |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Runtime opt-out exists.
- [x] Unsupported languages use original splitter.
- [x] No query-time or reranker behavior changed.
- [ ] Fresh DB rebuilt after chunk boundary change.

### Data Reversal
- **Has data migrations?** No schema migration.
- **Requires re-index?** Yes, because chunk content and embeddings change.
- **Reversal procedure**: flip the env flag, restart daemon, reset and re-index.
<!-- /ANCHOR:enhanced-rollback -->
