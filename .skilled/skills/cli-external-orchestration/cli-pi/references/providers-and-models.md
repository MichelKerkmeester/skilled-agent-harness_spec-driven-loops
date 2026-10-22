---
title: cli-pi Providers, Models & Invocation
description: The dedicated per-mode catalog of every provider, authenticated model id, the --thinking effort lever, and dispatch shape reachable through the cli-pi multi-provider passthrough mode.
trigger_phrases:
  - "pi providers and models"
  - "which model for pi dispatch"
  - "pi thinking reasoning effort"
  - "pi has no default model"
  - "pi openai opencode-go minimax llmgateway"
  - "pi passthrough model selection"
importance_tier: normal
contextType: implementation
version: 1.5.3.0
---

The single catalog of the providers, authenticated model ids, the `--thinking` effort lever, and dispatch shapes the cli-pi mode can reach. cli-pi is a multi-provider passthrough with no enforced model allowlist and no fixed default model — every dispatch names its provider and model explicitly. The repository's `.pi/settings.json` does make `llmgateway/deepseek-v4.1-flash-1017` the default of a run that names no model, but that governs only such a run and never a dispatch.

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
- **A listing is not a probe.** `pi --list-models` prints a catalog bundled with the binary rather than asking each provider what it still serves, so a row outlives the route it names: a model withdrawn upstream keeps its row, its context figures and its capability columns, and reads as working. Before a roster row is written or a dispatch is trusted, send one real request. Read the reply text rather than the exit code, and pair it with a control on the same provider — a lone failure reads the same whether the model is gone, the credential lapsed or the balance ran out, and only the control tells those apart

---

## 2. PROVIDERS & MODELS

> **CLOSED ROSTER — non-roster models are FORBIDDEN.** Dispatch ONLY the models listed in this section. Any model not in this roster MUST NOT be called through cli-pi. Enforcement lives in the deep-loop external-CLI fan-out, which hard-rejects any off-roster id (`isPiModelAllowed` over `PI_SUPPORTED_MODELS` in `executor-config.ts`, byte-mirrored in `fanout-run.cjs`); the `pi` binary itself is a passthrough with no allowlist, so for any direct (non-fan-out) invocation this is a **hard discipline rule**, not a runtime gate. To add a model, amend the roster (spec packet + `PI_SUPPORTED_MODELS`) first — never dispatch an unlisted id ad hoc. **A provider's live catalog is not a roster.** Every gateway below fronts far more ids than this file lists, and the extra ids are forbidden exactly as an unknown provider would be: the roster is per provider, and a model allowed on one route is not thereby allowed on another.

Pi is a multi-provider passthrough at the binary layer. Pi's own CLI accepts either `--provider <name>` plus `--model <pattern>` or a single `--model provider/id`, but **only the single provider-qualified form is usable here** — the enforcement guard refuses the split form before launch, so every example below uses `--model provider/id`. `--model` also accepts an inline thinking suffix (`--model sonnet:high`). Reasoning effort stays independent of the model id (see §4).

The table below is the closed roster for cli-pi dispatch, sourced from the machine-local authenticated set (`~/.pi/agent/auth.json` + `models-store.json`; opencode-go added 2026-08-07). Re-read `models-store.json` to confirm an id is still authenticated on this machine, but do not dispatch anything outside this roster.

### openai

Pi's built-in provider for the ChatGPT sign-in, carrying the GPT-6 personas. See the effort cross-map in §4. Pi 1.0 lists this sign-in under `openai`. The `openai-codex` name earlier Pi versions used is gone, and a dispatch to it now fails with "No API key found for openai-codex" (checked 2026-10-04 on Pi 1.0.2, where `openai/gpt-6-luna` answered). Pi exposes the base persona slugs only (no `-fast` / `-pro` speed tiers). Both GPT-6 ids come from Pi's own model catalog (`~/.pi/agent/models-store.json`), so `.pi/models.json` defines no `openai` models, and `pi --list-models gpt-6` confirms both resolve. Since 2026-10-22 the pi-blackhole worker model is `llmgateway/deepseek-v4.1-flash-1017` at `high`, and Pi's own default model is that same DevPass DeepSeek route.

| Model id | Notes |
|----------|-------|
| `gpt-6-sol` | GPT-6 Sol |
| `gpt-6-luna` | GPT-6 Luna |

### minimax

MiniMax Direct API passthrough.

| Model id | Notes |
|----------|-------|
| `MiniMax-M3` | — |

### opencode-go

