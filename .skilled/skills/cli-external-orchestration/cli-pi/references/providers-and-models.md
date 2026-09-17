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
version: 1.5.0.39
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

> **CLOSED ROSTER — non-roster models are FORBIDDEN.** Dispatch ONLY the models listed in this section. Any model not in this roster MUST NOT be called through cli-pi. Enforcement lives in the deep-loop external-CLI fan-out, which hard-rejects any off-roster id (`isPiModelAllowed` over `PI_SUPPORTED_MODELS` in `executor-config.ts`, byte-mirrored in `fanout-run.cjs`); the `pi` binary itself is a passthrough with no allowlist, so for any direct (non-fan-out) invocation this is a **hard discipline rule**, not a runtime gate. To add a model, amend the roster (spec packet + `PI_SUPPORTED_MODELS`) first — never dispatch an unlisted id ad hoc. **A provider's live catalog is not a roster.** Every gateway below fronts far more ids than this file lists, and the extra ids are forbidden exactly as an unknown provider would be: the roster is per provider, and a model allowed on one route is not thereby allowed on another.

Pi is a multi-provider passthrough at the binary layer. Select a model with `--provider <name>` plus `--model <pattern>`, or a single `--model provider/id` form; `--model` also accepts an inline thinking suffix (`--model sonnet:high`). Reasoning effort stays independent of the model id (see §4).

