# Iteration 3: Devin OAuth, credentials.toml, session REST, ACP, and Cognition ToS

## Focus
Devin (`devin`) authentication surfaces, `~/.local/share/devin/credentials.toml`, the `server.codeium.com` vs `api.devin.ai` split, the Devin v3 session REST API, `devin acp`, and the Cognition Platform ToS — the Devin analog of iteration 2.

## Actions Taken
- Ran `devin auth status`, `devin version`, `devin models list`, and `devin acp --help` on the operator machine (no secret values copied).
- Enumerated `~/.local/share/devin/credentials.toml` keys (keys only; values redacted).
- Read `cli-devin/references/cli-reference.md` (auth, flags, config, ACP, subcommands).
- Fetched `https://cognition.com/legal/platform-terms-of-service` (last updated June 30, 2026) and read §2.3 Use Restrictions and §2.4 Suspension first-hand.
- Fetched `https://cognitionai.mintlify.app/api-reference/overview` for the Devin v3 API shape.

## Findings

### F1. Live devin is Pro, OAuth-only, backed by server.codeium.com
`devin auth status` reports: Logged in (via Devin); credentials file `~/.local/share/devin/credentials.toml`; API server **`https://server.codeium.com`**; Devin webapp `https://app.devin.ai`; Devin API **`https://api.devin.ai`**. User: Michel Kerkmeester, Tier **Devin Pro**, Enterprise: **no**, Telemetry: disabled (zero-data-retention). `devin version` = `3000.4.25 (7e8e528a)`. Consumer CLI auth is **OAuth only** (`devin auth login`); there is no `--api-key` flag analogous to Cursor's `CURSOR_API_KEY`. SSH/remote uses `devin auth login --force-manual-token-flow`. [SOURCE: devin auth status output 2026-08-17] [SOURCE: .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:72-103]

### F2. credentials.toml holds windsurf_api_key against server.codeium.com
`~/.local/share/devin/credentials.toml` (keys only, values redacted) contains exactly four keys: **`windsurf_api_key`**, `api_server_url`, `devin_webapp_host`, `devin_api_url`. The `windsurf_api_key` name reflects Devin's Windsurf/Codeium heritage; the file pins the API server to `server.codeium.com`. The docs state the token is persistent and copyable between the operator's **own machines**, but anyone with the file authenticates as the account owner. `~/.config/devin/config.json` holds `agent.model`, `permissions`, and `mcpServers` — not the token. [SOURCE: ~/.local/share/devin/credentials.toml key enumeration 2026-08-17] [SOURCE: .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:383-425]

