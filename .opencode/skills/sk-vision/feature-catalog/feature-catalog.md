---
title: "sk-vision: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the sk-vision system."
trigger_phrases:
  - "sk-vision"
  - "local vision skill"
  - "feature catalog"
last_updated: "2026-08-16"
version: 1.0.0.0
---

# sk-vision: Feature Catalog

This document combines the current feature inventory for the `sk-vision` system into a single reference. The root catalog acts as the system-level directory: it summarizes each capability area, describes what the system does today, and points to the per-feature files that carry the deeper implementation and validation anchors.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `sk-vision` feature surface. The numbered sections below group the system by capability area so readers can move from a top-level summary into per-feature reference files without losing implementation or validation context. sk-vision is a local-first vision skill: a Moondream-backed JSON-RPC runtime exposes 13 `sk_vision_*` tools to text-only coding models through an OpenCode plugin and a Pi extension.

---

## 2. SCENE UNDERSTANDING

### Image inspection (skvisioninspect)

#### Description

Comprehensive image read: optional question answering, or a structured scene summary plus caption and exact OCR of visible text.

#### Current Reality

Runs a caption, a structured scene read, and exact OCR in parallel when no question is given, or answers a natural-language question when one is provided. Evidence is returned inside `<SK-VISION>` tags.

#### Source Files

See [`scene-understanding/inspect.md`](scene-understanding/inspect.md) for full implementation and test file listings.

---

### OCR text extraction (skvisionocr)

#### Description

Exact text extraction from images, with modes for all text, code screenshots, and error messages.

#### Current Reality

Transcribes visible text via a mode-specific prompt (`all`, `code`, or `error`). Preferred over a caption when the precise wording matters.

#### Source Files

See [`scene-understanding/ocr.md`](scene-understanding/ocr.md) for full implementation and test file listings.

---

### Object detection (skvisiondetect)

#### Description

Locate objects or UI elements in an image and return labeled normalized bounding boxes.

#### Current Reality

Asks the model for a target such as "submit button" and returns normalized bounding boxes that other tools (`crop`, `annotate`) can consume directly.

#### Source Files

See [`scene-understanding/detect.md`](scene-understanding/detect.md) for full implementation and test file listings.

---

### Point location (skvisionpoint)

#### Description

Find the exact on-screen position of a target in an image as normalized point coordinates.

#### Current Reality

Locates a target and returns normalized (0-1) point coordinates, useful for click targets and layout pinning.

#### Source Files

See [`scene-understanding/point.md`](scene-understanding/point.md) for full implementation and test file listings.

---

### Object segmentation (skvisionsegment)

#### Description

Cut a target object or UI element out of an image and return a saved mask plus bounding box.

#### Current Reality

Runs the model's segmentation task and returns the saved mask/PNG path and bounding box. A clear error is raised when the loaded model does not support segmentation.

#### Source Files

See [`scene-understanding/segment.md`](scene-understanding/segment.md) for full implementation and test file listings.

---

## 3. PIXEL ANALYSIS

### Color analysis (skvisioncolors)

#### Description

Deterministic, model-free color analysis: dominant palette, luminance buckets, and average RGB for an image or region.

#### Current Reality

Quantizes to a 5-color palette, computes dark/mid/bright luminance buckets, and reports the average RGB — with no model involved, so results are ground-truth reproducible.

#### Source Files

See [`pixel-analysis/colors.md`](pixel-analysis/colors.md) for full implementation and test file listings.

---

### Image diffing (skvisiondiff)

#### Description

Pixel-level comparison of two images with changed-region boxes and an optional model description of the changes.

#### Current Reality

Blurs out anti-aliasing, computes the changed pixel percentage and up to 12 changed-region boxes, and can ask the model to describe what changed.

#### Source Files

See [`pixel-analysis/diff.md`](pixel-analysis/diff.md) for full implementation and test file listings.

---

### Image metadata (skvisionmetadata)

#### Description

