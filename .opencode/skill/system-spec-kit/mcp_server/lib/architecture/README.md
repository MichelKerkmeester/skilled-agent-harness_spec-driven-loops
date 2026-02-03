# Architecture Module

> 7-layer MCP architecture with token budgets for progressive disclosure and cognitive load management.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. ⚡ FEATURES](#3--features)
- [4. 💡 USAGE](#4--usage)
- [5. 🔗 RELATED RESOURCES](#5--related-resources)

---

## 1. 📖 OVERVIEW

The architecture module defines the 7-layer MCP tool organization (T060) that enables progressive disclosure from high-level orchestration to specialized operations. Each layer has an assigned token budget to manage response sizes and cognitive load.

### Design Principles

| Principle | Description |
|-----------|-------------|
| **Progressive Disclosure** | Start with high-level, drill down as needed |
| **Token Efficiency** | Higher layers = fewer tokens, more targeted |
| **Cognitive Load** | Reduce choices at each decision point |

### Layer Summary

| Layer | Name | Token Budget | Purpose |
|-------|------|--------------|---------|
| L1 | Orchestration | 2000 | Unified entry points with intent-aware routing |
| L2 | Core | 1500 | Primary memory operations (search, save, triggers) |
| L3 | Discovery | 800 | Browse and explore (list, stats, health) |
| L4 | Mutation | 500 | Modify existing memories (update, delete, validate) |
| L5 | Lifecycle | 600 | Checkpoint and version management |
| L6 | Analysis | 1200 | Deep inspection and causal analysis |
| L7 | Maintenance | 1000 | System maintenance and bulk operations |

---

## 2. 📁 STRUCTURE

```
architecture/
├── index.js              # Module aggregator
└── layer-definitions.js  # 7-layer hierarchy with token budgets
```

### Key Files

| File | Purpose |
|------|---------|
| `layer-definitions.js` | Layer constants, tool-to-layer mapping, token budget helpers |
| `index.js` | Re-exports layer-definitions for clean imports |

---

## 3. ⚡ FEATURES

### Layer Definitions

Each layer includes:
- **id**: Layer identifier (L1-L7)
- **name**: Human-readable name
- **description**: Purpose and usage guidance
- **tokenBudget**: Maximum tokens for responses
- **priority**: Layer order (1 = highest)
- **tools**: Array of tools belonging to this layer

### Helper Functions

| Function | Purpose |
|----------|---------|
| `getLayerPrefix(toolName)` | Get layer prefix string, e.g., `[L2:Core]` |
| `enhanceDescription(toolName, desc)` | Add layer prefix to tool description |
| `getTokenBudget(toolName)` | Get token budget for a tool |
| `getLayerInfo(toolName)` | Get full layer definition for a tool |
| `getLayersByPriority()` | Get all layers sorted by priority |
| `getRecommendedLayers(taskType)` | Get recommended layers for task type |
| `getLayerDocumentation()` | Generate markdown documentation |

---

## 4. 💡 USAGE

### Basic Import

```javascript
const {
  LAYER_DEFINITIONS,
  getTokenBudget,
  getLayerPrefix
} = require('./lib/architecture');
```

### Get Token Budget

```javascript
const budget = getTokenBudget('memory_search');
// Returns: 1500 (L2: Core layer budget)
```

### Enhance Tool Description

```javascript
const enhanced = enhanceDescription('memory_search', 'Search memories');
// Returns: "[L2:Core] Search memories"
```

### Get Recommended Layers

```javascript
const layers = getRecommendedLayers('search');
// Returns: ['L1', 'L2'] - Start orchestration, fallback to core
```

---

## 5. 🔗 RELATED RESOURCES

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../response/](../response/) | Response envelope formatting |
| [../cache/](../cache/) | Tool output caching |

### Related Modules

| Module | Relationship |
|--------|--------------|
| `context-server.js` | Uses layer definitions for tool organization |
| `lib/utils/token-budget.js` | Consumes token budgets from layers |