### F3. api.devin.ai v3 is session REST, not OpenAI chat completions
The Devin public API (verified first-hand) is organized into two scopes: Organization API at `https://api.devin.ai/v3/organizations/*` and Enterprise API at `https://api.devin.ai/v3/enterprise/*`. Authentication uses **service-user credentials with a `cog_` prefix** (teams/enterprise) or a Personal Access Token. The primary operation is `POST .../sessions` — it **creates a Devin agent session** (`{ "prompt": "..." }`), not an OpenAI-shaped `POST /v1/chat/completions` with a streamed chat response. v1/v2 legacy APIs are in deprecation. [SOURCE: https://cognitionai.mintlify.app/api-reference/overview]

### F4. devin acp is ACP JSON-RPC over stdio, not an HTTP completions API
`devin acp` runs Devin as an **ACP (Agent Client Protocol) server over stdio**. Options: `--agent-type` (`summarizer` | `review`) and `--model` (fuzzy name like `/model`). It is the vendor-intended editor-integration protocol (analogous to how an editor talks to an agent backend), not an HTTP LLM API. Pi custom providers are HTTP (OpenAI/Anthropic/Google) or `streamSimple` subprocess streams — Pi is not an ACP host. [SOURCE: devin acp --help output 2026-08-17] [SOURCE: .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:560]

### F5. Cognition Platform ToS §2.3 Use Restrictions (verified first-hand)
`https://cognition.com/legal/platform-terms-of-service` (last updated June 30, 2026), §2.3 prohibits: (i) copy, reproduce, modify, translate, or create derivative works of the Services or Documentation; (ii) **reverse engineer, disassemble, decompile, decode, adapt, or otherwise attempt to derive or gain access to any software component of the Services**; (iii) use the Services to create or develop any competing products or services, including to train competing AI models; (iv) **make the Services or Documentation available to anyone other than Authorized Users**. §2.4 reserves suspension for security risk, fraudulent/illegal use, or risk of harm to other customers. [SOURCE: https://cognition.com/legal/platform-terms-of-service §2.3-2.4]

### F6. No Pi-named staff letter, but the analogical ToS risk is high
Unlike Cursor, no Cognition staff forum letter was found that names Pi or a Pi-style provider specifically. However, the structural facts map closely onto Cursor's blocked case: `credentials.toml`'s `windsurf_api_key` authenticates against the **private `server.codeium.com` backend** (the CLI's own API server, not a documented public completions endpoint). Feeding that key into a Pi `models.json` HTTP provider against `server.codeium.com` would be (a) reverse-engineering/deriving access to a software component of the Service (§2.3(ii)), and (b) using a non-official client to access the Service outside its granted scope (§2.3 — "purposes beyond the scope of the access granted"). The `credentials.toml` file is the full account credential, so copying it into Pi artifacts or a shared gateway is also a §2.3(iv) exposure risk. [SOURCE: https://cognition.com/legal/platform-terms-of-service §2.3] [SOURCE: devin auth status output 2026-08-17]

### F7. Devin exposes 40 model families through its own CLI, not through Pi
`devin models list` reports 40 model families (Claude Opus 5, Fable 5, Sonnet 5, Gemini 3.7 Flash, GPT-5.6 Sol, Grok, SWE-1.7, etc.) with per-model context/cost. These are reachable via `devin --model <alias>` or `/model` inside the Devin REPL — not via any OpenAI-compatible HTTP endpoint that Pi could call. The repo's `cli-devin` skill curates six families in scope; Devin's native Adaptive router and full 37+ family roster are out of that skill's curated scope. [SOURCE: devin models list output 2026-08-17] [SOURCE: .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:181-208]

## Questions Answered
- Q3 (full): Devin OAuth cannot be safely reused by a Pi adapter or gateway. `credentials.toml`'s `windsurf_api_key` targets the private `server.codeium.com` backend; feeding it to Pi as HTTP is a §2.3(ii) reverse-engineering analog with high account-suspension risk (§2.4). The public `api.devin.ai` v3 API is session REST (`POST .../sessions`), not OpenAI chat completions. `devin acp` is stdio JSON-RPC, not an HTTP LLM API. No Pi-named staff letter exists, but the structural ToS mapping is strong.

## Questions Remaining
- Q4 Local OpenAI-compatible gateway in front of vendor CLIs
- Q5 Ranked verdict
- Follow-up: whether consumer Devin Pro can mint v3 `cog_` service-user keys (UNKNOWN)

## Dead Ends
- Expecting a consumer `devin --api-key` flag analogous to Cursor: consumer CLI is OAuth-only.
- Hoping `api.devin.ai` was an OpenAI-compatible `baseUrl`: it is session REST.

## Ruled Out
- **Pi provider copying `credentials.toml` `windsurf_api_key` to `server.codeium.com`.** Evidence: Cognition ToS §2.3(ii) analog; not an authorized HTTP client; the file is the full account credential.
- **Treating `api.devin.ai` as an `openai-completions` `baseUrl`.** Evidence: v3 is session REST (`POST .../sessions`), not chat completions.

## Reflection
What worked: first-hand fetch of Cognition ToS §2.3 and the Devin API overview gave a verifiable restrictions citation and confirmed the session-REST shape. What failed: expecting a consumer `--api-key` surface. Negative knowledge: `credentials.toml` is the full account — copying it anywhere is both a ToS and a credential-exposure risk, independent of the reverse-engineering angle.

## Assessment
- newInfoRatio: 0.80
- Novelty justification: The live `windsurf_api_key` schema, the `server.codeium.com` private backend, the v3 session-REST shape, the `devin acp` stdio contract, the Cognition §2.3 text, and the 40-family Devin roster were all new to this packet.
- Confidence: high on credential keys, auth-status, API shape, and ToS text (first-hand); medium on the analogical ToS conclusion (no Pi-named staff letter); UNKNOWN on consumer `cog_` key minting.

## Recommended Next Focus
Iteration 4: the local OpenAI-compatible gateway path — whether a localhost gateway fronting the **official CLIs** (`cursor-agent -p`, `devin -p` / `devin acp`) is a distinct, ToS-safer case from the private-endpoint proxies already ruled out, and what the nested-harness consequences are for Pi's tool loop.

## SCOPE VIOLATIONS
None.
