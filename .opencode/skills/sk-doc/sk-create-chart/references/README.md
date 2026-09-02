---
title: "sk-create-chart References"
description: "Router for this packet's reference set: which chart type answers a comparison and which gallery holds it."
trigger_phrases:
  - "chart references"
  - "which chart type"
  - "chart lookup"
  - "chart catalog"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# sk-create-chart References

The reference set answers one question before any file is written: which chart type answers the comparison the reader needs and which gallery page holds its render block.

| Load | When |
|------|------|
| `catalog.md` | **First, always.** Maps a comparison to one named chart type and the gallery holding it |
| `report-catalog.md` | When the artifact is a multi-chart report page rather than a single chart |

Neither file is authored yet. Until `catalog.md` names at least one chart type, the packet has no corpus to select from, so a request should be deferred rather than answered freehand.

---

## WHAT BELONGS HERE

Reference files in this packet are lookups. They route a request to a template and they carry no render code of their own, because a render block copied into a reference is a second copy that drifts from the template it came from.

Chart markup lives in `../assets/`. Palettes live in `../assets/color/`. This directory holds the index that finds them.
