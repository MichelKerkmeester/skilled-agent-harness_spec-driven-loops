---
title: "Contract: the advisor socket protocol after MCP"
description: "Frozen wire contract between the advisor CLI and its daemon once the MCP vocabulary is removed, including the D1 versus D7 conflict and its resolution."
trigger_phrases:
  - "advisor socket protocol"
  - "advisor wire contract"
  - "advisor daemon framing"
  - "advisor protocol version"
importance_tier: "important"
contextType: "reference"
---
# Contract: the advisor socket protocol after MCP

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Frozen in phase 2. Phase 3 implements exactly this and may not change it.

---

## 1. WHAT IS ACTUALLY MCP TODAY

Read from `mcp-server/skill-advisor-cli.ts` and `system-spec-kit/shared/ipc/socket-server.ts`.
The wire is less MCP than the package name suggests.

| Layer | Today | Is it MCP? |
|-------|-------|-----------|
| Transport | Unix domain socket | No |
| Framing | Newline-delimited JSON, one frame per line | No. MCP stdio uses this too, but so does everything else |
| Envelope | JSON-RPC 2.0: `jsonrpc`, `id`, `method`, `params`, `result`, `error` | No. JSON-RPC is a generic RPC standard |
| Handshake | `initialize`, then a `notifications/initialized` notification | Partly. The names are MCP lifecycle |
| Version gate | `protocolVersion` compared against the string `2025-06-18` | Yes. That is the MCP revision |
| Call | `tools/call` with `{ name, arguments }` | Yes |
| Result | `{ content: [{ type: "text", text }] }`, the payload JSON-encoded inside `text` | Yes |

So four rows are MCP and three are not.

---

## 2. A CONFLICT BETWEEN D1 AND D7

**D1 says the JSON-RPC framing goes. D7 says the shared socket bridge is preserved. Both cannot
hold literally.**

The shared bridge at `@spec-kit/shared/ipc/socket-server.js` is used by more than one daemon. When
a daemon is at its client cap it peeks the first frame and answers a liveness probe directly,
identifying that probe as a JSON-RPC frame with `method === "initialize"` and
`params.clientInfo.name === "liveness-probe"`, and replying with a JSON-RPC error object carrying
the same id. That logic is shared infrastructure, and the advisor is not its only caller.

Removing JSON-RPC from the advisor's socket would either break that probe for the advisor or force
a change to code D7 preserves.

**Resolution: D1 is amended to name what is actually MCP.** The JSON-RPC 2.0 envelope and the
`initialize` handshake stay, because they are generic and because shared code depends on them. What
goes is the MCP vocabulary sitting on top: the `2025-06-18` protocol revision, the
`notifications/initialized` lifecycle notification, the `tools/call` method with its
`{ name, arguments }` shape, and the `{ content: [...] }` result envelope.

This is an amendment to a frozen parent decision. It is applied to the parent goal and the durable
text is resent.

---

## 3. THE FROZEN CONTRACT

### 3.1 Transport and framing

Unix domain socket, newline-delimited JSON, one complete JSON object per line, UTF-8. Unchanged.
A line that does not parse closes the connection.

### 3.2 Handshake

The client sends one `initialize` request and waits for its reply before any call.

```
--> {"jsonrpc":"2.0","id":1,"method":"initialize","params":{"clientInfo":{"name":"skill-advisor-cli","version":"<cli version>"},"advisorProtocol":"1"}}
<-- {"jsonrpc":"2.0","id":1,"result":{"advisorProtocol":"1","generation":<int>,"trustState":"live"}}
```

`clientInfo.name` is mandatory and must not be `liveness-probe` for a real client, so the shared
bridge's cap-probe path keeps working untouched.

No `notifications/initialized` is sent. The daemon must not wait for one.

### 3.3 Version negotiation

`advisorProtocol` is an advisor-owned integer-valued string, starting at `"1"`. It replaces the MCP
revision string entirely.

- Client and daemon agree: proceed.
- Daemon returns a higher version than the client knows: the client fails with the protocol exit
  code and a message naming both versions. It does not guess.
- Daemon omits `advisorProtocol`: treated as an incompatible daemon, same failure.

The version changes only when a frame shape changes. Adding an optional field is not a version bump.

### 3.4 Call

```
--> {"jsonrpc":"2.0","id":2,"method":"advisor.call","params":{"command":"advisor_recommend","args":{...}}}
<-- {"jsonrpc":"2.0","id":2,"result":{"status":"ok","data":{...}}}
```

`command` is one of the nine names in the CLI tool manifest. `args` is the tool's argument object,
unchanged from today. The result payload is returned as a JSON object directly. It is never
JSON-encoded into a string inside a `content` array.

### 3.5 Errors

A failed call returns a JSON-RPC error object, and the CLI maps the code onto its existing exit
taxonomy rather than inventing a second one.

| Condition | JSON-RPC code | CLI exit |
|-----------|---------------|----------|
| Unknown command | -32601 | 64 |
| Invalid arguments | -32602 | 64 |
| Daemon not ready, at capacity, or shutting down | -32000 | 75 |
| Protocol disagreement | -32600 | 69 |
| Handler raised | -32603 | 1 |

Exit codes 0, 1, 64, 69 and 75 are the taxonomy the CLI already uses. Phase 3 documents and tests
them; it does not renumber them.

### 3.6 What phase 3 must not change

The nine command names, their argument shapes, the payload field names inside `data`, and the five
exit codes. Those are the parity surface.

---

## 4. WHY NOT A SIMPLER PROTOCOL

A bespoke line protocol would be smaller than JSON-RPC. It was rejected: the shared bridge already
parses JSON-RPC frames for its cap probe, so a bespoke protocol adds a second frame grammar on one
socket without removing the first. The cheaper move is to keep the envelope and delete the MCP
vocabulary, which is what this contract does.
