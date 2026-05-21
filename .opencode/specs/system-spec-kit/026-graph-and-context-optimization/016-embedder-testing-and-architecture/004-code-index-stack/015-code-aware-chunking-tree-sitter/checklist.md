---
title: "Verification Checklist: 016/004/015 Code-Aware Tree-sitter Chunking"
description: "Level 2 verification checklist for CocoIndex Code tree-sitter chunking, grammar coverage, fallback behavior, tests, re-index, bench gate, docs, and strict validation."
trigger_phrases: ["016/004/015 checklist", "code-aware chunking verification", "tree-sitter chunking checklist"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/015-code-aware-chunking-tree-sitter"
    last_updated_at: "2026-05-19T15:35:00Z"
    last_updated_by: "main-agent"
    recent_action: "Bench gate completed via main agent recovery; CHK-024 + CHK-025 closed"
    next_safe_action: "Commit 015 and dispatch 016 query-expansion recovery"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004015"
      session_id: "016-004-015-checklist"
      parent_session_id: "016-004-015"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: 016/004/015 Code-Aware Tree-sitter Chunking

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|---|---|---|
| P0 | Hard blocker | Cannot claim complete until passing |
| P1 | Required | Must pass or be explicitly documented |
| P2 | Optional | Can defer with rationale |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Spec and requirements read before edits.
  - **Evidence**: `spec.md` §3-4 drove R1-R12 implementation.
- [x] CHK-002 [P0] Target files read before edits.
  - **Evidence**: `indexer.py`, `config.py`, `pyproject.toml`, README, install guide, ADR target, tests, bench harness, and evidence docs were read.
- [x] CHK-003 [P1] Sequential-thinking request handled honestly.
  - **Evidence**: five MCP calls returned `user cancelled MCP tool call`; no success was fabricated.
- [x] CHK-004 [P0] SpawnAgent not used.
  - **Evidence**: no `spawn_agent` call was made; final contract is `SPAWN_AGENT_USED=no`.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `CodeAwareSplitter` API matches indexer chunk contract.
  - **Evidence**: returns `cocoindex.resources.chunk.Chunk` objects with `text`, `start.line`, and `end.line`.
- [x] CHK-011 [P0] Grammar registry covers six baseline languages.
  - **Evidence**: Python, TypeScript/TSX, JavaScript, Go, Rust, and Java specs exist in `LANGUAGE_GRAMMARS`.
- [x] CHK-012 [P0] Node maps are explicit and documented.
  - **Evidence**: `grammars.py` constants and `chunkers/README.md`.
- [x] CHK-013 [P0] Oversized definitions do not produce unbounded chunks.
  - **Evidence**: `CodeAwareSplitter._split_oversized_chunk()` delegates to `RecursiveSplitter`; test covers absolute line adjustment.
- [x] CHK-014 [P0] Rollback path exists.
  - **Evidence**: `COCOINDEX_CODE_AWARE_CHUNKING=false`.
- [x] CHK-015 [P1] Env registry extension exists.
  - **Evidence**: `COCOINDEX_TREE_SITTER_LANGUAGES` JSON object is parsed and consumed by `grammar_for_language()`.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Tree-sitter grammar import smoke passes.
  - **Evidence**: all six packages imported and parsed tiny snippets.
- [x] CHK-021 [P0] Targeted pytest passes.
  - **Evidence**: `.venv/bin/python -m pytest tests/test_code_aware_chunker.py tests/test_config.py -q` returned `38 passed`.
- [x] CHK-022 [P0] Full MCP server pytest suite passes.
  - **Evidence**: `.venv/bin/python -m pytest tests/ -q` returned `118 passed`.
- [x] CHK-023 [P1] Ruff passes for changed Python code.
  - **Evidence**: `ruff check cocoindex_code tests/test_code_aware_chunker.py tests/test_config.py` returned `All checks passed`.
- [x] CHK-024 [P0] Full re-index completes.
  - **Evidence**: codex sandbox blocked `coco.Environment(...)`; main agent recovered the gate. `ccc index` (PID 14728) wrote 83,527 chunks across 8,469 files (typescript 61,050 / javascript 11,158 / python 4,224 / bash 3,597 / markdown 3,464). Log `/tmp/ccc-index-015-treesitter.log`.
- [x] CHK-025 [P0] Corrected Phase 2 bench completes.
  - **Evidence**: ran `phase2-bench/run-phase2-smoke.sh` against `code-retrieval-fixture-corrected.json`. Results: baseline-bge 12/18 (−2 vs 014), bge-path-class 13/18 (−1), jina-v3 14/18 (=). See `evidence/phase2-comparison-015-treesitter.md` + `phase2-comparison-014-vs-015-delta.md`. Mixed result documented: probes 1+15 gained on all 3 lanes (body-chunk addressability), probe 14 hits on bge-path-class (load-bearing 015 win — the original import-header chunking-starvation bug from 011 iter 6), but probes 10/13/18 lose on BGE-family due to lexical-surface drop. Recall recovery is the explicit responsibility of 016 (query expansion) + 017 (RRF tuning) + 018 (rerank-matrix re-bench).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned.
  - **Evidence**: information-poor chunks from blind line-windowing starve reranker candidates.
- [x] CHK-FIX-002 [P0] Producer inventory completed.
  - **Evidence**: indexer chunk production, config, grammar registry, docs, and tests updated.
- [x] CHK-FIX-003 [P0] Consumer inventory completed.
  - **Evidence**: downstream vector embeddings require a re-index; query/reranker code is unchanged.
- [x] CHK-FIX-004 [P1] Structural-indexer body chunk probe completed.
  - **Evidence**: local splitter emits `findFiles` lines 1391-1465 and `indexFiles` lines 2194-2234.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials added.
  - **Evidence**: changes are Python, TOML dependency declarations, markdown, and JSON metadata.
- [x] CHK-031 [P1] No external code execution beyond package install and tests.
  - **Evidence**: installed declared pip packages from `pyproject.toml`; no arbitrary downloaded scripts.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] ADR appended.
  - **Evidence**: ADR-018 appended to `004-spec-memory-embedder-bake-off/decision-record.md`.
