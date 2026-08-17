# Iteration 5: Ranked verdict across token reuse, provider adapters, and CLI gateways

## Focus
Rank the three original native-`/model` paths on technical feasibility × ToS/account-safety, including the `registerProvider({ streamSimple })` variant of a CLI front and official public APIs (Cursor Cloud Agents, Devin v3 sessions) as adapter subtypes. Name one permissible recommendation.

## Actions Taken
- Re-read Pi `registerProvider` Config Reference: `streamSimple` for non-standard APIs, `oauth` for `/login`, `apiKey` `!command` interpolation.
- Compared that hook to CLI-spawn HTTP gateways (iteration 4) and to official public session APIs (iterations 2–3).
- Cross-checked the parent packet purpose ("without re-implementing each vendor's agent") against existing `cli-cursor` / `cli-devin` executor dispatch.

## Findings

### F22. `streamSimple` is the in-process twin of a localhost gateway — same nested-harness failure
Pi extensions may register a complete provider with a custom `streamSimple(model, context, options) => AssistantMessageEventStream`. That is how non-standard APIs enter `/model` without speaking OpenAI HTTP. A Cursor/Devin adapter would spawn `cursor-agent -p` / `devin -p` (or speak ACP) inside `streamSimple` and map stdout into assistant events. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:395-427] [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:655-693]

This avoids a second process listening on `:4646`, but it does **not** create a raw completions model. Pi still owns tools, streaming, and turn state; the vendor CLI still owns a second harness. The semantic mismatch in F19 remains. `apiKey: "!command"` that dumps a Cursor/Devin token into a Bearer header against `api2.cursor.sh` or `server.codeium.com` is Path A with extra steps — already ToS-blocked. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md:186]

### F23. Official public APIs are session/harness products, not `/v1/chat/completions`
Cursor's documented out-of-IDE surfaces are `cursor-agent`, the Agent SDK, and Cloud Agents `https://api.cursor.com/v1/agents`. Staff stated they always run the agent harness. There is no public chat-completions endpoint for subscription models. [SOURCE: https://cursor.com/docs/cli/headless] [SOURCE: https://forum.cursor.com/t/does-using-oh-my-pi-s-cursor-provider-or-an-openai-compatible-proxy-to-the-same-endpoints-violate-cursor-s-tos/167778]

Devin's public API is `https://api.devin.ai/v3/organizations/{id}/sessions` (session REST, `cog_` service-user keys). Consumer CLI auth is OAuth into `~/.local/share/devin/credentials.toml` (`windsurf_api_key` vs `https://server.codeium.com`). Whether a consumer Pro account can mint v3 service-user keys remains UNKNOWN. ACP (`devin acp`) is stdio JSON-RPC for editors, not an HTTP OpenAI server. [SOURCE: https://cognitionai.mintlify.app/api-reference/overview] [SOURCE: .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:560-591]

A Pi adapter to these official APIs is technically a custom `streamSimple` + OAuth/`apiKey` provider. It would still present a **session agent** as a **chat model**. That fails the parent purpose of not re-implementing the vendor agent, and it is a poor `/model` citizen (latency, tools, billing units: Cloud Agent runs / Devin ACU).

### F24. Ranked native-picker paths (feasibility × safety)

| Rank | Path | Tech | ToS / account safety | `/model` quality | Verdict |
|------|------|------|----------------------|------------------|---------|
| 1 (do not ship as `/model`) | Keep existing `cli-cursor` / `cli-devin` executor dispatch | Proven; allowlisted models; official binaries | Uses official clients | N/A — not native picker | **Recommended product path.** Already satisfies "use subscription models without wrapping private HTTP." |
| 2 (experiment only) | Local CLI-spawn gateway **or** `registerProvider` `streamSimple` that spawns official CLI/ACP, local-only, allowlisted ids, `--mode ask` / Devin equivalent | Mountable; community proxies exist | Uses official client; residual "third-party harness" risk; **hosting for others is high risk** | Nested harness; tool-loop collapse; agent-turn latency | Feasible to *list* in `/model`; **not** a native model. Do not treat as the packet's implementation default. |
| 3 (poor citizen, ToS-safer than 4) | Pi adapter to **official** public APIs (Cloud Agents / Devin v3 sessions) | Custom streaming required; not `openai-completions` | Official keys/clients if the operator can mint them | Session/harness, not completions | Only if a later packet explicitly wants "Pi as a Cloud Agent/Devin session client," which is a different product. |
| 4 (reject) | Reuse Cursor OAuth/access tokens or Devin `windsurf_api_key` in Pi `models.json` / Oh My Pi-style HTTP against `api2.cursor.sh` / `server.codeium.com` | Works in the wild (Oh My Pi) | **Cursor staff: ToS §1.5, ban risk.** Devin: Cognition Platform ToS §2.3 analog, no staff letter | Looks like a real model | **Hard reject.** |
| 5 (reject) | Local or hosted OpenAI proxy to **private** vendor endpoints (protobuf/HTTP2, Connect) | Works in the wild | Same as 4; staff said personal/local-only does not change the analysis | Looks like a real model | **Hard reject.** |

