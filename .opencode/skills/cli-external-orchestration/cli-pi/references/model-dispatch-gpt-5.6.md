---
title: "Pi CLI - GPT-5.6 Model Dispatch"
description: "GPT-5.6 model ids and the live-confirmed Pi invocation: provider-qualify as openai-codex/gpt-5.6-*, set reasoning effort with --thinking, and never trust pi's exit code for auth."
trigger_phrases:
  - "pi gpt-5.6"
  - "pi gpt-5.6 luna"
  - "pi gpt-5.6 sol"
  - "pi gpt-5.6 terra"
  - "pi openai-codex provider"
  - "pi reasoning effort"
importance_tier: important
contextType: implementation
version: 1.2.0.0
---

# Pi CLI - GPT-5.6 Model Dispatch

This reference records the GPT-5.6 ids observed as dispatchable through Pi's `openai-codex` custom-provider configuration. It documents model-selection facts and evidence boundaries; it does not invent Pi command syntax for reasoning effort or service tier.

## 1. OVERVIEW

### Core Principle

Pi is a multi-provider passthrough; this reference records the GPT-5.6 tiers reachable through Pi's `openai-codex` custom provider. The model ids came from an operator model-picker screenshot; the dispatch invocation (§3) was subsequently confirmed by a live authenticated `pi -p` run.

### Purpose

Gives the operator-confirmed GPT-5.6 model ids and their effort ceilings for dispatch through Pi, and flags what a future execution phase still needs to live-test.

### When to Use

- A task specifically requests a GPT-5.6 tier (`luna`/`sol`/`terra`) through Pi

## 2. DISPATCHABLE MODELS

The operator's live model-picker screenshot, supplied on 2026-07-27, listed these three ids under the `openai-codex` provider:

| Model | Pi provider | Reasoning-effort ceiling | Evidence status |
|---|---|---|---|
| `gpt-5.6-luna` | `openai-codex` | `max` | **live-confirmed**: a real `pi -p --model openai-codex/gpt-5.6-luna --thinking xhigh` dispatch reached the model and returned work |
| `gpt-5.6-sol` | `openai-codex` | `ultra` | dispatchable via the live operator-configured picker; the only one of these three reaching `ultra` in cli-codex |
| `gpt-5.6-terra` | `openai-codex` | `max` | dispatchable via the live operator-configured picker; ceiling mirrored from cli-codex |

The full ascending reasoning-effort scale documented by the existing cli-codex model-selection table is `none` / `minimal` / `low` / `medium` / `high` / `xhigh` / `max` / `ultra`. The per-model ceilings are `gpt-5.6-luna` and `gpt-5.6-terra` ≤ `max`, and `gpt-5.6-sol` ≤ `ultra`; see [`cli-codex/SKILL.md` lines 233-242](../../cli-codex/SKILL.md#L233-L242).

## 3. CONFIRMED INVOCATION

A live authenticated `pi -p` dispatch of `gpt-5.6-luna` established the following, superseding the earlier "unconfirmed" status:

**Provider-qualify the model id.** Dispatch with `--model openai-codex/gpt-5.6-<tier>`, not the bare `gpt-5.6-<tier>`. A bare id resolves to a different, unauthenticated provider (`azure-openai-responses` was observed) and fails with `No API key found for azure-openai-responses` — while still exiting `0` (see the exit-code guard in `SKILL.md`). Always read the output for a missing-key line; never trust the exit code.

**Reasoning effort is `--thinking <level>`.** Pi's own flag, documented in [`cli-reference.md`](./cli-reference.md), accepts `off` / `minimal` / `low` / `medium` / `high` / `xhigh` / `max`. It is confirmed working for `openai-codex/gpt-5.6-luna` at `xhigh`. Do NOT use the Codex-specific `-c model_reasoning_effort="<level>"` — that is cli-codex syntax and is not a Pi flag. The per-model ceilings from §2 still apply (`luna`/`terra` ≤ `max`, `sol` ≤ `ultra`); `--thinking max` is the Pi ceiling since Pi's scale stops at `max`.

**Service tier needs no Pi flag.** Pi routes through the `openai-codex` provider, which selects the tier server-side; there is no `service_tier` dispatch flag and none is required. The Codex `-c service_tier="fast"` syntax must not be copied into a Pi invocation.

**Confirmed command shape** (read-only investigation example):

```bash
pi -p --model openai-codex/gpt-5.6-luna --thinking xhigh --tools read,grep,find,ls "<prompt>"
```

Swap the tier (`gpt-5.6-sol`, `gpt-5.6-terra`) and the `--thinking` level as the task needs; widen `--tools` only when the dispatch must write.

## 4. SOURCES

- Live authenticated `pi -p --model openai-codex/gpt-5.6-luna --thinking xhigh --tools read,grep,find,ls` dispatch — source for the confirmed invocation, the provider-qualification requirement, and the bare-id / exit-0 auth failure in §3.
- Operator-supplied live Pi model-picker screenshot, 2026-07-27 — source for the three ids and their `openai-codex` grouping.
- [`cli-codex/SKILL.md` lines 233-242](../../cli-codex/SKILL.md#L233-L242) — source for the `fast` tier documentation, full effort scale, and GPT-5.6 ceilings on the existing Codex route.
- [`cli-reference.md`](./cli-reference.md) — Pi's confirmed CLI surface; it does not establish a GPT-5.6-specific effort or service-tier mapping.
