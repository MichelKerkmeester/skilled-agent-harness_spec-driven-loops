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

Routes DeepSeek V4 Flash and DeepSeek V4 Pro through the Cline account (`https://api.cline.bot/api/v1`, OpenAI-compatible), giving pi parity with opencode, which already reaches the same provider. Cline is not a pi builtin, so without this block pi's `/login` and model picker never show it. Flash is pi's default model here (`defaultProvider: "cline-pass"`, `defaultModel: "cline-pass/deepseek-v4-flash"`).

### Where It Lives

- Provider block: `.pi/models.json` under `providers["cline-pass"]`, with two models
- Enabled in the picker: `.pi/settings.json` under `enabledModels`, entries `"cline-pass/cline-pass/deepseek-v4-flash"` and `"cline-pass/cline-pass/deepseek-v4-pro"`
- Default: `.pi/settings.json` `defaultProvider` is `"cline-pass"` and `defaultModel` is `"cline-pass/deepseek-v4-flash"`

**Model ids**: the pi reference is the three-segment `cline-pass/cline-pass/deepseek-v4-flash` (and `cline-pass/cline-pass/deepseek-v4-pro`) — provider `cline-pass` plus the model id `cline-pass/deepseek-v4-flash`, matching opencode's form. The model id keeps its `cline-pass/` prefix on purpose (see the model-id gotcha below).

### Dispatch

Select flash with `--provider cline-pass --model cline-pass/cline-pass/deepseek-v4-flash`, or pro with `--model cline-pass/cline-pass/deepseek-v4-pro`. The cli-pi skill roster documents the same forms under its `### cline-pass` section.

### Thinking And Effort

Both are reasoning models (`reasoning: true`) and inherit the global `defaultThinkingLevel: "xhigh"` from `.pi/settings.json`, so they run at Extra High by default. The Cline provider has no `max` tier for either, so `xhigh` is the top thinking level and the only one these entries use. The `compat.thinkingFormat: "deepseek"` hint matches how the DeepSeek Flash sibling is configured for the OpenRouter route, so thinking tokens parse correctly.

### Two Gotchas That Silently Break It

The provider `api` MUST be `"openai-completions"`, never a bare `"openai"`. A bare `openai` passes `pi auth check` and `--list-models` but throws at stream time (`No API provider registered for api: openai`). Every builtin OpenAI-compatible model, for example deepseek, uses `openai-completions`.

The model `id` MUST keep the `cline-pass/` prefix (`cline-pass/deepseek-v4-flash`, not bare `deepseek-v4-flash`). The Cline API rejects a bare id at request time with `400 "invalid model format. Expected format: modelType/model"`. That failure hides from `pi --list-models` and `pi auth check`, which never send a completion, so it only surfaces on the first real dispatch. opencode uses the same slashed id.

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
# real round-trip (needs a key) — proves the model id is accepted:
pi -p "reply OK" --provider cline-pass --model cline-pass/cline-pass/deepseek-v4-flash --thinking xhigh --mode text
```

Expected: the list shows the `cline-pass  cline-pass/deepseek-v4-flash` row, `pi auth check` returns `{"status":"ready"}`, and the dispatch returns a model reply rather than a `400 invalid model format`.

---

## 5. REMOVE

Delete the `providers["cline-pass"]` block from `.pi/models.json` and the `"cline-pass/cline-pass/deepseek-v4-flash"` and `"cline-pass/cline-pass/deepseek-v4-pro"` lines from `.pi/settings.json` `enabledModels`. If `defaultProvider` still points at `cline-pass`, reset it to another authenticated provider so an unqualified dispatch still resolves. No other cleanup is needed. There is no builtin and no stored state beyond an optional pi-login credential you can clear separately.
