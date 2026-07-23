---
title: "001-swe-1.6-eval-loop/scripts: SWE 1.6 prompt-framework eval-loop orchestrator"
description: "Deep-loop scripts that dispatch, score, mutate and converge SWE 1.6 prompt-framework variants."
---

# 001-swe-1.6-eval-loop/scripts

---

## 1. OVERVIEW

`scripts/` holds the bespoke deep-loop orchestrator for the SWE 1.6 prompt-framework eval loop under `001-swe-1.6-eval-loop/`. It dispatches SWE 1.6 runs through cli-devin, scores each output against a deterministic-plus-grader rubric, mutates the prompt along five framework axes and stops the loop once a weighted convergence signal fires.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `loop.cjs` | Main orchestrator for the 10-step iteration cycle: dispatch, score, mutate, converge and persist state to `state/` and `iterations/` |
| `dispatch-swe16.cjs` | Wraps one cli-devin SWE 1.6 dispatch with prompt-file rendering, timeout enforcement and rate-limit backoff (60s/120s/240s, 3-strike pause) |
| `mutate.cjs` | Generates the next variant by hill-climbing one axis at a time (framework, preplanning density, thinking threshold, bundle-gate strictness, anti-hallucination strength), tracked by signature to skip duplicates |
| `render-variant.cjs` | Fills a variant template's placeholders from a fixture's `task.json` into a concrete prompt file that cli-devin dispatches |
| `score-variant.cjs` | Runs the deterministic checks plus the grader against one SWE 1.6 output, applies the hard-gate rule and aggregates a weighted variant score |
| `converge.cjs` | Three-signal weighted-vote convergence evaluator (plateau 0.40, exhaustion 0.35, MAD 0.25) that flags a stop candidate once the composite score passes 0.60 |
| `seed-fixtures.cjs` | Materializes each fixture's `seed/` working directory so SWE 1.6 has starting files to read at iteration time |
| `synthesize.cjs` | Ranks every evaluated variant by score and writes the final `synthesis.md` handoff |

## 3. VALIDATION

Run from `001-swe-1.6-eval-loop/`:

```bash
node scripts/loop.cjs --mock --max-iters 2
```

This command currently fails before running any iteration. `loop.cjs` and `score-variant.cjs` resolve their rig dependency to a sibling `../002-eval-rig` directory, which does not exist at that path anymore (the shared eval-rig now lives at `003-minimax-prompt-framework/eval-rig/`).

The loop's actual exit-code contract: 0 means the run ended normally, whether by converging, exhausting the mutation queue or reaching `--max-iters`, with a synthesis written in every case. 1 means the iteration-one sanity gate rejected the run. 2 means the loop paused on a pause sentinel or a rate-limit signal. 3 means a fatal, uncaught error.

## 4. RELATED

- [`SKILL.md`](../../../SKILL.md)
