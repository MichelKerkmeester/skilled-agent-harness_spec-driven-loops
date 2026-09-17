---
title: "Object detection (skvisiondetect)"
description: "Locate objects or UI elements in an image and return labeled normalized bounding boxes."
trigger_phrases:
  - "Object detection (sk_vision_detect)"
  - "find the submit button in this screenshot"
  - "sk_vision_detect"
  - "locate UI elements"
version: 1.0.0.0
---

# Object detection (sk_vision_detect)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Locate objects or UI elements in an image and return labeled normalized bounding boxes.

`sk_vision_detect` takes a target such as "submit button", "navbar", or "broken element" and returns bounding boxes in normalized (0-1) coordinates.

---

## 2. HOW IT WORKS

The tool sends the target string to the model's detection task and normalizes the returned objects into a stable shape: label plus `x1, y1, x2, y2` coordinates normalized to the image dimensions.

The rendered result labels each box so the coding model can reference the region in follow-up actions. The normalized bbox shape is the same one `sk_vision_crop` and `sk_vision_annotate` consume, so detection output can be chained directly.

### Edge Cases

Detection requires the model to support the task; a missing target argument is rejected, and analysis failures render as `SK_VISION_ERROR`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.ts` | Handler | Provider `detect` method and result typing |
| `vision-runtime/python/runtime.py` | Script | `handle_detect` and `_normalize_detect_objects` |
| `pi/sk-vision.ts` | Handler | `sk_vision_detect` registration and rendering |
| `vision-runtime/src/opencode/tools.ts` | Handler | OpenCode `sk_vision_detect` registration |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | Integration | Exercises the NDJSON channel and error contract this tool uses |
| `references/runtime-reference.md` | Reference | Documents the detection contract |

---

## 4. SOURCE METADATA

- Group: scene-understanding
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scene-understanding/detect.md`

Related references:
- [point.md](point.md) — a single normalized coordinate instead of a box
- [annotate.md](../pixel-analysis/annotate.md) — draws detected boxes back onto the image
