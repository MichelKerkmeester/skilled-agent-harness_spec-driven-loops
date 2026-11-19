---
title: cli-opencode Providers, Models & Invocation
description: The dedicated per-mode catalog of every provider, model id, default, reasoning-effort lever and dispatch shape reachable through the cli-opencode mode.
trigger_phrases:
  - "opencode providers and models"
  - "which model for opencode dispatch"
  - "opencode effort suffix"
  - "opencode default model llmgateway flash"
  - "opencode minimax llmgateway gpt dispatch"
  - "opencode mistral deepseek glm route"
importance_tier: normal
contextType: implementation
version: 1.4.22.0
---

# cli-opencode Providers, Models & Invocation

The single catalog of the providers, model ids, defaults, the reasoning-effort lever (the `#<level>` suffix on the model id), and dispatch shapes the cli-opencode mode can reach.

---

## 1. OVERVIEW

### Purpose

One place to answer "which provider, which model, which effort, how to dispatch" for cli-opencode.

### When to Use

- Choosing a `-m provider/model-id` for an `opencode run` dispatch
- Mapping a desired reasoning effort onto the model id (`-m provider/model#<level>`) for a given provider
- Recalling the default model and the canonical non-interactive invocation shape

### Core Principle

This mode is the multi-provider master, reaching more providers than any other cli mode.

### Scope
This file enumerates the provider/model/effort facts and the dispatch envelope. It does NOT own: the full `opencode run` flag surface and auth pre-flight decision trees (see [cli-reference.md](./cli-reference.md)), per-model prompt-craft (see §6), or the fan-out / model-enforcement runtime (see §6).

### Authority pointers
- Full CLI flags, subcommands, auth pre-flight, troubleshooting → [cli-reference.md](./cli-reference.md)
- Dispatch envelope + failure-mode matrix → [integration-patterns.md](./integration-patterns.md)
- Live model ids on a given install → `opencode models --standalone` filtered for the `<provider>/` prefix

**Version baseline.** This catalog is pinned to OpenCode 2 at 2.3.2, the only supported version. Provider observations that name 2.0.32 were read on that release and have not been re-read on 2.3.2. Later versions are unsupported until re-verified. The install and upgrade path is in [`install-and-versions.md`](./install-and-versions.md).

---

## 2. PROVIDERS & MODELS

> **CLOSED ROSTER: non-roster models are FORBIDDEN.** Dispatch ONLY the models catalogued in this section. Any model not in this catalog MUST NOT be called through cli-opencode. Unlike cli-pi/cli-cursor/cli-devin, cli-opencode has **no code-enforced allowlist** (`-m provider/id` is free-form and the deep-loop fan-out does not gate opencode ids), so this is a **hard discipline rule**, not a runtime gate: adherence to this catalog IS the enforcement. To add a model, amend this catalog first. Never dispatch an unlisted id ad hoc. **A provider's live catalog is not a roster.** Every gateway below fronts far more ids than this file lists, and those extra ids are forbidden exactly as an unknown provider would be: the roster is per provider, and a model allowed on one route is not thereby allowed on another.

OpenCode resolves models through configured providers. The model string passed to `-m` is always `provider/model-id`. Run `opencode models --standalone` filtered for the `<provider>/` prefix for the live list on a given install, but a live id that is NOT in this catalog is still forbidden for cli-opencode dispatch.

### minimax

| Model id | Default? | Notes |
|----------|----------|-------|
| `minimax/MiniMax-M3` | no | MiniMax Direct API (pay-per-token), needs `MINIMAX_API_KEY` |

### openai

