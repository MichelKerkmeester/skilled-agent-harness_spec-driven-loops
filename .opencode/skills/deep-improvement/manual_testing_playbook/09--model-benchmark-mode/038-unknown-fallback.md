---
title: "MB-038 -- Unknown Scorer and Unknown Mode Fallback"
description: "Manual validation scenario for MB-038: Unknown Scorer and Unknown Mode Fallback."
feature_id: "MB-038"
category: "Model-Benchmark Mode"
---

# MB-038 -- Unknown Scorer and Unknown Mode Fallback

This document captures the canonical manual-testing contract for `MB-038`.

---

## 1. OVERVIEW

This scenario validates that an unknown `--scorer` value warns to stderr and defaults to `pattern`, and that an unknown `--mode` value warns to stderr and falls back to `agent-improvement`. Both fallbacks complete without crashing.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Unknown Scorer and Unknown Mode Fallback for the model-benchmark entry point and scorer selection.
- Real user request: `Validate that an unknown scorer defaults to pattern and an unknown mode falls back to agent-improvement, both with a stderr warning.`
- Prompt: `Validate that unknown --scorer and unknown --mode values warn and fall back instead of crashing.`
- Expected execution process: Run `run-benchmark.cjs` with `--scorer bogus`, then run `loop-host.cjs` with `--mode=bogus` against a real candidate; capture stdout, stderr, exit code, and generated files; then execute the verification block against the same run artifacts.
- Expected signals: Unknown-scorer run completes with exit code 0; stderr contains `unknown --scorer 'bogus', defaulting to 'pattern'`; the unknown-scorer `report.json` has `scoringMethod: "pattern"`; unknown-mode run completes (does not crash); stderr contains `unknown mode 'bogus', defaulting to 'agent-improvement'`; the unknown-mode run routes to `score-candidate.cjs` and produces a score JSON, not a benchmark report
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: The unknown scorer falls back to `pattern` (report `scoringMethod: "pattern"`) and the unknown mode falls back to `agent-improvement` (score JSON, not a benchmark report), each with a stderr warning and no crash -- confirming both fallbacks are graceful.

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
| MB-038 | Unknown Scorer and Unknown Mode Fallback | Validate Unknown Scorer and Unknown Mode Fallback | `Validate that unknown --scorer and unknown --mode values warn and fall back instead of crashing.` | rm -rf /tmp/mb-038 &amp;&amp; mkdir -p /tmp/mb-038 &amp;&amp; \<br>node .opencode/skills/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs \<br>  --profile .opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json \<br>  --outputs-dir /tmp/mb-038 ; \<br>node .opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs \<br>  --profile .opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json \<br>  --outputs-dir /tmp/mb-038 \<br>  --output /tmp/mb-038/report.json \<br>  --scorer bogus ; \<br>node .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs \<br>  --mode=bogus \<br>  --candidate=.opencode/agents/debug.md \<br>  --output=/tmp/mb-038/agent-score.json | Unknown-scorer run exits 0; stderr contains `unknown --scorer 'bogus', defaulting to 'pattern'`; `report.json` has `scoringMethod: "pattern"`; unknown-mode run does not crash; stderr contains `unknown mode 'bogus', defaulting to 'agent-improvement'`; unknown-mode run routes to `score-candidate.cjs` and produces a score JSON, not a benchmark report | `terminal transcript, command output (stderr included), generated files, and PASS/FAIL verdict` | The unknown scorer falls back to `pattern` and the unknown mode falls back to `agent-improvement`, each with a stderr warning and no crash -- confirming both fallbacks are graceful. | If the unknown scorer fails instead of falling back: check the `VALID_SCORERS` guard in `run-benchmark.cjs`<br>If no scorer warning appears: confirm the warning is written to stderr (not stdout)<br>If the unknown mode crashes or produces a benchmark report: check `resolveMode()` and `planInvocation()` in `loop-host.cjs`<br>If the agent-improvement fallback exits non-zero: confirm the `--candidate` path resolves so `score-candidate.cjs` has a valid target |

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
| `09--model-benchmark-mode/038-unknown-fallback.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement (Lane B: Model-Benchmark) |
| `../../scripts/shared/loop-host.cjs` | Mode-switching entry point and unknown-mode fallback |
| `../../scripts/model-benchmark/run-benchmark.cjs` | Benchmark runner and unknown-scorer fallback |
| `../../assets/model-benchmark/benchmark-profiles/default.json` | Shipped benchmark profile used by this scenario |

---

## 5. SOURCE METADATA

- Group: Model-Benchmark Mode
- Playbook ID: MB-038
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--model-benchmark-mode/038-unknown-fallback.md`
