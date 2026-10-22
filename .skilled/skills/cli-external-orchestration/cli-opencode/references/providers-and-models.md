---
title: cli-opencode Providers, Models & Invocation
description: The dedicated per-mode catalog of every provider, model id, default, reasoning-effort lever and dispatch shape reachable through the cli-opencode mode.
trigger_phrases:
  - "opencode providers and models"
  - "which model for opencode dispatch"
  - "opencode variant reasoning effort"
  - "opencode default model llmgateway flash"
  - "opencode minimax llmgateway gpt dispatch"
importance_tier: normal
contextType: implementation
version: 1.4.13.0
---

# cli-opencode Providers, Models & Invocation

The single catalog of the providers, model ids, defaults, the `--variant` effort lever (OpenCode 1 only), and dispatch shapes the cli-opencode mode can reach.

---

## 1. OVERVIEW

### Core Principle
One place to answer "which provider, which model, which effort, how to dispatch" for cli-opencode. This mode is the multi-provider master, reaching more providers than any other cli mode.

### When to Use
- Choosing a `--model provider/model-id` for an `opencode run` dispatch
- Mapping a desired reasoning effort onto the `--variant` flag (OpenCode 1 only) for a given provider. On OpenCode 2 the level rides on the model id instead (`-m provider/model#<level>`).
- Recalling the default model and the canonical non-interactive invocation shape

### Scope
This file enumerates the provider/model/effort facts and the dispatch envelope. It does NOT own: the full `opencode run` flag surface and auth pre-flight decision trees (see [cli-reference.md](./cli-reference.md)), per-model prompt-craft (see §6), or the fan-out / model-enforcement runtime (see §6).

### Authority pointers
- Full CLI flags, subcommands, auth pre-flight, troubleshooting → [cli-reference.md](./cli-reference.md)
- Dispatch envelope + failure-mode matrix → [integration-patterns.md](./integration-patterns.md)
- Live model ids on a given install → `opencode models <provider>` on OpenCode 1, or `opencode2 models --standalone` filtered for the `<provider>/` prefix on OpenCode 2

**Verified versions.** Verified against OpenCode 1.19.3 and 2.0.32 on 2026-10-19. Loads and runs on both, with a documented capability delta. Later versions are unsupported until re-verified. The delta is in [`install-and-versions.md`](./install-and-versions.md).

---

## 2. PROVIDERS & MODELS

> **CLOSED ROSTER: non-roster models are FORBIDDEN.** Dispatch ONLY the models catalogued in this section. Any model not in this catalog MUST NOT be called through cli-opencode. Unlike cli-pi/cli-cursor/cli-devin, cli-opencode has **no code-enforced allowlist** (`--model provider/id` is free-form and the deep-loop fan-out does not gate opencode ids), so this is a **hard discipline rule**, not a runtime gate: adherence to this catalog IS the enforcement. To add a model, amend this catalog first. Never dispatch an unlisted id ad hoc. **A provider's live catalog is not a roster.** Every gateway below fronts far more ids than this file lists, and those extra ids are forbidden exactly as an unknown provider would be: the roster is per provider, and a model allowed on one route is not thereby allowed on another.

OpenCode resolves models through configured providers. The model string passed to `--model` is always `provider/model-id`. Run `opencode models <provider>` on OpenCode 1 (on OpenCode 2, `opencode2 models --standalone` filtered for the `<provider>/` prefix) for the live list on a given install, but a live id that is NOT in this catalog is still forbidden for cli-opencode dispatch.

### minimax

| Model id | Default? | Notes |
|----------|----------|-------|
| `minimax/MiniMax-M3` | no | MiniMax Direct API (pay-per-token), needs `MINIMAX_API_KEY` |

### openai

GPT-6 via the `openai` provider: two personas (sol/luna) × two speed tiers (base / fast) = 4 slugs (the Terra persona was retired). `gpt-6-sol` is the flagship default persona. On 2026-09-23 `opencode models openai` on OpenCode 1 listed the base and `-fast` slugs for both personas and no `-pro` slug for either, so this roster carries no Pro tier. The catalog also lists `openai/gpt-6-astra` and `openai/gpt-6-astra-fast`, which are not on this roster. Run `opencode models openai` on OpenCode 1 (OpenCode 2 lists no `openai` provider) before dispatching any slug not in the table.

