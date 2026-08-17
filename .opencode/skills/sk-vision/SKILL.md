---
name: sk-vision
description: "Local vision for text-only models: OCR, inspect, and detect on screenshots and mockups via Moondream."
allowed-tools: [Read, Bash]
version: 0.1.1.0
---

<!-- Keywords: screenshot OCR, attached image, mockup, error.png, local vision, moondream, grounded evidence, sk-vision -->

# sk-vision

Local vision skill. Text-only coding models get grounded OCR, layout, detect, and inspect evidence from a local Moondream runtime, exposed as 13 `sk_vision_*` tools in OpenCode and Pi.

---

## 1. WHEN TO USE

Use this skill when the primary model is text-only and the user attached or named a local image:

- screenshot OCR
- attached image
- mockup
- error.png
- local vision
- moondream
- grounded evidence
- any request for the 13 `sk_vision_*` tools (inspect, detect, point, ocr, status, segment, metadata, crop, zoom, colors, diff, annotate, reverse)

### WHEN NOT TO USE

- The primary model is already multimodal and can see the image itself.
- The ask is audio, video, or documents — those pipelines are not built.
- Publishing under the upstream npm name `opencode-senses`.
- Inventing a tool named `sk_vision_query`. `sk_vision_inspect` without a question already runs caption + scene + OCR together.

---

## 2. SMART ROUTING

Standalone Class S skill. One workflow mode: `sk-vision`. Leaf root: `references/` only. No `mode-registry.json`. No `hub-router.json`.

| Level | When to load | Resources |
|-------|----------------|-----------|
| ALWAYS | Every invocation | This SKILL.md |
| ON_DEMAND | Runtime protocol, env vars, or tool semantics | `references/runtime-reference.md` |

```python
from pathlib import Path
SKILL_ROOT = Path(__file__).resolve().parent
INTENT_SIGNALS = {
    "VISION": {
        "weight": 4,
        "keywords": [
            "screenshot OCR", "attached image", "mockup", "error.png",
            "local vision", "moondream", "grounded evidence",
        ],
    },
}
RESOURCE_MAP = {"VISION": ["references/runtime-reference.md"]}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the input is a local image path or attachment",
    "Confirm the primary model is text-only",
    "Do not route audio, video, or document work here",
]
```

---

## 3. HOW IT WORKS

The skill owns a host-agnostic JSON-RPC runtime under `vision-runtime/` and two thin host adapters: an OpenCode plugin and a Pi extension. All 13 tools share one `RuntimeClient` (NDJSON over stdio) talking to `vision-runtime/python/runtime.py`, which wraps the Moondream vision model.

### Tools

Locked tool names (do not add or rename):

| Tool | What it does |
|------|--------------|
| `sk_vision_inspect` | Caption + structured scene read + exact OCR, or answers a `question` when given |
| `sk_vision_detect` | Labeled bounding boxes for objects/UI elements |
| `sk_vision_point` | Normalized (0-1) center coordinates for a target |
| `sk_vision_ocr` | Exact text extraction (`all` / `code` / `error` kinds) |
| `sk_vision_status` | Runtime health: model, device, VRAM, request count |
| `sk_vision_segment` | Mask/PNG cutout of a target plus its bounding box |
| `sk_vision_metadata` | Dimensions, format, mode, bytes, DPI, EXIF (no model) |
| `sk_vision_crop` | Save a normalized bbox region as a PNG |
| `sk_vision_zoom` | LANCZOS upscale of a region, optionally re-analyzed (ocr/caption/query) |
| `sk_vision_colors` | Dominant palette, luminance buckets, average RGB (no model) |
| `sk_vision_diff` | Pixel-change map between two images, optionally described by the model |
| `sk_vision_annotate` | Draw boxes/points onto a copy for visual validation |
| `sk_vision_reverse` | Reverse image search: local perceptual hash + Yandex (no API key) |

### Model lifecycle

The runtime lazy-loads the model on the first inference request (default `moondream2`), keeps it warm across calls, and can be told to unload so the GPU is released back to the host model. `load` warms it explicitly; `unload` frees it; `status` reports load state, device, VRAM, and request count.

