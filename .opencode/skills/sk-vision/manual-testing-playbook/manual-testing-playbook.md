---
title: "sk-vision: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the sk-vision skill."
trigger_phrases:
  - "sk-vision manual testing playbook"
  - "sk-vision operator scenarios"
  - "sk-vision release validation"
importance_tier: "important"
contextType: "general"
version: 1.0.0.0
---

# sk-vision: Manual Testing Playbook

This document combines the full manual-validation contract for the `sk-vision` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded, and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for the `sk-vision` skill. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail lives in the category folders at the playbook root.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `scene-understanding/`
- `pixel-analysis/`
- `system-health/`
- `host-adapters/`
- `runtime-core/`

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into `<skill>/benchmark/reports/<dated-run-label>/`; generated report Markdown is renderer-owned and never hand-authored.

---

## 1. OVERVIEW

This playbook provides a derived census of deterministic scenarios across categories validating the `sk-vision` skill surface. The operator validator computes those counts from the walked tree; do not hand-maintain them. Each feature keeps its original ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-08-16): 16 operator scenarios across 5 categories cover the 13 shipped `sk_vision_*` tools, the two host adapters (OpenCode plugin and Pi extension), and the JSON-RPC runtime lifecycle. Every scenario is executable against the local fork with the default `moondream2` model; nothing requires a network connection after the first model load.

### Realistic Test Model

1. A realistic user request is given to an orchestrator.
2. The orchestrator decides whether to work locally, delegate to sub-agents, or invoke another CLI/runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome
- The implementation or regression-test anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`).
2. Hardware: Apple Silicon (M-series, MPS backend) or an NVIDIA GPU (Ampere or newer). 6 GB VRAM is enough for the default `moondream2`.
3. Model cache: the first model load downloads ~3.9 GB of weights into the Hugging Face cache and provisions a Python venv under `~/.cache/sk-vision/venv`. Warm the cache once (`{"id":1,"method":"load","params":{}}`) before any image scenario.
4. Interpreter: the provisioned venv `$HOME/.cache/sk-vision/venv/bin/python` (Python 3.12 with Pillow + torch). The runtime resolves it automatically when spawned through the host adapters; direct NDJSON commands in this playbook call it explicitly.
5. Fixture image: the image scenarios reference `<FIXTURE>` — any local PNG with visible text (e.g. a screenshot of an error dialog or a mockup). The reference fixture used by this phase's live runs is `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/009-manual-testing-playbook/scratch/fixture.png`, generated deterministically:

```bash
printf '%s\n' \
'from PIL import Image, ImageDraw' \
'img = Image.new("RGB", (480, 140), "white")' \
'd = ImageDraw.Draw(img)' \
'd.rectangle([8, 8, 472, 132], outline="black", width=3)' \
'd.text((24, 52), "ERROR: 42", fill="black")' \
'img.save("<FIXTURE>")' \
| "$HOME/.cache/sk-vision/venv/bin/python" -
```

6. Host adapters present: `.opencode/plugins/sk-vision.js` (OpenCode) and `.pi/extensions/sk-vision.ts` (Pi) exist and load; the 13 tool names are `sk_vision_inspect`, `sk_vision_detect`, `sk_vision_point`, `sk_vision_ocr`, `sk_vision_status`, `sk_vision_segment`, `sk_vision_metadata`, `sk_vision_crop`, `sk_vision_zoom`, `sk_vision_colors`, `sk_vision_diff`, `sk_vision_annotate`, `sk_vision_reverse`.
7. Destructive scenarios: none in this playbook; no scenario deletes cache or model state permanently. `unload` (VSN-016) frees GPU memory only and is immediately reversible via `load`.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript (the exact commands run, with exit codes)
- User request used
- Orchestrator or agent-facing prompt used
- Delegation or runtime-routing notes when applicable
- Output snippets (the JSON-RPC response lines for the executed methods)
- Final user-facing response or outcome summary
- Artifact path or output reference (output files written under `~/.cache/sk-vision/{crops,zooms,annotations}`)
- Scenario verdict with rationale (`PASS`, `FAIL`, or `SKIP` with a named blocker)

Evidence is persisted through `run-manual-playbook-scenario.cjs` into `<skill>/benchmark/reports/<dated-run-label>/`. Every `PASS` requires at least one verified durable evidence artifact with a repo-relative path, byte count, and SHA-256.

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands shown as `bash: <command>`.
- NDJSON JSON-RPC requests shown as single-quoted JSON lines piped into `vision-runtime/python/runtime.py`.
- MCP tool calls shown as `sk_vision_<name>({ key: value })`.
- Agent prompts shown as `agent: <instruction>`.
- `->` separates sequential steps.
- `<FIXTURE>` means the fixture PNG from Global Preconditions; `<FIXTURE_B>` means a second, visually distinct PNG (used only by the diff scenario).

Canonical request shape:

```bash
printf '%s\n' \
'{"id":1,"method":"load","params":{}}' \
'{"id":2,"method":"<method>","params":{...}}' \
| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py
```

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. Referenced per-feature files under `manual-testing-playbook/<category>/`
3. Scenario execution evidence
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `FAIL`: expected behavior missing, contradictory output, or a critical check failed
- `SKIP`: a specific sandbox or runtime blocker prevents execution (the blocker must be named)

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `FAIL`: any mapped scenario is `FAIL`
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker

Hard rule:
- Any critical-path scenario `FAIL` forces feature verdict to `FAIL`.

### Release Readiness Rule

Release is releasable only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES`).
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start (run VSN-012 `status` first — it needs no image).
2. Reserve one coordinator.
3. Saturate remaining worker slots.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run destructive scenarios in a dedicated sandbox-only wave (none currently).
6. After each wave, save context and evidence, then begin the next wave.
7. Record utilization table, per-feature file references, and evidence paths in the final report.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field following the natural-human voice contract (the actor is a human user or a coding agent, never an orchestrator delegating to another tool)
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints

