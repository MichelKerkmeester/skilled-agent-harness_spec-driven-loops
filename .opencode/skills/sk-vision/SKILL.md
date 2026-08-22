---
name: sk-vision
description: "Local vision for text-only models: OCR, inspect, detect and pixel analysis on screenshots and mockups via a private Moondream runtime in OpenCode, Pi, Cursor and Devin."
allowed-tools: [Read, Bash]
version: 0.2.0.0
---

<!-- Keywords: screenshot OCR, attached image, mockup, error.png, local vision, moondream, grounded evidence, sk_vision_ocr, sk_vision_inspect, cursor mcp, devin mcp, sk-vision -->

# sk-vision

Local vision skill. Text-only coding models get grounded OCR, layout, detect, and inspect evidence from a private Moondream runtime. The default posture is opt-in and idle. OpenCode does not register the tools by default. Pi registers them hidden. Cursor and Devin keep their MCP tools available. No API keys, no cloud upload, no per-image cost.

---

## 1. WHEN TO USE

### Activation Triggers

Use this skill when the user invokes `/vision` or explicitly requests vision evidence for a local image. Route on any of:

- screenshot OCR
- attached image
- mockup
- error.png
- local vision
- moondream
- grounded evidence
- `/vision`
- any request for the 13 `sk_vision_*` tools (`inspect`, `detect`, `point`, `ocr`, `status`, `segment`, `metadata`, `crop`, `zoom`, `colors`, `diff`, `annotate`, `reverse`)

The default posture is idle. The skill does not inspect attached images or advertise its tools unless the user invokes `/vision`, calls a tool on a host that exposes it, or sets `SK_VISION_AUTOINSPECT=1` to restore the legacy OpenCode and Pi behavior.

### Use Cases

**Reading a screen the model cannot see**
- Extract exact text from a screenshot or error dialog (`sk_vision_ocr`).
- Read a UI's structure: layout, elements and state (`sk_vision_inspect`).
- Answer a specific question about an image (`sk_vision_inspect` with `question`).

**Locating and measuring**
- Get labeled bounding boxes for objects or UI elements (`sk_vision_detect`).
- Get normalized center coordinates for a target (`sk_vision_point`).
- Cut out, upscale or mask a region (`sk_vision_crop`, `sk_vision_zoom`, `sk_vision_segment`).

**Pixel analysis (no model required)**
- Read image dimensions, format and EXIF (`sk_vision_metadata`).
- Read the dominant palette and luminance (`sk_vision_colors`).
- Compare two images pixel-by-pixel (`sk_vision_diff`).
- Annotate a copy for visual validation (`sk_vision_annotate`).
- Reverse-search an image locally and on Yandex (`sk_vision_reverse`).

### When NOT to Use

