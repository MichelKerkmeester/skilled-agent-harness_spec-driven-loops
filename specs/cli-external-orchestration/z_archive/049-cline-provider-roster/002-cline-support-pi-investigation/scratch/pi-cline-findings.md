---
title: "pi CLI — Cline provider feasibility findings"
trigger_phrases: []
---
# pi CLI — Cline provider feasibility findings

Investigation worker report. Scope: can the `pi` CLI register/authenticate the Cline provider
(`cline-pass`, base URL `https://api.cline.bot/api/v1`, OpenAI-compatible) and surface
`deepseek-v4-flash` in pi's `/login` provider list and model picker, to reach parity with opencode?

- Runtime under investigation: `pi` = `@earendil-works/pi-coding-agent` **0.84.2**
  - binary symlink `/Users/michelkerkmeester/.local/bin/pi -> ../lib/node_modules/@earendil-works/pi-coding-agent/dist/cli.js`
  - package at `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent`
- Method: read-compiled (`dist/*.js`) source inspection + read-only CLI probes + a throwaway temp
  `PI_CODING_AGENT_DIR` harness. **No `.pi/` file was created, modified, or deleted.**

---

## 1. PROVIDER RESOLUTION

### How pi resolves providers and models

pi merges **two provider sources** into one runtime model set, and does **not** use the
models.dev registry opencode uses (confirmed: `models.dev` / `models.dev` appears in **zero**
files across the pi dist tree). The sources are:

**(a) A compiled-in builtin provider catalog** from the `@earendil-works/pi-ai` package.
- `model-runtime.js:2-3` `import * as builtinProviderCatalog from "@earendil-works/pi-ai/providers/all"`
- `model-runtime.js:83-87` maps that catalog into `defaultBuiltins` (with a remote-catalog wrapper).
- Concrete data files exist per provider, e.g. `pi-ai/dist/providers/data/deepseek.json`
  (entries declare `api:"openai-completions"`, `baseUrl:"https://api.deepseek.com"`, etc.).
  `deepseek.models.js` is auto-generated from that JSON.

**(b) A user overlay file `.pi/models.json`**, parsed by `ModelConfig` (`core/model-config.js`).
- `model-runtime.js:76-77` loads it: `modelsPath ?? join(getAgentDir(), "models.json")`.
- `config.js:424-425` → `getModelsPath()` = `join(getAgentDir(), "models.json")`.
- The provider block schema (model-config.js:167-178) is:
  `name, baseUrl, apiKey, api, oauth, headers, compat, authHeader, models[], modelOverrides`.

The two are merged by `composeModelProvider` (`core/provider-composer.js:285-371`), driven by
`providerIds()` = builtins ∪ native-extension ∪ **`config.getProviderIds()`** ∪ extension
(`model-runtime.js:125-132`). So every `providers.*` key in `.pi/models.json` becomes a
first-class runtime provider even if it has no builtin counterpart.

### What backs pi's `/login` provider list and the model picker

- `/login` list: `interactive-mode.js:4361 getLoginProviderOptions()` iterates
  `modelRuntime.getProviders()` and emits a provider when either `provider.auth.oauth`
  (→ `oauth`) or `provider.auth.apiKey` (→ `api_key`) exists. That `auth` map is built in
  `composeModelProvider` (provider-composer.js:330).
- Model picker / Ctrl+P scope: `settings.json["enabledModels"]` → `getEnabledModels()` →
  `resolveModelScope` (`main.js:638-641`, `core/model-resolver.js`). Patterns are flat
  `provider/modelId` strings (e.g. live settings `"openrouter/~deepseek/deepseek-v4-flash-latest"`).
- Durable provider/model cache: `~/.pi/agent/models-store.json` (a `providers → {models, etag}`
  map, per `core/models-store.js:25-113`); pi may auto-refresh builtin model lists from a
  gateway, but that only refreshes *existing* providers — it never introduces a brand-new
  provider id into `/login`.

### Real CLI surface

