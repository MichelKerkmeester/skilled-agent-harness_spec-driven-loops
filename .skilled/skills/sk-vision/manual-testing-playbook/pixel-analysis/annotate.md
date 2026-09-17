---
title: "VSN-011 -- Annotation"
description: "This scenario validates Annotation for `VSN-011`. It focuses on boxes or points drawn onto an image."
version: 1.0.0.0
---

# VSN-011 -- Annotation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-011`.

---

## 1. OVERVIEW

This scenario validates Annotation for `VSN-011`. It focuses on boxes or points drawn onto an image.

### Why This Matters

Annotation produces shareable artifacts that highlight model findings on the original pixels.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-011` and confirm the expected signals without contradictory evidence.

- Objective: boxes or points drawn onto an image with an optional label
- Real user request: `Draw a box around the error text and label it.`
- Prompt: `Use sk_vision_annotate to draw a box around the error text with the label "error".`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"annotate","path":"<cache>/annotations/...","width":...,"height":...}}`
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if `result.type == "annotate"` and the output file exists; FAIL if the output file is missing or the request errors

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-011 | Annotation | Verify boxes or points drawn onto an image | Use sk_vision_annotate to draw a box around the error text with the label "error". | 1. bash: printf '%s\n' \ -> 2.   '{"id":1,"method":"load","params":{}}' \ -> 3.   '{"id":2,"method":"annotate","params":{"source":{"type":"path","path":"<FIXTURE>"},"boxes":[{"x1":0.05,"y1":0.1,"x2":0.95,"y2":0.5}],"label":"error"}}' -> 4.   \| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py | Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"annotate","path":"<cache>/annotations/...","width":...,"height":...}}` | The annotate response `path`; verify the output file exists and visually shows the box/label | PASS if `result.type == "annotate"` and the output file exists; FAIL if the output file is missing or the request errors | 1. Confirm `boxes`/`points` use normalized 0..1 values -> 2. Verify the cache dir `~/.cache/sk-vision/annotations` is writable -> 3. Inspect stderr for drawing errors |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use sk_vision_annotate to draw a box around the error text with the label "error".`

### Commands

1. `bash: printf '%s\n' \`
2. `  '{"id":1,"method":"load","params":{}}' \`
3. `  '{"id":2,"method":"annotate","params":{"source":{"type":"path","path":"<FIXTURE>"},"boxes":[{"x1":0.05,"y1":0.1,"x2":0.95,"y2":0.5}],"label":"error"}}'`
4. `  | "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py`

### Expected

Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"annotate","path":"<cache>/annotations/...","width":...,"height":...}}`

### Evidence

The annotate response `path`; verify the output file exists and visually shows the box/label

### Pass / Fail

- **Pass**: `result.type == "annotate"` and the output file exists
- **Fail**: the output file is missing or the request errors

### Failure Triage

1. Confirm `boxes`/`points` use normalized 0..1 values -> 2. Verify the cache dir `~/.cache/sk-vision/annotations` is writable -> 3. Inspect stderr for drawing errors

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/pixel-analysis/annotate.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/python/runtime.py` | Handler: `handle_annotate` |
| `pi/sk-vision.ts` | Pi tool registration for `sk_vision_annotate` |
| `vision-runtime/python/runtime.test.ts` | Analysis handler regression suite (annotate) |

---

## 5. SOURCE METADATA

- Group: Pixel analysis
- Playbook ID: VSN-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pixel-analysis/annotate.md`
