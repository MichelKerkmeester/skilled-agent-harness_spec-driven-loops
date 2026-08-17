---
title: "VSN-003 -- Object detection"
description: "This scenario validates Object detection for `VSN-003`. It focuses on labeled bounding boxes for detected objects."
version: 1.0.0.0
---

# VSN-003 -- Object detection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-003`.

---

## 1. OVERVIEW

This scenario validates Object detection for `VSN-003`. It focuses on labeled bounding boxes for detected objects.

### Why This Matters

Detection grounds spatial reasoning: an agent can act on objects it can locate, such as buttons, fields, or dialogs.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-003` and confirm the expected signals without contradictory evidence.

- Objective: labeled bounding boxes for the objects in an image
- Real user request: `Find all the buttons in this mockup.`
- Prompt: `Use sk_vision_detect on this mockup and list every object you find.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"detect","objects":[...]}}` with at least one object carrying a label and normalized bbox
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if `result.objects` is a non-empty array whose entries have `label` and `bbox` fields; FAIL if `objects` is empty or the response is an error envelope

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-003 | Object detection | Verify labeled bounding boxes for detected objects | Use sk_vision_detect on this mockup and list every object you find. | 1. bash: printf '%s\n' \ -> 2.   '{"id":1,"method":"load","params":{}}' \ -> 3.   '{"id":2,"method":"detect","params":{"source":{"type":"path","path":"<FIXTURE>"}}}' -> 4.   \| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py | Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"detect","objects":[...]}}` with at least one object carrying a label and normalized bbox | The `objects` array from the detect response (labels + bboxes) saved with the transcript | PASS if `result.objects` is a non-empty array whose entries have `label` and `bbox` fields; FAIL if `objects` is empty or the response is an error envelope | 1. Confirm the fixture has a discernible object; regenerate with higher contrast -> 2. Re-run with a warm cache -> 3. Inspect stderr for model task-support errors |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use sk_vision_detect on this mockup and list every object you find.`

### Commands

1. `bash: printf '%s\n' \`
2. `  '{"id":1,"method":"load","params":{}}' \`
3. `  '{"id":2,"method":"detect","params":{"source":{"type":"path","path":"<FIXTURE>"}}}'`
4. `  | "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py`

### Expected

Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"detect","objects":[...]}}` with at least one object carrying a label and normalized bbox

### Evidence

The `objects` array from the detect response (labels + bboxes) saved with the transcript

### Pass / Fail

- **Pass**: `result.objects` is a non-empty array whose entries have `label` and `bbox` fields
- **Fail**: `objects` is empty or the response is an error envelope

### Failure Triage

1. Confirm the fixture has a discernible object; regenerate with higher contrast -> 2. Re-run with a warm cache -> 3. Inspect stderr for model task-support errors

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/scene-understanding/detect.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/python/runtime.py` | Handler: `handle_detect` + `_normalize_detect_objects` |
| `pi/sk-vision.ts` | Pi tool registration for `sk_vision_detect` |
| `vision-runtime/python/runtime.test.ts` | Analysis handler regression suite |

---

## 5. SOURCE METADATA

- Group: Scene understanding
- Playbook ID: VSN-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `scene-understanding/detect.md`
