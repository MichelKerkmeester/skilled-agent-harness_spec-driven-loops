---
title: "sk-communication Benchmark Artifacts"
description: "Benchmark inputs and run reports for sk-communication, kept beside the skill they measure."
trigger_phrases:
  - "sk-communication benchmark"
  - "sk-communication benchmark artifacts"
importance_tier: "important"
contextType: "general"
---

# sk-communication Benchmark Artifacts

> Inputs and reports for benchmarking `sk-communication`, kept beside the skill they measure.

---

## 1. OVERVIEW

TODO describe what this skill is benchmarked on and by which harness.

## 2. LAYOUT

| Path | Contents |
|---|---|
| [`reports/`](./reports/) | One folder per run, indexed by `reports/README.md` |

## 3. RUNNING A BENCHMARK

The Lane C harness reads this skill's manual-testing playbook as its default corpus and
writes a dated run folder under `reports/`:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \
  --skill sk-communication
```
