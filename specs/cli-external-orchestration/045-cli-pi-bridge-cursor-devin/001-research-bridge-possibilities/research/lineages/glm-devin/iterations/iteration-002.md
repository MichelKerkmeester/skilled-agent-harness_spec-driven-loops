# Iteration 2: Cursor auth stores, api2.cursor.sh, and ToS boundaries

## Focus
Cursor (`cursor-agent`) authentication surfaces, the `~/.cursor/cli-config.json` schema, the `api2.cursor.sh` HTTP contract, and whether Cursor subscription auth can be reused by a Pi adapter or third-party HTTP client without violating ToS or account safety.

## Actions Taken
- Ran `cursor-agent about` on the operator machine (version, tier, model, email — no secrets).
- Enumerated `~/.cursor/cli-config.json` keys (keys only; no credential values copied).
- Read `cli-cursor/references/cli-reference.md` (auth, flags, endpoints, env vars) and `cli-cursor/references/providers-and-models.md` (enforced allowlist).
- Fetched `https://cursor.com/terms-of-service` (last updated August 13, 2026) and read §1.5 Use Restrictions first-hand.
- Fetched the Cursor community forum thread on Oh My Pi / local OpenAI proxies and read the staff reply (deanrie, August 10 and August 16, 2026).

## Findings

### F1. Live cursor-agent is Pro, on a recent build, authenticated via OAuth
`cursor-agent about` reports: CLI Version `2026.08.11-e8db854`, Subscription Tier `Pro`, Model `Cursor Grok 4.6 Extra High`, User Email `mkerkmeester@proton.me`. Auth is `cursor-agent login` (browser OAuth). Headless auth is `CURSOR_API_KEY` env or `--api-key <key>` (User API Keys). Error text also names `--auth-token` / `CURSOR_AUTH_TOKEN`. Default endpoint is **`https://api2.cursor.sh`**; the distinct public Cloud Agents host is **`https://api.cursor.com`**. Endpoint override via `--endpoint` / `CURSOR_API_ENDPOINT`; custom headers via `-H` / `--header`. [SOURCE: cursor-agent about output 2026-08-17] [SOURCE: .opencode/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md:72-91]

### F2. cli-config.json holds identity and model prefs, not OAuth tokens
`~/.cursor/cli-config.json` (keys only, values redacted) contains: `permissions` (allow/deny), `version`, `editor` (vimMode), `display` (showLineNumbers, showThinkingBlocks, showStatusIndicators, mode, notifications, hints), `model` (modelId, displayModelId, displayName, displayNameShort, aliases, maxMode), `hasChangedDefaultModel`, `maxMode`, and `modelParameters` (subkeys: `default`, `grok-4.5`, `composer-2.5`, `glm-5.2`). **There are no access/refresh token fields in cli-config.json.** Token persistence (keychain / Chromium secret store) was left UNKNOWN and was deliberately not dumped. [SOURCE: ~/.cursor/cli-config.json key enumeration 2026-08-17]

### F3. No public OpenAI-compatible /v1/chat/completions for subscription models
Cursor's official out-of-IDE surfaces — `cursor-agent` CLI, Agent SDK / headless, and the public Cloud Agents API (`https://api.cursor.com/v1/agents`) — **always run the Cursor agent harness**. There is no public `POST /v1/chat/completions` endpoint that a third-party harness can point at for subscription models. The staff reply confirms this is an open feature request, not a shipped product. [SOURCE: https://forum.cursor.com/t/.../167778 staff reply deanrie] [SOURCE: .opencode/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md:252-260]

