---
title: Claude Code — Prompt Quality Card
description: Fast-path prompt discipline for Claude Code dispatches; frameworks + CLEAR are canonical in sk-prompt.
---

# Claude Code — Prompt Quality Card

Fast-path discipline for Claude Code dispatch prompts. Framework selection, CLEAR scoring, and density notes are owned by the canonical card; this card covers only Claude Code model overrides and the executor-specific escalation path.

## 1. OVERVIEW

### Purpose

This card is the Claude Code fast-path prompt-quality reference; it delegates the framework table + CLEAR check to the canonical card and records only Claude Code-specific model overrides plus the precedence rule.

### Usage

Compose a dispatch prompt by starting from the shared layer (canonical card), applying the Claude Code model overrides, and following the precedence rule.

---

## 2. SHARED LAYER (DELEGATED — DO NOT INLINE)

The 7-framework selection table, the task-to-framework map, the pre-planning-density / bundle-gate / anti-hallucination notes, and the CLEAR 5-question check are OWNED by the canonical card. Do NOT copy them here.

-> ../../sk-prompt/assets/cli_prompt_quality_card.md  (deep theory: ../../sk-prompt/references/patterns_evaluation.md)

## 3. CLAUDE CODE MODEL OVERRIDES

No per-model overrides today — Haiku is an unverified stub.

**Model defaults for this executor:**

| User says | Resolve to |
|-----------|------------|
| (nothing specified) | `--model claude-sonnet-4-6` — balanced performance/cost default |
| "Use Opus extended thinking" | `--model claude-opus-4-6 --effort high` — deep reasoning |
| "Fast / cheap" | `--model claude-haiku-4-5-20251001` — unverified stub; use only when explicitly requested |

## 4. DELEGATION / PRECEDENCE

The 3-tier precedence rule (fast path -> model override -> deep path) is canonical in ../../sk-prompt/assets/cli_prompt_quality_card.md and restated in ../SKILL.md.

Claude Code escalation example: if the task would otherwise need a long `claude -p` prompt plus `--permission-mode plan`, ask `@prompt-improver` for the final `ENHANCED_PROMPT` first and then pass that result to Claude Code.

## 5. FAILURE PATTERNS

- Missing output format or success criteria
- Unbounded scope
- Vague verbs
- No repo or file anchors
- No "do not change" guardrails

## 6. RELATED RESOURCES

-> ../../sk-prompt/assets/cli_prompt_quality_card.md · ./prompt_templates.md · ../SKILL.md · ../../sk-prompt-small-model/references/models/ (per-model profiles)
