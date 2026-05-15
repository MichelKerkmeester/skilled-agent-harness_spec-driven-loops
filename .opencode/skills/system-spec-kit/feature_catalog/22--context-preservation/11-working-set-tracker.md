---
title: "Working-set tracker"
description: "Working-set tracker tracks files and symbols accessed during a session using recency-weighted scoring for compaction priority."
---

# Working-set tracker

## 1. OVERVIEW

Working-set tracker tracks files and symbols accessed during a session using recency-weighted scoring for compaction priority.

In-memory tracker records file accesses with count and timestamp. getTopRoots(n) returns most relevant files scored by frequency * recency_decay. Supports serialization for hook state persistence. Auto-evicts beyond capacity.

---

## 2. CURRENT REALITY

.opencode/skills/system-code-graph/mcp_server/lib/working-set-tracker.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `Lib` | Recency-weighted file tracking | _ |


### Validation And Tests

| File | Focus |
|------|-------|
| `Integration coverage` | phase 011 |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation/11-working-set-tracker.md`
