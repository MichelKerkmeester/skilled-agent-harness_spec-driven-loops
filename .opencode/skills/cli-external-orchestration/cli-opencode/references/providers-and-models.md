---
title: cli-opencode Providers, Models & Invocation
description: The dedicated per-mode catalog of every provider, model id, default, reasoning-effort lever and dispatch shape reachable through the cli-opencode mode.
trigger_phrases:
  - "opencode providers and models"
  - "which model for opencode dispatch"
  - "opencode variant reasoning effort"
  - "opencode default model deepseek"
  - "opencode minimax xiaomi gpt dispatch"
importance_tier: normal
contextType: implementation
version: 1.1.0.0
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

OpenCode resolves models through configured providers; the model string passed to `--model` is always `provider/model-id`. Run `opencode models <provider>` for the live list on a given install.

### deepseek

Policy: DeepSeek V4 Flash is a reasoning model (confirmed via `opencode models deepseek`: `reasoning: true`, with a `max` thinking level) and is dispatched **only at its max thinking tier** — never at a lower effort. The fan-out builder pins `deepseek-v4-flash` to `--variant max` automatically, so a lineage that requests a lower effort is upgraded to max.

| Model id | Default? | Notes |
|----------|----------|-------|
| `deepseek/deepseek-v4-pro` | **Default** | Deep reasoning at low cost via direct DeepSeek API |
| `deepseek/deepseek-v4-flash` | — | Latency-optimized reasoning sibling; pinned to `--variant max` (max thinking tier) by policy |

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

GPT-5.6 via the `openai` provider — three personas (sol/terra/luna) × three speed tiers (base / fast / pro) = 9 slugs. `gpt-5.6-sol` is the flagship default persona; confirm live slugs via `opencode models openai`.

| Persona | Base | Fast (low-latency) | Pro |
|---------|------|--------------------|-----|
| sol | `openai/gpt-5.6-sol` | `openai/gpt-5.6-sol-fast` | `openai/gpt-5.6-sol-pro` |
| terra | `openai/gpt-5.6-terra` | `openai/gpt-5.6-terra-fast` | `openai/gpt-5.6-terra-pro` |
| luna | `openai/gpt-5.6-luna` | `openai/gpt-5.6-luna-fast` | `openai/gpt-5.6-luna-pro` |

### opencode-go

OpenCode Go gateway (subsidized "2x usage" rate); fronts the DeepSeek, GLM, and Qwen families. Confirm live slugs via `opencode models opencode-go`.

| Model id | Default? | Notes |
|----------|----------|-------|
| `opencode-go/deepseek-v4-flash` | — | Latency-optimized DeepSeek V4 Flash via the Go gateway (2x usage); reasoning model pinned to `--variant max` by policy; a live `opencode run --model opencode-go/deepseek-v4-flash` turn completed 2026-08-07 |
| `opencode-go/glm-5.3` | — | Z.AI GLM 5.3 via the Go gateway; list-verified in `opencode models opencode-go` on 2026-08-14 (not dispatch-tested). opencode-go also fronts `glm-5.1`/`glm-5.2`, out of this catalog's curated scope |
| `opencode-go/qwen3.8-max` | — | Qwen 3.8 Max via the Go gateway; a live `opencode run --model opencode-go/qwen3.8-max` turn completed 2026-08-07 |

---

## 3. DEFAULTS & QUICK INVOCATION

Dispatch this mode's default without opening any other file:

| Field | Value |
|-------|-------|
| Default model | `deepseek/deepseek-v4-pro` |
| Default effort | `--variant high` |
| Default format | `--format json` |

```bash
opencode run \
  --model deepseek/deepseek-v4-pro \
  --variant high \
  --format json \
  --dir "$REPO_ROOT" \
  "<prompt>" </dev/null
```

If the default provider is not configured, the mode ASKS the operator before substituting — never silently swaps a model. See the auth pre-flight decision tree in [cli-reference.md](./cli-reference.md) §4.

---

## 4. REASONING-EFFORT / THINKING LEVER

cli-opencode expresses reasoning effort through the **`--variant`** flag, which maps to a provider-specific effort scale. Default skill behavior is `--variant high`.

| Provider | `--variant` behavior |
|----------|----------------------|
| `deepseek` (`-v4-pro`) | reasoning effort accepted |
| `deepseek` (`-v4-flash`) | non-reasoning — `--variant` ignored |
| `minimax` (MiniMax-M3) | behavior unverified — omitted by default; confirm before relying |
| `xiaomi` (mimo) | maps to MiMo effort (low/medium/high); **always use `--variant high`** |
| `openai` GPT-5.6 | maps to OpenAI effort `none`/`low`/`medium`/`high`/**`xhigh`**; Pro tiers `medium`/`high`/`xhigh`; `-fast` slugs are the low-latency Fast tier with the same range |

---

## 5. HOW TO INVOKE

### Dispatch envelope (child / detached sessions)
When dispatching as a non-interactive child (spec-gate-neutralized worker), prefix the shared env and terminate stdin:

```bash
MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run \
  --model deepseek/deepseek-v4-pro --variant high --format json \
  --dir "$REPO_ROOT" "<prompt>" </dev/null > stdout.log 2> stderr.log
```

- `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` — neutralizes the spec-gate for a bound child worker so it does not stall waiting on an interactive Gate-3 answer.
- `</dev/null` — REQUIRED before stdout/stderr redirects; opencode reads stdin at startup and hangs at 0% CPU without an EOF. See [integration-patterns.md](./integration-patterns.md) §6.

### Self-invocation guard
An opencode dispatch must not recursively re-enter the same session/worker. The guard is packet-local — see [self-invocation-guard.md](./self-invocation-guard.md).

### Parallel / fan-out
Multi-lineage parallel dispatch is driven by `fanout-run.cjs`, which lives outside this hub — see §6.

---

## 6. ENFORCEMENT & PROFILES (authoritative elsewhere — do not duplicate here)

- **Per-model prompt-craft profiles** → `.opencode/skills/sk-prompt/sk-prompt-models/assets/model-profiles.json`
- **Fan-out dispatcher** → `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- **Live model ids** → `opencode models <provider>` on the target install

---

## 7. RELATED

- [cli-reference.md](./cli-reference.md) — full `opencode run` flags, subcommands, auth pre-flight, troubleshooting
- [integration-patterns.md](./integration-patterns.md) — dispatch shapes + failure-mode matrix
- [../SKILL.md](../SKILL.md) — cli-opencode mode overview and routing
