## MODIFIED Requirements

### Requirement: MCP exposes typed Jev judgment tools

The stdio MCP server SHALL expose `noul`, `choice`, `score`, and `run` tools with typed inputs and SHALL return complete normalized Jev responses. Every public argument SHALL have a behavioral JSON Schema description. The `run.request` schema SHALL expose the required System One `state` and `questions` members and typed question specifications while remaining forward-compatible with additional request fields.

#### Scenario: Discover described tools over stdio

**Given**: An MCP client starts `jev-mcp` over stdio
**When**: The client lists tools
**Then**: It discovers the four in-scope Jev tools with input schemas
**And**: Every public argument has a description that explains its behavior or override semantics
**And**: The `run.request` schema requires `state` and `questions`
**And**: A question specification requires `type` and `instructions` and describes criteria for choice and score questions
**And**: The schema permits an empty questions map and additional request and question fields for forward compatibility

#### Scenario: Invoke a judgment tool

**Given**: A valid tool request and mocked provider response
**When**: The client invokes the tool
**Then**: The server builds the corresponding Jev request through shared package code
**And**: It returns the normalized structured response

#### Scenario: Forward a typed multi-question request

**Given**: A `run` request containing state, multiple typed questions, and additional forward-compatible fields
**When**: The MCP client invokes `run`
**Then**: The request reaches the provider boundary without losing its state, questions, or additional fields
**And**: Existing model override and provider-default behavior remains unchanged