The table below is the closed roster for cli-pi dispatch, sourced from the machine-local authenticated set (`~/.pi/agent/auth.json` + `models-store.json`; opencode-go added 2026-08-07). Re-read `models-store.json` to confirm an id is still authenticated on this machine, but do not dispatch anything outside this roster.

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
| `deepseek-v4.1-flash` | Latency-optimized reasoning model that takes images as well as text, pinned to `--thinking max` by policy — a tier this route carries. **Direct-dispatch route only since 2026-09-07:** the fan-out's bare DeepSeek literal maps to `llmgateway` in `PI_MODEL_PROVIDERS`, so the deep-loop fan-out reaches DeepSeek Flash through DevPass and not here; select this route by hand with `--provider opencode-go`. Both routes now name the *same* model again, because this id moved onto the gateway's own `deepseek-v4.1-flash` name and off `deepseek-v4-flash-vision-exp`; they stay separate routes under the one-literal-one-provider rule, which is why only the DevPass one is in the fan-out map. Catalog-verified 2026-09-11 (1M context, 384K output, `images: yes`), and the route returned a real reply through its `opencode` client that same day |
| `qwen3.8-max` | Qwen 3.8 Max; a live `pi --provider opencode-go --model qwen3.8-max -p` dispatch completed a real turn 2026-08-07 |
| `glm-5.3-flash` | Z.AI GLM-5.3-Flash via the Go gateway; reasoning model whose ladder here is `low`/`high`/**`max`** — this route has no `xhigh` — dispatched at its top tier `--thinking max`; ladder re-verified in `opencode models opencode-go --verbose` on 2026-09-04. Reachable as `--provider opencode-go --model glm-5.3-flash`. **Direct-dispatch route only since 2026-09-05:** the bare `glm-5.3-flash` literal now maps to `llmgateway` in `PI_MODEL_PROVIDERS`, and one literal maps to one provider, so the deep-loop fan-out reaches GLM-5.3-Flash through DevPass, not here |

### cline-pass

Cline provider (Cline Pass account, base `https://api.cline.bot/api/v1`, OpenAI-compatible), added to Pi **by config** — a `providers.cline-pass` block in `.pi/models.json` (`api: openai-completions`, env-keyed `CLINE_API_KEY`) plus `enabledModels` entries in `.pi/settings.json`. It is not a Pi builtin; full setup and removal live in [.pi/custom-providers.md](../../../../../.pi/custom-providers.md). Select flash with `--provider cline-pass --model cline-pass/cline-pass/deepseek-v4.1-flash`, or GLM-5.3-Flash with `--model cline-pass/z-ai/glm-5.3-flash`. pi's default here is `defaultProvider: cline-pass` with `defaultModel` set in `.pi/settings.json` (currently `z-ai/glm-5.3-flash`; point it at any cline-pass model). **The V4.1 Flash id is newer than every dispatch recorded on this route** — read its row in the table below before selecting it, and note the fallback named there.

Credential gotcha: the block's `apiKey` MUST use pi's own config-value syntax — `${CLINE_API_KEY}` (or `$CLINE_API_KEY`), never opencode's `{env:CLINE_API_KEY}`. pi has no `{env:...}` form; it takes the braced string as a **literal** key and Cline answers `401 Unauthorized` on the first real dispatch. Supply the key by exporting `CLINE_API_KEY` in `~/.zshenv` so dispatched and non-interactive shells inherit it. A `pi /login cline-pass` credential in `~/.pi/agent/auth.json` also works and takes precedence, but it is scoped to the resolved pi agent directory: any session with its own `PI_CODING_AGENT_DIR` or a different `HOME` loses it, and then reports either `401 Unauthorized` or `No models available. Use /login...` while the operator's interactive session keeps working. `pi auth check` cannot see any of this — it reports `ready` on an unresolved placeholder.

Model-id gotcha: every reference here is **three-segment** (`<provider>/<modelType>/<model>`) because the model `id` in `.pi/models.json` keeps its `modelType/` prefix. The DeepSeek entry uses `cline-pass/` (`cline-pass/cline-pass/deepseek-v4.1-flash`) — V4 Pro is declared in `.pi/models.json` but is deliberately not on this roster, so it must not be dispatched through cli-pi; **GLM-5.3-Flash uses the vendor prefix `z-ai/`** (`cline-pass/z-ai/glm-5.3-flash`, id = `z-ai/glm-5.3-flash`) — do NOT assume `cline-pass/glm-5.3-flash`, which the Cline API 404s. Cline requires the `modelType/model` shape: a bare id returns `400 "invalid model format"`, a wrong one returns `404 "model not found"`, and both hide from `pi --list-models` / `pi auth check` (which never send a completion), surfacing only on the first real dispatch.

Policy: the DeepSeek V4 Flash and GLM-5.3-Flash entries here are reasoning models whose Cline thinking tiers top out at `xhigh` — there is **no `max` tier** on this provider. Dispatch them **only at `--thinking xhigh`**; do not request `max`. Pi's global `defaultThinkingLevel` is already `xhigh`, so an unqualified dispatch lands on the correct tier, but pass `--thinking xhigh` explicitly in fan-out for clarity. GLM-5.3-Flash's interactive picker additionally offers the lower tiers, but the config entry mirrors the DeepSeek `xhigh` ceiling for a single consistent cline-pass policy.

| Model id | Notes |
|----------|-------|
| `cline-pass/cline-pass/deepseek-v4.1-flash` | DeepSeek V4.1 Flash via the Cline provider; reasoning model dispatched **only at `--thinking xhigh`** (its top tier; no `max` here). Config-only provider, not a Pi builtin. **Listing-only — no dispatch has been recorded for this id.** Cline's own API lists `deepseek/deepseek-v4.1-flash`, but the route answered `429 "You have reached your monthly Clinepass limit"` on every attempt made 2026-09-11, and so did the previously verified `cline-pass/cline-pass/deepseek-v4-flash` — the shared failure is how we know the block is the account's quota and not this id. No context, output or price figure in this row is measured; the ones inherited from the V4-Flash entry may be wrong. **Fallback:** `cline-pass/cline-pass/deepseek-v4-flash` (live-verified 2026-08-18) is still offered upstream — keep dispatching it until one V4.1 turn passes after the quota window resets. Three-segment reference (model `id` = `cline-pass/deepseek-v4.1-flash`). Distinct from the opencode-go Flash route above |
| `cline-pass/z-ai/glm-5.3-flash` | GLM-5.3-Flash via the Cline provider. Reasoning model dispatched **only at `--thinking xhigh`** — the top tier *on this route*. The ceiling is per-route, not per-model: Cline has `xhigh` and no `max`, opencode-go has `max` and no `xhigh`, and the DevPass route has both. Config-only provider, not a Pi builtin; context 1.31M, output 131K. Three-segment reference (model `id` = `z-ai/glm-5.3-flash`, the **`z-ai/` vendor prefix**, not `cline-pass/`); dispatch-verified via the local Cline runtime on 2026-08-27 (`cline-pass` session with `model: z-ai/glm-5.3-flash`). The **same underlying model** as the opencode-go and DevPass GLM-5.3-Flash routes, reached through a different provider — pick the route deliberately. Direct-dispatch route: the deep-loop fan-out map binds the shared `z-ai/glm-5.3-flash` literal to a provider outside this roster, and one literal maps to one provider |

### llmgateway

DevPass (LLM Gateway) account, base `https://api.llmgateway.io/v1`, OpenAI-compatible, added to Pi **by config** — a `providers.llmgateway` block in `.pi/models.json` (`api: openai-completions`, env-keyed `${LLMGATEWAY_API_KEY}`) plus two `enabledModels` entries in `.pi/settings.json`. Not a Pi builtin; full setup, verification and removal live in [.pi/custom-providers.md](../../../../../.pi/custom-providers.md) §3. DevPass bills per token at normal API list rates; the plan buys credits at a 3x bonus, which discounts the bill rather than removing it. The gateway publishes its own per-model rates at `/v1/models`, and those are the rates carried in the `cost` blocks here. The gateway fronts many more ids than these two; **only the two rows below are on the roster.**

Model-id gotcha, and it is the **inverse of cline-pass above**: LLM Gateway takes the **bare** id, so every reference here is **two-segment** (`llmgateway/<id>`). Confirmed against the live API on 2026-09-10 — `"model": "deepseek-v4.1-flash"` returns `200`, `"model": "llmgateway/deepseek-v4.1-flash"` returns `400 "Provider llmgateway does not support model deepseek-v4.1-flash"`. Do not carry the cline-pass slashed form across. The gateway also rewrites ids upstream in its response (`deepseek/deepseek-v4.1-flash`, `zai/glm-5.3-flash`); those names are informational and must never be sent.

Credential: same `${VAR}` rule as cline-pass — `${LLMGATEWAY_API_KEY}`, never opencode's `{env:...}`. Export it in `~/.zshenv` so dispatched shells inherit it. pi does not read opencode's auth store, even though both hold a key for this same account.

Effort policy: the two ladders differ, so there is no single tier for this provider — pass `--thinking` explicitly. Pi's global `defaultThinkingLevel` is `xhigh`. Both models accept that string, but they do not treat it alike: GLM-5.3-Flash has a real `xhigh` above `high`, while DeepSeek folds `xhigh` into `high`, so the default silently means different things per row.

**Mixed reachability, one row at a time.** `glm-5.3-flash` is **fan-out reachable through DevPass** as of 2026-09-05: the bare literal maps to `llmgateway` in `PI_MODEL_PROVIDERS`, so `${provider}/${model}` composes the two-segment `llmgateway/glm-5.3-flash` selector this gateway requires, and the opencode-go route for the same model became direct-dispatch only in exchange. DevPass took the fan-out slot on cost grounds: both bill per token, and DevPass is the cheaper of the two once the credit bonus is applied. The other bare literal here moved to `llmgateway` on 2026-09-07 for the same reason, after opencode-go's monthly window closed mid-program; the opencode-go DeepSeek route became direct-dispatch only in exchange, under the same one-literal-one-provider constraint that keeps the Cline GLM route direct-only. That literal was `deepseek-v4-flash-vision-exp` until 2026-09-10, when the gateway deactivated the id and began answering `410` for it. The bare literal is now `deepseek-v4.1-flash`, which the gateway serves and which accepts images the same way.

| Model id | Notes |
|----------|-------|
| `llmgateway/deepseek-v4.1-flash` | DeepSeek V4.1 Flash via DevPass — reasoning **and images**, billed per token at normal API list rates, like every DevPass route; the account's 3x credit bonus discounts the bill, it does not make usage free. **This is the deep-loop fan-out route for DeepSeek Flash** (bare literal `deepseek-v4.1-flash`, mapped to `llmgateway` since 2026-09-10); the effort pin in `isFlashMaxPinnedModel` forces `max`, which this route accepts. Context 1.05M, output 384K, $0.15 in and $0.60 out per million tokens with cached reads at $0.003. Live-verified 2026-09-10. **Effort ladder, three real levels plus off.** DeepSeek's thinking-mode guide maps the accepted names onto them: `none` disables thinking, `minimal` and `low` both reach **low**, `medium`, `high` and `xhigh` all reach **high**, and `max` reaches **max**. Sending `high` when you meant `xhigh` changes nothing, and the default when nothing is sent is `high`. This route rejects `ultra`, which DeepSeek's own table lists, and rejects the integer 1-100 form the model card documents, so the names above are the whole surface here. It replaced `deepseek-v4-flash-vision-exp`, which the gateway deactivated and now answers `410` for |
| `llmgateway/glm-5.3-flash` | GLM-5.3-Flash via DevPass; reasoning, full ladder including **both `xhigh` and `max`** — the only GLM-5.3-Flash route that has both. **This is the deep-loop fan-out route for GLM-5.3-Flash** (bare literal `glm-5.3-flash`, mapped to `llmgateway` since 2026-09-05); the effort pin in `isFlashMaxPinnedModel` forces `max`, a tier this route has. Context 1.05M, output 131K. Dispatch-verified 2026-09-04 at `--thinking max` |

Pi's `pi --help` also lists provider env vars beyond this roster (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `XAI_API_KEY`, `MISTRAL_API_KEY`, `MINIMAX_API_KEY`, `KIMI_API_KEY`, `QWEN_TOKEN_PLAN_API_KEY`, AWS). Documentation-only provider breadth is not a license to guess an unconfirmed model id — only the six authenticated providers above have a confirmed installed catalog.

**OpenRouter is off this roster, and deliberately still in the fan-out.** Direct dispatch has the
six providers above. The deep-loop fan-out additionally keeps two OpenRouter literals,
`deepseek/deepseek-v4-flash-vision-exp` and `z-ai/glm-5.3-flash`, mapped in `PI_MODEL_PROVIDERS`.
Those are *distinct literals* from the bare `deepseek-v4.1-flash` and `glm-5.3-flash` rows
above: one literal maps to one provider, so the slash-prefixed pair composes an OpenRouter selector
while the bare pair composes the DevPass one. So a fan-out can still reach OpenRouter for exactly
those two ids. That is an operator decision, not residue the roster removal missed — do not
"reconcile" it by deleting the mapping, which would silently change which route those two models
take.

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
  --provider opencode-go --model deepseek-v4.1-flash \
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
  --provider opencode-go --model deepseek-v4.1-flash \
  --thinking max --mode text --offline \
  > stdout.log 2> stderr.log
```

- `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` — neutralizes the spec-gate for a bound child worker so it does not stall waiting on an interactive Gate-3 answer.
- `--offline` — pass explicitly for any automated/CI dispatch; `pi --verbose` without `--offline` hung 2+ minutes with no reachable network path in the pinned contract. See [cli-reference.md](./cli-reference.md) §7 and [integration-patterns.md](./integration-patterns.md) §15.
- **Exit code is never an availability/auth signal** — an identical unauthenticated `pi -p` returned exit `0` then exit `1` across runs. Classify the captured output text (`No API key found...`), never the exit code. See [cli-reference.md](./cli-reference.md) §9.

Select the headless contract deliberately: `--mode text` (print), `--mode json` (JSONL event stream), or `--mode rpc` (persistent JSONL protocol) — RPC is not a print-mode alias. See [integration-patterns.md](./integration-patterns.md) §4/§6/§7.

### Recursion bounds
A Pi session may dispatch this packet: Pi has no in-process delegation left, so the CLI is its only way to hand work out. What the shared runtime still refuses is a dispatch from inside a fan-out lineage, and one whose kind already appears in the dispatch stack.

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
- [../SKILL.md](../SKILL.md) — cli-pi mode overview, routing, and recursion bounds
- [../../cli-codex/references/providers-and-models.md](../../cli-codex/references/providers-and-models.md) — authoritative GPT-5.6 effort-ceiling cross-map for the `openai-codex` tiers
