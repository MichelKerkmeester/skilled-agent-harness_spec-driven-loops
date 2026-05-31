---
title: "Compact merger"
description: "Compact merger combines context from Memory, Code Graph, and Code Graph into a unified compact brief within the 4000-token budget."
trigger_phrases:
  - "compact merger"
  - "compact-merger"
  - "unified compact brief"
  - "context source merging"
  - "compaction brief builder"
---

# Compact merger

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Compact merger combines context from Memory, Code Graph, and Code Graph into a unified compact brief within the 4000-token budget.

Accepts shaped results from 3 sources. Renders sections: Constitutional Rules, Active Files & Structural Context, Semantic Neighbors, Session State, Triggered Memories. Uses budget allocator for per-source token allocation. Includes allocation metadata and merge timestamp.

---

## 2. HOW IT WORKS

.opencode/skills/system-code-graph/mcp_server/lib/compact-merger.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `Lib` | 3-source merge with budget allocation | _ |


### Validation And Tests

| File | Type | Role |
|---|---|---|
| `Merge, section rendering, budget enforcement` | Automated test | phase 011 |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation/301-compact-merger.md`
Related references:
- [300-working-set-tracker.md](300-working-set-tracker.md) — Working-set tracker
- [302-query-intent-classifier.md](302-query-intent-classifier.md) — Query-intent classifier
