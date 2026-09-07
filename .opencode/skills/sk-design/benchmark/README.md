---
title: "sk-design Skill-Benchmark Artifacts"
description: "Benchmark tree for the sk-design parent hub, scored by the deep-improvement Lane C harness. No hub-level Lane C run is archived here yet; the per-mode baselines that do exist are indexed below."
trigger_phrases:
  - "sk-design benchmark"
  - "sk-design skill-benchmark artifacts"
  - "sk-design routing benchmark"
importance_tier: "important"
contextType: "general"
---

# sk-design Skill-Benchmark Artifacts

> Reports and inputs for benchmarking how well the `sk-design` parent hub is routed, discovered and
> used in practice, kept beside the skill they measure. Each run-label folder holds one run's
> rendered report pair, and this file indexes them.

---

## 1. OVERVIEW

The deep-improvement Lane C skill-benchmark harness scores a hub against its own playbook scenarios
across five dimensions: D1 routing, D2 discovery, D3 efficiency, D4 usefulness and D5 connectivity.
This tree holds the dual reports each run writes, one run-label folder per run.

**No hub-level Lane C run is archived here yet.** This file records the convention and the place a
run lands, so that the absence is legible rather than silent. Do not read an empty tree as a passing
score.

---

## 2. WHAT ALREADY EXISTS, AND WHERE

Two modes carry their own baselines, measured before the hub existed:

| Baseline | Path |
|----------|------|
| Fundamentals | `sk-design-fundamentals/benchmark/` |
| Diagram | `sk-design-diagram/benchmark/` |

A mode baseline measures that mode. It does not measure whether a request reaches the hub in the
first place, which is what a hub-level run scores, so neither substitutes for a run archived here.

---

## 3. ADDING A RUN

Write the report pair into a folder named for the run label, then add a row to section 2 naming what
the run measured and when. A run whose reports exist but which nothing indexes is a run the next
reader will not find.