`pi --help` subcommands: `install`, `remove`, `uninstall`, `update`, `list`, `config`, `auth`.
Auth: `pi auth check|print-api-key|print-bearer-token`. Model surfacing:
`pi --list-models [search]`. Options: `--provider`, `--model`, `--models`, `--api-key`. `pi --version` → `0.84.2`.
There is **no** `pi models` or `pi providers` subcommand.

Live probes (current repo config, no Cline anywhere):
```
$ pi --list-models
deepseek     deepseek-v4-flash    1M 384K yes no
deepseek     deepseek-v4-pro      1M 384K yes no
minimax      MiniMax-M3           1M 128K yes yes
opencode-go  deepseek-v4-flash    1M 384K yes no
openrouter   ~deepseek/deepseek-v4-flash-latest  1.0M 384K yes no
... (builtin providers only; no cline-pass)
```
`~/.pi/agent/models.json` is a **symlink** to `<repo>/.pi/models.json`
(`SYNC.md:31`, and `ls -la ~/.pi/agent/models.json`). So the repo file is the live config.

---

## 2. CONFIG-ONLY FEASIBILITY — YES (empirically proven)

`ProviderConfigSchema` (model-config.js:167-178) accepts `baseUrl`, `apiKey`, `api`, `models[]`
with per-model `id/name/reasoning/contextWindow/maxTokens`. `applyModelsJson` (provider-composer.js:79-111)
converts `models[]` rows via `modelFromJson` (lines 48-78) which requires an `api` and `baseUrl`
and inherits provider-level `api`/`baseUrl`. `composeApiKeyAuth` (:184-251) turns a configured
`apiKey` into `provider.auth.apiKey` (:330), and `composeModelProvider` composes config-only
providers when `base` is undefined (:285-371). The live `.pi/models.json` already exercises
this shape (provider blocks for `opencode-go` and `openrouter`), though only with `compat`/modelOverrides.

**Critical correct shape:** config models must set `api: "openai-completions"` (the registered
OpenAI-compatible chat-completions API id), NOT a bare `"openai"`. Builtin OpenAI-compatible models
(e.g. deepseek.json) all declare `api:"openai-completions"`. A bare `api:"openai"` passes
`auth check`/listing but throws at stream time (`No API provider registered for api: openai`,
provider-composer.js:318-320). `openai-completions` is always registered (side-effect call in
`pi-ai/compat.js:139`).

**Throwaway-harness proof** (temp `PI_CODING_AGENT_DIR`; live `.pi/` untouched):
```
{ "providers": { "cline-pass": {
    "name":"Cline (cline.bot)",
    "api":"openai-completions",
    "baseUrl":"https://api.cline.bot/api/v1",
    "apiKey":"sk-placeholder",
    "models":[{"id":"deepseek-v4-flash","name":"DeepSeek V4 Flash","reasoning":true,
               "contextWindow":1000000,"maxTokens":393216}] } } }
```
```
$ PI_CODING_AGENT_DIR=<temp> pi --list-models
provider    model              context  max-out  thinking  images
cline-pass  deepseek-v4-flash  1M       393.2K   yes       no

$ pi auth check --provider cline-pass --model cline-pass/deepseek-v4-flash --json
{"status":"ready","provider":"cline-pass","authType":"api_key"}

$ pi auth print-api-key --provider cline-pass --model cline-pass/deepseek-v4-flash
sk-placeholder
```
With the same temp dir, a `settings.json` containing `"enabledModels": ["cline-pass/deepseek-v4-flash"]`
scopes the model into the picker. `resolveModelScopeFromModels` (model-resolver.js:200+) **unions**
matches for each enabled pattern, so adding one `cline-pass/deepseek-v4-flash` entry alongside the
existing entries is non-destructive (existing models are preserved).

Equivalent pi config for parity with opencode's `cline-pass/cline-pass/deepseek-v4-flash`
is the flat `cline-pass/deepseek-v4-flash` (provider/modelId).

---

## 3. AUTH PATH

