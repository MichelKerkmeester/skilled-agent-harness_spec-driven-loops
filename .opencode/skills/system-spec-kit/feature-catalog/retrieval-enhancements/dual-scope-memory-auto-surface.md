---
title: "Dual-scope memory auto-surface"
description: "Dual-scope memory auto-surface fires at tool dispatch and session compaction to re-inject critical memories outside explicit search."
trigger_phrases:
  - "dual-scope memory auto-surface"
  - "memory auto-surface"
  - "tool dispatch memory injection"
  - "session compaction re-injection"
version: 3.6.0.17
---

# Dual-scope memory auto-surface

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Dual-scope memory auto-surface fires at tool dispatch and session compaction to re-inject critical memories outside explicit search.

When you are working on something, this feature automatically brings up important memories you might need without you having to ask for them. It watches for two key moments: when you use a tool and when a long conversation gets compressed. Think of it like a helpful assistant who notices what you are doing and quietly slides the right reference notes onto your desk.

---

## 2. HOW IT WORKS

Memory auto-surface hooks fire at two lifecycle points beyond explicit search: tool dispatch for non-memory-aware tools (using extracted context hints), and session compaction (when context is compressed, critical memories are re-injected).

Each hook point has a per-point token budget of 4,000 tokens maximum. The tool dispatch hook checks incoming tool arguments for context hints (input, query, prompt, specFolder, filePath or concepts) and surfaces constitutional-tier and trigger-matched spec-doc records, but skips memory-aware tools to avoid recursive surfacing loops. Memory-aware tools are handled in-band by the context-server pre-dispatch branch (`autoSurfaceMemories` / `autoSurfaceAtCompaction`). Constitutional memories are cached for 1 minute via an in-memory cache.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/context-server.ts` | Core | Pre-dispatch handling for memory-aware tools (`autoSurfaceMemories` / `autoSurfaceAtCompaction`) |
| `mcp-server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/context-server.vitest.ts` | Automated test | Tool-dispatch and compaction hook integration coverage |

---

## 4. SOURCE METADATA
- Group: Retrieval Enhancements
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `retrieval-enhancements/dual-scope-memory-auto-surface.md`
Related references:
- [constitutional-memory-as-expert-knowledge-injection.md](../../feature-catalog/retrieval-enhancements/constitutional-memory-as-expert-knowledge-injection.md) — Constitutional memory as expert knowledge injection
