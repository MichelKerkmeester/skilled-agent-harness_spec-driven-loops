---
title: cli-pi Providers, Models & Invocation
description: The dedicated per-mode catalog of every provider, authenticated model id, the --thinking effort lever, and dispatch shape reachable through the cli-pi multi-provider passthrough mode.
trigger_phrases:
  - "pi providers and models"
  - "which model for pi dispatch"
  - "pi thinking reasoning effort"
  - "pi has no default model"
  - "pi openai-codex opencode-go minimax xiaomi"
  - "pi passthrough model selection"
importance_tier: normal
contextType: implementation
version: 1.1.0.0
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

> **CLOSED ROSTER — non-roster models are FORBIDDEN.** Dispatch ONLY the models listed in this section. Any model not in this roster MUST NOT be called through cli-pi. Enforcement lives in the deep-loop external-CLI fan-out, which hard-rejects any off-roster id (`isPiModelAllowed` over `PI_SUPPORTED_MODELS` in `executor-config.ts`, byte-mirrored in `fanout-run.cjs`); the `pi` binary itself is a passthrough with no allowlist, so for any direct (non-fan-out) invocation this is a **hard discipline rule**, not a runtime gate. To add a model, amend the roster (spec packet + `PI_SUPPORTED_MODELS`) first — never dispatch an unlisted id ad hoc.

Pi is a multi-provider passthrough at the binary layer. Select a model with `--provider <name>` plus `--model <pattern>`, or a single `--model provider/id` form; `--model` also accepts an inline thinking suffix (`--model sonnet:high`). Reasoning effort stays independent of the model id (see §4).

The table below is the closed roster for cli-pi dispatch, sourced from the machine-local authenticated set (`~/.pi/agent/auth.json` + `models-store.json`; opencode-go added 2026-08-07, openrouter confirmed 2026-08-17). Re-read `models-store.json` to confirm an id is still authenticated on this machine, but do not dispatch anything outside this roster.

### openai-codex

Custom provider carrying the GPT-5.6 personas — see the effort cross-map in §4. Pi exposes the base persona slugs only (no `-fast` / `-pro` speed tiers); confirm the authenticated set via `models-store.json`.

