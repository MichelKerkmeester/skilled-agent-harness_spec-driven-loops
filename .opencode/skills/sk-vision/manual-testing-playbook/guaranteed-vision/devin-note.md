---
title: "VSN-023 -- Rule-driven vision in Devin"
description: "This scenario validates that, with the Devin drop-in note supplied as session guidance, a text-only Devin model calls a `sk_vision_*` tool on an attached image unprompted and reports real content."
version: 1.0.0.0
---

# VSN-023 -- Rule-driven vision in Devin

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-023`.

---

## 1. OVERVIEW

This scenario validates the Devin best-effort guarantee for text-only models.

### Why This Matters

Devin attaches sk-vision only over MCP and cannot force a tool call, and it has no repo-owned always-on rule slot. So the vision note must be supplied as session guidance. With the Devin drop-in note supplied as guidance, a text-only Devin model calls a `sk_vision_*` tool on an attached image unprompted and reports real content. Best-effort by design.

---

## 2. SCENARIO CONTRACT

Operators run a neutral prompt with the vision-note text supplied as guidance against a text-only Devin model, and confirm the model calls a vision tool unprompted and reports the image's true content.

- Objective: with the Devin drop-in note supplied as session guidance, a text-only Devin model calls a `sk_vision_*` tool on an attached image unprompted and reports real content
- Real user request: `GLM in Devin answers about screenshots without ever reading them.`
- Prompt (NEUTRAL): `What is the status message in this image?` (the note text from `hooks/devin/vision-rule.md` is supplied as guidance alongside it)
- Preconditions: Devin has sk-vision attached and connected (VSN-019 PASS); the `hooks/devin/vision-rule.md` note text is in the session guidance (Devin has no repo-owned always-on rule slot, so it must be supplied); the active model is text-only (GLM); the fixture is attached or its path is given; server env `SK_VISION_MODEL=moondream3-preview`; Devin headless `-p` needs `--permission-mode dangerous` for MCP tools.
- Expected execution process: guided by the note, the model calls `sk_vision_inspect`/`sk_vision_ocr` on the image without an explicit "you are blind" instruction, then reports the real text.
- Expected signals: transcript shows a namespaced sk-vision tool call the neutral prompt did not request; the quoted text matches `DEPLOY OK 7391`.
- Desired user-visible outcome: a text-only model in Devin reports the image's true content when the vision note is present as guidance.
- Pass/fail: PASS if the model calls a vision tool driven by the note and reports ground truth; FAIL if it guesses, refuses, or ignores the note.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-023 | Rule-driven vision in Devin | Confirm a text-only Devin model calls a `sk_vision_*` tool unprompted when driven by the supplied note | What is the status message in this image? | 1. Confirm attachment (VSN-019) -> 2. Dispatch GLM-5.2-High via cli-devin in `-p` with `--permission-mode dangerous`, supplying the note text + the neutral prompt + the fixture path (server env `SK_VISION_MODEL=moondream3-preview`) -> 3. bash ground truth: compare the quote to `DEPLOY OK 7391` | Transcript shows a namespaced sk-vision tool call the neutral prompt did not request; the quoted text matches `DEPLOY OK 7391` | The model transcript and the ground-truth text | PASS if the model calls a vision tool driven by the note and reports ground truth; FAIL if it guesses, refuses, or ignores the note | 1. Confirm attachment (VSN-019) and `--permission-mode dangerous` -> 2. Confirm the note text was actually supplied -> 3. Get ground truth via a direct `sk_vision_ocr` -> 4. Re-run with the note stated more prominently |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `What is the status message in this image?`

### Commands

1. `host: confirm attachment (VSN-019)`
2. `agent: dispatch GLM-5.2-High via cli-devin in -p with --permission-mode dangerous, supplying the note text + the neutral prompt + the fixture path (server env SK_VISION_MODEL=moondream3-preview)`
3. `bash: compare the quote to DEPLOY OK 7391`

### Expected

Guided by the note, the model calls a `sk_vision_*` tool on the image without an explicit "you are blind" instruction and reports the real text; it does not guess, refuse, or ignore the note.

### Evidence

Capture the model transcript (showing the tools call and quote) and the ground-truth text.

### Pass / Fail

- **Pass**: the model calls a vision tool driven by the note and reports ground truth
- **Fail**: the model guesses, refuses, or ignores the note

### Failure Triage

1. Confirm attachment (VSN-019) and `--permission-mode dangerous` -> 2. Confirm the note text was actually supplied -> 3. Get ground truth via a direct `sk_vision_ocr` -> 4. Re-run with the note stated more prominently.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `hooks/devin/vision-rule.md` | The drop-in note for Devin Knowledge |
| `vision-runtime/dist/mcp-server.js` | Built stdio server the host launches |
| `vision-runtime/src/opencode/tools.ts` | The tool definitions, including `sk_vision_inspect` / `sk_vision_ocr` |

---

## 5. SOURCE METADATA

- Group: Guaranteed vision
- Playbook ID: VSN-023
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `guaranteed-vision/devin-note.md`
