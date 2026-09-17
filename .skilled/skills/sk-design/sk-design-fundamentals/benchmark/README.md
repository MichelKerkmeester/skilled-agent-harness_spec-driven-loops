---
title: "sk-design Benchmark Artifacts"
description: "Benchmark inputs and run reports for sk-design, kept beside the skill they measure."
trigger_phrases:
  - "sk-design benchmark"
  - "sk-design benchmark artifacts"
importance_tier: "important"
contextType: "general"
---

# sk-design Benchmark Artifacts

> Inputs and reports for benchmarking `sk-design`, kept beside the skill they measure.

---

## 1. OVERVIEW

TODO describe what this skill is benchmarked on and by which harness.

---

## 2. LAYOUT

| Path | Contents |
|---|---|
| [`reports/`](./reports/) | One folder per run, indexed by `reports/README.md` |

---

## 3. RUNNING A BENCHMARK

The Lane C harness reads this skill's manual-testing playbook as its default corpus and
writes a dated run folder under `reports/`:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \
  --skill sk-design
```
