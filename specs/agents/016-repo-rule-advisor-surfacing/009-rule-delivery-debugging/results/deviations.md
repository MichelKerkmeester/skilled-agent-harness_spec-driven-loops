---
title: "Deviations: Rule delivery debugging"
description: "Changes to a pre-registered design, each recorded before the data it affects was collected."
trigger_phrases:
  - "rule delivery deviations"
importance_tier: "normal"
contextType: "implementation"
---
# Deviations: Rule delivery debugging

## 1. SECOND REPLICATION EXECUTOR

**What changed:** in `preregistration-2.md`, DeepSeek V4.1 Flash at xhigh through OpenCode's Cline provider (`-m cline-pass/cline-pass/deepseek-v4.1-flash --variant xhigh`) replaces GPT-6 Luna, on the same schedule of 90 runs.

**Why:** Codex hit its usage limit as the replication started, with a reset at 13:03, and the operator earlier chose not to keep spending the Codex allowance on these experiments. Recorded on 2026-10-05 at 11:05, before any Cline run of the replication. No Luna run of the replication was recorded, because the harness drops quota failures.

**Effect on the analysis:** the pooled decision combines DeepSeek through OpenCode Go and DeepSeek through Cline. The decision rule is unchanged.
