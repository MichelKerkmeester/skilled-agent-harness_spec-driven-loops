---
title: "OCR text extraction (skvisionocr)"
description: "Exact text extraction from images, with modes for all text, code screenshots, and error messages."
trigger_phrases:
  - "OCR text extraction (sk_vision_ocr)"
  - "read the text in this image"
  - "sk_vision_ocr"
  - "transcribe the error message"
version: 1.0.0.0
---

# OCR text extraction (sk_vision_ocr)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Exact text extraction from images, with modes for all text, code screenshots, and error messages.

`sk_vision_ocr` is the tool to prefer when the precise wording of an error message, code, label, or page text matters more than a description.

---

## 2. HOW IT WORKS

The tool selects a prompt by `kind` and runs a model query: `all` transcribes every visible text with line breaks and positions preserved as well as possible, `code` outputs only the code text from a screenshot, and `error` quotes visible error messages verbatim.

The result is rendered as a single text block with the extracted text, and the source is labeled by its path or as `inline-image` for data-URL input.

### Edge Cases

An unrecognized `kind` falls back to `all`. A missing image file produces the structured `INVALID_INPUT` error, and analysis failures are rendered as `SK_VISION_ERROR`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.ts` | Handler | Provider `ocr` method and source resolution |
| `vision-runtime/python/runtime.py` | Script | `OCR_PROMPTS` table and `handle_ocr` |
| `pi/sk-vision.ts` | Handler | `sk_vision_ocr` registration and kind argument parsing |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | Integration | Exercises the NDJSON channel and error contract this tool uses |
| `references/runtime-reference.md` | Reference | Documents the OCR modes and runtime contract |

---

## 4. SOURCE METADATA

- Group: scene-understanding
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scene-understanding/ocr.md`

Related references:
- [inspect.md](inspect.md) — combines OCR with scene and caption in one call
- [zoom.md](../pixel-analysis/zoom.md) — upscales first when text is too small to read
