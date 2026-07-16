---
title: "Implementation Plan: Phase 9 — Cocoindex IPC Fix"
description: "Sequenced approach to diagnose msgspec.DecodeError: Input data was truncated and the daemon-stall-at-1335-markdown-rows bug. Reproduce, instrument both sides of the IPC, isolate to encode/decode/socket, patch in Public source, re-validate end-to-end search."
trigger_phrases:
  - "009 plan cocoindex IPC"
  - "msgspec truncation diagnosis plan"
  - "cocoindex daemon stall plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/009-cocoindex-ipc-fix"
    last_updated_at: "2026-05-12T21:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan filled with 3-phase diagnostic + patch flow"
    next_safe_action: "Execute Phase 1 reproduce + instrument"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0140090a8b0c0000000000000000000000000000000000000000000000000002"
      session_id: "014-009-cocoindex-ipc-2026-05-12"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9 — Cocoindex IPC Fix

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11 (cocoindex_code, sentence-transformers, multiprocessing.connection, msgspec); Rust (cocoindex `_internal/core.abi3.so` — likely the actual serialization site) |
| **Framework** | cocoindex 1.0.0a33 (alpha; upstream fork); litellm (no longer used under Setup A but still loaded) |
| **Storage** | SQLite + sqlite-vec extension (768-dim) for vectors; LMDB at `.cocoindex_code/cocoindex.db/mdb/` (~3GB) for cocoindex's internal index state |
| **Testing** | Manual cocoindex_code.search round-trip; direct sqlite-vec KNN as ground truth; `ccc search` CLI |

### Overview
Three-phase diagnostic: reproduce → instrument → patch. The data layer is proven healthy (direct sqlite-vec returns valid 768-dim KNN); fault is in cocoindex's IPC. Likely candidates: daemon encode emits truncated bytes due to a 768-dim float32 array hitting an msgspec/multiprocessing limit; OR daemon swallows an exception and sends a partial frame; OR client recv_bytes loses bytes when reading a frame whose length-prefix overflows. The 1335-markdown-row stall is a separate but related symptom (daemon also writes correct vectors but somehow gives up partway through the language set).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 004 shipped (memory side + cocoindex schema baseline)
- [x] Direct sqlite-vec KNN confirmed working (proves data layer)
- [ ] Repro is deterministic (Phase 1 deliverable)

### Definition of Done
- [ ] All REQ-001 through REQ-006 met
- [ ] Strict validate exits 0
- [ ] At least one direct manual check of `cocoindex_code.search` returning real results recorded in implementation-summary
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Diagnostic-first; fix-smallest. Three layers in scope:
1. **Daemon (Python `cocoindex_code/daemon.py`)** — owns the dispatch loop, calls `registry.search()` which invokes the Rust core, then encodes a SearchResponse and writes it to the Unix socket
2. **IPC (`multiprocessing.connection` + msgspec)** — length-prefixed binary framing
3. **Client (`cocoindex_code/client.py`)** — recv_bytes + decode_response

### Key Components
- **`registry.search()`** — calls `query_codebase()` in `query.py`; uses `embedder.embed()` for query-side embedding (EmbeddingGemma-300m via sentence-transformers); top-K KNN against `code_chunks_vec`
- **`SearchResponse(success, results, total_returned, offset, dedupedAliases, uniqueResultCount, message)`** — see `protocol.py:107`. `results: list[SearchResult]` where each SearchResult includes a `content: str` field that can be sizable
- **`encode_request` / `decode_response`** — msgspec.json or msgpack wrappers; tag-discriminated union
- **`multiprocessing.connection.Connection.send_bytes/recv_bytes`** — 4-byte length prefix on macOS Unix sockets

