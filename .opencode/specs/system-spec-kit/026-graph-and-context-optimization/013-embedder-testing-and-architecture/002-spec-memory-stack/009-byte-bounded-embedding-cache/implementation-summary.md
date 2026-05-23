---
title: "Implementation Summary: Byte-Bounded Embedding Cache"
description: "Embedding cache rows are now byte-bounded, profile-aware, and split by document/query input kind, with full health telemetry reporting real SQLite bytes by profile."
trigger_phrases:
  - "byte-bounded embedding cache summary"
  - "profile-aware cache implementation summary"
  - "embedding cache commit handoff"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/009-byte-bounded-embedding-cache"
    last_updated_at: "2026-05-18T21:40:00Z"
    last_updated_by: "codex"
    recent_action: "Verified byte-bounded cache packet"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts"
    session_dedup:
      fingerprint: "sha256:0160020093333333333333333333333333333333333333333333333333333333"
      session_id: "phase-016-002-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/009-byte-bounded-embedding-cache` |
| **Completed** | 2026-05-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

The persistent embedding cache now separates entries by active embedder profile and input task. Document writes use `input_kind='document'`; query embeddings use `input_kind='query'`. The cache is bounded by bytes globally, per profile, and for query rows, with a secondary per-profile entry cap.

### Cache Schema and Eviction

`embedding-cache.ts` migrates legacy rows into a schema keyed by `content_hash`, `profile_key`, `input_kind`, `model_id`, and `dimensions`. Store calls run budget maintenance immediately after writing, delete oldest touched rows first, and call `PRAGMA shrink_memory` when eviction removes rows.

### Call-Site Wiring

The save embedding pipeline passes the active profile key and document kind for lookup and quality-gated store calls. The search query wrapper checks the query cache before invoking the active adapter or shared provider, then stores query vectors on miss.

### Health Telemetry

Full `memory_health` reports now override the rough embedding estimate with real SQLite byte totals and add `embedding_cache_by_profile` with document/query breakdowns. The compact default payload is unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` | Modified | Profile/input-kind migration, byte budgets, scoped cache API |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts` | Modified | Document cache key wiring |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Modified | Query embedding cache wiring |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Real byte estimates and profile breakdown |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedding-cache-byte-bounded.vitest.ts` | Created | Migration, keying, budget, and pragma tests |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modified | Profile-aware caching docs |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Cache budget env vars |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/009-byte-bounded-embedding-cache/` | Created | Level 1 packet docs and metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

The cache owner absorbed the schema and eviction complexity so existing callers can continue using the legacy three-field lookup while new document/query paths pass explicit profile and kind options.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Keep `model_id` and `dimensions` in the primary key | Prevents profile-compatible name collisions and cross-dimension reuse |
| Use `last_used_at` for LRU | Existing cache already maintained touch time, so no extra timestamp column was needed |
| Preserve legacy lookup fallback | Existing callers outside the scoped save/search paths keep working |
| Keep defaults disk-generous | Avoids surprising cloud users with aggressive re-embedding cost |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

| Check | Result |
|-------|--------|
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | PASS |
| `npx vitest --run embedding-cache-byte-bounded` | PASS, 1 file / 10 tests |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <009> --strict` | PASS, `RESULT: PASSED` |
| `npx vitest --run embedding-cache` | PASS, 2 files / 24 tests |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | PASS |
| Integration probe | PASS, 60 MiB inserted across 2 profiles; retained 49 rows, `approxBytes=51387574`, `shrinkMemoryCalls=11` |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit` | PASS, 0 errors / 44 existing warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

1. **Legacy unscoped lookups are inherently ambiguous** when multiple profiles have the same content/model/dimension tuple. The scoped document/query paths avoid that ambiguity; the fallback exists for backward compatibility only.
2. **Embedding cache rows remain recomputable.** Rollback can clear `embedding_cache` if a migrated cache needs to be rebuilt.

## Commit Handoff

Codex sandbox blocks direct `.git/index.lock` writes in some sessions, so stage these exact paths from a normal shell:

```bash
git add \
  .opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts \
  .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts \
  .opencode/skills/system-spec-kit/mcp_server/tests/embedding-cache-byte-bounded.vitest.ts \
  .opencode/skills/system-spec-kit/references/memory/embedder_architecture.md \
  .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/009-byte-bounded-embedding-cache/

git commit -m "feat(016/002/009): byte-bounded profile-aware embedding cache"
```
<!-- /ANCHOR:limitations -->
