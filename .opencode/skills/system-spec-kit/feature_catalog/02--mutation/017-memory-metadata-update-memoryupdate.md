---
title: "Memory metadata update (memory_update)"
description: "Covers the update tool that modifies memory metadata and auto-regenerates embeddings when titles change."
trigger_phrases:
  - "memory metadata update"
  - "memory_update"
  - "update memory metadata"
  - "embedding regeneration on title change"
  - "rename memory record"
---

# Memory metadata update (memory_update)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Covers the update tool that modifies memory metadata and auto-regenerates embeddings when titles change.

You can rename a spec-doc record or change its priority without deleting and re-creating it. When you change the title, the system automatically updates its internal search index to match. If the update fails partway through, everything rolls back to the way it was before so you never end up with a half-changed record.

---

## 2. HOW IT WORKS

### Core Behavior

You can change the title, trigger phrases, importance weight or importance tier on any existing spec-doc record by its numeric ID. The system verifies the spec-doc record exists, validates your parameters (importance weight between 0 and 1, tier from the valid enum) and applies the changes.

When the title changes, the system regenerates the vector embedding to keep search results aligned. This is a critical detail: if you rename a spec-doc record from "Authentication setup guide" to "OAuth2 configuration reference", the old embedding no longer represents the content accurately. Automatic regeneration fixes that.

By default, if embedding regeneration fails (API timeout, provider outage), the entire update rolls back with no changes applied. Nothing happens. With `allowPartialUpdate` enabled, the metadata changes persist and the embedding is marked as pending for later re-indexing by the next `memory_index_scan`. That mode is useful when you need to fix metadata urgently and can tolerate a temporarily stale embedding.

### Async & Safety

After any optional embedding regeneration finishes, the handler enters `runInTransaction()`. That transactional block writes pending embedding status when needed, updates the spec-doc record row, refreshes BM25, records history, and appends the mutation ledger together so the metadata path does not commit half-finished state.

BM25 refresh is not limited to title edits. Whenever either `title` or `triggerPhrases` changes, the handler re-reads the updated row and rebuilds the BM25 document from `title`, `content_text`, `trigger_phrases`, and `file_path` so lexical search stays aligned with metadata edits. Infrastructure-level BM25 outages are downgraded to warnings, but data-path BM25 failures from an otherwise live index still abort the transaction and roll the update back.

A pre-update hash snapshot is captured for the mutation ledger. Every update records the prior hash, new hash, actor and decision metadata for full auditability.

### Post-Action Behavior

Embedding replacement now reports reality instead of optimism. When `update_memory()` receives a new embedding, it writes `embedding_status = 'pending'` as part of the main `memory_index` update and only flips that row to `'success'` after the replacement `vec_memories` insert completes. That prevents sqlite-vec outages or vec-table write failures from leaving metadata rows marked successful when no fresh vector was actually stored.

Successful metadata updates now invalidate the search cache as part of the same transactional path. After the handler refreshes BM25, optionally persists the replacement vector and recomputes folder interference scores, it calls `clear_search_cache()` so renamed memories and trigger updates appear in subsequent cached searches immediately instead of after TTL expiry.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-crud-update.ts` | Handler | Update handler |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding regeneration for title changes |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 re-index when title or trigger phrases change |
| `mcp_server/lib/search/vector-index.ts` | Lib | Persistent memory row updates |
| `mcp_server/lib/storage/history.ts` | Lib | Update history writes |
| `mcp_server/lib/storage/mutation-ledger.ts` | Lib | Update audit ledger |
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Transaction wrapper for the mutation path |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/handler-memory-crud.vitest.ts` | Automated test | CRUD handler validation |
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Automated test | Update-path rollback and partial-update scenarios |
| `mcp_server/tests/bm25-index.vitest.ts` | Automated test | BM25 index operations |

---

## 4. SOURCE METADATA
- Group: Mutation
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--mutation/017-memory-metadata-update-memoryupdate.md`
Related references:
- [016-memory-indexing-memorysave.md](016-memory-indexing-memorysave.md) — Memory indexing (memory_save)
- [018-single-and-folder-delete-memorydelete.md](018-single-and-folder-delete-memorydelete.md) — Single and folder delete (memory_delete)