OpenCode Go gateway passthrough (subsidized "2x usage" rate). Select with `--model opencode-go/<id>` — the enforced deep-loop fan-out route for both models below.

| Model id | Notes |
|----------|-------|
| `deepseek-v4.1-flash` | Latency-optimized reasoning model that takes images as well as text, pinned to `--thinking max` by policy — a tier this route carries. **The deep-loop fan-out reaches this route through the provider-qualified literal `opencode-go/deepseek-v4.1-flash`**, which dispatches as `--model opencode-go/deepseek-v4.1-flash` at `--thinking max`; the bare literal still goes to DevPass. Both routes now name the *same* model again, because this id moved onto the gateway's own `deepseek-v4.1-flash` name and off `deepseek-v4-flash-vision-exp`; they stay separate routes under the one-literal-one-provider rule, which is why DevPass holds the bare literal's fan-out slot. Catalog-verified 2026-09-11 (1M context, 384K output, `images: yes`), and the route returned a real reply through its `opencode` client that same day |
| `qwen3.8-max` | Qwen 3.8 Max; a live `pi --provider opencode-go --model qwen3.8-max -p` dispatch completed a real turn 2026-08-07 |
| `glm-5.3-flash` | Z.AI GLM-5.3-Flash via the Go gateway; reasoning model whose ladder here is `low`/`high`/**`max`** — this route has no `xhigh` — dispatched at its top tier `--thinking max`; ladder re-verified in `opencode models opencode-go --verbose` on OpenCode 1 on 2026-09-04. Reachable as `--model opencode-go/glm-5.3-flash`. **Direct-dispatch route only since 2026-09-05:** the bare `glm-5.3-flash` literal now maps to `llmgateway` in `PI_MODEL_PROVIDERS`, and one literal maps to one provider, so the deep-loop fan-out reaches GLM-5.3-Flash through DevPass, not here |

### llmgateway

DevPass (LLM Gateway) account, base `https://api.llmgateway.io/v1`, OpenAI-compatible, added to Pi **by config** — a `providers.llmgateway` block in `.pi/models.json` (`api: openai-completions`, env-keyed `${LLMGATEWAY_API_KEY}`) plus four `enabledModels` entries in `.pi/settings.json`. Not a Pi builtin; full setup, verification and removal live in [.pi/custom-providers.md](../../../../../.pi/custom-providers.md) §2. DevPass bills per token at normal API list rates; the plan buys credits at a 3x bonus, which discounts the bill rather than removing it. The gateway publishes its own per-model rates at `/v1/models`, and those are the rates carried in the `cost` blocks here. The gateway fronts many more ids than these four, and **only the four rows below are on the roster.**

Model-id gotcha: LLM Gateway takes the **bare** id, so every reference here is **two-segment** (`llmgateway/<id>`). Confirmed against the live API on 2026-09-10 — `"model": "deepseek-v4.1-flash"` returns `200`, `"model": "llmgateway/deepseek-v4.1-flash"` returns `400 "Provider llmgateway does not support model deepseek-v4.1-flash"`. Do not send a provider-prefixed id. The gateway also rewrites ids upstream in its response (`deepseek/deepseek-v4.1-flash`, `zai/glm-5.3-flash`); those names are informational and must never be sent.

Credential: the block's `apiKey` MUST use pi's own config-value syntax, `${LLMGATEWAY_API_KEY}`, never opencode's `{env:...}`. pi has no `{env:...}` form, so it takes the braced string as a **literal** key and the gateway answers `401 Unauthorized` on the first real dispatch. Export it in `~/.zshenv` so dispatched shells inherit it. pi does not read opencode's auth store, even though both hold a key for this same account.

Effort policy: the ladders differ, so there is no single tier for this provider — pass `--thinking` explicitly. Pi's global `defaultThinkingLevel` is `xhigh`. GLM-5.3-Flash has a real `xhigh` above `high`, DeepSeek marks `xhigh` unsupported so Pi's `clampThinkingLevel` rounds it UP to `max`, and GPT-6 Luna runs `low` through `max`. The GPT-6 Luna route is direct-dispatch only.

**Mixed reachability, one row at a time.** `glm-5.3-flash` is **fan-out reachable through DevPass** as of 2026-09-05: the bare literal maps to `llmgateway` in `PI_MODEL_PROVIDERS`, so `${provider}/${model}` composes the two-segment `llmgateway/glm-5.3-flash` selector this gateway requires, and the opencode-go route for the same model became direct-dispatch only in exchange. DevPass took the fan-out slot on cost grounds: both bill per token, and DevPass is the cheaper of the two once the credit bonus is applied. The other bare literal here moved to `llmgateway` on 2026-09-07 for the same reason, after opencode-go's monthly window closed mid-program; the opencode-go DeepSeek route became direct-dispatch only in exchange, under the one-literal-one-provider constraint. That literal was `deepseek-v4-flash-vision-exp` until 2026-09-10, when the gateway deactivated the id and began answering `410` for it. The bare literal is now `deepseek-v4.1-flash`, which the gateway serves and which accepts images the same way. On 2026-10-17 the gateway published a second DeepSeek Flash release under its own id, `deepseek-v4.1-flash-1017`, which maps to `llmgateway` the same way; the fan-out default has moved to it, and the older literal stays selectable for a run that must pin the September build.

| Model id | Notes |
|----------|-------|
| `llmgateway/deepseek-v4.1-flash-1017` | DeepSeek V4.1 Flash, the 2026-10-17 release, via DevPass — reasoning **and images**, billed per token at normal API list rates, like every DevPass route; the account's 3x credit bonus discounts the bill, it does not make usage free. **This is the deep-loop fan-out default for DeepSeek Flash** (bare literal `deepseek-v4.1-flash-1017`, mapped to `llmgateway`); the effort pin in `isFlashMaxPinnedModel` forces `max`, which this route accepts. It is also Pi's default model in `.pi/settings.json` and the pi-blackhole worker model at `high`. Same 1.05M context, 384K output and $0.15 in / $0.60 out per million tokens with cached reads at $0.003 as the 2026-09-10 release, and the same **effort ladder, three real levels plus off**: `none` disables thinking, `minimal` and `low` both reach **low**, `medium`, `high` and `xhigh` all reach **high** on the gateway (in Pi the map marks `xhigh` null, so `--thinking xhigh` rounds up to `max`), `max` reaches **max**, the default when nothing is sent is `high`, and this route rejects `ultra` and the integer 1-100 form. **It carries the same `"compat": {"supportsDeveloperRole": false}` as the older id**, for the `runware` upstream described there |
| `llmgateway/deepseek-v4.1-flash` | **The 2026-09-10 release — still selectable, and still pinnable for a run that must reproduce it.** DeepSeek's own provider route for this id is listed as deactivating on 2026-10-24, so new work starts on the `-1017` row above. DeepSeek V4.1 Flash via DevPass — reasoning **and images**, billed per token at normal API list rates, like every DevPass route; the account's 3x credit bonus discounts the bill, it does not make usage free. **No longer the fan-out default**, but its bare literal `deepseek-v4.1-flash` still maps to `llmgateway` (since 2026-09-10); the effort pin in `isFlashMaxPinnedModel` forces `max`, which this route accepts. Context 1.05M, output 384K, $0.15 in and $0.60 out per million tokens with cached reads at $0.003. Live-verified 2026-09-10. **Effort ladder, three real levels plus off.** DeepSeek's thinking-mode guide maps the accepted names onto them: `none` disables thinking, `minimal` and `low` both reach **low**, `medium`, `high` and `xhigh` all reach **high** on the gateway (in Pi the map marks `xhigh` null, so `--thinking xhigh` rounds up to `max`), and `max` reaches **max**. Sent straight to the gateway, `high` and `xhigh` are the same request, and the default when nothing is sent is `high`. This route rejects `ultra`, which DeepSeek's own table lists, and rejects the integer 1-100 form the model card documents, so the names above are the whole surface here. It replaced `deepseek-v4-flash-vision-exp`, which the gateway deactivated and now answers `410` for. **Since 2026-09-18 the gateway serves this id from a `runware` upstream that refuses the `developer` role**, which pi sends for the system prompt of any reasoning model, so every dispatch failed with `400 "The request was rejected"` while a plain request with a `system` role returned 200. The model entry now carries `"compat": {"supportsDeveloperRole": false}` in both `.pi/models.json` and the global `~/.pi/agent/models.json`, and a dispatch at `--thinking max` is verified again |
| `llmgateway/glm-5.3-flash` | GLM-5.3-Flash via DevPass; reasoning, full ladder including **both `xhigh` and `max`** — the only GLM-5.3-Flash route that has both. **This is the deep-loop fan-out route for GLM-5.3-Flash** (bare literal `glm-5.3-flash`, mapped to `llmgateway` since 2026-09-05); the effort pin in `isFlashMaxPinnedModel` forces `max`, a tier this route has. Context 1.05M, output 131K. Dispatch-verified 2026-09-04 at `--thinking max` |
| `llmgateway/gpt-6-luna` | GPT-6 Luna via DevPass; reasoning and image-capable, efforts `none` through `max` on the gateway, which the `thinkingLevelMap` carries as `low` through `max` with `minimal` folded into `low`. 1.05M context, 128K output, and catalog costs of $0.10 in, $0.50 out, $0.01 cached read and $0.125 cache write per million tokens. Catalog-listed 2026-09-23, listed by `pi --list-models gpt-6` and dispatch-verified the same day by a one-turn smoke that replied `OK` for $0.0009. It was Pi's default model in `.pi/settings.json` until 2026-10-22, when `deepseek-v4.1-flash-1017` replaced it. **Direct-dispatch only:** the bare `gpt-6-luna` literal maps to `openai` in `PI_MODEL_PROVIDERS`, so the deep-loop fan-out reaches Luna through the ChatGPT subscription, not through DevPass |

Pi's `pi --help` also lists provider env vars beyond this roster (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `XAI_API_KEY`, `MISTRAL_API_KEY`, `MINIMAX_API_KEY`, `KIMI_API_KEY`, `QWEN_TOKEN_PLAN_API_KEY`, AWS). Documentation-only provider breadth is not a license to guess an unconfirmed model id — only the four authenticated providers above have a confirmed installed catalog.

**OpenRouter is off this roster, and deliberately still in the fan-out.** Direct dispatch has the
four providers above. The deep-loop fan-out additionally keeps two OpenRouter literals,
`deepseek/deepseek-v4-flash-vision-exp` and `z-ai/glm-5.3-flash`, mapped in `PI_MODEL_PROVIDERS`.
Those are *distinct literals* from the bare `deepseek-v4.1-flash` and `glm-5.3-flash` rows
above: one literal maps to one provider, so the slash-prefixed pair composes an OpenRouter selector
while the bare pair composes the DevPass one. So a fan-out can still reach OpenRouter for exactly
those two ids. That is an operator decision, not residue the roster removal missed — do not
"reconcile" it by deleting the mapping, which would silently change which route those two models
take.

---

## 3. DEFAULTS & QUICK INVOCATION

**cli-pi has NO fixed default model.** Pi's `--provider` default is `google` (`pi --help` documents `--provider <name> (default: google)`), but `google` is not in the authenticated roster (§2) — a dispatch that omits `--provider`/`--model` targets a provider with no authenticated model and fails on auth. Every real dispatch therefore names its provider and model explicitly; there is no skill-level default model to fall back to. The one exception is the repository's own `.pi/settings.json`, which makes `llmgateway/deepseek-v4.1-flash-1017` the default of a run that names no model, so the auth-failure consequence no longer applies inside this repository. The rule stands for every dispatch: name the provider and the model.

| Field | Value |
|-------|-------|
| Default model | **None** — selected per dispatch (passthrough) |
| Default provider (Pi's own) | `google` (not authenticated here — always override) |
| Default effort | None baked in — set `--thinking` explicitly per dispatch |
| Default mode | `--mode text` (print mode) |

```bash
# Name the provider-qualified model and the effort explicitly on every dispatch; only a run that names no model picks up the repository default:
pi -p "<prompt>" \
  --model opencode-go/deepseek-v4.1-flash \
  --thinking max --mode text --offline </dev/null
```

Do not fabricate a default model when composing a cli-pi dispatch. The repository's `.pi/settings.json` default (`llmgateway/deepseek-v4.1-flash-1017`) covers only a run that names no model, so it is not a skill-level default to lean on. If the task has no model-specific requirement, pick a provider/model from the authenticated roster (§2) deliberately and state the choice.

---

## 4. REASONING-EFFORT / THINKING LEVER

cli-pi expresses reasoning effort through the first-class, standalone **`--thinking`** flag, independent of the `--model` id:

```
--thinking off | minimal | low | medium | high | xhigh | max
```

`--thinking` is confirmed live from the installed help capture. Unlike `cli-cursor`/`cli-devin`, no effort tier is baked into any Pi model id.

### Do NOT copy Codex effort syntax into Pi
A common, real confusion: cli-codex controls effort through config-level `-c model_reasoning_effort=...` (and `-c service_tier=...`). **Those forms are Codex-specific and must NOT be copied into a `pi` invocation.** Pi uses the bare `--thinking <tier>` flag and has no confirmed service-tier control surface.

### GPT-6 effort ceilings via the `openai` provider
The GPT-6 tiers are reachable through Pi's `openai` provider, but Pi's `--thinking` scale tops out at `max`. Ceilings come from the cli-codex model-selection table — cross-reference [cli-codex/references/providers-and-models.md](../../cli-codex/references/providers-and-models.md) for the authoritative effort map.

| Model | Codex-documented effort ceiling | Reachable via Pi `--thinking`? |
|-------|---------------------------------|--------------------------------|
| `gpt-6-sol` | `ultra` | Partially — Pi's `--thinking` scale stops at `max`; `ultra` has no Pi-side value |
| `gpt-6-luna` | `max` | Yes — `max` is the top of Pi's own scale |

Confirm the target model actually honors the requested tier before assuming it changes behavior — the contract pin did not exhaustively test every model/tier pairing.

---

## 5. HOW TO INVOKE

### Dispatch envelope (child / detached sessions)
When dispatching as a non-interactive child (spec-gate-neutralized worker), prefix the shared env and capture streams separately:

```bash
SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<prompt>" \
  --model opencode-go/deepseek-v4.1-flash \
  --thinking max --mode text --offline \
  </dev/null > stdout.log 2> stderr.log
```

- `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` — neutralizes the spec-gate for a bound child worker so it does not stall waiting on an interactive Gate-3 answer.
- `PI_BLACKHOLE_PASSIVE=true` switches the operator's global pi-blackhole package to passive, so it does not compact the child mid-run and send it back to reading. The deep-loop fan-out passes this variable through to its Pi children.
- **`--model` carries its provider, and the enforcement guard rejects any dispatch where it does not.** Write `--model opencode-go/deepseek-v4.1-flash`; the split `--provider opencode-go --model deepseek-v4.1-flash` form is refused before the command is launched, whatever Pi itself would have done with it. The rule exists because an unqualified `--model` resolves against Pi's own default provider, which is `google` and unauthenticated here, so the mistake surfaces as a different model answering rather than as an error. Ids that already carry a vendor prefix simply grow a third segment, as the OpenRouter fan-out literal `z-ai/glm-5.3-flash` does when it composes `openrouter/z-ai/glm-5.3-flash`.
- **`</dev/null` before the redirects, on every non-interactive run.** Pi reads stdin at startup; without an EOF it waits forever, printing nothing. That is indistinguishable from a slow model, so the cost of omitting it is a hang nobody diagnoses rather than an error anyone sees.
- `--offline` — pass explicitly for any automated/CI dispatch; `pi --verbose` without `--offline` hung 2+ minutes with no reachable network path in the pinned contract. See [cli-reference.md](./cli-reference.md) §7 and [integration-patterns.md](./integration-patterns.md) §15.
- **Exit code is never an availability/auth signal** — an identical unauthenticated `pi -p` returned exit `0` then exit `1` across runs. Classify the captured output text (`No API key found...`), never the exit code. See [cli-reference.md](./cli-reference.md) §9.

Select the headless contract deliberately: `--mode text` (print), `--mode json` (JSONL event stream), or `--mode rpc` (persistent JSONL protocol) — RPC is not a print-mode alias. See [integration-patterns.md](./integration-patterns.md) §4/§6/§7.

### Recursion bounds
A Pi session may dispatch this packet: Pi has no in-process delegation left, so the CLI is its only way to hand work out. What the shared runtime still refuses is a dispatch from inside a fan-out lineage, and one whose kind already appears in the dispatch stack.

### Parallel / fan-out
Multi-lineage parallel dispatch is driven by `fanout-run.cjs`, which lives outside this hub — see §6.

---

## 6. ENFORCEMENT & PROFILES (authoritative elsewhere — do not duplicate here)

- **Fan-out dispatcher** → `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- **Live model ids** → re-read `~/.pi/agent/models-store.json` on the target install

---

## 7. RELATED

- [cli-reference.md](./cli-reference.md) — full `pi` flags, headless modes, auth failure behavior, §13 model selection
- [integration-patterns.md](./integration-patterns.md) — conductor/executor dispatch shapes, print/JSON/RPC, and anti-patterns
- [../SKILL.md](../SKILL.md) — cli-pi mode overview, routing, and recursion bounds
- [../../cli-codex/references/providers-and-models.md](../../cli-codex/references/providers-and-models.md) — authoritative GPT-6 effort-ceiling cross-map for the `openai` tiers
