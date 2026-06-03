---
title: Gemini CLI — Prompt Quality Card
description: Fast-path prompt discipline for Gemini CLI dispatches; frameworks and CLEAR are owned by the canonical card.
---

# Gemini CLI — Prompt Quality Card

Fast-path prompt discipline for Gemini CLI dispatches. The 7-framework selection table, task-to-framework map, density notes, and CLEAR check are canonical — do not inline them here.

## 1. Shared Layer (delegated — do not inline)

The 7-framework selection table, the task-to-framework map, the pre-planning-density / bundle-gate / anti-hallucination notes, and the CLEAR 5-question check are OWNED by the canonical card. Do NOT copy them here.

-> `../../sk-prompt/assets/cli_prompt_quality_card.md`
(deep theory: `../../sk-prompt/references/patterns_evaluation.md`)

## 2. Gemini CLI Model Overrides

No per-model overrides today — Gemini Flash is an unverified stub (see the hub at `../../sk-prompt-small-model/references/models/` if a profile is added).

Tier 3-only Gemini escalation one-liner: after a canonical Tier 3 trigger, obtain `ENHANCED_PROMPT` from `@prompt-improver`, then pass it directly to Gemini CLI:

```bash
gemini "$ENHANCED_PROMPT" -m gemini-3.1-pro-preview -o text 2>&1
```

## 3. Delegation / Precedence

The 3-tier precedence rule (fast path -> model override -> deep path) is canonical in `../../sk-prompt/assets/cli_prompt_quality_card.md` and restated in `../SKILL.md`.

Gemini-specific escalation example: if the task requires a long grounded prompt plus `-m gemini-3.1-pro-preview`, dispatch `@prompt-improver` via the Task tool first, receive the structured `ENHANCED_PROMPT`, then hand that to the Gemini CLI invocation. Escalate on any canonical Tier 3 trigger: complexity >= 7/10; compliance, policy, privacy, or security sensitivity; more than one stakeholder or audience; more than one ambiguous key requirement; or a fast-path CLEAR check that cannot clear its floor quickly.

## 4. Related

-> `../../sk-prompt/assets/cli_prompt_quality_card.md` · `./prompt_templates.md` · `../SKILL.md` · `../../sk-prompt-small-model/references/models/` (per-model profiles)
