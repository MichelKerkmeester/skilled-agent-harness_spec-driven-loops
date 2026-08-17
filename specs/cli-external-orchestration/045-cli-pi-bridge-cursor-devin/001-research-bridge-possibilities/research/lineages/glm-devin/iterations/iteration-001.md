# Iteration 1: Pi /model picker architecture and provider-extension hooks

## Focus
How Pi resolves providers and models for the interactive picker and `--list-models`, which config/auth files compose the roster, and which extension hooks a Cursor- or Devin-shaped source would have to use.

## Actions Taken
- Ran `pi --version` (0.84.2), `pi --help`, and `pi --list-models` on the operator machine.
- Inspected `~/.pi/agent/` directory listing and the `models.json` symlink target (repo `.pi/models.json`).
- Read the installed `docs/custom-provider.md`, `docs/providers.md`, and `docs/models.md` under `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/`.
- Cross-checked repo overlays `.pi/models.json` and `.pi/PLUGINS.md` plus `cli-pi/references/cli-reference.md` and `cli-pi/references/providers-and-models.md`.
- Enumerated `auth.json` provider keys (keys only; no credential values copied).

## Findings

### F1. The picker command is `/model`; the CLI dump is `--list-models`
Pi's interactive model selector is `/model` (singular), not `/models`. The headless roster dump is `pi --list-models [search]`. `--list-models` accepts an optional fuzzy search argument. Models declared in `models.json` reload each time `/model` is opened; no process restart is required. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/models.md] [SOURCE: pi --help output 2026-08-17] [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:71]

### F2. The live roster composes from four layers
On this machine (`pi 0.84.2`), the roster is built from:

| Layer | File / source | Role | Live observation |
|-------|---------------|------|------------------|
| Built-in catalogs | shipped docs/providers.md | Subscription + API-key provider list | Six subscription `/login` providers (see F4) plus ~20 env-var API-key providers |
| Provider cache | `~/.pi/agent/models-store.json` | Auto-refreshed catalog cache (287 KB) | Not a durable edit target; refreshed from each provider gateway |
| Operator overlay | `~/.pi/agent/models.json` → repo `.pi/models.json` | Custom provider config / compat flags | Symlink; currently only `providers.opencode-go.compat.sendSessionAffinityHeaders` |
| Extension registry | `pi.registerProvider()` | Full custom providers (OAuth, custom streaming, dynamic model discovery) | Loaded before startup completes; available to `/model` and `--list-models` |

[SOURCE: ~/.pi/agent/ directory listing 2026-08-17] [SOURCE: .pi/PLUGINS.md:52-67] [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:33-91] [SOURCE: .pi/models.json]

`models-store.json` is auto-refreshed from each provider gateway and is explicitly not a durable edit target. [SOURCE: .pi/PLUGINS.md:52-55]

### F3. This machine is authenticated for six providers; none is Cursor or Devin
`~/.pi/agent/auth.json` (keys only, values redacted) contains exactly six provider entries:

| Provider | Auth shape |
|----------|-----------|
| `openai-codex` | OAuth — `type`, `access`, `refresh`, `expires`, `accountId` |
| `minimax` | API key — `type`, `key` |
| `xiaomi` | API key — `type`, `key` |
| `deepseek` | API key — `type`, `key` |
| `opencode-go` | API key — `type`, `key` |
| `openrouter` | API key — `type`, `key` |

Because auth material exists, `pi --list-models` on this machine returns a populated roster (deepseek, minimax, openai-codex gpt-5.3-codex-spark / gpt-5.4 / gpt-5.4-mini / gpt-5.5, etc.). An unauthenticated machine returns no models. There is no `cursor`, `devin`, `cognition`, or `api2.cursor` key in `auth.json`. [SOURCE: ~/.pi/agent/auth.json key enumeration 2026-08-17] [SOURCE: pi --list-models output 2026-08-17] [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:161-166]

### F4. Built-in subscription `/login` list excludes Cursor and Devin
`docs/providers.md` lists the built-in subscription providers reachable via `/login`: ChatGPT Plus/Pro (Codex), Claude Pro/Max, GitHub Copilot, xAI (Grok/X subscription), OpenRouter (OAuth-minted API key), and Radius. **Cursor and Devin are absent.** There is no `/login cursor` or `/login devin` built-in flow. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/providers.md:13-56]

