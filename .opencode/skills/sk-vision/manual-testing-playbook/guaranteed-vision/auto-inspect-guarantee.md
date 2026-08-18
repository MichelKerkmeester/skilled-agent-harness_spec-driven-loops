---
title: "VSN-021 -- Guaranteed auto-inspect for a text-only model"
description: "This scenario validates that, for a text-only model in an in-process host (OpenCode or Pi), the adapter awaits the full image analysis and auto-injects a `<SK-VISION>` evidence block so the evidence is guaranteed present."
version: 1.0.0.0
---

# VSN-021 -- Guaranteed auto-inspect for a text-only model

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-021`.

---

## 1. OVERVIEW

This is an in-process scenario for the guarantee: text-only models get a hard guarantee of vision evidence, unlike multimodal models which keep a non-blocking grace race.

### Why This Matters

For a text-only model in an in-process host (OpenCode or Pi), the adapter AWAITS the full image analysis and auto-injects a `<SK-VISION>` evidence block. This means the evidence is guaranteed present even when the first cold analysis is slower than the 2-second grace. Run this scenario live in OpenCode/Pi. Its logic is also unit-proven by the tests named below.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt against a text-only model in an in-process host, and confirm the submitted message already carries a `<SK-VISION>` evidence block with the fixture's real text.

- Objective: for a text-only model, the adapter AWAITS the full image analysis and auto-injects the `<SK-VISION>` block, so the evidence is guaranteed present even when the first cold analysis is slower than the 2-second grace
- Real user request: `I'm running DeepSeek in OpenCode and pasted a screenshot — it should read it without me asking.`
- Prompt: `What does this screenshot say?`
- Preconditions: the OpenCode plugin (`.opencode/plugins/sk-vision.js`) or Pi extension (`.pi/extensions/sk-vision.ts`) is loaded; the active model is text-only (matched by the allowlist, e.g. deepseek, or on Pi declares no "image" input); the fixture is attached.
- Expected execution process: on submit, the adapter calls `isTextOnlyModel`, awaits the full analysis (not the 2s race), and injects a `<SK-VISION>` block with scene + caption + OCR; the model answers from that block.
- Expected signals: the submitted message contains a `<SK-VISION>` block with the fixture's real text (`DEPLOY OK 7391`); evidence present even on a cold first load.
- Desired user-visible outcome: a text-only model answers the model's real question using guaranteed vision evidence it never had to ask for.
- Pass/fail: PASS if the `<SK-VISION>` block is present with real evidence for a text-only model (awaited); FAIL if a text-only model's message submits with no evidence (raced out).

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-021 | Guaranteed auto-inspect for a text-only model | For a text-only model, the adapter awaits the full analysis and auto-injects the `<SK-VISION>` evidence block | What does this screenshot say? | 1. Confirm the OpenCode plugin (`.opencode/plugins/sk-vision.js`) or Pi extension (`.pi/extensions/sk-vision.ts`) is loaded and the active model is text-only -> 2. host: run in-process in OpenCode/Pi, attach the fixture `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/019-guaranteed-vision-for-text-only-models/scratch/fixture-guarantee.png`, then submit -> 3. inspect the submitted message for the injected `<SK-VISION>` block and compare its text to the ground truth `DEPLOY OK 7391` | The submitted message contains a `<SK-VISION>` block with the fixture's real text (`DEPLOY OK 7391`); evidence present even on a cold first load | The message with the injected `<SK-VISION>` block, plus the unit proofs `vision-runtime/src/opencode/attachments.test.ts` (await-past-grace) and `vision-runtime/src/model-modality.test.ts` | PASS if the `<SK-VISION>` block is present with real evidence for a text-only model (awaited); FAIL if a text-only model's message submits with no evidence (raced out) | 1. Confirm the model is on the allowlist or declares no image input -> 2. Set `SK_VISION_FORCE=1` to force -> 3. Confirm the runtime loads (VSN-012 status) -> 4. Confirm the paste-preload ran |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `What does this screenshot say?`

### Commands

1. `host: confirm the OpenCode plugin or Pi extension is loaded and the active model is text-only`
2. `host: run in-process in OpenCode/Pi, attach the fixture, and submit`
3. `bash: inspect the submitted message for the injected <SK-VISION> block and compare its text to the ground truth DEPLOY OK 7391`

### Expected

The model answers the neutral prompt using a `<SK-VISION>` block that is already present in the submitted message; the block's text matches the fixture's known content even on a cold first load.

### Evidence

Capture the message with the injected `<SK-VISION>` block, plus the unit proofs `vision-runtime/src/opencode/attachments.test.ts` (await-past-grace) and `vision-runtime/src/model-modality.test.ts`.

### Pass / Fail

- **Pass**: the `<SK-VISION>` block is present with real evidence for a text-only model (awaited)
- **Fail**: a text-only model's message submits with no evidence (raced out)

### Failure Triage

1. Confirm the model is on the allowlist or declares no image input -> 2. Set `SK_VISION_FORCE=1` to force -> 3. Confirm the runtime loads (VSN-012 status) -> 4. Confirm the paste-preload ran.

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
