---
title: "VSN-005 -- Segmentation"
description: "This scenario validates Segmentation for `VSN-005`. It focuses on a bbox or mask locating a named object."
version: 1.0.0.0
---

# VSN-005 -- Segmentation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-005`.

---

## 1. OVERVIEW

This scenario validates Segmentation for `VSN-005`. It focuses on a bbox or mask locating a named object.

### Why This Matters

Segmentation gives pixel-precise location for a target class, stronger than detection for region-of-interest work.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-005` and confirm the expected signals without contradictory evidence.

- Objective: a bbox or mask path locating a named object in the image
- Real user request: `Find the text block in this image.`
- Prompt: `Use sk_vision_segment to find the text block in this image.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"segment","bbox":...,"path":...}}` with a bbox and/or mask path
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if `result.type == "segment"` and the result carries `bbox` and/or `path`; FAIL if the response is an error envelope (including task-not-supported) or empty

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-005 | Segmentation | Verify a bbox or mask locating a named object | Use sk_vision_segment to find the text block in this image. | 1. bash: printf '%s\n' \ -> 2.   '{"id":1,"method":"load","params":{}}' \ -> 3.   '{"id":2,"method":"segment","params":{"source":{"type":"path","path":"<FIXTURE>"},"target":"text"}}' -> 4.   \| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py | Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"segment","bbox":...,"path":...}}` with a bbox and/or mask path | The segment response (bbox + optional mask path) with the transcript | PASS if `result.type == "segment"` and the result carries `bbox` and/or `path`; FAIL if the response is an error envelope (including task-not-supported) or empty | 1. If `task 'segment' is not supported` appears, check `capabilities` in VSN-012 -> 2. Confirm the `target` names an object the model knows -> 3. Inspect stderr for the underlying exception |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use sk_vision_segment to find the text block in this image.`

### Commands

1. `bash: printf '%s\n' \`
2. `  '{"id":1,"method":"load","params":{}}' \`
3. `  '{"id":2,"method":"segment","params":{"source":{"type":"path","path":"<FIXTURE>"},"target":"text"}}'`
4. `  | "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py`

### Expected

Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"segment","bbox":...,"path":...}}` with a bbox and/or mask path

### Evidence

The segment response (bbox + optional mask path) with the transcript

### Pass / Fail

- **Pass**: `result.type == "segment"` and the result carries `bbox` and/or `path`
- **Fail**: the response is an error envelope (including task-not-supported) or empty

### Failure Triage

1. If `task 'segment' is not supported` appears, check `capabilities` in VSN-012 -> 2. Confirm the `target` names an object the model knows -> 3. Inspect stderr for the underlying exception

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/scene-understanding/segment.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/python/runtime.py` | Handler: `handle_segment` + `_require_task` |
| `pi/sk-vision.ts` | Pi tool registration for `sk_vision_segment` |
| `vision-runtime/python/runtime.test.ts` | Analysis handler regression suite |

---

## 5. SOURCE METADATA

- Group: Scene understanding
- Playbook ID: VSN-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `scene-understanding/segment.md`
