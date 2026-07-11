---
title: "Lineage state active projection and asOf resolution"
description: "Lineage state active projection appends immutable lineage rows at save time and resolves the currently effective state via deterministic `asOf` timestamp lookup."
trigger_phrases:
  - "lineage state active projection and asof resolution"
  - "asOf timestamp lookup"
  - "immutable lineage rows"
  - "deterministic state projection"
  - "resolve effective state at timestamp"
version: 3.6.0.12
---

# Lineage state active projection and asOf resolution

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Lineage state active projection appends immutable lineage rows at save time and resolves the currently effective state via deterministic `asOf` timestamp lookup.

Every time a spec-doc record is saved, the system adds a timestamped record of that change to a history log. When you need to know what a spec-doc record looked like at a specific point in the past, the system can look up the history and give you the exact version from that moment. Think of it as a timeline for each spec-doc record that you can rewind to any date, useful for understanding what changed and when.

---

## 2. HOW IT WORKS

Phase 2 introduced versioned lineage state as a first-class storage primitive. Save-time writes append immutable lineage rows, while a deterministic active projection resolves which row is currently effective for a spec-doc record.

The active projection supports deterministic `asOf` resolution: for any timestamp, the runtime selects the latest valid lineage state at or before that point. Transition validation now compares parsed epoch timestamps, not raw strings, so non-ISO formatting or timezone variants cannot be misordered during predecessor checks. This enables time-consistent retrieval, deterministic rollback planning and predictable replay behavior for migration and audit workflows.

Schema support is now part of vector index setup, and save handlers integrate lineage writes so append-first lineage history and active projection stay synchronized.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/storage/lineage-state.ts` | Lib | Lineage append, active projection resolution, and `asOf` lookup |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Lineage schema creation and compatibility checks |
| `mcp_server/handlers/memory-save.ts` | Handler | Save-path integration for lineage writes and projection updates |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/memory-lineage-state.vitest.ts` | Automated test | Active projection and deterministic `asOf` selection |
| `mcp_server/tests/memory-lineage-backfill.vitest.ts` | Automated test | Backfill planning, idempotent apply, and rollback restore behavior |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `pipeline-architecture/lineage-state-active-projection-and-asof-resolution.md`

Related references:
- [atomic-pending-file-recovery.md](atomic-pending-file-recovery.md) — Atomic pending-file recovery
- [mcp-server-public-api-barrel.md](mcp-server-public-api-barrel.md) — MCP Server Public API Barrel

---
## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenarios 129 and 130