### F25. Parent purpose vs native picker
The phase-parent problem statement asks whether Pi can authenticate against existing Cursor/Devin subscriptions and surface those models as first-class `/model` entries **without re-implementing each vendor's agent**. [SOURCE: specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/spec.md:71-75]

Evidence from iterations 1–5: every ToS-safe path either (a) **is** the vendor agent (executor dispatch / CLI spawn / ACP / Cloud Agents / Devin sessions) or (b) **is** a re-implementation of a private client protocol (banned). There is no remaining path that both (1) is a raw completions model in Pi's picker and (2) uses only official, ToS-permitted surfaces.

### F26. Implementation-phase gates if the operator later insists on a picker experiment
If a later child is opened despite F25, fail-closed gates:

1. Never send Cursor login/access tokens or Devin `windsurf_api_key` to any HTTP host except through the official CLI/SDK/ACP process.
2. Never target `api2.cursor.sh` or `server.codeium.com` from Pi `models.json`.
3. If a localhost gateway is built, spawn `cursor-agent` / `devin` only; do not reverse-engineer private RPCs.
4. Advertise only the repo allowlist (21 Cursor ids; Devin skill catalog) — never `auto` or the live 150+/189 roster.
5. Default Cursor `--mode ask` (or equivalent read-only) so a nested Pi tool loop cannot double-write the workspace.
6. Do not host the proxy as a service for other accounts.
7. Legal review of Cursor ToS §1.5 and Cognition Platform ToS §2.3 before shipping anything that impersonates a chat-completions API.

## Questions Answered
- Q5: Ranked verdict — **do not implement a native `/model` bridge.** Keep executor dispatch. Token reuse and private-endpoint proxies are ToS-blocked. CLI-fronting gateways/`streamSimple` are technically mountable and semantically wrong. Official public APIs are harness/session products.

## Questions Remaining
Non-blocking UNKNOWNs (do not reopen native-picker research):

- Exact Cursor token store (keychain vs Chromium) — deliberately not dumped.
- Whether consumer Devin Pro can mint `api.devin.ai` v3 `cog_` keys.
- Whether Cursor staff would enforce against a **local CLI-spawn** wrapper used only by the account owner (no staff letter on spawn-wrappers; staff letter covers private endpoints).

## Dead Ends
- Native `/model` as a ToS-safe raw completions surface for Cursor/Devin subscription models: no remaining candidate after ranking.
- Using `!command` apiKey interpolation to "safely" inject vendor tokens into Pi HTTP: still Path A.

## Ruled Out
- Shipping a native Pi `/model` Cursor/Devin provider as the next implementation phase (fails parent purpose or ToS).
- Treating `registerProvider` `streamSimple` as a distinct safe native-model path (same nested harness as the HTTP gateway).
- Treating Cloud Agents / Devin v3 as drop-in `openai-completions` `baseUrl` values.

## Sources Consulted
- `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md` (streamSimple, oauth, apiKey `!command`)
- Iterations 1–4 findings and cited vendor docs/ToS/staff thread
- `specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/spec.md` (parent purpose)
- `.opencode/skills/cli-external-orchestration/cli-cursor/references/providers-and-models.md` (21-id allowlist)
- `.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md` (`devin acp`)

## Reflection
What worked: ranking against the parent purpose, not just "can we make `/model` show a row." What failed: hoping `streamSimple` or official session APIs would restore a raw-model shape. Negative knowledge: picker visibility ≠ native model.

## Assessment
- newInfoRatio: 0.55
- Novelty justification: `streamSimple` as gateway twin, official-API-as-session-product, parent-purpose contradiction, ranked table, and implementation fail-closed gates are new. Auth/ToS facts were already established in iterations 2–4.
- Confidence: high on reject of token reuse / private proxies and on the executor-dispatch recommendation. Medium on residual spawn-wrapper enforcement (no staff letter).

## Recommended Next Focus
Synthesis: compile `research.md`, emit lineage `resource-map.md`, mark config complete. No further research iteration (maxIterations=5).

## SCOPE VIOLATIONS
None.
