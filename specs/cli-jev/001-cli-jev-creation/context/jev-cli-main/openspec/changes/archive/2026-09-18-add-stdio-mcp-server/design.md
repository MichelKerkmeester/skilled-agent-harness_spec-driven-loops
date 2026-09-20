# Design

## Package and entry point

MCP support is part of the default `jev-cli` installation. `pyproject.toml` declares the official Python MCP SDK as a normal dependency and adds `jev-mcp = "jev_cli.mcp_server:main"`. There is no optional `mcp` extra and no separate distribution.

The existing `jev` entry point remains unchanged.

## Adapter boundary

`src/jev_cli/mcp_server.py` owns only MCP schema, validation, transport startup, and conversion of existing domain errors into MCP tool errors. It imports and calls shared functions from `jev_cli` for:

- provider selection and defaults
- endpoint resolution
- credential lookup
- request execution
- provider request translation
- response normalization

It must not execute `jev` as a child process. Minimal request-building helpers may be extracted from the CLI module if both the argparse path and MCP tools use them; unrelated restructuring is prohibited.

## Tool contracts

### `noul`

Inputs: `state`, `question`, optional `provider`, `model`, and `endpoint`.

Builds one question named `answer` with type `noul`. Returns the complete normalized provider response.

### `choice`

Inputs: `state`, `question`, `options: dict[str, str]`, optional provider fields.

Rejects an empty map and empty keys/descriptions before calling the provider. Builds one question named `answer` with type `choice` and `criteria` equal to the option map.

### `score`

Inputs: `state`, `question`, `levels: list[str]`, optional provider fields.

Rejects an empty list and empty level descriptions before calling the provider. Builds one question named `answer` with type `score` and ordered `criteria` equal to `levels`.

### `run`

Inputs: `request: dict`, optional `provider`, `model`, and `endpoint` override.

Requires a mapping containing `state` and `questions`. An explicit `model` tool argument overrides the request model; otherwise the request model is preserved, and the selected provider's default is added only when neither is present. It returns the complete normalized response.

## State and configuration

`state` accepts any JSON value. MCP tools pass it verbatim: strings beginning with `@` are not file references, and `-` never reads stdin. The CLI-only `@file`, `-`, and implicit-stdin interpretation must not be called from the MCP path because stdin carries MCP protocol frames.

Provider is a typed four-value enum: `official`, `vercel`, `openrouter`, or `custom`. It defaults to `JEV_PROVIDER` or `official`, matching the CLI. An invalid `JEV_PROVIDER` value fails as a bounded MCP tool error before provider access. Model and endpoint overrides use the existing resolver behavior. Credentials remain environment-first with the existing XDG credential store fallback.

## Error and stdio behavior

Input errors and `CliError` failures are surfaced as MCP tool errors. Error text may identify provider/status and actionable setup, but must not include credential values or Authorization headers.

The server uses stdio transport only. No `print()` call or logging handler may write ordinary text to stdout. Diagnostics use standard logging to stderr.

## Verification strategy

Tests use the MCP SDK client/transport against the packaged server interface and mock the existing provider call boundary. They verify discovery and invocation, not only direct Python function calls. Network access and real API keys are forbidden in tests.

The repository's existing `make test` command remains the bounded acceptance command and runs on the existing three-OS CI matrix.
