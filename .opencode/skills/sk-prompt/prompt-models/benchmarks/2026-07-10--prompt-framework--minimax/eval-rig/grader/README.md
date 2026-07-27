---
title: "eval-rig/grader: D4 Hallucination LLM grader with dispute escalation"
description: "Claude-dispatched grader for the D4 Hallucination dimension, with a confidence-gated adversarial second opinion."
---

# eval-rig/grader

---

## 1. OVERVIEW

`grader/` is the eval-rig's LLM-judged scoring core. It grades the D4 Hallucination dimension by dispatching Claude Code CLI against a fixture and a model's output, then escalates to a second adversarial call when a grade looks unreliable. This is the semantic counterpart to the deterministic D4 allowlist check in `../scripts/deterministic/hallucination-flag.cjs`.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `harness.cjs` | Primary D4 grader (`gradeD4`). Composes the prompt from `prompts/system-grader.md`, the fixture and the model output. Dispatches Claude Code CLI (or a mock mode for dry runs), parses the JSON response with fenced or regex fallback extraction and caches the result through `../lib/cache.cjs` |
| `dispute.cjs` | Confidence-threshold escalation that triggers a second adversarial call (`prompts/system-skeptic.md` as the system prompt) when the last grade's confidence is below 0.7 or the recent D4 dispute rate exceeds 15%. Reports a score median and a dispute flag when the two calls disagree by more than 0.15 |
| `prompts/system-grader.md` | System prompt for the primary D4 grader |
| `prompts/system-skeptic.md` | System prompt for the adversarial second-opinion grader used by `dispute.cjs` |

## 3. WHAT IT GRADES

D4 Hallucination only, one dimension of the eval-rig's rubric. `harness.cjs` never executes the CLI dispatch during the rig's own dry-run gate. The eval loop calls `dispatchReal()` at iteration time, while the dry-run gate exercises `dispatchMock()` to verify the parsing logic in isolation.

## 4. VALIDATION

```bash
node grader/harness.cjs <fixture.json> <output.md> mock-default
```

Smoke-tests the parse path against a mocked grader response without a live Claude Code dispatch.

## 5. RELATED

- [`SKILL.md`](../../../../SKILL.md)
- [`../lib/README.md`](../lib/README.md)