GPT-6 via the `openai` provider: three personas (sol/luna/terra) × two speed tiers (base / fast) = 6 slugs. `gpt-6-sol` is the flagship default persona. Terra returns as GPT-6.1 Terra: on 2026-10-27 `opencode models openai --refresh` on OpenCode 1 (1.19.x) listed `openai/gpt-6.1-terra` and `openai/gpt-6.1-terra-fast`, and a one-turn `opencode run` on the base slug, also on OpenCode 1, replied `OK`. That run has not been repeated on 2.3.2. The older `gpt-5.6-terra` slugs stay off this roster. On 2026-09-23 `opencode models openai` on OpenCode 1 (1.19.x) listed the base and `-fast` slugs for both personas and no `-pro` slug for either, so this roster carries no Pro tier. On 2026-11-19 `opencode models --standalone` on OpenCode 2.3.2 listed 22 `openai/` ids, including all six roster slugs below, `openai/gpt-6-astra` and `openai/gpt-6-astra-fast`, and no `-pro` slug. The astra slugs and the other listed ids are not on this roster: a listed slug outside the table stays forbidden under the closed-roster rule.

| Persona | Base | Fast (low-latency) |
|---------|------|--------------------|
| sol | `openai/gpt-6-sol` | `openai/gpt-6-sol-fast` |
| luna | `openai/gpt-6-luna` | `openai/gpt-6-luna-fast` |
| terra | `openai/gpt-6.1-terra` | `openai/gpt-6.1-terra-fast` |

### opencode-go

opencode-go gateway (subsidized "2x usage" rate). It fronts the DeepSeek, GLM, Qwen and Hy4 families, and its flash route is `opencode-go/deepseek-v4.1-flash` (the direct DeepSeek API provider was retired). It is not the mode default: `llmgateway/deepseek-v4.1-flash-1017` is. Confirm live slugs with `opencode models --standalone` filtered for the `opencode-go/` prefix.