- The primary model is already multimodal and can see the image itself.
- The ask is audio, video or documents. Those pipelines are not built.
- Publishing under the upstream npm name `opencode-senses` (the fork's `publishConfig` is neutralized).
- Inventing a tool named `sk_vision_query`. `sk_vision_inspect` without a `question` already runs caption + scene + OCR together.

---

## 2. SMART ROUTING

Standalone **Class S** skill. One workflow mode: `sk-vision`. Single routed leaf root: `feature-catalog/` (the per-feature deep corpus). No `mode-registry.json`, no `hub-router.json`, no `description.json`.

### Resource Loading Levels

| Level | When to load | Resources |
|-------|--------------|-----------|
| ALWAYS | Every invocation | This `SKILL.md` (self-contained: protocol, tools, env, troubleshooting) |
| ON_DEMAND | A specific tool's deep behavior, edge cases or measured results | `feature-catalog/<category>/` for the tool, `manual-testing-playbook/` for scenarios |

`SKILL.md` is self-contained for routing and the runtime contract. There is no separate `references/` reference doc. Deep per-tool material lives in `feature-catalog/`.

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

The skill owns a host-agnostic JSON-RPC runtime under `vision-runtime/` and thin per-host adapters. All 13 tools share one `RuntimeClient` (NDJSON over stdio) talking to `vision-runtime/python/runtime.py`, which wraps the Moondream vision model. The runtime stays idle until a command or explicit tool call starts it.

```text
[`/vision` command or sk_vision_* tool called]
            |
            v
[host adapter: OpenCode plugin / Pi extension]
            |
            v
[RuntimeClient: NDJSON JSON-RPC over stdio]
            |
            v
[python/runtime.py + Moondream]  -->  [<SK-VISION> evidence block]
```

### The 13 tools

Locked tool names. Do not add or rename them:

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

`source` is `{"type": "path", "path": str}` or `{"type": "data", "data": dataUrl}`. A `path` may be an http(s) URL. The TypeScript side downloads it into the cache before it reaches the runtime.

Runtime methods (the 13 tools map onto these): `ping`, `status`, `load`, `unload`, `query`, `caption`, `scene`, `detect`, `point`, `segment`, `ocr`, `metadata`, `crop`, `zoom`, `colors`, `diff`, `annotate`, `hash_search`, `reverse`, `shutdown`. Error codes include `INVALID_INPUT`, `EMPTY_RESULT`, `FETCH_FAILED` and `NOT_AN_IMAGE`. The host surfaces them as `SK_VISION_ERROR (<CODE>): <message>` and never crashes the session.

### Model lifecycle

The runtime lazy-loads the model on the first inference request (default `moondream2`). Each `/vision` call follows `SK_VISION_TEARDOWN`: `close` shuts down the runtime by default, `unload` frees the model and keeps the process, and `keep` leaves it running. `load` warms it explicitly, `unload` frees it, and `status` reports load state, device, VRAM and request count. `segment`, `reason` and `ocr` require a Moondream 3.x checkpoint. `moondream2` lacks them. See `MOONDREAM3_ONLY_TASKS` in `runtime.py`.

`sk_vision_ocr` requires a Moondream 3.x checkpoint. The default `moondream2` cannot transcribe text and fails loudly because the runtime enforces the `ocr` task. Set `SK_VISION_MODEL=moondream3-preview` for OCR. Treat its output as approximately correct because a preview checkpoint can repeat tokens. Verify against ground truth when exactness matters.

### Host adapters

OpenCode and Pi expose in-process plugin APIs, so the skill owns their adapter source under `hooks/` and each host loads it through a symlink or re-export. Cursor and Devin have no in-process plugin API. They attach tools over MCP and share one MCP stdio server.

- **OpenCode**: the built plugin `vision-runtime/dist/plugin.js` registers only the `command.execute.before` hook by default. The hook runs for `/vision`, fetches the latest session image, injects a `<SK-VISION COMMAND>` evidence block and tears the runtime down afterward. `SK_VISION_AUTOINSPECT=1` restores the legacy visible tools and always-on inspection. The plugin loads through `.opencode/plugins/sk-vision.js`, which points to the built entry inside the runtime package so it resolves `python/runtime.py`.
- **Pi**: `hooks/pi/sk-vision.ts` registers the 13 tools hidden by default. The native `/vision` command calls the hidden `sk_vision_inspect` tool and opens a fresh runtime for each call. It tears the runtime down after each call. `SK_VISION_AUTOINSPECT=1` restores the legacy visible tools and always-on inspection. The extension loads through `.pi/extensions/sk-vision.ts`.
- **Cursor**: the built MCP server remains registered in `.cursor/mcp.json`. The `/vision` command drives `sk_vision_inspect`. Devin has no command surface, so it calls `sk_vision_inspect` directly. The shared MCP server remains bound to the host lifetime and shuts down when the host closes it. Claude has no sk-vision integration.

### `/vision` command

`/vision <question>` answers the question against the most-recent image in the session.

Bare `/vision` behaves by host:

- OpenCode reads the latest image and returns scene, caption and OCR evidence.
- Cursor and Pi ask for a question in the conversation or return a full read. A prompt file cannot open a UI input box.

OpenCode handles the command in a `command.execute.before` plugin hook. The hook fetches the latest session image, runs the analysis, injects a `<SK-VISION COMMAND>` evidence block and tears the runtime down. Cursor's command prompt drives the MCP tool registered in `.cursor/mcp.json`. Pi's command prompt drives its hidden tool. Each Pi call opens a fresh runtime and tears it down afterward. Devin has no command surface and calls `sk_vision_inspect` directly.

### Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `SK_VISION_MODEL` | `moondream2` | Model checkpoint (Moondream 3.x required for `segment`, `reason`, `ocr`) |
| `SK_VISION_PYTHON` | auto | Python interpreter. It wins over the provisioned venv |
| `SK_VISION_UV` | `uv` | `uv` binary used to provision the venv |
| `SK_VISION_DEBUG` | unset | `1` enables debug logging and disables HF noise suppression |
| `SK_VISION_KV_CACHE_PAGES` | unset | KV-cache page count for Moondream 3.x |
| `SK_VISION_DISABLE_AUTO_PROVISION` | unset | Stops automatic venv provisioning |
| `SK_VISION_AUTOINSPECT` | unset | `1` restores the legacy always-on auto-inspect and visible tools in OpenCode and Pi |
| `SK_VISION_TEARDOWN` | `close` | Runtime teardown after each `/vision` call: `close` shuts down, `unload` frees the model and `keep` leaves the process running |
| `SK_VISION_CACHE_DIR` | `~/.cache/sk-vision` | Cache root: `fetched/` downloads, `converted/` analysis copies |
| `SK_VISION_VENV_DIR` | `~/.cache/sk-vision/venv` | Auto-provisioned runtime venv |

### GPU and first load

Requires an NVIDIA Ampere-or-newer GPU or Apple Silicon (M-series). About 6 GB VRAM is enough for the default `moondream2`. The first `load` downloads ~3.9 GB of weights from Hugging Face and may provision a venv under `~/.cache/sk-vision/venv` via `uv`. Do not hide this cost from the user.

### Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `SK_VISION_ERROR (FETCH_FAILED)` | URL download failed or timed out | Check the URL. Raise `fetchTimeoutMs` if needed (default 60s in `photon.ts`) |
| `SK_VISION_ERROR (NOT_AN_IMAGE)` | URL returned a non-image content type | Confirm the URL serves an image |
| Model fails to load on first inference | Missing weights or unsatisfied dependencies | Run once with `SK_VISION_DEBUG=1`. Check `~/.cache/sk-vision/venv` |
| Venv provisioning fails | `uv` missing or Python version mismatch | Set `SK_VISION_PYTHON` to a working interpreter or `SK_VISION_UV` to a working `uv` |
| Out-of-memory on load | VRAM below ~6 GB or model too large | Use the default `moondream2`. Close other GPU consumers |
| `segment`/`ocr` errors on default model | `moondream2` lacks Moondream 3.x tasks | Set `SK_VISION_MODEL` to a Moondream 3.x checkpoint |
| Evidence block missing after `/vision` | The session has no recent image or the command did not run | Confirm the command host and call `sk_vision_inspect` directly when the host exposes it |

---

## 4. RULES

### ALWAYS

1. Author `graph-metadata.json` and `leaf-manifest.config.json`. Generate `leaf-manifest.json` and `leaf-aliases.json` with `ci-skill-root-metadata.cjs --fix`.
2. Keep the skill source of truth in the runtime package. Each host loads it through a symlink, re-export or config, never a hand-copied duplicate.
3. Keep `bun run build` and `bun test` in `vision-runtime/` green before any completion claim.
4. Surface the first-load download and VRAM cost to the user.

### NEVER

1. Invent `sk_vision_*` tool names beyond the locked 13.
2. Publish or refer to the skill as `opencode-senses`.
3. Add `description.json`, `mode-registry.json`, `hub-router.json`, or `command-metadata.json` at this Class S root.
4. Treat `context/` (the upstream dump under the spec packet) as this skill's corpus — it is read-only reference material.
5. Hand-edit the generated `leaf-manifest.json` or `leaf-aliases.json`.

### ESCALATE IF

- A host needs a tool the locked 13 do not cover. Decide with the operator before adding a tool.
- The runtime contract in `runtime.py` diverges from this SKILL.md. The code wins. Update this doc.

---

## 5. SUCCESS CRITERIA

| Check | How to verify |
|-------|---------------|
| Skill root metadata is valid | `ci-skill-root-metadata.cjs` reports `OK [S] sk-vision` |
| Skill package validates | `validate_skill_package.py .opencode/skills/sk-vision` PASS |
| Runtime builds and tests | `bun run build && bun test` in `vision-runtime/` exit 0 |
| 13 tools are available on both in-process hosts | `rg -c 'name: "sk_vision_' hooks/pi/sk-vision.ts` = 13 (Pi registers them through one wrapper). `SK_VISION_AUTOINSPECT=1` makes the OpenCode plugin and Pi tools visible |
| OpenCode command adapter loads | `.opencode/plugins/sk-vision.js` resolves to `vision-runtime/dist/plugin.js` and `/vision` runs its command hook |
| Pi command adapter loads | `.pi/extensions/sk-vision.ts` resolves to `hooks/pi/sk-vision.ts`. Pi tools are hidden by default and `/vision` starts a fresh call |
| No accidental publishing | no `publishConfig` / `publish:npm` in `vision-runtime/package.json` |
| Docs describe shipped behavior | no scaffold-stub language in `SKILL.md` / `README.md` |

---

## 6. REFERENCES

The authoritative behavior lives in the code. When this doc and the code disagree, the code wins and this doc is updated.

| Detail | Authoritative source |
|--------|----------------------|
| RPC handlers, defaults, model lifecycle | `vision-runtime/python/runtime.py` |
| Provider method contracts, cache dirs | `vision-runtime/src/providers/photon.ts`, `src/providers/types.ts` |
| OpenCode command hook and legacy auto-inspect path | `vision-runtime/src/plugin.ts`, `vision-runtime/src/opencode/command.ts`, `vision-runtime/src/opencode/attachments.ts` |
| Pi tool registrations and parameter shapes | `hooks/pi/sk-vision.ts` |
| Evidence rendering | `vision-runtime/src/core/context-builder.ts` |
| Per-tool deep behavior and measured results | `feature-catalog/`, `manual-testing-playbook/`, `benchmark/` |
| Class S root-metadata contract | `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` |

---

## 7. INTEGRATION

- **Host load paths**: host-adapter sources live under `hooks/` and are mirrored into the shared hook hub at `.opencode/hooks/sk-vision/{pi,opencode,cursor,devin}`. Pi loads `hooks/pi/` through `.pi/extensions/sk-vision.ts`. OpenCode loads the built package plugin through `.opencode/plugins/sk-vision.js`. The entry sits inside the runtime package so it resolves `python/runtime.py`. MCP configs under `hooks/` launch `dist/mcp-server.js` for Cursor and Devin.
- **Related skills**: `sk-code` builds and verifies the runtime package. `sk-doc` and `sk-create-skill` own this SKILL.md, README shape and validation gate.
- **Tool usage**: the 13 `sk_vision_*` tools are the public surface. The JSON-RPC methods above are internal and reached only through the adapters, never called directly by the host model.