---

## 7. SCENE UNDERSTANDING (`VSN-001..VSN-005`)

### VSN-001 | Image inspection

#### Description
Verify `sk_vision_inspect` returns a caption, scene structure, and OCR text for one image.

#### Scenario Contract
Prompt: `Inspect this screenshot and tell me what is on screen.`

Combines caption + scene + OCR over the NDJSON runtime in a single pipeline; the model must stay warm between requests.

Desired user-visible outcome: a short plain-language description of the image contents plus any visible text.

#### Test Execution
> **Feature File:** [VSN-001](scene-understanding/inspect.md)
> **Catalog:** [inspect](../feature-catalog/scene-understanding/inspect.md)

### VSN-002 | Optical character recognition

#### Description
Verify `sk_vision_ocr` transcribes visible text exactly.

#### Scenario Contract
Prompt: `Use sk_vision_ocr on the fixture image and report the exact text.`

Single OCR request on `<FIXTURE>`; the visible word must appear verbatim in the result.

Desired user-visible outcome: the exact visible text, preserving the word and its positions as much as possible.

#### Test Execution
> **Feature File:** [VSN-002](scene-understanding/ocr.md)
> **Catalog:** [ocr](../feature-catalog/scene-understanding/ocr.md)

### VSN-003 | Object detection

#### Description
Verify `sk_vision_detect` returns labeled bounding boxes for objects in an image.

#### Scenario Contract
Prompt: `Use sk_vision_detect on this mockup and list every object you find.`

Single detect request; the result must include a non-empty `objects` array with labels and normalized bounding boxes.

Desired user-visible outcome: a list of detected objects with their locations.

#### Test Execution
> **Feature File:** [VSN-003](scene-understanding/detect.md)
> **Catalog:** [detect](../feature-catalog/scene-understanding/detect.md)

### VSN-004 | Pointing

#### Description
Verify `sk_vision_point` answers a spatial question with normalized coordinates.

#### Scenario Contract
Prompt: `Use sk_vision_point on the screenshot and tell me where the title text is.`

Single point request with a natural-language question; the result must include `points` with normalized x/y coordinates.

Desired user-visible outcome: a location answer the user can act on.

#### Test Execution
> **Feature File:** [VSN-004](scene-understanding/point.md)
> **Catalog:** [point](../feature-catalog/scene-understanding/point.md)

### VSN-005 | Segmentation

#### Description
Verify `sk_vision_segment` locates a named object as a bbox or mask path.

#### Scenario Contract
Prompt: `Use sk_vision_segment to find the text block in this image.`

Single segment request with a `target`; the result must be `type: segment` and carry a bbox and/or output path.

Desired user-visible outcome: the location of the requested object.

#### Test Execution
> **Feature File:** [VSN-005](scene-understanding/segment.md)
> **Catalog:** [segment](../feature-catalog/scene-understanding/segment.md)

---

## 8. PIXEL ANALYSIS (`VSN-006..VSN-011`)

### VSN-006 | Color analysis

#### Description
Verify `sk_vision_colors` returns a dominant palette and average RGB.

