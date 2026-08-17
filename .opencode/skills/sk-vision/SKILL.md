---
name: sk-vision
description: "Local vision for text-only models: OCR, inspect, detect, and pixel analysis on screenshots and mockups via a private Moondream runtime in OpenCode, Pi, Cursor, and Devin."
allowed-tools: [Read, Bash]
version: 0.1.3.1
---

<!-- Keywords: screenshot OCR, attached image, mockup, error.png, local vision, moondream, grounded evidence, sk_vision_ocr, sk_vision_inspect, cursor mcp, devin mcp, sk-vision -->

# sk-vision

Local vision skill. Text-only coding models get grounded OCR, layout, detect, and inspect evidence from a private Moondream runtime, exposed as 13 `sk_vision_*` tools in OpenCode, Pi, Cursor, and Devin. No API keys, no cloud upload, no per-image cost.

---

## 1. WHEN TO USE

### Activation Triggers

Use this skill when the primary model is text-only and the user attached or named a local image. Route on any of:

- screenshot OCR
- attached image
- mockup
- error.png
- local vision
- moondream
- grounded evidence
- any request for the 13 `sk_vision_*` tools (`inspect`, `detect`, `point`, `ocr`, `status`, `segment`, `metadata`, `crop`, `zoom`, `colors`, `diff`, `annotate`, `reverse`)

### Use Cases

**Reading a screen the model cannot see**
- Extract exact text from a screenshot or error dialog (`sk_vision_ocr`).
- Read a UI's structure — layout, elements, and state (`sk_vision_inspect`).
- Answer a specific question about an image (`sk_vision_inspect` with `question`).

**Locating and measuring**
- Get labeled bounding boxes for objects or UI elements (`sk_vision_detect`).
- Get normalized center coordinates for a target (`sk_vision_point`).
- Cut out, upscale, or mask a region (`sk_vision_crop`, `sk_vision_zoom`, `sk_vision_segment`).

**Pixel analysis (no model required)**
- Read image dimensions, format, and EXIF (`sk_vision_metadata`).
- Read the dominant palette and luminance (`sk_vision_colors`).
- Compare two images pixel-by-pixel (`sk_vision_diff`).
- Annotate a copy for visual validation (`sk_vision_annotate`).
- Reverse-search an image locally and on Yandex (`sk_vision_reverse`).

### When NOT to Use

