---
title: "001 — Schema + Backfill"
description: "Add the memory_trigger_embeddings derived table and out-of-band, resumable backfill (index-scan + save-time) so trigger phrases get cached embeddings without ever embedding in the trigger hot path."
trigger_phrases:
  - "027 phase 004 schema backfill"
  - "memory_trigger_embeddings table"
  - "trigger embedding backfill"
  - "resumable trigger backfill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/001-schema-backfill"
    last_updated_at: "2026-06-10T07:29:23Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed schema v34 and gated scan backfill"
    next_safe_action: "Start 002 semantic matcher on cached rows"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 001 — Schema + Backfill

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-semantic-matcher |
| **Handoff Criteria** | Trigger embeddings are stored and resumably backfilled; the trigger hot path never embeds. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the semantic trigger fallback decomposition (parent `004-semantic-trigger-fallback`).

**Scope Boundary**: Storage substrate and out-of-band backfill only. The semantic matcher (`002`), hybrid handler wiring (`003`), and goldens/shadow eval (`004`) consume this foundation but are out of scope here.

**Dependencies**:
- None (hard). This is the foundation sub-phase.

**Deliverables**:
- `memory_trigger_embeddings` derived table reusing the existing `embedding_cache` BLOB store.
- Resumable per-memory backfill in `memory_index_scan`.
- Default-off scan backfill gate; no runtime trigger-path embedding.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The semantic trigger stage needs cached trigger-phrase embeddings to run, but the trigger hot path has a tight latency budget (`trigger-matcher.ts:132-160`) and must never call an embedding provider inline. There is no derived store for trigger embeddings and no out-of-band path to populate one.

### Purpose
Add a regeneratable derived table and resumable, out-of-band backfill so the runtime trigger stage only ever does a cache lookup, never a synchronous embed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `memory_trigger_embeddings` table (PK `(memory_id, phrase_hash, profile_key, input_kind)`) in `vector-index-schema.ts`, carrying the active embedding-profile identity so a profile change does not silently reuse stale embeddings.
- BLOB reuse of the existing `embedding_cache(content_hash, profile_key, input_kind, model_id, dimensions, embedding)` store — no new BLOB table.
- Resumable per-memory backfill in `memory_index_scan`: generate embeddings for derived rows with `embedding_status='pending'`; mark `ready` only after durable store.
- Default-off gating so semantic expansion and trigger embedding backfill do not activate by default.

### Out of Scope
- The cosine semantic matcher itself - owned by `002-semantic-matcher`.
- Any change to `memory_match_triggers` handler behavior - owned by `003-hybrid-handler`.
- Synchronous embed inside the trigger call - forbidden by REQ-006.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/vector-index-schema.ts` | Modify | Add `memory_trigger_embeddings` table (forward-only). |
| `mcp_server/lib/cache/embedding-cache.ts` | Analyze | Reuse existing BLOB store keyed by profile identity. |
| `mcp_server/lib/search/trigger-embedding-backfill.ts` | Add | Implement default-off, resumable trigger phrase embedding backfill. |
| `mcp_server/handlers/memory-index.ts` | Modify | Wire the default-off trigger backfill into scan completion. |
| `mcp_server/tests/trigger-embedding-backfill.vitest.ts` | Add | Prove default-off, resumability, and no ready status before durable store. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Trigger embeddings stored in the NEW derived `memory_trigger_embeddings` table; reuse `embedding_cache` BLOB storage | Schema migration applies cleanly on existing DB; BLOB lookup via `phrase_hash + profile_key + input_kind + model_id + dimensions` |
| REQ-006 | Backfill via `memory_index_scan` + save-time pipeline; NEVER a synchronous embed inside the runtime trigger path | Backfill generates embeddings out of band; save flow not blocked on provider failure (`embedding_status='failed'` recorded for retry) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `trigger_phrases` JSON in `memory_index` remains source-of-truth; derived table is regeneratable | `memory_index_scan --force` rebuilds the derived table from JSON without loss |
| REQ-011a | Backfill is resumable; interruption restarts without duplicate ready rows or partial rows marked ready | Interrupted backfill resumes; no partial row is treated as `ready` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Migration creates `memory_trigger_embeddings` cleanly on an existing memory DB (forward-only ADD).
- **SC-002**: The scan backfill populates embeddings for `pending` derived rows when explicitly enabled; re-runs do not duplicate rows; durable-store failure leaves rows non-ready.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Schema migration on production memory DB | Med | Forward-only ADD COLUMN / CREATE TABLE; backward-compatible reads; migration test on existing-DB fixture |
| Risk | Backfill interrupted mid-run leaves partial rows | Med | `pending`/`failed`/`ready` status; mark `ready` only after durable store; resume on next scan |
| Dependency | Active embedding profile (default Ollama nomic-embed-text-v1.5, 768d) | Low | Local-first provider needs no network; profile identity stored in PK |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should trigger embeddings use raw phrases only, or weighted text like `title + trigger phrase + spec folder slug`? (inherited from parent 007)
- What TTL / invalidation event should refresh the in-memory cache consumed downstream by `002`?
<!-- /ANCHOR:questions -->