- **pi keeps its own auth store** at `~/.pi/agent/auth.json`
  (`config.js:428-429 getAuthPath()`). Current keys (names only):
  `openai-codex, minimax, xiaomi, deepseek, opencode-go, openrouter` — **no `cline-pass`**.
- **pi does not share opencode's store.** opencode's credential live in
  `~/.local/share/opencode/auth.json`, which **does** contain a `cline-pass` entry
  (`opencode auth.json` keys: `openai, xiaomi, minimax, opencode-go, deepseek, openrouter, cline-pass`).
  These are two distinct files; there is no sharing/copy path between them.
- Secondary pi store: `~/.pi/agent/models-store.json` holds the login-provisioned provider model cache
  and OAuth credential material; it likewise contains no `cline-pass`.
- PLUGINS.md:65-66 documents the split: “No credentials live in `models.json`; auth stays in
  `auth.json` / `models-store.json`.”
- To authenticate Cline in pi the operator must supply the key **to pi**:
  - `pi /login cline-pass` opens the `api_key` dialog (`startProviderLogin` →
    `showApiKeyLoginDialog`, interactive-mode.js:4426-4444); the default apiKey login
    prompts “Enter API key” and stores an `api_key` credential (provider-composer.js:194-198); or
  - set `apiKey` in the `.pi/models.json` provider block, which can be a config value
    (`{env:CLINE_API_KEY}` works — verified `auth check` reports `ready` for both set/unset
    variants; a missing env simply reports the provider unattached at stream time), so it can be
    kept out of any checked-in literal by sourcing from environment.
  - opencode's existing key is not auto-imported; at best it can be repurposed by hand (env or `/login`).

---

## 4. WHY OMITTED TODAY

pi's `/login` omits Cline because **Cline is neither in pi's compiled-in provider catalog nor in
the user `.pi/models.json`**:

- Mechanism is a **missing builtin entry + absent user config**, not a registry gap that a refresh
  could heal. pi's provider set = compiled `@earendil-works/pi-ai/providers/all` builtins
  (deepseek, minimax, openai-codex, opencode-go, openrouter, xiaomi, …) plus whatever
  `providers` blocks live in `.pi/models.json`. pi does **not** consult a models.dev-style
  registry, so there is no automatic Cline row.
- Confirmed omissions:
  - `pi --list-models` shows only builtins (no `cline-pass`).
  - `.pi/models.json` (scale) defines only `opencode-go` and `openrouter` blocks.
  - `~/.pi/agent/auth.json` and `~/.pi/agent/models-store.json` contain no `cline-pass`.
  - No `cline-pass` string anywhere in the pi package `dist/` tree (the provider id is entirely unknown to pi).

Because the omission is purely config-side (absent provider block), it is fully addressable by
adding config — no code, extension, or CLI change is required.

---

## Constraints & rigor notes

- Every load-bearing claim is grounded in a file excerpt + line, or actual command output above.
- Runtime behavior (listing, auth check, model resolution, key print) was proven in a throwaway
  temp `PI_CODING_AGENT_DIR`; the live `<repo>/.pi/` was **not** modified.
- One item not exercised: an actual streaming chat round-trip against `https://api.cline.bot/api/v1`
  (a real Cline key + outbound network call would be required). Streaming wiring is resolved by the
  static `composeModelProvider.streamWith` path (provider-composer.js:318-324) plus the confirmed
  `api:"openai-completions"` registration; this is high-confidence but UNKNOWN until a live key is used once.

---

VERDICT: config-only-feasible — add a `cline-pass` provider block (`api:"openai-completions"`, `baseUrl:https://api.cline.bot/api/v1`, `apiKey`, `models:[{"id":"deepseek-v4-flash"}]`) to `.pi/models.json` and a `"cline-pass/deepseek-v4-flash"` entry to `enabledModels` in `.pi/settings.json`, then supply the API key via `pi /login cline-pass` or an `{env:CLINE_API_KEY}` config value — no code, extension, or registry change needed.