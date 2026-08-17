---
title: "Image diffing (skvisiondiff)"
description: "Pixel-level comparison of two images with changed-region boxes and an optional model description of the changes."
trigger_phrases:
  - "Image diffing (sk_vision_diff)"
  - "what changed between these two screenshots"
  - "sk_vision_diff"
  - "compare two images"
version: 1.0.0.0
---

# Image diffing (sk_vision_diff)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Pixel-level comparison of two images with changed-region boxes and an optional model description of the changes.

`sk_vision_diff` answers "what changed" for before/after screenshots, render regressions, and UI iterations.

---

## 2. HOW IT WORKS

The tool compares the source image to a second image passed as `otherPath` or `otherImage`. Both images are converted to RGB, the second is resized to match when needed, and a blurred difference map is thresholded so anti-aliasing does not count as change. The result includes the changed pixel percentage, up to 12 changed-region boxes in normalized coordinates, and the image dimensions.

When `describe` is set, the runtime builds a side-by-side composite (original plus highlighted differences) and asks the model to summarize what changed and where. The description is returned alongside the pixel-level numbers.

### Edge Cases

Identical images report zero percent changed. A missing file on either side raises the structured `INVALID_INPUT` error.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.ts` | Handler | Provider `diff` method and dual-source resolution |
| `vision-runtime/python/runtime.py` | Script | `handle_diff` band-scan, composite, and description |
| `pi/sk-vision.ts` | Handler | `sk_vision_diff` registration and `otherPath`/`otherImage` parsing |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | Integration | Asserts zero changed percentage for identical fixture copies |
| `references/runtime-reference.md` | Reference | Documents the diff contract |

---

## 4. SOURCE METADATA

- Group: pixel-analysis
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `pixel-analysis/diff.md`

Related references:
- [colors.md](colors.md) — model-free color read of a single image
- [annotate.md](annotate.md) — draws change boxes onto an image copy
