---
title: "VSN-022 -- Rule-driven vision in Cursor"
description: "This scenario validates that, with the always-on Cursor rule active, a text-only model calls a `sk_vision_*` tool on an attached image unprompted and reports the real content."
version: 1.0.0.0
---

# VSN-022 -- Rule-driven vision in Cursor

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-022`.

---

## 1. OVERVIEW

This is the packet's Cursor best-effort guarantee — distinct from VSN-020, whose prompt explicitly told the model it had no vision.

### Why This Matters

Cursor attaches sk-vision only over MCP and cannot force a tool call, so it gets a best-effort rule rather than a hard guarantee. With the always-on Cursor rule active, a text-only model calls a `sk_vision_*` tool on an attached image UNPROMPTED (the prompt never tells it to) and reports the real content. This scenario proves the rule delivers that outcome in Cursor's headless `cursor-agent -p` mode.

---

## 2. SCENARIO CONTRACT

Operators run a neutral prompt against a text-only model in Cursor with the always-on rule active, and confirm the model calls a vision tool unprompted and reports the image's true content.

- Objective: with the always-on Cursor rule active, a text-only model calls a `sk_vision_*` tool on an attached image UNPROMPTED (the prompt never tells it to) and reports the real content
- Real user request: `GLM in Cursor keeps guessing at my screenshots even though sk-vision is attached.`
- Prompt (NEUTRAL — must NOT mention vision, blindness, or tools): `What is the status message in this image?`
- Preconditions: Cursor has sk-vision attached and connected (VSN-018 PASS); `.cursor/rules/sk-vision.md` present (symlink to `hooks/cursor/vision-rule.md`, frontmatter `alwaysApply: true`); the active model is text-only (GLM); the fixture is attached or its path is given; the sk-vision server env `SK_VISION_MODEL=moondream3-preview` (moondream2 truncates OCR).
- Expected execution process: the rule pre-instructs the model, so it calls `sk_vision_inspect` or `sk_vision_ocr` on the image WITHOUT being told, then reports the real text.
- Expected signals: the transcript shows a `sk_vision_*` tool call that the neutral prompt did not request; the quoted text matches `DEPLOY OK 7391`; no hallucination.
- Desired user-visible outcome: a text-only model in Cursor reports the image's true content without ever being told it was blind or told to use a tool.
- Pass/fail: PASS if the model calls a vision tool unprompted and reports ground truth; FAIL if it guesses, refuses, or only calls a tool after being told it is blind.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-022 | Rule-driven vision in Cursor | Confirm a text-only model calls a `sk_vision_*` tool unprompted via the always-on Cursor rule | What is the status message in this image? | 1. Confirm attachment (VSN-018) and that `.cursor/rules/sk-vision.md` resolves -> 2. `AI_SESSION_CHILD=1 cursor-agent -p '<neutral prompt naming the fixture path>' --model glm-5.2-high --auto-review --sandbox enabled` (sk-vision server env `SK_VISION_MODEL=moondream3-preview`) -> 3. bash ground truth: compare the model's quote to `DEPLOY OK 7391` | The transcript shows a `sk_vision_*` tool call that the neutral prompt did not request; the quoted text matches `DEPLOY OK 7391`; no hallucination | The model transcript (showing the unprompted tool call and quote) and the ground-truth text | PASS if the model calls a vision tool unprompted and reports ground truth; FAIL if it guesses, refuses, or only calls a tool after being told it is blind | 1. Confirm `.cursor/rules/sk-vision.md` actually loads in `cursor-agent -p` mode -> 2. Confirm attachment (VSN-018) -> 3. Verify the rule frontmatter `alwaysApply: true` -> 4. Re-run naming the fixture path explicitly |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `What is the status message in this image?`

### Commands

1. `host: confirm attachment (VSN-018) and that .cursor/rules/sk-vision.md resolves`
2. `agent: AI_SESSION_CHILD=1 cursor-agent -p '<neutral prompt naming the fixture path>' --model glm-5.2-high --auto-review --sandbox enabled (sk-vision server env SK_VISION_MODEL=moondream3-preview)`
3. `bash: compare the model's quote to DEPLOY OK 7391`

### Expected

Driven by the rule, the model calls a `sk_vision_*` tool on the image without being told and reports the real text; it does not guess, refuse, or hallucinate.

### Evidence

Capture the model transcript (showing the unprompted tool call and quote) and the ground-truth text.

### Pass / Fail

- **Pass**: the model calls a vision tool unprompted and reports ground truth
- **Fail**: the model guesses, refuses, or only calls a tool after being told it is blind

### Failure Triage

1. Confirm `.cursor/rules/sk-vision.md` actually loads in `cursor-agent -p` mode -> 2. Confirm attachment (VSN-018) -> 3. Verify the rule frontmatter `alwaysApply: true` -> 4. Re-run naming the fixture path explicitly.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `hooks/cursor/vision-rule.md` | The always-on rule source |
| `.cursor/rules/sk-vision.md` | The symlink to `hooks/cursor/vision-rule.md` that Cursor loads |
| `vision-runtime/dist/mcp-server.js` | Built stdio server the host launches |
| `vision-runtime/src/opencode/tools.ts` | The tool definitions, including `sk_vision_inspect` / `sk_vision_ocr` |

---

## 5. SOURCE METADATA

- Group: Guaranteed vision
- Playbook ID: VSN-022
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `guaranteed-vision/cursor-rule.md`
