# Research Synthesis: Native Pi `/model` Bridge to Cursor and Devin Subscription Models

Lineage: grok-cursor. Executor: cli-cursor / cursor-grok-4.6-xhigh. Session: `fanout-grok-cursor-1786962220632-12nmeb`.

## 1. Executive Verdict

**Do not implement a native Pi `/model` (interactive `/model`) provider for Cursor or Devin subscription models.** Keep using the existing `cli-cursor` and `cli-devin` executor dispatch, which already runs the official vendor CLIs under allowlists. [SOURCE: specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/spec.md:71-75] [SOURCE: iterations/iteration-005.md]

The three original native-picker ideas resolve as follows:

1. **Reuse operator Cursor/Devin OAuth/subscription tokens inside Pi HTTP** — technically demonstrated in the wild (Oh My Pi) and **ToS-blocked for Cursor** (staff ruling, §1.5, account-ban risk). Devin has the same shape against `server.codeium.com` with no staff letter and high analogical ToS risk. **Hard reject.** [SOURCE: iterations/iteration-002.md] [SOURCE: iterations/iteration-003.md]
2. **Pi provider adapters** — `models.json` and `registerProvider` (including `streamSimple` / custom OAuth) can list anything that looks like an LLM API. Official Cursor/Devin public surfaces are **session/harness products**, not `openai-completions`. An adapter would re-implement the vendor agent inside Pi. **Not a native model.** [SOURCE: iterations/iteration-001.md] [SOURCE: iterations/iteration-005.md]
3. **Local OpenAI-compatible gateway fronting each vendor CLI** — mountable tomorrow via localhost `models.json`. Community CLI-spawn proxies exist. They produce a **nested harness** (Pi tools + vendor tools), agent-turn latency, and collapsed tool-calling. Private-endpoint "gateways" are the Oh My Pi case again. **Feasible to list; not recommended as the packet's implementation.** [SOURCE: iterations/iteration-004.md]

There is no remaining path that is both (a) a raw completions row in Pi's picker and (b) ToS-permitted on official surfaces. [SOURCE: iterations/iteration-005.md]

## 2. Research Objective and Boundaries

The topic is how cli pi can natively expose Cursor and Devin subscription-backed models in its own `/models` picker: reusing operator Cursor (`cursor-agent`) and Devin OAuth/subscription auth, adding Pi provider adapters, or fronting each vendor CLI with a local OpenAI-compatible gateway — including technical feasibility and ToS/account-safety, grounded in live pi, cursor-agent, and Devin CLI surfaces.

Non-goals honored: no production bridge implementation; no change to `cli-cursor` / `cli-devin` dispatch; no copying of live secrets; no invented vendor APIs; no ToS permission claimed from marketing copy. Spec-anchoring skipped because child `001-research-bridge-possibilities/spec.md` is absent. Memory save / `generate-context.js` / `validate.sh` / git writes were not run (fan-out write surface is this lineage directory only).

## 3. Method and Evidence Provenance

Five iterations under `stopPolicy: max-iterations` (convergence telemetry only). Ratios: `[1.00, 0.85, 0.80, 0.70, 0.55]`. Threshold 0.05 was never used to stop early.

| Iteration | Focus | Ratio |
|-----------|-------|------:|
| 1 | Pi picker, `models.json`, `auth.json`, `registerProvider` | 1.00 |
| 2 | Cursor auth stores, `api2.cursor.sh`, staff ToS | 0.85 |
| 3 | Devin OAuth, `credentials.toml`, session REST, ACP | 0.80 |
| 4 | CLI-spawn OpenAI gateways vs private-endpoint proxies | 0.70 |
| 5 | Ranked verdict, `streamSimple`, parent purpose | 0.55 |

Evidence classes: installed Pi 0.84.2 docs and redacted live `~/.pi/agent` schemas; live `cursor-agent` / `devin` help and auth-status (no secret values copied); Cursor staff forum thread and ToS §1.5; Cognition Platform ToS and Devin API docs; community proxy READMEs; this repo's cli-pi / cli-cursor / cli-devin skills and parent spec.

## 4. How Pi's Picker Actually Works

The interactive command is **`/model`**, not `/models`. The CLI dump is `pi --list-models`. [SOURCE: iterations/iteration-001.md]

