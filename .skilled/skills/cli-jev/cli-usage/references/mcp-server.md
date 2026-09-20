---
title: "Jev MCP Server"
description: "The jev-mcp stdio server: its four tools, their schemas, the host-only start rule, and the operator step that wires it into an MCP host."
trigger_phrases:
  - "jev mcp server"
  - "jev-mcp"
  - "jev mcp tools"
  - "jev mcp host"
  - "typesafe jev mcp"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.0
---

# Jev MCP Server

> `jev-mcp` ships in the same installation as `jev` — there is no optional extra to enable. This
> packet documents the server and the operator step that connects it. **No repository MCP config is
> modified by this packet**: the CLI is the hub's dispatch surface, and an MCP host is the
> operator's choice.

---

## 1. STARTING THE SERVER

```bash
jev-mcp          # speaks MCP over stdio; stdout carries protocol frames only
```

`command -v jev-mcp` is the availability check. Diagnostics go to stderr, so `JEV_MCP_LOG_LEVEL`
(default `WARNING`) controls them without polluting stdout.

**Never run it from a shell you are also reading.** Its stdout is a stream of JSON-RPC frames, and a
hand-started server writes them into the transcript while answering nothing. The packet declares
this as a warning-level hard rule (`jev-mcp-host-only`), because the failure is silent — the process
looks healthy and produces no usable output.

---

## 2. THE TOOL SURFACE

The server advertises exactly four tools. **LIVE** probe: a stdio handshake answers `initialize`
with `serverInfo.name = "jev"`, `version = "0.6.2"`, protocol `2025-06-18`, then `tools/list`
returns:

| Tool | Required arguments | Optional arguments | Answer path |
|---|---|---|---|
| `noul` | `state`, `question` | `provider`, `model`, `endpoint` | `answers.answer.noul` — a probability |
| `choice` | `state`, `question`, `options` | `provider`, `model`, `endpoint` | `answers.answer.choice` — the selected key |
| `score` | `state`, `question`, `levels` | `provider`, `model`, `endpoint` | `answers.answer.score` — a zero-based position |
| `run` | `request` | `provider`, `model`, `endpoint` | The full batched response object |

`options` is an object of `KEY → DESCRIPTION`; `levels` is an array of descriptions ascending; each
requires at least two entries and the server refuses one. `request` is a complete System One object
with `state` and `questions`, and unknown members are forwarded unchanged.

Each tool also accepts `provider`, `model` and `endpoint` overrides, all three normally omitted.

---

## 3. STATE IS SENT VERBATIM

The single most important difference from the CLI: **`-` and `@path` are literal strings in the MCP
tools.** They are not stdin and not a file reference. The adapter hands the value straight to the
request builder, so a host that passes `"-"` sends the one-character string `-` to Jev as the state,
and a host that passes `"@notes.txt"` sends that path as text.

A host that wants to judge a file's contents reads the file itself and passes the text:

```text
Read notes.txt in the host → call noul(state=<file contents>, question="…")
```

This is stated in the tool descriptions themselves and is the second reason the CLI remains the
dispatch surface for this hub: the convenience forms are CLI-only.

---

## 4. PROVIDER RESOLUTION

The server resolves the provider exactly as the CLI does: the tool argument, then `JEV_PROVIDER`,
then `official`. An invalid `JEV_PROVIDER` fails before any provider access with a tool error
(`invalid JEV_PROVIDER: <value>`), and every `CliError` is translated into an MCP tool error rather
than a protocol failure — so a host sees `official API key is not stored; run: jev auth set
--provider official` as a tool-level error, not a broken server.

The credential store is shared with the CLI: authenticating once with `jev auth set` makes both
surfaces work.

---

## 5. THE OPERATOR STEP

Wiring the server into a host is an operator action. The block below is the standard stdio shape;
the host's own config file is the operator's to choose, and this packet writes none of them.

```json
{
  "mcpServers": {
    "jev": {
      "command": "jev-mcp",
      "env": { "JEV_PROVIDER": "official" }
    }
  }
}
```

Notes that decide whether it works:

- **Use an absolute path if `jev-mcp` is not on the host's `PATH`.** A GUI host frequently inherits a
  smaller `PATH` than the operator's shell, and a bare `jev-mcp` then fails to start with no visible
  error.
- **Do not put a key literal in the block.** Either let the credential store supply it, or reference
  the variable the host already exports. A key in a committed config is the leak this whole surface
  is designed to avoid.
- **One server, four tools, no write tools.** The server cannot edit a file, run a process or read a
  path, so a host granting it is not granting filesystem access.

---

## 6. WHEN TO PREFER THE CLI

| Situation | Surface |
|---|---|
| The hub is dispatching inside this repository | CLI — one Bash call, auditable in the transcript, governed by the packet's hard rules |
| State lives in a file and should be read from it | CLI — `-s @path` and `-s -` are CLI forms |
| A script needs a scalar | CLI — `--value` prints the primary value alone |
| A desktop or editor host wants a judgment tool | MCP — the host owns the lifecycle |
| A host is already connected to Jev and a judgment is needed | MCP — do not shell out from a host that has the tool |