### F5. Two extension hooks exist for a new provider; both expect an HTTP LLM API
1. **`models.json` overlay** — declares a provider with `baseUrl`, `api` (one of the supported streaming APIs), `apiKey` (optional), and a `models[]` list. Sufficient for any HTTP endpoint that already speaks a supported API. This is how local Ollama / vLLM / LM Studio and this repo's `opencode-go` compat overlay are wired.
2. **`pi.registerProvider()` extension** — required when the vendor needs custom OAuth/SSO login, token refresh, model filtering, or non-standard streaming. Full form uses `createProvider()`; legacy form passes a config object. OAuth registrations appear in `/login <provider-id>` and persist `{refresh, access, expires}` in `auth.json`.

Supported `api` types: `anthropic-messages`, `openai-completions`, `openai-responses`, `azure-openai-responses`, `openai-codex-responses`, `mistral-conversations`, `google-generative-ai`, `google-vertex`, `bedrock-converse-stream`. For non-standard APIs, `streamSimple` implements custom streaming. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:33-91] [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:219-261] [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:286-350]

### F6. Picker visibility is auth-gated; credential resolution has a fixed order
A `models.json` provider needs `baseUrl` + `api` + `models[]`. `apiKey` may be omitted if `/login`/`auth.json` or `--api-key` supplies auth. **Without any auth material, models may load but stay unavailable in `/model` and `--list-models`.** Dummy keys are used for keyless local servers because Pi still treats picker visibility as auth-gated. Credential resolution order: CLI `--api-key` → `auth.json` → environment variable → `models.json` keys. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/providers.md:310-317] [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/models.md]

### F7. `apiKey` config syntax enables command execution and env interpolation
`apiKey` and custom header values use a config syntax: `!command` at the start executes a shell command for the whole value; `$ENV_VAR` / `${ENV_VAR}` interpolate environment variables; `$$` emits a literal `$`; `$!` emits a literal `!`. This means a provider could in principle shell out to fetch a token — relevant when assessing whether a "Pi adapter" is token-reuse with extra steps versus a genuine CLI front. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:186]

### F8. Pi's completions client sends tools and expects streaming stop reasons
Pi's model client sends tool definitions and expects streaming with `finish_reason`/stop-reason semantics, optional usage, and optional session-affinity headers. A gateway that only returns a final assistant string (no tool-call streaming, no stop-reason events) degrades Pi's native tool loop. The `streamSimple` contract requires `start` → content deltas → `done`/`error` events with a non-pending `stopReason`. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:395-499]

## Questions Answered
- Q1 (partial): Pi's picker is `/model`; roster = built-in catalogs + `models-store.json` cache + `models.json` overlay + `registerProvider`, filtered by `auth.json`/env/`--api-key`. Built-in subscription list and live `auth.json` contain neither Cursor nor Devin. Two hooks (`models.json` HTTP overlay, `registerProvider` extension) are the only first-class ways to add a provider, and both expect an HTTP LLM API (or a custom `streamSimple`).

## Questions Remaining
- Q2 Cursor auth reuse / ToS
- Q3 Devin auth reuse / ToS
- Q4 Local OpenAI-compatible gateway in front of vendor CLIs
- Q5 Ranked verdict
- Follow-up: exact HTTP contract of `api2.cursor.sh` and `server.codeium.com` vs Pi's supported API types (iteration 2–3)

## Dead Ends
- Searching `auth.json`, `providers.md`, and the live `models-store.json` for a built-in Cursor or Devin provider: none.

## Ruled Out
- **Built-in Pi Cursor/Devin provider already exists.** Evidence: `providers.md` subscription list and live `auth.json` have neither vendor. Do not spend another iteration hunting a hidden built-in id.

## Reflection
What worked: running `pi --list-models` and enumerating `auth.json` keys on the live authenticated machine gave a concrete six-provider roster and confirmed the OAuth-vs-API-key auth split. What failed: nothing this pass. Negative knowledge: Pi will not show a custom provider in the picker until some auth material exists for that provider id, and the only first-class hooks expect an HTTP LLM API — a sibling-CLI subprocess is not a native provider shape.

## Assessment
- newInfoRatio: 1.00
- Novelty justification: First iteration; picker command, four-layer roster composition, six-provider auth shape, supported API types, `!command`/`$ENV` syntax, and the absence of Cursor/Devin in Pi's catalog were all new to this packet.
- Confidence: high on picker/file/API facts (installed docs + live `pi`/`auth.json` evidence); medium on "gateway must impersonate HTTP" until Cursor/Devin API surfaces are read.

## Recommended Next Focus
Cursor (`cursor-agent`) auth token stores, `CURSOR_API_KEY`/`--api-key`, `https://api2.cursor.sh`, and whether that HTTP surface is a documented OpenAI-compatible completions API that a Pi `models.json` provider could call — versus a private agent protocol that would force an extension or a CLI gateway.

## SCOPE VIOLATIONS
None.