| Persona | Base | Fast (low-latency) |
|---------|------|--------------------|
| sol | `openai/gpt-6-sol` | `openai/gpt-6-sol-fast` |
| luna | `openai/gpt-6-luna` | `openai/gpt-6-luna-fast` |

### opencode-go

opencode-go gateway (subsidized "2x usage" rate). It fronts the DeepSeek, GLM, and Qwen families, and its flash route is `opencode-go/deepseek-v4.1-flash` (the direct DeepSeek API provider was retired). It is no longer the mode default: `llmgateway/deepseek-v4.1-flash-1017` is, on both versions. Confirm live slugs via `opencode models opencode-go` on OpenCode 1.

| Model id | Default? | Notes |
|----------|----------|-------|
| `opencode-go/deepseek-v4.1-flash` | no | DeepSeek V4.1 Flash via the Go gateway. Takes images as well as text, so a dispatch that needs a screenshot or diagram does not have to leave this route. Reasoning model pinned to `--variant max` (OpenCode 1 only) by policy, a tier this route carries. On OpenCode 2 the equivalent is `-m opencode-go/deepseek-v4.1-flash#max`, which needs its own opencode-go login on v2 (`opencode2 providers login opencode-go`) because v2 lists no `opencode-go` provider otherwise. List-verified and **dispatch-verified 2026-09-11** (a live `opencode run` turn returned its token for $0.0012). It superseded `deepseek-v4-flash-vision-exp` on this route at an identical catalog cost ($0.15 in / $0.60 out per 1M, cached reads $0.003) and the same 1M context and 384K output ceiling, so the move trades no capability and no price |
| `opencode-go/glm-5.3` | no | Z.AI GLM 5.3 via the Go gateway, list-verified in `opencode models opencode-go` on OpenCode 1 on 2026-08-14 (not dispatch-tested). opencode-go also fronts `glm-5.1`/`glm-5.2`, out of this catalog's curated scope |
| `opencode-go/glm-5.3-flash` | no | Z.AI GLM-5.3-Flash via the Go gateway, a reasoning model whose ladder here is `low`/`high`/**`max`** (this route has **no `xhigh`**), pinned to `--variant max` (OpenCode 1 only) by policy. On OpenCode 2 the equivalent is `-m opencode-go/glm-5.3-flash#max`. Ladder re-verified in `opencode models opencode-go --verbose` on OpenCode 1 on 2026-09-04 (OpenCode 2 lists no `opencode-go` provider) |
| `opencode-go/qwen3.8-max` | no | Qwen 3.8 Max via the Go gateway. A live `opencode run --model opencode-go/qwen3.8-max` turn completed 2026-08-07 |

### llmgateway

DevPass (LLM Gateway) subscription, base `https://api.llmgateway.io/v1`, OpenAI-compatible. It hosts this mode's **default model on both OpenCode versions**, `llmgateway/deepseek-v4.1-flash-1017`. Pass the **two-segment** `llmgateway/<id>` to `--model`. Authenticate with `opencode auth login`, where the credential registers as **`llmgateway`** and shows in `opencode auth list` as "DevPass (LLM Gateway)". Confirm live slugs via `opencode models llmgateway` on OpenCode 1, or `opencode2 models --standalone` filtered for `llmgateway/` on OpenCode 2.

> **The gateway takes BARE model ids.** `llmgateway/deepseek-v4.1-flash-1017` is provider + id, and the id sent on the wire is `deepseek-v4.1-flash-1017`. Sending a prefixed id returns `400 "Provider llmgateway does not support model …"`. The gateway also rewrites ids upstream in its reply (`deepseek/…`, `zai/…`). Those names are informational and are never sent.

> **DevPass bills per token at normal API list rates.** The plan buys credits at a 3x bonus, which discounts the bill rather than removing it, so a cached read still costs less than an uncached one and neither is free. LLM Gateway classifies a model **Premium** at $15+/1M output or $5+/1M input and caps Premium use at 12%/15%/18% of monthly credits per week (Lite/Pro/Max). All three models below are **Standard**, so **no weekly cap applies to this roster**.

> **`llmgateway` fronts 262 models. Exactly the three below are in scope.** The rest are forbidden under the closed-roster rule, and `llmgateway/auto` is excluded deliberately because a router can resolve outside a closed roster.

| Model id | Default? | Notes |
|----------|----------|-------|
| `llmgateway/deepseek-v4.1-flash-1017` | ✓ | **The mode default on both OpenCode versions.** DeepSeek V4.1 Flash via DevPass, the 2026-10-17 release, reasoning **and images**. Pinned `--variant max` (OpenCode 1 only), which the route accepts. On OpenCode 2 the equivalent is `-m llmgateway/deepseek-v4.1-flash-1017#max`. Context 1.05M, output 384K, $0.15 in and $0.60 out per million tokens, cached reads $0.003. Well under the gateway's Premium threshold, so no weekly cap. Three efforts plus off: **`low`**, **`high`** and **`max`**, with `minimal` folding into `low`, `medium` and `xhigh` folding into `high`, and `none` disabling thinking. Default `high`. `ultra` and the integer form are rejected here |
| `llmgateway/deepseek-v4.1-flash` | no | The **2026-09-10** release of DeepSeek V4.1 Flash via DevPass, still selectable and pinnable. It carries the same 1.05M context, 384K output, $0.15 in and $0.60 out per million tokens and cached reads $0.003, and the same effort ladder as the `-1017` release, so pinning it trades no capability and no price. DeepSeek's own provider route for it **deactivates on 2026-10-24**, after which the `-1017` default is the one that keeps answering. Pinned `--variant max` (OpenCode 1 only), which the route accepts; on OpenCode 2 the equivalent is `-m llmgateway/deepseek-v4.1-flash#max`. Live-verified 2026-09-10. `low`/**`high`**/**`max`** plus off, default `high`; `ultra` and the integer form are rejected here. It replaced `deepseek-v4-flash-vision-exp`, which the gateway deactivated and now answers `410` for |
| `llmgateway/glm-5.3-flash` | no | GLM-5.3-Flash via DevPass, a reasoning route with the full ladder including **both `xhigh` and `max`**, the only GLM-5.3-Flash route carrying both, so `--variant max` (OpenCode 1 only). On OpenCode 2 the equivalent is `-m llmgateway/glm-5.3-flash#max`. Context 1.05M, output 131K. Dispatch-tested 2026-09-04 |

