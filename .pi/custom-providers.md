---
title: "Custom pi Providers"
description: "Providers added to pi by config in .pi/models.json rather than shipped in pi's builtin catalog, with the llmgateway (DevPass) setup, key handling and removal."
trigger_phrases:
  - "custom pi providers"
  - "llmgateway pi config"
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

## 2. LLMGATEWAY (DEVPASS)

Routes four models through the operator's **DevPass** subscription at LLM Gateway (`https://api.llmgateway.io/v1`, OpenAI-compatible), the same account and key opencode already uses. LLM Gateway is not a pi builtin, so without this block pi's picker and `--list-models` never show it. DevPass meters per token at normal API list rates; the plan's 3x credit bonus discounts the bill rather than removing it.

### Where It Lives

- Provider block: `.pi/models.json` under `providers["llmgateway"]`, with four models. The gateway fronts many more, and only these four are on the roster
- Enabled in the picker: `.pi/settings.json` `enabledModels`, entries `"llmgateway/gpt-6-luna"`, `"llmgateway/deepseek-v4.1-flash-1017"` and `"llmgateway/glm-5.3-flash"`. The older `deepseek-v4.1-flash` stays registered in `.pi/models.json`, so `--model llmgateway/deepseek-v4.1-flash` still pins it, but it is not offered in the picker
- Default: `.pi/settings.json` sets `defaultProvider` to `"llmgateway"` and `defaultModel` to `"deepseek-v4.1-flash-1017"`, so a `pi` run with no `--model` uses this block's DeepSeek V4.1 Flash 1017 route. The global `defaultThinkingLevel` is `xhigh`, and this model's `thinkingLevelMap` marks `xhigh` unsupported, so Pi's `clampThinkingLevel` rounds the run UP to `max`. `gpt-6-luna` stays selectable by name

**Model ids are BARE, and the pi reference is two-segment**: `llmgateway/<id>`, e.g. `llmgateway/deepseek-v4.1-flash-1017`. A provider-prefixed id inside the block is the easy mistake: see the gotcha below.

### Dispatch

```bash
pi -p "…" --provider llmgateway --model llmgateway/deepseek-v4.1-flash-1017 --thinking max
```

Swap the id for `glm-5.3-flash`, or use `gpt-6-luna` for GPT-6 Luna. Pin `deepseek-v4.1-flash` when a run must reproduce the 2026-09-10 DeepSeek release. Luna is direct-dispatch only on this route: the bare `gpt-6-luna` fan-out literal maps to the `openai` provider.

### Thinking And Effort

All four are reasoning models, and their ladders differ, so each carries its own `thinkingLevelMap`:

| Model | Ceiling | Notes |
|-------|---------|-------|
| `deepseek-v4.1-flash-1017` | `max` | **The default DeepSeek route**, the 2026-10-17 release. **Image-capable.** $0.15 in and $0.60 out per million tokens, cached reads $0.003, which keeps it under the gateway's Premium threshold. Three efforts plus off: `low`, `high` and `max`. On the gateway `minimal` folds into `low`, `medium` and `xhigh` fold into `high`, `none` disables thinking, and the default is `high`. In pi this block maps `xhigh` to `null`, so `--thinking xhigh` rounds up to `max`. `ultra` and the integer form are rejected here. It carries the same ladder and the same `"compat": {"supportsDeveloperRole": false}` entry as the older id below, so the developer-role rejection described in the gotcha applies to it too |
| `deepseek-v4.1-flash` | `max` | **The 2026-09-10 release, still selectable and pinnable**; DeepSeek's own provider route for this id is listed as deactivating on 2026-10-24. **Image-capable.** $0.15 in and $0.60 out per million tokens, cached reads $0.003, which keeps it under the gateway's Premium threshold. Three efforts plus off: `low`, `high` and `max`. On the gateway `minimal` folds into `low`, `medium` and `xhigh` fold into `high`, `none` disables thinking, and the default is `high`. In pi this block maps `xhigh` to `null`, so `--thinking xhigh` rounds up to `max`. `ultra` and the integer form are rejected here. The provider block marks the folded aliases `null` on purpose, so the picker offers only the levels that differ |
| `glm-5.3-flash` | `max` | Full ladder. Note this route has BOTH `xhigh` and `max`, unlike GLM-5.3-Flash on OpenRouter or opencode-go, which top out at `max` with no `xhigh` |
| `gpt-6-luna` | `max` | Catalog-listed 2026-09-23 and dispatch-verified the same day: 1.05M context, 128K output, text and image input, efforts `none` through `max`, and $0.10 in, $0.50 out, $0.01 cached read per million tokens. `minimal` maps to `low`, because the model has no `minimal` tier. Direct-dispatch only |

The global `defaultThinkingLevel` is `xhigh`. The four models do not share one ladder: GLM-5.3-Flash has a real `xhigh` above `high`, DeepSeek marks `xhigh` unsupported so Pi rounds it up to `max`, and GPT-6 Luna runs `low` through `max`. Pass `--thinking` explicitly rather than relying on a default that means different things per route.

No provider-level `compat.thinkingFormat` is set. The block spans several model families whose thinking formats differ, and a provider-wide hint would apply the wrong one to some of them; pi's default OpenAI-compatible parsing handles them, confirmed by real dispatches.

