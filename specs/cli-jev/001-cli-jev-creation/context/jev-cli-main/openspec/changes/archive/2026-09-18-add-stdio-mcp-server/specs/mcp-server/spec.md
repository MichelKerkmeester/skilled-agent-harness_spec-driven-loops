## ADDED Requirements

### Requirement: Default installation includes a stdio MCP server

The normal `jev-cli` package installation SHALL install an executable stdio MCP server without requiring an optional dependency extra or separate package, while preserving the existing `jev` CLI.

#### Scenario: Install the package once

**Given**: A supported Python environment installs `jev-cli` normally
**When**: The installation completes
**Then**: Both `jev` and `jev-mcp` console commands are available
**And**: The user did not select an optional MCP extra

### Requirement: MCP exposes typed Jev judgment tools

The stdio MCP server SHALL expose `noul`, `choice`, `score`, and `run` tools with typed inputs and SHALL return complete normalized Jev responses.

#### Scenario: Discover tools over stdio

**Given**: An MCP client starts `jev-mcp` over stdio
**When**: The client lists tools
**Then**: It discovers the four in-scope Jev tools with input schemas

#### Scenario: Invoke a judgment tool

**Given**: A valid tool request and mocked provider response
**When**: The client invokes the tool
**Then**: The server builds the corresponding Jev request through shared package code
**And**: It returns the normalized structured response

### Requirement: MCP and CLI share provider behavior

The MCP server SHALL reuse the CLI's provider selection, model defaults, endpoint resolution, credential lookup, provider translation, and response normalization behavior.

#### Scenario: Select a non-default provider

**Given**: A tool request selects a supported provider and optional model or endpoint override
**When**: The MCP server evaluates the request
**Then**: It applies the same provider configuration and credential precedence as the CLI
**And**: It does not invoke the CLI as a subprocess

### Requirement: Stdio framing and failures are safe

The MCP server SHALL keep stdout exclusive to MCP protocol traffic and SHALL reject invalid tool inputs before provider access. MCP state values SHALL be passed verbatim; the MCP path SHALL NOT interpret `@path` as a file reference or `-` as stdin because stdin carries MCP protocol frames. Provider and configuration failures SHALL be surfaced as MCP tool errors without exposing credentials.

#### Scenario: Reject invalid structured input

**Given**: An empty choice map, empty score levels, or a batch request missing `state` or `questions`
**When**: The corresponding MCP tool is called
**Then**: The call fails as an MCP tool error before any provider request

#### Scenario: Provider call fails

**Given**: Shared Jev code raises a credential, configuration, transient, or response error
**When**: An MCP tool is executing
**Then**: The client receives a bounded MCP tool error
**And**: No API key or Authorization value is returned
**And**: No ordinary application output corrupts stdout framing

#### Scenario: Preserve state strings that resemble CLI input syntax

**Given**: An MCP call whose state is `-` or begins with `@`
**When**: The server builds the Jev request
**Then**: The exact string is included in the provider payload
**And**: The server does not read stdin or a local file