---

## 3. DEFAULTS & QUICK INVOCATION

Dispatch this mode's default without opening any other file:

| Field | Value |
|-------|-------|
| Default model | `llmgateway/deepseek-v4.1-flash-1017`, on both OpenCode 1 and OpenCode 2 |
| Default effort | On OpenCode 1, `--variant max` (flash is max-tier-pinned by policy). On OpenCode 2, `-m llmgateway/deepseek-v4.1-flash-1017#max` |
| Default format | `--format json` |

```bash
# On OpenCode 1 (1.19.3):
opencode run \
  --model llmgateway/deepseek-v4.1-flash-1017 \
  --variant max \
  --format json \
  --dir "$REPO_ROOT" \
  "<prompt>" </dev/null
```

```bash
# On OpenCode 2 (2.0.32):
cd "$REPO_ROOT" && opencode2 run --standalone \
  -m llmgateway/deepseek-v4.1-flash-1017#max \
  --format json \
  "<prompt>" </dev/null
```

The two versions do not always list the same providers, and OpenCode 2 lists no `opencode-go` provider, while the `opencode-go` Go-plan quota is spent on OpenCode 1, so `llmgateway/deepseek-v4.1-flash-1017` is the single default on both versions. On OpenCode 2 confirm that `opencode2 models --standalone` lists the `<provider>/` prefix of the model you pass to `-m` first. There, a leading `cd` replaces `--dir` (OpenCode 1 only), and the model id replaces `--variant` (OpenCode 1 only). The side-by-side setup and the capability delta live in [install-and-versions.md](./install-and-versions.md).