Roster composition:

- built-in provider catalogs;
- `~/.pi/agent/models-store.json` (cache, not a durable edit target);
- `models.json` overlay (this machine: symlink to repo `.pi/models.json`);
- `pi.registerProvider()` from extensions.

Visibility is **auth-gated**: without `auth.json` / env / `--api-key`, models may load but stay hidden in `/model` and `--list-models`. Supported custom HTTP APIs include `openai-completions`, `openai-responses`, `anthropic-messages`, `google-generative-ai`. Credential order: CLI `--api-key` → `auth.json` → env → `models.json`. [SOURCE: https://pi.dev/docs/latest/models] [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/models.md]

Built-in subscription `/login` list: Codex, Claude Pro/Max, Copilot, xAI, OpenRouter, Radius — **not Cursor or Devin**. Live catalogs on this machine are HTTP LLM APIs (e.g. openai-codex → `https://chatgpt.com/backend-api`, opencode-go → `https://opencode.ai/zen/go/v1`). No `cursor` / `devin` / `cognition` / `api2.cursor` strings. [SOURCE: iterations/iteration-001.md]

Pi's completions client sends tools, expects streaming `finish_reason`, optional usage, and optional session-affinity headers. A gateway that only returns a final assistant string degrades Pi's native tool loop. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/models.md:391-474]

## 5. Cursor Auth, APIs, and ToS

Live `cursor-agent` on this machine: 2026.08.11-e8db854, Pro. Auth: `cursor-agent login` OAuth; headless `CURSOR_API_KEY` / `--api-key` (User API Keys). Error text also names `--auth-token` / `CURSOR_AUTH_TOKEN`. Default endpoint **`https://api2.cursor.sh`**. Distinct public Cloud Agents host **`https://api.cursor.com`**. [SOURCE: iterations/iteration-002.md]

`~/.cursor/cli-config.json` holds `authInfo.{email,displayName,userId,authId}` and URL caches — **not** access/refresh tokens. Token persistence (keychain / Chromium) was left UNKNOWN and was not dumped.

Official out-of-IDE surfaces (`cursor-agent`, Agent SDK, Cloud Agents `/v1/agents`) **always run the agent harness**. No public `POST /v1/chat/completions` for subscription models.

**Staff ruling (deanrie, 2026-08-10)** on Oh My Pi's Cursor provider and local OpenAI proxies to the same private client endpoints: using login/access tokens against **private non-public client endpoints** violates ToS **§1.5**; omp is not an authorized client; **account ban** risk. Personal/local-only does **not** change the analysis. [SOURCE: https://forum.cursor.com/t/does-using-oh-my-pi-s-cursor-provider-or-an-openai-compatible-proxy-to-the-same-endpoints-violate-cursor-s-tos/167778] [SOURCE: https://cursor.com/terms-of-service]

This repo's cli-cursor skill already fail-closes to a 21-id allowlist and excludes Cursor `auto`. A Pi overlay that advertised the live 150+ roster would fight that policy. [SOURCE: .opencode/skills/cli-external-orchestration/cli-cursor/references/providers-and-models.md]

## 6. Devin Auth, APIs, and ToS

Live `devin` on this machine: 3000.4.25, Pro, Enterprise: no, 189 allowed models. `devin auth status` hosts: API server `https://server.codeium.com`, webapp `app.devin.ai`, Devin API `https://api.devin.ai`. [SOURCE: iterations/iteration-003.md]

`~/.local/share/devin/credentials.toml` keys (values not copied): **`windsurf_api_key`**, `api_server_url`, `devin_webapp_host`, `devin_api_url`. Windsurf/Codeium heritage. `~/.config/devin/config.json` holds org_id and agent.model, not the token. Docs: token is persistent and copyable between **own machines**; anyone with the file authenticates as you. Consumer CLI path is OAuth-only (`devin auth login`); not a `--api-key` like Cursor.

