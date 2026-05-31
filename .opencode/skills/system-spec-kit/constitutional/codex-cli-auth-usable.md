---
title: "Codex CLI — Auth Is Usable, Skip the Pre-Flight ASK"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  - codex auth
  - codex exec
  - cli-codex
  - codex auth status
  - codex login
  - OPENAI_API_KEY
  - codex pre-flight
---

# Codex CLI — Auth Is Usable, Skip the Pre-Flight ASK

## Rule

The codex CLI is authenticated and usable on this machine for cross-AI dispatch (`codex exec ...`). Do NOT block on the cli-codex auth pre-flight, and do NOT ask the user to configure auth.

## Why

Auth is via ChatGPT OAuth — `~/.codex/auth.json` is present and valid (owner confirmed 2026-05-28: "codex has correct auth, you can use it"). `OPENAI_API_KEY` is intentionally unset. The cli-codex skill's pre-flight runs `codex auth status`, but that subcommand does NOT exist in `codex-cli 0.133.0` (returns `unrecognized subcommand 'status'`), so the skill's decision tree falsely lands on "both missing → ASK user." That is a false negative; auth is actually fine.

## How to apply

When dispatching cli-codex, skip the auth ASK and run `codex exec --model gpt-5.5 -c model_reasoning_effort="..." -c service_tier="fast" ...` directly. Only if a real dispatch returns an auth error mid-run should you re-check — and use `codex login` / `codex doctor` (valid subcommands), never `codex auth status`. Note: heavy multi-file work is separately steered toward native Opus subagents over codex per the operator's 2026-05-30 reliability override — this rule only says auth is not a blocker, not that codex is the preferred executor.
