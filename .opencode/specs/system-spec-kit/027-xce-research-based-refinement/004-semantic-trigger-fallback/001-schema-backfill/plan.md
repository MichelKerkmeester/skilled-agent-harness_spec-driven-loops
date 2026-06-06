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
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/001-schema-backfill"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Split Sub-Phase 1 plan section from 007 leaf plan"
    next_safe_action: "Begin T001 schema migration"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 0
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
Add the derived trigger-embedding store and its out-of-band population paths. The runtime trigger stage will only ever read from `embedding_cache`; all generation happens in `memory_index_scan` and the save-time pipeline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `embedding_cache` PK shape and BLOB-to-Float32 conversion confirmed at `embedding-cache.ts:45-215`.
- [ ] Save-time lookup-or-generate pattern confirmed at `embedding-pipeline.ts:114-169`.
- [ ] Forward-only migration approach agreed.

### Definition of Done
- [ ] Migration test passes on an existing-DB fixture.
- [ ] Resumable backfill test passes (interrupt → resume, no duplicate ready rows).
- [ ] Save flow proven non-blocking on provider failure.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive derived store + deferred (out-of-band) population, fail-closed.

### Key Components
- **`memory_trigger_embeddings`**: derived table keyed by `(memory_id, phrase_hash, profile_key, input_kind)` with `model_id`, `dimensions`, `embedding_status`, `updated_at`.
- **Backfill loop (`memory_index.ts`)**: per memory, per phrase → compute `phrase_hash`, check `embedding_cache`, generate if missing, mark `ready` only after durable store.
- **Save-time hook (`embedding-pipeline.ts`)**: same generation, best-effort, non-blocking.

### Data Flow
`trigger_phrases` JSON (source-of-truth in `memory_index`) → backfill/save-time generation → BLOB in `embedding_cache` + status row in `memory_trigger_embeddings`. Runtime trigger stage reads only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm `embedding_cache` keying and `memory-summaries.ts` BLOB conversion precedent.
- [ ] Define `memory_trigger_embeddings` DDL (forward-only).

### Phase 2: Core Implementation
- [ ] Add the schema migration (`CREATE TABLE IF NOT EXISTS ...`).
- [ ] Implement resumable per-memory backfill in `memory_index_scan`.
- [ ] Implement best-effort, non-blocking save-time hook.

### Phase 3: Verification
- [ ] Migration test on existing-DB fixture.
- [ ] Resume-after-interrupt test.
- [ ] Save-flow non-blocking test.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Migration applies; status transitions | Vitest |
| Integration | Index-scan backfill + save-time hook | Vitest |
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
