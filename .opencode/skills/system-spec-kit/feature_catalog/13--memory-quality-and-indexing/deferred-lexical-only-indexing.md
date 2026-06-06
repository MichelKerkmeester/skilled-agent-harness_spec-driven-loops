---
title: "Deferred lexical-only indexing"
description: "Deferred lexical-only indexing stores memories with `embedding_status='pending'` when embedding generation fails, keeping them searchable via BM25/FTS5 until retry succeeds."
trigger_phrases:
  - "deferred lexical-only indexing"
  - "embedding_status pending"
  - "index_memory_deferred"
  - "BM25 fallback when embedding fails"
  - "deferred memory indexing"
---

# Deferred lexical-only indexing

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Deferred lexical-only indexing stores memories with `embedding_status='pending'` when embedding generation fails, keeping them searchable via BM25/FTS5 until retry succeeds.

Sometimes the system cannot create a full searchable fingerprint for a spec-doc record because the fingerprinting service is temporarily down. Instead of losing the spec-doc record entirely, this feature saves it in a simpler text-searchable form so you can still find it by keywords. When the fingerprinting service comes back, the system automatically retries and upgrades the spec-doc record to full searchability.

---

## 2. HOW IT WORKS

Async embedding fallback via `index_memory_deferred()`. When embedding generation fails (API timeout, rate limit), memories are inserted with `embedding_status='pending'` and are immediately searchable via BM25/FTS5 (title, trigger_phrases, content_text) and structural SQL (importance_tier, importance_weight). Vector search requires `embedding_status='success'`. Deferred memories skip embedding dimension validation and `vec_memories` insertion. Background retry via the retry manager or CLI reindex increments `retry_count` and updates status. Failure reason is recorded for diagnostics.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Vector index mutations with deferred path |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Vector index schema including embedding_status |
| `mcp_server/handlers/save/embedding-pipeline.ts` | Handler | Embedding generation pipeline with fallback |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/vector-index-impl.vitest.ts` | Automated test | Vector index implementation |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Automated test | Save handler validation |
| `mcp_server/tests/retry-manager.vitest.ts` | Automated test | Retry manager tests |

---

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `13--memory-quality-and-indexing/deferred-lexical-only-indexing.md`
- Playbook reference: 111
Related references:
- [quality-gate-timer-persistence.md](quality-gate-timer-persistence.md) — Quality gate timer persistence
- [dry-run-preflight-for-memory-save.md](dry-run-preflight-for-memory-save.md) — Dry-run preflight for memory_save
