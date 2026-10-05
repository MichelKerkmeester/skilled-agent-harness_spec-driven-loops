---
title: "Deviations: Table wording experiment"
description: "Changes to the pre-registered design, each recorded before the data it affects was collected."
trigger_phrases:
  - "table wording deviations"
importance_tier: "normal"
contextType: "implementation"
---
# Deviations: Table wording experiment

## 1. SECOND EXECUTOR

**What changed:** SWE-2 Max through Devin (`--model swe-2-max`) replaces DeepSeek V4.1 Flash as the second executor, on the full pre-registered schedule of 300 runs.

**Why:** Devin's daily usage quota blocked DeepSeek after 5 scored runs, and the operator chose SWE-2 Max, a free model on the same CLI. Recorded on 2026-10-05, before any SWE-2 run.

**Effect on the analysis:** the pooled primary metric combines Luna and SWE-2. The 5 DeepSeek runs are left out of the decision and reported on their own, so each executor stratum keeps its full schedule. The decision rule is unchanged.
