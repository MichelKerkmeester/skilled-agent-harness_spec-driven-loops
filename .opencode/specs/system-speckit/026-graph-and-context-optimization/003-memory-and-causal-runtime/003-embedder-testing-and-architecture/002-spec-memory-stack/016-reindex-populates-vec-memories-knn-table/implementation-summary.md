---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Root-cause fix for memory_search Z=1.2 degraded confidence: reindex now dual-writes vec_memories alongside vec_<dim>, and the factory follows ADR-012 shard split when resolving the active ollama embedder."
trigger_phrases:
  - "vec_memories knn backfill"
  - "reindex dual-write vec_768"
  - "factory adr-012 shard fallback"
  - "evidence gap z-score degraded"
  - "writeVectorsToShard patch"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/016-reindex-populates-vec-memories-knn-table"
    last_updated_at: "2026-05-19T18:58:00Z"
    last_updated_by: "claude-code"
    recent_action: "Both code patches landed on main, daemon restarted clean, factory cascade warning gone"
    next_safe_action: "ready to commit packet 016/002/016 plus the two README dispatches when operator approves"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite"
      - ".opencode/skills/system-spec-kit/mcp_server/database/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/database/vectors/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/database/migrations/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-002-016-vec-memories-knn-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Where is the runtime KNN table? vec_memories vec0 virtual in the shard, not vec_<dim>."
      - "Why was Z=1.2? Vector contribution to RRF was zero, only FTS5 fed the ranker, distribution stayed flat."
      - "Why two patches? Bug A was in reindex (write only one table), Bug B was in factory (look only in main DB). Both had to be fixed."
      - "Should we patch other providers too? Out of scope, tracked as follow-on."
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
| **Spec Folder** | 016-reindex-populates-vec-memories-knn-table |
| **Completed** | 2026-05-19 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Memory search confidence jumps from degraded (Z near 1.2, `broaden_or_ask` policy) back to normal because the runtime KNN table is populated again and the embedder resolver now follows the shard split. Two layers were broken at once, and both are fixed in this packet.

### Reindex dual-write into vec_memories

`lib/embedders/reindex.ts::writeVectorsToShard` previously wrote rebuilt embeddings only to the canonical regular table `vec_<dim>` (for example `vec_768`). The runtime KNN search path queries the sqlite-vec vec0 virtual table `vec_memories` in the attached shard, which was sitting at zero rows while `vec_768` had 3808 rows. After the patch the shard connection loads sqlite-vec, creates `vec_memories USING vec0(embedding FLOAT[<dim>])` lazily, and writes each row into both tables inside the same transaction. The new `writeVectorsToKnn` helper does a DELETE then INSERT per row because vec0 does not accept `INSERT OR REPLACE`. When the sqlite-vec extension fails to load the writer falls back to writing only `vec_<dim>`, which keeps the canonical store intact for later promotion.

### Factory follows ADR-012 shard split

`shared/embeddings/factory.ts::readActiveOllamaEmbedderFromDb` was checking for `vec_<dim>` inside `mcp_server/database/context-index.sqlite`, but ADR-012 (canonical vector shard split) moved that table into `mcp_server/database/vectors/context-vectors__<provider>__<model>__<dim>.sqlite`. The factory therefore returned null, the provider cascade kicked in, and the daemon defaulted to `DEFAULT_PROVIDER_MODELS.ollama = 'jina-embeddings-v3'` (1024 dim) instead of the actually active nomic at 768 dim. The patch now accepts either location: main DB first for legacy layouts, then a derived shard path of the form `<db_dir>/vectors/context-vectors__ollama__<name>__<dim>.sqlite`. The warning text only fires when both locations lack the table.

### One-shot data backfill on the active nomic shard