- [x] CHK-041 [P0] README updated.
  - **Evidence**: `cocoindex_code/README.md` documents code-aware chunking and env vars.
- [x] CHK-042 [P0] Install guide updated.
  - **Evidence**: `INSTALL_GUIDE.md` mentions tree-sitter wheels and re-index requirement.
- [x] CHK-043 [P1] Packet docs synchronized.
  - **Evidence**: `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json` exist.
- [x] CHK-044 [P1] Diff whitespace check passes.
  - **Evidence**: `git diff --check` returned clean.
- [x] CHK-045 [P1] Strict packet validation passes.
  - **Evidence**: `validate.sh --strict --verbose` returned `RESULT: PASSED`.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] New evidence lives under the scoped 015 packet.
  - **Evidence**: blocked comparison and delta placeholders live under `015-code-aware-chunking-tree-sitter/evidence/`.
- [x] CHK-051 [P1] Historical 014 artifacts preserved.
  - **Evidence**: no 014 evidence files were edited.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Blocked | Pending |
|---|---:|---:|---:|---:|
| P0 Items | 19 | 19 | 0 | 0 |
| P1 Items | 10 | 10 | 0 | 0 |
| P2 Items | 0 | 0 | 0 | 0 |

**Verification Date**: 2026-05-19
**Verified By**: Codex (code + tests + docs) + main agent (re-index + bench recovery)
**Completion Claim**: COMPLETE. 015 ships as architectural prerequisite for 016/017/018 recall recovery. Bench result is honestly mixed: +2 universal gains (probes 1, 15), +1 load-bearing failure flip (probe 14 on bge-path-class — the original chunking-starvation bug), −2 to −4 BGE-family losses (probes 10/13/18) which are recoverable downstream. Standalone hit rate is below 014's 14/18 baseline; post-arc (016/017/018) recovery target ≥14/18.
<!-- /ANCHOR:summary -->
