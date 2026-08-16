---
title: "Image inspection (skvisioninspect)"
description: "Comprehensive image read: optional question answering, or a structured scene summary plus caption and exact OCR of visible text."
trigger_phrases:
  - "Image inspection (sk_vision_inspect)"
  - "inspect a screenshot"
  - "sk_vision_inspect"
  - "describe this image"
version: 1.0.0.0
---

# Image inspection (sk_vision_inspect)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Comprehensive image read: optional question answering, or a structured scene summary plus caption and exact OCR of visible text.

`sk_vision_inspect` is the primary entry point for screenshots, mockups, and attached media. It returns evidence inside `<SK-VISION>` tags so the coding model can cite it directly.

---

## 2. HOW IT WORKS

When a `question` argument is given, the tool runs a visual question-answering call and renders the answer. Without a question, it runs a caption, a structured scene read, and OCR in parallel and returns the combined evidence: the scene read classifies image type, layout, elements, and state; the caption summarizes content; and the OCR transcribes visible text exactly.

The scene read uses a fixed prompt that asks for a type classification (UI screenshot, terminal, code, error dialog, document, chart/diagram, photo, or other), a layout description, notable elements, and current state. The tool resolves image sources as local paths (relative to the project directory), base64 data URLs, or http(s) URLs that are downloaded verbatim into the cache.

### Edge Cases

A missing file raises a structured `INVALID_INPUT` error, and any analysis failure is rendered as `SK_VISION_ERROR` with the code and message rather than a bare crash.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/providers/photon.ts` | Handler | Provider methods `caption`, `scene`, `ocr`, `query` and URL fetch-to-cache |
| `vision-runtime/python/runtime.py` | Script | Handlers `query`, `caption`, `scene`, `ocr` over NDJSON |
| `pi/sk-vision.ts` | Handler | `sk_vision_inspect` registration and evidence rendering |
| `vision-runtime/src/opencode/tools.ts` | Handler | OpenCode `sk_vision_inspect` registration |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | Integration | Exercises the NDJSON channel and error contract the tool rides on |
| `vision-runtime/src/providers/photon.test.ts` | Unit | Covers the shared argument and URL helpers used by this tool |
| `references/runtime-reference.md` | Reference | Documents the runtime contract and environment variables |

---

## 4. SOURCE METADATA

- Group: scene-understanding
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scene-understanding/inspect.md`

Related references:
- [ocr.md](ocr.md) — the exact-text extraction mode this tool composes
- [detect.md](detect.md) — locating elements instead of describing the whole image
