---
title: "VSN-010 -- Zooming"
description: "This scenario validates Zooming for `VSN-010`. It focuses on an upscaled output file at the requested scale."
version: 1.0.0.0
---

# VSN-010 -- Zooming

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-010`.

---

## 1. OVERVIEW

This scenario validates Zooming for `VSN-010`. It focuses on an upscaled output file at the requested scale.

### Why This Matters

Zoom upscales small regions (or whole images) so detail is legible for a follow-up OCR or inspection pass.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-010` and confirm the expected signals without contradictory evidence.

- Objective: an upscaled output file at the requested scale
- Real user request: `Zoom into this image 2x so I can read the small text.`
- Prompt: `Use sk_vision_zoom on the fixture at 2x and show me the result.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"zoom","path":"<cache>/zooms/...","scale":2,...}}`
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if `result.type == "zoom"`, `scale == 2`, and the output file exists with doubled dimensions; FAIL if the output file is missing, dimensions are wrong, or the request errors

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-010 | Zooming | Verify an upscaled output file at the requested scale | Use sk_vision_zoom on the fixture at 2x and show me the result. | 1. bash: printf '%s\n' \ -> 2.   '{"id":1,"method":"load","params":{}}' \ -> 3.   '{"id":2,"method":"zoom","params":{"source":{"type":"path","path":"<FIXTURE>"},"scale":2}}' -> 4.   \| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py | Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"zoom","path":"<cache>/zooms/...","scale":2,...}}` | The zoom response `path` and `scale`; verify the output file exists and is ~2x the fixture dimensions | PASS if `result.type == "zoom"`, `scale == 2`, and the output file exists with doubled dimensions; FAIL if the output file is missing, dimensions are wrong, or the request errors | 1. Confirm `scale` is within 1..8 (values outside are clamped) -> 2. For a `region`, use normalized 0..1 bbox values -> 3. Inspect stderr for Pillow resize/save errors |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use sk_vision_zoom on the fixture at 2x and show me the result.`

### Commands

1. `bash: printf '%s\n' \`
2. `  '{"id":1,"method":"load","params":{}}' \`
3. `  '{"id":2,"method":"zoom","params":{"source":{"type":"path","path":"<FIXTURE>"},"scale":2}}'`
4. `  | "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py`

### Expected

Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"zoom","path":"<cache>/zooms/...","scale":2,...}}`

### Evidence

The zoom response `path` and `scale`; verify the output file exists and is ~2x the fixture dimensions

### Pass / Fail

- **Pass**: `result.type == "zoom"`, `scale == 2`, and the output file exists with doubled dimensions
- **Fail**: the output file is missing, dimensions are wrong, or the request errors

### Failure Triage

1. Confirm `scale` is within 1..8 (values outside are clamped) -> 2. For a `region`, use normalized 0..1 bbox values -> 3. Inspect stderr for Pillow resize/save errors

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/pixel-analysis/zoom.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/python/runtime.py` | Handler: `handle_zoom` (LANCZOS upscale) |
| `pi/sk-vision.ts` | Pi tool registration for `sk_vision_zoom` |
| `vision-runtime/python/runtime.test.ts` | Analysis handler regression suite (zoom) |

---

## 5. SOURCE METADATA

- Group: Pixel analysis
- Playbook ID: VSN-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pixel-analysis/zoom.md`
