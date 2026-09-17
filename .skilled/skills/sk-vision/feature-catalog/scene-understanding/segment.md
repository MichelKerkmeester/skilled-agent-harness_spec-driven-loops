---
title: "Object segmentation (skvisionsegment)"
description: "Cut a target object or UI element out of an image and return a saved mask plus bounding box."
trigger_phrases:
  - "Object segmentation (sk_vision_segment)"
  - "cut out the logo from this image"
  - "sk_vision_segment"
  - "isolate an element"
version: 1.0.0.0
---

# Object segmentation (sk_vision_segment)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Cut a target object or UI element out of an image and return a saved mask plus bounding box.

`sk_vision_segment` is for when a clean region of an image (a logo, button, person, or chart element) is needed rather than just coordinates.

---

## 2. HOW IT WORKS

The tool runs the model's segmentation task for the target and returns the saved mask/PNG path plus the bounding box of the segmented region. The saved file is written to the sk-vision cache, so the result can be handed to other local tools or the coding model directly.

Segmentation is task-gated: if the loaded model does not support the segmentation task, the runtime raises a structured error naming the model id.

### Edge Cases

The task gate catches unsupported models early, and analysis failures render as `SK_VISION_ERROR`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.ts` | Handler | Provider `segment` method |
| `vision-runtime/python/runtime.py` | Script | `handle_segment` with the `_require_task` gate |
| `pi/sk-vision.ts` | Handler | `sk_vision_segment` registration and rendering |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | Integration | Exercises the NDJSON channel and error contract this tool uses |
| `references/runtime-reference.md` | Reference | Documents the segmentation contract |

---

## 4. SOURCE METADATA

- Group: scene-understanding
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scene-understanding/segment.md`

Related references:
- [detect.md](detect.md) — locate before cutting out
- [crop.md](../pixel-analysis/crop.md) — rectangle cut instead of model segmentation
