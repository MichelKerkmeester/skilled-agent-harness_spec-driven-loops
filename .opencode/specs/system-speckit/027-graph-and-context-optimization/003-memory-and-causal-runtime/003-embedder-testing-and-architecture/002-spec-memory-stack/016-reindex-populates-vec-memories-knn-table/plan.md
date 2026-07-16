---
title: "Implementation Plan: Phase 1: reindex-populates-vec-memories-knn-table [template:level_1/plan.md]"
description: "Two-surface fix: patch reindex.ts to dual-write vec_<dim> and vec_memories, patch factory.ts to follow the ADR-012 shard split when resolving the active ollama embedder."
trigger_phrases:
  - "vec_memories backfill plan"
  - "reindex dual-write plan"
  - "factory shard fallback plan"
  - "adr-012 follow-on patch"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/016-reindex-populates-vec-memories-knn-table"
    last_updated_at: "2026-05-19T18:58:00Z"
    last_updated_by: "claude-code"
    recent_action: "Plan authored after patches landed on main and daemon restarted clean"
    next_safe_action: "ready to commit packet plus README dispatches together"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-002-016-vec-memories-knn-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: reindex-populates-vec-memories-knn-table

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node 20+, better-sqlite3, sqlite-vec native extension |
| **Framework** | mk-spec-memory MCP server, daemonized via `.opencode/bin/mk-spec-memory-launcher.cjs` |
| **Storage** | SQLite WAL: `mcp_server/database/context-index.sqlite` plus per-embedder shards in `database/vectors/` |
| **Testing** | Manual smoke probes through better-sqlite3 plus daemon startup log inspection |

### Overview
The patch lands in two source files and one runtime shard. `lib/embedders/reindex.ts::writeVectorsToShard` learns to load sqlite-vec, create the `vec_memories` vec0 virtual table, and write each batch into both `vec_<dim>` and `vec_memories` inside the same transaction. `shared/embeddings/factory.ts::readActiveOllamaEmbedderFromDb` learns to fall back to the per-embedder shard path when the main DB lacks the dim-tagged table. A one-shot SQL backfill restores the active nomic shard so the running daemon recovers immediately.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Type-checks pass on both workspaces
- [x] Docs updated (spec, plan, tasks, implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-embedder shard split (ADR-012) with dual-table runtime layout: canonical `vec_<dim>` regular table plus `vec_memories` vec0 virtual table inside the same `.sqlite` shard file.

### Key Components
- **`writeVectorsToShard`** (lib/embedders/reindex.ts): owns shard writes per reindex batch, must keep both tables in lockstep.
- **`writeVectorsToKnn`** (new helper, lib/embedders/reindex.ts): DELETE plus INSERT pattern because vec0 rejects `INSERT OR REPLACE`.
- **`readActiveOllamaEmbedderFromDb`** (shared/embeddings/factory.ts): resolves the active ollama embedder, must consult both main DB and the shard subdirectory.

### Data Flow
Reindex job pulls memory rows, computes embeddings via the active provider, writes blobs to both `vec_<dim>` (regular table, canonical store) and `vec_memories` (vec0 KNN, runtime query target) in the active shard. Daemon startup: factory reads `active_embedder_*` from `vec_metadata`, locates `vec_<dim>` either in the main DB or in the shard, verifies row count, returns the embedder profile to the cascade.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `writeVectorsToShard` producer (`lib/embedders/reindex.ts`) | Owns shard writes for reindex batches | Update to dual-write both tables | `grep -n vec_memories lib/embedders/reindex.ts` and runtime KNN smoke probe |
| `writeVectorsToKnn` producer (`lib/embedders/reindex.ts`) | New helper for vec0 inserts | Create alongside `writeVectors` | Function present in dist after build |
| `readActiveOllamaEmbedderFromDb` policy (`shared/embeddings/factory.ts`) | Resolves active ollama embedder pointer | Update to consult the shard path | Daemon startup log free of `factory ... points to vec_<dim> ... missing` warning |
| `attachActiveVectorShard` consumer (`lib/search/vector-index-store.ts`) | Reads vec_memories at query time | Unchanged | KNN smoke probe returns real neighbors |
| `evidence-gap-detector.ts` consumer | Computes Z-score over RRF results | Unchanged | Z scores recover above 1.5 threshold on probe queries |
| `mcp_server/database/README.md` docs | Documents the database folder layout | Updated by separate parallel dispatch in the same session | README cross-links vectors and migrations subfolders |

Required inventories:
- Same-class producers: `rg -n 'writeVectors|INSERT.*vec_memories' .opencode/skills/system-spec-kit/mcp_server/lib`.
- Consumers of changed symbols: `rg -n 'readActiveOllamaEmbedderFromDb|writeVectorsToShard' .opencode/skills/system-spec-kit`.
- Matrix axes: ollama provider, nomic 768 dim shard, sqlite-vec load success, sqlite-vec load failure (degraded path).
- Algorithm invariant: every reindex batch finishes with `count(vec_memories) == count(vec_<dim>)` for the rebuilt id range.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Diagnosis
- [x] Confirm symptom: memory_search returns Z near 1.2, evidence-gap detector escalates to `broaden_or_ask`
- [x] Inspect shard tables: `vec_memories` empty, `vec_768` populated at 3808 rows
- [x] Trace runtime KNN path to `vec_memories` in `lib/search/vector-index-store.ts`
- [x] Trace factory warning to `shared/embeddings/factory.ts::readActiveOllamaEmbedderFromDb`

### Phase 2: Data Fix
- [x] Backfill `vec_memories` from `vec_768` on the active nomic shard
- [x] Smoke-test KNN self-probe on a real seed embedding

### Phase 3: Code Patches
- [x] Patch `lib/embedders/reindex.ts` to dual-write both tables
- [x] Patch `shared/embeddings/factory.ts` to follow the shard split
- [x] Type-check both workspaces
- [x] Build both workspaces

### Phase 4: Daemon Restart and Verification
- [x] SIGTERM the current daemon
- [x] Relaunch via Python double-fork plus setsid with `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-spec-memory`
- [x] Scan startup log for absence of the factory cascade warning
- [x] Simulate the patched factory resolution end-to-end
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type-check | TS sources in both workspaces | `npx tsc --noEmit` |
| Build | Compile dist for both workspaces | `npm run build` |
| Smoke | KNN self-probe against backfilled vec_memories | `node` plus better-sqlite3 plus sqlite-vec |
| Manual | Daemon startup log scan | `tail /tmp/mk-spec-memory-daemon.log` |
| Manual | Factory resolution simulation | `node` script mirroring `readActiveOllamaEmbedderFromDb` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sqlite-vec native extension | External | Green | Without it the dual-write degrades to canonical only and KNN search stays offline |
| ADR-012 (packet 016/002/012) shard layout | Internal | Green | The factory patch hard-codes the filename pattern from this ADR |
| ADR-013 (packet 016/002/004) nomic default | Internal | Green | Supplies the active_embedder_* pointer keys the factory resolves |
| Daemon launcher and bridge socket | Internal | Green | Required for clean restart and multi-client serving |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A subsequent reindex run produces dim mismatch errors, or memory_search regresses to Z below 1.5 across the probe set.
- **Procedure**:
  - Revert the two source patches via `git revert <commit-sha>` on `main`.
  - `npm run build` both workspaces.
  - Restart the daemon. The legacy single-write reindex resumes, leaving `vec_memories` to whatever state existed before the rollback.
  - If runtime KNN must keep working, redo the one-shot backfill (`INSERT INTO vec_memories(rowid, embedding) SELECT id, vec FROM vec_<dim>`) on the active shard.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
