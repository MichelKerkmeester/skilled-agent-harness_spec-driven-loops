---
title: "MB-037 -- Opt-In 5-Dimension Scorer"
description: "Manual validation scenario for MB-037: Opt-In 5-Dimension Scorer."
feature_id: "MB-037"
category: "Model-Benchmark Mode"
---

# MB-037 -- Opt-In 5-Dimension Scorer

This document captures the canonical manual-testing contract for `MB-037`.

---

## 1. OVERVIEW

This scenario validates that `run-benchmark.cjs --scorer 5dim` routes materialized outputs through `scripts/model-benchmark/scorer/score-model-variant.cjs`, stamps `scoringMethod: "5dim"`, and emits per-dimension D1-D5 scores per fixture while staying deterministic under the default `--grader noop`.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Opt-In 5-Dimension Scorer for the model-benchmark scoring path with the 5dim scorer and the deterministic noop grader.
- Real user request: `Validate that run-benchmark --scorer 5dim produces scoringMethod: 5dim with per-dimension D1-D5 scores.`
- Prompt: `Validate that the opt-in 5dim scorer stamps scoringMethod: 5dim and emits D1-D5 dimension scores per fixture.`
- Expected execution process: Materialize the default profile fixtures, then run `run-benchmark.cjs` with `--scorer 5dim --grader noop`; capture stdout, stderr, exit code, and generated files; then execute the verification block against the same run artifacts.
- Expected signals: Benchmark completes with exit code 0; `report.json` has `status: "benchmark-complete"`; `report.json` has `scoringMethod: "5dim"`; each `fixtures[]` entry carries `scoringMethod: "5dim"` and a `dimensions` object with keys `D1`, `D2`, `D3`, `D4`, `D5`; each dimension value is a number in `0.0`-`1.0`; `D4` equals `1.0` under the deterministic noop grader (no model dispatch); appended `benchmark_run` row carries `scoringMethod: "5dim"` and `mode: "model-benchmark"`
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Output has `scoringMethod: "5dim"` with a per-fixture `dimensions` object containing D1-D5 numeric scores and `D4: 1.0` under noop -- confirming the opt-in 5-dim scorer routes through the ported scorer and stays deterministic.

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
| MB-037 | Opt-In 5-Dimension Scorer | Validate Opt-In 5-Dimension Scorer | `Validate that the opt-in 5dim scorer stamps scoringMethod: 5dim and emits D1-D5 dimension scores per fixture.` | rm -rf /tmp/mb-037 &amp;&amp; mkdir -p /tmp/mb-037 &amp;&amp; \<br>node .opencode/skills/deep-agent-improvement/scripts/shared/materialize-benchmark-fixtures.cjs \<br>  --profile .opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json \<br>  --outputs-dir /tmp/mb-037 ; \<br>node .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs \<br>  --profile .opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json \<br>  --outputs-dir /tmp/mb-037 \<br>  --output /tmp/mb-037/report.json \<br>  --scorer 5dim \<br>  --grader noop | Benchmark completes with exit code 0; `report.json` has `status: "benchmark-complete"`; `report.json` has `scoringMethod: "5dim"`; each `fixtures[]` entry has `scoringMethod: "5dim"` and a `dimensions` object with keys `D1`-`D5`; each dimension value is numeric in `0.0`-`1.0`; `D4` equals `1.0` under noop; appended `benchmark_run` row carries `scoringMethod: "5dim"` and `mode: "model-benchmark"` | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | Output has `scoringMethod: "5dim"` with a per-fixture `dimensions` object containing D1-D5 numeric scores and `D4: 1.0` under noop -- confirming the opt-in 5-dim scorer routes through the ported scorer and stays deterministic. | If `scoringMethod` is `pattern`: confirm `--scorer 5dim` was passed and check the scorer selection in `run-benchmark.cjs`<br>If `dimensions` is missing or has fewer than 5 keys: inspect `scoreFixture5dim()` and the `dimensions` mapping in `score-model-variant.cjs`<br>If `D4` is not `1.0`: confirm `--grader noop` was used; `mock` and `llm` graders produce different D4 values<br>If a `require` error references the scorer tree: confirm `scripts/model-benchmark/scorer/score-model-variant.cjs` exists and resolves |

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
| `09--model-benchmark-mode/037-optin-5dim-scorer.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-agent-improvement (Lane B: Model-Benchmark) |
| `../../scripts/model-benchmark/run-benchmark.cjs` | Benchmark runner and scorer selection |
| `../../scripts/model-benchmark/scorer/score-model-variant.cjs` | Ported 120/003 five-dimension scorer (D1-D5 plus pluggable grader) |
| `../../scripts/shared/materialize-benchmark-fixtures.cjs` | Fixture materializer run before scoring |
| `../../assets/model-benchmark/benchmark-profiles/default.json` | Shipped benchmark profile used by this scenario |

---

## 5. SOURCE METADATA

- Group: Model-Benchmark Mode
- Playbook ID: MB-037
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--model-benchmark-mode/037-optin-5dim-scorer.md`
