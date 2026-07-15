---
title: "Feature Specification: Phase 9 — Cocoindex IPC Fix"
description: "Diagnose and fix the cocoindex Rust↔Python IPC truncation that blocks all semantic-search calls under the EmbeddingGemma-300m setup. Direct sqlite-vec KNN against the same target_sqlite.db works perfectly (proves data layer is healthy); cocoindex_code.search returns msgspec.DecodeError: Input data was truncated. Also unblock daemon indexing past 1335 markdown chunks to cover source-code languages."
trigger_phrases:
  - "009 cocoindex IPC fix"
  - "msgspec truncation cocoindex search"
  - "Input data was truncated"
  - "cocoindex daemon stall markdown only"
  - "cocoindex Rust Python IPC bug"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/009-cocoindex-ipc-fix"
    last_updated_at: "2026-05-12T21:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Search-only path patched and verified; explicit index blocker documented"
    next_safe_action: "Patch/fork cocoindex Rust core Environment initialization so refresh/index can run"
    blockers:
      - "cocoindex._internal.core.abi3.so raises RuntimeError: Operation not permitted (os error 1) during explicit index"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140090a8b0c0000000000000000000000000000000000000000000000000001"
      session_id: "014-009-cocoindex-ipc-2026-05-12"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Is the truncation in SearchResponse encode (daemon) or decode (client) or somewhere in multiprocessing.connection's length-prefix framing?"
      - "Why does the daemon stall at 1335 markdown rows when include_patterns covers code too?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9 — Cocoindex IPC Fix

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 (gates 006) |
| **Status** | Root cause documented |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 (follow-on after 004) |
| **Predecessor** | 004-vec-store-rebuild |
| **Successor** | 006-bge-m3-hybrid-evaluation (gated by this) |
| **Handoff Criteria** | `cocoindex_code.search query="X" refresh_index=false` returns `success=true` with ≥1 valid result against the existing target_sqlite.db; daemon indexes source-code languages past markdown-only stall |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Phase 9** (follow-on) of `014-local-embeddings-setup-a`. Scoped narrowly to the cocoindex IPC bug that surfaced during 004's rebuild. Two related symptoms; both block 006 (bge-m3 hybrid evaluation, which needs working cocoindex search to compare ranking methods).

**Scope Boundary**: cocoindex package + daemon only. No changes to the spec_kit_memory MCP, no model swaps, no schema redesign.

**Dependencies**: 004 complete (Setup A models + venv re-pin in place). 009's repro environment IS the 004 end state.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Under Setup A (EmbeddingGemma-300m / sentence-transformers / 768-dim), the cocoindex daemon writes valid embeddings to `target_sqlite.db` (proven via direct sqlite-vec KNN returning relevant results at distance 0.97-1.03 on packet-local queries), but every search call through cocoindex's own MCP/CLI path returns `msgspec.DecodeError: Input data was truncated`. Separately, daemon indexes only 1335 markdown chunks then idles at 0% CPU despite `include_patterns` covering .py/.ts/.js/.go/.rs/.md.

### Purpose
Restore end-to-end semantic search through the standard cocoindex tools so 006 and downstream phases can compare ranking quality against a working baseline. Secondary: unstall the daemon so it indexes the full repo under EmbeddingGemma.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reproduce `msgspec.DecodeError: Input data was truncated` deterministically (refresh_index=false; minimal query string; record exact bytes received on the client socket)
- Add daemon-side verbose logging in `cocoindex_code/daemon.py:_dispatch` to capture the SearchResponse encode path and the actual bytes written to the socket
- Patch the encode/decode mismatch — likely either the SearchResult.content field exceeding a chunk-size limit in `multiprocessing.connection.Connection.send_bytes`, or a daemon exception serialized as a partial response, or an msgspec tag/version drift
- Investigate why source-code languages aren't indexed (daemon stalls after markdown) — read cocoindex's indexing loop, look for per-language gating, batch-size limits, or silent exceptions
- Land minimal fix in Public's `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/` source (preferred over patching the venv-bundled `cocoindex` Rust package); push upstream if the fix lives in the Rust core

### Out of Scope
- Q4 quantization (005), bge-m3 evaluation (006), Voyage cleanup (007), finalize+commit (008)
- Swapping cocoindex for an alternative code-indexer (out of 014 spec)
- Rewriting the IPC protocol — fix the existing one
- Modifying Barter's sibling source (Public is the canonical edit surface; cross-repo coordination through normal AGENTS.md sync)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modify | Add verbose stderr logging around SearchResponse encode; add try/except around send_bytes; surface frame-size diagnostics |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py` | Modify | Add recv_bytes raw-bytes capture before decode_response; if decode fails, log the first 200 bytes for diagnosis |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Maybe modify | If the SearchResult struct shape is the cause (large `content` field), introduce a content-truncation field or stream-chunking |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deterministic repro | A documented minimal query string + state that produces `msgspec.DecodeError: Input data was truncated` 100% of the time |
| REQ-002 | Daemon-side bytes captured | Daemon stderr (or daemon.log) records the exact byte length and (truncated) hex of the response written to the socket for a failing search |
| REQ-003 | Client-side bytes captured | Client recv side logs the exact byte length and (truncated) hex of what it received, BEFORE msgspec.decode |
| REQ-004 | Root cause identified | Confirmed which side truncates: daemon encode, OS socket buffer, or client recv. Documented in ADR-style note in `decision-record.md` (if Level 3) or `implementation-summary.md` (if Level 1) |
| REQ-005 | Search returns success=true | `cocoindex_code.search query="embedding provider" refresh_index=false limit=3` returns `{"success": true, "results": [...], ...}` with at least one result |
| REQ-006 | Daemon indexes source code | After fix, a `refresh_index=true` call (or natural reindex tick) results in `code_chunks_vec` containing non-zero rows for at least 3 of: python, typescript, javascript, go, rust, shell |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Speed regression check | After fix, a known-token search returns in <500ms p95 (not noticeably slower than the pre-Setup-A Voyage baseline) |
| REQ-008 | Daemon doesn't stall indefinitely | After a refresh, daemon either completes indexing or emits an actionable error before going idle |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: MCP `cocoindex_code.search` works end-to-end against the existing Setup A target_sqlite.db
- **SC-002**: CLI `ccc search "X"` returns results without hanging
- **SC-003**: Daemon indexes all configured languages under Setup A (not just markdown)
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Bug is in cocoindex Rust core (compiled `_internal/core.abi3.so`), not patchable from in-repo source | High | Push fix upstream; pin a fork until merged; for 014 ship, document workaround (direct sqlite-vec for any consumer that absolutely needs search now) |
| Risk | Daemon stall has a separate root cause from the truncation | Med | Investigate them as two independent issues; ship a single-fix packet only if both share root cause; otherwise split into 009 (search) and 010 (indexing) |
| Risk | Diagnostic logging itself reveals a deeper bug (e.g., 768-dim float32 serialization isn't supported by msgspec at all) | Med | Document and escalate; possibly use a different serialization layer for SearchResponse only |
| Dependency | 004's existing target_sqlite.db with partial EmbeddingGemma vectors | Hard | Don't `rm` it during 009 — direct sqlite-vec validation still works against it |
| Dependency | cocoindex package version 0.2.3+spec-kit-fork.0.2.0 (alpha-ish) | Med | If upstream has shipped fixes after our fork point, consider rebasing the fork |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the truncation in SearchResponse encode (daemon) or decode (client) or somewhere in multiprocessing.connection's length-prefix framing?
- Why does the daemon stall at 1335 markdown rows when include_patterns covers code too?
<!-- /ANCHOR:questions -->
