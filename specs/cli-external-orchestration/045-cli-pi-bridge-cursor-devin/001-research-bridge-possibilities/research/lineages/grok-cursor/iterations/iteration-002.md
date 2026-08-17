# Iteration 2: Cursor auth stores, api2.cursor.sh, and ToS boundary

## Focus
Whether Cursor subscription auth can be reused by a Pi adapter or third-party client, grounded in `cursor-agent` surfaces, token stores, and Anysphere's own ToS plus staff policy.

## Actions Taken
- Inspected live `cursor-agent` 2026.08.11-e8db854 help, `about`, and redacted `~/.cursor/cli-config.json` / `agent-cli-state.json` key schemas (no secret values copied).
- Read `cli-cursor` auth/reference docs and the unauthenticated-error contract that names `--api-key`/`--auth-token` and `CURSOR_API_KEY`/`CURSOR_AUTH_TOKEN`.
- Fetched Cursor Terms of Service §1.5 and official CLI overview.
- Fetched the 2026-08-10 Cursor staff reply on using Oh My Pi's Cursor provider or a local OpenAI-compatible proxy to private endpoints.

## Findings

### F7. Two distinct Cursor auth materials, two distinct backends
`cursor-agent login` is browser OAuth. Headless auth is `CURSOR_API_KEY` / `--api-key` (User API Keys from Settings → Integrations). The unauthenticated CLI error also names `--auth-token` / `CURSOR_AUTH_TOKEN`. Default HTTP endpoint is `https://api2.cursor.sh` (`--endpoint` / `CURSOR_API_ENDPOINT`). [SOURCE: .opencode/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md:72-90] [SOURCE: cursor-agent --help 2026.08.11-e8db854]

