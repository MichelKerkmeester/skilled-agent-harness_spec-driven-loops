---
title: "Custom pi Providers"
description: "Providers added to pi by config in .pi/models.json rather than shipped in pi's builtin catalog, with the cline-pass DeepSeek V4 Flash setup, key handling and removal."
trigger_phrases:
  - "custom pi providers"
  - "cline-pass pi config"
  - "pi models.json custom provider"
  - "add provider to pi by config"
---

# Custom pi Providers

> Providers wired into pi by config in `.pi/models.json`, not shipped in pi's builtin catalog.

---

## 1. OVERVIEW

pi (`@earendil-works/pi-coding-agent`) builds its runtime provider set from its compiled-in catalog plus every `providers.*` block in `.pi/models.json`. It does not consult a models.dev-style registry, so a provider pi does not ship can still be added here with no code, extension or CLI change.

This file documents each custom provider: what it is, why it is wired by config and how to operate or remove it.

---

## 2. CLINE-PASS (CLINE.BOT)

Routes DeepSeek V4 Flash, DeepSeek V4 Pro and GLM-5.3-Flash through the Cline account (`https://api.cline.bot/api/v1`, OpenAI-compatible), giving pi parity with opencode, which already reaches the same provider. Cline is not a pi builtin, so without this block pi's `/login` and model picker never show it. pi's default here is `defaultProvider: "cline-pass"` with `defaultModel: "z-ai/glm-5.3-flash"` (set in `.pi/settings.json`); point it at any cline-pass model.

The free Ox Alpha tune was retired from this block and replaced by GLM-5.3-Flash; no `x-ai/ox-alpha` id remains in either `.pi` file, and dispatching one now returns `404 model not found`.

### Where It Lives

- Provider block: `.pi/models.json` under `providers["cline-pass"]`, with three models
- Enabled in the picker: `.pi/settings.json` under `enabledModels`, entries `"cline-pass/cline-pass/deepseek-v4-flash"` and `"cline-pass/z-ai/glm-5.3-flash"`. **DeepSeek V4 Pro is declared in the provider block but is NOT in `enabledModels`**, so it is dispatchable by explicit `--model` and absent from the picker
- Default: `.pi/settings.json` `defaultProvider` is `"cline-pass"` and `defaultModel` is `"z-ai/glm-5.3-flash"` (operator-selected; set it to any cline-pass model)

**Model ids**: the pi reference is three-segment — provider `cline-pass` plus the model `id`. The DeepSeek entry keeps a `cline-pass/` prefix (`cline-pass/cline-pass/deepseek-v4-flash`), matching opencode's form. **GLM-5.3-Flash is different**: its Cline `id` carries the vendor prefix `z-ai/glm-5.3-flash`, so its reference is `cline-pass/z-ai/glm-5.3-flash`, not `cline-pass/glm-5.3-flash`. Both forms still satisfy Cline's required `modelType/model` shape (see the model-id gotcha below).

### Dispatch

Select flash with `--provider cline-pass --model cline-pass/cline-pass/deepseek-v4-flash`, or GLM-5.3-Flash with `--model cline-pass/z-ai/glm-5.3-flash`. The cli-pi skill roster documents both under its `### cline-pass` section.

DeepSeek V4 Pro was retired from this block on 2026-09-04. Its object, its `enabledModels` entry and its rows in every CLI roster are gone, so `pi` and the skills now agree that it is not a dispatch target. Cline still offers it upstream; the exclusion is a curation decision, not an availability one.

### Thinking And Effort

All three are reasoning models (`reasoning: true`) and inherit the global `defaultThinkingLevel: "xhigh"` from `.pi/settings.json`, so they run at Extra High by default. The Cline provider has no `max` tier for any of them, so `xhigh` is the top thinking level and the only one these entries use. The provider-level `compat.thinkingFormat: "deepseek"` hint applies to every model in the block, so thinking tokens parse correctly. (GLM-5.3-Flash's interactive picker offers the lower tiers too, but this config mirrors the DeepSeek entries' `xhigh` ceiling for a consistent cline-pass policy. That `xhigh` ceiling is a property of the **Cline route**, not of GLM-5.3-Flash: the same model tops out at `max` on OpenRouter and opencode-go, and carries both tiers on DevPass.)

