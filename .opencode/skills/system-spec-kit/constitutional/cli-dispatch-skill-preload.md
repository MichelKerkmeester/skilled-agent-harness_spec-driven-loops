---
title: "CLI DISPATCH — Skill Preload Mandate"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  # CLI binaries
  - cli-devin
  - cli-codex
  - cli-claude-code
  - cli-opencode
  - devin
  - codex
  # Model names that imply a CLI route
  - SWE 1.6
  - SWE-1.6
  - swe-1.6
  - swe1.6
  - DeepSeek v4
  - deepseek-v4
  - GLM 5.1
  - glm-5.1
  - Kimi k2.6
  - kimi-k2.6
  - gpt-5.5
  - gpt 5.5
  # Dispatch verbs
  - dispatch devin
  - dispatch codex
  - dispatch cli
  - cli dispatch
  - cli prompt
  - cli composition
---

# CLI Dispatch — Skill Preload Mandate

## Rule

**Before composing any prompt for `cli-X` (devin / codex / claude-code / opencode), you MUST `Read` `.opencode/skills/cli-X/SKILL.md` first.**

Advisor confidence ≥ 0.8 recommending the skill does NOT waive this. The recommendation is a routing signal; loading the file is the enforcement step.

## Why

Each cli-X skill carries a **model-specific prompt-quality contract** that is NOT in the binary's `--help` output. Skipping skill load = skipping contract = degraded output. Concrete examples:

- **SWE-1.6 contract** (cli-devin/SKILL.md §3) requires: RCAF framework (Role/Context/Action/Format) + explicit pre-planning block + medium-density (3-4 ordered steps with per-step acceptance) + NOT pairing BUILD with strict bundle-gate wording. Verbose constraint language pushes SWE-1.6 toward defensive output rather than direct code.
- **Codex gpt-5.5 high fast** (cli-codex/SKILL.md): requires `service_tier=fast` explicit pass; never relies on global config default.
- **DeepSeek-backed opencode models** (cli-opencode/SKILL.md): require `--pure` flag because DeepSeek API rejects `:` in MCP tool names.

These rules ONLY live in the skill files. Authoring a dispatch without reading them produces underwhelming output that's hard to diagnose after the fact.

## How to apply

1. Any time you write `<binary> --model <X>` for a CLI that has a corresponding `cli-X` skill:
   - First `Read` `.opencode/skills/cli-X/SKILL.md`
   - Then compose the prompt per that skill's §3 (HOW IT WORKS) + relevant `assets/prompt_templates.md` if cited
2. For deep-loop / deep-review iter dispatches: ALSO read `references/deep-loop-iter-contract.md` (cli-devin) or the equivalent contract for the chosen CLI
3. If `sk-prompt` skill is available, hand prompt composition to `sk-prompt` per the cli-X skill's directive
4. When dispatching: use the canonical invocation shape from the skill's §3 Core Invocation Pattern — copy-edit, not synthesize from memory
5. The external Gemini binary has no project `cli-gemini` skill; use the owning executor workflow documentation instead of trying to preload a deleted skill.

## When this rule does NOT apply

- Read-only `devin --version` / `codex --version` / `cli-X --help` calls (no prompt composition involved)
- The current runtime IS the target CLI (self-invocation guard per each cli-X skill's §2 — different concern, but skill load still avoids self-dispatch loop)

## Failure mode signal

If you find yourself authoring a `--model swe-1.6` / `--model deepseek-v4` / `--model gpt-5.5` invocation without having read `cli-X/SKILL.md` in this session, STOP. Read the skill. Recompose the prompt. The first attempt was incomplete by definition.
