---
title: "Tasks: 016/004/015 Code-Aware Tree-sitter Chunking"
description: "Task ledger for CocoIndex Code tree-sitter chunker implementation, verification, blocked re-index, bench evidence, ADR-018, and packet validation."
trigger_phrases: ["016/004/015 tasks", "code-aware chunking tasks", "tree-sitter chunking tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/015-code-aware-chunking-tree-sitter"
    last_updated_at: "2026-05-19T12:31:25Z"
    last_updated_by: "codex"
    recent_action: "Completed code and tests; re-index blocked"
    next_safe_action: "Retry re-index and bench outside the current sandbox"
    blockers:
      - "CocoIndex core cannot initialize environment in this sandbox"
    key_files:
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004015"
      session_id: "016-004-015-tasks"
      parent_session_id: "016-004-015"
    completion_pct: 75
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 016/004/015 Code-Aware Tree-sitter Chunking

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` - completed
- `[ ]` - pending
- `[B]` - blocked
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T001 - Read `spec.md`, `indexer.py`, `config.py`, structural-indexer tree-sitter precedent, corrected baseline, bench harness, 013/014 summaries, ADR target, and 011 iteration evidence.
- [x] T002 - Invoke sequential-thinking MCP five times before edits. Evidence: all five calls returned `user cancelled MCP tool call`; this is recorded instead of fabricated.
- [x] T003 - Add tree-sitter dependencies to `pyproject.toml`.
- [x] T004 - Refresh editable install and verify grammar imports.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] T005 - Add `chunkers/__init__.py`.
- [x] T006 - Add `chunkers/grammars.py` with `GrammarSpec`, six-language baseline registry, lazy language loading, aliases, and env override parsing.
- [x] T007 - Add `chunkers/code_aware.py` with definition extraction, doc-comment inclusion, `Chunk` position construction, unsupported fallback, parse-error fallback, and oversize fallback.
- [x] T008 - Add `COCOINDEX_CODE_AWARE_CHUNKING` and `COCOINDEX_TREE_SITTER_LANGUAGES` config fields.
- [x] T009 - Add indexer dispatch through `_split_chunks()`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T010 - Add `tests/test_code_aware_chunker.py` covering TS class, TS arrow function, Python class, Python decorated function, Go function, Rust function, Java class, JSDoc inclusion, oversize fallback, unsupported fallback, opt-out, and enabled dispatch.
- [x] T011 - Extend config tests for code-aware flag and tree-sitter registry override.
- [x] T012 - Run targeted pytest. Evidence: `38 passed`.
- [x] T013 - Run full MCP server pytest suite. Evidence: `118 passed`.
- [x] T014 - Run ruff. Evidence: `All checks passed`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
## 5. PHASE 4: RE-INDEX AND BENCH

- [x] T015 - Stop daemon. Evidence: `Daemon stopped`.
- [x] T016 - Run `ccc reset --force`. Evidence: old DB files were deleted.
- [B] T017 - Run `ccc index` with `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/BAAI/bge-code-v1`. Blocker: daemon and direct in-process execution fail at `coco.Environment(...)` with `RuntimeError: Operation not permitted (os error 1)`.
- [x] T018 - Run local splitter probe on `structural-indexer.ts`. Evidence: `findFiles` and `indexFiles` are body chunks; import/header is not emitted.
- [B] T019 - Run corrected Phase 2 smoke bench with `OUTPUT_TAG=-015-treesitter`. Blocked by failed re-index.
- [B] T020 - Write real 014-vs-015 probe delta. Blocked by failed bench.
<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:phase-5 -->
## 6. PHASE 5: DOCS AND VALIDATION

- [x] T021 - Append ADR-018.
- [x] T022 - Update `cocoindex_code/README.md`.
- [x] T023 - Update `INSTALL_GUIDE.md`.
- [x] T024 - Add `chunkers/README.md`.
- [x] T025 - Write L2 packet docs and blocked evidence placeholders.
- [x] T026 - Run `git diff --check`. Evidence: clean.
- [x] T027 - Run strict spec validation. Evidence: `RESULT: PASSED`.
<!-- /ANCHOR:phase-5 -->

<!-- ANCHOR:completion -->
## 7. COMPLETION CRITERIA

- [x] R1 `CodeAwareSplitter` exists with matching `Chunk` API.
- [x] R2 Grammar registry supports TypeScript/TSX, JavaScript, Python, Go, Rust, and Java with env extension.
- [x] R3 Node-type maps documented in code and `chunkers/README.md`.
- [x] R4 Oversize definition fallback implemented.
- [x] R5 Code-aware chunking env opt-out implemented.
- [x] R6 Indexer dispatch implemented without double chunking.
- [x] R7 Unit tests and full tests pass.
- [B] R8 Full re-index blocked by CocoIndex core sandbox error.
- [B] R9 Bench gate blocked by failed re-index.
- [x] R10 ADR and docs updated.
- [x] R11 Strict validate passed.
- [x] R12 `git diff --check` clean.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 8. CROSS-REFERENCES

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Summary: `implementation-summary.md`
- Evidence: `evidence/phase2-comparison-015-treesitter.md`
- Delta: `evidence/phase2-comparison-014-vs-015-delta.md`
<!-- /ANCHOR:cross-refs -->