#### Scenario Contract
Prompt: `Use sk_vision_colors on the fixture and summarize the color palette.`

Single colors request; the result must include `palette`, `buckets`, and `avg_rgb`.

Desired user-visible outcome: a readable palette summary.

#### Test Execution
> **Feature File:** [VSN-006](pixel-analysis/colors.md)
> **Catalog:** [colors](../feature-catalog/pixel-analysis/colors.md)

### VSN-007 | Image diffing

#### Description
Verify `sk_vision_diff` describes visual differences between two images.

#### Scenario Contract
Prompt: `Use sk_vision_diff to compare the fixture with fixture B and tell me what changed.`

Two images (`<FIXTURE>` vs `<FIXTURE_B>`); the result must be `type: diff` and describe the differences.

Desired user-visible outcome: a human-readable change description.

#### Test Execution
> **Feature File:** [VSN-007](pixel-analysis/diff.md)
> **Catalog:** [diff](../feature-catalog/pixel-analysis/diff.md)

### VSN-008 | Metadata extraction

#### Description
Verify `sk_vision_metadata` returns format, dimensions, and EXIF brief.

#### Scenario Contract
Prompt: `Use sk_vision_metadata on this image and give me its format and size.`

Single metadata request; the result must be `type: metadata` and carry format/size fields.

Desired user-visible outcome: the image format, dimensions, and any EXIF summary.

#### Test Execution
> **Feature File:** [VSN-008](pixel-analysis/metadata.md)
> **Catalog:** [metadata](../feature-catalog/pixel-analysis/metadata.md)

### VSN-009 | Cropping

#### Description
Verify `sk_vision_crop` writes a cropped image to the cache and reports its dimensions.

#### Scenario Contract
Prompt: `Use sk_vision_crop on the fixture, cropping to the top-left half.`

Single crop request with a normalized bbox; the result must be `type: crop` with an output `path`, `width`, `height`, and `bbox_px`.

Desired user-visible outcome: a usable cropped file path plus dimensions.

#### Test Execution
> **Feature File:** [VSN-009](pixel-analysis/crop.md)
> **Catalog:** [crop](../feature-catalog/pixel-analysis/crop.md)

### VSN-010 | Zooming

#### Description
Verify `sk_vision_zoom` upscales an image (or region) to a requested scale.

#### Scenario Contract
Prompt: `Use sk_vision_zoom on the fixture at 2x and show me the result.`

Single zoom request with `scale: 2`; the result must be `type: zoom` with an output `path` and the applied scale.

Desired user-visible outcome: a high-resolution output file path.

#### Test Execution
> **Feature File:** [VSN-010](pixel-analysis/zoom.md)
> **Catalog:** [zoom](../feature-catalog/pixel-analysis/zoom.md)

### VSN-011 | Annotation

#### Description
Verify `sk_vision_annotate` draws boxes/points on an image and writes the result.

#### Scenario Contract
Prompt: `Use sk_vision_annotate to draw a box around the error text with the label "error".`

Single annotate request with boxes/label; the result must be `type: annotate` with an output `path`.

Desired user-visible outcome: an annotated image file path.

#### Test Execution
> **Feature File:** [VSN-011](pixel-analysis/annotate.md)
> **Catalog:** [annotate](../feature-catalog/pixel-analysis/annotate.md)

---

## 9. SYSTEM HEALTH (`VSN-012..VSN-013`)

### VSN-012 | Runtime status

#### Description
Verify `sk_vision_status` reports model load state, device, and capabilities.

#### Scenario Contract
Prompt: `Check whether the vision runtime is loaded and what device it is using.`

Load + status pipeline; the result must report `model_loaded: true`, a device (`mps` or `cuda`), and a non-empty `capabilities` list.

Desired user-visible outcome: a clear health readout.

#### Test Execution
> **Feature File:** [VSN-012](system-health/status.md)
> **Catalog:** [status](../feature-catalog/system-health/status.md)

### VSN-013 | Reverse image search

#### Description
Verify `sk_vision_reverse` runs a local perceptual-hash search over a directory.

#### Scenario Contract
Prompt: `Use sk_vision_reverse on the fixture and search the scratch folder for similar images.`

Local hash search request with `dir` and `limit`; the result must be `type: hash_search` with `scanned >= 1` (matches may be empty for an empty directory).

Desired user-visible outcome: a list of visually similar local images, or an explicit no-match result.

#### Test Execution
> **Feature File:** [VSN-013](system-health/reverse.md)
> **Catalog:** [reverse](../feature-catalog/system-health/reverse.md)

---

## 10. HOST ADAPTERS (`VSN-014..VSN-015`)

