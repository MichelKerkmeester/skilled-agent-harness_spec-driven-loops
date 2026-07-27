---
title: "Pi CLI - GPT-5.6 Model Dispatch"
description: "Operator-confirmed GPT-5.6 model ids available through Pi's openai-codex custom provider, with Codex-derived effort ceilings and explicit Pi syntax gaps."
trigger_phrases:
  - "pi gpt-5.6"
  - "pi gpt-5.6 luna"
  - "pi gpt-5.6 sol"
  - "pi gpt-5.6 terra"
  - "pi openai-codex provider"
  - "pi reasoning effort"
importance_tier: important
contextType: implementation
version: 1.1.0.0
---

# Pi CLI - GPT-5.6 Model Dispatch

This reference records the GPT-5.6 ids observed as dispatchable through Pi's `openai-codex` custom-provider configuration. It documents model-selection facts and evidence boundaries; it does not invent Pi command syntax for reasoning effort or service tier.

## 1. OVERVIEW

### Core Principle

Pi is a multi-provider passthrough; this reference records only the GPT-5.6 tiers reachable through Pi's `openai-codex` custom provider, sourced from an operator-supplied model-picker screenshot, not a live CLI probe.

### Purpose

Gives the operator-confirmed GPT-5.6 model ids and their effort ceilings for dispatch through Pi, and flags what a future execution phase still needs to live-test.

### When to Use

- A task specifically requests a GPT-5.6 tier (`luna`/`sol`/`terra`) through Pi

## 2. DISPATCHABLE MODELS

The operator's live model-picker screenshot, supplied on 2026-07-27, listed these three ids under the `openai-codex` provider:

| Model | Pi provider | Reasoning-effort ceiling | Evidence status |
|---|---|---|---|
| `gpt-5.6-luna` | `openai-codex` | `max` | dispatchable via the live operator-configured picker; ceiling mirrored from cli-codex |
| `gpt-5.6-sol` | `openai-codex` | `ultra` | dispatchable via the live operator-configured picker; the only one of these three reaching `ultra` in cli-codex |
| `gpt-5.6-terra` | `openai-codex` | `max` | dispatchable via the live operator-configured picker; ceiling mirrored from cli-codex |

The full ascending reasoning-effort scale documented by the existing cli-codex model-selection table is `none` / `minimal` / `low` / `medium` / `high` / `xhigh` / `max` / `ultra`. The per-model ceilings are `gpt-5.6-luna` and `gpt-5.6-terra` ≤ `max`, and `gpt-5.6-sol` ≤ `ultra`; see [`cli-codex/SKILL.md` lines 233-242](../../cli-codex/SKILL.md#L233-L242).

## 3. SERVICE-TIER EVIDENCE

The existing cli-codex documentation places these three GPT-5.6 models on the `fast` service tier and shows the corresponding model-selection table in [`cli-codex/SKILL.md` lines 233-242](../../cli-codex/SKILL.md#L233-L242). That is evidence for the established cli-codex route, not proof that Pi accepts the same control surface.

Pi's dispatch-time parameter or flag for selecting a reasoning-effort level is **UNCONFIRMED** in this packet. Pi's dispatch-time parameter or flag for selecting a service tier is also **UNCONFIRMED**. The `-c model_reasoning_effort="<level>"` and `-c service_tier="fast"` examples in the cited cli-codex source are Codex-specific syntax and must not be copied into a Pi invocation.

## 4. OPEN EXECUTION ITEM

This phase did not run a live `pi` command. A future execution phase must inspect the installed Pi help and run a controlled, authenticated dispatch before documenting the actual effort and service-tier parameter names, accepted values, provider support, or quota behavior. Until then, model availability through the operator-configured picker is confirmed, while Pi-specific effort/tier syntax and runtime semantics remain unconfirmed.

## 5. SOURCES

- Operator-supplied live Pi model-picker screenshot, 2026-07-27 — source for the three ids and their `openai-codex` grouping.
- [`cli-codex/SKILL.md` lines 233-242](../../cli-codex/SKILL.md#L233-L242) — source for the `fast` tier documentation, full effort scale, and GPT-5.6 ceilings on the existing Codex route.
- [`cli-reference.md`](./cli-reference.md) — Pi's confirmed CLI surface; it does not establish a GPT-5.6-specific effort or service-tier mapping.
