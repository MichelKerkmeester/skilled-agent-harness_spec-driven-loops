# Iteration 002 — correctness

**Dimension:** correctness
**Prior findings:** P0=0 P1=1 P2=2 (across iterations 1)
**Session:** mimo-deepreview-013

---

## Files Reviewed

| File | Lines Inspected |
|------|----------------|
| `scripts/model-benchmark/scorer/grader/harness.cjs` | 60-240 |
| `scripts/skill-benchmark/d4-ablation.cjs` | 69-236 |
| `scripts/skill-benchmark/live-executor.cjs` | 75-108 |
| `scripts/skill-benchmark/score-skill-benchmark.cjs` | 96-208 |
| `scripts/skill-benchmark/run-skill-benchmark.cjs` | 236-269 |
| `scripts/model-benchmark/dispatch-model.cjs` | 380-528 |
| `scripts/model-benchmark/sweep-benchmark.cjs` | 270-465 |
| `scripts/skill-benchmark/build-report.cjs` | 27-153 |
| `SKILL.md` | 130-223 |

---

## Findings by Severity

### P1 (1 finding)

**R2-P1-001 — composeGraderPrompt hardcodes "Score D4 Hallucination only" in user prompt, contradicting D4-R task-outcome system prompt**

- **File:line:** `scripts/model-benchmark/scorer/grader/harness.cjs:136`
- **Claim:** `composeGraderPrompt` appends `'Score D4 Hallucination only. Return JSON only per the system prompt.'` as the final line of the user prompt. When `gradeTaskOutcome` (d4-ablation.cjs:183-198) calls `grader.gradeD4` with `system_prompt_path` pointing to `system-grader-task-outcome.md`, the system prompt instructs the grader to score "task-outcome usefulness" (file-change correctness + verification fit), but the user prompt contradicts this by saying "Score D4 Hallucination only." The grader model receives conflicting instructions: the system prompt defines a four-axis task-outcome rubric while the user prompt demands hallucination scoring.
- **Evidence:**
  - `harness.cjs:136`: `'Score D4 Hallucination only. Return JSON only per the system prompt.'` — hardcoded in `composeGraderPrompt`
  - `system-grader-task-outcome.md:3`: "Your job is to score ONE dimension — **task-outcome usefulness**" — the system prompt's actual instruction
  - `d4-ablation.cjs:189`: `system_prompt_path: TASK_OUTCOME_PROMPT_PATH` — the override that swaps in the task-outcome rubric
- **Impact:** The D4-R instrument's validity is compromised. The grader may: (a) follow the user prompt and score hallucination instead of task-outcome, producing a meaningless delta; (b) follow the system prompt but with reduced confidence due to conflicting instructions; (c) produce degraded/low-confidence scores. Since D4-R is the primary skill-usefulness signal for Lane C, this affects benchmark report accuracy.
- **Fix:** Parameterize the user prompt's final instruction in `composeGraderPrompt`. When `systemPromptPath` contains `task-outcome`, use `'Score task-outcome usefulness only.'` instead of `'Score D4 Hallucination only.'`. Alternatively, extract the dimension instruction from the system prompt's first heading.

### P2 (2 findings)

**R2-P2-001 — runDispatch does not default model to DEFAULT_MODEL**

- **File:line:** `scripts/skill-benchmark/live-executor.cjs:98`
- **Claim:** `runDispatch` destructures `model` from its argument but provides no default value. When callers like `d4-ablation.cjs:101` and `d4-ablation.cjs:217` pass `model` from `runD4Ablation`/`runD4RAblation` parameters, and the upstream caller (e.g., `run-skill-benchmark.cjs:247-248`) reads `model` from `process.env.SKILL_BENCH_OPENCODE_MODEL` (which may be undefined), the dispatch receives `undefined` as the model. `dispatchArgs` at line 76 then pushes `--model undefined` as a literal string argument. By contrast, `runLiveScenario` at line 232 correctly defaults: `const chosenModel = model || DEFAULT_MODEL`.
- **Evidence:**
  - `live-executor.cjs:98`: `function runDispatch({ prompt, dir, model, variant, extraEnv })` — no default for model
  - `live-executor.cjs:232`: `const chosenModel = model || DEFAULT_MODEL` — the higher-level function does default
  - `run-skill-benchmark.cjs:247`: `const model = process.env.SKILL_BENCH_OPENCODE_MODEL;` — can be undefined
