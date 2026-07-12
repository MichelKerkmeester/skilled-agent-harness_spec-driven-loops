---
title: "Generation-Tagged Snapshot Publication"
description: "Generation counter plus post-commit publication that make reindex transitions atomic and visible to readers without partial-write leakage."
trigger_phrases:
  - "generation counter"
  - "snapshot publication"
  - "post commit publication"
  - "atomic reindex"
version: 0.8.0.12
---

# Generation-Tagged Snapshot Publication

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Make reindex transitions observable and atomic. Every snapshot is tagged with a monotonically increasing generation so readers can tell when routing state has advanced and cache layers can invalidate in lockstep.

## 2. HOW IT WORKS

`lib/freshness/generation.ts` writes the generation counter through a temp-file plus atomic rename. Post-commit publication makes the new snapshot visible to readers only after the counter has advanced. Corrupted counters are recovered when recoverable and reported as `unavailable` freshness when not. Generation bumps feed both `advisor_status.generation` and cache invalidation (see `lib/freshness/cache-invalidation.ts`).

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/generation.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/generation.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/cache-invalidation.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/daemon-freshness-foundation.vitest.ts` | Automated test | generation bump atomicity |
| `Playbook scenario [AU-004](../../manual_testing_playbook/auto_update_daemon/generation_publication.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Daemon and freshness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `daemon-and-freshness/generation.md`

Related references:

- [01-watcher.md](./watcher.md).
- [05-trust-state.md](../daemon_and_freshness/trust_state.md).
- [07-cache-invalidation.md](../daemon_and_freshness/cache_invalidation.md).
