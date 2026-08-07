---
title: "Deep Review Strategy: session deep-context + deep-loop work"
description: Round plan for the 10-round gpt-5.5-fast-xhigh deep review of the session's deep-context + deep-loop-runtime utilization work.
---

# Deep Review Strategy

**Target**: 28 changed code/contract files (commits 1d54e45..55fd158). **Executor**: cli-opencode `openai/gpt-5.5-fast --variant xhigh`, read-only, orchestrator-writes-state. **Dimension/slice-scoped per round** to fit the gpt-5.5-fast-xhigh timeout (broad audits time out; one dimension × a small cluster fits).

## Round plan

| Round | Dimension | Scope cluster |
|-------|-----------|---------------|
| R1 | correctness | deep-context: `reduce-state.cjs`, `loop-lock.cjs` |
| R2 | correctness | deep-loop-runtime: `fanout-run.cjs`, `convergence.cjs`, `coverage-graph-{db,signals,query}.ts`, `executor-config.ts` |
| R3 | correctness | deep-improvement: `scripts/shared/reduce-state.cjs`, `improvement-journal.cjs` |
| R4 | security | all changed `.cjs` scripts (cli dispatch, recursion guard, sandbox, temp-file/atomic safety, secrets, injection) |
| R5 | traceability | lock / executor-audit / `:with-context` wiring across review + improvement + benchmark + context YAMLs + speckit `complete.md`/`plan.md` |
| R6 | maintainability | the `.cjs` scripts (tsx-import duplication, inline fallbacks, dual-use safety, the 3 reduce-state copies) |
| R7 | correctness | the large context YAMLs (`deep_start-context-loop_{auto,confirm}.yaml`): classification, sweep, merge, convergence, lock-owner threading |
| R8 | cross-cutting | `coverage-graph-signals.ts` context-convergence math + `executor-config.ts` promptFramework field |
| R9 | adversarial-verify | re-challenge (refute) the surviving P0/P1 findings from R1–R8 |
| R10 | synthesis | coverage check + verdict (PASS / CONDITIONAL / FAIL), P0/P1/P2 rollup |

## Contract
- Seats read-only; the host (orchestrator) writes every iteration-NNN.md, deltas/iter-NNN.jsonl, and the state log (Gate-3-safe).
- Convergence via `deep-loop-runtime/scripts/convergence.cjs --loop-type review`.
- Strongest-restriction verdict: any surviving P0 → FAIL.
