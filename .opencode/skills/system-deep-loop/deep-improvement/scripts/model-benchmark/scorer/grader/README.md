---
title: "grader: pluggable D4 LLM grader"
description: "D4 hallucination grader: prompt build, dispatch, parse, clamp, cache, and adversarial dispute escalation."
trigger_phrases:
  - "D4 grader"
  - "grader harness"
  - "dispute resolver"
---

# grader: pluggable D4 LLM grader

---

## 1. OVERVIEW

`grader/` owns the D4 hallucination dimension. `harness.cjs` builds the grader prompt, dispatches it, parses the JSON response, clamps the score, and caches the result. `dispute.cjs` decides when to escalate to an adversarial second call.

Current state:

- The grader is pluggable. `score-model-variant.cjs` builds a grader function for `noop`, `mock`, or `llm` (real) modes, and the harness runs the mock or real dispatch path.
- The model-provided score and confidence are clamped to `[0,1]`, including on the cache-hit path, so a malformed response cannot poison the weighted total.
- Parsing falls back through fenced JSON, regex object extraction, and a score-only regex before reporting `parse_status: failed`.
- `prompts/` holds the system prompts: the primary grader and the adversarial skeptic.

---

## 2. ARCHITECTURE

```text
score-model-variant.cjs (buildGraderFn)
        │
        ▼
┌──────────────────────────────────────────────┐
│ harness.gradeD4                               │
│  compose prompt ─▶ dispatch ─▶ parse ─▶ clamp │
└───────────────┬───────────────┬──────────────┘
                │               │
                ▼               ▼
        ┌──────────────┐  ┌──────────────┐
        │ prompts/     │  │ lib/cache    │
        │ system-*.md  │  │ grader cache │
        └──────────────┘  └──────────────┘

dispute.cjs ──(low confidence or dispute rate)──▶ adversarial second gradeD4
             using prompts/system-skeptic.md

Dependency direction:
harness ───▶ ../lib/cache , harness ───▶ prompts/
dispute ───▶ harness , prompts/ are read-only data
```

---

## 3. DIRECTORY TREE

```text
grader/
+-- harness.cjs    # Grader factory: prompt build, dispatch, parse, clamp, cache
+-- dispute.cjs    # Confidence/dispute-rate escalation to a skeptic second call
`-- prompts/       # System prompts for the primary grader and the skeptic
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `harness.cjs` | Exports `gradeD4`. Composes the prompt from `prompts/system-grader.md`, dispatches via `dispatchReal` (claude CLI) or `dispatchMock`, parses through `parseGraderResponse`, clamps via `clampScore01`, and reads/writes through `lib/cache.cjs`. Accepts an explicit `system_prompt_path` for the skeptic call. |
| `dispute.cjs` | Exports `shouldEscalateToDualGrader`, `adversarialSecondCall`, and `dualGraderInvocation`. Escalates when the last call confidence is below the threshold or the recent dispute rate exceeds the threshold, then runs a second `gradeD4` with `prompts/system-skeptic.md` and reports median, delta, and a dispute flag. |
| `prompts/` | The grader system prompts read by the harness. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `harness.cjs` requires `../lib/cache.cjs` and reads files from `prompts/`. `dispute.cjs` requires `./harness.cjs`. |
| Exports | `harness.cjs` exports `gradeD4`, `composeGraderPrompt`, `parseGraderResponse`, `clampScore01`, `dispatchReal`, `dispatchMock`, `VERSION`. `dispute.cjs` exports the escalation functions and thresholds. |
| Output clamp | Grader `score` and `confidence` are clamped to `[0,1]` on both the fresh and cache-hit paths. |
| Skeptic selection | The adversarial prompt is passed via the harness `system_prompt_path` parameter, not by patching `fs`. The adversarial cache key is differentiated with an `-adversarial` rubric suffix. |

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `gradeD4({ fixture, swe16_output_text, variant_hash, rubric_version, mode, mock_mode })` | Function | Returns a clamped D4 result with `parse_status` and cache metadata. |
| `dualGraderInvocation(opts)` | Function | Runs the primary grade and, when escalation triggers, the adversarial grade, returning median/delta/dispute. |
| `node harness.cjs <fixture.json> <output.md> [mode]` | CLI | Smoke-runs the grader where `mode` selects `real` or a `mock-*` variant. |

---

## 7. VALIDATION

Run from the repository root.

```bash
npx vitest run .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/scorer.vitest.ts
```

Expected result: the scorer suite, which exercises the mock grader path, passes.

---

## 8. RELATED

- [`scorer README`](../README.md)
- [`prompts README`](./prompts/README.md)
- [`lib README`](../lib/README.md)
