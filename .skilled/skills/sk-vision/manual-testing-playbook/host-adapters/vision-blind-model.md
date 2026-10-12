---
title: "VSN-020 -- Vision-blind model gains sight"
description: "This scenario validates the end-to-end value for `VSN-020`: a text-only model (such as GLM) in Devin or Cursor reads an image it cannot natively see."
version: 1.0.0.0
---

# VSN-020 -- Vision-blind model gains sight

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-020`.

---

## 1. OVERVIEW

This scenario validates the whole reason sk-vision exists: giving a text-only model vision inside a host that cannot provide it.

### Why This Matters

Devin and Cursor routinely run text-only models, GLM being the common example, that receive an image part but cannot see a single pixel of it. Without sk-vision such a model guesses, hallucinates, or refuses. The two hosts now get there differently, and the difference matters: on Devin the hook injects the evidence whether or not the model would have asked (VSN-028), while on Cursor the model must run the CLI itself (VSN-029). This scenario proves the outcome reaches the model, not merely that a mechanism is wired.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt against a text-only model in Devin or Cursor and confirm the model reports the image's true content rather than guessing.

- Objective: confirm a vision-blind model reads an attached image's exact text via `sk_vision_ocr` (or `sk_vision_inspect`) instead of hallucinating or refusing
- Real user request: `I'm using GLM in Cursor and it can't read the text in my screenshot.`
- Prompt: `Read the exact text in this image and quote it. You have no native vision — use the available sk-vision tools.`
- Preconditions: the host (Cursor or Devin) has `sk-vision` attached and connected (VSN-018 / VSN-019 PASS); the active model is text-only (e.g. GLM); a known image with known text is attached or its path is given.
- Expected execution process: the model recognizes it cannot see the image, calls the namespaced `sk_vision_ocr` (or `sk_vision_inspect`), and quotes the returned text.
- Expected signals: a tool call to `sk_vision_ocr`/`sk_vision_inspect` appears in the transcript; the model's quoted text matches the image's actual text; no invented content.
- Desired user-visible outcome: the text-only model answers correctly about an image it cannot natively see.
- Pass/fail: PASS if the model calls a vision tool and its report matches the image's ground-truth text; FAIL if the model hallucinates, refuses, or answers without calling a tool.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-020 | Vision-blind model gains sight | Confirm a text-only model reports an image's real content | Read the exact text in this image and quote it. You have no native vision. | 1. Select a text-only model (e.g. GLM) and confirm the host path works (VSN-028 for Devin, VSN-029 for Cursor) -> 2. host/agent: name a known-text image, then run the prompt -> 3. bash (ground truth): run the CLI on the same image and compare the model's quote to its OCR | Devin: the reply quotes the image text with no tool call, because the hook injected it. Cursor: the transcript shows a CLI run and the quote matches | The model transcript, and the ground-truth CLI output | PASS if the quote matches ground truth; FAIL on hallucination, refusal, or an answer derived from the filename | 1. Confirm the host path with VSN-028 or VSN-029 -> 2. Confirm the model is genuinely text-only -> 3. Run the CLI directly for ground truth -> 4. Re-prompt making the no-native-vision constraint explicit |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Read the exact text in this image and quote it. You have no native vision — use the available sk-vision tools.`

### Commands

1. `host: select a text-only model (e.g. GLM) and confirm sk-vision is attached (VSN-018 for Cursor, VSN-019 for Devin)`
2. `agent: attach or name a known-text image and run the prompt`
3. `bash: obtain ground truth via a direct sk_vision_ocr call and compare it to the model's quote`

### Expected

The model calls a vision tool and quotes text that matches the image's known content; it does not invent or refuse.

### Evidence

Capture the model transcript (showing the tool call and the quote) and the ground-truth text used for comparison.

### Pass / Fail

- **Pass**: a vision tool is called and the quote matches ground truth
- **Fail**: the model hallucinates, refuses, or answers without a tool call

### Failure Triage

1. Confirm attachment with VSN-018 / VSN-019 -> 2. Confirm the model is text-only -> 3. Get ground truth with a direct `sk_vision_ocr` -> 4. Re-prompt with the no-native-vision constraint stated explicitly.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `devin-hook.md` / `vision-cli.md` | The host scenarios this one builds on |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/dist/vision-cli.js` | Built CLI entry the host runs |
| `vision-runtime/src/opencode/tools.ts` | The 13 tool definitions, including `sk_vision_ocr` / `sk_vision_inspect` |
| `vision-runtime/python/runtime.py` | The OCR/inspect handlers that produce the real text |

---

## 5. SOURCE METADATA

- Group: Host adapters
- Playbook ID: VSN-020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `host-adapters/vision-blind-model.md`
