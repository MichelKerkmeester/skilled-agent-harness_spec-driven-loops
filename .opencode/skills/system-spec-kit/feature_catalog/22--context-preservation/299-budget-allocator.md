---
title: "Token budget allocator"
description: "Token budget allocator distributes 4000-token compaction budget across context sources using floor allocations plus overflow redistribution."
trigger_phrases:
  - "token budget allocator"
  - "budget-allocator"
  - "compaction budget distribution"
  - "overflow redistribution"
  - "4000-token budget allocation"
---

# Token budget allocator

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Token budget allocator distributes 4000-token compaction budget across context sources using floor allocations plus overflow redistribution.

Floors: constitutional 700, code graph 1200, Code Graph 900, triggered 400, overflow pool 800. Empty sources release their floor to the overflow pool. Redistribution follows priority: constitutional > codeGraph > codeGraph > triggered. Total cap enforced with deterministic trim in reverse priority.

---

## 2. HOW IT WORKS

.opencode/skills/system-code-graph/mcp_server/lib/budget-allocator.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `Lib` | Floor + overflow allocation | _ |


### Validation And Tests

| File | Type | Role |
|---|---|---|
| `Floor distribution, overflow, cap enforcement` | Automated test | phase 011 |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation/299-budget-allocator.md`
Related references:
- [298-runtime-detection.md](298-runtime-detection.md) — Runtime detection and hook policy
- [300-working-set-tracker.md](300-working-set-tracker.md) — Working-set tracker
