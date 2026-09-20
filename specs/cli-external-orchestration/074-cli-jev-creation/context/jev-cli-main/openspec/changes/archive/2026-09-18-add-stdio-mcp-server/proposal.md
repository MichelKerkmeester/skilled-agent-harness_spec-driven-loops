---
change_type: implementation
priority: medium
dependencies: []
references:
  - pyproject.toml
  - src/jev_cli/__init__.py
  - tests/test_jev.py
  - README.md
verifications:
  - id: mcp-server-tests
    requirement: The installed package exposes a working stdio MCP server while preserving the existing CLI and provider behavior
    phase: pre-integration
    owner: conflux-acceptance
    trigger: pull-request-validation
    automation: Makefile
    evidence: make test
    rerun: make test
    prerequisites: []
    execution_class: repository-local
    completion_role: change-blocking
---

# Add a stdio MCP server

**Change Type**: implementation

## Problem / Context

`jev-cli` exposes Jev judgments only through the `jev` command. MCP hosts cannot discover typed Jev tools or invoke them through stdio without building a separate wrapper.

The package must install MCP support by default. Users must not need an optional `jev-cli[mcp]` extra or a second package. Existing provider selection, credential storage, request translation, response normalization, and CLI behavior remain authoritative.

## Proposed Solution

Add the official Python MCP SDK as a normal runtime dependency and install a `jev-mcp` console command. The command starts a stdio-only MCP server and exposes four tools:

- `noul`: one yes/no judgment with a probability
- `choice`: one selection from a non-empty typed option map
- `score`: one evaluation against ordered levels
- `run`: a complete multi-question System One request

The MCP adapter must call shared `jev_cli` request functions directly. It must not spawn the `jev` CLI as a subprocess. Provider defaults and overrides must match the existing CLI: `official`, `vercel`, `openrouter`, and `custom`, including `JEV_PROVIDER`, provider-specific credentials, model defaults, and custom endpoint handling.

Tool results return the normalized structured API response. Errors derived from `CliError`, malformed inputs, and unexpected provider responses must be reported as MCP tool errors without exposing API keys. The stdio process must not write logs or application output to stdout outside MCP protocol frames.

Update package metadata, lockfile, README, and bundled Agent Skill documentation. Remove the dependency-free claim because the MCP SDK becomes mandatory.

## Change Boundary

In scope:

- Python package metadata and lockfile
- one focused MCP server module and minimal shared helpers needed to avoid duplicated request construction
- unit and stdio integration tests using local mocks/fixtures, without real credentials or network access
- README and both source/bundled Agent Skill copies

Out of scope:

- HTTP MCP transport
- MCP resources, prompts, or sampling
- OAuth or new credential storage
- changes to Jev API semantics or provider endpoints
- a separate package or optional dependency extra
- publishing a release or writing to GitHub

## Preserved Contracts

- `uv tool install jev-cli` remains the single installation command.
- `jev` command names, inputs, JSON output, stderr errors, exit codes, credential paths, provider selection, and provider translations remain compatible.
- The existing `jev install-skills` managed-directory safeguards remain unchanged.
- No real API request is required by repository-local verification.

## Failure Behavior

- Invalid tool input fails before an API request and is surfaced as an MCP tool error.
- Missing or rejected credentials, invalid custom endpoint configuration, transient failures, and malformed provider responses preserve the existing safe error messages and do not leak credentials.
- `choice` rejects an empty option map; `score` rejects an empty levels list; `run` rejects payloads without `state` and `questions`.
- Startup and diagnostic logging use stderr only.

## Acceptance Criteria

1. Installing `jev-cli` normally installs both `jev` and `jev-mcp`; no package extra is required.
2. An MCP client connected to `jev-mcp` over stdio discovers exactly the four Jev judgment tools in scope.
3. Each tool creates the expected Jev payload and returns the normalized structured provider response through direct shared Python calls.
4. Provider, model, endpoint, environment, and stored-credential behavior matches the CLI.
5. Invalid input and API failures become bounded MCP tool errors and never corrupt stdout framing or expose credentials.
6. Existing CLI tests and new MCP tests pass on the repository's Linux, macOS, and Windows CI matrix.
7. README and bundled skill documentation show normal installation and a minimal stdio client configuration.

## Explicit Completion Conditions

- `pyproject.toml` has a normal MCP SDK dependency and a `jev-mcp` entry point.
- Tests enumerate and call all four tools through an MCP stdio client or equivalent SDK transport, with a mocked provider boundary.
- Tests cover invalid `choice`, invalid `score`, invalid `run`, one propagated `CliError`, provider/model/endpoint forwarding, invalid `JEV_PROVIDER`, absence of non-protocol stdout output, and verbatim handling of `-` and `@path` state strings without stdin or file access.
- Existing `jev` tests remain green.
- `make test` succeeds from a clean checkout after lockfile synchronization.
- OpenSpec archive validation succeeds and promotes the MCP capability requirement.

## Out of Scope

Release publication, GitHub PR creation, HTTP transport, and compatibility guarantees beyond the existing Python 3.13 package support are not part of this change.