Public API: `https://api.devin.ai/v3/organizations/*` **session REST** (`POST .../sessions`), service-user `cog_` keys (teams/enterprise). **Not** OpenAI chat completions. Whether consumer Pro can mint v3 service-user keys: **UNKNOWN**. Official non-REST integration: **`devin acp`** (ACP JSON-RPC over stdio). Credentials from `WINDSURF_API_KEY` or the login store. [SOURCE: https://docs.devin.ai/cli/enterprise/devin-auth] [SOURCE: https://cognitionai.mintlify.app/api-reference/overview] [SOURCE: .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:560-591]

Cognition Platform ToS §2.3: reverse-engineer software components; make Services available only to Authorized Users; no competing products/training. No Pi-named staff letter found; stuffing `windsurf_api_key` into Pi against `server.codeium.com` is high analogical risk. [SOURCE: https://cognition.com/legal/platform-terms-of-service]

## 7. Gateways and `registerProvider` Mounts

Pi can list a localhost OpenAI-compatible server via `models.json`: `baseUrl: "http://127.0.0.1:4646/v1"`, `api: "openai-completions"`, dummy `apiKey` (some auth material is still required for picker visibility). [SOURCE: iterations/iteration-004.md]

CLI-spawn prior art: `tageecc/cursor-agent-api-proxy` maps `POST /v1/chat/completions` → spawn `agent` CLI (`stream-json`) → OpenAI-shaped response. `cursor-api-proxy` documents that this is **not** the Cursor IDE workspace product; default `--mode ask`. `cursorpipe` can speak ACP. These wrap the **official binary**. [SOURCE: https://github.com/tageecc/cursor-agent-api-proxy] [SOURCE: https://github.com/anyrobert/cursor-api-proxy/blob/main/README.md]

`timxx/Cursor-To-OpenAI` reverse-engineers protobuf HTTP/2 (`StreamUnifiedChatWithTools`) to private Cursor APIs — the Oh My Pi / ToS §1.5 class, not a CLI front. [SOURCE: https://github.com/timxx/Cursor-To-OpenAI]

`registerProvider({ streamSimple })` is the **in-process twin**: spawn `cursor-agent`/`devin` inside Pi without `:4646`. Same nested-harness failure. `apiKey: "!command"` that injects vendor tokens into Bearer headers against private hosts is token-reuse with extra steps. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:395-427] [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:655-693]

ACP is the vendor-intended editor protocol. Pi custom providers are HTTP OpenAI/Anthropic/Google (or custom `streamSimple`), not ACP hosts.

## 8. Nested Harness vs Chat Completions

If Pi selects `cursor-via-gateway` as its model:

- Pi remains an agent with read/bash/edit/grep tools.
- Each Pi LLM call becomes a full `cursor-agent -p` (or ACP session) with Cursor's harness, sandbox, and possibly Cursor's tools.
- Tool-calling is duplicated or flattened: either Cursor executes tools (Pi sees a finished essay) or the proxy strips tools (high latency chat with no workspace).
- Streaming is reconstructed from CLI `stream-json`, not token-level model SSE.
- Latency is agent-turn latency.
- Devin analog: `devin -p` or `devin acp`; Devin sessions bill ACU; a chat-shaped loop would spawn many billed sessions.

That is why a green `/v1/chat/completions` health check does not mean Pi gained a native Cursor/Devin model. [SOURCE: iterations/iteration-004.md]

## 9. Official Public APIs as Adapter Subtypes

Cursor Cloud Agents (`https://api.cursor.com/v1/agents`) and Devin v3 sessions are **authorized** if the operator holds the matching official key. They are still harness/session products. Wiring them through `streamSimple` makes Pi a Cloud Agent / Devin session client — a different product from `/model` as a completions picker, and it re-implements the vendor agent inside Pi, contradicting the parent purpose. [SOURCE: iterations/iteration-005.md]

## 10. Account-Safety Ranking

| Gateway / adapter kind | Cursor | Devin |
|------------------------|--------|-------|
| Reverse-engineer private HTTP/Connect/protobuf | ToS-blocked (staff); ban risk | ToS §2.3 analog; do not |
| Copy login tokens / `windsurf_api_key` into Pi HTTP | Same as above | High analogical risk; credentials.toml is the full account |
| Spawn official CLI / ACP locally | Uses official client; residual "unauthorized third-party harness" risk if marketed as raw models; no staff letter on spawn-wrappers | Uses official client; ACP is documented for editors |
| Host that proxy as a service for others | High risk (sharing subscription) | High risk (file = full account) |
| Official Cloud Agents / v3 session keys | Official client; still not completions | Official if `cog_` keys exist for the plan (UNKNOWN for consumer Pro) |
| Existing `cli-cursor` / `cli-devin` shell-out | Official client; allowlisted | Official client |

## 11. Recommendations

**Primary (implementation phases should stay closed unless the operator explicitly changes the product):**

- Do **not** add Cursor or Devin rows to Pi `/model`.
- Continue using `cli-cursor` and `cli-devin` for subscription-backed models.
- Do **not** point `models.json` at `api2.cursor.sh` or `server.codeium.com`.
- Do **not** copy Cursor access tokens or Devin `windsurf_api_key` into `auth.json`.

**If the operator later insists on a picker experiment (not recommended):**

1. Spawn official `cursor-agent` / `devin` (or ACP) only; never private RPCs.
2. Local-only; never host for other accounts.
3. Advertise only the repo allowlist (21 Cursor ids; Devin skill catalog); never `auto`.
4. Default Cursor `--mode ask` (or Devin read-only equivalent) to avoid double-writing the workspace.
5. Legal review of Cursor ToS §1.5 and Cognition Platform ToS §2.3 before shipping anything that impersonates chat completions.

**Optional later packet (different product):** Pi as an ACP host or Cloud Agents/Devin-session client — not a `/model` completions provider.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Assume Pi already ships a built-in Cursor or Devin provider | Installed providers.md and live models-store.json contain neither | `docs/providers.md`; live `models-store.json` | 1 |
| Oh My Pi / `models.json` using Cursor login tokens against `api2.cursor.sh` | Staff ToS §1.5; ban risk; local-only does not help | Cursor forum staff thread; cursor.com/terms-of-service | 2 |
| Local OpenAI proxy to private Cursor client endpoints | Staff: same case as Oh My Pi | Same thread | 2 |
| Pi HTTP from `credentials.toml` `windsurf_api_key` vs `server.codeium.com` | Cognition ToS §2.3 analog; not an authorized HTTP client | cognition.com/legal/platform-terms-of-service | 3 |
| Treat `api.devin.ai` as `openai-completions` `baseUrl` | Session REST, not chat completions | cognitionai.mintlify.app API overview | 3 |
| Reverse-engineered protobuf/HTTP2 Cursor-To-OpenAI as a "CLI gateway" | Does not front the CLI; private APIs | github.com/timxx/Cursor-To-OpenAI | 4 |
| Advertise Cursor `auto` / full 150+ roster via Pi overlay | Conflicts with cli-cursor 21-id allowlist | cli-cursor providers-and-models.md | 4 |
| ACP as a drop-in `models.json` transport | Pi custom providers are HTTP (or streamSimple), not ACP hosts | Pi custom-provider.md; `devin acp` help | 4 |
| `registerProvider` `streamSimple` as a distinct safe native-model path | In-process twin of CLI-spawn gateway; same nested harness | custom-provider.md:655-693 | 5 |
| Ship a native `/model` Cursor/Devin provider as the next implementation phase | Every ToS-safe path is a vendor harness; every raw-completions path is ToS-blocked | Parent spec.md:71-75; ranking table | 5 |
| `!command` apiKey interpolation to inject vendor tokens into Pi HTTP | Token reuse with extra steps | custom-provider.md:186 | 5 |

## Divergence Map

| Direction | Evidence | Status |
|---|---|---|
| Pi picker / overlay / `registerProvider` | Installed Pi 0.84.2 docs; live `~/.pi/agent` (redacted) | Saturated: no built-in Cursor/Devin; HTTP overlay is the only first-class `/model` hook |
| Cursor token reuse vs official clients | Staff Oh My Pi thread; ToS §1.5; `cursor-agent about`; cli-config.json schema | Saturated: private endpoints banned; harness-only official APIs |
| Devin token reuse vs official clients | Live `devin auth status`; credentials.toml **keys only**; v3 session REST; ACP | Saturated for consumer OAuth HTTP reuse; UNKNOWN for consumer `cog_` minting |
| CLI-spawn OpenAI gateway | cursor-agent-api-proxy, cursor-api-proxy, cursorpipe | Audited: mountable; nested harness; not a native model |
| Private-API protobuf proxies | Cursor-To-OpenAI | Ruled out (same ToS class as Oh My Pi) |
| `streamSimple` / official session APIs as `/model` | custom-provider.md; Cloud Agents; Devin v3 | Audited: different product (session client), not raw completions |
| Native `/model` vs executor dispatch | Parent spec purpose; cli-cursor/cli-devin | Verdict: keep dispatch; close native-picker implementation |

No divergent Council pivots were run (`antiConvergence.divergent` unused). Graph coverage path was not used; this map is source-and-command evidence.

## 12. Open Questions

All five charter questions are answered. Residual UNKNOWNs are non-blocking and must not reopen native-picker research:

1. Exact Cursor token store (keychain vs Chromium) — deliberately not dumped.
2. Whether consumer Devin Pro can mint `api.devin.ai` v3 `cog_` service-user keys.
3. Whether Cursor staff would enforce against a **local CLI-spawn** wrapper used only by the account owner (no staff letter on spawn-wrappers; staff letter covers private endpoints).

## 13. Risks

- Shipping Oh My Pi-style config would expose the operator to a documented Cursor account ban.
- Copying `credentials.toml` into artifacts or into Pi HTTP hands the full Devin account to any reader of the file.
- A nested gateway with default agent/write modes can double-edit the workspace (Pi tools + Cursor/Devin tools).
- Advertising `auto` bypasses this repo's Cursor allowlist.
- Hosting a "local" proxy for others is subscription sharing.
- Spec-anchoring was skipped (no child `spec.md`); parent readers must not treat this lineage file as a write-back into `001-research-bridge-possibilities/spec.md`.

## 14. Confidence

High: Pi picker mechanics; absence of built-in Cursor/Devin providers; Cursor staff ToS ruling on private endpoints; Devin credential key names and session-REST shape; nested-harness mismatch; reject of native `/model` as the implementation default.

Medium: analogical Devin ToS (no Pi-named staff letter); residual spawn-wrapper enforcement; consumer Devin v3 key eligibility.

Low / UNKNOWN: physical Cursor token store internals (not inspected).

## 15. References

Do not cite a packet-root `resource-map.md`; it was absent at init (`resource_map_present: false`). Lineage emission is `resource-map.md` beside this file.

- https://pi.dev/docs/latest/models
- `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/models.md`
- `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md`
- `.opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md`
- `.opencode/skills/cli-external-orchestration/cli-cursor/references/providers-and-models.md`
- `.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md`
- `specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/spec.md`
- https://cursor.com/terms-of-service
- https://forum.cursor.com/t/does-using-oh-my-pi-s-cursor-provider-or-an-openai-compatible-proxy-to-the-same-endpoints-violate-cursor-s-tos/167778
- https://cursor.com/docs/cli/headless
- https://docs.devin.ai/cli/enterprise/devin-auth
- https://cognitionai.mintlify.app/api-reference/overview
- https://cognition.com/legal/platform-terms-of-service
- https://github.com/tageecc/cursor-agent-api-proxy
- https://github.com/anyrobert/cursor-api-proxy/blob/main/README.md
- https://github.com/timxx/Cursor-To-OpenAI
- Lineage iterations `iterations/iteration-001.md` … `iteration-005.md`

## 16. Implementation Gates (if a later packet is opened)

1. Never send Cursor login/access tokens or Devin `windsurf_api_key` to any HTTP host except through the official CLI/SDK/ACP process.
2. Never target `api2.cursor.sh` or `server.codeium.com` from Pi `models.json`.
3. If a localhost gateway is built, spawn `cursor-agent` / `devin` only.
4. Advertise only allowlisted ids.
5. Default read-only / ask mode for nested runs.
6. Do not host the proxy as a multi-account service.
7. Legal review before impersonating chat completions.

## 17. Convergence Report

- `stopReason`: `maxIterationsReached` (frozen enum; legacy label `max_iterations` / `max_iterations_reached`).
- Iterations completed: 5 of 5.
- `convergenceThreshold`: 0.05 (telemetry only; stopPolicy = max-iterations).
- Ratios: `[1.00, 0.85, 0.80, 0.70, 0.55]` — none at or below 0.05; loop did not synthesize early.
- Key questions answered: 5 / 5.
- Stuck count: 0.
- Pivots: 0.
- Spec-anchoring: skipped (folder_state no-spec).
- SAVE / `generate-context.js`: skipped (fan-out write-surface lock).
