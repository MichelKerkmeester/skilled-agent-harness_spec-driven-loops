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

> Archive status: the Lane C harness that produced these reports was retired with the skill-benchmark lane, so none of them can be re-run from the current tree. They stay as frozen historical evidence.

---

## 1. OVERVIEW

This skill is benchmarked on advisor-routing accuracy: whether a projection-intent prompt (for example "make CLI output readable" or "claudish to english, privacy-first rewrite") routes to `sk-communication` as the advisor's top match. The harness is the skill-advisor scorer (`.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`); dated capture runs live under `reports/`. The underlying `cli-communication-projection` package is verified separately by its own gate (`npm run check` in `.skilled/skills/sk-communication/cli-communication-projection/`), not by this harness.

---

## 2. LAYOUT

| Path | Contents |
|---|---|
| [`reports/`](./reports/) | One folder per run, indexed by `reports/README.md` |
| [`reply-harness/`](./reply-harness/) | The reply comparison harness. Frozen case set, weighted rubric, prompt builder, mechanical scorer, reply blinding and the condition comparison, documented in its own `README.md` |

