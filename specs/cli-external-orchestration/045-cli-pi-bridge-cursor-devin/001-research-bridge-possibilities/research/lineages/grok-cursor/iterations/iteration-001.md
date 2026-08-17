# Iteration 1: Pi /model picker and provider-adapter architecture

## Focus
How Pi resolves providers and models for the interactive picker and `--list-models`, and which extension/config hooks a Cursor or Devin-shaped source would use.

## Actions Taken
- Inspected the live Pi 0.84.2 install under `~/.local/lib/node_modules/@earendil-works/pi-coding-agent` and the operator `~/.pi/agent` directory (file names and redacted schemas only; no credential values copied).
- Read installed `docs/models.md`, `docs/providers.md`, and `docs/custom-provider.md`.
- Cross-checked repo overlays `.pi/models.json` and `.pi/PLUGINS.md` plus `cli-pi/references/providers-and-models.md`.
- Fetched the public Custom Models page at https://pi.dev/docs/latest/models as a second source for the same `models.json` contract.

## Findings

### F1. The picker command is `/model`, not `/models`
Pi's interactive selector is `/model`. The CLI roster dump is `pi --list-models`. Models in `models.json` reload each time `/model` is opened; no process restart is required. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/models.md] [SOURCE: https://pi.dev/docs/latest/models] [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:71]

### F2. Three files compose the live roster
On this machine, `~/.pi/agent/` holds:

| File | Role | Live observation |
|------|------|------------------|
| `models.json` | Operator/custom overlay | Symlink to repo `.pi/models.json`; currently only `providers.opencode-go.compat.sendSessionAffinityHeaders` |
| `models-store.json` | Cached provider catalogs | Six providers: `openai-codex` (7), `deepseek` (2), `minimax` (3), `xiaomi` (6), `opencode-go` (19), `opencode` (59). Each model row carries `id`, `api`, `baseUrl`, `provider`, `reasoning`, cost/context fields |
| `auth.json` | Credential store | Five keys matching authenticated providers. `openai-codex` is OAuth (`type`, `access`, `refresh`, `expires`, `accountId`). The others are API-key (`type`, `key`) |

[SOURCE: ~/.pi/agent/ directory listing 2026-08-17] [SOURCE: .pi/PLUGINS.md:52-67] [SOURCE: .pi/models.json]

`models-store.json` is auto-refreshed from each provider gateway and is not a durable edit target. [SOURCE: .pi/PLUGINS.md:52-55]

### F3. Custom providers appear in `/model` only after auth is configured
A `models.json` provider needs `baseUrl` plus `api` (`openai-completions` | `openai-responses` | `anthropic-messages` | `google-generative-ai`) and a `models[]` list. `apiKey` may be omitted if `/login`/`auth.json` or `--api-key` supplies auth. **If no auth is configured, the models load but stay unavailable in `/model` and `--list-models`.** Dummy keys are used for keyless local servers because Pi still treats picker visibility as auth-gated. [SOURCE: https://pi.dev/docs/latest/models] [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/models.md]

Credential resolution order is: CLI `--api-key` → `auth.json` → environment variable → `models.json` keys. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/providers.md:310-317]

### F4. Two legal adapter hooks exist; neither is Cursor/Devin-shaped today
1. **`models.json` overlay** — enough for any HTTP API that already speaks one of the four supported APIs. This is how local Ollama/vLLM/LM Studio and this repo's `opencode-go` compat overlay work.
2. **`pi.registerProvider()` extension** — required when the vendor needs a custom OAuth/SSO login, token refresh, filtering, or non-standard streaming. OAuth registrations appear in `/login <provider-id>` and store `{refresh, access, expires}` in `auth.json`. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:1-91] [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:286-350]

Built-in **subscription** `/login` providers are ChatGPT Plus/Pro (Codex), Claude Pro/Max, GitHub Copilot, xAI, OpenRouter, and Radius. Cursor and Devin are absent from that list and from the live `models-store.json` blob (no `cursor`, `devin`, `cognition`, or `api2.cursor` strings). [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/providers.md:15-56]

### F5. Live catalog APIs are HTTP LLM APIs, not sibling-CLI wrappers
Sample first-model rows (ids and endpoints only):

- `openai-codex` / `gpt-5.3-codex-spark` → `api=openai-codex-responses`, `baseUrl=https://chatgpt.com/backend-api`
- `opencode-go` / `deepseek-v4-flash` → `api=openai-completions`, `baseUrl=https://opencode.ai/zen/go/v1`
- `deepseek` / `deepseek-v4-flash` → `api=openai-completions`, `baseUrl=https://api.deepseek.com`

Pi's picker therefore expects a **provider HTTP API**, not a subprocess that shells out to `cursor-agent` or `devin`. A sibling-CLI front would have to impersonate one of those HTTP APIs (gateway path) or teach Pi a new provider implementation (extension path). [SOURCE: ~/.pi/agent/models-store.json redacted first-row fields]

### F6. Auth-check types already distinguish oauth vs api_key
Installed `dist/cli/auth-check.d.ts` exposes `AuthCheckResult.authType?: "api_key" | "oauth"` and reasons `provider_not_found` | `credentials_not_configured` | `credential_not_available` | `invalid_state`. That matches the live `auth.json` split (Codex OAuth vs API-key providers) and is the gate `--list-models` uses. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli/auth-check.d.ts:1-18]

## Questions Answered
- Q1 (partial): Pi's picker is `/model`; roster = built-in catalogs + `models-store.json` cache + `models.json` overlay + extension `registerProvider`, filtered by `auth.json`/env/`--api-key`. Cursor and Devin are not in the built-in or live catalogs.

## Questions Remaining
- Q2 Cursor auth reuse / ToS
- Q3 Devin auth reuse / ToS
- Q4 Local OpenAI-compatible gateway in front of vendor CLIs
- Q5 Ranked verdict
- Follow-up: exact HTTP contract of `api2.cursor.sh` vs Pi's four API types (iteration 2)

## Dead Ends
- Searching `models-store.json` and `providers.md` for a built-in Cursor or Devin provider: none.

## Ruled Out
- **Built-in Pi Cursor/Devin provider already exists.** Evidence: providers.md subscription list and live store have neither vendor. Do not spend another iteration hunting a hidden built-in id.

## Reflection
What worked: reading the installed package docs plus redacted live `~/.pi/agent` schemas. What failed: treating the user phrase `/models` as the literal slash command (it is `/model`). Negative knowledge: Pi will not show a custom provider in the picker until some auth material exists for that provider id.

## Assessment
- newInfoRatio: 1.00
- Novelty justification: First iteration; picker files, auth shapes, supported APIs, and the absence of Cursor/Devin in Pi's catalog were all new to this packet.
- Confidence: high on picker/file/API facts (installed docs + live files); medium on "gateway must impersonate HTTP" until Cursor/Devin API surfaces are read.

## Recommended Next Focus
Cursor (`cursor-agent`) auth token stores, `--api-key`/`CURSOR_API_KEY`, `https://api2.cursor.sh`, and whether that HTTP surface is a documented OpenAI-compatible completions API that a Pi `models.json` provider could call — versus a private agent protocol that would force an extension or a CLI gateway.

## SCOPE VIOLATIONS
None.