To restore confidence immediately for the running daemon, the operator ran `INSERT INTO vec_memories(rowid, embedding) SELECT id, vec FROM vec_768` on `vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`. The shard's `vec_memories` went from 0 rows to 3808 rows in 62 ms. A KNN self-probe returned the seed row at rank 1 with distance 0 and real neighbors at distance 0.55 to 0.58, confirming the backfilled blobs are valid vec0 input.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modified | Dual-write `vec_<dim>` and `vec_memories` per reindex batch, with sqlite-vec graceful degradation |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modified | Resolve the active ollama embedder via the shard subdirectory when main DB lacks `vec_<dim>` |
| `.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite` | Modified (data) | One-shot backfill, 3808 rows added to `vec_memories` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Diagnosis ran first against a live daemon (PID 72215) to confirm the symptom. The probe script attached sqlite-vec to the nomic shard, counted both tables, and ran a self-probe KNN on a real embedding to verify blob format compatibility. Both code patches were written against the TypeScript sources, type-checked via `npx tsc --noEmit`, then compiled through `npm run build` in `@spec-kit/shared` and `@spec-kit/mcp-server`. The daemon was stopped via SIGTERM and relaunched through a Python double-fork plus setsid wrapper with `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-spec-memory` so the bridge socket path stayed below the macOS sun_path limit. The post-restart startup log no longer carries the `[factory] Active embedder ... points to vec_768, but that table is missing` warning, and an end-to-end simulation of the patched factory confirms it resolves to nomic at 768 dim through the shard path.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Patch factory to read the shard rather than recreate `vec_<dim>` in the main DB | The shard split is the canonical layout per ADR-012, putting `vec_<dim>` back in the main DB would undo a deliberate architectural decision and break per-embedder isolation. |
| Backfill `vec_memories` with raw blobs from `vec_768` instead of recomputing embeddings | The blob format is identical (Float32Array little-endian, 768 floats), `vec_768` already holds the authoritative 3808 nomic vectors, and recomputing through ollama would burn ten plus minutes for no semantic gain. |
| Use DELETE plus INSERT in `writeVectorsToKnn` rather than `INSERT OR REPLACE` | sqlite-vec vec0 virtual tables reject `INSERT OR REPLACE`, the two-step pattern keeps the row identity stable across reindex passes. |
| Keep `dbPath: sqlitePath` pointing at the main DB after the shard fallback | Downstream callers treat `dbPath` as the metadata anchor, the shard is an implementation detail, swapping the value would ripple through unrelated code paths. |
| Graceful degradation when sqlite-vec fails to load in reindex | Reindex should never silently abandon the canonical store, falling back to `vec_<dim>` only preserves the existing safety net while letting search degrade to lexical until the extension is reinstalled. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit -p tsconfig.json` on mcp_server | PASS |
| `npx tsc --noEmit -p tsconfig.json` on shared | PASS |
| `npm run build` on shared and mcp_server | PASS |
| Daemon restart via Python double-fork plus setsid | PASS, new PIDs 16589 launcher and 16591 context-server, bridge socket re-listening at `/tmp/mk-spec-memory/daemon-ipc.sock` |
| Daemon startup log scan for `factory.*points to vec_768.*missing` | PASS, zero matches |
| Patched factory resolution simulation | PASS, resolves to nomic-embed-text-v1.5 at 768 dim via shard path |
| `vec_memories` row count after backfill | PASS, 3808 rows matching `vec_768` |
| KNN self-probe on backfilled `vec_memories` | PASS, rank 1 distance 0 plus 4 real neighbors at distance 0.55 to 0.58 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Factory patch is ollama-only.** `readActiveOllamaEmbedderFromDb` is named for ollama and the new shard-path string hard-codes `context-vectors__ollama__<name>__<dim>.sqlite`. Other providers (hf-local, voyage, openai) need the same shard-aware lookup when they ship active-embedder pointers through the same vec_metadata convention. Tracked as a follow-on.
2. **Top-level vec_metadata in `context-index.sqlite` is no longer load-bearing.** It still receives the `active_embedder_*` pointer keys, but the dim-tagged table moved to the shard. Removing the legacy table cleanly needs a migration script under `database/migrations/`. Tracked as a follow-on under the migrations folder.
3. **The backfill itself does not retroactively backfill quantized hf-local shards.** Only the active nomic shard was backfilled. Other shards inherit the new dual-write behavior on their next reindex.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