### F4. ToS §1.5 Use Restrictions (verified first-hand)
`https://cursor.com/terms-of-service` (last updated August 13, 2026), §1.5 prohibits, among others: (i) reverse engineer, disassemble, decompile, decode, or otherwise attempt to derive or gain access to the source code, object code or **underlying structure of the Service**; (vi) probe, scan or attempt to penetrate the Service; (viii) harvest, scrape, or extract data from the Service; (iii) rent, lease, lend, or sell the Service; (xi) knowingly permit any third party to do any of the foregoing. [SOURCE: https://cursor.com/terms-of-service §1.5]

### F5. Staff ruling: Oh My Pi Cursor provider and local proxies violate §1.5; ban risk
Cursor staff (deanrie, August 10 and August 16, 2026) stated on the record:
- Oh My Pi's `cursor` provider is "in the same category as an unofficial proxy" — it authenticates with the access token and calls **private, non-public client endpoints**, going against §1.5 (reverse engineering / accessing the internal structure). omp is not affiliated with Cursor and is not an authorized client. Using the subscription outside official clients can trigger abuse enforcement, **up to and including an account ban**.
- A **"personal, local-only"** proxy does **not** change the analysis: "The issue isn't who else uses the proxy. It's the fact of calling private endpoints outside official clients."
- The supported out-of-IDE paths are the CLI, Agent SDK/headless, and Cloud Agents API — all run the agent harness, not a raw model.

[SOURCE: https://forum.cursor.com/t/does-using-oh-my-pi-s-cursor-provider-or-an-openai-compatible-proxy-to-the-same-endpoints-violate-cursor-s-tos/167778]

### F6. The repo's cli-cursor skill already fail-closes to a 21-id allowlist
This repo's `cli-cursor` dispatch is scoped to exactly 21 enforced ids (Composer, GLM 5.2, Grok 4.5/4.6, GPT-5.6 Luna Max, Gemini 3.7 Flash High). Cursor's own `auto` router is deliberately excluded because it can silently resolve to an off-list model. The live `cursor-agent --list-models` roster spans 150+ ids. A Pi overlay that advertised the full live roster would fight this repo's allowlist policy. [SOURCE: .opencode/skills/cli-external-orchestration/cli-cursor/references/providers-and-models.md:43-73]

### F7. api2.cursor.sh is a private agent protocol, not one of Pi's nine API types
Pi's supported `api` types are `openai-completions`, `openai-responses`, `anthropic-messages`, `google-generative-ai`, `openai-codex-responses`, `azure-openai-responses`, `mistral-conversations`, `google-vertex`, `bedrock-converse-stream`. Cursor's `api2.cursor.sh` is a private Connect-RPC/protobuf agent backend (per the forum thread's description of the same endpoints), not an OpenAI-compatible completions API. A Pi `models.json` provider pointing `baseUrl` at `api2.cursor.sh` with `api: "openai-completions"` would not speak the right protocol; a `registerProvider` with `streamSimple` would have to reverse-engineer the private protocol — the exact §1.5 violation. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:219-261] [SOURCE: https://forum.cursor.com/t/.../167778]

## Questions Answered
- Q2 (full): Cursor subscription auth cannot be safely reused by a Pi adapter or third-party HTTP client. Token reuse against `api2.cursor.sh` is ToS-blocked (staff ruling, §1.5, account-ban risk); personal/local-only does not help. Official out-of-IDE surfaces (CLI, SDK, Cloud Agents API) always run the agent harness, not raw completions. `cli-config.json` does not even hold the OAuth tokens, so a "copy the token" adapter would have to extract them from the keychain/Chromium store first.

## Questions Remaining
- Q3 Devin auth reuse / ToS
- Q4 Local OpenAI-compatible gateway in front of vendor CLIs
- Q5 Ranked verdict
- Follow-up: whether a CLI-spawn gateway (fronting `cursor-agent -p`, not private endpoints) is a distinct case (iteration 4)

## Dead Ends
- Expecting `~/.cursor/cli-config.json` to hold the OAuth bearer token: it holds identity/model prefs only.

## Ruled Out
- **Pi `models.json` / Oh My Pi-style Cursor provider using login/access tokens against `api2.cursor.sh`.** Evidence: staff ToS §1.5 ruling; account-ban risk; personal/local-only does not change the analysis.
- **Local OpenAI-compatible proxy to private Cursor client endpoints.** Evidence: staff — same case as Oh My Pi.

## Reflection
What worked: fetching the Cursor ToS and the staff forum thread first-hand gave a verifiable §1.5 citation and an explicit staff ruling, not a paraphrase. What failed: expecting `cli-config.json` to be the token store. Negative knowledge: there is no public raw-completions endpoint for Cursor subscription models, so any "native `/model` Cursor row" is either a harness wrapper or a ToS violation.

## Assessment
- newInfoRatio: 0.85
- Novelty justification: The staff ruling, the §1.5 text, the `cli-config.json` schema (modelParameters for grok-4.5/composer-2.5/glm-5.2), the api2.cursor.sh-vs-Pi-API-types mismatch, and the absence of a public completions endpoint were all new to this packet.
- Confidence: high on ToS/staff ruling (first-hand fetch) and cli-config schema (live keys); medium on the exact private-protocol shape (forum description, not packet-captured).

## Recommended Next Focus
Devin (`devin`) OAuth, `~/.local/share/devin/credentials.toml`, `server.codeium.com` vs `api.devin.ai`, the Devin v3 session REST API, `devin acp`, and the Cognition Platform ToS — the Devin analog of this iteration.

## SCOPE VIOLATIONS
None.
