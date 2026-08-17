---
title: "sk-vision"
description: "Local vision for text-only coding models — grounded OCR, inspect, detect, and pixel analysis from a private Moondream runtime in OpenCode, Pi, Cursor, and Devin."
trigger_phrases:
  - "screenshot OCR"
  - "attached image"
  - "mockup"
  - "error.png"
  - "local vision"
version: 0.1.3.0
---

# sk-vision

> Text-only coding models get to see screenshots, mockups, and error images — grounded OCR, layout, detect, and pixel-analysis evidence from a private Moondream runtime, fully local and free.

Attach an image or name a file path, and the model reads it: exact OCR, structured scene reads, object detection, colors, image diffing, cropping, and more — through 13 `sk_vision_*` tools served to OpenCode, Pi, Cursor, and Devin.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Screenshot OCR, mockup/UI review, error-image reading, visual QA, image comparison |
| **Invoke with** | `sk_vision_*` tools, or attach an image (auto-inspect injects evidence) |
| **Works on** | Local image paths, base64 data URLs, and http(s) image URLs |
| **Produces** | `<SK-VISION>` evidence blocks: text, bounding boxes, coordinates, cutouts, palettes, diffs, health reports |
| **Runs on** | A private local Moondream runtime — no API keys, no cloud upload, no per-image cost |

---

## 2. OVERVIEW

### Why This Skill Exists

Text-only coding models are blind. A user pastes a screenshot of a broken UI or an error dialog, and the model can only guess at what it says. `sk-vision` gives those models a local vision runtime they call as ordinary tools, so a screenshot becomes exact text, coordinates, and a structured scene read instead of a guess.

### What It Does

`sk-vision` owns a host-agnostic JSON-RPC runtime (`vision-runtime/`, Python + Moondream, default `moondream2`) and thin per-host adapters. Both hosts expose the same 13 tools. When you attach an image, the OpenCode adapter preloads analysis with a 2-second grace period and injects a `<SK-VISION>` evidence block, so the model never sees a blind image part.

### Why It Matters

The vision runs on your machine. There are no API keys, no per-image charges, and no image ever leaves the host — which is what makes it usable on private screenshots and error dumps a cloud vision API would be the wrong place to send.

### The Local-Vision Knowledge Layer

The value is not "call a model on an image" — it is turning an image into evidence a text model can act on. Three ideas carry that:

- **Grounded evidence, not prose.** Every tool returns a structured `<SK-VISION>` block — exact OCR text, normalized coordinates, bounding boxes — so the model reasons over facts it can cite, not a loose caption.
- **Warm once, reuse.** The runtime lazy-loads the model on first use and keeps it warm; `unload` hands the GPU back to the host model when vision work is done.
- **Model-free where possible.** `metadata`, `crop`, `colors`, `annotate`, and `reverse` need no model at all — they answer instantly and never pay the GPU cost.

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
[host adapter → RuntimeClient (NDJSON over stdio)]
            |
            v
