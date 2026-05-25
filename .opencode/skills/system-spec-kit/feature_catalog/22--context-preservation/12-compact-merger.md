---
title: "Compact merger"
description: "Compact merger combines context from Memory, Code Graph, and Code Graph into a unified compact brief within the 4000-token budget."
---

# Compact merger

## 1. OVERVIEW

Compact merger combines context from Memory, Code Graph, and Code Graph into a unified compact brief within the 4000-token budget.

Accepts shaped results from 3 sources. Renders sections: Constitutional Rules, Active Files & Structural Context, Semantic Neighbors, Session State, Triggered Memories. Uses budget allocator for per-source token allocation. Includes allocation metadata and merge timestamp.

---

## 2. CURRENT REALITY

.opencode/skills/system-code-graph/mcp_server/lib/compact-merger.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `Lib` | 3-source merge with budget allocation | _ |


### Validation And Tests

| File | Focus |
|------|-------|
| `Merge, section rendering, budget enforcement` | phase 011 |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation/12-compact-merger.md`
