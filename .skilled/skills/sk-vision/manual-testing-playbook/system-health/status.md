---
title: "VSN-012 -- Runtime status"
description: "This scenario validates Runtime status for `VSN-012`. It focuses on model load state, device, and capabilities."
version: 1.0.0.0
---

# VSN-012 -- Runtime status

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-012`.

---

## 1. OVERVIEW

This scenario validates Runtime status for `VSN-012`. It focuses on model load state, device, and capabilities.

### Why This Matters

Status is the health probe: it tells an operator whether the model is warm, on which device, and what tasks it supports.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-012` and confirm the expected signals without contradictory evidence.

- Objective: model load state, device, and capabilities of the runtime
- Real user request: `Is the vision model loaded and what device is it on?`
- Prompt: `Check whether the vision runtime is loaded and what device it is using.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: load returns `{"result":{"loaded":true}}`; Step 2: status reports `model_loaded: true`, a `device` of `mps` or `cuda`, and non-empty `capabilities`
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if `result.model_loaded` is `true` and `device` is `mps` or `cuda` with non-empty `capabilities`; FAIL if `model_loaded` stays false after load, or the response is an error envelope

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-012 | Runtime status | Verify model load state, device, and capabilities | Check whether the vision runtime is loaded and what device it is using. | 1. bash: printf '%s\n' \ -> 2.   '{"id":1,"method":"load","params":{}}' \ -> 3.   '{"id":2,"method":"load","params":{}}' \ -> 4.   '{"id":3,"method":"status","params":{}}' -> 5.   \| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py | Step 1: load returns `{"result":{"loaded":true}}`; Step 2: status reports `model_loaded: true`, a `device` of `mps` or `cuda`, and non-empty `capabilities` | The status response (device, capabilities, request_count, uptime_s) with the transcript | PASS if `result.model_loaded` is `true` and `device` is `mps` or `cuda` with non-empty `capabilities`; FAIL if `model_loaded` stays false after load, or the response is an error envelope | 1. Status alone on a cold runtime reports `model_loaded: false` - always run a `load` first -> 2. If load fails, check the stderr traceback (torch/MPS availability) -> 3. Confirm the model cache exists under `~/.cache/huggingface`; a missing cache triggers the ~3.9GB download |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check whether the vision runtime is loaded and what device it is using.`

### Commands

1. `bash: printf '%s\n' \`
2. `  '{"id":1,"method":"load","params":{}}' \`
3. `  '{"id":2,"method":"load","params":{}}' \`
4. `  '{"id":3,"method":"status","params":{}}'`
5. `  | "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py`

### Expected

Step 1: load returns `{"result":{"loaded":true}}`; Step 2: status reports `model_loaded: true`, a `device` of `mps` or `cuda`, and non-empty `capabilities`

### Evidence

The status response (device, capabilities, request_count, uptime_s) with the transcript

### Pass / Fail

- **Pass**: `result.model_loaded` is `true` and `device` is `mps` or `cuda` with non-empty `capabilities`
- **Fail**: `model_loaded` stays false after load, or the response is an error envelope

### Failure Triage

1. Status alone on a cold runtime reports `model_loaded: false` - always run a `load` first -> 2. If load fails, check the stderr traceback (torch/MPS availability) -> 3. Confirm the model cache exists under `~/.cache/huggingface`; a missing cache triggers the ~3.9GB download

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/system-health/status.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/python/runtime.py` | Handler: `handle_status` + `_device_of` |
| `pi/sk-vision.ts` | Pi tool registration for `sk_vision_status` |
| `vision-runtime/python/runtime.test.ts` | Analysis handler regression suite (status in lifecycle assertions) |

---

## 5. SOURCE METADATA

- Group: System health
- Playbook ID: VSN-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `system-health/status.md`