- **Impact:** If `SKILL_BENCH_OPENCODE_MODEL` is unset, D4-R ablation dispatches will use `--model undefined`, causing either a CLI error or a silent fallback to a default model that may not match the operator's intent. The dispatch would fail, and `runD4RAblation` would return `score: null` (d4-ablation.cjs:219-220), silently dropping the D4-R signal.
- **Fix:** Add `model = model || DEFAULT_MODEL` at the top of `runDispatch`, matching the pattern in `runLiveScenario`.

**R2-P2-002 — Fallback grader parser hardcodes dim_id: 'D4' even for D4-R task-outcome responses**

- **File:line:** `scripts/model-benchmark/scorer/grader/harness.cjs:187`
- **Claim:** The score-only fallback parser in `parseGraderResponse` hardcodes `dim_id: 'D4'` when it cannot extract the full JSON. When the task-outcome grader (D4-R) returns a malformed response that triggers this fallback, the parsed result will carry `dim_id: 'D4'` instead of `'D4R'`, misidentifying the dimension.
- **Evidence:**
  - `harness.cjs:187`: `dim_id: 'D4'` — hardcoded in the fallback branch
  - `system-grader-task-outcome.md:13`: `"dim_id": "D4R"` — the task-outcome prompt specifies D4R
- **Impact:** Low. The `dim_id` in the parsed response is informational — `gradeTaskOutcome` in `d4-ablation.cjs` already knows it's grading D4-R and wraps the result in a `d4r: {}` key. The misidentified `dim_id` would only affect debugging or report inspection. No score computation uses `dim_id`.
- **Fix:** Accept a `dimIdHint` parameter in `parseGraderResponse` (default `'D4'`), and pass `'D4R'` when calling from the task-outcome path.

---

## Traceability Checks

| Check | Status | Detail |
|-------|--------|--------|
| D4-R score formula `0.5 + (on−off)/2` in d4-ablation.cjs vs changelog | ✅ PASS | `d4-ablation.cjs:196` matches changelog claim. Both D4 (line 81) and D4-R use identical delta math. |
| D4-R contamination guard mirrors D4 guard | ✅ PASS | `d4-ablation.cjs:226-229` mirrors lines 110-113. Both check `activation.activated` and `observedReads.length`. |
| `augmentWithD4R` gated on `--d4 && --trace-mode live` | ✅ PASS | `run-skill-benchmark.cjs:284` enforces both conditions. |
| `composeGraderPrompt` system_prompt_path override works | ⚠️ PARTIAL | The override correctly swaps the system prompt (harness.cjs:90-91,117), but the user prompt contradicts it. See P1-001. |
| sweep-benchmark uses dispatcher output correctly | ✅ PASS | `sweep-benchmark.cjs:319-320` re-parses raw stdout (redundant with `buildEnvelope.output` but equivalent). No correctness impact. |
| dispatch-model.cjs `buildSpawnSpec` sets cwd for all executors | ✅ PASS | Line 500: `cwd: dir` applied unconditionally (F-P1-1 fix verified). |
| SKILL.md pseudocode missing SKILL_BENCHMARK runtime_assets | ⚠️ PRIOR | Carried from R1-P1-001, no new evidence. |

---

## Verdict

**CONDITIONAL** — No P0 findings. One new P1: the D4-R grader user prompt contradicts the task-outcome system prompt (harness.cjs:136), potentially invalidating the D4-R usefulness signal. Two new P2 findings: missing model default in `runDispatch` and hardcoded `dim_id` in fallback parser. All other correctness checks pass.

---

## Next Dimension

**security** — Focus: env var injection in `runDispatch` (`extraEnv` merge at live-executor.cjs:105), `MK_SKILL_ADVISOR_HOOK_DISABLED` guard in d4-ablation.cjs, untrusted output delimiter in harness.cjs, `DEEP_AGENT_DISPATCH_WRITE` gate in dispatch-model.cjs.