Each model also carries a `thinkingLevelMap` (`{ "high": "high", "xhigh": "xhigh", … }`). Without it, pi's interactive picker cannot cycle past `high`: it derives a model's selectable thinking tiers from that map, and a bare `reasoning: true` custom model falls back to a `high` ceiling. The map exposes `high` and `xhigh` (Cline has no `max`); `--thinking xhigh` on the CLI works either way, but the picker needs the map to offer it. Mirrors the OpenRouter DeepSeek Flash map, which is how opencode's official cline-pass entry reaches `xhigh`.

### Two Gotchas That Silently Break It

The provider `api` MUST be `"openai-completions"`, never a bare `"openai"`. A bare `openai` passes `pi auth check` and `--list-models` but throws at stream time (`No API provider registered for api: openai`). Every builtin OpenAI-compatible model, for example deepseek, uses `openai-completions`.

The model `id` MUST be the exact `modelType/model` Cline expects — never bare. The Cline API rejects a bare id at request time with `400 "invalid model format. Expected format: modelType/model"`, and rejects a wrong `modelType/model` with `404 "model not found"`. Both failures hide from `pi --list-models` and `pi auth check` (which never send a completion), so they only surface on the first real dispatch. The DeepSeek entries use `cline-pass/deepseek-v4-flash` (opencode uses the same slashed id); **GLM-5.3-Flash uses `z-ai/glm-5.3-flash`** — the vendor prefix, not `cline-pass/`.

---

## 3. LLMGATEWAY (DEVPASS)

Routes two models through the operator's **DevPass** subscription at LLM Gateway (`https://api.llmgateway.io/v1`, OpenAI-compatible), the same account and key opencode already uses. LLM Gateway is not a pi builtin, so without this block pi's picker and `--list-models` never show it. DevPass is a flat-price plan, so these four cost the subscription rather than per-token metering.

### Where It Lives

- Provider block: `.pi/models.json` under `providers["llmgateway"]`, with two models. The gateway fronts many more; only these two are on the roster
- Enabled in the picker: `.pi/settings.json` `enabledModels`, entries `"llmgateway/deepseek-v4-flash-vision-exp"` and `"llmgateway/glm-5.3-flash"`
- Not a default: `defaultProvider` stays `cline-pass`

**Model ids are BARE, and the pi reference is two-segment** — `llmgateway/<id>`, e.g. `llmgateway/deepseek-v4-flash`. This is the opposite of cline-pass above, and copying that block's slashed form is the easy mistake: see the gotcha below.

### Dispatch

```bash
pi -p "…" --provider llmgateway --model llmgateway/deepseek-v4-flash-vision-exp --thinking max
```

Swap the id for `glm-5.3-flash`. No other id is on the roster for this provider.

### Thinking And Effort

Both are reasoning models, and their ladders differ, so each carries its own `thinkingLevelMap`:

| Model | Ceiling | Notes |
|-------|---------|-------|
| `deepseek-v4-flash-vision-exp` | `max` | Sparse ladder — only `low`, `high`, `max`. **Image-capable**, and the same effective cost as plain flash under a flat-price plan. Reads images unreliably: 1 correct of 3 probes |
| `glm-5.3-flash` | `max` | Full ladder. Note this route has BOTH `xhigh` and `max`, unlike GLM-5.3-Flash on OpenRouter or opencode-go, which top out at `max` with no `xhigh`, and unlike Cline, which tops out at `xhigh` with no `max` |

The global `defaultThinkingLevel` is `xhigh`, which only GLM-5.3-Flash accepts on this route. Pass `--thinking` explicitly rather than relying on the default.

No provider-level `compat.thinkingFormat` is set. The block spans two model families whose thinking formats differ, and a provider-wide hint would apply the wrong one to one of them; pi's default OpenAI-compatible parsing handles both, confirmed by real dispatches.

### The Gotcha: Bare Ids, Not Slashed

The LLM Gateway API takes the **bare** model id and rejects a provider-prefixed one. Confirmed against the live API: `"model": "deepseek-v4-flash-vision-exp"` returns `200`, while `"model": "llmgateway/deepseek-v4-flash-vision-exp"` returns `400`. That is the exact inverse of the cline-pass rule directly above, so the two blocks must not be copied into each other. As with Cline, the failure hides from `--list-models` and `pi auth check` and appears only on a real dispatch.

The gateway rewrites the id upstream — a `deepseek-v4-flash-vision-exp` request comes back reporting `deepseek/deepseek-v4-flash-vision-exp`, GLM as `zai/glm-5.3-flash`. That upstream name is informational; never send it.

---

## 4. SUPPLYING THE API KEY

