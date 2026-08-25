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

Routes DeepSeek V4 Flash, DeepSeek V4 Pro, and the free Ox Alpha tune through the Cline account (`https://api.cline.bot/api/v1`, OpenAI-compatible), giving pi parity with opencode, which already reaches the same provider. Cline is not a pi builtin, so without this block pi's `/login` and model picker never show it. pi's default here is `defaultProvider: "cline-pass"` with `defaultModel` (set in `.pi/settings.json`, currently `"x-ai/ox-alpha"`); point it at any cline-pass model. Ox Alpha is Cline's free-tier model (limited usage, separate from the ClinePass quota); it is discovered live in the interactive picker, but only this config block makes it selectable for headless `-p` dispatch and lists it in `pi --list-models`.

### Where It Lives

- Provider block: `.pi/models.json` under `providers["cline-pass"]`, with three models
- Enabled in the picker: `.pi/settings.json` under `enabledModels`, entries `"cline-pass/cline-pass/deepseek-v4-flash"`, `"cline-pass/cline-pass/deepseek-v4-pro"`, and `"cline-pass/x-ai/ox-alpha"`
- Default: `.pi/settings.json` `defaultProvider` is `"cline-pass"` and `defaultModel` is `"x-ai/ox-alpha"` (operator-selected; set it to any cline-pass model, e.g. `"cline-pass/deepseek-v4-flash"`)

**Model ids**: the pi reference is three-segment — provider `cline-pass` plus the model `id`. The DeepSeek entries keep a `cline-pass/` prefix (`cline-pass/cline-pass/deepseek-v4-flash`, `…/deepseek-v4-pro`), matching opencode's form. **Ox Alpha is different**: its Cline `id` carries the vendor prefix `x-ai/ox-alpha`, so its reference is `cline-pass/x-ai/ox-alpha` (not `cline-pass/ox-alpha`, which the Cline API 404s as "model not found"). Both forms still satisfy Cline's required `modelType/model` shape (see the model-id gotcha below).

### Dispatch

Select flash with `--provider cline-pass --model cline-pass/cline-pass/deepseek-v4-flash`, pro with `--model cline-pass/cline-pass/deepseek-v4-pro`, or Ox Alpha with `--model cline-pass/x-ai/ox-alpha`. The cli-pi skill roster documents the same forms under its `### cline-pass` section.

### Thinking And Effort

All three are reasoning models (`reasoning: true`) and inherit the global `defaultThinkingLevel: "xhigh"` from `.pi/settings.json`, so they run at Extra High by default. The Cline provider has no `max` tier for any of them, so `xhigh` is the top thinking level and the only one these entries use. The provider-level `compat.thinkingFormat: "deepseek"` hint applies to every model in the block, so thinking tokens parse correctly. (Ox Alpha's interactive picker offers the lower tiers too, but this config mirrors the DeepSeek entries' `xhigh` ceiling for a consistent cline-pass policy.)

Each model also carries a `thinkingLevelMap` (`{ "high": "high", "xhigh": "xhigh", … }`). Without it, pi's interactive picker cannot cycle past `high`: it derives a model's selectable thinking tiers from that map, and a bare `reasoning: true` custom model falls back to a `high` ceiling. The map exposes `high` and `xhigh` (Cline has no `max`); `--thinking xhigh` on the CLI works either way, but the picker needs the map to offer it. Mirrors the OpenRouter DeepSeek Flash map, which is how opencode's official cline-pass entry reaches `xhigh`.

### Two Gotchas That Silently Break It

The provider `api` MUST be `"openai-completions"`, never a bare `"openai"`. A bare `openai` passes `pi auth check` and `--list-models` but throws at stream time (`No API provider registered for api: openai`). Every builtin OpenAI-compatible model, for example deepseek, uses `openai-completions`.

The model `id` MUST be the exact `modelType/model` Cline expects — never bare. The Cline API rejects a bare id at request time with `400 "invalid model format. Expected format: modelType/model"`, and rejects a wrong `modelType/model` with `404 "model not found"`. Both failures hide from `pi --list-models` and `pi auth check` (which never send a completion), so they only surface on the first real dispatch. The DeepSeek entries use `cline-pass/deepseek-v4-flash` (opencode uses the same slashed id); **Ox Alpha uses `x-ai/ox-alpha`** — the vendor prefix, not `cline-pass/` — confirmed live (a real `PONG` turn on `--model cline-pass/x-ai/ox-alpha`; both `cline-pass/ox-alpha` and `cline-pass/ox-alpha-free` returned `404 model not found`).

