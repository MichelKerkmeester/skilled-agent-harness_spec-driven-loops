---
title: "Color analysis (skvisioncolors)"
description: "Deterministic, model-free color analysis: dominant palette, luminance buckets, and average RGB for an image or region."
trigger_phrases:
  - "Color analysis (sk_vision_colors)"
  - "what colors are in this design"
  - "sk_vision_colors"
  - "palette and luminance check"
version: 1.0.0.0
---

# Color analysis (sk_vision_colors)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Deterministic, model-free color analysis: dominant palette, luminance buckets, and average RGB for an image or region.

`sk_vision_colors` never loads the model, so its results are reproducible ground truth for design and rendering checks.

---

## 2. HOW IT WORKS

The tool quantizes the image (or an optional normalized `region`) to a 5-color palette with each color's share of the pixels, buckets the grayscale histogram into dark/mid/bright luminance ranges, and reports the average RGB of the whole region.

Because the analysis is purely computational, the same input always produces the same output — useful for verifying a theme, checking contrast regions, or validating that a render matches its intent.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.ts` | Handler | Provider `colors` method |
| `vision-runtime/python/runtime.py` | Script | `handle_colors` palette, buckets, and average computation |
| `pi/sk-vision.ts` | Handler | `sk_vision_colors` registration and region parsing |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | Integration | Asserts palette and average RGB output on a fixture image |
| `references/runtime-reference.md` | Reference | Documents the color contract |

---

## 4. SOURCE METADATA

- Group: pixel-analysis
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `pixel-analysis/colors.md`

Related references:
- [metadata.md](metadata.md) — another model-free image read
- [diff.md](diff.md) — pixel-level comparison between images
