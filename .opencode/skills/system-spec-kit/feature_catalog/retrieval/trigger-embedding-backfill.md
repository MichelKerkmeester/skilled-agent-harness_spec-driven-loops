---
title: "Trigger embedding backfill"
description: "Default-off, resumable backfill for memory_trigger_embeddings, giving semantic trigger matching a derived embedding substrate while lexical triggers remain primary."
trigger_phrases:
  - "trigger embedding backfill"
  - "memory_trigger_embeddings"
  - "schema v34 semantic trigger"
  - "semantic trigger storage substrate"
version: 3.6.0.1
---

# Trigger embedding backfill

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Trigger embedding backfill creates the derived storage needed for semantic trigger evaluation while preserving existing lexical trigger behavior by default.

The feature adds the `memory_trigger_embeddings` table and a resumable helper that only populates rows when explicitly enabled. Disabled runs create no rows and make no provider calls.

---

## 2. HOW IT WORKS

Schema v34 adds `memory_trigger_embeddings` through the vector-index migration runner and keeps fresh-database DDL in parity. The table stores profile-keyed trigger embedding metadata while the actual vectors reuse the existing embedding cache store.

`memory_index_scan` calls the helper from scan completion. The helper is resumable, avoids duplicate rows on re-run, and only marks rows ready after a durable vector write. The save-time hook is not part of this feature; population is out-of-band through the scan/backfill path.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/lib/search/vector-index-schema.ts` | Shared | Schema v34 table migration and fresh-DB compatibility |
| `mcp_server/lib/search/trigger-embedding-backfill.ts` | Shared | Default-off resumable trigger-phrase embedding backfill |
| `mcp_server/handlers/memory-index.ts` | Handler | Calls the helper from scan completion and returns outcome data |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/trigger-embedding-backfill.vitest.ts` | Automated test | Default-off, resumability, no duplicate, and durable-ready coverage |
| `mcp_server/tests/vector-index-schema-compatibility.vitest.ts` | Automated test | Compatible schema footprint includes the trigger table |
| `mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts` | Automated test | Migration path and terminal schema coverage |

---

## 4. SOURCE METADATA

- Group: Retrieval
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `retrieval/trigger-embedding-backfill.md`

Related references:
- [semantic-trigger-shadow-matcher-and-hybrid-handler.md](semantic-trigger-shadow-matcher-and-hybrid-handler.md) - Runtime consumer of trigger embeddings
- [trigger-phrase-matching-memorymatchtriggers.md](trigger-phrase-matching-memorymatchtriggers.md) - Trigger matcher entry point
