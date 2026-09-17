---
title: "Region cropping (skvisioncrop)"
description: "Crop a normalized bounding-box region of an image to a saved file."
trigger_phrases:
  - "Region cropping (sk_vision_crop)"
  - "crop this area of the screenshot"
  - "sk_vision_crop"
  - "save a cropped region"
version: 1.0.0.0
---

# Region cropping (sk_vision_crop)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Crop a normalized bounding-box region of an image to a saved file.

`sk_vision_crop` accepts the same `[x1, y1, x2, y2]` normalized bbox shape that detection returns, so a detected region can be cropped directly.

---

## 2. HOW IT WORKS

The tool parses the normalized bbox, converts it to pixel coordinates, crops the image, and saves the result to the sk-vision cache. The result includes the saved file path, the crop dimensions, and the pixel-space bbox used.

The saved path can be fed back into any other `sk_vision_*` tool, enabling chains such as detect a button, crop it, then run OCR on the crop.

### Edge Cases

Malformed or unordered bboxes are rejected with a structured error — the same validation that `sk_vision_detect` output always satisfies by construction.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.ts` | Handler | Provider `crop` method |
| `vision-runtime/python/runtime.py` | Script | `handle_crop` and `_bbox_to_px` |
| `pi/sk-vision.ts` | Handler | `sk_vision_crop` registration and `parseBBox` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | Integration | Asserts crop dimensions and file output; rejects bad bboxes |
| `vision-runtime/src/providers/photon.test.ts` | Unit | Covers `parseBBox` normalization and rejection |
| `references/runtime-reference.md` | Reference | Documents the crop contract |

---

## 4. SOURCE METADATA

- Group: pixel-analysis
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `pixel-analysis/crop.md`

Related references:
- [detect.md](../scene-understanding/detect.md) — produces the bbox shape crop consumes
- [zoom.md](zoom.md) — upscales a region instead of saving it as-is
