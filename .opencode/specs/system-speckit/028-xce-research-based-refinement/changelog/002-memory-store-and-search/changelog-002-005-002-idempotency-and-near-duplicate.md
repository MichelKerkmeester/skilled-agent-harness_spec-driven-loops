---
title: "Memclaw Derived Memory Hardening 002: Idempotency and Near-Duplicate"
description: "Schema v35 to v36: flag-gated idempotency receipt table, replay and fail-closed handling on retried saves and updates, and an advisory near_duplicate_of hint with last_dedup_checked_at short-circuit. Default off via SPECKIT_MEMORY_IDEMPOTENCY."
trigger_phrases:
  - "002/005 002 idempotency near duplicate changelog"
  - "SPECKIT_MEMORY_IDEMPOTENCY schema v36 changelog"
  - "idempotency receipt replay shipped"
  - "near_duplicate_of advisory hint"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/002-idempotency-and-near-duplicate` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening`

### Summary

This leaf advances the vector-index schema from v35 to v36 and adds a default-off idempotency path to `memory_save` and `memory_update`. When `SPECKIT_MEMORY_IDEMPOTENCY=true`, an identical retry replays the stored MCP response with `replayed:true`, a changed-payload retry fails closed with `idempotency_key_conflict`, and near-duplicate rows surface as one advisory `near_duplicate_of` hint without gating the write. With the flag off, the schema is present and idle while existing writes remain byte-identical.

### Added

- SQLite idempotency receipt table in schema migration 36 with an idempotent `CREATE TABLE IF NOT EXISTS` path. Receipt key is server-derived from operation name, content hash, and a request fingerprint; client-supplied idempotency-token fields are stripped.
- `idempotency-receipts.ts`: centralized flag check, key derivation, receipt lookup and store, replay marker, and token stripping.
- `near-duplicate.ts`: deterministic advisory computation reusing the dedup threshold constant, `near_duplicate_of` JSON metadata write, `last_dedup_checked_at` short-circuit and clear, and hint parsing.
- `near_duplicate_of` and `last_dedup_checked_at` columns added to `memory_index` in migration 36 with compatibility checks.
- Receipt lookup and replay path added to `memory-save.ts` and `memory-crud-update.ts`: hit-match returns stored response with `replayed:true`; hit-mismatch returns `idempotency_key_conflict` and writes nothing; miss proceeds normally.
- Post-write best-effort receipt store in both handlers: receipt-store failure logs a warning and never blocks the successful write.
- Best-effort index-scan repair in `memory-index.ts` for unstamped success rows when the flag is on.
- `SPECKIT_MEMORY_IDEMPOTENCY` documented in `ENV_REFERENCE.md` (env count 174 to 175).
- Focused Vitest coverage: 16 files, 214 tests, 53 skipped.

### Changed

- `memory-crud-update.ts`: receipt replay and conflict handling inserted at the guarded pre-mutation point established in leaf 001.
- `dedup.ts`: added retry-vs-content classifier and near-duplicate threshold export.
- `enrichment-state.ts`: exposed marker short-circuit and clear helpers through the enrichment state surface.
- `response-builder.ts`: carries `replayed:true` and `near_duplicate_of` on the existing response envelope.
- `vector-index-schema.ts`: schema version bumped from 35 to 36.

### Fixed

- None.

### Verification

- `npm run build`: passed.
- Vitest: 16 files, 214 tests, 53 skipped.
- Receipt: identical retry replays with zero duplicate rows; changed-payload retry fails closed; forged client token cannot influence server-derived key.
- Near-duplicate: advisory hint present when similarity threshold met; rows without embeddings skipped silently.
- `last_dedup_checked_at` short-circuit and clear behavior confirmed.
- Receipt-store failure fallback: write succeeds and logs a warning.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modified | Schema v36: receipt table plus `near_duplicate_of` and `last_dedup_checked_at` columns with idempotent migration. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts` | Added | Flag, key derivation, receipt lookup and store, replay marker, and token stripping. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/near-duplicate.ts` | Added | Advisory computation, marker short-circuit and clear, and hint parsing. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Pre-mutation receipt lookup/replay/conflict path and post-write best-effort receipt store. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | Modified | Same receipt replay and conflict handling at the guarded pre-mutation point. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts` | Modified | Retry-vs-content classifier and near-duplicate threshold export. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts` | Modified | Marker short-circuit and clear helpers exposed through enrichment state. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts` | Modified | `replayed:true` and `near_duplicate_of` on the existing response envelope. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified | Best-effort index-scan repair for unstamped success rows when flag is on. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | `SPECKIT_MEMORY_IDEMPOTENCY` documented; env count 174 to 175. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/**` | Modified | Focused idempotency and near-duplicate coverage and updated schema canaries. |

### Follow-Ups

- Runtime replay and near-duplicate behavior remain inert until `SPECKIT_MEMORY_IDEMPOTENCY=true` is set.
- Near-duplicate advisory requires an embedding to be present; index scan can stamp rows without embeddings after they are enriched.
- Receipt persistence is best-effort: if storage fails after a valid write, that specific write will not replay until a later successful store.