---

## 3. SUPPLYING THE API KEY

No secret is stored in this repo. The provider's `apiKey` is `"${CLINE_API_KEY}"`, so the key comes from the environment at runtime. Two ways to provide it:

1. **Environment variable**: export `CLINE_API_KEY=<your Cline key>` in `~/.zshenv`, so non-interactive and dispatched shells inherit it too, not only interactive logins.
2. **pi login**: run `pi /login cline-pass` and paste the key into the api-key dialog. pi stores it in its own auth store (`~/.pi/agent/auth.json`), separate from opencode's.

The stored credential wins over the config value, and it is the more fragile of the two: it lives under the resolved pi agent directory, so any session running with a different `PI_CODING_AGENT_DIR` or `HOME` cannot see it. The environment route is the portable one; prefer it and treat `/login` as the interactive convenience.

Until a key is present the provider reports as unattached at stream time. It does not break pi startup, `/login` or the other models.

### The Placeholder Syntax Is pi's, Not Opencode's

pi resolves config values with `$ENV_VAR`, `${ENV_VAR}`, `!command`, `$$` and `$!` — documented under "config value syntax" in pi's own `docs/custom-provider.md`. It has **no** `{env:VAR}` form; that is opencode's syntax, and opencode's `cline-pass` block is where it is easy to copy from.

Writing `{env:CLINE_API_KEY}` does not fail loudly. pi accepts it as a **literal** API key and sends that exact string to Cline, which answers `401 "Unauthorized: Please make sure you're using the latest version of Cline and re-authenticate your Cline account."` on the first real dispatch. A `/login`-stored credential masks the whole thing, so the provider looks healthy in an interactive session while every session with its own agent directory fails. Verified by A/B: identical isolated agent dir, empty `auth.json`, `CLINE_API_KEY` exported, `{env:...}` returned the 401 and `${...}` returned a real model reply.

pi keeps its own auth store. Opencode's existing `cline-pass` credential (`~/.local/share/opencode/auth.json`) is not shared or auto-imported into pi. You give the key to pi once.

---

## 4. VERIFY

```bash
pi --list-models | grep cline
pi auth check --provider cline-pass --model cline-pass/cline-pass/deepseek-v4-flash --json
# real round-trip (needs a key) — proves each model id is accepted:
pi -p "reply OK" --provider cline-pass --model cline-pass/cline-pass/deepseek-v4-flash --thinking xhigh --mode text
pi -p "reply OK" --provider cline-pass --model cline-pass/x-ai/ox-alpha --thinking xhigh --mode text
```

Expected: the list shows the `cline-pass  cline-pass/deepseek-v4-flash`, `…/deepseek-v4-pro`, and `…/ox-alpha` rows, and each dispatch returns a model reply rather than a `400 invalid model format` or a `401 Unauthorized`.

`pi auth check` is **not** a credential test here. It never sends a completion, so it reports `{"status":"ready"}` whenever the provider block carries any non-empty `apiKey` value — including an unresolved placeholder that Cline will reject. Only the round-trip lines prove the credential. Its one honest signal is the opposite direction: `{"status":"invalid","reason":"invalid_state"}` means the provider block itself did not load.

---

## 5. REMOVE

Delete the `providers["cline-pass"]` block from `.pi/models.json` and the `"cline-pass/cline-pass/deepseek-v4-flash"`, `"cline-pass/cline-pass/deepseek-v4-pro"`, and `"cline-pass/x-ai/ox-alpha"` lines from `.pi/settings.json` `enabledModels`. To drop only Ox Alpha, remove its model object from the provider block and its one `enabledModels` line. If `defaultProvider` still points at `cline-pass`, reset it to another authenticated provider so an unqualified dispatch still resolves. No other cleanup is needed. There is no builtin and no stored state beyond an optional pi-login credential you can clear separately.
