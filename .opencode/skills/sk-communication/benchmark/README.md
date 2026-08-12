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

This skill is benchmarked on advisor-routing accuracy: whether a projection-intent prompt (for example "make CLI output readable" or "claudish to english, privacy-first rewrite") routes to `sk-communication` as the advisor's top match. The harness is the skill-advisor scorer (`.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py`); dated capture runs live under `reports/`. The underlying `cli-communication-projection` package is verified separately by its own gate (`npm run check` in `packages/cli-communication-projection/`), not by this harness.

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
