---
title: "Phase Parent Rollup: spec memory stack"
description: "Rollup of 19 child phase changelogs under 002-spec-memory-stack. Each child shipped independently and is listed in the Included Phases table. Detail lives in the child changelogs."
trigger_phrases:
  - "002-spec-memory-stack rollup"
  - "002-spec-memory-stack phase parent"
  - "002-spec-memory-stack changelog index"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack` (Level <!-- SPECKIT_LEVEL: phase-parent -->, Phase Parent)

### Summary

This phase parent groups 19 child phases spanning 2026-05-17 to 2026-05-23. Each child phase shipped independently and carries its own changelog with full detail. The Included Phases table below is the authoritative child inventory. Read each child changelog for the per-phase summary, verification, and files changed.

### Included Phases

| Changelog | Date | Title |
|-----------|------|-------|
| [changelog-002-001-adapter-interface.md](./changelog-002-001-adapter-interface.md) | 2026-05-17 | 016/001: EmbedderAdapter Interface and EmbedderRegistry |
| [changelog-002-002-ollama-backend-and-multi-dim-schema.md](./changelog-002-002-ollama-backend-and-multi-dim-schema.md) | 2026-05-17 | 016/002: Ollama backend adapter and dim-tagged vec schema |
| [changelog-002-003-mcp-tools-and-reindex.md](./changelog-002-003-mcp-tools-and-reindex.md) | 2026-05-17 | 016/003: Embedder MCP tools and re-index orchestrator |
| [changelog-002-004-spec-memory-embedder-bake-off.md](./changelog-002-004-spec-memory-embedder-bake-off.md) | 2026-05-17 | 016/004: mk-spec-memory text-embedder bake-off. jina-v3 + retrieval-rescue layer ships |
| [changelog-002-006-ollama-encode-path-wiring.md](./changelog-002-006-ollama-encode-path-wiring.md) | 2026-05-18 | 016/002/006: Ollama encode-path wiring |
| [changelog-002-007-auto-embedder-selection-and-llama-cpp-purge.md](./changelog-002-007-auto-embedder-selection-and-llama-cpp-purge.md) | 2026-05-18 | Spec Memory Stack Phase 007: Auto-Embedder Selection and llama-cpp Purge |
| [changelog-002-008-byte-aware-health-telemetry.md](./changelog-002-008-byte-aware-health-telemetry.md) | 2026-05-18 | Byte-Aware Health Telemetry |
| [changelog-002-009-byte-bounded-embedding-cache.md](./changelog-002-009-byte-bounded-embedding-cache.md) | 2026-05-19 | Byte-Bounded Profile-Aware Embedding Cache |
| [changelog-002-010-embedder-sidecar-execution.md](./changelog-002-010-embedder-sidecar-execution.md) | 2026-05-19 | Embedder Sidecar Execution: Process-Isolated Local Embedding |
| [changelog-002-011-lazy-startup-gating.md](./changelog-002-011-lazy-startup-gating.md) | 2026-05-19 | Spec Memory Stack Phase 011: Lazy Startup Gating |
| [changelog-002-012-canonical-vector-shard-split.md](./changelog-002-012-canonical-vector-shard-split.md) | 2026-05-19 | Canonical Vector Shard Split |
| [changelog-002-013-bm25-fts5-rag-fusion-investigation.md](./changelog-002-013-bm25-fts5-rag-fusion-investigation.md) | 2026-05-19 | BM25 FTS5 RAG Fusion Investigation |
| [changelog-002-014-fts5-default-lexical-with-guardrails.md](./changelog-002-014-fts5-default-lexical-with-guardrails.md) | 2026-05-19 | FTS5 Default Lexical With Guardrails |
| [changelog-002-015-cascade-reorder-and-nomic-hf-local-default.md](./changelog-002-015-cascade-reorder-and-nomic-hf-local-default.md) | 2026-05-19 | Local-First Cascade Reorder and Nomic hf-local Default (ADR-014) |
| [changelog-002-016-reindex-populates-vec-memories-knn-table.md](./changelog-002-016-reindex-populates-vec-memories-knn-table.md) | 2026-05-19 | Phase 016: reindex dual-write and factory shard fallback restore memory_search semantic confidence |
| [changelog-002-017-factory-shard-fallback-for-hf-voyage-openai.md](./changelog-002-017-factory-shard-fallback-for-hf-voyage-openai.md) | 2026-05-19 | Factory Shard Fallback Audit: hf-local, Voyage, OpenAI Resolver Investigation |
| [changelog-002-018-constitutional-quality-gate-exemption.md](./changelog-002-018-constitutional-quality-gate-exemption.md) | 2026-05-19 | Constitutional Quality Gate Exemption for memory_index_scan |
| [changelog-002-019-lineage-and-metadata-repair-runner.md](./changelog-002-019-lineage-and-metadata-repair-runner.md) | 2026-05-19 | Spec Memory Stack Phase 019: Lineage and Metadata Repair Runner |
| [changelog-002-020-embedder-default-drift-fix.md](./changelog-002-020-embedder-default-drift-fix.md) | 2026-05-23 | Spec Memory Stack Phase 020: Embedder Default Drift Fix |

### Added

- None. Detail lives in the child phase changelogs.

### Changed

- None. Detail lives in the child phase changelogs.

### Fixed

- None. Detail lives in the child phase changelogs.

### Verification

- All 19 child phases were verified independently. See each child changelog for per-phase verification evidence.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/` (child phases) | n/a | Rollup of 19 child phase changelogs, no direct source changes at the parent level |

### Follow-Ups

- None.
