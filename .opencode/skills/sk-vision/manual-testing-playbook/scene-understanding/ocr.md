---
title: "VSN-002 -- Optical character recognition"
description: "This scenario validates Optical character recognition for `VSN-002`. It focuses on verbatim transcription of visible text."
version: 1.0.0.0
---

# VSN-002 -- Optical character recognition

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-002`.

---

## 1. OVERVIEW

This scenario validates Optical character recognition for `VSN-002`. It focuses on verbatim transcription of visible text.

### Why This Matters

OCR is the highest-value tool for a coding agent: error dialogs, mockups, and screenshots all carry text a text-only model cannot otherwise read.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-002` and confirm the expected signals without contradictory evidence.

- Objective: verbatim transcription of the text visible in an image
- Real user request: `Read the error message in this screenshot for me.`
- Prompt: `Use sk_vision_ocr on the fixture image and report the exact text.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"ocr","text":"<visible text>"}}` with the visible word transcribed
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if `result.text` contains the visible word from `<FIXTURE>` exactly; FAIL if `text` is empty, garbled, or the request returns an error envelope

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-002 | Optical character recognition | Verify verbatim transcription of visible text | Use sk_vision_ocr on the fixture image and report the exact text. | 1. bash: printf '%s\n' \ -> 2.   '{"id":1,"method":"load","params":{}}' \ -> 3.   '{"id":2,"method":"ocr","params":{"source":{"type":"path","path":"<FIXTURE>"},"kind":"all"}}' -> 4.   \| "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py | Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"ocr","text":"<visible text>"}}` with the visible word transcribed | The transcript line containing the OCR `text` value; the expected word must appear verbatim | PASS if `result.text` contains the visible word from `<FIXTURE>` exactly; FAIL if `text` is empty, garbled, or the request returns an error envelope | 1. Confirm the image actually renders text; regenerate `<FIXTURE>` with a larger font -> 2. Try `kind` values `code` and `error` -> 3. If the model never loads, run VSN-012 and read the stderr traceback |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use sk_vision_ocr on the fixture image and report the exact text.`

### Commands

1. `bash: printf '%s\n' \`
2. `  '{"id":1,"method":"load","params":{}}' \`
3. `  '{"id":2,"method":"ocr","params":{"source":{"type":"path","path":"<FIXTURE>"},"kind":"all"}}'`
4. `  | "$HOME/.cache/sk-vision/venv/bin/python" .opencode/skills/sk-vision/vision-runtime/python/runtime.py`

### Expected

Step 1: load returns `{"result":{"loaded":true}}`; Step 2: `{"id":2,"result":{"type":"ocr","text":"<visible text>"}}` with the visible word transcribed

### Evidence

The transcript line containing the OCR `text` value; the expected word must appear verbatim

### Pass / Fail

- **Pass**: `result.text` contains the visible word from `<FIXTURE>` exactly
- **Fail**: `text` is empty, garbled, or the request returns an error envelope

### Failure Triage

1. Confirm the image actually renders text; regenerate `<FIXTURE>` with a larger font -> 2. Try `kind` values `code` and `error` -> 3. If the model never loads, run VSN-012 and read the stderr traceback

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/scene-understanding/ocr.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/python/runtime.py` | Handler: `handle_ocr` + `OCR_PROMPTS` |
| `pi/sk-vision.ts` | Pi tool registration for `sk_vision_ocr` |
| `vision-runtime/python/runtime.test.ts` | Analysis handler regression suite |

---

## 5. SOURCE METADATA

- Group: Scene understanding
- Playbook ID: VSN-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `scene-understanding/ocr.md`
