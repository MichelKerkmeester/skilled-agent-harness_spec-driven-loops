---
title: "Implementation Summary: 014/009 cocoindex-ipc-fix"
description: "Search-only daemon path patched and verified; explicit refresh/index remains blocked in cocoindex Rust core Environment initialization."
trigger_phrases:
  - "014/009 cocoindex IPC fix done"
  - "msgspec truncation resolved"
  - "cocoindex daemon stall resolved"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/009-cocoindex-ipc-fix"
    last_updated_at: "2026-05-12T21:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Patched search-only path"
    next_safe_action: "Patch Rust core indexing blocker"
    blockers:
      - "Explicit index/refresh fails in cocoindex._internal.core.abi3.so with RuntimeError: Operation not permitted (os error 1)"
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140090a8b0c0000000000000000000000000000000000000000000000000004"
      session_id: "014-009-cocoindex-ipc-2026-05-12"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-cocoindex-ipc-fix |
| **Completed** | Not shipped — root cause documented |
| **Level** | 1 |
| **Status** | Root cause documented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented a read-only search path that bypasses CocoIndex Rust `Environment` setup when a caller searches an existing `target_sqlite.db` without first issuing an explicit index request. The original daemon search path always loaded a full project, which could start or wait for indexing before querying SQLite; with the 1335-row index stall, that made plain search block before any useful `SearchResponse`.

Added gated IPC diagnostics with `COCOINDEX_CODE_IPC_DEBUG=1`. In the isolated source daemon, daemon-side `SearchResponse` send and client-side receive both reported `1857` bytes with matching msgpack hex prefixes, and the client decoded the response successfully. That rules out `multiprocessing.connection.recv_bytes()` truncation for the patched search path.

Explicit refresh/index is still blocked. `ccc index` reaches `cocoindex._internal.core.abi3.so` via `coco.Environment(...)` and fails with `RuntimeError: Operation not permitted (os error 1)` before the language sweep can start. The current database therefore remains markdown-only (`markdown: 1335`) until the Rust-core environment issue is patched upstream/fork-side.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modified | Added gated IPC send diagnostics, error logging around `send_bytes`, and a `SearchOnlyContext` so read-only search can query SQLite without constructing a full CocoIndex project. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py` | Modified | Added gated client-side raw response byte logging before `decode_response`. |
| `scratch/verify-direct.py` | Added | Direct sqlite-vec KNN regression script against the existing `target_sqlite.db`. |
| `scratch/blocker.md` | Added | Documents the remaining Rust-core blocker for explicit refresh/index. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Executed the three-phase diagnostic locally without sub-agents. Because the live home daemon could not be restarted from the sandbox (`kill` and stale socket cleanup were denied), verification used an isolated source daemon under `/private/tmp/coco009` plus a copied project database under `/private/tmp/coco009-project`. The editable packet venv was invoked directly via `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc`; the global `ccc` on `PATH` points at a separate pipx install and was not used for final verification.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use a search-only context for `SearchRequest` | Search with `refresh_index=false` should read from the existing vector DB. Constructing a full CocoIndex environment couples search availability to indexing health and Rust/LMDB initialization. |
| Keep IPC diagnostics gated behind `COCOINDEX_CODE_IPC_DEBUG=1` | The packet needed byte evidence, but normal CLI output should not be noisy after the fix. |
| Document explicit index as Rust-core blocked | The remaining failure occurs inside compiled `cocoindex._internal.core.abi3.so` during `core.Environment(...)`, before Python indexing code can sweep languages. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| End-to-end daemon search | `COCOINDEX_CODE_DIR=/private/tmp/coco009 COCOINDEX_CODE_IPC_DEBUG=1 .../.venv/bin/ccc search "embedding initialization" --limit 3` | PASS — `SearchResponse` sent/received as 1857 bytes; decoded with 3 results. Evidence: `scratch/repro-temp-project-after-patch.txt`, `/private/tmp/coco009/daemon.log`. |
| Direct sqlite-vec regression | `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python scratch/verify-direct.py` | PASS — 3 KNN rows returned; nearest row distance `0.000000`. |
| p95 search latency | 20 warmed `DaemonClient.search(... limit=1)` calls | PASS — p95 `141.82 ms`, min `136.15 ms`, max `143.74 ms`. |
| Daemon indexes source code | `COCOINDEX_CODE_DIR=/private/tmp/coco009 .../.venv/bin/ccc index` | FAIL/BLOCKED — `Daemon error: Operation not permitted (os error 1)` from `cocoindex._internal.core.abi3.so`. |
| Strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` | PASS — exit 0 after documenting the root-cause state. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Explicit refresh/index remains blocked in the Rust core** — `cocoindex._internal.core.abi3.so` raises `RuntimeError: Operation not permitted (os error 1)` while constructing `core.Environment(...)`. Python code never reaches `indexer.py`'s per-language sweep in this failure mode.
2. **The existing target DB is still markdown-only** — `SELECT language, COUNT(*) FROM code_chunks_vec GROUP BY language` returns `markdown: 1335`. Search works against that DB, but source-code language coverage is not restored yet.
3. **The live home daemon could not be restarted from this sandbox** — verification used an isolated daemon and copied DB. The source patch should take effect for the real daemon after a restart in a shell with permission to stop PID `59317`.
<!-- /ANCHOR:limitations -->
