---
title: "VSN-004 -- Pointing"
description: "This scenario validates Pointing for `VSN-004`. It focuses on normalized coordinates answering a spatial question."
version: 1.0.0.0
---

# VSN-004 -- Pointing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-004`.

---

## 1. OVERVIEW

This scenario validates Pointing for `VSN-004`. It focuses on normalized coordinates answering a spatial question.

### Why This Matters

Pointing turns qualitative questions into actionable coordinates an agent can feed to clicks or crops.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-004` and confirm the expected signals without contradictory evidence.

- Objective: normalized coordinates answering a spatial question about the image
- Real user request: `Where exactly is the title text in this image?`
- Prompt: `Use sk_vision_point on the screenshot and tell me where the title text is.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"point","points":[...]}}` with points carrying normalized x/y values
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if `result.points` is non-empty and each point has x/y in the 0..1 range; FAIL if `points` is empty, out-of-range, or the request errors

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-004 | Pointing | Verify normalized coordinates answering a spatial question | Use sk_vision_point on the screenshot and tell me where the title text is. | 1. bash: printf '%s\n' \ -> 2.   '{"id":1,"method":"load","params":{}}' \ -> 3.   '{"id":2,"method":"point","params":{"source":{"type":"path","path":"<FIXTURE>"},"question":"Where is the title text?"}}' -> 4.   \| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py | Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"point","points":[...]}}` with points carrying normalized x/y values | The `points` array (normalized x/y) plus the transcript line | PASS if `result.points` is non-empty and each point has x/y in the 0..1 range; FAIL if `points` is empty, out-of-range, or the request errors | 1. Rephrase the `question` - vague targets yield empty points -> 2. Confirm the fixture actually contains the requested feature -> 3. Check stderr for model task-support failures |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use sk_vision_point on the screenshot and tell me where the title text is.`

### Commands

1. `bash: printf '%s\n' \`
2. `  '{"id":1,"method":"load","params":{}}' \`
3. `  '{"id":2,"method":"point","params":{"source":{"type":"path","path":"<FIXTURE>"},"question":"Where is the title text?"}}'`
4. `  | "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py`

### Expected

Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"point","points":[...]}}` with points carrying normalized x/y values

### Evidence

The `points` array (normalized x/y) plus the transcript line

### Pass / Fail

- **Pass**: `result.points` is non-empty and each point has x/y in the 0..1 range
- **Fail**: `points` is empty, out-of-range, or the request errors

### Failure Triage

1. Rephrase the `question` - vague targets yield empty points -> 2. Confirm the fixture actually contains the requested feature -> 3. Check stderr for model task-support failures

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/scene-understanding/point.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/python/runtime.py` | Handler: `handle_point` + `_normalize_points` |
| `pi/sk-vision.ts` | Pi tool registration for `sk_vision_point` |
| `vision-runtime/python/runtime.test.ts` | Analysis handler regression suite |

---

## 5. SOURCE METADATA

- Group: Scene understanding
- Playbook ID: VSN-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `scene-understanding/point.md`
