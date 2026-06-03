---
title: Gemini CLI — Prompt Quality Card
description: Fast-path prompt discipline for Gemini CLI dispatches; frameworks and CLEAR are owned by the canonical card.
---

# Gemini CLI — Prompt Quality Card

Fast-path prompt discipline for Gemini CLI dispatches. The 7-framework selection table, task-to-framework map, density notes, and CLEAR check are canonical — do not inline them here.

## 1. OVERVIEW

### Purpose

This card is the Gemini CLI fast-path prompt-quality reference; it delegates the framework table + CLEAR check to the canonical card and records only Gemini-specific model overrides plus the precedence rule.

### Usage

Compose a dispatch prompt by starting from the shared layer (canonical card), applying the Gemini model overrides, and following the precedence rule.

---

## 2. SHARED LAYER (DELEGATED — DO NOT INLINE)

The 7-framework selection table, the task-to-framework map, the pre-planning-density / bundle-gate / anti-hallucination notes, and the CLEAR 5-question check are OWNED by the canonical card. Do NOT copy them here.

-> `../../sk-prompt-small-model/assets/cli_prompt_quality_card.md`
(deep theory: `../../sk-prompt/references/patterns_evaluation.md`)

## 3. GEMINI CLI MODEL OVERRIDES

No per-model overrides today — Gemini Flash is an unverified stub (see the hub at `../../sk-prompt-small-model/references/models/` if a profile is added).

Tier 3-only Gemini escalation one-liner: after a canonical Tier 3 trigger, obtain `ENHANCED_PROMPT` from `@prompt-improver`, then pass it directly to Gemini CLI:

```bash
gemini "$ENHANCED_PROMPT" -m gemini-3.1-pro-preview -o text 2>&1
```

## 4. DELEGATION / PRECEDENCE

The 3-tier precedence rule (fast path -> model override -> deep path) is canonical in `../../sk-prompt-small-model/assets/cli_prompt_quality_card.md` and restated in `../SKILL.md`.

Gemini-specific escalation example: if the task requires a long grounded prompt plus `-m gemini-3.1-pro-preview`, dispatch `@prompt-improver` via the Task tool first, receive the structured `ENHANCED_PROMPT`, then hand that to the Gemini CLI invocation. Escalate on any canonical Tier 3 trigger: complexity >= 7/10; compliance, policy, privacy, or security sensitivity; more than one stakeholder or audience; more than one ambiguous key requirement; or a fast-path CLEAR check that cannot clear its floor quickly.

## 5. RELATED RESOURCES

-> `../../sk-prompt-small-model/assets/cli_prompt_quality_card.md` · `./prompt_templates.md` · `../SKILL.md` · `../../sk-prompt-small-model/references/models/` (per-model profiles)
