---
title: "VSN-009 -- Cropping"
description: "This scenario validates Cropping for `VSN-009`. It focuses on a cropped output file with reported dimensions."
version: 1.0.0.0
---

# VSN-009 -- Cropping

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-009`.

---

## 1. OVERVIEW

This scenario validates Cropping for `VSN-009`. It focuses on a cropped output file with reported dimensions.

### Why This Matters

Cropping isolates a region of interest so downstream inference focuses on the relevant pixels.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-009` and confirm the expected signals without contradictory evidence.

- Objective: a cropped output file with reported dimensions and pixel bbox
- Real user request: `Crop this image to its top-left half.`
- Prompt: `Use sk_vision_crop on the fixture, cropping to the top-left half.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"crop","path":"<cache>/crops/...","width":...,"height":...,"bbox_px":[...]}}`
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if `result.type == "crop"`, the output `path` exists on disk, and width/height equal half the fixture; FAIL if the output file is missing or the bbox is rejected as malformed

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-009 | Cropping | Verify a cropped output file with reported dimensions | Use sk_vision_crop on the fixture, cropping to the top-left half. | 1. bash: printf '%s\n' \ -> 2.   '{"id":1,"method":"load","params":{}}' \ -> 3.   '{"id":2,"method":"crop","params":{"source":{"type":"path","path":"<FIXTURE>"},"bbox":{"x1":0,"y1":0,"x2":0.5,"y2":0.5}}}' -> 4.   \| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py | Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"crop","path":"<cache>/crops/...","width":...,"height":...,"bbox_px":[...]}}` | The crop response `path`, `width`, `height`, and `bbox_px`; verify the output file exists | PASS if `result.type == "crop"`, the output `path` exists on disk, and width/height equal half the fixture; FAIL if the output file is missing or the bbox is rejected as malformed | 1. Confirm `bbox` uses normalized 0..1 values -> 2. Verify the cache dir `~/.cache/sk-vision/crops` is writable -> 3. Inspect stderr for Pillow save errors |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use sk_vision_crop on the fixture, cropping to the top-left half.`

### Commands

1. `bash: printf '%s\n' \`
2. `  '{"id":1,"method":"load","params":{}}' \`
3. `  '{"id":2,"method":"crop","params":{"source":{"type":"path","path":"<FIXTURE>"},"bbox":{"x1":0,"y1":0,"x2":0.5,"y2":0.5}}}'`
4. `  | "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py`

### Expected

Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"crop","path":"<cache>/crops/...","width":...,"height":...,"bbox_px":[...]}}`

### Evidence

The crop response `path`, `width`, `height`, and `bbox_px`; verify the output file exists

### Pass / Fail

- **Pass**: `result.type == "crop"`, the output `path` exists on disk, and width/height equal half the fixture
- **Fail**: the output file is missing or the bbox is rejected as malformed

### Failure Triage

1. Confirm `bbox` uses normalized 0..1 values -> 2. Verify the cache dir `~/.cache/sk-vision/crops` is writable -> 3. Inspect stderr for Pillow save errors

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/pixel-analysis/crop.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/python/runtime.py` | Handler: `handle_crop` + `_bbox_to_px` + `_output_path` |
| `pi/sk-vision.ts` | Pi tool registration for `sk_vision_crop` |
| `vision-runtime/python/runtime.test.ts` | Analysis handler regression suite (crop, bbox validation) |

---

## 5. SOURCE METADATA

- Group: Pixel analysis
- Playbook ID: VSN-009
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pixel-analysis/crop.md`
