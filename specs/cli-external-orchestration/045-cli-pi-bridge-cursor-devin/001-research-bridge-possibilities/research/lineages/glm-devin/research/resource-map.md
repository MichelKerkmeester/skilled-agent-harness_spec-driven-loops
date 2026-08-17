---
title: "Resource Map — Pi Native Bridge to Cursor & Devin CLI Models"
lineage: glm-devin
created: 2026-08-17T14:38:10Z
---

# Resource Map

## CLI Surfaces (live, on operator machine)

| CLI | Version | Auth | Config dir | Key files |
|-----|---------|------|------------|-----------|
| `pi` | 0.84.2 | OAuth + API key | `~/.pi/agent/` | `auth.json`, `models-store.json`, `models.json` (symlink → repo `.pi/models.json`) |
| `cursor-agent` | 2026.08.11-e8db854 (Pro) | OAuth (`cursor-agent login`) or `CURSOR_API_KEY` | `~/.cursor/` | `cli-config.json` (identity/model prefs; no tokens) |
| `devin` | 3000.4.25 (Pro) | OAuth only (`devin auth login`) | `~/.local/share/devin/` | `credentials.toml` (`windsurf_api_key` + server URLs) |

## API Endpoints

| Vendor | Endpoint | Type | Public? |
|--------|----------|------|---------|
| Cursor | `https://api2.cursor.sh` | Private Connect-RPC/protobuf agent backend | No (official clients only) |
| Cursor | `https://api.cursor.com/v1/agents` | Cloud Agents REST (harness) | Yes (official) |
| Devin | `https://server.codeium.com` | Private CLI API server | No (official CLI only) |
| Devin | `https://api.devin.ai/v3/organizations/*` | Session REST (`POST .../sessions`) | Yes (service-user `cog_` keys or PAT) |
| Devin | `https://api.devin.ai/v3/enterprise/*` | Enterprise REST | Yes (enterprise) |

## Pi Provider Hooks

| Hook | Form | Requires | Use for |
|------|------|----------|---------|
| `models.json` overlay | `~/.pi/agent/models.json` | `baseUrl` + `api` (one of 9 types) + `models[]` + optional `apiKey` | HTTP endpoints speaking a supported API |
| `pi.registerProvider()` full | `createProvider()` in extension | Provider object with auth/models/api/streamSimple | Custom OAuth, custom streaming, dynamic discovery |
| `pi.registerProvider()` legacy | `pi.registerProvider(id, config)` | Config object | Override existing provider or add new with models |

### Pi Supported `api` Types
`anthropic-messages`, `openai-completions`, `openai-responses`, `azure-openai-responses`, `openai-codex-responses`, `mistral-conversations`, `google-generative-ai`, `google-vertex`, `bedrock-converse-stream`

### Pi `apiKey` Config Syntax
`!command` (shell execution), `$ENV_VAR` / `${ENV_VAR}` (env interpolation), `$$` (literal `$`), `$!` (literal `!`)

## ToS Documents (verified first-hand)

| Vendor | URL | Last updated | Key section |
|--------|-----|--------------|-------------|
| Cursor | `https://cursor.com/terms-of-service` | Aug 13, 2026 | §1.5 Use Restrictions |
| Cognition | `https://cognition.com/legal/platform-terms-of-service` | Jun 30, 2026 | §2.3 Restrictions, §2.4 Suspension |

## Staff Rulings

| Vendor | Source | Ruling |
|--------|--------|--------|
| Cursor | `https://forum.cursor.com/t/.../167778` (deanrie, Aug 10 & 16, 2026) | Oh My Pi `cursor` provider + local proxies violate §1.5; account ban risk; local-only does not help; supported paths are CLI/SDK/Cloud Agents (all run harness) |
| Cognition | (no Pi-named staff letter found) | Structural analog: `windsurf_api_key` vs `server.codeium.com` maps onto §2.3(ii) |

## Community Proxy Projects

| Project | Stars | Architecture | ToS class |
|---------|-------|--------------|-----------|
| `tageecc/cursor-agent-api-proxy` | 52 | CLI-spawn (fronts official `cursor-agent`) | Ambiguous |
| `timxx/Cursor-To-OpenAI` | 1 | Reverse-engineered (private protobuf backend) | Blocked (§1.5) |

## Repo Skills (existing executor dispatch)

| Skill | Path | Scope |
|-------|------|-------|
| `cli-cursor` | `.opencode/skills/cli-external-orchestration/cli-cursor/` | 21-id enforced allowlist; `auto` excluded; shell-out to `cursor-agent` |
| `cli-devin` | `.opencode/skills/cli-external-orchestration/cli-devin/` | 6 curated families; shell-out to `devin` |
| `cli-pi` | `.opencode/skills/cli-external-orchestration/cli-pi/` | Pi CLI reference (passthrough; no Cursor/Devin provider) |

## Open Feature Requests (unblock conditions)

| # | Request | Vendor | Current status |
|---|---------|--------|----------------|
| 1 | Public OpenAI-compatible `/v1/chat/completions` | Cursor | Open feature request (no timeline) |
| 2 | Raw-completions surface (or consumer `cog_` keys) | Devin | Not available; v3 is session REST |
| 3 | CLI-spawn gateway ToS clarification | Cursor | Unresolved by staff letter |

## Residual UNKNOWNs

- Cursor token persistence location (keychain vs Chromium) — not dumped
- Whether consumer Devin Pro can mint v3 `cog_` service-user keys
- Whether Cursor staff would explicitly bless CLI-spawn gateways
