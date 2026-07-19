---
title: "Architecture: MCP Layer Definitions"
description: "Layer constants, tool mapping and token budget helpers for Spec Kit Memory MCP tools."
trigger_phrases:
  - "architecture layers"
  - "layer definitions"
  - "token budgets"
---

# Architecture: MCP Layer Definitions

---

## 1. OVERVIEW

`architecture/` owns the MCP layer model used to label tools, assign token budgets and recommend tool surfaces by task type. The folder is intentionally small because the layer map is a shared reference, not a runtime pipeline.

Current state:

- Seven layers group tools from orchestration through maintenance.
- Token budgets live beside layer definitions so descriptions and runtime routing stay aligned.
- Documentation helpers generate a markdown view of the current layer map.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    ARCHITECTURE LAYERS                           │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌──────────────────────┐      ┌───────────────────┐
│ MCP tool names │ ───▶ │ layer-definitions.ts │ ───▶ │ Layer prefix text │
└───────┬────────┘      └──────────┬───────────┘      └───────────────────┘
        │                          │
        │                          ▼
        │                ┌──────────────────────┐
        ├──────────────▶ │ Token budget lookup  │
        │                └──────────────────────┘
        │
        │                ┌──────────────────────┐
        └──────────────▶ │ Task recommendation  │
                         └──────────────────────┘

Dependency direction: MCP registration ───▶ architecture constants ───▶ formatted descriptions
```

---

## 3. PACKAGE TOPOLOGY

```text
architecture/
+-- layer-definitions.ts  # Layer data, mappings and helper functions
`-- README.md             # Local developer orientation

Allowed direction:
MCP registration → architecture/layer-definitions.ts
architecture/layer-definitions.ts → local constants and TypeScript types

Disallowed direction:
architecture/ → memory database access
architecture/ → tool handler execution
architecture/ → generated dist files
```

---

## 4. DIRECTORY TREE

```text
architecture/
├── layer-definitions.ts
└── README.md
```

---

## 5. KEY FILES

| File | Role |
|---|---|
| `layer-definitions.ts` | Defines `LayerDefinition`, layer IDs, token budgets, tool-to-layer mapping, task recommendations and markdown generation. |

Layer summary:

| Layer | Name | Purpose |
|---|---|---|
| `L1` | Orchestration | Unified entry points with intent-aware routing. |
| `L2` | Core | Primary memory operations such as search, save and triggers. |
| `L3` | Discovery | Browse, stats and health surfaces. |
| `L4` | Mutation | Update, delete and validation operations. |
| `L5` | Lifecycle | Checkpoints and restore operations. |
| `L6` | Analysis | Causal tracing, learning, graph and evaluation operations. |
| `L7` | Maintenance | Bulk indexing, scans and maintenance work. |

---

## 6. BOUNDARIES AND FLOW

Boundaries:

- Own layer metadata, token budgets and layer lookup helpers.
- Do not own tool implementation, tool registration side effects or response bodies.
- Keep mappings explicit so missing tools fall back safely to default budgets.
- Keep this folder free of storage, network and filesystem behavior.

Main flow:

```text
╭──────────────────────────────────────────╮
│ Tool name or task type                   │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Lookup layer mapping                     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Return prefix, budget or recommendation  │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Caller formats tool metadata             │
╰──────────────────────────────────────────╯
```

---

## 7. ENTRYPOINTS

| Entrypoint | Used For |
|---|---|
| `getLayerPrefix(toolName)` | Add a layer tag such as `[L2:Core]` to a tool description. |
| `enhanceDescription(toolName, desc)` | Build the full user-facing tool description prefix. |
| `getTokenBudget(toolName)` | Read the token budget for a mapped tool. |
| `getLayerInfo(toolName)` | Retrieve the full layer record for a tool. |
| `getLayersByPriority()` | Return all layer definitions in priority order. |
| `getRecommendedLayers(taskType)` | Choose layer groups for a task category. |
| `getLayerDocumentation()` | Render the layer table as markdown. |

---

## 8. VALIDATION

Run from the repository root:

```bash
pnpm --dir .opencode/skills/system-spec-kit typecheck
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp-server/lib/architecture/README.md
```

---

## 9. RELATED

| Resource | Relationship |
|---|---|
| [../README.md](../README.md) | Parent library map. |
| [../response/README.md](../response/README.md) | Response shaping that uses token budgets. |
| [../cache/README.md](../cache/README.md) | Cached tool output surfaces. |
| [../../README.md](../../README.md) | MCP server overview. |
