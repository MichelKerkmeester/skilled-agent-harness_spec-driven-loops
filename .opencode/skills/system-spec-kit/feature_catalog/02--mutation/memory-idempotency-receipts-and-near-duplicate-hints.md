---
title: "Memory idempotency receipts and near-duplicate hints"
description: "Default-off idempotency receipts for memory_save and memory_update, plus advisory near_duplicate_of hints and dedup short-circuit markers."
trigger_phrases:
  - "memory idempotency receipts and near-duplicate hints"
  - "SPECKIT_MEMORY_IDEMPOTENCY"
  - "idempotency receipt replay"
  - "near_duplicate_of advisory hint"
---

# Memory idempotency receipts and near-duplicate hints

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Memory save and update retries can replay identical requests and fail closed on changed-payload retries when `SPECKIT_MEMORY_IDEMPOTENCY=true`.

The same feature also stamps advisory near-duplicate hints on successful writes. With the flag off, the schema is present but receipt replay and near-duplicate behavior remain inert.

---

## 2. HOW IT WORKS

Schema v36 adds the idempotency receipt table plus `near_duplicate_of` and `last_dedup_checked_at` columns. The receipt helper derives keys from operation name, content hash, and a server-side request fingerprint, then strips client-supplied idempotency token fields.

On receipt hit, matching requests replay the stored response verbatim with no added replay marker; changed-payload retries return `idempotency_key_conflict` and write nothing. On miss, the write proceeds normally and stores the receipt best-effort after success. Near-duplicate computation reuses the dedup threshold, writes advisory metadata, and clears or short-circuits markers through enrichment-state helpers.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/lib/search/vector-index-schema.ts` | Shared | Schema v36 receipt table and marker columns |
| `mcp_server/lib/storage/idempotency-receipts.ts` | Shared | Flag check, key derivation, receipt lookup/store, stored-response replay, token stripping |
| `mcp_server/lib/storage/near-duplicate.ts` | Shared | Advisory near-duplicate computation and hint parsing |
| `mcp_server/handlers/memory-save.ts` | Handler | Save-path replay, conflict handling, and receipt store |
| `mcp_server/handlers/memory-crud-update.ts` | Handler | Update-path replay, conflict handling, and receipt store |
| `mcp_server/handlers/save/response-builder.ts` | Handler | Response envelope fields for near-duplicate hints on newly built responses |
| `mcp_server/handlers/memory-index.ts` | Handler | Best-effort repair for unstamped rows when enabled |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/memory-idempotency-and-near-duplicate.vitest.ts` | Automated test | Receipt key, replay, conflict, token-stripping, advisory marker, and hint coverage |
| `mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts` | Automated test | Schema v36 migration coverage |

---

## 4. SOURCE METADATA

- Group: Mutation
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--mutation/memory-idempotency-receipts-and-near-duplicate-hints.md`

Related references:
- [provenance-source-kind-write-ingress-guard-and-mutation-audit.md](provenance-source-kind-write-ingress-guard-and-mutation-audit.md) - Guarded pre-mutation point
- [memory-indexing-memorysave.md](memory-indexing-memorysave.md) - Save entry point
