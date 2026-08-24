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

No secret is stored in this repo. The provider's `apiKey` is `"{env:CLINE_API_KEY}"`, so the key comes from the environment at runtime. Two ways to provide it:

1. **Environment variable**: export `CLINE_API_KEY=<your Cline key>` in the shell or profile pi runs under.
2. **pi login**: run `pi /login cline-pass` and paste the key into the api-key dialog. pi stores it in its own auth store (`~/.pi/agent/auth.json`), separate from opencode's.

Until a key is present the provider reports as unattached at stream time. It does not break pi startup, `/login` or the other models.

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

Expected: the list shows the `cline-pass  cline-pass/deepseek-v4-flash`, `…/deepseek-v4-pro`, and `…/ox-alpha` rows, `pi auth check` returns `{"status":"ready"}`, and each dispatch returns a model reply rather than a `400 invalid model format`.

---

## 5. REMOVE

Delete the `providers["cline-pass"]` block from `.pi/models.json` and the `"cline-pass/cline-pass/deepseek-v4-flash"`, `"cline-pass/cline-pass/deepseek-v4-pro"`, and `"cline-pass/x-ai/ox-alpha"` lines from `.pi/settings.json` `enabledModels`. To drop only Ox Alpha, remove its model object from the provider block and its one `enabledModels` line. If `defaultProvider` still points at `cline-pass`, reset it to another authenticated provider so an unqualified dispatch still resolves. No other cleanup is needed. There is no builtin and no stored state beyond an optional pi-login credential you can clear separately.
