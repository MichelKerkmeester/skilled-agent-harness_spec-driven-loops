---
title: Codex CLI — Prompt Quality Card
description: Fast-path prompt-quality discipline for Codex CLI dispatches. Frameworks and CLEAR are canonical in sk-prompt.
---

# Codex CLI — Prompt Quality Card

Fast-path prompt-quality discipline for Codex CLI dispatches. The 7-framework table, task-to-framework map, density notes, and CLEAR 5-question check are owned by the canonical card — do not inline them here.

## 1. OVERVIEW

### Purpose

This card is the Codex CLI fast-path prompt-quality reference; it delegates the framework table + CLEAR check to the canonical card and records only Codex-specific model overrides plus the precedence rule.

### Usage

Compose a dispatch prompt by starting from the shared layer (canonical card), applying the Codex model overrides, and following the precedence rule.

---

## 2. SHARED LAYER (DELEGATED — DO NOT INLINE)

The 7-framework selection table, the task-to-framework map, the pre-planning-density / bundle-gate / anti-hallucination notes, and the CLEAR 5-question check are OWNED by the canonical card. Do NOT copy them here.

-> `../../sk-prompt-small-model/assets/cli_prompt_quality_card.md`  (deep theory: `../../sk-prompt/references/patterns_evaluation.md`)

## 3. CODEX MODEL OVERRIDES

No per-model overrides today. Codex CLI dispatches only `gpt-5.5`; reasoning effort is tuned via `-c model_reasoning_effort` (see SKILL.md §3). No profiled small model is dispatched through this executor.

## 4. DELEGATION / PRECEDENCE

The 3-tier precedence rule (fast path -> model override -> deep path) is canonical in `../../sk-prompt-small-model/assets/cli_prompt_quality_card.md` and restated in `../SKILL.md`.

Codex-specific escalation example: if the task needs a crowded `codex exec` prompt plus explicit `-c service_tier="fast"` or sandbox guidance, dispatch `@prompt-improver` via the Task tool first and hand the returned `ENHANCED_PROMPT` to Codex CLI. Escalate on any canonical Tier 3 trigger.

## 5. RELATED RESOURCES

-> `../../sk-prompt-small-model/assets/cli_prompt_quality_card.md` · `./prompt_templates.md` · `../SKILL.md` · `../../sk-prompt-small-model/references/models/` (per-model profiles)
