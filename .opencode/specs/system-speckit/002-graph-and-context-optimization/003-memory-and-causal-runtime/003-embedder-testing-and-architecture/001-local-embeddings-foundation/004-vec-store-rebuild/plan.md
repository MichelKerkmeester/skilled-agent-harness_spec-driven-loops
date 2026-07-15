---
title: "Implementation Plan: Phase 4 — Vec-Store Rebuild"
description: "Delete stale CocoIndex sqlite; bounce both MCP children so they pick up the post-003 env; trigger memory_index_scan and cocoindex_code.search refresh_index=true; verify dims, provider health, and end-to-end search latency on both surfaces."
trigger_phrases:
  - "004 plan vec store"
  - "memory rebuild plan"
  - "cocoindex rebuild plan"
  - "Setup A vec store rebuild"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/004-vec-store-rebuild"
    last_updated_at: "2026-05-12T20:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan filled with actual execution path"
    next_safe_action: "Run /mcp reconnect cocoindex_code"
    blockers:
      - "Cocoindex MCP needs /mcp reconnect"
    key_files:
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0140040c2a9e0000000000000000000000000000000000000000000000000002"
      session_id: "014-004-vec-rebuild-2026-05-12"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4 — Vec-Store Rebuild

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (better-sqlite3 + sqlite-vec via Node 25.6.1 MCP child); Python 3.11 (sentence-transformers + cocoindex Rust daemon via `.venv`) |
| **Framework** | Spec Kit Memory MCP (`@huggingface/transformers` v3.8.1 ONNX runtime); CocoIndex MCP (sentence-transformers on Metal/MPS) |
| **Storage** | SQLite + vec0 extension (memory, 768-dim); SQLite + sqlite-vec (cocoindex, 768-dim) |
| **Testing** | `memory_health` + `memory_quick_search` (MCP tools); `cocoindex_code.search` round-trip; direct sqlite3 CLI inspection for row counts |

### Overview
Bring up the two vec stores under Setup A. Memory side gets a fresh filename-keyed sqlite that the launcher auto-creates on first spawn; we populate it via `memory_index_scan`. CocoIndex's stale 2GB MiniLM `target_sqlite.db` gets `rm`'d so the daemon rebuilds from scratch under EmbeddingGemma-300m on the next `refresh_index=true` call. The non-obvious part: both MCP layers had stale runtime state from before the 003 env propagated, so the path includes restart + reconnect cycles, and a SQLite-level workaround for the `UNCHANGED_EMBEDDING_STATUSES` dedup that blocked the obvious `force=true` rescan.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 003 verified — `.env.local` exists, Voyage purged from shell/`.env`/launchd
- [x] User restarted Claude Code from a fresh terminal (no inherited VOYAGE_API_KEY)
- [x] HF cache has EmbeddingGemma-300m + onnx-community/embeddinggemma-300m-ONNX (+ symlink)

### Definition of Done
- [x] Memory: `vecRowsTotal == ftsRowsTotal == memoryCount` per `memory_health`
- [x] Memory: hybrid search returns ≥1 result with `searchType=="hybrid"`
- [ ] CocoIndex: `target_sqlite.db` exists post-rebuild and serves a known query (pending `/mcp reconnect cocoindex_code`)
- [ ] CocoIndex: verified 768-dim schema
- [ ] Strict validate exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dual-store hybrid retrieval. Memory layer = SQLite + vec0 + FTS5 + BM25 (hybrid pipeline). Code layer = SQLite + sqlite-vec (semantic only). Both isolated by storage path; both fed by Setup A models from 002.

### Key Components
- **`spec-kit-memory-launcher.cjs`** — Node launcher that reads `.env.local` then `.env` (existing process.env wins), spawns `dist/context-server.js` as MCP child. Filename-keys the active sqlite by `${provider}__${model}__${dim}.sqlite` so model swaps don't collide.
- **`HfLocalProvider`** (`shared/embeddings/providers/hf-local.ts`) — transformers.js wrapper; lazy-loads ONNX model on first call; falls back mps→cpu; warmup sets `isHealthy`.
- **`retry-manager`** (`lib/providers/retry-manager.js`) — background queue draining deferred embeddings at 5min/batch=5 (hardcoded in `context-server.js:1628-1631`).
- **`memory_index_scan`** handler — scans `.opencode/specs/**` + `.opencode/skills/*/constitutional/**`, hashes content, indexes new/changed rows. Uses `UNCHANGED_EMBEDDING_STATUSES = {success, pending, partial}` for dedup.
- **`ccc run-daemon`** (Python) — CocoIndex Rust binary spawned by the cocoindex MCP server. Owns `target_sqlite.db`. Reads `COCOINDEX_CODE_EMBEDDING_MODEL` env on startup.

