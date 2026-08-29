---
title: cli-opencode Providers, Models & Invocation
description: The dedicated per-mode catalog of every provider, model id, default, reasoning-effort lever and dispatch shape reachable through the cli-opencode mode.
trigger_phrases:
  - "opencode providers and models"
  - "which model for opencode dispatch"
  - "opencode variant reasoning effort"
  - "opencode default model opencode-go flash"
  - "opencode minimax xiaomi gpt dispatch"
importance_tier: normal
contextType: implementation
version: 1.2.0.0
---

# cli-opencode Providers, Models & Invocation

The single catalog of the providers, model ids, defaults, `--variant` effort levers, and dispatch shapes the cli-opencode mode can reach.

---

## 1. OVERVIEW

### Core Principle
One place to answer "which provider, which model, which effort, how to dispatch" for cli-opencode. This mode is the multi-provider master — it reaches more providers than any other cli mode.

### When to Use
- Choosing a `--model provider/model-id` for an `opencode run` dispatch
- Mapping a desired reasoning effort onto the `--variant` flag for a given provider
- Recalling the default model and the canonical non-interactive invocation shape

### Scope
This file enumerates the provider/model/effort facts and the dispatch envelope. It does NOT own: the full `opencode run` flag surface and auth pre-flight decision trees (see [cli-reference.md](./cli-reference.md)), per-model prompt-craft (see §6), or the fan-out / model-enforcement runtime (see §6).

### Authority pointers
- Full CLI flags, subcommands, auth pre-flight, troubleshooting → [cli-reference.md](./cli-reference.md)
- Dispatch envelope + failure-mode matrix → [integration-patterns.md](./integration-patterns.md)
- Live model ids on a given install → `opencode models <provider>`

---

## 2. PROVIDERS & MODELS

> **CLOSED ROSTER — non-roster models are FORBIDDEN.** Dispatch ONLY the models catalogued in this section. Any model not in this catalog MUST NOT be called through cli-opencode. Unlike cli-pi/cli-cursor/cli-devin, cli-opencode has **no code-enforced allowlist** — `--model provider/id` is free-form and the deep-loop fan-out does not gate opencode ids — so this is a **hard discipline rule**, not a runtime gate: adherence to this catalog IS the enforcement. To add a model, amend this catalog first — never dispatch an unlisted id ad hoc.

OpenCode resolves models through configured providers; the model string passed to `--model` is always `provider/model-id`. Run `opencode models <provider>` for the live list on a given install — but a live id that is NOT in this catalog is still forbidden for cli-opencode dispatch.

### minimax

| Model id | Default? | Notes |
|----------|----------|-------|
| `minimax/MiniMax-M3` | — | MiniMax Direct API (pay-per-token); needs `MINIMAX_API_KEY` |

### xiaomi

| Model id | Default? | Notes |
|----------|----------|-------|
| `xiaomi/mimo-v2.5-pro` | — | MiMo-V2.5-Pro, Direct API (pay-per-token); 1M context, strongly agentic |
| `xiaomi/mimo-v2.5-pro-ultraspeed` | — | Low-latency MiMo-V2.5-Pro tier |

### openai

GPT-5.6 via the `openai` provider — two personas (sol/luna) × three speed tiers (base / fast / pro) = 6 slugs (the Terra persona was retired). `gpt-5.6-sol` is the flagship default persona; confirm live slugs via `opencode models openai`.

| Persona | Base | Fast (low-latency) | Pro |
|---------|------|--------------------|-----|
| sol | `openai/gpt-5.6-sol` | `openai/gpt-5.6-sol-fast` | `openai/gpt-5.6-sol-pro` |
| luna | `openai/gpt-5.6-luna` | `openai/gpt-5.6-luna-fast` | `openai/gpt-5.6-luna-pro` |

### opencode-go

opencode-go gateway (subsidized "2x usage" rate); fronts the DeepSeek, GLM, and Qwen families and hosts this mode's **default model** (`opencode-go/deepseek-v4-flash`, the flash literal's opencode-go route — the direct DeepSeek API provider was retired). Confirm live slugs via `opencode models opencode-go`.

