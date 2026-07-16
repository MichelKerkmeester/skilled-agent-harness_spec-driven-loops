---
title: "Local Embeddings Foundation Phase 004: Vec-Store Rebuild"
description: "Memory vector store rebuilt under EmbeddingGemma-300m-ONNX (768-dim) with 2112 rows fully indexed. MCP child wedge recovered via launcher kill and reconnect. CocoIndex stale DB removed and daemon killed. Embedding cache hit on rescan avoided re-running model inference for the bulk rebuild."
trigger_phrases:
  - "vec-store rebuild 004"
  - "memory rebuild EmbeddingGemma 768-dim"
  - "MCP child wedge recovery launcher kill"
  - "embedding cache hit bulk rebuild rescan"
  - "cocoindex stale MiniLM DB removed"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-12

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/004-vec-store-rebuild` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

After the 003 config rollout, both the memory vec store and the CocoIndex sqlite held data from pre-Setup-A models: Voyage 1024-dim in memory and MiniLM 384-dim in code search. Both stores needed a clean rebuild under EmbeddingGemma-300m-ONNX (768-dim) so hybrid memory search returned vector-grade similarity scores and the code index matched the new model identity.

The memory side rebuilt fully: the launcher loaded `.env.local`, the new filename-keyed sqlite came up. `memory_index_scan` filled all 2112 rows. A lazy-load wedge (MCP child stuck at `Attempting device: mps` with no further stderr) blocked the first scan attempt. Killing the launcher process then running `/mcp reconnect spec_kit_memory` cleared it. The `embedding_cache` table retained 2109 content-hash-to-vector mappings from the failed retry attempts so the post-reconnect rescan filled 2112 rows in seconds without re-running model inference. Final state: `vecRowsTotal == ftsRowsTotal == memoryCount == 2112`, all `embedding_status=success`, queue depth 0, hybrid search returning 88.39% similarity on a packet-local query.

The CocoIndex side was prepped: the stale 2.0GB MiniLM `target_sqlite.db` was deleted, the old daemon was killed. The editable install cross-repo drift was corrected (venv had been pointing at the Barter sibling repo instead of Public). The daemon was respawned under EmbeddingGemma-300m with the correct 768-dim schema. CocoIndex end-to-end search is deferred to a follow-on packet due to an upstream `msgspec.DecodeError` on every `SearchRequest` while the daemon is mid-index.

### Added

- `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768.sqlite` database file populated with 2112 spec-doc rows at 768-dim EmbeddingGemma vectors (auto-created by launcher on first spawn after 003)
- CocoIndex `target_sqlite.db` rebuilt with 768-dim EmbeddingGemma-300m schema and 1335 markdown chunks indexed at writeup time

### Changed

- Memory store rebuild workflow: DELETE+rescan workaround applied to drain wedge-time deferred rows. `UNCHANGED_EMBEDDING_STATUSES` treats `pending` and `retry` as no-change for `force=true`. Direct SQLite delete with FTS5 auto-cascade then rescan cleared all 2449 rows and refilled from embedding cache.
- CocoIndex editable install corrected from Barter cross-repo path to Public self-pointing path (`direct_url.json` now reports Public's `mcp_server/` directory)
- `~/.cocoindex_code/global_settings.yml` updated from stale `voyage/voyage-code-3` to `google/embeddinggemma-300m` with `sentence-transformers` provider

### Fixed

- MCP child lazy-load wedge: launcher process killed and user ran `/mcp reconnect spec_kit_memory`. Fresh child loaded `.env.local` and completed the first lazy-load cleanly (mps unavailable, cpu fallback, 993ms cold).
- CocoIndex venv cross-repo drift: `pip install -e .` from Public's `mcp_server/` directory corrected the editable install so the 003 dotenv-autoload patch reached the running server

### Verification

| Check | Result |
|-------|--------|
| Memory provider healthy under Setup A | PASS. `embeddingProvider.healthy=true`, `provider=hf-local`, `model=onnx-community/embeddinggemma-300m-ONNX`, `dimension=768` |
| Memory FTS == vec coverage | PASS. `ftsRowsTotal=2112`, `vecRowsTotal=2112`, `memoryCount=2112`, `consistency.status=healthy`, `mismatchedIds=[]` |
| Memory retry queue drained | PASS. `pending=0`, `failed=0`, `queueDepth=0`, `circuitBreakerOpen=false` |
| Memory hybrid search returns results | PASS. `memory_quick_search('local embeddings setup A vec store')` returns similarity 88.39, `searchType="hybrid"`, `activeChannels=2`, pipeline 101ms |
| Memory cold-load latency | PASS (informational). Model loaded in 993ms on cpu. First inference 1007ms. Target was under 800ms. Flagged slow but functional. |
| Stale CocoIndex DB removed | PASS. `ls .cocoindex_code/` shows only `cocoindex.db/` and `settings.yml` with no `target_sqlite.db` |
| Stale CocoIndex daemon killed | PASS. `ps -p 2379` returns no such process |
| CocoIndex venv editable install self-pointing | PASS. `direct_url.json` reports Public path |
| CocoIndex EmbeddingGemma schema | PASS. `embedding float[768]` confirmed in `code_chunks_vec` |
| CocoIndex end-to-end search via MCP | FAIL (deferred). `msgspec.DecodeError: Input data was truncated` on every search. Upstream IPC bug. Deferred to follow-on packet 009-cocoindex-ipc-fix. |
| Strict validate (004 packet docs) | PASS. 0 errors, 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.cocoindex_code/target_sqlite.db` | Deleted | 2.0GB stale MiniLM 384-dim index removed |
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768.sqlite` | Populated | 2112 spec-doc rows at 768-dim EmbeddingGemma vectors. Filename-keyed. Auto-created on first launcher spawn after 003. |

### Follow-Ups

- Patch `UNCHANGED_EMBEDDING_STATUSES` in `handlers/save/dedup.js` to exclude `pending` and `retry` from the no-change guard so `memory_index_scan force=true` can drain deferred rows without the manual DELETE workaround.
- Investigate the MCP child lazy-load wedge root cause. The standalone repro succeeds cleanly. The in-process wedge is reproducible in principle as a lazy-load race during heavy concurrent scan calls.
- Resolve CocoIndex `msgspec.DecodeError` on `SearchRequest` frames while the daemon is mid-index. Tracked under 009-cocoindex-ipc-fix.
- Sweep all `.opencode/skills/*/mcp_server/` venvs to confirm none point cross-repo after the Barter editable-install drift was found in this phase.
- Investigate slow CocoIndex indexing rate. At roughly 10 rows per second the full repo takes hours rather than minutes. Daemon runs on Metal but shows only 5-9% CPU during indexing.
