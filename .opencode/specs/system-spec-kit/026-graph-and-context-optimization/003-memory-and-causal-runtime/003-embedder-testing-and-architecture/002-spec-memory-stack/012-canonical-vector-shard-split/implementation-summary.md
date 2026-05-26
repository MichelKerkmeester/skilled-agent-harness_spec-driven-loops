---
title: "Implementation Summary: Canonical Vector Shard Split"
description: "Spec-memory now uses a stable canonical metadata DB and per-profile attached vector/cache shards."
trigger_phrases:
  - "canonical vector shard split summary"
  - "active_vec implementation summary"
  - "vector shard commit handoff"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/012-canonical-vector-shard-split"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented split and added dedicated coverage"
    next_safe_action: "Stage source-only path list from commit handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/profile.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/db-shard-migration.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/canonical-vector-shard.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0160020123333333333333333333333333333333333333333333333333333333"
      session_id: "phase-016-002-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/012-canonical-vector-shard-split` |
| **Completed** | Implementation complete; verification passed with documented handler-memory-save baseline |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

Spec-memory now opens `context-index.sqlite` as the canonical metadata store and attaches the active embedding profile shard as `active_vec`. Vector payloads and persistent embedding cache rows live in `vectors/context-vectors__<slug>.sqlite`.

### Storage Split

Canonical DB keeps memory metadata, lineage, FTS, projections, governance tables, checkpoints, session state, and active embedder pointers. The shard keeps `vec_memories*`, dim-tagged `vec_<dim>` tables, profile-specific `embedding_cache`, and shard-local provider/model/dim metadata.

### Migration

The migration helper detects legacy `context-index__<slug>.sqlite` files, copies canonical and shard payloads into the new layout, enables WAL, and moves the original legacy file to `database/migrations/legacy_<slug>_<timestamp>.sqlite.bak`.

### Runtime

`vector-index-store.ts` owns attach/detach, shard metadata validation, low-memory shard pragmas, WAL setup, and temporary vector aliases for internal compatibility. The guarded context-server init attaches once during DB initialization and reattaches after active embedder selection.

`embedder_set` reindex jobs keep the legacy main dim-table write for compatibility, also copy target vectors into the target shard, and attach that shard after completion for file-backed databases.

### Tests

`canonical-vector-shard.vitest.ts` covers fresh creation, migration, idempotency, attach/detach, profile swap, cache isolation, mutation destination, vector query, metadata mismatch rejection, WAL, and checkpoint compatibility.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

The implementation keeps the canonical database as the only main connection and attaches the active shard by profile. Schema creation still runs through the existing vector-index path; shard cleanup removes canonical vector/cache payload tables after bootstrap and migration.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

- Keep `getDatabasePath()` as a deprecated canonical alias to preserve existing callers.
- Use `active_vec` as the fixed attach alias and expose helper functions instead of hardcoding the string at call sites.
- Stage legacy DBs in `database/migrations/` rather than deleting them.
- Keep temporary vector aliases for internal compatibility while direct call sites move to qualified shard tables.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

- [x] `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck`
- [x] `npx vitest --run canonical-vector-shard`
- [x] `npx vitest --run embedding-cache`
- [x] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <012> --strict`
- [x] `npx vitest --run vector-index`
- [x] `npx vitest --run memory-runtime-guard`
- [x] `npx vitest --run handler-memory-save --reporter=verbose` matched the expected 11 atomic-save-injection failures
- [x] `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build`
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- Temporary unqualified vector aliases remain for internal modules outside the primary query/mutation path.
- The legacy backup is not deleted automatically; operator cleanup remains manual after production verification.
<!-- /ANCHOR:limitations -->
