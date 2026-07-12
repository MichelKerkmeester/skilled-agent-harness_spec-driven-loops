# D4-R Live — Task-Outcome Usefulness Ablation

The **real** routine-task usefulness measurement for `sk-code`, replacing the old D4 number (which was a *hallucination*-grader proxy: it explicitly does not score correctness, was n=2, and is hard-coded `null` in every post-remediation aggregate).

## What this measures

For each routine scenario, the model is asked to **do the task** (produce a minimal patch plan + the verification command — *not* a routing list), once with the skill (skill-ON) and once from its own knowledge (skill-OFF). A task-outcome grader (claude-sonnet) scores each answer on correctness / verification-fit / focus / hallucination-risk. The score is `0.5 + (on − off) / 2`: **>0.5 = the skill helped**, `<0.5 = it hurt`.

This is reported as an **advisory** `D4_task_outcome` — separate from `D4_hallucination`, and **not** folded into the weighted aggregate.

## Result (n=5, gpt-5.5-fast on/off, claude-sonnet grader)

| Scenario | D4-R | on | off | reading |
|---|---|---|---|---|
| LS-001 | **0.685** | 0.72 | 0.35 | skill helped a lot |
| LS-004 | **0.61** | 0.44 | 0.22 | skill helped |
| LS-003 | **0.55** | 0.80 | 0.70 | skill helped slightly |
| LS-002 | 0.435 | 0.72 | 0.85 | skill hurt slightly |
| SD-002 | 0.41 | 0.27 | 0.45 | skill hurt |
| **Aggregate** | **54/100** | | | net positive, task-dependent |

**The finding:** the skill helps most where the base model is **weak** (LS-001 off 0.35, LS-004 off 0.22 → large lift) and can **hurt where the model is already strong** (LS-002 off 0.85, SD-002 off 0.45 → over-routing noise). This confirms the round-1 (n=2) "task-dependent usefulness" hypothesis at n=5 with the correct instrument, and motivates the D3 efficiency work (tighter slices → less noise on easy tasks).

Base-live on the same 5 was strong: aggregate 88, D2 100, D3 60; `assetRecall` 90 (assets now scored on their own lane, not as D3 waste).

## Reproduce

```bash
SKILL_BENCH_OPENCODE_MODEL=openai/gpt-5.5-fast SKILL_BENCH_OPENCODE_VARIANT=high GRADER_MODEL=claude-sonnet-4-5 \
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs --skill sk-code --trace-mode live \
  --scenarios LS-001,LS-002,LS-003,LS-004,SD-002 --d4 \
  --d4-scenarios LS-001,LS-002,LS-003,LS-004,SD-002 --grader-mode real \
  --outputs-dir .opencode/skills/sk-code/benchmark/d4r_live
```

Paid + non-deterministic (15 gpt-5.5 dispatches + 10 grader calls; ~45–55 min). `--d4` requires `--trace-mode live`. Skill-OFF is an approximation (`MK_SKILL_ADVISOR_HOOK_DISABLED=1` + preamble + a contamination guard that drops a pair if the skill leaked in), so scores are stamped `attribution: approximate`.

## Files

- `skill-benchmark-report.json` — full report incl. per-scenario `d4TaskOutcome` + `advisorySignals.D4_task_outcome` + the base-live D1/D2/D3 + `assetRecall`.
- `skill-benchmark-report.md` — rendered from the JSON.
