---
title: "VSN-021 -- Guaranteed auto-inspect for a text-only model"
description: "This scenario validates the legacy auto-inspect guarantee when `SK_VISION_AUTOINSPECT=1` is set for a text-only model in OpenCode or Pi."
version: 1.0.0.0
---

# VSN-021 -- Guaranteed auto-inspect for a text-only model

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-021`.

---

## 1. OVERVIEW

This is a compatibility scenario for the legacy auto-inspect guarantee. It runs only with `SK_VISION_AUTOINSPECT=1`.

### Why This Matters

With `SK_VISION_AUTOINSPECT=1`, a text-only model in OpenCode or Pi receives the full image analysis before it reads the message. The adapter injects a `<SK-VISION>` evidence block even when the first cold analysis exceeds the 2-second grace. Run this scenario live in OpenCode or Pi. The tests named below also cover the logic.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt against a text-only model in an in-process host and confirm the submitted message already carries a `<SK-VISION>` evidence block with the fixture's real text.

- Objective: for a text-only model, the adapter AWAITS the full image analysis and auto-injects the `<SK-VISION>` block, so the evidence is guaranteed present even when the first cold analysis is slower than the 2-second grace
- Real user request: `I'm running DeepSeek in OpenCode and enabled legacy auto-inspect. The pasted screenshot should be readable without a command.`
- Prompt: `What does this screenshot say?`
- Preconditions: set `SK_VISION_AUTOINSPECT=1`. The OpenCode plugin (`.opencode/plugins/sk-vision.js`) or Pi extension (`.pi/extensions/sk-vision.ts`) is loaded. The active model is text-only, matched by the allowlist such as deepseek or by Pi declaring no "image" input. The fixture is attached.
- Expected execution process: on submit, the legacy adapter path calls `isTextOnlyModel`, awaits the full analysis and injects a `<SK-VISION>` block with scene, caption and OCR. The model answers from that block.
- Expected signals: the submitted message contains a `<SK-VISION>` block with the fixture's real text (`DEPLOY OK 7391`). Evidence is present even on a cold first load.
- Desired user-visible outcome: a text-only model answers the model's real question using guaranteed vision evidence it never had to ask for.
- Pass/fail: PASS if the `<SK-VISION>` block is present with real evidence for a text-only model. FAIL if the message submits with no evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-021 | Guaranteed auto-inspect for a text-only model | With `SK_VISION_AUTOINSPECT=1`, verify the adapter awaits the full analysis and injects the `<SK-VISION>` evidence block | What does this screenshot say? | 1. Set `SK_VISION_AUTOINSPECT=1` and confirm the OpenCode plugin or Pi extension is loaded with a text-only model -> 2. host: run in-process in OpenCode or Pi, attach `<FIXTURE>` and submit -> 3. inspect the submitted message for the injected `<SK-VISION>` block and compare its text to the ground truth `DEPLOY OK 7391` | The submitted message contains a `<SK-VISION>` block with the fixture's real text (`DEPLOY OK 7391`). Evidence is present on a cold first load | The message with the injected `<SK-VISION>` block, plus the unit proofs `vision-runtime/src/opencode/attachments.test.ts` (await-past-grace) and `vision-runtime/src/model-modality.test.ts` | PASS if the `<SK-VISION>` block is present with real evidence for a text-only model. FAIL if the message submits with no evidence | 1. Confirm `SK_VISION_AUTOINSPECT=1` is set -> 2. Confirm the model is on the allowlist or declares no image input -> 3. Confirm the runtime loads -> 4. Confirm the legacy attachment path ran |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `What does this screenshot say?`

### Commands

1. `bash: SK_VISION_AUTOINSPECT=1` and confirm the OpenCode plugin or Pi extension is loaded with a text-only model
2. `host: run in-process in OpenCode/Pi, attach the fixture and submit`
3. `bash: inspect the submitted message for the injected <SK-VISION> block and compare its text to the ground truth DEPLOY OK 7391`

### Expected

With `SK_VISION_AUTOINSPECT=1`, the model answers the neutral prompt using a `<SK-VISION>` block already present in the submitted message. The block's text matches the fixture's known content even on a cold first load.

### Evidence

Capture the message with the injected `<SK-VISION>` block, plus the unit proofs `vision-runtime/src/opencode/attachments.test.ts` (await-past-grace) and `vision-runtime/src/model-modality.test.ts`.

### Pass / Fail

- **Pass**: the `<SK-VISION>` block is present with real evidence for a text-only model (awaited)
- **Fail**: a text-only model's message submits with no evidence (raced out)

### Failure Triage

1. Confirm `SK_VISION_AUTOINSPECT=1` is set -> 2. Confirm the model is on the allowlist or declares no image input -> 3. Confirm the runtime loads -> 4. Confirm the legacy attachment path ran.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/src/model-modality.ts` | The shared classifier that decides if the active model is text-only |
| `vision-runtime/src/opencode/attachments.ts` | The OpenCode gate that awaits the full analysis for a text-only model |
| `hooks/pi/sk-vision.ts` | The Pi gate that awaits the full analysis for a text-only model |

---

## 5. SOURCE METADATA

- Group: Guaranteed vision
- Playbook ID: VSN-021
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `guaranteed-vision/auto-inspect-guarantee.md`
