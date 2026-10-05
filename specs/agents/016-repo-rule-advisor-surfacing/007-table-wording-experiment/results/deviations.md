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

## 2. DEEPSEEK THROUGH OPENCODE GO

**What changed:** DeepSeek V4.1 Flash at max through OpenCode Go (`opencode run -m opencode-go/deepseek-v4.1-flash --variant max`) replaces SWE-2 Max as the second executor, on the full pre-registered schedule of 300 runs. This returns the second seat to the model the pre-registration named, through a different CLI.

**Why:** Devin rate-limited SWE-2 Max after 171 scored runs here, and the operator chose DeepSeek through OpenCode Go. Recorded on 2026-10-05, before any OpenCode run.

**Effect on the analysis:** the pooled decision combines Luna and DeepSeek through OpenCode. The SWE-2 runs and the 5 earlier DeepSeek runs through Devin are reported as their own strata and left out of the decision. The decision rule is unchanged.

**Dispatch notes:** runs pass `--auto` so headless edits are approved, like Devin's dangerous mode. Each run directory is a disposable copy with its own fresh git repository, so a stray write cannot reach the real repository. No agent persona is added to the prompt, because the executor's own behaviour is what the experiment measures.