No secret is stored in this repo. Each provider's `apiKey` is an environment reference — `"${CLINE_API_KEY}"` for cline-pass, `"${LLMGATEWAY_API_KEY}"` for llmgateway — so the key comes from the environment at runtime. Two ways to provide it:

1. **Environment variable**: export the key in `~/.zshenv`, so non-interactive and dispatched shells inherit it too, not only interactive logins. Both providers use this route.
2. **pi login**: run `pi /login <provider>` and paste the key into the api-key dialog. pi stores it in its own auth store (`~/.pi/agent/auth.json`), separate from opencode's. Note pi does **not** import opencode's key, even where both tools hold a credential for the same account.

The stored credential wins over the config value, and it is the more fragile of the two: it lives under the resolved pi agent directory, so any session running with a different `PI_CODING_AGENT_DIR` or `HOME` cannot see it. The environment route is the portable one; prefer it and treat `/login` as the interactive convenience.

Until a key is present the provider reports as unattached at stream time. It does not break pi startup, `/login` or the other models.

### The Placeholder Syntax Is pi's, Not Opencode's

pi resolves config values with `$ENV_VAR`, `${ENV_VAR}`, `!command`, `$$` and `$!` — documented under "config value syntax" in pi's own `docs/custom-provider.md`. It has **no** `{env:VAR}` form; that is opencode's syntax, and opencode's `cline-pass` block is where it is easy to copy from.

Writing `{env:CLINE_API_KEY}` does not fail loudly. pi accepts it as a **literal** API key and sends that exact string to Cline, which answers `401 "Unauthorized: Please make sure you're using the latest version of Cline and re-authenticate your Cline account."` on the first real dispatch. A `/login`-stored credential masks the whole thing, so the provider looks healthy in an interactive session while every session with its own agent directory fails. Verified by A/B: identical isolated agent dir, empty `auth.json`, `CLINE_API_KEY` exported, `{env:...}` returned the 401 and `${...}` returned a real model reply.

pi keeps its own auth store. Opencode's existing `cline-pass` credential (`~/.local/share/opencode/auth.json`) is not shared or auto-imported into pi. You give the key to pi once.

---

## 5. VERIFY

```bash
pi --list-models | grep cline
pi auth check --provider cline-pass --model cline-pass/cline-pass/deepseek-v4-flash --json
# real round-trip (needs a key) — proves each model id is accepted:
pi -p "reply OK" --provider cline-pass --model cline-pass/cline-pass/deepseek-v4-flash --thinking xhigh --mode text
pi -p "reply OK" --provider cline-pass --model cline-pass/z-ai/glm-5.3-flash --thinking xhigh --mode text
```

For llmgateway:

```bash
pi --list-models | grep llmgateway
# real round-trip (needs a key) — proves each bare id is accepted:
pi -p "reply OK" --provider llmgateway --model llmgateway/deepseek-v4-flash-vision-exp --thinking max --mode text
pi -p "reply OK" --provider llmgateway --model llmgateway/glm-5.3-flash --thinking max --mode text
```

Expected: the list shows the `cline-pass  cline-pass/deepseek-v4-flash` and `…/z-ai/glm-5.3-flash` rows plus the two `llmgateway` rows, and each dispatch returns a model reply rather than a `400 invalid model format`, a `400 Provider llmgateway does not support model …`, or a `401 Unauthorized`.

`pi auth check` is **not** a credential test here. It never sends a completion, so it reports `{"status":"ready"}` whenever the provider block carries any non-empty `apiKey` value — including an unresolved placeholder that Cline will reject. Only the round-trip lines prove the credential. Its one honest signal is the opposite direction: `{"status":"invalid","reason":"invalid_state"}` means the provider block itself did not load.

---

## 6. REMOVE

To drop llmgateway, delete the `providers["llmgateway"]` block from `.pi/models.json` and its four `"llmgateway/…"` lines from `.pi/settings.json` `enabledModels`. Nothing else references it — it is not a default and not in the deep-loop fan-out roster.

Delete the `providers["cline-pass"]` block from `.pi/models.json` and the `"cline-pass/cline-pass/deepseek-v4-flash"` and `"cline-pass/z-ai/glm-5.3-flash"` lines from `.pi/settings.json` `enabledModels`. To drop a single model, remove its object from the provider block and its `enabledModels` line if it has one. If `defaultProvider` still points at `cline-pass`, reset it to another authenticated provider so an unqualified dispatch still resolves. No other cleanup is needed. There is no builtin and no stored state beyond an optional pi-login credential you can clear separately.
