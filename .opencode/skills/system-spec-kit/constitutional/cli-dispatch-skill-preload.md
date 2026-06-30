---
title: "CLI DISPATCH — Skill Preload Mandate"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-06-08"
last_confirmed_source: "git-log-last-touch"
triggerPhrases:
  # CLI binaries
  - cli-opencode
  - cli-claude-code
  - cli-opencode
  - opencode
  # Model names that imply a CLI route
  - DeepSeek v4
  - deepseek-v4
  - GLM 5.1
  - glm-5.1
  - Kimi k2.7
  - kimi-k2.7
  - gpt-5.5
  - gpt 5.5
  # Dispatch verbs
  - dispatch opencode
  - dispatch cli
  - cli dispatch
  - cli prompt
  - cli composition
---

# CLI Dispatch — Skill Preload Mandate

## Rule

**Before composing any prompt for `cli-X` (opencode / claude-code / opencode), you MUST `Read` `.opencode/skills/cli-X/SKILL.md` first.**

Advisor confidence ≥ 0.8 recommending the skill does NOT waive this. The recommendation is a routing signal; loading the file is the enforcement step.

## Why

Each cli-X skill carries a **model-specific prompt-quality contract** that is NOT in the binary's `--help` output. Skipping skill load = skipping contract = degraded output. Concrete examples:

- **OpenCode direct-provider models** (cli-opencode/SKILL.md): require the skill's invocation shape and self-dispatch guard.
- **DeepSeek-backed opencode models** (cli-opencode/SKILL.md): require `--pure` flag because DeepSeek API rejects `:` in MCP tool names.

These rules ONLY live in the skill files. Authoring a dispatch without reading them produces underwhelming output that's hard to diagnose after the fact.

## How to apply

1. Any time you write `<binary> --model <X>` for a CLI that has a corresponding `cli-X` skill:
   - First `Read` `.opencode/skills/cli-X/SKILL.md`
   - Then compose the prompt per that skill's §3 (HOW IT WORKS) + relevant `assets/prompt_templates.md` if cited
2. For deep-loop / deep-review iter dispatches: ALSO read the equivalent iter contract for the chosen CLI
3. If `sk-prompt` skill is available, hand prompt composition to `sk-prompt` per the cli-X skill's directive
4. When dispatching: use the canonical invocation shape from the skill's §3 Core Invocation Pattern — copy-edit, not synthesize from memory

## When this rule does NOT apply

- Read-only `opencode --version` / `cli-X --help` calls (no prompt composition involved)
- The current runtime IS the target CLI (self-invocation guard per each cli-X skill's §2 — different concern, but skill load still avoids self-dispatch loop)

## Failure mode signal

If you find yourself authoring a `--model deepseek-v4` / `--model gpt-5.5` invocation without having read `cli-X/SKILL.md` in this session, STOP. Read the skill. Recompose the prompt. The first attempt was incomplete by definition.
