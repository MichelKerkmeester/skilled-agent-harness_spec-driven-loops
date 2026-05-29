---
title: "MB-035 -- Mode Switch Routing via loop-host"
description: "Manual validation scenario for MB-035: Mode Switch Routing via loop-host."
feature_id: "MB-035"
category: "Model-Benchmark Mode"
---

# MB-035 -- Mode Switch Routing via loop-host

This document captures the canonical manual-testing contract for `MB-035`.

---

## 1. OVERVIEW

This scenario validates that `scripts/shared/loop-host.cjs` resolves `--mode=model-benchmark` to the materialize-then-run-benchmark pipeline while the default and `--mode=agent-improvement` routes stay on `score-candidate.cjs` unchanged.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Mode Switch Routing via loop-host for the model-benchmark entry point against the default agent-improvement path.
- Real user request: `Validate that loop-host --mode=model-benchmark runs materialize then run-benchmark while the default agent-improvement route stays unchanged.`
- Prompt: `Validate that loop-host routes model-benchmark mode to materialize plus run-benchmark and keeps agent-improvement default.`
- Expected execution process: Run `loop-host.cjs --mode=model-benchmark` against the shipped default profile, then run `loop-host.cjs` with no mode flag against a candidate; capture stdout, stderr, exit code, and generated files; then execute the verification block against the same run artifacts.
- Expected signals: model-benchmark run completes with exit code 0; `materialize-benchmark-fixtures.cjs` emits `status: "fixtures-materialized"` before scoring; `run-benchmark.cjs` writes `report.json` with `status: "benchmark-complete"`; the benchmark `report.json` carries `mode` evidence via the appended `benchmark_run` row (`mode: "model-benchmark"`); the default-route run (no `--mode`) routes to `score-candidate.cjs` and never loads `dispatch-model.cjs`; unknown mode warns and falls back to agent-improvement
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: The model-benchmark route produces a materialized fixture set plus a `benchmark-complete` report, and the default route stays on the agent-improvement scorer with no benchmark artifacts -- confirming the mode switch is wired and the default path is unchanged.

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
| MB-035 | Mode Switch Routing via loop-host | Validate Mode Switch Routing via loop-host | `Validate that loop-host routes model-benchmark mode to materialize plus run-benchmark and keeps agent-improvement default.` | rm -rf /tmp/mb-035 &amp;&amp; mkdir -p /tmp/mb-035/bench &amp;&amp; \<br>node .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs \<br>  --mode=model-benchmark \<br>  --profile=.opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json \<br>  --outputs-dir=/tmp/mb-035/bench \<br>  --output=/tmp/mb-035/bench/report.json \<br>  --state-log=/tmp/mb-035/improvement/agent-improvement-state.jsonl ; \<br>node .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs \<br>  --candidate=.opencode/agents/debug.md \<br>  --output=/tmp/mb-035/agent-score.json | model-benchmark run completes with exit code 0; `materialize-benchmark-fixtures.cjs` emits `status: "fixtures-materialized"`; `report.json` has `status: "benchmark-complete"`; appended `benchmark_run` row carries `mode: "model-benchmark"`; default-route run routes to `score-candidate.cjs` and produces a score JSON without benchmark fields; unknown mode warns and falls back to agent-improvement | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | The model-benchmark route materializes fixtures and writes a `benchmark-complete` report while the default route stays on the agent-improvement scorer -- confirming the mode switch routes correctly and the default path is unchanged. | If `report.json` is missing or all fixtures score 0 with `missing-output`: confirm `materialize-benchmark-fixtures.cjs` ran first and wrote the `.md` files into `--outputs-dir`<br>If the default route produces benchmark fields: check `planInvocation()` in `loop-host.cjs` for mode resolution<br>If unknown mode does not warn: verify `resolveMode()` writes the fallback notice to stderr |

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
| `09--model-benchmark-mode/035-mode-switch-routing.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-agent-improvement (Mode 4: Model-Benchmark) |
| `../../scripts/shared/loop-host.cjs` | Mode-switching entry point that resolves `--mode` and plans the invocation |
| `../../scripts/shared/materialize-benchmark-fixtures.cjs` | Fixture materializer run before scoring on the model-benchmark path |
| `../../scripts/model-benchmark/run-benchmark.cjs` | Benchmark runner invoked on the model-benchmark path |
| `../../assets/model-benchmark/benchmark-profiles/default.json` | Shipped benchmark profile used by this scenario |

---

## 5. SOURCE METADATA

- Group: Model-Benchmark Mode
- Playbook ID: MB-035
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--model-benchmark-mode/035-mode-switch-routing.md`