[python/runtime.py + Moondream]  -->  [<SK-VISION> evidence block]
```

### Auto-inspect (the key concept)

The OpenCode adapter fires a preload the moment an image part is attached, races it against a 2-second grace on message submit, and injects whatever evidence is ready — never blocking the submit path and never raising on failure. The Pi adapter registers the same 13 tools directly. Full protocol, methods, and tool semantics are in [SKILL.md](SKILL.md) §3.

---

## 5. FILES & LAYOUT

| Path | Role |
|------|------|
| `SKILL.md` | Executable skill contract, advisor triggers, runtime protocol, troubleshooting |
| `graph-metadata.json` | Class S identity (advisor graph) |
| `leaf-manifest.config.json` | Authored manifest config (routed leaf root) |
| `leaf-manifest.json` / `leaf-aliases.json` | Generated — run `ci-skill-root-metadata.cjs --fix` |
| `README.md` | This file |
| `hooks/pi/sk-vision.ts` | Pi extension source (13 `pi.registerTool`) |
| `hooks/opencode/sk-vision.js` | OpenCode plugin source |
| `vision-runtime/` | Forked JSON-RPC package: `src/`, `python/runtime.py`, `dist/`, tests |
| `feature-catalog/` | Per-tool deep documentation (routed corpus) |
| `manual-testing-playbook/` / `benchmark/` | Test-scenario corpus and measured results |

Host load paths live outside the skill and resolve back into `hooks/`: `.opencode/plugins/sk-vision.js` and `.pi/extensions/sk-vision.ts`.

---

## 6. TOOLS

The runtime exposes **13** `sk_vision_*` tools: `inspect`, `detect`, `point`, `ocr`, `status`, `segment`, `metadata`, `crop`, `zoom`, `colors`, `diff`, `annotate`, `reverse`. Do not invent extra names such as `sk_vision_query` — `inspect` already combines caption + scene + OCR. Full per-tool semantics: [SKILL.md](SKILL.md) §3 and `feature-catalog/`.

---

## 7. HOST ADAPTERS

OpenCode and Pi load an in-process adapter from the skill's `hooks/` source; Cursor and Devin are MCP-only and share one MCP server:

- **OpenCode** — source `hooks/opencode/sk-vision.js`, loaded via `.opencode/plugins/sk-vision.js`. Auto-inspect uses a 2s grace and never awaits full GPU work.
- **Pi** — source `hooks/pi/sk-vision.ts`, loaded via `.pi/extensions/sk-vision.ts` (relative symlink). Registers the 13 tools via `pi.registerTool`; `session_shutdown` closes the runtime client.
- **Cursor & Devin** — no in-process plugin API, so they attach the 13 tools over MCP. A shared stdio server (`vision-runtime/src/mcp/server.ts` → `dist/mcp-server.js`) is launched by Cursor via `.claude/mcp.json` (through the `.cursor/mcp.json` symlink chain) and by Devin via `.devin/mcp_config.json`.

The in-process sources are mirrored to the shared hook fleet at `.opencode/hooks/sk-vision/{pi,opencode}`. Skill owns source; every other path is a symlink, re-export, or MCP config.

---

## 8. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for `sk-vision` when a text-only model needs to read an image the user attached or named — a screenshot, mockup, or error image. Skip it when the primary model is already multimodal, or when the input is audio, video, or a document.

### Related Skills

| Skill | Relationship |
|-------|--------------|
| `sk-code` (`sk-code-opencode`) | Builds and verifies the `vision-runtime` package and the host adapters |
| `sk-doc` / `sk-create-skill` | Own this SKILL.md and README shape and the packaging/validation gate |

---

## 9. TROUBLESHOOTING

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `SK_VISION_ERROR (FETCH_FAILED)` | URL download failed or timed out | Check the URL; raise `fetchTimeoutMs` (default 60s) |
| `SK_VISION_ERROR (NOT_AN_IMAGE)` | URL returned a non-image content type | Confirm the URL serves an image |
| Model fails to load on first inference | Missing weights or dependencies | Run once with `SK_VISION_DEBUG=1`; check `~/.cache/sk-vision/venv` |
| Out-of-memory on load | VRAM below ~6 GB | Use the default `moondream2`; close other GPU consumers |
| `segment` / `ocr` errors on the default model | `moondream2` lacks Moondream 3.x tasks | Set `SK_VISION_MODEL` to a Moondream 3.x checkpoint |
| Evidence block missing after attaching | Auto-inspect raced the 2s grace | Call `sk_vision_inspect` (or the specific tool) directly |

Full environment-variable and hardware reference: [SKILL.md](SKILL.md) §3.

---

## 10. FAQ

**Does any image leave my machine?** No. Vision runs locally against Moondream. The only outbound call is the optional `sk_vision_reverse` Yandex lookup, and even that has a local perceptual-hash path first.

**Do I need a GPU?** An NVIDIA Ampere-or-newer GPU or Apple Silicon (M-series), ~6 GB VRAM for the default model. Model-free tools (`metadata`, `crop`, `colors`, `annotate`, `reverse`) run without one.

**Why only 13 tools?** The set is locked and covers read, locate, measure, and compare. `inspect` without a `question` already runs caption + scene + OCR, so a `sk_vision_query` tool would be redundant.

**Can I use a different model?** Yes — set `SK_VISION_MODEL`. Note `segment`, `reason`, and `ocr` need a Moondream 3.x checkpoint.

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

`ci-skill-root-metadata.cjs` should report `OK [S] sk-vision`; the package check should PASS; the runtime build and tests should exit 0.

---

## 12. RELATED DOCUMENTS

- [SKILL.md](SKILL.md) — the executable contract: routing, tools, JSON-RPC protocol, env vars, troubleshooting.
- `feature-catalog/` — per-tool deep behavior.
- `manual-testing-playbook/` and `benchmark/` — test scenarios and measured results.
- Class S root-metadata contract: `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`.

This skill is **`sk-vision`**. Do not publish or refer to it as `opencode-senses`; the fork's `publishConfig` is neutralized.
