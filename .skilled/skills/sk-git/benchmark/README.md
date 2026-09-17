---
title: "sk-git Skill-Benchmark Artifacts"
description: "Benchmark archive for the flat sk-git skill, including live run reports and supporting evidence."
trigger_phrases:
  - "sk-git benchmark"
  - "sk-git skill-benchmark artifacts"
  - "sk-git live benchmark"
importance_tier: "important"
contextType: "general"
---

# sk-git Skill-Benchmark Artifacts

> Curated reports and supporting evidence for benchmark runs of the flat `sk-git` skill. Each run-label folder contains one run's archived outputs; this file indexes them.

## 1. RUN-LABEL INDEX

Run labels are additive and immutable. Never overwrite or repurpose an existing run-label folder; archive each new run in a new sibling folder.

| Run label | Trace mode | Verdict | Status | Notes |
|---|---|---|---|---|
| [`2026-07-10--live--kimi-2-7`](./reports/2026-07-10--live--kimi-2-7/) | live | PASS | archived | 22 scenarios; 22 PASS |
| [`2026-07-10--live--glm-5-2-high`](./reports/2026-07-10--live--glm-5-2-high/) | live | PASS | archived | 22 scenarios; 21 PASS, 1 FAIL |

Each run folder has its own README, machine report, rendered report, CSV results, failure details, findings, and source record. The run-local README is authoritative for the files and fields captured by that run.

---

## 2. ARCHIVE CONVENTION

Benchmark evidence is retained beside the skill it measures. A later execution must use a fresh run-label folder, preserving prior reports for comparison and audit. Existing run labels are never overwritten, renamed for a different execution, or repurposed.
