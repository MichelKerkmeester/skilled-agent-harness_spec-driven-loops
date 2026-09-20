## MODIFIED Requirements

### Requirement: Stdio framing and failures are safe

The MCP server SHALL keep stdout exclusive to MCP protocol traffic and SHALL reject invalid tool inputs before provider access. `choice` SHALL require at least two option entries, and `score` SHALL require at least two ordered levels. MCP state values SHALL be passed verbatim; the MCP path SHALL NOT interpret `@path` as a file reference or `-` as stdin because stdin carries MCP protocol frames. Provider and configuration failures SHALL be surfaced as MCP tool errors without exposing credentials.

#### Scenario: Reject invalid structured input

**Given**: A choice map with fewer than two entries, score levels with fewer than two entries, or a batch request missing `state` or `questions`
**When**: The corresponding MCP tool is called
**Then**: The call fails as an MCP tool error before any provider request

#### Scenario: Accept the minimum useful cardinality

**Given**: A choice map with two valid entries or score levels with two valid entries
**When**: The corresponding MCP tool is called
**Then**: The server builds the corresponding Jev request through shared package code
**And**: The choice entries or ordered score levels are preserved in the provider payload

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
