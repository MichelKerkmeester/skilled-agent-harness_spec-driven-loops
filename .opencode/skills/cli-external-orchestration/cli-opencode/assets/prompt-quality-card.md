---
title: OpenCode CLI — Prompt Quality Card
description: Fast-path prompt discipline for OpenCode CLI dispatches; frameworks and CLEAR are canonical in sk-prompt.
trigger_phrases:
  - "opencode prompt quality card"
  - "opencode model overrides"
  - "opencode dispatch framework precedence"
importance_tier: normal
contextType: planning
version: 1.3.0.21
---

# OpenCode CLI — Prompt Quality Card

Fast-path dispatch discipline for `opencode run` prompts. The 7-framework table, task-to-framework map, pre-planning-density / bundle-gate / anti-hallucination notes, and the CLEAR 5-question check are owned by the canonical card — do not inline them here.

## 1. OVERVIEW

### Purpose

This card is the OpenCode CLI fast-path prompt-quality reference; it delegates the framework table + CLEAR check to the canonical card and records only the OpenCode-specific precedence rule.

### Usage

Compose a dispatch prompt by starting from the shared layer (canonical card) and following the precedence rule.

---

## 2. SHARED LAYER (DELEGATED — DO NOT INLINE)

The 7-framework selection table, the task->framework map, the pre-planning-density / bundle-gate / anti-hallucination notes, and the CLEAR 5-question check are OWNED by the canonical card. Do NOT copy them here.

-> `../../../sk-prompt/assets/cli-prompt-quality-card.md`  (deep theory: `../../../sk-prompt/references/patterns-evaluation.md`)

---

## 3. OPENCODE SMALL-MODEL DISPATCH

OpenCode dispatches the MiniMax, MiMo, DeepSeek-v4-flash, Kimi-K2.7, and GLM small models. Framework selection for these models follows the cross-model defaults in the canonical card; there are no per-model prompt-craft profiles.

**Executor notes:** Omit `--agent` for all small-model dispatches. OpenCode maps `--variant low/medium/high` to MiMo's reasoning effort; `high` is the standing default for MiMo. MiniMax Token Plan (`minimax-coding-plan/MiniMax-M3`) and Direct API (`minimax/MiniMax-M3`) both serve M3. Xiaomi Token Plan (`xiaomi-token-plan-ams/mimo-v2.5-pro`) and Direct API (`xiaomi/mimo-v2.5-pro`) both serve MiMo-V2.5-Pro; the Direct API additionally serves `xiaomi/mimo-v2.5-pro-ultraspeed`, a low-latency tier with the same prompt contract. Ambiguous use-case (1 vs 2 vs 3) prevents the router from picking a path — resolve before dispatch. Always include a self-invocation guard signal when the dispatched session could loop back.

---

## 4. DELEGATION / PRECEDENCE

The 2-tier precedence rule (fast path -> deep path) is canonical in `../../../sk-prompt/assets/cli-prompt-quality-card.md` and restated in `../SKILL.md`.

OpenCode-specific escalation example: if the task would otherwise need a long `opencode run` prompt plus an explicit Memory Epilogue and a parallel-session decision, ask `@prompt-improver` for the final `ENHANCED_PROMPT` first, then pass that result to OpenCode.

---

## 5. RELATED RESOURCES

-> `../../../sk-prompt/assets/cli-prompt-quality-card.md` · `./prompt-templates.md` · `../SKILL.md`