A forum thread distinguishes **User API Keys** that work against the public Cloud Agents REST host `https://api.cursor.com` (`GET /v0/me`) from CLI login state against `api2.cursor.sh`. Admin API keys do not work with the CLI. [SOURCE: https://forum.cursor.com/t/cursor-cli-uses-integrations-user-api-keys-for-command-line-failed/153337]

### F8. `~/.cursor/cli-config.json` holds account metadata, not the OAuth secret
Redacted schema: `authInfo.{email,displayName,userId,authId}`, model selection, sandbox/approval, and a `serverConfigCache` with `backendUrl` plus `agentUrlConfig.agentUrl`. `agent-cli-state.json` is UI-tip flags only. No access-token or refresh-token fields sit in these JSON files. Chromium `Local Storage` / `Trust Tokens` exist under `~/Library/Application Support/Cursor/` but were not opened. Exact OS-keychain / IndexedDB token path: UNKNOWN without dumping secrets. [SOURCE: ~/.cursor/cli-config.json keys 2026-08-17] [SOURCE: ~/.cursor/agent-cli-state.json]

Live `cursor-agent about` on this machine: CLI 2026.08.11-e8db854, Subscription Tier Pro, User Email present. [SOURCE: cursor-agent about 2026-08-17]

### F9. Official out-of-IDE surfaces always run the agent harness, not a raw model
Cursor CLI overview documents interactive `agent`, print `-p`, plan/ask modes, and Cloud Agent handoff. The public SDK skill documents `Agent` → `Run` over local or cloud runtimes and REST `/v1/agents`. There is no documented OpenAI `POST /v1/chat/completions` for subscription models. An open feature request exists for exactly that. [SOURCE: https://cursor.com/docs/cli/overview] [SOURCE: ~/.cursor/skills-cursor/sdk/SKILL.md:1-26] [SOURCE: https://forum.cursor.com/t/openai-compatible-v1-chat-completions-for-cloud-api/164522]

### F10. Staff: pointing Pi (or any local OpenAI proxy) at private Cursor endpoints is a ToS §1.5 violation
On 2026-08-10 Cursor staff (deanrie) answered a question that is this packet's Q2 almost verbatim:

- Oh My Pi's `cursor` provider authenticates with the operator access token and calls **private, non-public client endpoints**. That is reverse engineering / accessing the internal structure of the Service under ToS §1.5. omp is not an authorized client. Abuse enforcement can include **account ban**.
- A personal, local-only OpenAI-compatible bridge to those same endpoints is **the same case**. Who else uses the proxy does not matter.
- Supported out-of-IDE paths: `cursor-agent`, Agent SDK/headless, public Cloud Agents API. **All of them always run the Cursor agent harness; they do not give a raw model.** No public `/v1/chat/completions` exists.

[SOURCE: https://forum.cursor.com/t/does-using-oh-my-pi-s-cursor-provider-or-an-openai-compatible-proxy-to-the-same-endpoints-violate-cursor-s-tos/167778] [SOURCE: https://cursor.com/terms-of-service §1.5]

ToS §1.5(i) forbids reverse engineering or otherwise attempting to derive or gain access to the underlying structure of the Service; (vi) probing; (viii) harvesting/extracting data; (xi) knowingly permitting a third party to do the foregoing. [SOURCE: https://cursor.com/terms-of-service]

### F11. Implication for the three bridge paths (Cursor side)
| Path | Technical | Account-safety |
|------|-----------|----------------|
| Reuse OAuth/access token inside a Pi `models.json` or `registerProvider` pointed at `api2.cursor.sh` | Technically what Oh My Pi already ships | **ToS-blocked** per staff; ban risk |
| Pi custom provider calling public Cloud Agents API (`api.cursor.com` / `/v1/agents`) with a User API Key | Possible only with a custom streaming adapter; still a harness, not raw Composer/Grok | Official API, but **not** a drop-in OpenAI completions provider for `/model` |
| Front `cursor-agent` itself (subprocess) with a local OpenAI gateway | Feasible as a CLI wrapper; high latency; harness semantics | Staff-endorsed client is `cursor-agent`, but translating it into raw `/v1/chat/completions` still does not expose a raw model and is a poor `/model` citizen |

A Pi `models.json` `openai-completions` row with `baseUrl: https://api2.cursor.sh` is the banned Oh My Pi pattern, not a clever adapter.

## Questions Answered
- Q2 (Cursor): Reusing Cursor subscription OAuth/access tokens, or a local OpenAI-compatible proxy to private client endpoints, is **not ToS-safe**. Official User API keys work with `cursor-agent` / SDK / Cloud Agents API, which run the harness and do not expose a raw model Pi can list as a normal `/model` completion provider.

## Questions Remaining
- Q3 Devin auth reuse / ToS
- Q4 Gateway fronting (now scoped: CLI-wrapper vs private-endpoint proxy; Cursor private-endpoint proxy is ruled out)
- Q5 Ranked verdict
- Follow-up: Devin public API vs CLI-only OAuth

## Dead Ends
- Finding a raw OpenAI-compatible Cursor chat endpoint: feature request, not shipped.
- Finding the OAuth secret in `cli-config.json`: not stored there.

## Ruled Out
- **Pi `models.json` / Oh My Pi-style Cursor provider using login tokens against api2.cursor.sh.** Staff: ToS §1.5, ban risk. Do not prototype this.
- **Local OpenAI-compatible proxy to the same private Cursor endpoints.** Staff: same case as Oh My Pi.

## Reflection
What worked: the Oh My Pi forum thread is the closest prior art to this packet; staff answered the exact design. What failed: expecting `~/.cursor/*.json` to hold the bearer token. Negative knowledge: "personal/local-only" does not sanitize private-endpoint reuse.

## Assessment
- newInfoRatio: 0.85
- Novelty justification: ToS §1.5 staff ruling, the api.cursor.com vs api2.cursor.sh split, harness-only official APIs, and the absence of tokens in cli-config.json are new; picker-hook implications reuse iteration 1.
- Confidence: high on policy for private-endpoint reuse (staff + ToS text). Medium on Cloud Agents API as a Pi custom streaming provider (not yet read in depth).

## Recommended Next Focus
Devin CLI auth: `devin auth login`, `~/.local/share/devin/credentials.toml` schema (keys only), `https://api.devin.ai` vs `https://server.codeium.com`, whether Devin documents a public OpenAI-compatible model API, and Devin ToS/account-safety for third-party clients.

## SCOPE VIOLATIONS
None.
