---
title: "Local Embeddings Foundation Phase 9: CocoIndex IPC Truncation Fix"
description: "The cocoindex daemon search path was patched to use a read-only SQLite context, bypassing the full Rust Environment setup that caused msgspec.DecodeError truncation on every search call. End-to-end search now works against the existing Setup A target_sqlite.db. Explicit refresh/index remains blocked by a Rust-core permission error, documented as a known follow-up."
trigger_phrases:
  - "cocoindex ipc truncation fix"
  - "msgspec DecodeError Input data was truncated"
  - "cocoindex daemon search path patch"
  - "SearchOnlyContext bypass cocoindex"
  - "cocoindex IPC fix 009"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-12

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/009-cocoindex-ipc-fix` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Under Setup A (EmbeddingGemma-300m), every search call through the cocoindex MCP and CLI path returned `msgspec.DecodeError: Input data was truncated`. Direct sqlite-vec KNN queries against the same `target_sqlite.db` succeeded, proving the data layer was healthy. The root cause was that the daemon search path constructed a full CocoIndex Rust `Environment` before querying SQLite. With the 1335-row markdown stall in effect, that construction blocked indefinitely before any `SearchResponse` was sent.

A `SearchOnlyContext` was introduced in `daemon.py` so that `refresh_index=false` searches query SQLite directly, without loading the Rust `Environment`. Gated IPC diagnostics (`COCOINDEX_CODE_IPC_DEBUG=1`) confirmed daemon-side and client-side byte counts matched at 1857 bytes with consistent msgpack hex prefixes. End-to-end daemon search now returns results at warm p95 latency of 141 ms.

Explicit refresh/index remains blocked. The `cocoindex._internal.core.abi3.so` binary raises `RuntimeError: Operation not permitted (os error 1)` during `core.Environment(...)` before the language-sweep pipeline starts. The existing target DB remains markdown-only (1335 rows) until the Rust-core issue is resolved upstream or via a fork patch.

### Added

- `SearchOnlyContext` in `daemon.py` that opens `target_sqlite.db` read-only for `refresh_index=false` searches, bypassing full `Environment` construction
- Gated IPC diagnostics behind `COCOINDEX_CODE_IPC_DEBUG=1` in `daemon.py` (send-bytes length and hex prefix before `send_bytes`)
- Gated client-side raw response byte logging in `client.py` before `decode_response`
- `scratch/verify-direct.py` as a direct sqlite-vec KNN regression script against the existing `target_sqlite.db`
- `scratch/blocker.md` documenting the Rust-core `Operation not permitted` blocker for explicit refresh/index

### Changed

- `daemon.py` `_handle_search`: search flow now routes through `SearchOnlyContext` instead of constructing a full project environment when `refresh_index=false`

### Fixed

- `cocoindex_code.search` returned `msgspec.DecodeError: Input data was truncated` on every call. The fix bypasses the Rust `Environment` setup that stalled before any response was sent.

### Verification

| Check | Command | Result |
|-------|---------|--------|
| End-to-end daemon search | `COCOINDEX_CODE_DIR=/private/tmp/coco009 COCOINDEX_CODE_IPC_DEBUG=1 .../.venv/bin/ccc search "embedding initialization" --limit 3` | PASS. `SearchResponse` sent and received as 1857 bytes. 3 results returned. Evidence in `scratch/repro-temp-project-after-patch.txt`. |
| Direct sqlite-vec regression | `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python scratch/verify-direct.py` | PASS. 3 KNN rows returned. Nearest row distance 0.000000. |
| p95 search latency | 20 warmed `DaemonClient.search(limit=1)` calls | PASS. p95 141.82 ms, min 136.15 ms, max 143.74 ms. |
| Daemon indexes source code | `COCOINDEX_CODE_DIR=/private/tmp/coco009 .../.venv/bin/ccc index` | FAIL/BLOCKED. `RuntimeError: Operation not permitted (os error 1)` from `cocoindex._internal.core.abi3.so`. |
| Strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` | PASS. Exit 0 after root-cause state documented. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modified | Added `SearchOnlyContext` for read-only search path. Added gated IPC diagnostics and error logging around `send_bytes`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py` | Modified | Added gated raw response byte logging before `decode_response`. |
| `009-cocoindex-ipc-fix/scratch/verify-direct.py` (NEW) | Added | Direct sqlite-vec KNN regression script against the existing `target_sqlite.db`. |
| `009-cocoindex-ipc-fix/scratch/blocker.md` (NEW) | Added | Documents the Rust-core `Operation not permitted` blocker for explicit refresh/index. |

### Follow-Ups

- Patch or fork the `cocoindex._internal.core.abi3.so` Rust core so `core.Environment(...)` can initialize without `Operation not permitted (os error 1)`. This unblocks explicit refresh/index and restores full language-sweep coverage beyond the current markdown-only 1335 rows.
- After the Rust-core fix lands, re-run `ccc index` and confirm `SELECT language, COUNT(*) FROM code_chunks_vec GROUP BY language` returns non-zero rows for at least three source-code languages (python, typescript, go).
- The `mcp-coco-index` skill was removed in a later chore commit. Confirm the patched `daemon.py` and `client.py` source is preserved or re-integrated wherever the cocoindex skill resurfaces.
