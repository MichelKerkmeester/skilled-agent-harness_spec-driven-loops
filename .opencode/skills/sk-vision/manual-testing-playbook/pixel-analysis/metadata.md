---
title: "VSN-008 -- Metadata extraction"
description: "This scenario validates Metadata extraction for `VSN-008`. It focuses on format, dimensions, and EXIF summary."
version: 1.0.0.0
---

# VSN-008 -- Metadata extraction

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-008`.

---

## 1. OVERVIEW

This scenario validates Metadata extraction for `VSN-008`. It focuses on format, dimensions, and EXIF summary.

### Why This Matters

Metadata answers file-level questions (type, size, orientation) instantly without any model inference.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-008` and confirm the expected signals without contradictory evidence.

- Objective: format, dimensions, and EXIF brief of an image
- Real user request: `What format and size is this image?`
- Prompt: `Use sk_vision_metadata on this image and give me its format and size.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"metadata","format":"PNG","width":...,"height":...,...}}`
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if `result.type == "metadata"` and `format`, `width`, and `height` are present and match the file; FAIL if the fields are missing, wrong, or the request errors

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-008 | Metadata extraction | Verify format, dimensions, and EXIF summary | Use sk_vision_metadata on this image and give me its format and size. | 1. bash: printf '%s\n' \ -> 2.   '{"id":1,"method":"load","params":{}}' \ -> 3.   '{"id":2,"method":"metadata","params":{"source":{"type":"path","path":"<FIXTURE>"}}}' -> 4.   \| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py | Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"metadata","format":"PNG","width":...,"height":...,...}}` | The metadata response fields (format, dimensions, EXIF brief) with the transcript | PASS if `result.type == "metadata"` and `format`, `width`, and `height` are present and match the file; FAIL if the fields are missing, wrong, or the request errors | 1. Confirm the path points at an actual image file -> 2. Missing EXIF is expected - EXIF is optional per file -> 3. Inspect stderr for decode errors |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use sk_vision_metadata on this image and give me its format and size.`

### Commands

1. `bash: printf '%s\n' \`
2. `  '{"id":1,"method":"load","params":{}}' \`
3. `  '{"id":2,"method":"metadata","params":{"source":{"type":"path","path":"<FIXTURE>"}}}'`
4. `  | "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py`

### Expected

Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"metadata","format":"PNG","width":...,"height":...,...}}`

### Evidence

The metadata response fields (format, dimensions, EXIF brief) with the transcript

### Pass / Fail

- **Pass**: `result.type == "metadata"` and `format`, `width`, and `height` are present and match the file
- **Fail**: the fields are missing, wrong, or the request errors

### Failure Triage

1. Confirm the path points at an actual image file -> 2. Missing EXIF is expected - EXIF is optional per file -> 3. Inspect stderr for decode errors

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/pixel-analysis/metadata.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/python/runtime.py` | Handler: `handle_metadata` + `_exif_brief` |
| `pi/sk-vision.ts` | Pi tool registration for `sk_vision_metadata` |
| `vision-runtime/python/runtime.test.ts` | Analysis handler regression suite (metadata) |

---

## 5. SOURCE METADATA

- Group: Pixel analysis
- Playbook ID: VSN-008
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pixel-analysis/metadata.md`
