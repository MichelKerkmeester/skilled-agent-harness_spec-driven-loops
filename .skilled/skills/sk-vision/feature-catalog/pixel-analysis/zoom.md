---
title: "Region zoom (skvisionzoom)"
description: "LANCZOS upscale a region or whole image and optionally re-analyze it with the model."
trigger_phrases:
  - "Region zoom (sk_vision_zoom)"
  - "zoom into this part of the image"
  - "sk_vision_zoom"
  - "enlarge small text"
version: 1.0.0.0
---

# Region zoom (sk_vision_zoom)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

LANCZOS upscale a region or whole image and optionally re-analyze it with the model.

`sk_vision_zoom` makes small text and fine details readable when the vision model misses them at full-image scale.

---

## 2. HOW IT WORKS

The tool upscales the image (or an optional normalized `region`) by a `scale` factor between 1 and 8 (default 2) using LANCZOS resampling, capped so the output stays within a 24-megapixel budget. The upscaled result is saved to the cache and its path, dimensions, and applied scale are returned.

With `analyze`, the upscaled crop is re-run through the model: `ocr` transcribes its text, `caption` describes it, and `query` answers a provided `question`. This second-pass analysis is where zoomed text actually becomes readable.

### Edge Cases

`analyze=query` without a question raises a structured error. The pixel cap silently reduces the scale factor rather than failing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.ts` | Handler | Provider `zoom` method |
| `vision-runtime/python/runtime.py` | Script | `handle_zoom` resampling, pixel cap, and re-analysis |
| `pi/sk-vision.ts` | Handler | `sk_vision_zoom` registration and argument parsing |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | Integration | Asserts upscaled dimensions and file output on a fixture |
| `references/runtime-reference.md` | Reference | Documents the zoom contract |

---

## 4. SOURCE METADATA

- Group: pixel-analysis
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `pixel-analysis/zoom.md`

Related references:
- [ocr.md](../scene-understanding/ocr.md) — the re-analysis mode that reads zoomed text
- [crop.md](crop.md) — saves a region without upscaling
