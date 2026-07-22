---
title: "003-minimax-prompt-framework/eval-loop/scripts: MiniMax prompt-framework eval-loop orchestrator"
description: "Deep-loop scripts that dispatch, score, mutate and converge MiniMax M2.7 prompt-framework variants."
---

# 003-minimax-prompt-framework/eval-loop/scripts

---

## 1. OVERVIEW

`scripts/` is the MiniMax adaptation of the SWE 1.6 eval-loop orchestrator. It runs the same 10-step iteration cycle, retargeted at MiniMax M2.7 through cli-opencode and a five-framework axis (RCAF, RACE, CIDI, TIDD-EC, COSTAR) held constant against the same fixture set. It reads the sibling `eval-rig/` package for deterministic checks and grading.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `loop.cjs` | Main orchestrator for the iteration cycle, identical shape to the SWE 1.6 loop but pointed at `eval-rig/` and `dispatch-minimax.cjs` |
| `dispatch-minimax.cjs` | Wraps one `opencode run --model minimax/MiniMax-M2.7` dispatch with timeout, rate-limit backoff and mock mode. Closes stdin to avoid the opencode stdin-hang bug and intentionally omits `--variant` so the framework bake-off holds it constant |
| `mutate.cjs` | Generates the next variant by hill-climbing one axis at a time. Here the `framework` axis is `RCAF`, `RACE`, `CIDI`, `TIDD-EC` or `COSTAR` |
| `render-variant.cjs` | Fills a variant template's placeholders from a fixture's `task.json` into a concrete prompt file |
| `score-variant.cjs` | Runs `eval-rig/`'s deterministic checks plus grader against one dispatch output and aggregates a weighted variant score |
| `converge.cjs` | Three-signal weighted-vote convergence evaluator (plateau, exhaustion, MAD) shared with the SWE 1.6 loop |
| `seed-fixtures.cjs` | Materializes each fixture's `seed/` working directory before a run |
| `synthesize.cjs` | Ranks every evaluated variant and writes the final `synthesis.md` handoff |
| `dispatch-swe16.cjs` | Carried over from the SWE 1.6 loop but unused here. `loop.cjs` requires `dispatch-minimax.cjs`, not this file |

## 3. VALIDATION

Run from `003-minimax-prompt-framework/eval-loop/`:

```bash
node scripts/loop.cjs --mock --max-iters 2
```

Exercises the full iteration cycle against mocked MiniMax dispatches. Exit 0 means converged with a synthesis written, 1 means budget exhausted, 2 means paused on a rate-limit sentinel.

## 4. RELATED

- [`SKILL.md`](../../../../SKILL.md)
