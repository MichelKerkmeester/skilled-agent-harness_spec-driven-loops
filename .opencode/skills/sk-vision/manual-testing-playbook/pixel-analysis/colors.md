---
title: "VSN-006 -- Color analysis"
description: "This scenario validates Color analysis for `VSN-006`. It focuses on a dominant palette and average RGB."
version: 1.0.0.0
---

# VSN-006 -- Color analysis

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-006`.

---

## 1. OVERVIEW

This scenario validates Color analysis for `VSN-006`. It focuses on a dominant palette and average RGB.

### Why This Matters

Color analysis answers design and theme questions without any language understanding.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-006` and confirm the expected signals without contradictory evidence.

- Objective: the dominant color palette and average RGB of an image
- Real user request: `What colors dominate this design?`
- Prompt: `Use sk_vision_colors on the fixture and summarize the color palette.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"colors","palette":[...],"buckets":...,"avg_rgb":...}}`
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if `result.type == "colors"` and `palette` is a non-empty array with `avg_rgb` present; FAIL if `palette` is empty or the request errors

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-006 | Color analysis | Verify a dominant palette and average RGB | Use sk_vision_colors on the fixture and summarize the color palette. | 1. bash: printf '%s\n' \ -> 2.   '{"id":1,"method":"load","params":{}}' \ -> 3.   '{"id":2,"method":"colors","params":{"source":{"type":"path","path":"<FIXTURE>"}}}' -> 4.   \| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py | Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"colors","palette":[...],"buckets":...,"avg_rgb":...}}` | The `palette`, `buckets`, and `avg_rgb` fields with the transcript | PASS if `result.type == "colors"` and `palette` is a non-empty array with `avg_rgb` present; FAIL if `palette` is empty or the request errors | 1. Confirm the fixture has non-trivial colors -> 2. Check `regions_analyzed` - a region parameter restricts the analysis -> 3. Inspect stderr for decode errors |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use sk_vision_colors on the fixture and summarize the color palette.`

### Commands

1. `bash: printf '%s\n' \`
2. `  '{"id":1,"method":"load","params":{}}' \`
3. `  '{"id":2,"method":"colors","params":{"source":{"type":"path","path":"<FIXTURE>"}}}'`
4. `  | "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py`

### Expected

Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"colors","palette":[...],"buckets":...,"avg_rgb":...}}`

### Evidence

The `palette`, `buckets`, and `avg_rgb` fields with the transcript

### Pass / Fail

- **Pass**: `result.type == "colors"` and `palette` is a non-empty array with `avg_rgb` present
- **Fail**: `palette` is empty or the request errors

### Failure Triage

1. Confirm the fixture has non-trivial colors -> 2. Check `regions_analyzed` - a region parameter restricts the analysis -> 3. Inspect stderr for decode errors

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/pixel-analysis/colors.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/python/runtime.py` | Handler: `handle_colors` |
| `pi/sk-vision.ts` | Pi tool registration for `sk_vision_colors` |
| `vision-runtime/python/runtime.test.ts` | Analysis handler regression suite (colors) |

---

## 5. SOURCE METADATA

- Group: Pixel analysis
- Playbook ID: VSN-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pixel-analysis/colors.md`
