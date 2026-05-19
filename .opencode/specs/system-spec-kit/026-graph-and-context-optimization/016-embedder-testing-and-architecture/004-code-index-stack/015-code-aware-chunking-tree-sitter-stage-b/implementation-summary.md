---
title: "Summary: 016/004/015 Code-Aware Tree-sitter Chunking"
description: "Implementation summary for CocoIndex Code tree-sitter code-aware chunking, grammar registry, indexer dispatch, tests, docs, and blocked re-index/bench gates."
trigger_phrases: ["016/004/015 summary", "code-aware chunking summary", "tree-sitter chunking summary"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/015-code-aware-chunking-tree-sitter-stage-b"
    last_updated_at: "2026-05-19T15:35:00Z"
    last_updated_by: "main-agent"
    recent_action: "Bench gate ran; 015 result documented"
    next_safe_action: "Commit 015 + dispatch 016 to start recall recovery on body chunks"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/chunkers/code_aware.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/chunkers/grammars.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_code_aware_chunker.py"
      - "evidence/phase2-comparison-015-treesitter.md"
      - "evidence/phase2-comparison-014-vs-015-delta.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004015"
      session_id: "016-004-015-summary"
      parent_session_id: "016-004-015"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Summary: 016/004/015 Code-Aware Tree-sitter Chunking

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete (2026-05-19) — code + tests + docs + ADR + re-index + bench gate all ran; mixed-result verdict documented |
| Updated | 2026-05-19 |
| Level | 2 |
| Scope | CocoIndex chunker, config, indexer dispatch, tests, README/install guide, ADR, packet docs |
| SpawnAgent | Not used |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### Chunker Module

`cocoindex_code/chunkers/` now contains:

| File | Purpose |
|---|---|
| `__init__.py` | Public exports for the chunker package |
| `grammars.py` | `GrammarSpec`, six-language tree-sitter registry, aliases, lazy language loading, and env override parsing |
| `code_aware.py` | `CodeAwareSplitter`, AST definition chunk extraction, doc-comment inclusion, oversize fallback, and unsupported fallback |
| `README.md` | Node-type map and rollback documentation |

### Config And Dispatch

`config.py` now exposes:

| Setting | Default | Behavior |
|---|---|---|
| `COCOINDEX_CODE_AWARE_CHUNKING` | `true` | Enables tree-sitter chunking for supported languages |
| `COCOINDEX_TREE_SITTER_LANGUAGES` | `{}` | Adds grammar specs via JSON object |

`indexer.py` now routes supported languages through `CodeAwareSplitter` and preserves `RecursiveSplitter` for disabled or unsupported paths.

### Files Changed

| File | Action | Purpose |
|---|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | Modified | Add tree-sitter dependencies |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modified | Add chunking env config |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | Modified | Add code-aware dispatch |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/chunkers/*` | Created | Grammar registry and splitter |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_code_aware_chunker.py` | Created | Splitter and dispatch tests |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py` | Modified | Config tests; preserves existing 014 mirror-config additions |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/README.md` | Modified | Document chunker behavior |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | Modified | Document dependencies and re-index requirement |
| `004-spec-memory-embedder-bake-off/decision-record.md` | Modified | Append ADR-018 |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The implementation was delivered in one local pass without SpawnAgent. The first two sequential-thinking MCP calls and the remaining three required calls all returned `user cancelled MCP tool call`; the work proceeded with explicit visible planning, source reads, and verification rather than claiming the MCP succeeded.

Code edits were limited to the CocoIndex chunking path, config, tests, and documentation requested by the packet. Existing 014 mirror-config test changes in `tests/test_config.py` were preserved and extended.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|---|---|
| Keep dispatch in `indexer.py` narrow | Avoids introducing a second chunking pipeline and preserves the original fallback path |
| Lazy-load tree-sitter languages | Keeps module import cheap and lets invalid override entries fail only when used |
| Return real `Chunk` objects | Matches the current CocoIndex contract without adapter shims |
| Fall back on parse errors and empty definition sets | Ensures files never disappear from the index because grammar parsing was unavailable |
| Use `RecursiveSplitter` for oversized definitions | Reuses the known chunk semantics and avoids unbounded god-function chunks |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|---|---|
| Sequential-thinking MCP | Attempted 5 times; tool returned `user cancelled MCP tool call` each time |
| SpawnAgent | PASS: not used |
| Grammar smoke | PASS: six grammars import and parse snippets |
| Targeted pytest | PASS: `38 passed` |
| Full MCP server pytest | PASS: `118 passed` |
| Ruff | PASS: `All checks passed` |
| Local structural-indexer splitter probe | PASS: body chunks emitted for `findFiles` and `indexFiles`; import/header not emitted |
| `ccc reset --force` | RAN: old DB files deleted (inside codex sandbox) |
| `ccc index` (codex sandbox) | BLOCKED: `RuntimeError: Operation not permitted (os error 1)` from CocoIndex core |
| `ccc index` (main-agent recovery) | PASS: 83,527 chunks across 8,469 files (typescript 61,050 / javascript 11,158 / python 4,224 / bash 3,597 / markdown 3,464) |
| Corrected Phase 2 bench | RAN — 3 lanes × 18 probes; see `evidence/phase2-comparison-015-treesitter.md` |
| Per-lane hits | baseline-bge 12/18 (−2 vs 014), bge-path-class 13/18 (−1), jina-v3 14/18 (=) |
| `structural-indexer.ts` body-chunk shift | PASS: probe 14 hits on bge-path-class — load-bearing 015 win |
| Probes 1 + 15 (universal gains) | PASS — body-chunk addressability surfaces the right function/class |
| Probes 10/13/18 BGE-family regression | DOCUMENTED — expected pipeline interplay; 016 query expansion recovers lexical surface; 017 RRF recalibration + 018 rerank-matrix close the loop |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **015 standalone is not the final shipping state.** Tree-sitter body chunks lose lexical surface for BGE-family rerankers, producing a transient regression on probes 10/13/18 (BGE-baseline) and 13 (jina-v3). The architectural change is correct; recall recovery is the explicit responsibility of 016 (query expansion) + 017 (RRF tuning) + 018 (rerank-matrix re-bench).
2. **Probe 14 — the original import-header chunking-starvation bug from 011 iter 6 — is now HIT on bge-path-class.** This is the load-bearing 015 win and validates the architectural premise.
3. **`structural-indexer.ts` local splitter count is 100 AST chunks**, not the speculative 10-20. The body chunks are present and the import/header is no longer emitted as its own chunk; the actual count reflects the file's many top-level interfaces, types, and functions.
4. **Total corpus chunks ≈83,527** (61k TS + 11k JS + 4k Py + bash/markdown via RecursiveSplitter fallback). Mirror dedup (014) runs at query-time, not index-time, so all 4 mirror prefixes remain indexed.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:retry -->
## 7. RETRY STEPS

Run from the repo root in a normal shell:

```bash
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc daemon stop
COCOINDEX_CODE_EMBEDDING_MODEL=sbert/BAAI/bge-code-v1 \
  .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc reset --force
COCOINDEX_CODE_EMBEDDING_MODEL=sbert/BAAI/bge-code-v1 \
  .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc index
```

Then run the corrected Phase 2 bench with:

```bash
FIXTURE_OVERRIDE=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/code-retrieval-fixture-corrected.json \
OUTPUT_TAG=-015-treesitter \
COMPARISON_OUTPUT=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/015-code-aware-chunking-tree-sitter-stage-b/evidence/phase2-comparison-015-treesitter.md \
bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/run-phase2-smoke.sh
```
<!-- /ANCHOR:retry -->

## Commit Handoff

No git commit was made. Intended commit scope is the files listed in §2 plus packet evidence and metadata. Exclude unrelated pre-existing worktree changes.
