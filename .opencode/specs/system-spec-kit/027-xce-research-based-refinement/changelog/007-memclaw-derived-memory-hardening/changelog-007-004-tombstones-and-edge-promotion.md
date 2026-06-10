---
title: "Memclaw Derived Memory Hardening 004: Tombstones and Edge Promotion"
description: "Schema v37: flag-gated soft-delete tombstones (SPECKIT_SOFT_DELETE_TOMBSTONES default off), retention sweep partition gate, skip-manual causal-edge promotion with provenance pass-through, active and purgeable partial indexes, and the entity-cooccurrence-is-not-causal advisory invariant."
trigger_phrases:
  - "007 004 tombstones edge promotion changelog"
  - "SPECKIT_SOFT_DELETE_TOMBSTONES default off changelog"
  - "schema v37 tombstone partition"
  - "skip-manual causal edge promotion shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening`

### Summary

This leaf preserves existing hard-delete behavior by default while shipping the tombstone infrastructure at schema v37 behind an explicit opt-in. The independent review found the original premise was wrong: memory delete was already a hard delete through `vectorIndex.deleteMemory`, not a soft-delete rewriter. Because recall surfaces do not yet filter `deleted_at IS NULL`, tombstones cannot be enabled safely by default. With `SPECKIT_SOFT_DELETE_TOMBSTONES` off, all delete and retention-sweep paths are byte-identical to before this leaf. With the flag on, deletes write `COALESCE(deleted_at, now)` to preserve the first timestamp, and the retention sweep targets the purgeable partition.

### Added

- Schema v37 migration: `deleted_at` column, active partial index (`deleted_at IS NULL`), and purgeable partial index (`deleted_at IS NOT NULL`) with idempotent migration.
- `SPECKIT_SOFT_DELETE_TOMBSTONES` documented in `ENV_REFERENCE.md` (env count 175 to 176) as default off.
- Advisory constitutional rule `entity-cooccurrence-is-not-causal.md`: entity and co-occurrence signals are recall evidence and must not be promoted as causal truth.
- Vitest coverage: 4 files, 48 tests covering both flag states for single delete, bulk delete, and retention sweep partitioning.

### Changed

- `memory-crud-delete.ts`: flag gate added. Flag off keeps the existing hard-delete primitive and all cleanup side effects unchanged. Flag on uses the COALESCE tombstone writer.
- `memory-bulk-delete.ts`: same flag gate and first-timestamp tombstone behavior for bulk deletes.
- `memory-retention-sweep.ts`: flag off preserves the active TTL sweep reaping active expired rows. Flag on uses the purgeable partition and reports `tombstoneState` in the sweep result.
- `vector-index-schema.ts`: schema version bumped from 36 to 37; active and purgeable partial indexes added.

### Fixed

- None.

### Verification

- `npx tsc --noEmit -p tsconfig.json`: no output.
- `npx vitest run tests/causal-edge-tombstones.vitest.ts tests/memory-retention-sweep.vitest.ts tests/memory-retention-feedback-learning.vitest.ts tests/causal-edges-write-safety.vitest.ts`: 4 files, 48 tests passed.
- Flag-off single delete hard-removes memory: `causal-edge-tombstones.vitest.ts` asserts row removed from `memory_index`.
- Flag-on single and bulk tombstone first timestamp: repeated deletes keep the first `deleted_at`.
- Flag-off retention sweep reaps active expired rows exactly as before.
- Flag-on retention sweep uses purgeable partition: `usesPurgeablePartition:true`, `usingPurgeableIndex:true`, only tombstoned expired rows swept.
- Schema version confirmed: `SCHEMA_VERSION` 37.
- ENV count confirmed: 175 to 176.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | Modified | Default-off flag gate: hard delete when off, COALESCE tombstone when on. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | Modified | Same flag gate and first-timestamp tombstone behavior for bulk deletes. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | Modified | Default-off active TTL sweep; flag-on purgeable partition selection. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | `SPECKIT_SOFT_DELETE_TOMBSTONES` documented; env count 175 to 176. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/causal-edge-tombstones.vitest.ts` | Modified | Default hard-delete proof and flag-on first-timestamp tests. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts` | Modified | Flag-off active TTL proof and flag-on purgeable partition proof. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modified | Active and purgeable partial indexes and v37 migration. |
| `.opencode/skills/system-spec-kit/constitutional/entity-cooccurrence-is-not-causal.md` | Added | Advisory invariant: entity and co-occurrence are not causal truth. |

### Follow-Ups

- `SPECKIT_SOFT_DELETE_TOMBSTONES` must remain off until a follow-up adds `deleted_at IS NULL` filtering to every recall surface: search, list, get, context, and triggers.
- Cache invalidation for tombstoned rows and tombstone-on-expiry reaping semantics must be decided before operators enable the flag.
- Causal graph callers that do not want similarity-derived support edges should pass `similarity:false`; entity and co-occurrence remain recall evidence only.
