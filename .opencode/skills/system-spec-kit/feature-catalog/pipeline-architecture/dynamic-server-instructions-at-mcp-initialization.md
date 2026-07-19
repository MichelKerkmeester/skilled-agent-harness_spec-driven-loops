---
title: "Dynamic server instructions at MCP initialization"
description: "Dynamic server instructions inject a spec-doc record-system overview (total memories, spec folder count, channels, stale count) into the MCP instruction payload at startup."
trigger_phrases:
  - "dynamic server instructions at mcp initialization"
  - "MCP instruction payload at startup"
  - "inject server instructions"
  - "spec-doc record-system overview"
  - "dynamic MCP startup context"
version: 3.6.0.18
---

# Dynamic server instructions at MCP initialization

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Dynamic server instructions inject a spec-doc record-system overview (total memories, spec folder count, channels, stale count) into the MCP instruction payload at startup.

When the spec-doc record server starts up, it now tells the calling AI how many memories are stored, how many folders exist and which search methods are available. This is like a librarian greeting you at the door with a summary of what the library has today. It helps the AI make smarter decisions about how to search right from the start.

---

## 2. HOW IT WORKS

**IMPLEMENTED (Sprint 019).** Startup in `context-server.ts` uses `server.setInstructions()` to inject a dynamic memory-system overview (total memories, spec folder count, channels, stale count) into the MCP instruction payload. Reuses existing `memory_stats` logic. Gated by `SPECKIT_DYNAMIC_INIT` (default `true`).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/context-server.ts` | Core | MCP server entry point; calls `server.setInstructions()` with dynamic overview at startup |
| `mcp-server/handlers/memory-crud-stats.ts` | Handler | `memory_stats` logic reused to compute total memories, spec folder count, channels, stale count |
| `mcp-server/lib/search/search-flags.ts` | Lib | `isDynamicInitEnabled()` flag accessor (`SPECKIT_DYNAMIC_INIT`, default ON) |
| `mcp-server/lib/cognitive/rollout-policy.ts` | Lib | `isFeatureEnabled()` used by the flag accessor |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/context-server.vitest.ts` | Automated test | Dynamic instructions injection, `SPECKIT_DYNAMIC_INIT` flag behavior |
| `mcp-server/tests/search-flags.vitest.ts` | Automated test | Feature flag behavior |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `pipeline-architecture/dynamic-server-instructions-at-mcp-initialization.md`
Related references:
- [strict-zod-schema-validation.md](../../feature-catalog/pipeline-architecture/strict-zod-schema-validation.md) — Strict Zod schema validation
- [backend-storage-adapter-abstraction.md](../../feature-catalog/pipeline-architecture/backend-storage-adapter-abstraction.md) — Backend storage adapter abstraction
