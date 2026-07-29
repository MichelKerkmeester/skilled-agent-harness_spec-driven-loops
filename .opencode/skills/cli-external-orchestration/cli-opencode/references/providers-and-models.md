---
title: cli-opencode Providers, Models & Invocation
description: The dedicated per-mode catalog of every provider, model id, default, reasoning-effort lever and dispatch shape reachable through the cli-opencode mode.
trigger_phrases:
  - "opencode providers and models"
  - "which model for opencode dispatch"
  - "opencode variant reasoning effort"
  - "opencode default model deepseek"
  - "opencode minimax kimi glm dispatch"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
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

| Provider | Example model id | Default? | Notes |
|----------|------------------|----------|-------|
| `deepseek` | `deepseek/deepseek-v4-pro` | **Default** | Deep reasoning at low cost via direct DeepSeek API |
| `deepseek` | `deepseek/deepseek-v4-flash` | — | Latency-optimized sibling; non-reasoning (`--variant` ignored) |
| `kimi-for-coding` | `kimi-for-coding/k2p7` | — | Kimi K2.7 Code, 256k context; subscription plan |
| `zai-coding-plan` | `zai-coding-plan/glm-5.2` | — | GLM-5.2 flagship, 1M context; subscription; omit `--agent` |
| `minimax-coding-plan` | `minimax-coding-plan/MiniMax-M3` | Default MiniMax | MiniMax Token Plan (subscription); omit `--agent` |
| `minimax` | `minimax/MiniMax-M3` | — | MiniMax Direct API (pay-per-token); needs `MINIMAX_API_KEY` |
| `xiaomi-token-plan-ams` | `xiaomi-token-plan-ams/mimo-v2.5-pro` | — | MiMo-V2.5-Pro Token Plan (Europe); 1M context, strongly agentic; omit `--agent` |
| `xiaomi` | `xiaomi/mimo-v2.5-pro` (+ `-ultraspeed`) | — | MiMo Direct API (pay-per-token); `-ultraspeed` is the low-latency tier |
| `openai` | `openai/gpt-5.6` family | — | Full GPT-5.6 catalog — see the persona/tier grid below |

### OpenAI GPT-5.6 slug grid (via the `openai` provider)

Three personas × three tiers = 12 slugs. `gpt-5.6-sol` is the flagship default persona; confirm live slugs via `opencode models openai`.

| Persona | Base | Fast (low-latency) | Pro |
|---------|------|--------------------|-----|
| (plain) | `openai/gpt-5.6` | `openai/gpt-5.6-fast` | `openai/gpt-5.6-pro` |
| sol | `openai/gpt-5.6-sol` | `openai/gpt-5.6-sol-fast` | `openai/gpt-5.6-sol-pro` |
| terra | `openai/gpt-5.6-terra` | `openai/gpt-5.6-terra-fast` | `openai/gpt-5.6-terra-pro` |
| luna | `openai/gpt-5.6-luna` | `openai/gpt-5.6-luna-fast` | `openai/gpt-5.6-luna-pro` |

### Model-specific operational caveats
- **Kimi K2.7 Code over-exploration:** on broad scopes at `--variant high`, k2p7 over-explores and can exceed a 600s timeout without emitting (a killed run yields 0 bytes — looks like a hang). Mitigate with a read-cap in the prompt + a 1200s+ timeout, or omit `--variant`.
- **GLM-5.2 latency variance:** thinking-on drives latency 6–161s (avg ~26s); budget generous timeouts and expect ~1/45 transient failures (retry the cell).
- **GLM-5.2 vision:** `opencode run --file <image>` does NOT deliver images to this provider (upstream #20802 → `NO_IMAGE_RECEIVED`); use the direct Z.AI multimodal API for image input.

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
| `minimax-coding-plan` / `minimax` | behavior unverified — omitted by default; confirm before relying |
| `xiaomi-token-plan-ams` / `xiaomi` (mimo) | maps to MiMo effort (low/medium/high); **always use `--variant high`** |
| `zai-coding-plan` (glm-5.2) | GLM has native `reasoning_effort` (high/max); whether `--variant` forwards is unverified |
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
