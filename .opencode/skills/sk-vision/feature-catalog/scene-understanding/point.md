---
title: "Point location (skvisionpoint)"
description: "Find the exact on-screen position of a target in an image as normalized point coordinates."
trigger_phrases:
  - "Point location (sk_vision_point)"
  - "where is the search bar in this screenshot"
  - "sk_vision_point"
  - "locate a click target"
version: 1.0.0.0
---

# Point location (sk_vision_point)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Find the exact on-screen position of a target in an image as normalized point coordinates.

`sk_vision_point` is the tool for click targets and layout pinning: it returns where a target sits, in (0-1) coordinates relative to the image.

---

## 2. HOW IT WORKS

The tool sends the target to the model's point task and normalizes the result into `x, y` coordinates normalized to image dimensions. Rendered output includes the source label and the point location.

Because coordinates are normalized, they stay valid when the image is scaled by the host, which makes the tool useful for automation that needs to know where to click or place a cursor.

### Edge Cases

A missing target is rejected, and analysis failures render as `SK_VISION_ERROR` with a structured code.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.ts` | Handler | Provider `point` method and result typing |
| `vision-runtime/python/runtime.py` | Script | `handle_point` and `_normalize_points` |
| `pi/sk-vision.ts` | Handler | `sk_vision_point` registration and rendering |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | Integration | Exercises the NDJSON channel and error contract this tool uses |
| `references/runtime-reference.md` | Reference | Documents the point contract |

---

## 4. SOURCE METADATA

- Group: scene-understanding
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scene-understanding/point.md`

Related references:
- [detect.md](detect.md) — bounding boxes instead of a single point
- [annotate.md](../pixel-analysis/annotate.md) — draws located points back onto the image
