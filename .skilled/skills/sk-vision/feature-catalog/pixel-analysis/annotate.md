---
title: "Annotation overlay (skvisionannotate)"
description: "Draw bounding boxes and points onto an image and save an annotated copy."
trigger_phrases:
  - "Annotation overlay (sk_vision_annotate)"
  - "draw the detected boxes on this image"
  - "sk_vision_annotate"
  - "save an annotated screenshot"
version: 1.0.0.0
---

# Annotation overlay (sk_vision_annotate)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Draw bounding boxes and points onto an image and save an annotated copy.

`sk_vision_annotate` accepts the same normalized box and point shapes that detection and point location return, so a model's findings can be drawn back for visual validation.

---

## 2. HOW IT WORKS

The tool parses JSON arrays of `boxes` (normalized `x1,y1,x2,y2` with optional labels) and `points` (normalized `x,y` with optional labels), draws them with an optional stroke `color` (default `#ff3355`) and a shared `label`, and saves the annotated copy to the cache. The result returns the saved file path and dimensions.

Labels are drawn above boxes and beside points, so the annotated image is self-describing when handed to the coding model or an operator.

### Edge Cases

Annotating with no boxes and no points simply saves a copy. Malformed JSON arguments produce a structured error.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.ts` | Handler | Provider `annotate` method |
| `vision-runtime/python/runtime.py` | Script | `handle_annotate` drawing logic |
| `pi/sk-vision.ts` | Handler | `sk_vision_annotate` registration and JSON parsing |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | Integration | Asserts an annotated file is written for box and point input |
| `references/runtime-reference.md` | Reference | Documents the annotation contract |

---

## 4. SOURCE METADATA

- Group: pixel-analysis
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `pixel-analysis/annotate.md`

Related references:
- [detect.md](../scene-understanding/detect.md) — produces the boxes annotate draws
- [diff.md](diff.md) — highlights changed regions instead of model findings
