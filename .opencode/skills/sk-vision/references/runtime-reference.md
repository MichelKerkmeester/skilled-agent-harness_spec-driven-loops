---
title: "sk-vision runtime reference"
description: "Overflow detail for the sk-vision skill: JSON-RPC protocol, tool semantics, environment variables, model and hardware notes, troubleshooting."
trigger_phrases:
  - "sk-vision runtime protocol"
  - "sk-vision env vars"
  - "sk-vision troubleshooting"
  - "sk-vision tool semantics"
importance_tier: "normal"
contextType: "reference"
version: 0.1.1.0
---

# sk-vision runtime reference

This reference carries the deep detail behind `SKILL.md`. The authoritative behavior lives in the code — `vision-runtime/python/runtime.py` (handlers, defaults, model lifecycle) and `vision-runtime/src/providers/photon.ts` (provider method contracts). When this page and the code disagree, the code wins; update this page.

---

## 1. OVERVIEW

`runtime-reference.md` is the deep-detail corpus for the sk-vision skill. It documents the JSON-RPC protocol, the 13 host tools' semantics, environment variables, model/hardware requirements, and troubleshooting — everything that would bloat `SKILL.md`. The authoritative behavior always lives in the code; this page summarizes the contract and points at the source.

---

## 2. JSON-RPC PROTOCOL

The runtime is a line-delimited JSON (NDJSON) JSON-RPC service over stdio. `RuntimeClient` spawns `python/runtime.py` and exchanges one JSON message per line.

```text
Request : {"id": int, "method": str, "params": {...}}
Response: {"id": int, "result": {...}}
          {"id": int, "error": {"code": str, "message": str}}
```

`source` is `{"type": "path", "path": str}` or `{"type": "data", "data": dataUrl}`. `path` sources may be http(s) URLs — the TypeScript side downloads them verbatim into the cache before they reach the runtime.

### Methods

| Method | Purpose |
|--------|---------|
| `ping` | `{"pong": true, "version": str, "device": str}` |
| `status` | Model load state, device, VRAM, capabilities, request count |
| `load` | Ensure the model is loaded (warm start) |
| `unload` | Free the model and release the GPU |
| `query` | Visual question answering (optional reasoning) |
| `caption` | Image captioning with `short`/`normal`/`long` length |
| `scene` | Structured deep-read: image type, layout, elements, state |
| `detect` | Object detection with labeled bounding boxes |
| `point` | Target center points |
| `segment` | Object segmentation (SVG path + bbox) |
| `ocr` | Exact text extraction (`all` / `code` / `error` kinds) |
| `metadata` | Dimensions/format/mode/bytes/DPI/EXIF — no model |
| `crop` | Save a normalized bbox region to a PNG — no model |
| `zoom` | LANCZOS upscale, optionally re-analyzed (ocr/caption/query) |
| `colors` | Dominant palette, luminance buckets, average RGB — no model |
| `diff` | Pixel-level change map between two images |
| `annotate` | Draw boxes/points onto a copy — no model |
| `hash_search` | Local perceptual-hash reverse search — no model |
| `reverse` | Reverse search: local + Yandex, no API key |
| `shutdown` | Exit(0) |

Error codes include `INVALID_INPUT`, `EMPTY_RESULT`, `FETCH_FAILED`, `NOT_AN_IMAGE`, and `SK_VISION_ERROR` surfaces on the host side. See `runtime.py` and `runtime/client.ts` for the full set.

---

## 3. TOOL SEMANTICS

The 13 host tools map onto the provider methods in `src/providers/photon.ts` and render via `src/core/context-builder.ts`.

| Tool | Provider method | Returns |
|------|-----------------|---------|
| `sk_vision_inspect` | `query` (with `question`) or `caption`+`scene`+`ocr` | Answer, or scene read + caption + exact OCR |
| `sk_vision_detect` | `detect` | Labeled bounding boxes with confidence |
| `sk_vision_point` | `point` | Normalized (0-1) center points |
| `sk_vision_ocr` | `ocr` | Exact text |
| `sk_vision_status` | `health` | Model/device/VRAM/request count |
| `sk_vision_segment` | `segment` | Mask PNG path + bbox |
| `sk_vision_metadata` | `metadata` | Dimensions, format, mode, bytes, DPI, EXIF |
| `sk_vision_crop` | `crop` | Saved crop PNG path + pixel bbox |
| `sk_vision_zoom` | `zoom` | Upscaled PNG path (+ optional analysis) |
| `sk_vision_colors` | `colors` | Palette, luminance buckets, average RGB |
| `sk_vision_diff` | `diff` | Changed %, region bboxes, optional description |
| `sk_vision_annotate` | `annotate` | Annotated PNG path |
| `sk_vision_reverse` | `reverse` | Local matches (path/similarity) + Yandex URLs |

