---
title: "Working-set tracker"
description: "Working-set tracker tracks files and symbols accessed during a session using recency-weighted scoring for compaction priority."
trigger_phrases:
  - "working-set tracker"
  - "working-set-tracker"
  - "recency-weighted file scoring"
  - "session file access tracking"
  - "compaction priority working set"
---

# Working-set tracker

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Working-set tracker tracks files and symbols accessed during a session using recency-weighted scoring for compaction priority.

In-memory tracker records file accesses with count and timestamp. getTopRoots(n) returns most relevant files scored by frequency * recency_decay. Supports serialization for hook state persistence. Auto-evicts beyond capacity.

---

## 2. HOW IT WORKS

.opencode/skills/system-code-graph/mcp_server/lib/working-set-tracker.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `Lib` | Recency-weighted file tracking | _ |


### Validation And Tests

| File | Type | Role |
|---|---|---|
| `Integration coverage` | Automated test | phase 011 |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation/300-working-set-tracker.md`
Related references:
- [299-budget-allocator.md](299-budget-allocator.md) — Token budget allocator
- [301-compact-merger.md](301-compact-merger.md) — Compact merger
