# Iteration 3: Devin CLI auth, credentials.toml, and public API shape

## Focus
Whether Devin OAuth / `credentials.toml` can be reused by a Pi adapter or gateway, and how that compares to Cognition's documented REST and ACP surfaces.

## Actions Taken
- Inspected live `devin` 3000.4.25: `auth status`, redacted `~/.local/share/devin/credentials.toml` keys, and `~/.config/devin/config.json` key schema.
- Read `cli-devin` auth reference and providers catalog.
- Fetched official CLI commands, enterprise auth docs, Devin API overview, and Cognition Platform Terms §2.3.

## Findings

### F12. Live CLI auth is a Windsurf-heritage key file, not a documented OpenAI key
`devin auth status` on this Pro account: logged in via Devin; credentials file `~/.local/share/devin/credentials.toml`; API server `https://server.codeium.com`; webapp `https://app.devin.ai`; Devin API `https://api.devin.ai`. Account: Devin Pro, Enterprise: no, 189 allowed models. [SOURCE: `devin auth status` 2026-08-17]

Redacted `credentials.toml` keys (values not copied): `windsurf_api_key` (189-char secret), `api_server_url` (URL), `devin_webapp_host`, `devin_api_url` (URL). The secret field name is Windsurf/Codeium heritage, matching the Codeium API server host. `~/.config/devin/config.json` holds `devin.org_id`, `agent.model`, theme/shell flags — not the token. [SOURCE: ~/.local/share/devin/credentials.toml keys] [SOURCE: ~/.config/devin/config.json keys]

cli-devin documents OAuth-only login (`devin auth login`, optional `--force-manual-token-flow`) and explicitly "does not use an API key" for the consumer CLI path. [SOURCE: .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:72-102]

### F13. Official docs treat `credentials.toml` as a full-account secret
Cognition's CLI auth page: after login the CLI stores a persistent API token in `credentials.toml`; it does not expire by default; you may copy the file between **your own machines**; anyone with the file can authenticate as you; do not share or commit it. [SOURCE: https://docs.devin.ai/cli/enterprise/devin-auth]

That is a license to move the file among the operator's devices, not a license to feed it into a third-party harness.

### F14. Public Devin API is session REST, not OpenAI chat completions
API overview: org scope `https://api.devin.ai/v3/organizations/*` (sessions, knowledge, playbooks, secrets) and enterprise `.../v3/enterprise/*`. Auth is service-user `cog_` keys (teams/enterprise). Creating work is `POST .../sessions` with a prompt — an agent session, not `POST /v1/chat/completions`. Legacy v1/v2 personal keys are in deprecation. PATs are documented as a user-identity path for the v3 API. [SOURCE: https://cognitionai.mintlify.app/api-reference/overview]

This live Pro account is `Enterprise: no`. Whether a consumer Pro user can mint v3 service-user keys: UNKNOWN from this machine (no dashboard probe). The REST surface that exists is still a Devin **session** API, not a raw model completions API Pi's `openai-completions` adapter can speak.

### F15. Official non-REST integration is ACP, not HTTP OpenAI
`devin acp` runs an Agent Client Protocol server over stdio (JSON-RPC). Credentials come from `WINDSURF_API_KEY` or `devin auth login` storage. Intended for ACP-aware editors (Windsurf, Zed) as a subprocess — not as an OpenAI HTTP server. [SOURCE: https://cli.devin.ai/docs/reference/commands] [SOURCE: `devin acp --help`]

`devin models list` is the live roster dump (family slug / alias / uid), analogous to Cursor's `--list-models`. [SOURCE: `devin models --help`] [SOURCE: .opencode/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md:39-44]

### F16. Cognition ToS blocks reverse-engineering and third-party availability; no Oh My Pi-style staff post was found
Platform Terms §2.3 Use Restrictions: (i) derivative works of the Services; (ii) reverse engineer / gain access to any software component; (iii) use the Services to create competing products or train competing models except with written approval; (iv) make the Services or Documentation available to anyone other than Authorized Users. AUP violations may suspend or terminate access. [SOURCE: https://cognition.com/legal/platform-terms-of-service]

Unlike Cursor, no Cognition staff forum post was found that names "Pi" or "OpenAI-compatible proxy" explicitly. The structural analog is still strong: stuffing `windsurf_api_key` into a Pi `models.json` provider aimed at `server.codeium.com` would be a third-party client talking to a private Codeium/Devin backend — reverse-engineering the client protocol (2.3(ii)) and making the Service available through an unauthorized client (2.3(iv)). Account-safety: treat as high risk, not as a documented ban letter.

Official/safer Devin paths for this research: keep using `devin` / `devin acp` as the authorized client; if a public REST key is issued, call the **session** API (still not a `/model` completions provider).

## Questions Answered
- Q3 (Devin): The CLI stores a persistent `windsurf_api_key` in `credentials.toml` against `server.codeium.com` plus `api.devin.ai`. Reusing that blob inside Pi as an HTTP provider is not a documented, ToS-clean path. Public API is session-oriented REST with separately issued `cog_` keys; ACP is a stdio protocol. No OpenAI-compatible Devin chat endpoint is documented.

## Questions Remaining
- Q4 Local OpenAI-compatible gateway in front of **official CLIs** (not private endpoints) — still open, now with both vendors' harness constraints
- Q5 Ranked verdict
- Follow-up: whether consumer Pro can mint Devin v3 service-user keys (UNKNOWN)

## Dead Ends
- Searching for a Devin `POST /v1/chat/completions` product: not in API overview.
- Finding a Cognition staff ruling as crisp as Cursor's Oh My Pi thread: none found this iteration.

## Ruled Out
- **Pi `models.json` provider that copies `credentials.toml` / `windsurf_api_key` to call `server.codeium.com` as if it were OpenAI.** Undocumented private backend + ToS 2.3(ii)/(iv). Do not prototype.
- **Treating `https://api.devin.ai` as an OpenAI-compatible baseUrl.** Documented calls create Devin sessions, not chat completions.

## Reflection
What worked: live `auth status` + redacted toml keys immediately showed Windsurf/Codeium heritage (`windsurf_api_key`, `server.codeium.com`). What failed: expecting a consumer API key flag on `devin` like Cursor's `--api-key`. Negative knowledge: "copy credentials.toml between your machines" is not permission to share it with Pi.

## Assessment
- newInfoRatio: 0.80
- Novelty justification: Live credentials.toml schema, Codeium backend host, session REST vs ACP, and Cognition §2.3 mapping are new; the "no raw completions API" conclusion parallels Cursor but on different hosts and auth types.
- Confidence: high on file/CLI/API-shape facts. Medium on "would Cognition ban a Pi provider" (no staff letter; analogical ToS reading).

## Recommended Next Focus
Local OpenAI-compatible gateway that **fronts the official CLIs** (`cursor-agent -p` / `devin -p` or `devin acp`) rather than private vendor endpoints: technical feasibility for Pi `models.json` `openai-completions`, semantic mismatch (agent harness vs chat completions), latency, and residual ToS risk.

## SCOPE VIOLATIONS
None.
