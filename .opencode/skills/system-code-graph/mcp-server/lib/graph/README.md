---
title: "Graph Lib: Shared BFS Traversal"
description: "Generic breadth-first traversal engine shared by the code graph query handlers."
---

# Graph Lib

---

## 1. OVERVIEW

`lib/graph/` holds the single generic breadth-first traversal primitive that `mcp-server/handlers/query.ts` builds transitive-relationship and blast-radius results on top of. It owns the queue, visited-set, depth-cap and dangling-edge bookkeeping so the query handlers only supply a neighbor-lookup function and a result mapper, not a traversal loop each.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `bfs-traversal.ts` | Exports `traverseGraphBfs()`, a generic typed BFS over `{startIds, maxDepth, getNeighbors, mapResult, shouldEnqueue}` that returns results, dangling edges and depth-truncated nodes |

## 3. CONSUMERS

- `.opencode/skills/system-code-graph/mcp-server/handlers/query.ts` calls `traverseGraphBfs()` twice: once for the transitive callers/importers walk and once for blast-radius file traversal.

## 4. TESTS

```bash
cd .opencode/skills/system-code-graph/mcp-server && npx vitest run tests/bfs-traversal.vitest.ts
```

## 5. RELATED

- [`mcp-server/README.md`](../../README.md)
- [`system-code-graph/README.md`](../../../README.md)
