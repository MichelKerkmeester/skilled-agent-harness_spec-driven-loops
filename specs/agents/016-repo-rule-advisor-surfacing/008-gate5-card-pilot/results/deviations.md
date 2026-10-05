---
title: "Deviations: Gate 5 card pilot"
description: "Changes to the pre-registered design, each recorded before the data it affects was collected."
trigger_phrases:
  - "card pilot deviations"
importance_tier: "normal"
contextType: "implementation"
---
# Deviations: Gate 5 card pilot

## 1. SECOND EXECUTOR AND THE LUNA STOP

**What changed:** SWE-2 Max through Devin (`--model swe-2-max`) replaces DeepSeek V4.1 Flash as the second executor, on the full pre-registered schedule of 360 runs. Luna stays at the 235 of 360 runs it completed before a Codex usage limit stopped it, and is not resumed, so the operator's Codex allowance stays free.

**Why:** Devin's daily usage quota blocked DeepSeek before any scored run, and the operator chose SWE-2 Max, a free model on the same CLI. Recorded on 2026-10-05, before any SWE-2 run.

**Effect on the analysis:** the pooled metrics combine Luna's 235 runs and SWE-2's 360. Both arms are interleaved in one shuffled order, so the Luna stop leaves the arms balanced, at 115 full and 120 cards runs. The decision rule is unchanged.