| Model id | Default? | Notes |
|----------|----------|-------|
| `opencode-go/deepseek-v4.1-flash` | no | DeepSeek V4.1 Flash via the Go gateway. Takes images as well as text, so a dispatch that needs a screenshot or diagram does not have to leave this route. Reasoning model: dispatch it as `-m opencode-go/deepseek-v4.1-flash#max`, which needs its own opencode-go login (`opencode auth login opencode-go`) because OpenCode 2.0.32 listed no `opencode-go` provider otherwise. On 2026-11-19 `opencode models --standalone` on OpenCode 2.3.2 listed this id. List-verified and **dispatch-verified 2026-09-11** (a live `opencode run` turn returned its token for $0.0012). It superseded `deepseek-v4-flash-vision-exp` on this route at an identical catalog cost ($0.15 in / $0.60 out per 1M, cached reads $0.003) and the same 1M context and 384K output ceiling, so the move trades no capability and no price |
| `opencode-go/glm-5.3` | no | Z.AI GLM 5.3 via the Go gateway, list-verified in `opencode models opencode-go` on OpenCode 1 on 2026-08-14 (not dispatch-tested). Not listed by `opencode models --standalone` on OpenCode 2.3.2 on 2026-11-19, so confirm the listing shows it under the `opencode-go/` prefix before dispatching it. opencode-go also fronts `glm-5.1`/`glm-5.2`, out of this catalog's curated scope |
| `opencode-go/glm-5.3-flash` | no | Z.AI GLM-5.3-Flash via the Go gateway, a reasoning model whose ladder here is `low`/`high`/**`max`** (this route has **no `xhigh`**), dispatched as `-m opencode-go/glm-5.3-flash#max`. Ladder re-verified in `opencode models opencode-go --verbose` on OpenCode 1 on 2026-09-04 (OpenCode 2.0.32 listed no `opencode-go` provider), and not re-read on 2.3.2. On 2026-11-19 `opencode models --standalone` on OpenCode 2.3.2 listed this id |
| `opencode-go/qwen3.8-max` | no | Qwen 3.8 Max via the Go gateway. A live `opencode run --model opencode-go/qwen3.8-max` turn on OpenCode 1 completed 2026-08-07. Not listed by `opencode models --standalone` on OpenCode 2.3.2 on 2026-11-19, so confirm the listing shows it under the `opencode-go/` prefix before dispatching it |
| `opencode-go/hy4-flash-free` | no | Hy4 Flash Free via the Go gateway. It is a reasoning model that takes images as well as text, with a 1M context and 65K output, and the catalog prices it at $0 per token. It has two thinking levels and no others: **`none`** (thinking off) and **`high`**. Dispatch it as `-m opencode-go/hy4-flash-free#high`, which needs its own opencode-go login (`opencode auth login opencode-go`). Pi does not list this id, so it is an OpenCode route only. The gateway also lists `hy4`, `hy4-preview` and `hy3`, which are outside this roster. **Dispatch-verified 2026-11-17** on OpenCode 1.19.4: a one-turn `opencode run` replied `OK` at each of the two levels. Not re-run on 2.3.2, which listed the id on 2026-11-19 |

### llmgateway

DevPass (LLM Gateway) subscription, base `https://api.llmgateway.io/v1`, OpenAI-compatible. It hosts this mode's **default model**, `llmgateway/deepseek-v4.1-flash-1017`. Pass the **two-segment** `llmgateway/<id>` to `-m`. Authenticate with `opencode auth login`, where the credential registers as **`llmgateway`** and shows in `opencode auth list` as "DevPass (LLM Gateway)". Confirm live slugs with `opencode models --standalone` filtered for the `llmgateway/` prefix.

> **The gateway takes BARE model ids.** `llmgateway/deepseek-v4.1-flash-1017` is provider + id, and the id sent on the wire is `deepseek-v4.1-flash-1017`. Sending a prefixed id returns `400 "Provider llmgateway does not support model …"`. The gateway also rewrites ids upstream in its reply (`deepseek/…`, `zai/…`). Those names are informational and are never sent.

> **DevPass bills per token at normal API list rates.** The plan buys credits at a 3x bonus, which discounts the bill rather than removing it, so a cached read still costs less than an uncached one and neither is free. LLM Gateway classifies a model **Premium** at $15+/1M output or $5+/1M input and caps Premium use at 12%/15%/18% of monthly credits per week (Lite/Pro/Max). All three models below are **Standard**, so **no weekly cap applies to this roster**.

> **`llmgateway` fronts 262 models. Exactly the three below are in scope.** The rest are forbidden under the closed-roster rule, and `llmgateway/auto` is excluded deliberately because a router can resolve outside a closed roster.

| Model id | Default? | Notes |
|----------|----------|-------|
| `llmgateway/deepseek-v4.1-flash-1017` | ✓ | **The mode default.** DeepSeek V4.1 Flash via DevPass, the 2026-10-17 release, reasoning **and images**. Dispatch it as `-m llmgateway/deepseek-v4.1-flash-1017#max`. Context 1.05M, output 384K, $0.15 in and $0.60 out per million tokens, cached reads $0.003. Well under the gateway's Premium threshold, so no weekly cap. Three efforts plus off: **`low`**, **`high`** and **`max`**, with `minimal` folding into `low`, `medium` and `xhigh` folding into `high`, and `none` disabling thinking. Default `high`. `ultra` and the integer form are rejected here |
| `llmgateway/deepseek-v4.1-flash` | no | The **2026-09-10** release of DeepSeek V4.1 Flash via DevPass, still selectable and pinnable. It carries the same 1.05M context, 384K output, $0.15 in and $0.60 out per million tokens and cached reads $0.003, and the same effort ladder as the `-1017` release, so pinning it trades no capability and no price. DeepSeek's own provider route for it **deactivates on 2026-10-24**, after which the `-1017` default is the one that keeps answering. Dispatch it as `-m llmgateway/deepseek-v4.1-flash#max`. Live-verified 2026-09-10. `low`/**`high`**/**`max`** plus off, default `high`; `ultra` and the integer form are rejected here. It replaced `deepseek-v4-flash-vision-exp`, which the gateway deactivated and now answers `410` for |
| `llmgateway/glm-5.3-flash` | no | GLM-5.3-Flash via DevPass, a reasoning route with the full ladder including **both `xhigh` and `max`**, the only GLM-5.3-Flash route carrying both, so dispatch it as `-m llmgateway/glm-5.3-flash#max`. Context 1.05M, output 131K. Dispatch-tested 2026-09-04 |

