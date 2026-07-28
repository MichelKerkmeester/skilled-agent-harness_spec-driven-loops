---
title: "Fable Main Loop — Subagents Must Be Opus or Sonnet"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-07-28"
last_confirmed_source: "operator-directive"
triggerPhrases:
  - dispatch subagent
  - spawn agent
  - fork agent
  - agent tool
  - task tool
  - subagent model
  - fable subagent
  - parallel agents
---

# Fable Main Loop — Subagents Must Be Opus or Sonnet

## Rule

When the main session runs on a **Fable** model, every subagent dispatch MUST carry an explicit `model: "opus"` or `model: "sonnet"` override. Never dispatch a `fork` subagent (forks always inherit the parent model, even with an override), never omit `model` (omission inherits Fable), and never request `haiku` or `fable` for a subagent.

## Why

The operator directed (2026-07-28) that Fable must not run Fable subagents. A `fable-subagent-guard.mjs` PreToolUse hook enforces this in `.claude/settings.json` from the next session onward — but hook config is snapshotted at session start, so sessions already running when the hook landed have no technical enforcement. This rule closes that gap: the policy binds regardless of whether the hook fires.

## How to apply

1. On any Agent/Task dispatch while Fable drives the main loop, pass `model: "opus"` or `model: "sonnet"` explicitly.
2. Need the parent's full context (a fork)? Restructure into a non-fork dispatch with an explicit allowed model and pass the needed context in the prompt.
3. If the hook denies a dispatch, the denial message names the fix — follow it rather than retrying variants.
