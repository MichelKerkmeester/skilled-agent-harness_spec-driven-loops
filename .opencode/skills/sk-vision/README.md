---
title: "sk-vision"
description: "Local vision for text-only coding models. Grounded OCR, inspect, detect and pixel analysis from a private Moondream runtime in OpenCode, Pi, Cursor and Devin."
trigger_phrases:
  - "screenshot OCR"
  - "attached image"
  - "mockup"
  - "error.png"
  - "local vision"
version: 0.2.0.0
---

# sk-vision

> Text-only coding models get grounded OCR, layout, detect and pixel-analysis evidence from a private Moondream runtime. Vision is opt-in and runs only when you invoke `/vision` or call an available tool.

Use `/vision` with an image in OpenCode, Cursor or Pi. Devin calls `sk_vision_inspect` directly. The 13 `sk_vision_*` tools provide exact OCR, structured scene reads, object detection, colors, image diffing, cropping and more.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Screenshot OCR, mockup/UI review, error-image reading, visual QA, image comparison |
| **Invoke with** | `/vision <question>` or bare `/vision`. Direct `sk_vision_*` calls remain available where the host exposes them |
| **Works on** | Local image paths, base64 data URLs and http(s) image URLs |
| **Produces** | `<SK-VISION>` evidence blocks: text, bounding boxes, coordinates, cutouts, palettes, diffs, health reports |
| **Runs on** | A private local Moondream runtime. No API keys, no cloud upload, no per-image cost |

---

## 2. OVERVIEW

### Why This Skill Exists

Text-only coding models are blind. A user pastes a screenshot of a broken UI or an error dialog. The model can only guess at what it says. `sk-vision` gives those models a local vision runtime they can call on demand through `/vision` or an exposed tool.

### What It Does

`sk-vision` owns a host-agnostic JSON-RPC runtime (`vision-runtime/`, Python + Moondream, default `moondream2`) and thin per-host adapters. The default posture is idle. OpenCode does not register the tools by default. Pi registers them hidden. Cursor and Devin keep their MCP tools available.

### Why It Matters

The vision runs on your machine. There are no API keys or per-image charges. Images stay on the host, which makes the skill suitable for private screenshots and error dumps.

### The Local-Vision Knowledge Layer

The value is not "call a model on an image". It is turning an image into evidence a text model can act on. Three ideas carry that:

- **Grounded evidence, not prose.** Every tool returns a structured `<SK-VISION>` block with exact OCR text, normalized coordinates and bounding boxes. The model reasons over facts it can cite, not a loose caption.
- **Short-lived by default.** Each `/vision` call closes the runtime after analysis. `SK_VISION_TEARDOWN=unload` frees the model and keeps the process. `SK_VISION_TEARDOWN=keep` leaves it running.
- **Model-free where possible.** `metadata`, `crop`, `colors`, `annotate` and `reverse` need no model. They answer instantly and never pay the GPU cost.

---

## 3. QUICK START

**Step 1: Add an image.** Paste a screenshot or keep a recent image in the session.

**Step 2: Invoke `/vision`.**

```text
/vision What does this screenshot say?
```

Use bare `/vision` for a full read of the most-recent image. OpenCode returns scene, caption and OCR evidence. Cursor and Pi ask for a question in the conversation or return a full read.

**Step 3: Verify before you rely on it.**

`sk_vision_status` is a direct call on Cursor and Devin and is visible in OpenCode or Pi when `SK_VISION_AUTOINSPECT=1` is set. In the default mode, `/vision` handles image analysis and runtime teardown.

Returns `model_loaded`, device, VRAM and request count. The first model `load` downloads ~3.9 GB of weights and may provision a venv under `~/.cache/sk-vision/venv`.

---

## 4. HOW IT WORKS

All 13 tools speak one protocol: the TypeScript `RuntimeClient` sends NDJSON JSON-RPC requests over stdio to `vision-runtime/python/runtime.py`, which owns the Moondream model lifecycle (lazy load on first inference, kept warm, `unload` to release the GPU).

```text
[`/vision` command or tool called]
            |
            v
[host adapter → RuntimeClient (NDJSON over stdio)]
            |
            v
[python/runtime.py + Moondream]  -->  [<SK-VISION> evidence block]
```

### Command-gated activation

The default posture is opt-in and idle. OpenCode runs `/vision` through a `command.execute.before` hook. The hook fetches the latest session image, runs the analysis, injects a `<SK-VISION COMMAND>` evidence block and tears the runtime down. Pi's `/vision` prompt drives its hidden `sk_vision_inspect` tool and tears down a fresh runtime after each call. Cursor's prompt drives the MCP tool registered in `.cursor/mcp.json`. Devin has no command surface and calls the MCP tool directly. `SK_VISION_AUTOINSPECT=1` restores the legacy always-on behavior and visible tools in OpenCode and Pi. Full protocol, methods and tool semantics are in [SKILL.md](SKILL.md) §3.

---

## 5. FILES & LAYOUT

| Path | Role |
|------|------|
| `SKILL.md` | Executable skill contract, advisor triggers, runtime protocol, troubleshooting |
| `graph-metadata.json` | Class S identity (advisor graph) |
| `leaf-manifest.config.json` | Authored manifest config (routed leaf root) |
| `leaf-manifest.json` / `leaf-aliases.json` | Generated. Run `ci-skill-root-metadata.cjs --fix` |
| `README.md` | This file |
| `hooks/pi/sk-vision.ts` | Pi extension source (13 `pi.registerTool`) |
| `vision-runtime/src/plugin.ts` | OpenCode plugin source (built to `dist/plugin.js`) |
| `vision-runtime/` | Forked JSON-RPC package: `src/`, `python/runtime.py`, `dist/`, tests |
| `feature-catalog/` | Per-tool deep documentation (routed corpus) |
| `manual-testing-playbook/` / `benchmark/` | Test-scenario corpus and measured results |