| Model id | Default? | Notes |
|----------|----------|-------|
| `opencode-go/deepseek-v4-flash` | — | Latency-optimized DeepSeek V4 Flash via the Go gateway (2x usage); reasoning model pinned to `--variant max` by policy; a live `opencode run --model opencode-go/deepseek-v4-flash` turn completed 2026-08-07 |
| `opencode-go/glm-5.3` | — | Z.AI GLM 5.3 via the Go gateway; list-verified in `opencode models opencode-go` on 2026-08-14 (not dispatch-tested). opencode-go also fronts `glm-5.1`/`glm-5.2`, out of this catalog's curated scope |
| `opencode-go/glm-5.3-flash` | — | Z.AI GLM-5.3-Flash via the Go gateway; reasoning model (variants `low`/`high`/`max`) pinned to `--variant max` by policy; list-verified in `opencode models opencode-go` on 2026-08-27 (not dispatch-tested) |
| `opencode-go/qwen3.8-max` | — | Qwen 3.8 Max via the Go gateway; a live `opencode run --model opencode-go/qwen3.8-max` turn completed 2026-08-07 |

### openrouter

OpenRouter gateway (base `https://openrouter.ai/api/v1`); pass the full three-segment `openrouter/<upstream>/<model-id>` to `--model`. Confirm live slugs via `opencode models openrouter`. The DeepSeek Flash `-latest` variant is a reasoning model and is pinned to `--variant max` by the same policy as the direct and opencode-go flash ids.

> **OpenRouter here carries exactly three models: DeepSeek V4 Flash (`openrouter/deepseek/deepseek-v4-flash-latest`), GLM-5.3-Flash (`openrouter/z-ai/glm-5.3-flash`), and Gemini 3.7 Flash (`openrouter/google/gemini-3.7-flash`).** Do not route any other model (e.g. GPT-5.6 Luna/Sol) through OpenRouter here — use their own providers (`openai`, etc.) instead.

| Model id | Default? | Notes |
|----------|----------|-------|
| `openrouter/deepseek/deepseek-v4-flash-latest` | — | DeepSeek V4 Flash (latest) via OpenRouter; reasoning model pinned to `--variant max` by policy. |
| `openrouter/z-ai/glm-5.3-flash` | — | GLM-5.3-Flash via OpenRouter; reasoning model (variants `low`/`high`/`max`) pinned to `--variant max` (its top tier) by policy; list-verified in `opencode models openrouter` on 2026-08-27 (not dispatch-tested). Replaces the retired Ox Alpha stealth route |
| `openrouter/google/gemini-3.7-flash` | — | Gemini 3.7 Flash via OpenRouter; reasoning model (variants `low`/`medium`/`high`) dispatched at its top tier `--variant high`; list-verified in `opencode models openrouter` on 2026-08-27 (not dispatch-tested) |

### cline-pass

Cline provider (Cline Pass account, base `https://api.cline.bot/api/v1`, OpenAI-compatible); pass the full three-segment `cline-pass/cline-pass/<model-id>` to `--model`. Authenticate with `opencode auth login` (the `/login` flow) — the provider registers as **`cline-pass`**, not `cline` (`opencode models cline` errors "Provider not found"). Confirm live slugs via `opencode models cline-pass`. The cline-pass DeepSeek V4 Flash entry reports `reasoning: true` with thinking tiers running `none`→`xhigh`, **no `max` tier**. **Default effort: `--variant xhigh`** — dispatch it at its top thinking tier by default, following the DeepSeek family's top-tier-only policy (the opencode-go `--variant max` pin has no `max` here, so `xhigh` is the equivalent top tier). The cline-pass DeepSeek entry is a direct-dispatch roster entry only; it is not wired into the fan-out executor registry (which would force the unsupported `--variant max`). Note: opencode has no per-model default-effort config key, so this default is a dispatch convention here — the interactive TUI picker remembers the effort per model on its own.

| Model id | Default? | Notes |
|----------|----------|-------|
| `cline-pass/cline-pass/deepseek-v4-flash` | — | DeepSeek V4 Flash via the Cline provider; reasoning model; **default effort `--variant xhigh`** (its top thinking tier; no `max` tier); list-verified in `opencode models cline-pass` on 2026-08-18 (not dispatch-tested). cline-pass also fronts `glm-5.2`, `kimi-k2.6`/`kimi-k2.7-code`/`kimi-k3`, `mimo-v2.5`/`mimo-v2.5-pro`, `minimax-m3`, `qwen3.7-max`/`qwen3.7-plus`, out of this catalog's curated scope. DeepSeek V4 Pro was retired from the roster and is not a dispatch target here |