`sk_vision_ocr` requires a Moondream 3.x checkpoint — the default `moondream2` cannot transcribe text and now fails loudly (the runtime enforces the `ocr` task). Set `SK_VISION_MODEL=moondream3-preview` for OCR, and treat its output as approximately correct (a preview checkpoint can repeat tokens), verifying against ground truth when exactness matters.

### Host adapters

- **OpenCode** — `.opencode/plugins/sk-vision.js` is a real file that re-exports `vision-runtime/dist/plugin.js`. The plugin auto-inspects attached images with a 2-second grace period before message submission and injects a `<SK-VISION>` evidence block; it never awaits the full GPU run on the submit path.
- **Pi** — `.pi/extensions/sk-vision.ts` is a relative symlink to `pi/sk-vision.ts`, a function default export that registers the 13 tools via `pi.registerTool` and closes the runtime client on `session_shutdown`.

### Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `SK_VISION_MODEL` | `moondream2` | Model checkpoint for the runtime |
| `SK_VISION_PYTHON` | auto | Python interpreter for the runtime |
| `SK_VISION_UV` | `uv` | `uv` binary used to provision the venv |
| `SK_VISION_DEBUG` | unset | `1` enables debug logging |
| `SK_VISION_KV_CACHE_PAGES` | unset | KV-cache page count for Moondream 3.x |
| `SK_VISION_DISABLE_AUTO_PROVISION` | unset | Disables automatic venv provisioning |
| `SK_VISION_CACHE_DIR` | `~/.cache/sk-vision` | Image/fetch cache root |
| `SK_VISION_VENV_DIR` | `~/.cache/sk-vision/venv` | Provisioned runtime venv |

### Evidence envelope and errors

Tool results carry structured evidence inside `<SK-VISION>` / `</SK-VISION>` tags. Failures are reported as `SK_VISION_ERROR (<CODE>): <message>` and never crash the host session.

### GPU and first load

Requires an NVIDIA Ampere-or-newer GPU or Apple Silicon (M-series). ~6 GB VRAM is enough for the default `moondream2`. The first `load` downloads ~3.9 GB of weights from Hugging Face and may provision a venv under `~/.cache/sk-vision/venv`. Do not hide this from the user.

---

## 4. RULES

- Class S skill root: author `graph-metadata.json` and `leaf-manifest.config.json`; generate `leaf-manifest.json` and `leaf-aliases.json` with `ci-skill-root-metadata.cjs --fix`.
- Forbidden at this root: `description.json`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`.
- Do not invent `sk_vision_*` tool names beyond the locked 13.
- Do not publish as `opencode-senses`; the fork's `publishConfig` is neutralized.
- `.opencode/plugins/sk-vision.js` (real file) and `.pi/extensions/sk-vision.ts` (relative symlink) are the only host load paths. Skill owns source.
- `bun run build` and `bun test` in `vision-runtime/` must stay green.
- `context/` (the upstream dump under the spec packet) is read-only and is not this skill's corpus.

---

## 5. SUCCESS CRITERIA

| Check | How to verify |
|-------|---------------|
| Skill root metadata is valid | `ci-skill-root-metadata.cjs` reports `OK [S] sk-vision` |
| Skill package validates | `package_skill.py .opencode/skills/sk-vision --check` PASS |
| Runtime builds and tests | `bun run build && bun test` in `vision-runtime/` exit 0 |
| 13 tools register on both hosts | `rg -c 'pi\.registerTool' pi/sk-vision.ts` = 13; plugin `tool` hook lists the same names |
| OpenCode adapter loads | `.opencode/plugins/sk-vision.js` exists as a regular file importing `vision-runtime/dist/plugin.js` |
| Pi adapter loads | `.pi/extensions/sk-vision.ts` is a relative symlink to `pi/sk-vision.ts` and `pi --offline --approve` starts without extension fail-closed |
| No accidental publishing | no `publishConfig` / `publish:npm` in `vision-runtime/package.json` |
| Docs describe shipped behavior | no scaffold-stub language (the old “runtime lands later” claims) in SKILL.md/README.md |

---

## 6. REFERENCES

- Runtime protocol, env vars, tool semantics, troubleshooting: `references/runtime-reference.md`
- Class S root-metadata contract: `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`
- Read-only upstream dump (not this skill's corpus): `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/context/`
