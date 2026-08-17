---
title: "sk-vision"
description: "Local vision for text-only coding models — grounded OCR, inspect, detect, and analysis evidence from a private Moondream runtime in OpenCode and Pi."
trigger_phrases:
  - "screenshot OCR"
  - "attached image"
  - "mockup"
  - "error.png"
  - "local vision"
version: 0.1.1.0
---

# sk-vision

> Text-only coding models get to see screenshots, mockups, and error images — grounded OCR, layout, detect, and pixel-analysis evidence from a local Moondream runtime, fully private and free.

Attach an image or name a file path, and the model reads it: exact OCR, structured scene reads, object detection, colors, image diffing, cropping, and more — through 13 `sk_vision_*` tools served to both OpenCode and Pi.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Screenshot OCR, mockup/UI review, error-image reading, visual QA, image comparison |
| **Invoke with** | `sk_vision_*` tools, or attach an image (auto-inspect injects evidence) |
| **Works on** | Local image paths, base64 data URLs, and http(s) image URLs |
| **Produces** | `<SK-VISION>` evidence blocks: text, bounding boxes, coordinates, cutouts, palettes, diffs, health reports |

---

## 2. OVERVIEW

### Why This Skill Exists

Text-only coding models are blind: a user pastes a screenshot of a broken UI or an error dialog and the model can only guess. This skill gives those models a local vision runtime they can call as ordinary tools — no API keys, no cloud upload, no per-image cost.

### What It Does

`sk-vision` owns a host-agnostic JSON-RPC runtime (`vision-runtime/`, Python + Moondream, default `moondream2`) and two thin host adapters: an OpenCode plugin (`.opencode/plugins/sk-vision.js`) and a Pi extension (`.pi/extensions/sk-vision.ts`). Both expose the same 13 tools. When you attach an image, the OpenCode adapter preloads analysis with a 2-second grace period and injects a `<SK-VISION>` evidence block so the model never sees a blind image part.

---

## 3. QUICK START

**Step 1: Attach or name an image.** Paste a screenshot, or pass a path/URL to any `sk_vision_*` tool.

**Step 2: Run the tool.**

```bash
# OpenCode / Pi: any of the 13 tools, e.g. exact text extraction
sk_vision_ocr path=error.png
```

**Step 3: Verify before you rely on it.**

```bash
sk_vision_status
```

Returns `model_loaded`, device, VRAM, and request count. The first model `load` downloads ~3.9 GB of weights and may provision a venv under `~/.cache/sk-vision/venv`.

---

## 4. HOW IT WORKS

All 13 tools speak one protocol: the TypeScript `RuntimeClient` sends NDJSON JSON-RPC requests over stdio to `vision-runtime/python/runtime.py`, which owns the Moondream model lifecycle (lazy load on first inference, kept warm, `unload` to release the GPU).

```text
[image attached or tool called]
            |
            v
[RuntimeClient (NDJSON over stdio)]
            |
            v
[python/runtime.py + Moondream]  -->  [<SK-VISION> evidence block]
```

### Auto-inspect

The OpenCode plugin fires a preload the moment an image part is attached, races it against a 2-second grace on message submit, and injects whatever evidence is ready — never blocking the submit path and never raising on failure. The Pi extension registers the same 13 tools directly.

---

## 5. FILES & LAYOUT

| Path | Role |
|------|------|
| `SKILL.md` | Executable skill contract and advisor triggers |
| `graph-metadata.json` | Class S identity (advisor graph) |
| `leaf-manifest.config.json` | Authored manifest config (`references/` only) |
| `leaf-manifest.json` / `leaf-aliases.json` | Generated — run `ci-skill-root-metadata.cjs --fix` |
| `README.md` | This file |
| `references/` | Routed reference corpus (protocol, env vars, troubleshooting) |
| `vision-runtime/` | Forked JSON-RPC package: `src/`, `python/runtime.py`, `dist/plugin.js`, tests |
| `pi/sk-vision.ts` | Pi extension factory (13 `pi.registerTool`) |

Host load paths live outside the skill: `.opencode/plugins/sk-vision.js` (real file) and `.pi/extensions/sk-vision.ts` (relative symlink).

---

## 6. ENVIRONMENT VARIABLES

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

---

## 7. TOOLS

The runtime exposes **13** `sk_vision_*` tools: `inspect`, `detect`, `point`, `ocr`, `status`, `segment`, `metadata`, `crop`, `zoom`, `colors`, `diff`, `annotate`, `reverse`. Do not invent extra tool names such as `sk_vision_query` — `inspect` already combines caption + scene + OCR.

Full semantics per tool: `references/runtime-reference.md`.

---

## 8. HOST ADAPTERS

- **OpenCode plugin** — `.opencode/plugins/sk-vision.js`, a real file that re-exports `vision-runtime/dist/plugin.js`. Auto-inspect uses a 2s grace and never awaits full GPU work.
- **Pi extension** — `.pi/extensions/sk-vision.ts`, a relative symlink to `pi/sk-vision.ts`. Registers the 13 tools via `pi.registerTool`; `session_shutdown` closes the runtime client.

Skill owns source; the adapter files are load paths only.

---

## 9. PUBLISHING & MAINTENANCE

This skill is **`sk-vision`**. Do not publish or refer to it as `opencode-senses`; the fork's `publishConfig` is neutralized.

```bash
# Regenerate manifests after touching references/
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix
# Validate the package
python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-vision --check
# Runtime regression
cd vision-runtime && bun run build && bun test
```
