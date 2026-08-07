---
title: "Feature Specification: Phase 4 — Vec-Store Rebuild"
description: "After 003 patched MCP configs, the active memory vec store and the CocoIndex sqlite still held data from the pre-Setup-A models (Voyage 1024-dim memory, MiniLM 384-dim code). Phase 4 wipes both, triggers a clean rebuild under the Setup A model identities (EmbeddingGemma-300m-ONNX 768-dim memory, EmbeddingGemma-300m 768-dim code), and verifies dims plus query latencies on both surfaces."
trigger_phrases:
  - "004 vec-store-rebuild"
  - "memory_index_scan setup A"
  - "cocoindex rebuild Qwen3"
  - "vec_memories 768 dim"
  - "EmbeddingGemma-300m-ONNX vectors"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/004-vec-store-rebuild"
    last_updated_at: "2026-05-12T20:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Memory rebuild complete (2112 vec rows)"
    next_safe_action: "Run /mcp reconnect cocoindex_code"
    blockers:
      - "Cocoindex MCP server holds stale socket to killed daemon (Errno 32 Broken pipe) — needs /mcp reconnect by user"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140040c2a9e0000000000000000000000000000000000000000000000000001"
      session_id: "014-004-vec-rebuild-2026-05-12"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions:
      - "Drain wedge-time backlog? → DELETE pending/retry rows + rescan; embedding_cache hits avoid model re-inference"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4 — Vec-Store Rebuild

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress (memory rebuilt; cocoindex search blocked by upstream msgspec truncation) |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 8 |
| **Predecessor** | 003-mcp-config-rollout |
| **Successor** | 005-q4-quantization |
| **Handoff Criteria** | vec_memories row count == memory_index FTS count; cocoindex returns ≥1 result on a known query under EmbeddingGemma |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Phase 4** of `014-local-embeddings-setup-a`. The first child phase the user has to drive (001-003 were single-shot edits). 004 is the runtime swap: old vec stores → new vec stores, with verification on both.

**Scope Boundary**: rebuild only. No new code, no new model installs, no quantization, no recall benchmarking.

**Dependencies**: 001 (PREFIX_REGISTRY + VALID_PROVIDER_DIMENSIONS), 002 (Qwen3 + EmbeddingGemma + ONNX port on disk + HF cache symlink), 003 (`.env.local` + Voyage purge), user runtime restart so MCP children inherit the new env.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After 003's config rollout, every MCP child sees Setup A env vars, but the on-disk vec stores still reflect the previous embedding model identities. The Spec Kit Memory layer uses filename-keyed sqlite (so a clean DB auto-appeared as soon as the launcher loaded `.env.local`), but it had 0 rows — search returned nothing. CocoIndex's `target_sqlite.db` is single-file and was 2.0GB of stale MiniLM 384-dim vectors held open by a daemon that pre-dated the user's runtime restart.

### Purpose
Rebuild both stores under the Setup A model identities so the new memory + code search paths are populated and verifiably working: hybrid search on memory returns vector-grade similarity scores against 768-dim EmbeddingGemma; cocoindex returns relevant code chunks against 768-dim Qwen3.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `rm` the stale `.cocoindex_code/target_sqlite.db` (2.0GB MiniLM)
- Kick the stale CocoIndex daemon so the MCP server spawns a fresh one with Setup A env
- Trigger `memory_index_scan` to populate the new 768-dim filename-keyed sqlite (`context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768.sqlite`)
- Trigger `cocoindex_code.search refresh_index=true` to force a EmbeddingGemma-300m reindex
- Verify embedding dims (memory: 768, cocoindex: 2560), provider health, and pipeline latencies via `memory_health` + an end-to-end search

### Out of Scope
- Q4 quantization (005)
- bge-m3 hybrid evaluation (006)
- Voyage cleanup + 24h egress monitor (007)
- Single-PR commit (008)
- Modifying retry-manager defaults (5min/batch5 → faster) — noted as follow-on infra
- Patching `UNCHANGED_EMBEDDING_STATUSES` dedup behavior — workaround applied, root-cause tracked separately

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.cocoindex_code/target_sqlite.db` | Delete | 2.0GB stale MiniLM 384-dim index |
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768.sqlite` | Create/Populate | New 768-dim memory vec store (auto-created by launcher on first spawn; populated by `memory_index_scan`) |
| `.cocoindex_code/target_sqlite.db` (new) | Create/Populate | Fresh EmbeddingGemma-300m 768-dim index (auto-rebuilt by `cocoindex_code.search refresh_index=true`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Stale CocoIndex DB removed | `ls .cocoindex_code/target_sqlite.db` returns "No such file" before rebuild |
| REQ-002 | New memory sqlite has matching vec rows | `vec_memories.rowsTotal == memory_index.ftsRowsTotal` per `memory_health` |
| REQ-003 | Memory provider healthy under Setup A | `embeddingProvider.healthy == true`, `provider == hf-local`, `model == onnx-community/embeddinggemma-300m-ONNX`, `dimension == 768` |
| REQ-004 | Memory hybrid search works | `memory_quick_search` returns ≥1 result with `searchType == "hybrid"` and `activeChannels >= 2` |
| REQ-005 | CocoIndex serves a query | `cocoindex_code.search` returns `success=true` with ≥1 result for a known-token query, post-rebuild |
| REQ-006 | CocoIndex dim is 2560 (Qwen3) | New `target_sqlite.db` schema reports 768-dim vectors |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Memory cold-load latency recorded | `[hf-local] Model loaded in <ms>` captured in MCP stderr (or standalone repro) |
| REQ-008 | CocoIndex rebuild wall time recorded | Time the `cocoindex_code.search refresh_index=true` round trip |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Memory side returns vector-grade similarity scores (>0.75) on packet-local queries
- **SC-002**: CocoIndex `target_sqlite.db` exists with 768-dim vector schema and serves at least one query
- **SC-003**: Both stores are filename-keyed (memory) or path-determined (cocoindex) so future model swaps don't collide
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <004-packet> --strict` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | MCP child wedges on first lazy-load (provider stays `healthy: false` after warmup race) | High | Kill `spec-kit-memory-launcher`; user reconnects via `/mcp`. Standalone repro confirms the code path is correct, so it's a runtime-state issue, not a code bug. |
| Risk | Stale CocoIndex daemon holds dead socket after `target_sqlite.db` is deleted | High | Kill the daemon (`ccc run-daemon` pid); user reconnects `cocoindex_code` MCP server so it spawns a fresh daemon with current env. |
| Risk | `force=true` on `memory_index_scan` skips deferred rows | High | `UNCHANGED_EMBEDDING_STATUSES` includes `pending`/`retry`/`partial`. Workaround: direct SQLite `DELETE FROM memory_index WHERE embedding_status IN ('pending','retry')` (FTS auto-cascades via trigger) + rescan. Embedding cache hits avoid re-running model inference. |
| Risk | Retry-manager (5min/batch5) makes wedge-time backlog impractical to drain | Med | Documented as follow-on infra; not in scope for 004 |
| Dependency | User must run `/mcp reconnect cocoindex_code` to bounce the cocoindex MCP server | Hard block on cocoindex side | Documented; no agent workaround |
| Security | HF token and Voyage key visible in chat history from prior sessions | Med | User rotates after the packet ships (HF: huggingface.co/settings/tokens, Voyage: dash.voyageai.com/api-keys) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none — answered during execution)
<!-- /ANCHOR:questions -->
