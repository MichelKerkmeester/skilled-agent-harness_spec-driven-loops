# Custom pi Providers

Providers added to pi **by config**, not shipped in pi's builtin catalog. pi (`@earendil-works/pi-coding-agent`) builds its runtime provider set from its compiled-in catalog **plus** every `providers.*` block in `.pi/models.json` — it does not consult a models.dev-style registry, so a provider that pi doesn't ship can still be added here with no code, extension, or CLI change.

This file documents each such custom provider: what it is, why it's wired by config, and how to operate or remove it.

---

## cline-pass — Cline (cline.bot)

Routes DeepSeek V4 Flash through the **Cline** account (`https://api.cline.bot/api/v1`, OpenAI-compatible), giving pi parity with opencode, which already reaches the same provider. Cline is not a pi builtin, so without this block pi's `/login` and model picker never show it.

**Where it lives**
- Provider block: `.pi/models.json` → `providers["cline-pass"]`
- Enabled in the picker: `.pi/settings.json` → `enabledModels` → `"cline-pass/deepseek-v4-flash"`

**Model id**: `cline-pass/deepseek-v4-flash` (pi's flat `provider/modelId`). This is pi's equivalent of opencode's three-segment `cline-pass/cline-pass/deepseek-v4-flash`.

**Thinking / effort**: it is a reasoning model (`reasoning: true`) and inherits the global `defaultThinkingLevel: "xhigh"` from `.pi/settings.json`, so it runs at Extra High by default. The `compat.thinkingFormat: "deepseek"` hint matches how the DeepSeek Flash sibling is configured for the OpenRouter route, so thinking tokens parse correctly.

**The gotcha that would silently break it**: the provider `api` MUST be `"openai-completions"`, never a bare `"openai"`. A bare `openai` passes `pi auth check` and `--list-models` but throws at stream time (`No API provider registered for api: openai`). Every builtin OpenAI-compatible model (e.g. deepseek) uses `openai-completions`.

### Supplying the API key

No secret is stored in this repo. The provider's `apiKey` is `"{env:CLINE_API_KEY}"`, so the key comes from the environment at runtime. Two ways to provide it:

1. **Environment variable** — export `CLINE_API_KEY=<your Cline key>` in the shell/profile pi runs under.
2. **pi login** — run `pi /login cline-pass` and paste the key into the api-key dialog; pi stores it in its own auth store (`~/.pi/agent/auth.json`), separate from opencode's.

Until a key is present the provider simply reports as unattached at stream time — it does not break pi startup, `/login`, or the other models.

> Note: pi keeps its **own** auth store. Opencode's existing `cline-pass` credential (`~/.local/share/opencode/auth.json`) is **not** shared or auto-imported into pi; you must give the key to pi once.

### Verify

```bash
pi --list-models | grep cline          # → cline-pass  deepseek-v4-flash ...
pi auth check --provider cline-pass --model cline-pass/deepseek-v4-flash --json
```

### Remove

Delete the `providers["cline-pass"]` block from `.pi/models.json` and the `"cline-pass/deepseek-v4-flash"` line from `.pi/settings.json` `enabledModels`. No other cleanup is needed (no builtin, no stored state beyond an optional pi-login credential you can clear separately).
