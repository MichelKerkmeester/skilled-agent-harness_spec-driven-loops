---
title: cli-pi Providers, Models & Invocation
description: The dedicated per-mode catalog of every provider, authenticated model id, the --thinking effort lever, and dispatch shape reachable through the cli-pi multi-provider passthrough mode.
trigger_phrases:
  - "pi providers and models"
  - "which model for pi dispatch"
  - "pi thinking reasoning effort"
  - "pi has no default model"
  - "pi openai-codex deepseek minimax xiaomi"
  - "pi passthrough model selection"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

The single catalog of the providers, authenticated model ids, the `--thinking` effort lever, and dispatch shapes the cli-pi mode can reach. cli-pi is a multi-provider passthrough with no enforced model allowlist and no fixed default model — every dispatch names its provider and model explicitly.

---

## 1. OVERVIEW

### Core Principle
One place to answer "which provider, which model, which effort, how to dispatch" for cli-pi. Unlike the sibling cli modes, cli-pi is a passthrough: it enforces no model allowlist at this layer and bakes no effort tier into any model id — provider, model, and effort are three independent choices per dispatch.

### When to Use
- Choosing a `--provider <name>` + `--model <pattern>` (or a single `--model provider/id`) for a `pi` dispatch
- Mapping a desired reasoning effort onto the standalone `--thinking` flag
- Recalling the authenticated roster and the canonical non-interactive invocation shape

### Scope
This file enumerates the provider/model/effort facts and the dispatch envelope. It does NOT own: the full `pi` flag surface, headless-mode contracts, auth/failure handling (see [cli-reference.md](./cli-reference.md)), the conductor/executor orchestration patterns (see [integration-patterns.md](./integration-patterns.md)), per-model prompt-craft (see §6), or the fan-out / model-enforcement runtime (see §6).

### Authority pointers
- Full CLI flags, headless modes, auth pre-flight, model selection → [cli-reference.md](./cli-reference.md) §13
- Dispatch envelope + failure-mode matrix → [integration-patterns.md](./integration-patterns.md)
- Live model ids on a given install → re-read `~/.pi/agent/models-store.json` (or the in-session model picker); note `pi --list-models` returned no models on an unauthenticated run

---

## 2. PROVIDERS & MODELS

Pi is a multi-provider passthrough with **no enforced allowlist** at this layer. Select a model with `--provider <name>` plus `--model <pattern>`, or a single `--model provider/id` form; `--model` also accepts an inline thinking suffix (`--model sonnet:high`). Reasoning effort stays independent of the model id (see §4).

The table below is the machine-local authenticated roster confirmed on 2026-07-28 from `~/.pi/agent/auth.json` and `models-store.json` (five authenticated providers; opencode-go added 2026-08-07). The roster is machine state, not a contract — re-read `models-store.json` before relying on a specific id.

### openai-codex

Custom provider carrying the GPT-5.6 personas — see the effort cross-map in §4. Pi exposes the base persona slugs only (no `-fast` / `-pro` speed tiers). `gpt-5.6-terra` is in Pi's supported set but may not be authenticated on every machine — confirm via `models-store.json`.

| Model id | Notes |
|----------|-------|
| `gpt-5.6-sol` | GPT-5.6 Sol |
| `gpt-5.6-luna` | GPT-5.6 Luna |
| `gpt-5.6-terra` | GPT-5.6 Terra |

### deepseek

| Model id | Notes |
|----------|-------|
| `deepseek-v4-flash` | Latency-optimized; a live `--provider deepseek --model deepseek-v4-flash -p` dispatch completed a real tool-using turn |
| `deepseek-v4-pro` | Reasoning-optimized |

### minimax

MiniMax Direct API passthrough.

| Model id | Notes |
|----------|-------|
| `MiniMax-M3` | — |

### xiaomi

MiMo passthrough; `-ultraspeed` is the low-latency tier.

| Model id                   | Notes            |
| ----------------------------| ------------------|
| `mimo-v2.5-pro`            | —                |
| `mimo-v2.5-pro-ultraspeed` | Low-latency tier |

### opencode-go

OpenCode Go gateway passthrough (subsidized "2x usage" rate). Select with `--provider opencode-go --model <id>` — the enforced deep-loop fan-out route for both models below.

| Model id | Notes |
|----------|-------|
| `deepseek-v4-flash` | Latency-optimized (2x usage); opencode-go is the fan-out provider for this model. A live `opencode run --model opencode-go/deepseek-v4-flash` turn completed 2026-08-07. Also reachable directly via `--provider deepseek` (see above) |
| `qwen3.8-max` | Qwen 3.8 Max; a live `pi --provider opencode-go --model qwen3.8-max -p` dispatch completed a real turn 2026-08-07 |

Pi's `pi --help` also lists provider env vars beyond this roster (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `XAI_API_KEY`, `MISTRAL_API_KEY`, `MINIMAX_API_KEY`, `KIMI_API_KEY`, `QWEN_TOKEN_PLAN_API_KEY`, AWS). Documentation-only provider breadth is not a license to guess an unconfirmed model id — only the five authenticated providers above have a confirmed installed catalog.

---

## 3. DEFAULTS & QUICK INVOCATION

