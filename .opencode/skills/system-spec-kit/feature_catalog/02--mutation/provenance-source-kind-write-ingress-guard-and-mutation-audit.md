---
title: "Provenance source_kind write-ingress guard and mutation audit"
description: "Server-derived source_kind provenance, guarded automated writes, and deduplicated mutation-ledger audit for memory create and update paths."
trigger_phrases:
  - "provenance source_kind write-ingress guard and mutation audit"
  - "source_kind provenance"
  - "automated overwrite guard"
  - "mutation ledger deduped audit"
---

# Provenance source_kind write-ingress guard and mutation audit

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Memory writes persist server-derived provenance and reject or skip unsafe automated overwrites before mutation.

The feature adds `memory_index.source_kind`, derives provenance from trusted server context, prevents callers from forging provenance fields, and records deduplicated audit ledger entries for mutation decisions.

---

## 2. HOW IT WORKS

Schema v35 adds the `source_kind` column and a backfill mapping older provenance values into `human`, `agent`, `system`, `import`, or `feedback`. Create and update handlers derive source kind from server-side context and reject caller-supplied `source_kind` or `__provenanceContext` at strict schema boundaries.

`buildGuardedUpdateParams` applies the protected-field guard before updates. Automated writes skip protected manual or constitutional fields while human writes and human-over-automated writes remain allowed. The mutation ledger appends deduplicated events keyed by actor, source, and reason; append failure logs a warning and does not roll back the write being audited.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/lib/search/vector-index-schema.ts` | Shared | Schema v35 source_kind migration and backfill |
| `mcp_server/handlers/save/create-record.ts` | Handler | Persists server-derived source kind during create |
| `mcp_server/handlers/memory-crud-update.ts` | Handler | Derives update provenance, rejects forged input, and guards protected writes |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Keeps post-write cache and audit behavior scoped |
| `mcp_server/lib/storage/mutation-ledger.ts` | Shared | Deduplicated audit append keyed by actor, source, and reason |
| `.opencode/skills/system-spec-kit/constitutional/automated-writers-never-overwrite-manual.md` | Constitutional memory | Advisory governance rule paired with the guard |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts` | Automated test | Protected-field guard behavior |
| `mcp_server/tests/mutation-ledger.vitest.ts` | Automated test | Deduplicated audit append coverage |
| `mcp_server/tests/create-record-identity.vitest.ts` | Automated test | Create-path provenance and identity coverage |
| `mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts` | Automated test | Schema migration coverage |

---

## 4. SOURCE METADATA

- Group: Mutation
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--mutation/provenance-source-kind-write-ingress-guard-and-mutation-audit.md`

Related references:
- [memory-indexing-memorysave.md](memory-indexing-memorysave.md) - Save entry point
- [memory-metadata-update-memoryupdate.md](memory-metadata-update-memoryupdate.md) - Update entry point
