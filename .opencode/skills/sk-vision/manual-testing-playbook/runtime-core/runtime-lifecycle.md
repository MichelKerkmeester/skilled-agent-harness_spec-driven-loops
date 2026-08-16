---
title: "VSN-016 -- Runtime lifecycle"
description: "This scenario validates Runtime lifecycle for `VSN-016`. It focuses on load, warm status, unload, and released status."
version: 1.0.0.0
---

# VSN-016 -- Runtime lifecycle

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-016`.

---

## 1. OVERVIEW

This scenario validates Runtime lifecycle for `VSN-016`. It focuses on load, warm status, unload, and released status.

### Why This Matters

Lifecycle control decides GPU residency: a fork must claim and release memory on demand so a shared workstation stays responsive.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-016` and confirm the expected signals without contradictory evidence.

- Objective: the model lifecycle: load, warm status, unload, and released status
- Real user request: `Load the vision model, check it, then unload it to free memory.`
- Prompt: `Load the vision model, check status, then unload it and confirm it is released.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: `load` returns `{"result":{"loaded":true}}`; Step 2: status reports `model_loaded: true`; Step 3: `unload` returns a result confirming the model was released; Step 4: status reports `model_loaded: false`
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if `model_loaded` is true after load and false after unload; FAIL if the flag does not flip, an error envelope appears, or the process crashes

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-016 | Runtime lifecycle | Verify load, warm status, unload, and released status | Load the vision model, check status, then unload it and confirm it is released. | 1. bash: printf '%s\n' \ -> 2.   '{"id":1,"method":"load","params":{}}' \ -> 3.   '{"id":2,"method":"status","params":{}}' \ -> 4.   '{"id":3,"method":"unload","params":{}}' \ -> 5.   '{"id":4,"method":"status","params":{}}' -> 6.   \| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py | Step 1: `load` returns `{"result":{"loaded":true}}`; Step 2: status reports `model_loaded: true`; Step 3: `unload` returns a result confirming the model was released; Step 4: status reports `model_loaded: false` | All four transcript lines showing the `model_loaded` flag flip true -> false | PASS if `model_loaded` is true after load and false after unload; FAIL if the flag does not flip, an error envelope appears, or the process crashes | 1. Confirm the model loaded in Step 1 before judging Step 2 -> 2. If unload errors, check stderr for a torch teardown exception -> 3. Confirm a subsequent `load` after `unload` succeeds (reversibility) |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Load the vision model, check status, then unload it and confirm it is released.`

### Commands

1. `bash: printf '%s\n' \`
2. `  '{"id":1,"method":"load","params":{}}' \`
3. `  '{"id":2,"method":"status","params":{}}' \`
4. `  '{"id":3,"method":"unload","params":{}}' \`
5. `  '{"id":4,"method":"status","params":{}}'`
6. `  | "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py`

### Expected

Step 1: `load` returns `{"result":{"loaded":true}}`; Step 2: status reports `model_loaded: true`; Step 3: `unload` returns a result confirming the model was released; Step 4: status reports `model_loaded: false`

### Evidence

All four transcript lines showing the `model_loaded` flag flip true -> false

### Pass / Fail

- **Pass**: `model_loaded` is true after load and false after unload
- **Fail**: the flag does not flip, an error envelope appears, or the process crashes

### Failure Triage

1. Confirm the model loaded in Step 1 before judging Step 2 -> 2. If unload errors, check stderr for a torch teardown exception -> 3. Confirm a subsequent `load` after `unload` succeeds (reversibility)

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/runtime-core/json-rpc-runtime.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/python/runtime.py` | Handlers: `handle_load`, `handle_status`, `handle_unload` + `_unload_model` |
| `vision-runtime/src/runtime/client.ts` | NDJSON RuntimeClient used by the host adapters |
| `vision-runtime/python/runtime.test.ts` | Analysis handler regression suite (spawn + methods) |

---

## 5. SOURCE METADATA

- Group: Runtime core
- Playbook ID: VSN-016
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `runtime-core/runtime-lifecycle.md`