### The Gotcha: Bare Ids, Not Slashed

The LLM Gateway API takes the **bare** model id and rejects a provider-prefixed one. Confirmed against the live API: `"model": "deepseek-v4.1-flash"` returns `200`, while `"model": "llmgateway/deepseek-v4.1-flash"` returns `400`. The failure hides from `--list-models` and `pi auth check` and appears only on a real dispatch. Both DeepSeek ids take the same bare form: `deepseek-v4.1-flash-1017` is its own id, not a slashed variant of the older one.

The gateway rewrites the id upstream: a `deepseek-v4.1-flash` request comes back reporting `deepseek/deepseek-v4.1-flash`, GLM as `zai/glm-5.3-flash`. That upstream name is informational; never send it.

**Both DeepSeek entries need `"compat": {"supportsDeveloperRole": false}`, the older id and its `-1017` release alike.** Since 2026-09-18 the gateway serves `deepseek-v4.1-flash` from a `runware` upstream that answers `400 "The request was rejected"` to any request whose system prompt uses the `developer` role, and pi uses that role for every reasoning model. A raw request isolated it: the same body returns 200 with role `system` and 400 with role `developer`. `pi auth check` still reports ready, so the failure only shows at request time. GLM-5.3-Flash's upstream accepts `developer`, which is why only DeepSeek broke.

---

## 3. SUPPLYING THE API KEY

No secret is stored in this repo. The provider's `apiKey` is an environment reference, `"${LLMGATEWAY_API_KEY}"`, so the key comes from the environment at runtime. Two ways to provide it:

1. **Environment variable**: export the key in `~/.zshenv`, so non-interactive and dispatched shells inherit it too, not only interactive logins.
2. **pi login**: run `pi /login <provider>` and paste the key into the api-key dialog. pi stores it in its own auth store (`~/.pi/agent/auth.json`), separate from opencode's. Note pi does **not** import opencode's key, even where both tools hold a credential for the same account.

The stored credential wins over the config value, and it is the more fragile of the two: it lives under the resolved pi agent directory, so any session running with a different `PI_CODING_AGENT_DIR` or `HOME` cannot see it. The environment route is the portable one; prefer it and treat `/login` as the interactive convenience.

Until a key is present the provider reports as unattached at stream time. It does not break pi startup, `/login` or the other models.

### The Placeholder Syntax Is pi's, Not Opencode's

pi resolves config values with `$ENV_VAR`, `${ENV_VAR}`, `!command`, `$$` and `$!`, documented under "config value syntax" in pi's own `docs/custom-provider.md`. It has **no** `{env:VAR}` form; that is opencode's syntax, and opencode's provider blocks are where it is easy to copy from.

Writing `{env:LLMGATEWAY_API_KEY}` does not fail loudly. pi accepts it as a **literal** API key and sends that exact string to the provider, which answers `401 Unauthorized` on the first real dispatch. A `/login`-stored credential masks the whole thing, so the provider looks healthy in an interactive session while every session with its own agent directory fails. An A/B test confirmed the behavior: with an identical isolated agent dir, an empty `auth.json` and the key exported, `{env:...}` returned the 401 and `${...}` returned a real model reply.

pi keeps its own auth store. Opencode's existing credential (`~/.local/share/opencode/auth.json`) is not shared or auto-imported into pi. You give the key to pi once.

---

## 4. VERIFY

```bash
pi --list-models | grep llmgateway
# real round-trip (needs a key) proves each bare id is accepted:
pi -p "reply OK" --provider llmgateway --model llmgateway/deepseek-v4.1-flash-1017 --thinking max --mode text
pi -p "reply OK" --provider llmgateway --model llmgateway/glm-5.3-flash --thinking max --mode text
pi -p "reply OK" --provider llmgateway --model llmgateway/gpt-6-luna --thinking high --mode text
```

Expected: the list shows the four `llmgateway` rows, and each dispatch returns a model reply rather than a `400 Provider llmgateway does not support model …` or a `401 Unauthorized`. The older `deepseek-v4.1-flash` route takes the same form when a run pins it.

`pi auth check` is **not** a credential test here. It never sends a completion, so it reports `{"status":"ready"}` whenever the provider block carries any non-empty `apiKey` value, including an unresolved placeholder that the provider will reject. Only the round-trip lines prove the credential. Its one honest signal is the opposite direction: `{"status":"invalid","reason":"invalid_state"}` means the provider block itself did not load.

---

## 5. REMOVE

To drop llmgateway, delete the `providers["llmgateway"]` block from `.pi/models.json` and its three `"llmgateway/…"` lines from `.pi/settings.json` `enabledModels`. Reset `defaultProvider` and `defaultModel` to another authenticated provider first, so an unqualified dispatch still resolves, and take the bare `deepseek-v4.1-flash`, `deepseek-v4.1-flash-1017` and `glm-5.3-flash` literals out of the fan-out roster and provider map, or those lineages fail.

To drop a single model, remove its object from the provider block and its `enabledModels` line. GPT-6 Luna needs nothing else: the bare `gpt-6-luna` fan-out literal resolves to the `openai` provider. No other cleanup is needed. There is no builtin and no stored state beyond an optional pi-login credential you can clear separately.