### mistral

The operator's Mistral subscription, through OpenCode's built-in `mistral` provider at `https://api.mistral.ai/v1`. Mistral hosts both models below as third-party open-weight models it serves without modification. The credential is saved through OpenCode's connect flow and registers as the `mistral` integration. On 2026-11-14, `opencode models --standalone` on OpenCode 2.3.0 listed both ids, and a one-turn `opencode run --standalone` on each replied `OK`. A non-default route: `llmgateway/deepseek-v4.1-flash-1017` stays the mode default.

> **Mistral ids use dashes, not dots.** The DeepSeek id is `deepseek-v4-1-flash-1017` and the GLM id carries the vendor, `zai-glm-5-3-flash`. The DevPass forms (`deepseek-v4.1-flash-1017`, `glm-5.3-flash`) do not resolve on this provider. Mistral's docs page URL drops the `-1` (`deepseek-v4-flash-1017`), and that slug is not the id either.

> **Billing follows the key.** OpenCode prices a turn at Mistral's API list rate, so the DeepSeek route reads as double the DevPass rate ($0.30 in, $1.20 out, $0.007 cached per million tokens, against $0.15, $0.60 and $0.003). What Mistral charges depends on the key: the Vibe browser sign-in key (macOS keychain item `ai.mistral.vibe`) bills the plan's Vibe budget, and any other Mistral key bills the separate API budget. Save the sign-in key as the `mistral` credential so OpenCode turns bill the Vibe budget. On 2026-11-15 a `--standalone` `#max` turn with it replied `ok` and moved only the Vibe budget, while a run against a server started before the key change answered `Model unavailable`.

> **`mistral` fronts many more ids. Exactly the two below are in scope.** The rest, and the `llmgateway-providers/mistral/*` ids OpenCode also lists, are forbidden under the closed-roster rule.

| Model id | Default? | Notes |
|----------|----------|-------|
| `mistral/deepseek-v4-1-flash-1017` | no | DeepSeek V4.1 Flash, the 2026-10-17 release, hosted by Mistral, text and images. Context 1M, output 128K. `-m mistral/deepseek-v4-1-flash-1017#max` replied `OK` on 2026-11-14 at $0.0050 for 16,286 input tokens, and `#ultra` is refused with `Variant unavailable for mistral/deepseek-v4-1-flash-1017: ultra`. Pass `#max` to match the DeepSeek Flash policy elsewhere in this file |
| `mistral/zai-glm-5-3-flash` | no | Z.AI GLM-5.3-Flash, hosted by Mistral, text and images. Context 1M, output 131K. `-m mistral/zai-glm-5-3-flash#max` replied `OK` on 2026-11-14 at $0.0024 for 16,084 input tokens. Its full variant ladder on this route is not measured, so pass `#max` explicitly |

---

## 3. DEFAULTS & QUICK INVOCATION

Dispatch this mode's default without opening any other file:

| Field | Value |
|-------|-------|
| Default model | `llmgateway/deepseek-v4.1-flash-1017` |
| Default effort | `-m llmgateway/deepseek-v4.1-flash-1017#max` (flash is max-tier-pinned by policy) |
| Default format | `--format json` |

```bash
cd "$REPO_ROOT" && opencode run --standalone \
  -m llmgateway/deepseek-v4.1-flash-1017#max \
  --format json \
  "<prompt>" </dev/null
```

OpenCode 2.0.32 listed no `opencode-go` provider without its own login, so `llmgateway/deepseek-v4.1-flash-1017` is the single default (2.3.2 listed `opencode-go/` ids on 2026-11-19, and the default stays unchanged). Confirm that `opencode models --standalone` lists the `<provider>/` prefix of the model you pass to `-m` first. A leading `cd` carries the working directory, and the model id carries the effort as its `#<level>` suffix. The install and upgrade path is in [install-and-versions.md](./install-and-versions.md).

