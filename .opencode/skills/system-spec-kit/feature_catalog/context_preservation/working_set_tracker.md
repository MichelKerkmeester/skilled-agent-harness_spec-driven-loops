---
title: "Working-set tracker"
description: "Working-set tracker tracks files and symbols accessed during a session using recency-weighted scoring for compaction priority."
trigger_phrases:
  - "working-set tracker"
  - "working-set-tracker"
  - "recency-weighted file scoring"
  - "session file access tracking"
  - "compaction priority working set"
version: 3.6.0.10
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
- Feature file path: `context_preservation/working_set_tracker.md`
Related references:
- [budget-allocator.md](budget_allocator.md) — Token budget allocator
- [compact-merger.md](compact_merger.md) — Compact merger