Model-free image metadata: dimensions, format, mode, byte size, DPI, and EXIF.

#### Current Reality

Reads file and image headers only — no model load — so it can verify that a downloaded image kept its real type and size.

#### Source Files

See [`pixel-analysis/metadata.md`](pixel-analysis/metadata.md) for full implementation and test file listings.

---

### Region cropping (skvisioncrop)

#### Description

Crop a normalized bounding-box region of an image to a saved file.

#### Current Reality

Takes the same `[x1, y1, x2, y2]` normalized bbox shape that detection returns, saves the crop to the cache, and returns the file path for chaining into other tools.

#### Source Files

See [`pixel-analysis/crop.md`](pixel-analysis/crop.md) for full implementation and test file listings.

---

### Region zoom (skvisionzoom)

#### Description

LANCZOS upscale a region or whole image and optionally re-analyze it with the model.

#### Current Reality

Upscales 1-8x (default 2x) with a pixel cap, saves the result, and can re-run OCR, caption, or a question against the upscaled crop when `analyze` is set.

#### Source Files

See [`pixel-analysis/zoom.md`](pixel-analysis/zoom.md) for full implementation and test file listings.

---

### Annotation overlay (skvisionannotate)

#### Description

Draw bounding boxes and points onto an image and save an annotated copy.

#### Current Reality

Accepts the same box and point shapes that detect/point return, draws them with an optional label and color, and returns the annotated file path for visual validation.

#### Source Files

See [`pixel-analysis/annotate.md`](pixel-analysis/annotate.md) for full implementation and test file listings.

---

## 4. SYSTEM HEALTH

### Runtime status (skvisionstatus)

#### Description

Report runtime health: model load state, device, VRAM, request count, and inference timing.

#### Current Reality

Returns model load state, model id, device, GPU/VRAM usage when available, capabilities, request count, and inference timing without loading the model.

#### Source Files

See [`system-health/status.md`](system-health/status.md) for full implementation and test file listings.

---

### Reverse image search (skvisionreverse)

#### Description

No-API-key reverse search: local perceptual-hash near-duplicates plus Yandex web matches.

#### Current Reality

Searches the local cache (and an optional directory) for near-duplicates using a 64-bit perceptual hash, and uploads the image to Yandex image search for web matches with a browser-ready fallback URL.

#### Source Files

See [`system-health/reverse.md`](system-health/reverse.md) for full implementation and test file listings.

---

## 5. HOST ADAPTERS

### OpenCode plugin adapter (sk-vision.js)

#### Description

Loads the vision runtime and 13 tools into OpenCode, with automatic inspection of attached images.

#### Current Reality

A real file at `.opencode/plugins/sk-vision.js` re-exports the built runtime plugin, which registers the 13 tools, preloads analysis on image paste with a 2s grace, and materializes clipboard images for the model.

#### Source Files

See [`host-adapters/opencode-plugin.md`](host-adapters/opencode-plugin.md) for full implementation and test file listings.

---

### Pi extension adapter (sk-vision.ts)

#### Description

Registers the 13 vision tools in Pi and auto-inspects attached images with a bounded grace window.

#### Current Reality

A relative symlink from `.pi/extensions/sk-vision.ts` to the skill's factory registers the 13 tools, closes the runtime on session shutdown, and transforms attached-image input with a 2s bounded preload.

#### Source Files

See [`host-adapters/pi-extension.md`](host-adapters/pi-extension.md) for full implementation and test file listings.

---

## 6. RUNTIME CORE

### JSON-RPC runtime (python/runtime.py)

#### Description

Local Moondream-backed NDJSON JSON-RPC service that powers every sk-vision tool on both hosts.

#### Current Reality

A stateless Python service over stdin/stdout NDJSON that lazy-loads the model on first inference, keeps it warm, supports unload, and implements all 20 methods including the model-free analysis handlers.

#### Source Files

See [`runtime-core/json-rpc-runtime.md`](runtime-core/json-rpc-runtime.md) for full implementation and test file listings.