If the default provider is not configured, the mode ASKS the operator before substituting. It never silently swaps a model. See the auth pre-flight decision tree in [cli-reference.md](./cli-reference.md) §4.

---

## 4. REASONING-EFFORT / THINKING LEVER

cli-opencode expresses reasoning effort through the model id (`-m provider/model#<level>`), which maps to a provider-specific effort scale. Default skill behavior is `#high` for non-pinned models, and the default model is pinned to its max tier by policy: `llmgateway/deepseek-v4.1-flash-1017` at `#max`. The ladders below were observed on OpenCode 1 and are unverified on 2.3.2, except the `mistral` row, which was observed on OpenCode 2.3.0.

| Provider | Effort ladder |
|----------|----------------------|
| `opencode-go` (`deepseek-v4.1-flash`) | dispatch it as `-m opencode-go/deepseek-v4.1-flash#max`, which needs its own opencode-go login (`opencode auth login opencode-go`). It is a reasoning model pinned to the max thinking tier by policy. The fan-out builder upgrades a lower requested effort automatically |
| `minimax` (MiniMax-M3) | behavior unverified, omitted by default. Confirm before relying |
| `openai` GPT-6 (sol/luna) | maps to OpenAI effort `none`/`low`/`medium`/`high`/**`xhigh`**, with Pro tiers at `medium`/`high`/`xhigh`. The `-fast` slugs are the low-latency Fast tier with the same range. GPT-6.1 Terra's variant range on OpenCode is not yet measured, and the Codex catalog lists its efforts as `low` through `ultra` |
| `llmgateway` (DevPass) | per-model, not per-provider. `deepseek-v4.1-flash-1017` carries three efforts plus off, `low`/**`high`**/**`max`**, with `minimal` folding into `low` and `medium`/`xhigh` folding into `high`, and the older `deepseek-v4.1-flash` release carries the same ladder. `glm-5.3-flash` carries the full ladder to `max`. Always pass the level explicitly here |
| `mistral` | Both roster ids accept `#max`, and the DeepSeek id refuses `#ultra`. The rest of either ladder is not measured, so pass `#max` explicitly |

---

## 5. HOW TO INVOKE

### Dispatch envelope (child / detached sessions)
When dispatching as a non-interactive child (spec-gate-neutralized worker), prefix the shared env and terminate stdin:

```bash
cd "$REPO_ROOT" && SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 \
  opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json \
  "<prompt>" </dev/null > stdout.log 2> stderr.log
```

- `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1`: neutralizes the spec-gate for a bound child worker so it does not stall waiting on an interactive Gate-3 answer.
- `</dev/null`: REQUIRED before stdout/stderr redirects. opencode reads stdin at startup and hangs at 0% CPU without an EOF. See [integration-patterns.md](./integration-patterns.md) §6.
- `--standalone`: REQUIRED on every child dispatch.

### Self-invocation guard
An opencode dispatch must not recursively re-enter the same session/worker. The guard is packet-local. See [self-invocation-guard.md](./self-invocation-guard.md).

### Parallel / fan-out
Multi-lineage parallel dispatch is driven by `fanout-run.cjs`, which lives outside this hub. See §6.

---

## 6. ENFORCEMENT & PROFILES (authoritative elsewhere, do not duplicate here)

- **Fan-out dispatcher** → `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- **Live model ids** → `opencode models --standalone` filtered for the `<provider>/` prefix

---

## 7. RELATED

- [cli-reference.md](./cli-reference.md): full `opencode run` flags, subcommands, auth pre-flight, troubleshooting
- [integration-patterns.md](./integration-patterns.md): dispatch shapes + failure-mode matrix
- [../SKILL.md](../SKILL.md): cli-opencode mode overview
- [../ROUTER.md](../ROUTER.md): machine router with the intent map, resource map, loading levels and the self-invocation guard
