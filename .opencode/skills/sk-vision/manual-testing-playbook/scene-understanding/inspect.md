---
title: "VSN-001 -- Image inspection"
description: "This scenario validates Image inspection for `VSN-001`. It focuses on a combined caption, scene, and OCR readout for one image."
version: 1.0.0.0
---

# VSN-001 -- Image inspection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-001`.

---

## 1. OVERVIEW

This scenario validates Image inspection for `VSN-001`. It focuses on a combined caption, scene, and OCR readout for one image.

### Why This Matters

Inspection is the primary entry point: a text-only model needs a grounded description of a screenshot before it can reason about it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-001` and confirm the expected signals without contradictory evidence.

- Objective: the combined caption, scene structure, and OCR text for one image
- Real user request: `Look at this screenshot and tell me what is on screen.`
- Prompt: `Inspect this screenshot and tell me what is on screen.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: `{"id":1,"result":{"loaded":true}}` - model loads warm; Steps 2-4: three result lines with `result.type` values `caption`, `scene`, `ocr`, each carrying a text or structured field
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if the transcript contains `caption`, `scene`, and `ocr` results with non-empty text; FAIL if any request returns an `error` envelope or an empty result

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-001 | Image inspection | Verify a combined caption, scene, and OCR readout for one image | Inspect this screenshot and tell me what is on screen. | 1. bash: printf '%s\n' \ -> 2.   '{"id":1,"method":"load","params":{}}' \ -> 3.   '{"id":2,"method":"caption","params":{"source":{"type":"path","path":"<FIXTURE>"}}}' \ -> 4.   '{"id":3,"method":"scene","params":{"source":{"type":"path","path":"<FIXTURE>"}}}' \ -> 5.   '{"id":4,"method":"ocr","params":{"source":{"type":"path","path":"<FIXTURE>"},"kind":"all"}}' -> 6.   \| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py | Step 1: `{"id":1,"result":{"loaded":true}}` - model loads warm; Steps 2-4: three result lines with `result.type` values `caption`, `scene`, `ocr`, each carrying a text or structured field | The full NDJSON transcript (4 response lines) saved to the run evidence folder; note `_ms` latency per request | PASS if the transcript contains `caption`, `scene`, and `ocr` results with non-empty text; FAIL if any request returns an `error` envelope or an empty result | 1. Check stderr for a Python/torch traceback; re-run with the venv python explicitly -> 2. Verify the cache is warm: run VSN-012 first -> 3. Confirm `<FIXTURE>` resolves to an existing PNG |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Inspect this screenshot and tell me what is on screen.`

### Commands

1. `bash: printf '%s\n' \`
2. `  '{"id":1,"method":"load","params":{}}' \`
3. `  '{"id":2,"method":"caption","params":{"source":{"type":"path","path":"<FIXTURE>"}}}' \`
4. `  '{"id":3,"method":"scene","params":{"source":{"type":"path","path":"<FIXTURE>"}}}' \`
5. `  '{"id":4,"method":"ocr","params":{"source":{"type":"path","path":"<FIXTURE>"},"kind":"all"}}'`
6. `  | "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py`

### Expected

Step 1: `{"id":1,"result":{"loaded":true}}` - model loads warm; Steps 2-4: three result lines with `result.type` values `caption`, `scene`, `ocr`, each carrying a text or structured field

### Evidence

The full NDJSON transcript (4 response lines) saved to the run evidence folder; note `_ms` latency per request

### Pass / Fail

- **Pass**: the transcript contains `caption`, `scene`, and `ocr` results with non-empty text
- **Fail**: any request returns an `error` envelope or an empty result

### Failure Triage

1. Check stderr for a Python/torch traceback; re-run with the venv python explicitly -> 2. Verify the cache is warm: run VSN-012 first -> 3. Confirm `<FIXTURE>` resolves to an existing PNG

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/scene-understanding/inspect.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/python/runtime.py` | Handlers: `handle_caption`, `handle_scene`, `handle_ocr` |
| `pi/sk-vision.ts` | Pi tool registration for `sk_vision_inspect` |
| `vision-runtime/src/opencode/attachments.ts` | OpenCode paste-time preload path |
| `vision-runtime/python/runtime.test.ts` | Analysis handler regression suite (no model load) |

---

## 5. SOURCE METADATA

- Group: Scene understanding
- Playbook ID: VSN-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `scene-understanding/inspect.md`
