# jev-cli

A small CLI and stdio MCP server for [TypeSafe Jev](https://docs.typesafe.ai/introduction). Send text or JSON state, ask typed questions, and receive machine-readable `noul`, `choice`, or `score` answers.

The `jev` command is useful when application code needs a fast classification or judgment instead of generated prose. The `jev-mcp` command exposes the same judgments to MCP hosts over stdio.

[![Watch the jev-cli terminal demo](assets/jev-cli-thumbnail.png)](assets/jev-cli-terminal-demo.mp4)

_Click the thumbnail to watch the 19-second terminal demo._

## Screenshots

![jev-cli overview](assets/jev-cli-overview.png)

![jev-cli terminal judgment result](assets/jev-cli-terminal-result.png)

![jev-cli terminal introduction](assets/jev-cli-intro.png)

> **Unofficial:** This is an independent community project. It is not affiliated with, maintained by, or endorsed by TypeSafe AI.

## Features

- Supports all three Jev primitives: `noul`, `choice`, and `score`
- Sends multiple questions in one request with `run`
- Accepts text, JSON, files, and stdin
- Emits compact JSON by default
- Can print only the primary value for shell scripts
- Uses structured stderr errors and meaningful exit codes
- Ships a stdio MCP server, `jev-mcp`, in the same installation

## Requirements

- [uv](https://docs.astral.sh/uv/)
- An API key for the provider you use. The official TypeSafe API is the default.

`uv` installs a compatible Python 3.13 or later interpreter when needed.

## Install

Install `jev-cli` from PyPI with `uv tool`. This keeps the commands in an isolated environment and makes both `jev` and `jev-mcp` available on your `PATH`. There is no optional extra to select; the MCP server is part of the normal installation.

```bash
uv tool install jev-cli
```

Verify that the command is available:

```bash
jev --version
```

Expected output:

```text
jev 0.6.2
```

## Authentication

The official TypeSafe API is the default provider. The recommended approach for automation is the `TYPESAFE_API_KEY` environment variable. It takes precedence over the credential file.

```bash
export TYPESAFE_API_KEY='your-api-key'
jev auth status
```

For local use, enter the key at the hidden prompt. `auth set` does not accept the key as a command-line argument, which keeps it out of process arguments and shell history.

```bash
jev auth set
jev auth status
jev auth test
```

Jev is also available through Vercel AI Gateway and OpenRouter. Select a provider per command with `--provider`, or set `JEV_PROVIDER` for the process. Each provider uses its own API key and default model.

| Provider | Option | API key environment variable | Default model |
|---|---|---|---|
| TypeSafe official | `official` | `TYPESAFE_API_KEY` | `jev-latest` |
| Vercel AI Gateway | `vercel` | `AI_GATEWAY_API_KEY` | `typesafe-ai/jev` |
| OpenRouter | `openrouter` | `OPENROUTER_API_KEY` | `typesafe/jev-1.13` |
| Jev-compatible proxy | `custom` | `JEV_API_KEY` | `JEV_MODEL` or `jev-latest` |

Store and test a provider-specific key without exposing it in shell history:

```bash
jev auth set --provider vercel
jev auth test --provider vercel

jev auth set --provider openrouter
jev auth test --provider openrouter
```

Run the same judgment through another provider:

```bash
jev noul \
  --provider openrouter \
  --question 'Does this message express urgency?' \
  --state 'Please restore service today.' \
  --value
```

Omitting `--provider` continues to use the official TypeSafe API. `--model` can override the provider's default model.

For a proxy that implements the native Jev request and response contract, select `custom` and configure its endpoint separately. This keeps proxy credentials isolated from the built-in providers.

```bash
export JEV_PROVIDER=custom
export JEV_ENDPOINT='https://proxy.example.com/v1/systemone'
export JEV_API_KEY='your-proxy-api-key'
export JEV_MODEL='jev-latest' # optional

jev noul -q 'Is this urgent?' -s 'Restore service today.' --value
```

`--endpoint` can replace `JEV_ENDPOINT` for one command. The CLI sends `JEV_API_KEY` to that endpoint as a bearer token, so use only a trusted HTTPS endpoint.

For non-interactive automation, piping the key to `jev auth set` remains supported.

`auth status` reports only whether a key is available. `auth test` sends a minimal request to Jev and verifies that the key is accepted. Neither command prints the key.

The fallback credential path follows XDG conventions:

- `$XDG_CONFIG_HOME/jev-cli/credentials.json` when `XDG_CONFIG_HOME` is set
- `~/.config/jev-cli/credentials.json` otherwise

The credential directory is created with mode `0700`; the file is written atomically with mode `0600`.

## Quick start

`--question` and `--state` also accept the short forms `-q` and `-s`. `--value` has no short form.

## Install the bundled Agent Skill

`jev-cli` currently bundles the `jev-cli` skill. Install it for the current project or globally:

```bash
jev install-skills
jev install-skills --global
```

Use `--claude` to target Claude's skill directory instead:

```bash
jev install-skills --claude
jev install-skills --global --claude
```

The command prints JSON. It refreshes only copies it previously installed and refuses to overwrite an unmanaged skill directory.

Ask whether a message expresses urgency. `--value` prints only the resulting probability from `0` to `1`.

```bash
jev noul \
  --question 'Does this message express urgency?' \
  --state 'Please restore service today.' \
  --value
```

Example output:

```text
0.98
```

Without `--value`, the command returns the complete API response as JSON, including model and token usage.

```bash
jev noul \
  --question 'Does this message express urgency?' \
  --state 'Please restore service today.' \
  --pretty
```

## Question types

### Noul: yes/no probability

Use `noul` for one focused yes/no judgment. The value is the probability that the answer is yes.

```bash
jev noul \
  --question 'Does this message request a refund?' \
  --state 'The integration is broken, but I do not want a refund.' \
  --value
```

### Choice: select one option

Use `choice` when the answer must be one of a known set. Each option uses `KEY=DESCRIPTION` syntax.

```bash
jev choice \
  --question 'Which team should handle this?' \
  --state 'The payment integration keeps failing.' \
  -o 'billing=Payment, charge, or refund issues' \
  -o 'technical=Bugs or integration failures' \
  -o 'other=None of these' \
  --pretty
```

### Score: evaluate ordered levels

Use `score` for an ordered scale. Levels are numbered from zero in the order supplied.

```bash
jev score \
  --question 'How frustrated is the customer?' \
  --state 'This has failed for three days. Please help.' \
  -l 'Calm' \
  -l 'Concerned but civil' \
  -l 'Very angry' \
  --value
```

## Input formats

### Standard input

Omit the state or pass `-` to read it from stdin. This is useful for pipelines and avoids putting sensitive input in shell history.

```bash
printf '%s' 'Please resolve this today.' | \
  jev noul --question 'Does this message express urgency?' --value
```

### File input

Prefix a path with `@` to read its contents.

```bash
jev noul \
  --question 'Does this document mention security risks?' \
  --state @document.txt \
  --value
```

### JSON state

Use `--json-state` to parse the state as JSON. Instructions can refer to named fields.

```bash
printf '%s' '{"message":"Please respond today"}' | \
  jev noul \
  --question 'Does `message` express urgency?' \
  --json-state \
  --value
```

## Batch questions

Jev evaluates questions independently against the same state. Use `run` to send a complete System One request and avoid one API call per question.

Create `request.json`:

```json
{
  "state": {
    "message": "The payment integration has failed for three days. Please fix it today."
  },
  "model": "jev-latest",
  "questions": {
    "department": {
      "type": "choice",
      "instructions": "Which team should handle `message`?",
      "criteria": {
        "billing": "Payment, charge, or refund issues",
        "technical": "Bugs or integration failures",
        "other": "None of these"
      }
    },
    "urgent": {
      "type": "noul",
      "instructions": "Does `message` express urgency?"
    }
  }
}
```

Send it in one request:

```bash
jev run request.json --pretty
```

A request can also be piped through stdin:

```bash
cat request.json | jev run - --pretty
```

## MCP server

`jev-mcp` is a stdio [MCP](https://modelcontextprotocol.io) server installed alongside `jev`. It exposes four tools that map to the CLI commands:

| Tool | Purpose | Required inputs |
|---|---|---|
| `noul` | One yes/no judgment with a probability | `state`, `question` |
| `choice` | One selection from a typed option map | `state`, `question`, `options` |
| `score` | One evaluation against ordered levels | `state`, `question`, `levels` |
| `run` | A complete multi-question System One request | `request` |

`choice` requires at least two options and `score` requires at least two levels; a smaller request is rejected as a tool error before any provider call.

Every argument is described in the published tool schemas, so a host can construct a call without reading this page. `run` takes one complete System One request; its `questions` keys become the answer keys in the response:

```json
{
  "request": {
    "state": {"message": "The invoice is wrong again and I want a refund."},
    "questions": {
      "urgent": {"type": "noul", "instructions": "Does this need a reply today?"},
      "team": {
        "type": "choice",
        "instructions": "Which team should own this?",
        "criteria": {"billing": "Invoice or payment problem", "support": "Product or account problem"}
      },
      "anger": {
        "type": "score",
        "instructions": "How frustrated is the sender?",
        "criteria": ["Calm", "Annoyed", "Angry"]
      }
    }
  }
}
```

Request members this client does not know are forwarded to the provider unchanged.

Every tool also accepts the optional `provider`, `model`, and `endpoint` arguments. Authentication, provider selection, model defaults, endpoint resolution, and response normalization are the same as for `jev`, including `JEV_PROVIDER` and the credential store, so no separate setup is required.

Add the server to an MCP host with a minimal stdio entry:

```json
{
  "mcpServers": {
    "jev": {
      "command": "jev-mcp"
    }
  }
}
```

Pass provider configuration through the host's environment block when the default is not wanted:

```json
{
  "mcpServers": {
    "jev": {
      "command": "jev-mcp",
      "env": {
        "JEV_PROVIDER": "openrouter",
        "OPENROUTER_API_KEY": "your-api-key"
      }
    }
  }
}
```

`state` is sent verbatim over MCP. Unlike the CLI, `-` does not read stdin and a leading `@` does not read a file, because stdin carries the MCP protocol frames. Read a file in the host and pass its content as `state`.

Invalid input and provider failures are returned as MCP tool errors and never include the API key. stdout carries MCP protocol frames only; diagnostics go to stderr.

## Output and automation

The default stdout is one JSON object. Logs and structured errors go to stderr, so stdout can be piped directly into another program.

Use `--value` with `noul`, `choice`, or `score` when a script needs only the primary answer:

```bash
if awk 'BEGIN { exit !(ARGV[1] >= 0.9) }' \
  "$(jev noul --question 'Is this urgent?' --state 'Restore service today.' --value)"; then
  echo urgent
fi
```

Use `--model` to select another model available to the account:

```bash
jev noul --question 'Is this urgent?' --state 'Restore service today.' \
  --model jev-latest \
  --pretty
```

## Exit codes

| Code | Meaning |
|---:|---|
| `0` | Success |
| `1` | Unexpected API response or other error |
| `2` | Invalid arguments or input |
| `3` | Missing or rejected authentication |
| `4` | Connection, rate-limit, or transient server error |

An error is emitted as JSON on stderr:

```json
{"ok": false, "error": "TypeSafe API key is not stored; run: jev auth set"}
```

## Scope and limitations

The `jev` command is a thin client for focused System One judgments. It does not generate prose, perform arithmetic, compare dates, or replace application-level validation. Keep deterministic work in code and use Jev for semantic judgments.

The CLI sends the supplied state and questions to the selected provider. Do not submit data that your organization is not permitted to send to that service.

## License

[MIT](LICENSE)
