---
title: "MB-039 -- Default Pattern Scorer"
description: "Manual validation scenario for MB-039: Default Pattern Scorer."
feature_id: "MB-039"
category: "Model-Benchmark Mode"
---

# MB-039 -- Default Pattern Scorer

This document captures the canonical manual-testing contract for `MB-039`.

---

## 1. OVERVIEW

This scenario validates that `run-benchmark.cjs` defaults to the byte-identical heading/pattern matcher and stamps `scoringMethod: "pattern"` on both the report and the appended `benchmark_run` state row when no `--scorer` flag is provided.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Default Pattern Scorer for the model-benchmark scoring path with the default scorer selection.
- Real user request: `Validate that run-benchmark without --scorer uses the pattern matcher and stamps scoringMethod: pattern.`
- Prompt: `Validate that the default run-benchmark scorer is the pattern matcher and the report carries scoringMethod: pattern.`
- Expected execution process: Materialize the default profile fixtures, then run `run-benchmark.cjs` with no `--scorer` flag; capture stdout, stderr, exit code, and generated files; then execute the verification block against the same run artifacts.
- Expected signals: Benchmark completes with exit code 0; `report.json` has `status: "benchmark-complete"`; `report.json` has `scoringMethod: "pattern"`; each `fixtures[]` entry carries a heading/pattern result with `missingHeadings`, `missingPatterns`, and `forbiddenMatches` arrays; NO `dimensions` object on any fixture entry (pattern path emits no per-dimension scores); appended `benchmark_run` row carries `scoringMethod: "pattern"` and `mode: "model-benchmark"`
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Output has `scoringMethod: "pattern"` with heading/pattern fixture fields and no `dimensions` object -- confirming the default scorer is the pattern matcher and stays byte-identical to the pre-opt-in behavior.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders in the command sequence, especially `{spec}`, to disposable test paths.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Run the verification block against the same artifacts from the same execution.
5. Compare observed output against the expected signals and pass/fail criteria.
6. Record the scenario verdict with the decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MB-039 | Default Pattern Scorer | Validate Default Pattern Scorer | `Validate that the default run-benchmark scorer is the pattern matcher and the report carries scoringMethod: pattern.` | rm -rf /tmp/mb-039 &amp;&amp; mkdir -p /tmp/mb-039 &amp;&amp; \<br>node .opencode/skills/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs \<br>  --profile .opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json \<br>  --outputs-dir /tmp/mb-039 ; \<br>node .opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs \<br>  --profile .opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json \<br>  --outputs-dir /tmp/mb-039 \<br>  --output /tmp/mb-039/report.json | Benchmark completes with exit code 0; `report.json` has `status: "benchmark-complete"`; `report.json` has `scoringMethod: "pattern"`; each `fixtures[]` entry has `missingHeadings`, `missingPatterns`, `forbiddenMatches` arrays; NO `dimensions` object on any fixture entry; appended `benchmark_run` row carries `scoringMethod: "pattern"` and `mode: "model-benchmark"` | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | Output has `scoringMethod: "pattern"` with heading/pattern fixture fields and no `dimensions` object -- confirming the default scorer is the pattern matcher and stays byte-identical to the pre-opt-in behavior. | If `scoringMethod` is `5dim` or absent: confirm no `--scorer` flag was passed and check the `scorer` default in `run-benchmark.cjs`<br>If a `dimensions` object appears on fixtures: the 5-dim path leaked into the default scorer; inspect the `scorer === '5dim'` branch<br>If fixtures score 0 with `missing-output`: confirm the materializer ran and wrote `.md` files into `--outputs-dir` |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `09--model-benchmark-mode/039-default-pattern-scorer.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement (Lane B: Model-Benchmark) |
| `../../scripts/model-benchmark/run-benchmark.cjs` | Benchmark runner and default pattern scorer |
| `../../scripts/shared/materialize-benchmark-fixtures.cjs` | Fixture materializer run before scoring |
| `../../assets/model-benchmark/benchmark-profiles/default.json` | Shipped benchmark profile used by this scenario |

---

## 5. SOURCE METADATA

- Group: Model-Benchmark Mode
- Playbook ID: MB-039
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--model-benchmark-mode/039-default-pattern-scorer.md`
