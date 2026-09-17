---
title: "VSN-007 -- Image diffing"
description: "This scenario validates Image diffing for `VSN-007`. It focuses on a description of visual differences between two images."
version: 1.0.0.0
---

# VSN-007 -- Image diffing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-007`.

---

## 1. OVERVIEW

This scenario validates Image diffing for `VSN-007`. It focuses on a description of visual differences between two images.

### Why This Matters

Diffing lets an agent compare a screenshot before and after a change or two mockup variants and report what moved.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-007` and confirm the expected signals without contradictory evidence.

- Objective: a description of the visual differences between two images
- Real user request: `Compare these two screenshots and tell me what changed.`
- Prompt: `Use sk_vision_diff to compare the fixture with fixture B and tell me what changed.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"diff",...}}` describing the differences when `describe` is true
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if `result.type == "diff"` and the result is non-empty (changes listed or described); FAIL if the response is empty or an error envelope (e.g. missing `otherPath`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-007 | Image diffing | Verify a description of visual differences between two images | Use sk_vision_diff to compare the fixture with fixture B and tell me what changed. | 1. bash: printf '%s\n' \ -> 2.   '{"id":1,"method":"load","params":{}}' \ -> 3.   '{"id":2,"method":"diff","params":{"source":{"type":"path","path":"<FIXTURE>"},"otherPath":"<FIXTURE_B>","describe":true}}' -> 4.   \| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py | Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"diff",...}}` describing the differences when `describe` is true | The diff response plus both input file paths, saved with the transcript | PASS if `result.type == "diff"` and the result is non-empty (changes listed or described); FAIL if the response is empty or an error envelope (e.g. missing `otherPath`) | 1. Confirm `<FIXTURE_B>` exists and differs from `<FIXTURE>` -> 2. If `otherPath` fails, pass a base64 data URL via `otherImage` -> 3. Inspect stderr for the underlying exception |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use sk_vision_diff to compare the fixture with fixture B and tell me what changed.`

### Commands

1. `bash: printf '%s\n' \`
2. `  '{"id":1,"method":"load","params":{}}' \`
3. `  '{"id":2,"method":"diff","params":{"source":{"type":"path","path":"<FIXTURE>"},"otherPath":"<FIXTURE_B>","describe":true}}'`
4. `  | "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py`

### Expected

Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"diff",...}}` describing the differences when `describe` is true

### Evidence

The diff response plus both input file paths, saved with the transcript

### Pass / Fail

- **Pass**: `result.type == "diff"` and the result is non-empty (changes listed or described)
- **Fail**: the response is empty or an error envelope (e.g. missing `otherPath`)

### Failure Triage

1. Confirm `<FIXTURE_B>` exists and differs from `<FIXTURE>` -> 2. If `otherPath` fails, pass a base64 data URL via `otherImage` -> 3. Inspect stderr for the underlying exception

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/pixel-analysis/diff.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/python/runtime.py` | Handler: `handle_diff` |
| `pi/sk-vision.ts` | Pi tool registration for `sk_vision_diff` |
| `vision-runtime/python/runtime.test.ts` | Analysis handler regression suite (diff) |

---

## 5. SOURCE METADATA

- Group: Pixel analysis
- Playbook ID: VSN-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pixel-analysis/diff.md`
