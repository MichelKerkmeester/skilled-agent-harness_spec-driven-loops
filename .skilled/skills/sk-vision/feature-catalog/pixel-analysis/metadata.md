---
title: "Image metadata (skvisionmetadata)"
description: "Model-free image metadata: dimensions, format, mode, byte size, DPI, and EXIF."
trigger_phrases:
  - "Image metadata (sk_vision_metadata)"
  - "what are the dimensions of this image"
  - "sk_vision_metadata"
  - "verify a downloaded image"
version: 1.0.0.0
---

# Image metadata (sk_vision_metadata)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Model-free image metadata: dimensions, format, mode, byte size, DPI, and EXIF.

`sk_vision_metadata` reads file and image headers only — it never loads the model — so it is instant and suitable for verifying a file (including web-downloaded images) kept its real type and size.

---

## 2. HOW IT WORKS

The tool resolves the image source, stat's the file when it is a path, and reads the image header for width, height, format (uppercased), color mode, DPI, and a brief EXIF summary. Byte size is included for path sources.

Because the runtime downloads http(s) URLs verbatim into the cache, metadata acts as a verification step for fetched images: the format and byte size reveal whether the download preserved the original type.

### Edge Cases

A missing file raises `INVALID_INPUT`. Data-URL sources report image fields without byte size.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.ts` | Handler | Provider `metadata` method and URL fetch-to-cache |
| `vision-runtime/python/runtime.py` | Script | `handle_metadata` and `_exif_brief` |
| `pi/sk-vision.ts` | Handler | `sk_vision_metadata` registration and rendering |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | Integration | Asserts dimensions and format on a fixture image and `INVALID_INPUT` on a missing file |
| `vision-runtime/src/providers/photon.test.ts` | Unit | Covers `extForContentType` used to preserve downloaded types |
| `references/runtime-reference.md` | Reference | Documents the metadata contract |

---

## 4. SOURCE METADATA

- Group: pixel-analysis
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `pixel-analysis/metadata.md`

Related references:
- [colors.md](colors.md) — another model-free image read
- [crop.md](crop.md) — operates on a metadata-verified region