Host tool parameter contracts (bbox strings, `kind`, `analyze`, `providers`, etc.) live in `pi/sk-vision.ts` and `src/opencode/tools.ts`.

---

## 4. ENVIRONMENT VARIABLES

| Variable | Default | Purpose |
|----------|---------|---------|
| `SK_VISION_MODEL` | `moondream2` | Model checkpoint (Moondream 3.x required for `segment`, `reason`, `ocr` tasks) |
| `SK_VISION_PYTHON` | auto | Interpreter to use; wins over the provisioned venv |
| `SK_VISION_UV` | `uv` | `uv` binary used to provision the venv |
| `SK_VISION_DEBUG` | unset | `1` enables debug logging (and disables the HF noise-suppression) |
| `SK_VISION_KV_CACHE_PAGES` | unset | KV-cache page count for Moondream 3.x |
| `SK_VISION_DISABLE_AUTO_PROVISION` | unset | Set to stop automatic venv provisioning |
| `SK_VISION_CACHE_DIR` | `~/.cache/sk-vision` | Cache root: `fetched/` downloads, `converted/` PNG analysis copies |
| `SK_VISION_VENV_DIR` | `~/.cache/sk-vision/venv` | Auto-provisioned runtime venv |

---

## 5. MODEL & HARDWARE NOTES

- Default checkpoint: `moondream2` (override with `SK_VISION_MODEL`).
- `segment`, `reason`, and `ocr` require a Moondream 3.x checkpoint (absent from `moondream2`) — see `MOONDREAM3_ONLY_TASKS` in `runtime.py`.
- Hardware: NVIDIA Ampere or newer, or Apple Silicon (M-series). ~6 GB VRAM is enough for the default model.
- First `load` downloads ~3.9 GB of weights from Hugging Face and may provision a venv under `~/.cache/sk-vision/venv` via `uv` (set `SK_VISION_PYTHON` to skip provisioning).
- The runtime keeps the model warm across calls; `unload` releases the GPU back to the host model.

---

## 6. TROUBLESHOOTING

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `SK_VISION_ERROR (FETCH_FAILED)` | URL download failed or timed out | Check the URL; raise `fetchTimeoutMs` (default 60s in `photon.ts`) |
| `SK_VISION_ERROR (NOT_AN_IMAGE)` | URL returned a non-image content type | Confirm the URL serves an image |
| Model fails to load on first inference | Missing weights or unsatisfied dependencies | Run once with `SK_VISION_DEBUG=1`; check `~/.cache/sk-vision/venv` |
| Venv provisioning fails | `uv` missing or Python version mismatch | Set `SK_VISION_PYTHON` to a working interpreter, or `SK_VISION_UV` to a working `uv` |
| Out-of-memory on load | VRAM below ~6 GB or model too large | Use the default `moondream2`; close other GPU consumers |
| `segment`/`ocr` errors on default model | `moondream2` lacks Moondream 3.x tasks | Set `SK_VISION_MODEL` to a Moondream 3.x checkpoint |
| Evidence block missing on submit | Auto-inspect raced the 2s grace | Call `sk_vision_inspect` (or the specific tool) directly |

---

## 7. SOURCE ANCHORS

| Detail | Authoritative source |
|--------|----------------------|
| RPC handlers, defaults, model lifecycle | `vision-runtime/python/runtime.py` |
| Provider method contracts, cache dirs | `vision-runtime/src/providers/photon.ts`, `src/providers/types.ts` |
| OpenCode plugin hooks, auto-inspect grace | `vision-runtime/src/plugin.ts`, `src/opencode/attachments.ts` |
| Pi tool registrations and parameter shapes | `pi/sk-vision.ts` |
| Evidence rendering | `vision-runtime/src/core/context-builder.ts` |