- The primary model is already multimodal and can see the image itself.
- The ask is audio, video, or documents — those pipelines are not built.
- Publishing under the upstream npm name `opencode-senses` (the fork's `publishConfig` is neutralized).
- Inventing a tool named `sk_vision_query`. `sk_vision_inspect` without a `question` already runs caption + scene + OCR together.

---

## 2. SMART ROUTING

Standalone **Class S** skill. One workflow mode: `sk-vision`. Single routed leaf root: `feature-catalog/` (the per-feature deep corpus). No `mode-registry.json`, no `hub-router.json`, no `description.json`.

### Resource Loading Levels

| Level | When to load | Resources |
|-------|--------------|-----------|
| ALWAYS | Every invocation | This `SKILL.md` (self-contained: protocol, tools, env, troubleshooting) |
| ON_DEMAND | A specific tool's deep behavior, edge cases, or measured results | `feature-catalog/<category>/` for the tool, `manual-testing-playbook/` for scenarios |

`SKILL.md` is self-contained for routing and the runtime contract; there is no separate `references/` reference doc. Deep per-tool material lives in `feature-catalog/`.

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent

INTENT_SIGNALS = {
    "VISION": {
        "weight": 4,
        "keywords": [
            "screenshot OCR", "attached image", "mockup", "error.png",
            "local vision", "moondream", "grounded evidence",
            "sk_vision_ocr", "sk_vision_inspect", "sk_vision_detect",
        ],
    },
}

# The self-contained SKILL.md answers most invocations. Route to the catalog only
# when a specific tool's deep behavior or a measured scenario is needed.
RESOURCE_MAP = {
    "VISION": ["feature-catalog/", "manual-testing-playbook/"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the input is a local image path, data URL, or http(s) image URL",
    "Confirm the primary model is text-only",
    "Do not route audio, video, or document work here",
]
```

---

## 3. HOW IT WORKS

The skill owns a host-agnostic JSON-RPC runtime under `vision-runtime/` and thin per-host adapters. All 13 tools share one `RuntimeClient` (NDJSON over stdio) talking to `vision-runtime/python/runtime.py`, which wraps the Moondream vision model. The adapters register the tools with each host; the runtime does the vision.

```text
[image attached or sk_vision_* tool called]
            |
            v
[host adapter: OpenCode plugin / Pi extension]
            |
            v
[RuntimeClient — NDJSON JSON-RPC over stdio]
            |
            v
[python/runtime.py + Moondream]  -->  [<SK-VISION> evidence block]
```

### The 13 tools

Locked tool names — do not add or rename:

| Tool | Provider method | What it returns |
|------|-----------------|-----------------|
| `sk_vision_inspect` | `query` (with `question`) or `caption`+`scene`+`ocr` | An answer, or a structured scene read + caption + exact OCR |
| `sk_vision_detect` | `detect` | Labeled bounding boxes with confidence |
| `sk_vision_point` | `point` | Normalized (0-1) center coordinates for a target |
| `sk_vision_ocr` | `ocr` | Exact text (`all` / `code` / `error` kinds) |
| `sk_vision_status` | `health` | Model load state, device, VRAM, request count |
| `sk_vision_segment` | `segment` | Mask/PNG cutout of a target plus its bbox |
| `sk_vision_metadata` | `metadata` | Dimensions, format, mode, bytes, DPI, EXIF (no model) |
| `sk_vision_crop` | `crop` | A normalized bbox region saved as a PNG (no model) |
| `sk_vision_zoom` | `zoom` | LANCZOS upscale of a region, optionally re-analyzed (no model unless re-analyzed) |
| `sk_vision_colors` | `colors` | Dominant palette, luminance buckets, average RGB (no model) |
| `sk_vision_diff` | `diff` | Pixel-change map between two images, optionally described |
| `sk_vision_annotate` | `annotate` | Boxes/points drawn onto a copy (no model) |
| `sk_vision_reverse` | `reverse` | Local perceptual-hash matches + Yandex URLs (no API key) |

Host tool parameter contracts (bbox strings, `kind`, `analyze`, `providers`) live in `hooks/pi/sk-vision.ts` and `vision-runtime/src/opencode/tools.ts`.

### JSON-RPC protocol

The runtime is a line-delimited JSON (NDJSON) JSON-RPC service over stdio. `RuntimeClient` spawns `python/runtime.py` and exchanges one JSON message per line:

```text
Request : {"id": int, "method": str, "params": {...}}
Response: {"id": int, "result": {...}}
          {"id": int, "error": {"code": str, "message": str}}
```

`source` is `{"type": "path", "path": str}` or `{"type": "data", "data": dataUrl}`. A `path` may be an http(s) URL — the TypeScript side downloads it into the cache before it reaches the runtime.

Runtime methods (the 13 tools map onto these): `ping`, `status`, `load`, `unload`, `query`, `caption`, `scene`, `detect`, `point`, `segment`, `ocr`, `metadata`, `crop`, `zoom`, `colors`, `diff`, `annotate`, `hash_search`, `reverse`, `shutdown`. Error codes include `INVALID_INPUT`, `EMPTY_RESULT`, `FETCH_FAILED`, and `NOT_AN_IMAGE`; the host surfaces them as `SK_VISION_ERROR (<CODE>): <message>` and never crashes the session.

### Model lifecycle

The runtime lazy-loads the model on the first inference request (default `moondream2`), keeps it warm across calls, and can be told to unload so the GPU is released back to the host model. `load` warms it explicitly, `unload` frees it, `status` reports load state, device, VRAM, and request count. `segment`, `reason`, and `ocr` require a Moondream 3.x checkpoint (`moondream2` lacks them — see `MOONDREAM3_ONLY_TASKS` in `runtime.py`).

### Host adapters

OpenCode and Pi expose in-process plugin APIs, so the skill owns their adapter source under `hooks/` and each host loads it through a symlink or re-export. Cursor and Devin have no in-process plugin API — they attach tools only over MCP — so they share one MCP stdio server instead of a per-host adapter:

- **OpenCode** — `hooks/opencode/sk-vision.js` registers the 13 tools and auto-inspects attached images with a 2-second grace before message submit, injecting a `<SK-VISION>` evidence block without awaiting the full GPU run. Loaded via `.opencode/plugins/sk-vision.js`.
- **Pi** — `hooks/pi/sk-vision.ts` is a factory default export that registers the 13 tools via `pi.registerTool` and closes the runtime client on `session_shutdown`. Loaded via `.pi/extensions/sk-vision.ts` (relative symlink).
- **Cursor & Devin (MCP-only)** — no in-process plugin API, so they share one MCP stdio server (`vision-runtime/src/mcp/server.ts`, built to `dist/mcp-server.js`; it stays in the runtime package because it needs the MCP SDK). The per-host MCP configs live under `hooks/` beside the in-process adapters: `hooks/devin/mcp_config.json` (Devin loads it via the `.devin/mcp_config.json` symlink) and `hooks/cursor/mcp.json` (the portable Cursor entry; in this repo Cursor reaches the server through the shared `.claude/mcp.json` entry via the `.cursor/mcp.json → .mcp.json` chain). Both launch `node …/dist/mcp-server.js`. See `hooks/README.md` for the four-host model.

### Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `SK_VISION_MODEL` | `moondream2` | Model checkpoint (Moondream 3.x required for `segment`, `reason`, `ocr`) |
| `SK_VISION_PYTHON` | auto | Python interpreter; wins over the provisioned venv |
| `SK_VISION_UV` | `uv` | `uv` binary used to provision the venv |
| `SK_VISION_DEBUG` | unset | `1` enables debug logging and disables HF noise suppression |
| `SK_VISION_KV_CACHE_PAGES` | unset | KV-cache page count for Moondream 3.x |
| `SK_VISION_DISABLE_AUTO_PROVISION` | unset | Stops automatic venv provisioning |
| `SK_VISION_CACHE_DIR` | `~/.cache/sk-vision` | Cache root: `fetched/` downloads, `converted/` analysis copies |
| `SK_VISION_VENV_DIR` | `~/.cache/sk-vision/venv` | Auto-provisioned runtime venv |

### GPU and first load

Requires an NVIDIA Ampere-or-newer GPU or Apple Silicon (M-series); ~6 GB VRAM is enough for the default `moondream2`. The first `load` downloads ~3.9 GB of weights from Hugging Face and may provision a venv under `~/.cache/sk-vision/venv` via `uv`. Do not hide this cost from the user.

### Troubleshooting

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

## 4. RULES

### ALWAYS

1. Author `graph-metadata.json` and `leaf-manifest.config.json`; generate `leaf-manifest.json` and `leaf-aliases.json` with `ci-skill-root-metadata.cjs --fix`.
2. Keep the skill source of truth under `hooks/` — each host loads it through a symlink or re-export, never a hand-copied duplicate.
3. Keep `bun run build` and `bun test` in `vision-runtime/` green before any completion claim.
4. Surface the first-load download and VRAM cost to the user.

### NEVER

1. Invent `sk_vision_*` tool names beyond the locked 13.
2. Publish or refer to the skill as `opencode-senses`.
3. Add `description.json`, `mode-registry.json`, `hub-router.json`, or `command-metadata.json` at this Class S root.
4. Treat `context/` (the upstream dump under the spec packet) as this skill's corpus — it is read-only reference material.
5. Hand-edit the generated `leaf-manifest.json` or `leaf-aliases.json`.

### ESCALATE IF

- A host needs a tool the locked 13 do not cover — decide with the operator before adding a tool, not silently.
- The runtime contract in `runtime.py` diverges from this SKILL.md — the code wins; update this doc.

---

## 5. SUCCESS CRITERIA

| Check | How to verify |
|-------|---------------|
| Skill root metadata is valid | `ci-skill-root-metadata.cjs` reports `OK [S] sk-vision` |
| Skill package validates | `validate_skill_package.py .opencode/skills/sk-vision` PASS |
| Runtime builds and tests | `bun run build && bun test` in `vision-runtime/` exit 0 |
| 13 tools register on both hosts | `rg -c 'pi\.registerTool' hooks/pi/sk-vision.ts` = 13; the OpenCode plugin lists the same names |
| OpenCode adapter loads | `.opencode/plugins/sk-vision.js` resolves to `hooks/opencode/sk-vision.js` |
| Pi adapter loads | `.pi/extensions/sk-vision.ts` resolves to `hooks/pi/sk-vision.ts`; `pi --offline --approve` starts without a fail-closed extension |
| No accidental publishing | no `publishConfig` / `publish:npm` in `vision-runtime/package.json` |
| Docs describe shipped behavior | no scaffold-stub language in `SKILL.md` / `README.md` |

---

## 6. REFERENCES

The authoritative behavior lives in the code; when this doc and the code disagree, the code wins and this doc is updated.

| Detail | Authoritative source |
|--------|----------------------|
| RPC handlers, defaults, model lifecycle | `vision-runtime/python/runtime.py` |
| Provider method contracts, cache dirs | `vision-runtime/src/providers/photon.ts`, `src/providers/types.ts` |
| OpenCode plugin hooks, auto-inspect grace | `hooks/opencode/sk-vision.js`, `vision-runtime/src/opencode/attachments.ts` |
| Pi tool registrations and parameter shapes | `hooks/pi/sk-vision.ts` |
| Evidence rendering | `vision-runtime/src/core/context-builder.ts` |
| Per-tool deep behavior and measured results | `feature-catalog/`, `manual-testing-playbook/`, `benchmark/` |
| Class S root-metadata contract | `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` |

---

## 7. INTEGRATION

- **Host load paths** — all four hosts source from `hooks/` and are mirrored into the shared hook hub at `.opencode/hooks/sk-vision/{pi,opencode,cursor,devin}`. In-process: `hooks/pi/` and `hooks/opencode/`, loaded via `.pi/extensions/sk-vision.ts` and `.opencode/plugins/sk-vision.js`. MCP: `hooks/devin/mcp_config.json` (loaded via the `.devin/mcp_config.json` symlink) and `hooks/cursor/mcp.json` (portable; Cursor reaches it via the `.claude/mcp.json` entry through the `.cursor/mcp.json` chain), both launching `dist/mcp-server.js`.
- **Related skills** — `sk-code` builds and verifies the runtime package; `sk-doc` / `sk-create-skill` own this SKILL.md and README shape and its validation gate.
- **Tool usage** — the 13 `sk_vision_*` tools are the public surface; the JSON-RPC methods above are internal and reached only through the adapters, never called directly by the host model.
