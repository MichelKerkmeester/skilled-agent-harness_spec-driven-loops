# Iteration 4: Local OpenAI-compatible gateway fronting official CLIs

## Focus
Whether a localhost OpenAI-compatible server that **spawns `cursor-agent` / `devin`** (not private vendor endpoints) can appear in Pi's `/model` picker via `models.json`, and what that would actually give the operator.

## Actions Taken
- Mapped Pi `openai-completions` contract (streaming, tools, compat flags) from installed `docs/models.md`.
- Inspected community CLI-wrap proxies (`tageecc/cursor-agent-api-proxy`, `visense/cursor-api-proxy` / anyrobert README) versus reverse-engineered protobuf proxies (`timxx/Cursor-To-OpenAI`).
- Compared those shapes to Cursor staff's "official client + harness only" ruling (iteration 2) and Devin ACP/stdio (iteration 3).

## Findings

### F17. Pi can list a localhost gateway tomorrow — the file format is already proven
A `models.json` provider with `baseUrl: "http://127.0.0.1:4646/v1"`, `api: "openai-completions"`, a dummy `apiKey` (Pi still requires some auth material for picker visibility), and `models: [{ "id": "cursor-grok-4.6-xhigh" }, ...]` would show up in `/model` after `/login` or the dummy key. This repo already uses the same overlay mechanism for `opencode-go` (compat headers only). File reloads on each `/model` open. [SOURCE: https://pi.dev/docs/latest/models] [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/models.md] [SOURCE: .pi/models.json]

Pi's completions client is not a dumb text sink: it sends tools, expects streaming `finish_reason`, optional `stream_options.include_usage`, and session-affinity headers (`compat.sendSessionAffinityHeaders` already used here). A gateway that only returns a final assistant string will degrade Pi's native tool loop. [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/models.md:391-474]

### F18. CLI-spawn proxies exist; they wrap the official binary, not api2.cursor.sh
`cursor-agent-api-proxy` documents:

```
Client POST /v1/chat/completions → proxy → spawn agent CLI (stream-json) → Cursor subscription → OpenAI-shaped response
```

It exposes `/v1/models` and `/v1/chat/completions` on localhost (default 4646), uses `agent login` or `CURSOR_API_KEY`, and tells OpenAI clients to set `api_key: "not-needed"`. [SOURCE: https://github.com/tageecc/cursor-agent-api-proxy]

`cursor-api-proxy` (anyrobert README) is explicit that pointing an agent runtime at the proxy yields "a cloud model behind an OpenAI-shaped HTTP API" that is **not** the Cursor IDE workspace product; default `--mode ask`; no implicit repo index. [SOURCE: https://github.com/anyrobert/cursor-api-proxy/blob/main/README.md]

`cursorpipe` can speak ACP to the Cursor CLI rather than one-shot subprocess. [SOURCE: https://github.com/warelik/cursorpipe]

These are **not** the same as `timxx/Cursor-To-OpenAI`, which reverse-engineers `StreamUnifiedChatWithTools` protobuf over HTTP/2 to Cursor's private API — that class is the Oh My Pi / ToS §1.5 case already ruled out. [SOURCE: https://github.com/timxx/Cursor-To-OpenAI]

### F19. Nested-harness mismatch makes a `/model` entry a poor native model
If Pi selects `cursor-via-gateway` as its model:

- Pi remains an agent (read/bash/edit/grep tools).
- Each Pi LLM call becomes a full `cursor-agent -p` (or ACP session) turn with **Cursor's** harness, sandbox, workspace trust, and possibly Cursor's tools.
- Tool-calling is duplicated or flattened: either Cursor executes tools (Pi sees a finished essay) or the proxy strips tools (Cursor becomes a chat model with no workspace, high latency).
- Streaming is reconstructed from CLI `stream-json`, not token-level model SSE.
- Latency is agent-turn latency (seconds to minutes), not completion latency.
- `auto` as a model id would violate this repo's cli-cursor allowlist policy if the gateway advertised Cursor's full 150+ roster.

Devin analog: wrap `devin -p` (one-shot print) or `devin acp` (stdio JSON-RPC). ACP is the vendor-intended editor integration, but **Pi is not an ACP host**. Translating ACP into OpenAI completions is another lossy adapter. Devin sessions also bill ACU; a chat-shaped loop would spawn many billed agent sessions. [SOURCE: https://cli.devin.ai/docs/reference/commands] [SOURCE: https://docs.devin.ai/cli/enterprise/devin-auth]

### F20. ToS: CLI-spawn is closer to official clients than private-endpoint proxies, but it is not a blessed "raw model API"
Cursor staff listed `cursor-agent`, the Agent SDK, and Cloud Agents API as the supported out-of-IDE paths, and said they always run the harness. A local process that **is** `cursor-agent` (spawned) is using an official client. Staff separately banned bridges that call **private endpoints**. They did not bless "expose cursor-agent as `/v1/chat/completions` for third-party harnesses." A tweet quoted on the same thread ("allowed to write code that produces a Cursor API, but I cannot host that code") is **not** staff and stays unverified. [SOURCE: https://forum.cursor.com/t/does-using-oh-my-pi-s-cursor-provider-or-an-openai-compatible-proxy-to-the-same-endpoints-violate-cursor-s-tos/167778]

Account-safety ranking for gateways:

| Gateway kind | Cursor | Devin |
|--------------|--------|--------|
| Reverse-engineer private HTTP/Connect/protobuf | ToS-blocked (staff) | ToS 2.3 analog; do not |
| Spawn official CLI / ACP locally | Uses official client; residual "unauthorized third-party harness" risk if marketed as raw models | Uses official client; ACP is documented for editors |
| Host that proxy as a service for others | High risk (sharing subscription) | High risk (credentials.toml = full account) |

### F21. This repo already has the ToS-safe "use Cursor/Devin models" path: executor dispatch, not `/model`
`cli-cursor` and `cli-devin` already shell out to the official binaries with allowlists, auth preflight, and self-invocation guards. That is the staff-endorsed shape (run the vendor agent). Native `/model` exposure is a different product: making Pi's own agent think Composer/Grok/SWE are just another OpenAI model. Iteration 4 evidence says that product is technically mountable via localhost `models.json` and semantically wrong.

## Questions Answered
- Q4 (partial): Yes, a localhost OpenAI-compatible gateway that spawns `cursor-agent`/`devin` can be listed in Pi `/model` using existing `models.json`. It will not behave like a real completions model (nested harness, latency, tool-loop collapse). Private-endpoint gateways remain ruled out. Official ACP is a better Devin/Cursor editor protocol than fake chat completions, but Pi does not speak ACP.

## Questions Remaining
- Q5 Ranked verdict across all three original paths
- Residual: would Cursor staff treat a local CLI-spawn proxy used by Pi as "unsupported but not ban-worthy"? UNKNOWN (no staff letter on spawn-wrappers).

## Dead Ends
- Using ACP as Pi's model transport without writing a Pi extension that is an ACP client (Pi's custom-provider APIs are HTTP OpenAI/Anthropic/Google, not ACP).
- Expecting the gateway to preserve Pi's native tool-calling without a bidirectional tool bridge (out of scope and still a nested agent).

## Ruled Out
- **Reverse-engineered Cursor-To-OpenAI / protobuf HTTP2 gateways** as the implementation of "front the CLI." They do not front the CLI; they front private APIs. Already ToS-blocked (iteration 2).
- **Advertising Cursor `auto` or the full 150+ roster through a Pi overlay** if this repo's fail-closed allowlist is to remain the operator policy.

## Reflection
What worked: separating "spawn official CLI" from "spoof private API" using actual proxy READMEs. What failed: hoping ACP would drop into `models.json` (wrong protocol). Negative knowledge: a green `/v1/chat/completions` health check does not mean Pi gained a native Cursor model.

## Assessment
- newInfoRatio: 0.70
- Novelty justification: CLI-spawn proxy architecture, Pi tool/streaming expectations, nested-harness failure mode, and ToS split (spawn vs private API) are new; picker file format was known from iteration 1.
- Confidence: high on technical mountability and semantic mismatch. Medium on whether a local spawn-wrapper would ever be enforcement-actioned.

## Recommended Next Focus
Rank the three original paths (token reuse / Pi provider adapter / CLI gateway) on feasibility × ToS/account-safety, name one permissible recommendation (including "not native `/model`; keep executor dispatch"), and list implementation-phase gates.

## SCOPE VIOLATIONS
None.
