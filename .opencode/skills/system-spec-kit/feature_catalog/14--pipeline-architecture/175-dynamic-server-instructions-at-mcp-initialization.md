---
title: "Dynamic server instructions at MCP initialization"
description: "Dynamic server instructions inject a spec-doc record-system overview (total memories, spec folder count, channels, stale count) into the MCP instruction payload at startup."
trigger_phrases:
  - "dynamic server instructions at mcp initialization"
  - "MCP instruction payload at startup"
  - "inject server instructions"
  - "spec-doc record-system overview"
  - "dynamic MCP startup context"
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
| `mcp_server/context-server.ts` | Core | MCP server entry point; calls `server.setInstructions()` with dynamic overview at startup |
| `mcp_server/handlers/memory-crud-stats.ts` | Handler | `memory_stats` logic reused to compute total memories, spec folder count, channels, stale count |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isDynamicInitEnabled()` flag accessor (`SPECKIT_DYNAMIC_INIT`, default ON) |
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | `isFeatureEnabled()` used by the flag accessor |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/context-server.vitest.ts` | Automated test | Dynamic instructions injection, `SPECKIT_DYNAMIC_INIT` flag behavior |
| `mcp_server/tests/search-flags.vitest.ts` | Automated test | Feature flag behavior |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `14--pipeline-architecture/175-dynamic-server-instructions-at-mcp-initialization.md`
Related references:
- [174-strict-zod-schema-validation.md](174-strict-zod-schema-validation.md) — Strict Zod schema validation
- [176-backend-storage-adapter-abstraction.md](176-backend-storage-adapter-abstraction.md) — Backend storage adapter abstraction