If the default provider is not configured, the mode ASKS the operator before substituting. It never silently swaps a model. See the auth pre-flight decision tree in [cli-reference.md](./cli-reference.md) §4.

---

## 4. REASONING-EFFORT / THINKING LEVER

cli-opencode expresses reasoning effort through the **`--variant`** flag (OpenCode 1 only), which maps to a provider-specific effort scale. On OpenCode 2 the level rides on the model id instead (`-m provider/model#<level>`). Default skill behavior is `--variant high` for non-pinned models, and the default model is pinned to its max tier by policy: `llmgateway/deepseek-v4.1-flash-1017` at `--variant max` on OpenCode 1 and at `#max` on OpenCode 2. The ladders below are observed on OpenCode 1 and are unverified on OpenCode 2.0.32.

| Provider | `--variant` behavior (OpenCode 1 only) |
|----------|----------------------|
| `opencode-go` (`deepseek-v4.1-flash`) | reasoning model pinned to `--variant max` (OpenCode 1 only, max thinking tier) by policy. On OpenCode 2 the equivalent is `-m opencode-go/deepseek-v4.1-flash#max`, which needs its own opencode-go login on v2 (`opencode2 providers login opencode-go`). The fan-out builder upgrades a lower requested effort automatically |
| `minimax` (MiniMax-M3) | behavior unverified, omitted by default. Confirm before relying |
| `openai` GPT-6 (sol/luna) | maps to OpenAI effort `none`/`low`/`medium`/`high`/**`xhigh`**, with Pro tiers at `medium`/`high`/`xhigh`. The `-fast` slugs are the low-latency Fast tier with the same range |
| `llmgateway` (DevPass) | per-model, not per-provider. `deepseek-v4.1-flash-1017` carries three efforts plus off, `low`/**`high`**/**`max`**, with `minimal` folding into `low` and `medium`/`xhigh` folding into `high`, and the older `deepseek-v4.1-flash` release carries the same ladder. `glm-5.3-flash` carries the full ladder to `max`. Always pass the level explicitly here |

---

## 5. HOW TO INVOKE

### Dispatch envelope (child / detached sessions)
When dispatching as a non-interactive child (spec-gate-neutralized worker), prefix the shared env and terminate stdin:

```bash
# On OpenCode 1 (1.19.3):
SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run \
  --model llmgateway/deepseek-v4.1-flash-1017 --variant max --format json \
  --dir "$REPO_ROOT" "<prompt>" </dev/null > stdout.log 2> stderr.log
```

```bash
# On OpenCode 2 (2.0.32):
cd "$REPO_ROOT" && SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 \
  opencode2 run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json \
  "<prompt>" </dev/null > stdout.log 2> stderr.log
```

- `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1`: neutralizes the spec-gate for a bound child worker so it does not stall waiting on an interactive Gate-3 answer.
- `</dev/null`: REQUIRED before stdout/stderr redirects. opencode reads stdin at startup and hangs at 0% CPU without an EOF. See [integration-patterns.md](./integration-patterns.md) §6.
- `--standalone` (OpenCode 2 only): REQUIRED on every child dispatch.

### Self-invocation guard
An opencode dispatch must not recursively re-enter the same session/worker. The guard is packet-local. See [self-invocation-guard.md](./self-invocation-guard.md).

### Parallel / fan-out
Multi-lineage parallel dispatch is driven by `fanout-run.cjs`, which lives outside this hub. See §6.

---

## 6. ENFORCEMENT & PROFILES (authoritative elsewhere, do not duplicate here)

- **Fan-out dispatcher** → `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- **Live model ids** → `opencode models <provider>` on OpenCode 1, or `opencode2 models --standalone` filtered for the `<provider>/` prefix on OpenCode 2

---

## 7. RELATED

- [cli-reference.md](./cli-reference.md): full `opencode run` flags, subcommands, auth pre-flight, troubleshooting
- [integration-patterns.md](./integration-patterns.md): dispatch shapes + failure-mode matrix
- [../SKILL.md](../SKILL.md): cli-opencode mode overview and routing
