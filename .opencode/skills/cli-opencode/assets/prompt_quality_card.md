---
title: OpenCode CLI — Prompt Quality Card
description: Fast-path prompt discipline for OpenCode CLI dispatches; frameworks and CLEAR are canonical in sk-prompt.
---

# OpenCode CLI — Prompt Quality Card

Fast-path dispatch discipline for `opencode run` prompts. The 7-framework table, task-to-framework map, pre-planning-density / bundle-gate / anti-hallucination notes, and the CLEAR 5-question check are owned by the canonical card — do not inline them here.

## 1. Shared Layer (delegated — do not inline)

The 7-framework selection table, the task->framework map, the pre-planning-density / bundle-gate / anti-hallucination notes, and the CLEAR 5-question check are OWNED by the canonical card. Do NOT copy them here.

-> `../../sk-prompt/assets/cli_prompt_quality_card.md`  (deep theory: `../../sk-prompt/references/patterns_evaluation.md`)

## 2. OpenCode Model Overrides

OpenCode dispatches the MiniMax, MiMo, and opencode-go (DeepSeek-v4-pro / Kimi-k2.6 / Qwen3.6 / GLM-5.1) small models, which override or default against the cross-model defaults from the canonical card:

| Model (dispatchable here) | Override | Profile |
|---|---|---|
| MiniMax M3 (Token Plan default) | TIDD-EC + dense | `../../sk-prompt-small-model/references/models/minimax-m3.md` |
| MiniMax M2.7 (fallback) | TIDD-EC + dense | `../../sk-prompt-small-model/references/models/minimax-2.7.md` |
| MiMo V2.5 Pro | COSTAR + lean, `--variant high` | `../../sk-prompt-small-model/references/models/mimo-v2.5-pro.md` |
| deepseek-v4-pro / kimi-k2.6 / qwen3.6 / glm-5.1 | default RCAF (no model-specific benchmark; shared default-unverified note) | [`deepseek-v4-pro.md`](../../sk-prompt-small-model/references/models/deepseek-v4-pro.md) · [`kimi-k2.6.md`](../../sk-prompt-small-model/references/models/kimi-k2.6.md) · [`qwen3.6.md`](../../sk-prompt-small-model/references/models/qwen3.6.md) · [`glm-5.1.md`](../../sk-prompt-small-model/references/models/glm-5.1.md) |

**Executor notes:** Omit `--agent` for all small-model dispatches listed above. OpenCode maps `--variant low/medium/high` to MiMo's reasoning effort; `high` is the standing default for MiMo. Ambiguous use-case (1 vs 2 vs 3) prevents the router from picking a path — resolve before dispatch. Always include a self-invocation guard signal when the dispatched session could loop back.

## 3. Delegation / Precedence

The 3-tier precedence rule (fast path -> model override -> deep path) is canonical in `../../sk-prompt/assets/cli_prompt_quality_card.md` and restated in `../SKILL.md`.

OpenCode-specific escalation example: if the task would otherwise need a long `opencode run` prompt plus an explicit Memory Epilogue and a parallel-session decision, ask `@prompt-improver` for the final `ENHANCED_PROMPT` first, then pass that result to OpenCode.

## 4. Related

-> `../../sk-prompt/assets/cli_prompt_quality_card.md` · `./prompt_templates.md` · `../SKILL.md` · `../../sk-prompt-small-model/references/models/` (per-model profiles)
