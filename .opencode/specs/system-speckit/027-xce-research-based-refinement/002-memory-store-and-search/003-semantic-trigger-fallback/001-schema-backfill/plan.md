---
title: "Implementation Plan: 001 — Schema + Backfill"
description: "Forward-only memory_trigger_embeddings table reusing embedding_cache BLOB storage, plus resumable index-scan backfill and a best-effort save-time hook. The trigger hot path never embeds."
trigger_phrases:
  - "027 phase 004 schema backfill plan"
  - "trigger embedding backfill plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/001-schema-backfill"
    last_updated_at: "2026-06-10T07:29:23Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed v34 schema and gated scan backfill"
    next_safe_action: "Start 002 semantic matcher implementation"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 001 — Schema + Backfill

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node) |
| **Framework** | Spec Kit Memory MCP server |
| **Storage** | SQLite (`memory_index`, `embedding_cache`, new `memory_trigger_embeddings`) |
| **Testing** | Vitest |

### Overview
Add the derived trigger-embedding store and its default-off scan backfill. The runtime trigger stage will only ever read from cached data; this phase does not change trigger matching behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `embedding_cache` PK shape and BLOB-to-Float32 conversion confirmed in `embedding-cache.ts`.
- [x] Default-off scan backfill approach implemented without save-path changes.
- [x] Forward-only migration approach implemented.

### Definition of Done
- [x] Migration test passes on an existing-DB fixture.
- [x] Resumable backfill test passes (re-run → no duplicate ready rows).
- [x] Store-failure test proves no partial row is marked ready.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive derived store + deferred (out-of-band) population, fail-closed.

### Key Components
- **`memory_trigger_embeddings`**: derived table keyed by `(memory_id, phrase_hash, profile_key, input_kind)` with `model_id`, `dimensions`, `embedding_status`, `updated_at`.
- **Backfill helper (`trigger-embedding-backfill.ts`)**: per memory, per phrase → compute `phrase_hash`, check `embedding_cache`, generate if missing, mark `ready` only after durable store.
- **Scan wiring (`memory-index.ts`)**: calls the helper at scan completion, disabled unless the backfill flag is explicitly enabled.

### Data Flow
`trigger_phrases` JSON (source-of-truth in `memory_index`) → default-off scan backfill → BLOB in `embedding_cache` + status row in `memory_trigger_embeddings`. Runtime trigger stage is unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm `embedding_cache` keying and BLOB conversion precedent.
- [x] Define `memory_trigger_embeddings` DDL (forward-only).

### Phase 2: Core Implementation
- [x] Add the schema migration (`CREATE TABLE IF NOT EXISTS ...`).
- [x] Implement resumable per-memory backfill in `memory_index_scan`.
- [x] Keep semantic expansion and backfill default-off.

### Phase 3: Verification
- [x] Migration test on existing-DB fixture.
- [x] Re-run resumability test.
- [x] Durable-store failure test.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Migration applies; status transitions | Vitest |
| Integration | Index-scan backfill helper and scan wiring | Vitest |
| Manual | `memory_index_scan --force` regenerates from JSON | CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `embedding_cache` BLOB store | Internal | Green | Reused; no new BLOB table |
| Active embedding provider (default Ollama nomic 768d) | Internal | Green | Local-first; backfill only, never hot path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Migration or backfill regression on the memory DB.
- **Procedure**: Table is forward-only and idempotent; it can remain in place unused. Disable downstream consumption via the parent feature flag; no schema rollback needed.
<!-- /ANCHOR:rollback -->