| Model id | Notes |
|----------|-------|
| `gpt-5.6-sol` | GPT-5.6 Sol |
| `gpt-5.6-luna` | GPT-5.6 Luna |

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
| `deepseek-v4-flash` | Latency-optimized reasoning model pinned to `--thinking max` by policy; opencode-go is the fan-out provider for this model (the bare `deepseek-v4-flash` literal composes `opencode-go/deepseek-v4-flash`). A live `opencode run --model opencode-go/deepseek-v4-flash` turn completed 2026-08-07 |
| `qwen3.8-max` | Qwen 3.8 Max; a live `pi --provider opencode-go --model qwen3.8-max -p` dispatch completed a real turn 2026-08-07 |
| `glm-5.3-flash` | Z.AI GLM-5.3-Flash via the Go gateway; reasoning model whose ladder here is `low`/`high`/**`max`** — this route has no `xhigh` — dispatched at its top tier `--thinking max`; ladder re-verified in `opencode models opencode-go --verbose` on 2026-09-04. Reachable as `--provider opencode-go --model glm-5.3-flash` |

### openrouter

OpenRouter passthrough (base `https://openrouter.ai/api/v1`). Select with `--provider openrouter --model <upstream>/<id>`; the deep-loop fan-out composes the full `openrouter/<upstream>/<id>` selector from the allowlisted model literal (the literal keeps its upstream provider path, so `${provider}/${model}` is three segments here). The DeepSeek Flash `-latest` variant is a reasoning model and is pinned to `--thinking max` by the same policy as the bare id.

> **OpenRouter here carries exactly three models: DeepSeek V4 Flash (`deepseek/deepseek-v4-flash-latest`), GLM-5.3-Flash (`z-ai/glm-5.3-flash`), and Gemini 3.7 Flash (`google/gemini-3.7-flash`).** No other model may be routed through OpenRouter — these are the only three entries in the Pi OpenRouter allowlist. Other models (e.g. GPT-5.6 Luna/Sol) must go through their own providers (openai-codex, etc.), never OpenRouter.

| Model id | Notes |
|----------|-------|
| `deepseek/deepseek-v4-flash-latest` | DeepSeek V4 Flash (latest) via OpenRouter; reasoning model pinned to `--thinking max`. Distinct from the opencode-go-routed bare `deepseek-v4-flash`. Dispatched as `openrouter/deepseek/deepseek-v4-flash-latest` |
| `z-ai/glm-5.3-flash` | GLM-5.3-Flash via OpenRouter; reasoning model whose ladder here is `low`/`high`/**`max`** — this route has **no `xhigh`** — pinned to `--thinking max`; ladder re-verified in `opencode models openrouter --verbose` on 2026-09-04. Dispatched as `openrouter/z-ai/glm-5.3-flash`. Replaces the retired Ox Alpha stealth route. **The top tier is per-route:** `max` on OpenRouter and opencode-go, `xhigh` only on Cline, whose `.pi` tier map already reflects that |
| `google/gemini-3.7-flash` | Gemini 3.7 Flash via OpenRouter; reasoning model (variants `low`/`medium`/`high`) dispatched at its top tier `--thinking high`; list-verified in `opencode models openrouter` on 2026-08-27 (not dispatch-tested). Dispatched as `openrouter/google/gemini-3.7-flash` |

### cline-pass

Cline provider (Cline Pass account, base `https://api.cline.bot/api/v1`, OpenAI-compatible), added to Pi **by config** — a `providers.cline-pass` block in `.pi/models.json` (`api: openai-completions`, env-keyed `CLINE_API_KEY`) plus `enabledModels` entries in `.pi/settings.json`. It is not a Pi builtin; full setup and removal live in [.pi/custom-providers.md](../../../../../.pi/custom-providers.md). Select flash with `--provider cline-pass --model cline-pass/cline-pass/deepseek-v4-flash`, or GLM-5.3-Flash with `--model cline-pass/z-ai/glm-5.3-flash`. pi's default here is `defaultProvider: cline-pass` with `defaultModel` set in `.pi/settings.json` (currently `z-ai/glm-5.3-flash`; point it at any cline-pass model).

Credential gotcha: the block's `apiKey` MUST use pi's own config-value syntax — `${CLINE_API_KEY}` (or `$CLINE_API_KEY`), never opencode's `{env:CLINE_API_KEY}`. pi has no `{env:...}` form; it takes the braced string as a **literal** key and Cline answers `401 Unauthorized` on the first real dispatch. Supply the key by exporting `CLINE_API_KEY` in `~/.zshenv` so dispatched and non-interactive shells inherit it. A `pi /login cline-pass` credential in `~/.pi/agent/auth.json` also works and takes precedence, but it is scoped to the resolved pi agent directory: any session with its own `PI_CODING_AGENT_DIR` or a different `HOME` loses it, and then reports either `401 Unauthorized` or `No models available. Use /login...` while the operator's interactive session keeps working. `pi auth check` cannot see any of this — it reports `ready` on an unresolved placeholder.

Model-id gotcha: every reference here is **three-segment** (`<provider>/<modelType>/<model>`) because the model `id` in `.pi/models.json` keeps its `modelType/` prefix. The DeepSeek entry uses `cline-pass/` (`cline-pass/cline-pass/deepseek-v4-flash`) — V4 Pro is declared in `.pi/models.json` but is deliberately not on this roster, so it must not be dispatched through cli-pi; **GLM-5.3-Flash uses the vendor prefix `z-ai/`** (`cline-pass/z-ai/glm-5.3-flash`, id = `z-ai/glm-5.3-flash`) — do NOT assume `cline-pass/glm-5.3-flash`, which the Cline API 404s. Cline requires the `modelType/model` shape: a bare id returns `400 "invalid model format"`, a wrong one returns `404 "model not found"`, and both hide from `pi --list-models` / `pi auth check` (which never send a completion), surfacing only on the first real dispatch.

Policy: the DeepSeek V4 Flash and GLM-5.3-Flash entries here are reasoning models whose Cline thinking tiers top out at `xhigh` — there is **no `max` tier** on this provider. Dispatch them **only at `--thinking xhigh`**; do not request `max`. Pi's global `defaultThinkingLevel` is already `xhigh`, so an unqualified dispatch lands on the correct tier, but pass `--thinking xhigh` explicitly in fan-out for clarity. GLM-5.3-Flash's interactive picker additionally offers the lower tiers, but the config entry mirrors the DeepSeek `xhigh` ceiling for a single consistent cline-pass policy.

| Model id | Notes |
|----------|-------|
| `cline-pass/cline-pass/deepseek-v4-flash` | DeepSeek V4 Flash via the Cline provider; reasoning model dispatched **only at `--thinking xhigh`** (its top tier; no `max` here). Config-only provider, not a Pi builtin; live dispatch verified 2026-08-18 with a real `CLINE_API_KEY`. Three-segment reference (model `id` = `cline-pass/deepseek-v4-flash`). Distinct from the opencode-go / openrouter Flash routes above |
| `cline-pass/z-ai/glm-5.3-flash` | GLM-5.3-Flash via the Cline provider. Reasoning model dispatched **only at `--thinking xhigh`** — the top tier *on this route*. The ceiling is per-route, not per-model: Cline has `xhigh` and no `max`, OpenRouter and opencode-go have `max` and no `xhigh`, and the DevPass route has both. Config-only provider, not a Pi builtin; context 1.31M, output 131K. Three-segment reference (model `id` = `z-ai/glm-5.3-flash`, the **`z-ai/` vendor prefix**, not `cline-pass/`); dispatch-verified via the local Cline runtime on 2026-08-27 (`cline-pass` session with `model: z-ai/glm-5.3-flash`). The **same underlying model** as `openrouter/z-ai/glm-5.3-flash`, reached through a different provider — pick the route deliberately. Direct-dispatch route (the deep-loop cli-pi fan-out routes the shared `z-ai/glm-5.3-flash` literal via OpenRouter) |

### llmgateway

DevPass (LLM Gateway) account, base `https://api.llmgateway.io/v1`, OpenAI-compatible, added to Pi **by config** — a `providers.llmgateway` block in `.pi/models.json` (`api: openai-completions`, env-keyed `${LLMGATEWAY_API_KEY}`) plus five `enabledModels` entries in `.pi/settings.json`. Not a Pi builtin; full setup, verification and removal live in [.pi/custom-providers.md](../../../../../.pi/custom-providers.md) §3. DevPass is a flat-price subscription, so these five bill the plan rather than per token.

Model-id gotcha, and it is the **inverse of cline-pass above**: LLM Gateway takes the **bare** id, so every reference here is **two-segment** (`llmgateway/<id>`). Confirmed against the live API — `"model": "deepseek-v4-flash"` returns `200`, `"model": "llmgateway/deepseek-v4-flash"` returns `400 "Provider llmgateway does not support model deepseek-v4-flash"`. Do not carry the cline-pass slashed form across. The gateway also rewrites ids upstream in its response (`gonka24/deepseek-v4-flash`, `zai/glm-5.3-flash`, `google-vertex/gemini-3.8-flash`); those names are informational and must never be sent.

Credential: same `${VAR}` rule as cline-pass — `${LLMGATEWAY_API_KEY}`, never opencode's `{env:...}`. Export it in `~/.zshenv` so dispatched shells inherit it. pi does not read opencode's auth store, even though both hold a key for this same account.

Effort policy: the five ladders differ, so there is no single tier for this provider — pass `--thinking` explicitly. Pi's global `defaultThinkingLevel` is `xhigh`, which only three of these five accept, so relying on the default is wrong here.

**Direct-dispatch route only.** The bare literals `deepseek-v4-flash`, `glm-5.3-flash` and `gpt-5.6-luna` already belong to opencode-go or openai-codex in `PI_MODEL_PROVIDERS`, and one literal maps to one provider, so these entries are intentionally absent from `PI_SUPPORTED_MODELS` and unreachable from the deep-loop fan-out — the same constraint that keeps the Cline GLM route direct-only.

| Model id | Notes |
|----------|-------|
| `llmgateway/deepseek-v4-flash` | DeepSeek V4 Flash via DevPass; reasoning, full ladder `minimal`→**`max`**; context 1.05M, output 384K. Dispatch-verified 2026-09-04 (real pi turn at `--thinking max`) |
| `llmgateway/deepseek-v4-flash-vision-exp` | DeepSeek V4 Flash Vision; image-capable, as are `gpt-5.6-luna` and `gemini-3.8-flash` below. Sparse ladder — **only `low`, `high`, `max`**; context 1.05M, output 384K. Dispatch-verified 2026-09-04 at `--thinking max` (text round-trip; image input not yet exercised) |
| `llmgateway/glm-5.3-flash` | GLM-5.3-Flash via DevPass; reasoning, full ladder including **both `xhigh` and `max`** — the only GLM-5.3-Flash route that has both. Context 1.05M, output 131K. Dispatch-verified 2026-09-04 at `--thinking max` |
| `llmgateway/gpt-5.6-luna` | GPT-5.6 Luna via DevPass; reasoning **and vision**; `minimal` is unmapped here so its pi ladder runs `low`→**`max`** (pi's lowest tier is `off`, not `none`). Context 1.05M (input cap 922K), output 128K. **`temperature` unsupported** on this entry. Dispatch-verified 2026-09-04 at `--thinking max`. Same model family as the `openai-codex` Luna slugs, different route and different billing — pick deliberately |
| `llmgateway/gemini-3.8-flash` | Gemini 3.8 Flash via DevPass; reasoning, ladder tops at **`high`** — no `xhigh`, no `max`. Context 1.05M, output 1.05M. Dispatch-verified 2026-09-04 at `--thinking high` |

Pi's `pi --help` also lists provider env vars beyond this roster (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `XAI_API_KEY`, `MISTRAL_API_KEY`, `MINIMAX_API_KEY`, `KIMI_API_KEY`, `QWEN_TOKEN_PLAN_API_KEY`, AWS). Documentation-only provider breadth is not a license to guess an unconfirmed model id — only the seven authenticated providers above have a confirmed installed catalog.

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
  --provider opencode-go --model deepseek-v4-flash \
  --thinking max --mode text
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

Confirm the target model actually honors the requested tier before assuming it changes behavior — the contract pin did not exhaustively test every model/tier pairing.

---

## 5. HOW TO INVOKE

### Dispatch envelope (child / detached sessions)
When dispatching as a non-interactive child (spec-gate-neutralized worker), prefix the shared env and capture streams separately:

```bash
SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 pi -p "<prompt>" \
  --provider opencode-go --model deepseek-v4-flash \
  --thinking max --mode text --offline \
  > stdout.log 2> stderr.log
```

- `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` — neutralizes the spec-gate for a bound child worker so it does not stall waiting on an interactive Gate-3 answer.
- `--offline` — pass explicitly for any automated/CI dispatch; `pi --verbose` without `--offline` hung 2+ minutes with no reachable network path in the pinned contract. See [cli-reference.md](./cli-reference.md) §7 and [integration-patterns.md](./integration-patterns.md) §15.
- **Exit code is never an availability/auth signal** — an identical unauthenticated `pi -p` returned exit `0` then exit `1` across runs. Classify the captured output text (`No API key found...`), never the exit code. See [cli-reference.md](./cli-reference.md) §9.

Select the headless contract deliberately: `--mode text` (print), `--mode json` (JSONL event stream), or `--mode rpc` (persistent JSONL protocol) — RPC is not a print-mode alias. See [integration-patterns.md](./integration-patterns.md) §4/§6/§7.

### Self-invocation guard
A Pi dispatch must never re-enter a session already running inside Pi. Run the guard before constructing any command — see [../SKILL.md](../SKILL.md) §2, "Self-Invocation Guard".

### Parallel / fan-out
Multi-lineage parallel dispatch is driven by `fanout-run.cjs`, which lives outside this hub — see §6.

---

## 6. ENFORCEMENT & PROFILES (authoritative elsewhere — do not duplicate here)

- **Fan-out dispatcher** → `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- **Live model ids** → re-read `~/.pi/agent/models-store.json` on the target install

---

## 7. RELATED

- [cli-reference.md](./cli-reference.md) — full `pi` flags, headless modes, auth failure behavior, §13 model selection
- [integration-patterns.md](./integration-patterns.md) — conductor/executor dispatch shapes, print/JSON/RPC, and anti-patterns
- [../SKILL.md](../SKILL.md) — cli-pi mode overview, routing, and self-invocation guard
- [../../cli-codex/references/providers-and-models.md](../../cli-codex/references/providers-and-models.md) — authoritative GPT-5.6 effort-ceiling cross-map for the `openai-codex` tiers
