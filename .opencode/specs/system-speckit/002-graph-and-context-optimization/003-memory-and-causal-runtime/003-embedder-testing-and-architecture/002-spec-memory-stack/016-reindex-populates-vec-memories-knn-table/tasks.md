---
title: "Tasks: Phase 1: reindex-populates-vec-memories-knn-table [template:level_1/tasks.md]"
description: "All tasks complete: diagnosis, data backfill, two code patches, type-check plus build, daemon restart, verification."
trigger_phrases:
  - "vec_memories tasks complete"
  - "reindex factory tasks"
  - "016/002/016 tasks"
  - "task list 016 002 016"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/016-reindex-populates-vec-memories-knn-table"
    last_updated_at: "2026-05-19T18:58:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks closed after daemon restarted clean and KNN smoke probe passed"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: reindex-populates-vec-memories-knn-table

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm symptom with a live daemon probe, capture vec_memories vs vec_768 row counts in the active nomic shard
- [x] T002 Identify the runtime KNN query target in `lib/search/vector-index-store.ts` and confirm the shard attach path under `active_vec`
- [x] T003 [P] Trace the factory cascade warning to `shared/embeddings/factory.ts::readActiveOllamaEmbedderFromDb`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 One-shot backfill: `INSERT INTO vec_memories(rowid, embedding) SELECT id, vec FROM vec_768` on `database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`
- [x] T005 Patch `writeVectorsToShard` in `lib/embedders/reindex.ts` to dual-write vec_<dim> and vec_memories, add `writeVectorsToKnn` helper, add sqlite-vec import with graceful try-catch
- [x] T006 Patch `readActiveOllamaEmbedderFromDb` in `shared/embeddings/factory.ts` to fall back to `<db_dir>/vectors/context-vectors__ollama__<name>__<dim>.sqlite` when the main DB lacks `vec_<dim>`
- [x] T007 `npm run build` on both `@spec-kit/shared` and `@spec-kit/mcp-server`, confirm type-check is clean
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 SIGTERM the running daemon, relaunch via Python double-fork plus setsid with `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-spec-memory`, confirm bridge socket reappears
- [x] T009 Scan `/tmp/mk-spec-memory-daemon.log` for absence of the `[factory] Active embedder ... points to vec_<dim> ... missing` warning
- [x] T010 KNN self-probe on backfilled vec_memories: seed embedding returns rank 1 with distance 0 and four real neighbors at distance 0.55 to 0.58
- [x] T011 Simulate the patched factory resolution end-to-end via a node script, confirm it returns nomic-embed-text-v1.5 at 768 dim through the shard path
- [x] T012 Author the 4 spec docs and refresh `description.json` plus `graph-metadata.json` via the canonical generate-context flow
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (daemon log clean, KNN probe green, factory simulation green)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Outcome**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
