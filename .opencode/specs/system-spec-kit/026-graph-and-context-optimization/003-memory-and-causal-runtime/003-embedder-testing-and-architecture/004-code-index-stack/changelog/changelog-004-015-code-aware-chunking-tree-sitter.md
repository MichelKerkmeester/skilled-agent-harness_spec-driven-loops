---
title: "Code Index Stack Phase 015: Code-Aware Tree-Sitter Chunking"
description: "RecursiveSplitter blind line-windowing replaced with AST-aware chunking for TypeScript, JavaScript, Python, Go, Rust and Java. Each top-level definition becomes its own chunk with preceding doc-comment included. The import-header starvation bug (chunk 44683) that blocked BGE-family retrieval is fixed. Mixed bench result documented honestly: probes 1 and 15 gain universally while probes 10/13/18 show a transient regression pending 016 query expansion."
trigger_phrases:
  - "code-aware chunking tree-sitter"
  - "ast chunking cocoindex"
  - "tree-sitter grammar registry cocoindex"
  - "import header starvation fix"
  - "CodeAwareSplitter dispatch"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/015-code-aware-chunking-tree-sitter` (Level 2)
> Parent packet: `026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

The CocoIndex MCP server split code files using `RecursiveSplitter` with fixed line windows. For `structural-indexer.ts` (2,234 lines), the chunk surfacing at dense rank 1 for the "filesystem walker" probe was the 9-line import header, not the `findFiles` or `indexFiles` function bodies. BGE-family rerankers were starved of semantic content on every supported language.

A new `CodeAwareSplitter` class was built using tree-sitter grammars for TypeScript, JavaScript, Python, Go, Rust and Java. Each top-level definition (class, function, interface, method, struct, enum) becomes its own chunk with the immediately preceding doc-comment or decorator prefix included. Oversize definitions fall back to `RecursiveSplitter` inside the AST node. Unsupported languages and the `COCOINDEX_CODE_AWARE_CHUNKING=false` opt-out path preserve pre-015 behavior. The corrected Phase 2 bench ran across 18 probes with the bge-code-v1 embedder: probes 1 and 15 gained universally, probe 14 (the original starvation case) now hits on bge-path-class. Probes 10/13/18 show a transient BGE-family regression because body chunks lose the lexical surface that query expansion (016) and RRF recalibration (017) are responsible for recovering.

### Added

- `cocoindex_code/chunkers/grammars.py` with `GrammarSpec` dataclass, six-language tree-sitter registry, lazy language loading, extension aliases and `COCOINDEX_TREE_SITTER_LANGUAGES` JSON env override parsing
- `cocoindex_code/chunkers/code_aware.py` with `CodeAwareSplitter`, AST definition extraction, doc-comment inclusion, oversize fallback to `RecursiveSplitter`, parse-error fallback and unsupported-language fallback
- `cocoindex_code/chunkers/__init__.py` exporting the public chunker package surface
- `COCOINDEX_CODE_AWARE_CHUNKING` boolean config field (default `true`) and `COCOINDEX_TREE_SITTER_LANGUAGES` JSON config field in `config.py`
- `tests/test_code_aware_chunker.py` (NEW) with 38 targeted test cases covering grammar dispatch, small files, large files, oversized definitions, decorated functions, fallback paths, env kill-switch and line-range accuracy
- ADR-018 appended to `004-spec-memory-embedder-bake-off/decision-record.md` recording the AST-chunking architectural decision

### Changed

- `indexer.py` dispatch in `_split_chunks()` now routes supported languages through `CodeAwareSplitter` and preserves `RecursiveSplitter` for disabled or unsupported paths. No double-chunking.
- `tests/test_config.py` extended with config tests for the code-aware flag and tree-sitter registry override. Existing 014 mirror-config test additions preserved.
- `pyproject.toml` updated with tree-sitter package dependencies for TypeScript, JavaScript, Python, Go, Rust and Java grammars.

### Fixed

- The import-header starvation bug: for `structural-indexer.ts` the dense-rank-1 chunk is now a body definition instead of the 9-line import header. Probe 14 hits on the bge-path-class lane, which is the load-bearing 015 win.
- Unsupported-language and parse-error paths now fall through cleanly instead of producing empty or malformed chunk sets.

### Verification

| Check | Result |
|---|---|
| Grammar smoke | PASS: six grammars import and parse snippets correctly |
| Targeted pytest | PASS: 38 passed |
| Full MCP server pytest | PASS: 118 passed |
| Ruff | PASS: All checks passed |
| Local structural-indexer splitter probe | PASS: body chunks emitted for `findFiles` and `indexFiles`. Import/header not emitted. |
| `ccc reset --force` | RAN: old DB files deleted (inside codex sandbox) |
| `ccc index` main-agent recovery | PASS: 83,527 chunks across 8,469 files (TypeScript 61,050, JavaScript 11,158, Python 4,224, bash 3,597, markdown 3,464) |
| Corrected Phase 2 bench | RAN: 3 lanes x 18 probes against bge-code-v1 |
| baseline-bge lane | 12/18 (down 2 vs 014 baseline) |
| bge-path-class lane | 13/18 (down 1 vs 014 baseline) |
| jina-v3 lane | 14/18 (no regression vs 014 baseline) |
| Probe 14 starvation fix | PASS: body chunk reaches rank 1 on bge-path-class |
| Probes 1 and 15 universal gains | PASS: body-chunk addressability surfaces correct function/class |
| Strict packet validation | PASS: exit 0, zero errors, zero warnings |

### Files Changed

| File | What changed |
|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | Tree-sitter grammar package dependencies added |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | `COCOINDEX_CODE_AWARE_CHUNKING` and `COCOINDEX_TREE_SITTER_LANGUAGES` config fields added |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | `_split_chunks()` dispatch added to route supported languages through `CodeAwareSplitter` |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/chunkers/__init__.py` (NEW) | Public exports for the chunker package |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/chunkers/grammars.py` (NEW) | Six-language tree-sitter grammar registry with lazy loading and env override |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/chunkers/code_aware.py` (NEW) | `CodeAwareSplitter` with definition extraction, doc-comment inclusion, oversize and fallback paths |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/README.md` | Chunker behavior and node-type map documented |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | Tree-sitter dependencies and re-index requirement documented |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_code_aware_chunker.py` (NEW) | 38 test cases for splitter dispatch, grammar paths, fallbacks and env kill-switch |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py` | Config tests extended for code-aware flag and registry override |

Shipped in commit `cd8f04bc32` (2026-05-19).

### Follow-Ups

- Complete recall recovery for probes 10/13/18 via packet 016 (query expansion) which restores lexical surface for BGE-family rerankers on body-only chunks.
- Validate RRF recalibration impact on the transient regression lanes via packet 017.
- Close the full rerank-matrix re-bench to confirm no net regressions after 016 and 017 land via packet 018.
- Add a "broad-scope scan with code-aware chunker verification" scenario to the manual testing playbook once the skill re-integration path is settled.
