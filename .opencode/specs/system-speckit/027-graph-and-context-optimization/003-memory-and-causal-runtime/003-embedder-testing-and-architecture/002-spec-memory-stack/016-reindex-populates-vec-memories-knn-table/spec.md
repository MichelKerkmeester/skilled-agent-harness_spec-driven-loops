---
title: "Feature Specification: Phase 1: reindex-populates-vec-memories-knn-table [template:level_1/spec.md]"
description: "Memory search returned degraded confidence at Z=1.2 because the runtime KNN table vec_memories was empty and the factory could not find vec_<dim> in the main DB. Both layers are fixed in this packet."
trigger_phrases:
  - "vec_memories knn empty"
  - "memory_search z-score degraded"
  - "reindex writeVectorsToShard"
  - "factory readActiveOllamaEmbedderFromDb shard"
  - "adr-012 shard split factory"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/016-reindex-populates-vec-memories-knn-table"
    last_updated_at: "2026-05-19T18:58:00Z"
    last_updated_by: "claude-code"
    recent_action: "Spec authored after both code patches and the one-shot backfill shipped on main"
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
    answered_questions:
      - "Why dual-write? Runtime KNN reads vec_memories, canonical store is vec_<dim>, both must stay in lockstep."
      - "Why patch factory? ADR-012 moved the dim-tagged table to the shard, the lookup had not been updated."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: reindex-populates-vec-memories-knn-table

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-cascade-reorder-and-nomic-hf-local-default |
| **Successor** | None |
| **Handoff Criteria** | Spec docs validate strict, packet committed on main, daemon log free of factory cascade warnings, memory_search returns non-degraded Z scores |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** under `002-spec-memory-stack`. The packet closes a latent regression that surfaced after ADR-012 (canonical vector shard split) and ADR-013 (nomic default) shipped: the runtime KNN search path was reading an empty `vec_memories` table because reindex only wrote the canonical `vec_<dim>` table, and the factory was scanning the wrong file for the dim-tagged pointer table.

**Scope Boundary**: Two source files patched, one runtime shard backfilled. No schema migrations, no provider-cascade rewrites, no MCP-tool contract changes.

**Dependencies**:
- ADR-012 (canonical-vector-shard-split, packet 016/002/012) defines the shard layout this packet relies on.
- ADR-013 (nomic-embed-text-v1.5 default, packet 016/002/004) supplies the active embedder pointer values that the factory now resolves through the shard.
- sqlite-vec is a runtime dependency of the patched `writeVectorsToShard` path. The patch falls back to canonical-only writes when the extension is unavailable.

**Deliverables**:
- `lib/embedders/reindex.ts` dual-writes vec_<dim> and vec_memories per reindex batch.
- `shared/embeddings/factory.ts` resolves the active ollama embedder through the shard subdirectory.
- One-shot backfill of `vec_memories` in the active nomic shard restored search confidence immediately for the running daemon.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`memory_search` was returning RRF score distributions with Z near 1.2, below the evidence-gap threshold of 1.5, which forced the response policy into `broaden_or_ask` and `do_not_cite_results`. The user could not retrieve canonical context confidently. Two cooperating bugs were responsible: reindex wrote only to `vec_<dim>` and never to the `vec_memories` vec0 virtual table that the runtime KNN actually queries, and the factory looked for `vec_<dim>` in the main DB while ADR-012 had relocated it into the per-embedder shard.

### Purpose
Restore high-confidence semantic retrieval by making the reindex dual-write into both tables and teaching the factory to follow the ADR-012 shard split when resolving the active ollama embedder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reindex dual-write of `vec_<dim>` and `vec_memories` in the same shard transaction.
- Factory fallback that reads `vec_<dim>` from `<db_dir>/vectors/context-vectors__ollama__<name>__<dim>.sqlite` when the main DB lacks it.
- One-shot backfill of the active nomic shard so the running daemon recovers without waiting for the next full reindex.

### Out of Scope
- Provider-symmetric patches for hf-local, voyage, openai. Tracked as a follow-on.
- Removal of the legacy top-level `vec_metadata` table from `context-index.sqlite`. Tracked under `database/migrations/`.
- Backfill of other (non-nomic) shards. They inherit dual-write on their next reindex.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modify | Add sqlite-vec import, add `writeVectorsToKnn` helper, patch `writeVectorsToShard` to dual-write |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modify | Patch `readActiveOllamaEmbedderFromDb` to fall back to the shard path when main DB lacks `vec_<dim>` |
| `.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite` | Modify (runtime data) | Backfill `vec_memories` from `vec_768`, 3808 rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reindex must populate both `vec_<dim>` and `vec_memories` in the active shard | After any reindex run, both tables hold the same row count for the same memory id range |
| REQ-002 | Factory must resolve the active ollama embedder through the shard when the main DB lacks the dim-tagged table | Startup log no longer emits `[factory] Active embedder ... points to vec_<dim>, but that table is missing in <main_db>` when the shard has the table populated |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The running daemon must see the backfilled `vec_memories` without manual intervention | After daemon restart, KNN smoke probes return real neighbors with non-zero distances |
| REQ-004 | The patches must not break the graceful-degradation path when sqlite-vec fails to load | Try-catch around `sqliteVec.load` skips vec_memories creation and writes only `vec_<dim>` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `memory_search` returns Z scores above 1.5 on representative probes that previously landed at 1.2, with `requestQuality.label = 'good'` and the response policy off the `broaden_or_ask` track.
- **SC-002**: Both workspaces (`@spec-kit/shared`, `@spec-kit/mcp-server`) build clean, the daemon restarts without the factory cascade warning, and `validate.sh --strict` passes for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sqlite-vec native extension | Med | Try-catch wraps the load, reindex falls back to `vec_<dim>` only |
| Dependency | ADR-012 shard layout convention | High | Patch follows the exact filename pattern emitted by `vector-index-store.ts` |
| Risk | Future reindex paths that bypass `writeVectorsToShard` | Med | Patch lives in the canonical writer, alternative paths would surface in code review |
| Risk | Provider-asymmetric factory patch could mask future hf-local or voyage regressions | Low | Documented as a known limitation, follow-on packet will replicate the pattern |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the legacy top-level `vec_metadata` table in `context-index.sqlite` be removed once ADR-012 is fully deployed, or kept for legacy-layout backward compatibility? Track in a follow-on `database/migrations/` packet.
- Should the same shard-aware fallback be added for hf-local, voyage, openai providers in a single patch, or split per provider? Pending operator decision.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