### Data Flow
Memory write: file → parse frontmatter → compute content_hash → check dedup → generate embedding (or defer to retry queue) → insert into `memory_index` → trigger fires FTS5 insert → insert into `vec_memories`.
Memory read: query → tokenize → embed → vector search + FTS5 + BM25 candidate gen → fusion → rerank → filter → results.
CocoIndex write: search call with `refresh_index=true` → daemon scans repo → chunks files → embed via Qwen3 → upsert into `target_sqlite.db`.
CocoIndex read: query → embed via Qwen3 → vector search → top-K chunks with file/line metadata.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet hit several runtime-state issues that are documented here even though they're operational (not code-level) findings.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `HfLocalProvider.isHealthy` | Self-reported provider health flag | unchanged (re-verified) | Standalone repro succeeds with same compiled dist; MCP wedge resolved by launcher kill + `/mcp reconnect` |
| `retry-manager` interval/batch | Fixed at 5min × 5 in `context-server.js:1628-1631` | unchanged (out of scope) | At wedge time, retry-manager opened the circuit breaker after 5 attempts; on healthy restart it drained the queue (not used in this packet — we bypassed via DELETE+rescan) |
| `UNCHANGED_EMBEDDING_STATUSES` | Dedup set in `handlers/save/dedup.js:8` | unchanged (out of scope) | Confirmed blocks `force=true` rescan when rows are in `pending`/`retry`. Documented; workaround = direct SQLite DELETE |
| `embedding_cache` table | Content-hash → vector cache | not a consumer (read-only beneficiary) | Cache survived the DELETE; rescan hit cache for ~2109 of 2112 new rows → no model re-inference needed |
| `ccc run-daemon` lifecycle | Cocoindex Rust daemon | needs restart on env change | Old daemon (pid 2379, started before user runtime restart) held stale env; killed; reconnect spawns fresh under Setup A |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm `.env.local` loaded into MCP child (`[spec-kit-memory-launcher] loaded 3 env(s) from .env.local` in stderr)
- [x] Confirm `embeddingProvider == hf-local` + dim 768 via `memory_health`
- [x] Confirm HF cache: EmbeddingGemma-300m + onnx-community/embeddinggemma-300m-ONNX + symlink

### Phase 2: Core Implementation
- [x] Delete `.cocoindex_code/target_sqlite.db` (2.0GB)
- [x] Run `memory_index_scan` (first attempt — all 2459 deferred due to provider wedge)
- [x] Investigate wedge — confirmed code path works standalone; MCP child stderr stopped flushing after `[hf-local] Attempting device: mps`; retry-manager opened circuit breaker after 5 failures
- [x] Kill `spec-kit-memory-launcher` (pid 30540) — both launcher and child died
- [x] User ran `/mcp reconnect spec_kit_memory` → fresh child loaded `.env.local` cleanly → embedder healthy on first lazy-load
- [x] `DELETE FROM memory_index WHERE embedding_status IN ('pending','retry')` via sqlite3 CLI — 2449 rows deleted, FTS auto-cascaded via trigger
- [x] Re-run `memory_index_scan` — 2111 reindexed using `embedding_cache` hits + 1 new = 2112 vec rows
- [x] Kill stale `ccc run-daemon` (pid 2379)
- [ ] User runs `/mcp reconnect cocoindex_code`
- [ ] Run `cocoindex_code.search refresh_index=true` to trigger Qwen3 rebuild (~3-4 min on Metal)

### Phase 3: Verification
- [x] `memory_health` — `healthy=true, queueDepth=0, circuitBreakerOpen=false, vecRowsTotal=2112`
- [x] `memory_quick_search` — returns hybrid result, 88.39% similarity on packet-local query
- [ ] `cocoindex_code.search` — returns success=true post-rebuild
- [ ] Strict validate — `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <004-packet> --strict` exits 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None — runtime swap, no code | n/a |
| Integration | MCP tool round-trips on both servers | `memory_health`, `memory_quick_search`, `memory_index_scan`, `cocoindex_code.search` |
| Manual | Direct SQLite inspection + process check | `sqlite3 <db> ".tables"`, `ps -p <pid>`, `ls -lah .cocoindex_code/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 PREFIX_REGISTRY | Internal | Green | Without it, embeddings get wrong prefix → 5-8% recall loss |
| 002 model installation | Internal | Green | Without it, both providers fail to load on first call |
| 003 .env.local + Voyage purge | Internal | Green | Without it, auto-resolver falls back to Voyage → wrong model identity |
| HF cache symlink (`onnx-community/embeddinggemma-300m-ONNX` → snapshot dir) | External | Green | Without it, transformers.js can't resolve the model path |
| User MCP reconnect | Manual | Yellow (one needed) | Spec-kit-memory done; cocoindex pending |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New vec stores produce no results, or hybrid search latency exceeds 2× baseline (>200ms p95 on memory_quick_search)
- **Procedure**:
  1. Rename `.env.local` → `.env.local.disabled` (project-local Setup A opt-out)
  2. Restart Claude Code → next MCP spawn re-resolves provider via `auto` and falls back to `voyage` (if VOYAGE_API_KEY were restored) or `hf-local` against the OLD model env from committed configs (Nomic/MiniLM defaults)
  3. The old vec store files (`context-index__voyage__voyage-4__1024.sqlite`, etc.) are still present in the DB dir — no data loss
  4. If cocoindex rebuild fails: the old MiniLM `target_sqlite.db` is gone, so rollback means accepting a temporary degradation of code search until the rebuild succeeds with a different model
<!-- /ANCHOR:rollback -->