### VSN-014 | OpenCode plugin

#### Description
Verify the OpenCode plugin load path re-exports the built runtime and registers the 13 tools.

#### Scenario Contract
Prompt: `Make sure sk-vision is loaded as an OpenCode plugin and list its tools.`

File-level checks: the plugin file is a regular file, it re-exports `dist/plugin.js`, the built bundle exists, and all 13 tool names appear in the bundle.

Desired user-visible outcome: the 13 `sk_vision_*` tools available in an OpenCode session.

#### Test Execution
> **Feature File:** [VSN-014](host-adapters/opencode-plugin.md)
> **Catalog:** [opencode-plugin](../feature-catalog/host-adapters/opencode-plugin.md)

### VSN-015 | Pi extension

#### Description
Verify the Pi extension symlink resolves to the owned factory and registers the 13 tools.

#### Scenario Contract
Prompt: `Make sure sk-vision is loaded as a Pi extension and list its tools.`

File-level checks: the extension symlink resolves inside the skill tree, the factory registers 13 tools, and a `pi --offline --approve` session starts with the extension loaded.

Desired user-visible outcome: the 13 `sk_vision_*` tools available in a Pi session.

#### Test Execution
> **Feature File:** [VSN-015](host-adapters/pi-extension.md)
> **Catalog:** [pi-extension](../feature-catalog/host-adapters/pi-extension.md)

---

## 11. RUNTIME CORE (`VSN-016`)

### VSN-016 | Runtime lifecycle

#### Description
Verify the model lifecycle: load, warm status, unload, and released status.

#### Scenario Contract
Prompt: `Load the vision model, check status, then unload it and confirm it is released.`

Four NDJSON requests in one pipeline; `model_loaded` must flip `true` after `load` and `false` after `unload`.

Desired user-visible outcome: the GPU is claimed and released on demand.

#### Test Execution
> **Feature File:** [VSN-016](runtime-core/runtime-lifecycle.md)
> **Catalog:** [json-rpc-runtime](../feature-catalog/runtime-core/json-rpc-runtime.md)

---

## 12. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `vision-runtime/python/runtime.test.ts` | NDJSON analysis handlers: metadata, crop, colors, diff, annotate, hash_search, zoom; bbox validation; missing-file `INVALID_INPUT` | VSN-002, VSN-006, VSN-007, VSN-008, VSN-009, VSN-010, VSN-011, VSN-013 |
| `vision-runtime/src/providers/photon.test.ts` | Content-type mapping, URL-extension fallback, normalized bbox parsing | VSN-014, VSN-009 |

The automated suite runs with `bun test` inside `vision-runtime/` (8 tests, 27 expect calls). It proves handler-level behavior with synthetic PNGs but does not load the model; the playbook scenarios add real-model integration coverage.

---

## 13. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| VSN-001 | Image inspection | Scene understanding | [VSN-001](scene-understanding/inspect.md) |
| VSN-002 | Optical character recognition | Scene understanding | [VSN-002](scene-understanding/ocr.md) |
| VSN-003 | Object detection | Scene understanding | [VSN-003](scene-understanding/detect.md) |
| VSN-004 | Pointing | Scene understanding | [VSN-004](scene-understanding/point.md) |
| VSN-005 | Segmentation | Scene understanding | [VSN-005](scene-understanding/segment.md) |
| VSN-006 | Color analysis | Pixel analysis | [VSN-006](pixel-analysis/colors.md) |
| VSN-007 | Image diffing | Pixel analysis | [VSN-007](pixel-analysis/diff.md) |
| VSN-008 | Metadata extraction | Pixel analysis | [VSN-008](pixel-analysis/metadata.md) |
| VSN-009 | Cropping | Pixel analysis | [VSN-009](pixel-analysis/crop.md) |
| VSN-010 | Zooming | Pixel analysis | [VSN-010](pixel-analysis/zoom.md) |
| VSN-011 | Annotation | Pixel analysis | [VSN-011](pixel-analysis/annotate.md) |
| VSN-012 | Runtime status | System health | [VSN-012](system-health/status.md) |
| VSN-013 | Reverse image search | System health | [VSN-013](system-health/reverse.md) |
| VSN-014 | OpenCode plugin | Host adapters | [VSN-014](host-adapters/opencode-plugin.md) |
| VSN-015 | Pi extension | Host adapters | [VSN-015](host-adapters/pi-extension.md) |
| VSN-016 | Runtime lifecycle | Runtime core | [VSN-016](runtime-core/runtime-lifecycle.md) |
