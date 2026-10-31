---
title: "deep-improvement v1.18.0.0"
description: "The benchmark runner now refuses an unknown grader kind at startup, and a new script measures hallucination graders against operator labels without a model call by default."
trigger_phrases:
  - "deep-improvement v1.18.0.0"
  - "deep-improvement 1.18.0.0"
  - "unknown grader startup check"
  - "offline hallucination grader measurement"
importance_tier: "normal"
contextType: "general"
version: 1.18.0.0
---

A mistyped `--grader` value used to score with the mock stub and print nothing, so a benchmark report could carry fake hallucination numbers. This release turns that into a startup error. It also adds an offline script that tests whether the deterministic check, the local Deem grader or Jev agrees with operator labels on benchmark outputs.

> Spec folder: `specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader` (Level 1)

## What's New at a Glance

- **An unknown grader kind stops the run.** `run-benchmark.cjs` exits 2 before any profile loads when `--grader` is not `noop`, `mock` or `llm`, and it names the value and prints the usage line. `buildGraderFn` throws for the same values instead of returning the mock stub. `/deep:model-benchmark` already rejected other values, so its users see no change.
- **Hallucination graders can be measured offline.** `scripts/model-benchmark/scorer/score-d4-agreement.cjs --outputs <dir>` matches benchmark outputs to their fixtures, counts the operator's labels and prints the deterministic baseline with the fixed keep rule. By default it makes no model call and writes no file.
- **Two opt-in arms test a model against that baseline.** `--deem` asks the local Deem server and `--jev` asks Jev, each only after its own checks pass and once 30 outputs carry labels, at least 5 in each class. Each switch needs `--out <dir>`, records every call and prints one `verdict` line. A Jev run on untracked outputs also needs `--accept-payload`.

## Upgrade

No migration required. A script that passed any other grader kind to `run-benchmark.cjs` now exits 2 and must pass `noop`, `mock` or `llm`.
