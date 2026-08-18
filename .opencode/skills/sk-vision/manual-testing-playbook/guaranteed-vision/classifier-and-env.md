---
title: "VSN-024 -- Text-only classifier and env overrides"
description: "This scenario validates the shared classifier's identification rules and that a multimodal/unlisted model keeps the non-blocking 2-second grace so submission never stalls."
version: 1.0.0.0
---

# VSN-024 -- Text-only classifier and env overrides

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-024`.

---

## 1. OVERVIEW

This is a unit-backed scenario for the classifier that decides which models are text-only.

### Why This Matters

The classifier identifies text-only models by (a) the built-in allowlist, (b) `SK_VISION_TEXT_ONLY_MODELS` additions, (c) `SK_VISION_FORCE=1`, and (d) a host-declared non-image input modality. A multimodal/unlisted model keeps the non-blocking 2-second grace so submission never stalls. The unit suites prove these rules and the await-vs-race behavior directly.

---

## 2. SCENARIO CONTRACT

Operators run the two unit suites in `vision-runtime/` and confirm the expected pass/fail counts.

- Objective: the classifier identifies text-only models by (a) the built-in allowlist, (b) `SK_VISION_TEXT_ONLY_MODELS` additions, (c) `SK_VISION_FORCE=1`, and (d) a host-declared non-image input modality; a multimodal/unlisted model keeps the non-blocking 2-second grace so submission never stalls
- Real user request: `How do I make sure my text-only model is treated as text-only — and that my multimodal model is not slowed down?`
- Prompt: not a model prompt; this scenario runs the unit suites
- Preconditions: `vision-runtime/` dependencies installed (`bun` available).
- Expected execution process: run the classifier and attachments unit suites; both report the expected green counts covering the allowlist, force flag, env additions, declared modality, and the await-vs-grace behavior.
- Expected signals: `model-modality.test.ts` reports 6 pass / 0 fail (allowlist, unlisted=false, missing model=false, `SK_VISION_FORCE`, `SK_VISION_TEXT_ONLY_MODELS`, declared-modality); `attachments.test.ts` reports 2 pass / 0 fail (a text-only model awaits past the grace; a non-listed model does not).
- Desired user-visible outcome: the classifier and host gates behave predictably for both text-only and multimodal models.
- Pass/fail: PASS if both suites are green with the counts above; FAIL on any failure.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-024 | Text-only classifier and env overrides | Confirm the classifier rules and the await-vs-grace behavior via the unit suites | (none — this scenario runs the unit suites) | 1. `cd .opencode/skills/sk-vision/vision-runtime` -> 2. `bun test src/model-modality.test.ts` -> 3. `bun test src/opencode/attachments.test.ts` | `model-modality.test.ts` reports 6 pass / 0 fail (allowlist, unlisted=false, missing model=false, `SK_VISION_FORCE`, `SK_VISION_TEXT_ONLY_MODELS`, declared-modality); `attachments.test.ts` reports 2 pass / 0 fail (a text-only model awaits past the grace; a non-listed model does not) | The two `bun test` transcripts | PASS if both suites are green with the counts above; FAIL on any failure | 1. Run `bun install` in `vision-runtime/` -> 2. Run `./node_modules/.bin/tsc --noEmit` to rule out a type error -> 3. Inspect the failing assertion |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: not a model prompt; this scenario runs the unit suites.

### Commands

1. `cd .opencode/skills/sk-vision/vision-runtime`
2. `bun test src/model-modality.test.ts`
3. `bun test src/opencode/attachments.test.ts`

### Expected

`model-modality.test.ts` reports 6 pass / 0 fail (allowlist, unlisted=false, missing model=false, `SK_VISION_FORCE`, `SK_VISION_TEXT_ONLY_MODELS`, declared-modality); `attachments.test.ts` reports 2 pass / 0 fail (a text-only model awaits past the grace; a non-listed model does not).

### Evidence

Capture the two `bun test` transcripts.

### Pass / Fail

- **Pass**: both suites are green with the counts above
- **Fail**: any failure in either suite

### Failure Triage

1. Run `bun install` in `vision-runtime/` -> 2. Run `./node_modules/.bin/tsc --noEmit` to rule out a type error -> 3. Inspect the failing assertion.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/src/model-modality.ts` | The shared classifier deciding if the active model is text-only |
| `vision-runtime/src/model-modality.test.ts` | Unit suite for the classifier rules |
| `vision-runtime/src/opencode/attachments.ts` | The OpenCode gate with the await-vs-grace behavior |
| `vision-runtime/src/opencode/attachments.test.ts` | Unit suite for the await-vs-grace behavior |

---

## 5. SOURCE METADATA

- Group: Guaranteed vision
- Playbook ID: VSN-024
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `guaranteed-vision/classifier-and-env.md`