**cli-pi has NO fixed default model.** Pi's `--provider` default is `google` (`pi --help` documents `--provider <name> (default: google)`), but `google` is not in the authenticated roster (§2) — a dispatch that omits `--provider`/`--model` targets a provider with no authenticated model and fails on auth. Every real dispatch therefore names its provider and model explicitly; there is no skill-level default model to fall back to.

| Field | Value |
|-------|-------|
| Default model | **None** — selected per dispatch (passthrough) |
| Default provider (Pi's own) | `google` (not authenticated here — always override) |
| Default effort | None baked in — set `--thinking` explicitly per dispatch |
| Default mode | `--mode text` (print mode) |

```bash
# No default model — always name provider + model + effort explicitly:
pi -p "<prompt>" \
  --provider deepseek --model deepseek-v4-pro \
  --thinking high --mode text
```

Do not fabricate a default model when composing a cli-pi dispatch. If the task has no model-specific requirement, pick a provider/model from the authenticated roster (§2) deliberately and state the choice.

---

## 4. REASONING-EFFORT / THINKING LEVER

cli-pi expresses reasoning effort through the first-class, standalone **`--thinking`** flag, independent of the `--model` id:

```
--thinking off | minimal | low | medium | high | xhigh | max
```

`--thinking` is confirmed live from the installed help capture. Unlike `cli-cursor`/`cli-devin`, no effort tier is baked into any Pi model id.

### Do NOT copy Codex effort syntax into Pi
A common, real confusion: cli-codex controls effort through config-level `-c model_reasoning_effort=...` (and `-c service_tier=...`). **Those forms are Codex-specific and must NOT be copied into a `pi` invocation.** Pi uses the bare `--thinking <tier>` flag and has no confirmed service-tier control surface.

### GPT-5.6 effort ceilings via the `openai-codex` provider
The GPT-5.6 tiers are reachable through Pi's `openai-codex` provider, but Pi's `--thinking` scale tops out at `max`. Ceilings come from the cli-codex model-selection table — cross-reference [cli-codex/references/providers-and-models.md](../../cli-codex/references/providers-and-models.md) for the authoritative effort map.

| Model | Codex-documented effort ceiling | Reachable via Pi `--thinking`? |
|-------|---------------------------------|--------------------------------|
| `gpt-5.6-sol` | `ultra` | Partially — Pi's `--thinking` scale stops at `max`; `ultra` has no Pi-side value |
| `gpt-5.6-luna` | `max` | Yes — `max` is the top of Pi's own scale |
| `gpt-5.6-terra` | `max` | Yes — `max` is the top of Pi's own scale |

Confirm the target model actually honors the requested tier before assuming it changes behavior — the contract pin did not exhaustively test every model/tier pairing.

---

## 5. HOW TO INVOKE

### Dispatch envelope (child / detached sessions)
When dispatching as a non-interactive child (spec-gate-neutralized worker), prefix the shared env and capture streams separately:

```bash
MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 pi -p "<prompt>" \
  --provider deepseek --model deepseek-v4-pro \
  --thinking high --mode text --offline \
  > stdout.log 2> stderr.log
```

- `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` — neutralizes the spec-gate for a bound child worker so it does not stall waiting on an interactive Gate-3 answer.
- `--offline` — pass explicitly for any automated/CI dispatch; `pi --verbose` without `--offline` hung 2+ minutes with no reachable network path in the pinned contract. See [cli-reference.md](./cli-reference.md) §7 and [integration-patterns.md](./integration-patterns.md) §15.
- **Exit code is never an availability/auth signal** — an identical unauthenticated `pi -p` returned exit `0` then exit `1` across runs. Classify the captured output text (`No API key found...`), never the exit code. See [cli-reference.md](./cli-reference.md) §9.

Select the headless contract deliberately: `--mode text` (print), `--mode json` (JSONL event stream), or `--mode rpc` (persistent JSONL protocol) — RPC is not a print-mode alias. See [integration-patterns.md](./integration-patterns.md) §4/§6/§7.

### Self-invocation guard
A Pi dispatch must never re-enter a session already running inside Pi. Run the guard before constructing any command — see [../SKILL.md](../SKILL.md) §2, "Self-Invocation Guard".

### Parallel / fan-out
Multi-lineage parallel dispatch is driven by `fanout-run.cjs`, which lives outside this hub — see §6.

---

## 6. ENFORCEMENT & PROFILES (authoritative elsewhere — do not duplicate here)

- **Per-model prompt-craft profiles** → `.opencode/skills/sk-prompt/sk-prompt-models/assets/model-profiles.json`
- **Fan-out dispatcher** → `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- **Live model ids** → re-read `~/.pi/agent/models-store.json` on the target install

---

## 7. RELATED

- [cli-reference.md](./cli-reference.md) — full `pi` flags, headless modes, auth failure behavior, §13 model selection
- [integration-patterns.md](./integration-patterns.md) — conductor/executor dispatch shapes, print/JSON/RPC, and anti-patterns
- [../SKILL.md](../SKILL.md) — cli-pi mode overview, routing, and self-invocation guard
- [../../cli-codex/references/providers-and-models.md](../../cli-codex/references/providers-and-models.md) — authoritative GPT-5.6 effort-ceiling cross-map for the `openai-codex` tiers
