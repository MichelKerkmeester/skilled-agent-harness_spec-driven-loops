---
title: "Generation-Tied Cache Invalidation"
description: "Targeted cache invalidation that ties prompt-cache and attribution-cache entries to generation so stale reads are impossible after a reindex."
trigger_phrases:
  - "cache invalidation"
  - "generation tied cache"
  - "prompt cache invalidation"
  - "targeted invalidation"
version: 0.8.0.13
---

# Generation-Tied Cache Invalidation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Prevent stale cache reads after a graph reindex. Every cache entry is tagged with the generation under which it was computed. A generation bump atomically invalidates affected entries without blowing away the whole cache.

## 2. HOW IT WORKS

`lib/freshness/cache-invalidation.ts` bumps an internal invalidation epoch whenever the generation advances. Prompt cache entries (`lib/prompt-cache.ts`) carry the generation as part of their key so post-bump hits miss cleanly. The 5-minute TTL still applies, but generation-based invalidation fires earlier when source truly changed. Lane-attribution scoring caches rebuild alongside the next recommendation call.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/freshness/cache-invalidation.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/prompt-cache.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-prompt-cache.vitest.ts` | Automated test | prompt cache TTL and invalidation |
| `Playbook scenario [AU-004](../../manual-testing-playbook/auto-update-daemon/generation-publication.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Daemon and freshness
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `daemon-and-freshness/cache-invalidation.md`

Related references:

- [04-generation.md](./generation.md).
- [05-trust-state.md](../../feature-catalog/daemon-and-freshness/trust-state.md).
- [`mcp-surface/advisor-recommend.md`](../../feature-catalog/mcp-surface/advisor-recommend.md).