Host load paths live outside the skill and resolve back in: `.pi/extensions/sk-vision.ts` into `hooks/pi/` and `.opencode/plugins/sk-vision.js` into the built `vision-runtime/dist/plugin.js`.

---

## 6. TOOLS

The runtime exposes **13** `sk_vision_*` tools: `inspect`, `detect`, `point`, `ocr`, `status`, `segment`, `metadata`, `crop`, `zoom`, `colors`, `diff`, `annotate`, `reverse`. Do not invent extra names such as `sk_vision_query`. `inspect` already combines caption + scene + OCR. Full per-tool semantics: [SKILL.md](SKILL.md) §3 and `feature-catalog/`.

---

## 7. HOST ADAPTERS

OpenCode and Pi load an in-process adapter from the skill's `hooks/` source. Cursor and Devin are MCP-only and share one MCP server:

- **OpenCode**: the built plugin `vision-runtime/dist/plugin.js` loads through `.opencode/plugins/sk-vision.js`. It does not register the 13 tools by default. Its `/vision` command hook injects evidence and tears down the runtime. `SK_VISION_AUTOINSPECT=1` restores visible tools and legacy auto-inspect.
- **Pi**: source `hooks/pi/sk-vision.ts` loads through `.pi/extensions/sk-vision.ts`. It registers the 13 tools hidden by default. Its `/vision` prompt drives the hidden inspect tool and tears down a fresh runtime after each call.
- **Cursor and Devin**: both use the shared MCP server. Cursor has a `/vision` prompt command. Devin has no command surface and calls the MCP tool directly. See `hooks/README.md`.

The in-process sources are mirrored to the shared hook fleet at `.opencode/hooks/sk-vision/{pi,opencode}`. Skill owns the source. Every other path is a symlink, re-export or MCP config.

---

## 8. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for `sk-vision` when a text-only model needs to read an image the user attached or named. This includes a screenshot, mockup or error image. Skip it when the primary model is already multimodal or when the input is audio, video or a document.

### Related Skills

| Skill | Relationship |
|-------|--------------|
| `sk-code` (`sk-code-opencode`) | Builds and verifies the `vision-runtime` package and the host adapters |
| `sk-doc` / `sk-create-skill` | Own this SKILL.md and README shape and the packaging/validation gate |

---

## 9. TROUBLESHOOTING

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `SK_VISION_ERROR (FETCH_FAILED)` | URL download failed or timed out | Check the URL. Raise `fetchTimeoutMs` if needed (default 60s) |
| `SK_VISION_ERROR (NOT_AN_IMAGE)` | URL returned a non-image content type | Confirm the URL serves an image |
| Model fails to load on first inference | Missing weights or dependencies | Run once with `SK_VISION_DEBUG=1`; check `~/.cache/sk-vision/venv` |
| Out-of-memory on load | VRAM below ~6 GB | Use the default `moondream2`; close other GPU consumers |
| `segment` / `ocr` errors on the default model | `moondream2` lacks Moondream 3.x tasks | Set `SK_VISION_MODEL` to a Moondream 3.x checkpoint |
| Evidence block missing after `/vision` | The session has no recent image or the command did not run | Confirm the command host and call `sk_vision_inspect` directly when the host exposes it |

Full environment-variable and hardware reference: [SKILL.md](SKILL.md) §3.

---

## 10. FAQ

**Does any image leave my machine?** No. Vision runs locally against Moondream. The only outbound call is the optional `sk_vision_reverse` Yandex lookup. It has a local perceptual-hash path first.

**Do I need a GPU?** An NVIDIA Ampere-or-newer GPU or Apple Silicon (M-series), ~6 GB VRAM for the default model. Model-free tools (`metadata`, `crop`, `colors`, `annotate`, `reverse`) run without one.

**Why only 13 tools?** The set is locked and covers read, locate, measure, and compare. `inspect` without a `question` already runs caption + scene + OCR, so a `sk_vision_query` tool would be redundant.

**Can I use a different model?** Yes. Set `SK_VISION_MODEL`. Note `segment`, `reason` and `ocr` need a Moondream 3.x checkpoint.

---

## 11. VERIFICATION

```bash
# Regenerate manifests after touching routed corpora
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix

# Validate the skill package
python3 .opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .opencode/skills/sk-vision

# Runtime regression
cd .opencode/skills/sk-vision/vision-runtime && bun run build && bun test
```

`ci-skill-root-metadata.cjs` should report `OK [S] sk-vision`. The package check should PASS. The runtime build and tests should exit 0.

---

## 12. RELATED DOCUMENTS

- [SKILL.md](SKILL.md): the executable contract for routing, tools, JSON-RPC protocol, env vars and troubleshooting.
- `feature-catalog/`: per-tool deep behavior.
- `manual-testing-playbook/` and `benchmark/`: test scenarios and measured results.
- Class S root-metadata contract: `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`.

This skill is **`sk-vision`**. Do not publish or refer to it as `opencode-senses`; the fork's `publishConfig` is neutralized.
