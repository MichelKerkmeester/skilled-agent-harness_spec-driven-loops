---
title: "Embedder list registry inventory"
description: "embedder_list reports every supported embedder with name, dimensions, provider tag, and active status drawn from the embedder registry, giving operators a single MCP surface for embedder discovery."
trigger_phrases:
  - "embedder list registry inventory"
  - "embedder_list"
  - "list embedders"
  - "embedder registry"
  - "active embedder"
version: 3.6.0.7
---

# Embedder list registry inventory

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

embedder_list reports every supported embedder with name, dimensions, provider tag, and active status drawn from the embedder registry, giving operators a single MCP surface for embedder discovery.

The handler is the read-only entry point of the embedder swap surface. It returns one entry per registered embedder and marks exactly one as active. Operators use the list to confirm which embedder backs the current corpus before planning a swap, and consumers can match a desired model name against the canonical registry without reading source.

---

## 2. HOW IT WORKS

The handler lives at `mcp_server/handlers/embedder-list.ts` and the registry it reads lives at `mcp_server/lib/embedders/registry.ts`. The registry defines the single shipped manifest `nomic-embed-text-v1.5` with stable fields for `name`, `dimensions`, `provider`, and a `status` or `active` marker.

A successful call returns a list where every entry carries the four required fields and exactly one entry has the active marker set. The active pointer is sourced from the database (vector-table metadata) rather than recomputed per call, so concurrent readers see the same active embedder.

The handler is one of three MCP tools that make up the embedder swap surface. `embedder_list` reports the inventory, `embedder_set` plans or applies a swap, and `embedder_status` reports current pointer state and swap-job progress. Together they replace the older script-only swap path and give every CLI client the same view of the embedder catalog.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts` | Handler | Returns every registered embedder with name, dimensions, provider, and active status |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` | Lib | Canonical registry of shipped embedders, dimensions, and provider tags read by the list handler |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-list.vitest.ts` | Automated test | Happy-path coverage for the list handler shape, required fields, and active-marker invariant |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-registry.vitest.ts` | Automated test | Registry-level coverage for every shipped embedder definition |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/embedder-list-registry-inventory.md` | Manual playbook | Playbook scenario 281 covering the operator-facing list output and active-embedder identification |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/embedder-list-registry-inventory.md`
Related references:
- [graph-degraded-stress-cell-isolation.md](graph-degraded-stress-cell-isolation.md) — Graph degraded stress cell with SPEC_KIT_DB_DIR isolation
- [embedder-set-dry-run-and-validation.md](embedder-set-dry-run-and-validation.md) — Embedder set dry-run and validation