> **GLM-5.3-Flash is NOT available on cli-opencode's Cline route.** Unlike cli-pi (which passes the raw Cline id `z-ai/glm-5.3-flash` straight through and works), opencode's `cline-pass` adapter returns `Unexpected server error` for every id form (`cline-pass/z-ai/glm-5.3-flash`, `cline-pass/cline-pass/glm-5.3-flash`), and `opencode models cline-pass` lists only `glm-5.3` (no `-flash` variant). Verified 2026-08-27. Reach GLM-5.3-Flash on cli-opencode via **`openrouter/z-ai/glm-5.3-flash`** or **`opencode-go/glm-5.3-flash`** instead.

---

## 3. DEFAULTS & QUICK INVOCATION

Dispatch this mode's default without opening any other file:

| Field | Value |
|-------|-------|
| Default model | `opencode-go/deepseek-v4-flash` |
| Default effort | `--variant max` (flash is max-tier-pinned by policy) |
| Default format | `--format json` |

```bash
opencode run \
  --model opencode-go/deepseek-v4-flash \
  --variant max \
  --format json \
  --dir "$REPO_ROOT" \
  "<prompt>" </dev/null
```

If the default provider is not configured, the mode ASKS the operator before substituting — never silently swaps a model. See the auth pre-flight decision tree in [cli-reference.md](./cli-reference.md) §4.

---

## 4. REASONING-EFFORT / THINKING LEVER

cli-opencode expresses reasoning effort through the **`--variant`** flag, which maps to a provider-specific effort scale. Default skill behavior is `--variant high` for non-pinned models; the `opencode-go/deepseek-v4-flash` default is pinned to `--variant max` by policy.

| Provider | `--variant` behavior |
|----------|----------------------|
| `opencode-go` (`deepseek-v4-flash`) | reasoning model pinned to `--variant max` (max thinking tier) by policy — the fan-out builder upgrades a lower requested effort automatically |
| `minimax` (MiniMax-M3) | behavior unverified — omitted by default; confirm before relying |
| `xiaomi` (mimo) | maps to MiMo effort (low/medium/high); **always use `--variant high`** |
| `openai` GPT-5.6 (sol/luna) | maps to OpenAI effort `none`/`low`/`medium`/`high`/**`xhigh`**; Pro tiers `medium`/`high`/`xhigh`; `-fast` slugs are the low-latency Fast tier with the same range |
| `cline-pass` (deepseek-v4-flash) | reasoning effort accepted — tiers `none`/`low`/`medium`/`high`/**`xhigh`**; **no `max`**; **default/pinned `--variant xhigh`** (top thinking tier) |

---

## 5. HOW TO INVOKE

### Dispatch envelope (child / detached sessions)
When dispatching as a non-interactive child (spec-gate-neutralized worker), prefix the shared env and terminate stdin:

```bash
SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run \
  --model opencode-go/deepseek-v4-flash --variant max --format json \
  --dir "$REPO_ROOT" "<prompt>" </dev/null > stdout.log 2> stderr.log
```

- `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` — neutralizes the spec-gate for a bound child worker so it does not stall waiting on an interactive Gate-3 answer.
- `</dev/null` — REQUIRED before stdout/stderr redirects; opencode reads stdin at startup and hangs at 0% CPU without an EOF. See [integration-patterns.md](./integration-patterns.md) §6.

### Self-invocation guard
An opencode dispatch must not recursively re-enter the same session/worker. The guard is packet-local — see [self-invocation-guard.md](./self-invocation-guard.md).

### Parallel / fan-out
Multi-lineage parallel dispatch is driven by `fanout-run.cjs`, which lives outside this hub — see §6.

---

## 6. ENFORCEMENT & PROFILES (authoritative elsewhere — do not duplicate here)

- **Fan-out dispatcher** → `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- **Live model ids** → `opencode models <provider>` on the target install

---

## 7. RELATED

- [cli-reference.md](./cli-reference.md) — full `opencode run` flags, subcommands, auth pre-flight, troubleshooting
- [integration-patterns.md](./integration-patterns.md) — dispatch shapes + failure-mode matrix
- [../SKILL.md](../SKILL.md) — cli-opencode mode overview and routing