### Data Flow
Search call → client.send_bytes(SearchRequest) → daemon.recv_bytes → daemon dispatches → daemon embeds query via EmbeddingGemma-300m → daemon runs KNN against code_chunks_vec → daemon builds SearchResponse with N SearchResult entries → msgspec encode → daemon.send_bytes → client.recv_bytes → msgspec decode_response → return to caller. The truncation appears at the final decode step.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `cocoindex_code/daemon.py` (`_dispatch`, `_handle_search`) | Encodes SearchResponse; writes to socket | Modify — add diagnostic logging + try/except around send_bytes | New daemon.log lines show frame size + hex prefix before truncation |
| `cocoindex_code/client.py` (`DaemonClient.search`) | recv_bytes + decode_response | Modify — capture raw bytes before decode | Client-side log shows actual bytes received vs expected length-prefix |
| `cocoindex_code/protocol.py` (`SearchResponse`, `SearchResult`) | msgspec.Struct definitions | Maybe modify (only if SearchResult.content size is the cause) | Truncation count drops to zero with a `content_truncated: bool` field + length cap |
| `cocoindex/_internal/core.abi3.so` (compiled Rust) | Likely owns the actual encode path | Investigate, not patch directly | If Rust core is the truncation site, escalate upstream + pin patched fork |
| `~/.cocoindex_code/daemon.log` | Daemon stderr sink | Read | Should grow with diagnostic lines once 009 instruments daemon.py |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reproduce + Instrument
- [ ] Run minimal failing search: `cocoindex_code.search query="x" refresh_index=false limit=1` — capture exact error
- [ ] Add diagnostic prints to daemon `_handle_search` before the response write: bytes-len, first 200 hex
- [ ] Add diagnostic prints to client `recv_bytes` after read: bytes-len, first 200 hex
- [ ] Compare daemon-write vs client-read byte counts and content

### Phase 2: Isolate and Patch
- [ ] Identify which side truncates (daemon write < client read, or both match but msgspec rejects)
- [ ] If daemon-side: patch encode path, possibly truncate SearchResult.content to a cap (e.g., 4KB per chunk in response)
- [ ] If IPC-side: investigate length-prefix overflow (multiprocessing.connection uses 4-byte big-endian uint32 — max 4GB, unlikely)
- [ ] If client-side: patch recv loop to read length-prefix + body in chunks if necessary
- [ ] If Rust core: file upstream issue; consider in-repo fork patch

### Phase 3: Daemon stall investigation
- [ ] Trace daemon's per-language indexing pipeline: where does it decide what's indexable and per-language gating
- [ ] Look for silent exceptions in indexing loop (the daemon.log stops mid-pipeline at "Loaded 1 prompt" with no follow-up entries)
- [ ] Test with `ccc index .` (CLI) to see if forcing indexing produces a different result
- [ ] If shared root with truncation: fix both. If separate: branch a small 010 packet for the indexing-stall sub-issue
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | msgspec encode/decode of SearchResponse with synthetic large content fields | Standalone Python script invoking protocol.py |
| Integration | Full search round-trip via cocoindex_code MCP + via ccc CLI | MCP tool, bash |
| Manual | Visual comparison of daemon-emitted vs client-received bytes (hex diff) | bash, Python repl |
| Regression | Direct sqlite-vec KNN still works post-patch (data layer untouched) | Python script |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 004 vec-store-rebuild | Internal | Green | 009 needs the existing target_sqlite.db with EmbeddingGemma vectors |
| cocoindex 1.0.0a33 | External | Yellow | Bug may live in the Rust core; can't patch from in-repo Python |
| sqlite-vec | External | Green | Direct sqlite-vec works; not the failure surface |
| msgspec | External | Green (assumed) | The error string is from msgspec, but msgspec is correct — it's reporting what it received |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A 009 patch breaks something that was working in 004 (e.g., memory side regression because of a shared Python dep)
- **Procedure**: 009 only touches `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/*.py`. `git checkout -- <file>` reverts. Restart cocoindex MCP. 004 state restored.
<!-- /ANCHOR:rollback -->
