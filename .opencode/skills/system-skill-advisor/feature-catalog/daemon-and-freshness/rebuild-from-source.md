---
title: "Rebuild From Source on Corrupt SQLite"
description: "Recovery path that reconstructs the advisor graph from SKILL.md and graph-metadata.json sources when the SQLite database is corrupt or unreadable."
trigger_phrases:
  - "rebuild from source"
  - "corrupt sqlite recovery"
  - "source driven rebuild"
  - "advisor recovery"
version: 0.8.0.13
---

# Rebuild From Source on Corrupt SQLite

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Ensure the advisor never gets stuck in an unrecoverable state when SQLite storage is corrupted. The rebuild-from-source path reconstructs routable state from the authoritative source files without user intervention.

## 2. HOW IT WORKS

`lib/freshness/rebuild-from-source.ts` detects a corrupt or unreadable SQLite store via the daemon lifecycle, then walks `.opencode/skills/*/SKILL.md` plus each `graph-metadata.json`, applies the auto-indexing derivation pipeline and republishes a fresh snapshot. Throughout the rebuild, readers see `unavailable` trust state and fail-open responses rather than exceptions. Rebuild is also the canonical recovery path for the H5 operator playbook.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/freshness/rebuild-from-source.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/lifecycle.ts` | Daemon | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/tests/daemon-freshness-foundation.vitest.ts` | Automated test | rebuild trigger paths |
| `Playbook scenario [AU-005](../../manual-testing-playbook/auto-update-daemon/rebuild-from-source.md) and [OP-003](../../manual-testing-playbook/operator-h5/unavailable-daemon.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Daemon and freshness
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `daemon-and-freshness/rebuild-from-source.md`

Related references:

- [05-trust-state.md](../../feature-catalog/daemon-and-freshness/trust-state.md).
- [07-cache-invalidation.md](../../feature-catalog/daemon-and-freshness/cache-invalidation.md).
- [`auto-indexing/derived-extraction.md`](../../feature-catalog/auto-indexing/derived-extraction.md), source extraction pipeline consumed during rebuild.
