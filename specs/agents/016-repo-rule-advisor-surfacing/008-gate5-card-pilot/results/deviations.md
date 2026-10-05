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

## 2. DEEPSEEK THROUGH OPENCODE GO

**What changed:** DeepSeek V4.1 Flash at max through OpenCode Go (`opencode run -m opencode-go/deepseek-v4.1-flash --variant max`) replaces SWE-2 Max as the second executor, on the full pre-registered schedule of 360 runs. This returns the second seat to the model the pre-registration named, through a different CLI.

**Why:** Devin rate-limited SWE-2 Max after 23 scored runs here, and the operator chose DeepSeek through OpenCode Go. Recorded on 2026-10-05, before any OpenCode run.

**Effect on the analysis:** the pooled decision combines Luna and DeepSeek through OpenCode. The SWE-2 runs and the 5 earlier DeepSeek runs through Devin are reported as their own strata and left out of the decision. The decision rule is unchanged.

**Dispatch notes:** runs pass `--auto` so headless edits are approved, like Devin's dangerous mode. Each run directory is a disposable copy with its own fresh git repository, so a stray write cannot reach the real repository. No agent persona is added to the prompt, because the executor's own behaviour is what the experiment measures.
