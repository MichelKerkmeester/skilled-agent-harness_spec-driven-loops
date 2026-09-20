---
change_type: implementation
priority: medium
dependencies: []
references:
  - src/jev_cli/mcp_server.py
  - tests/test_mcp_server.py
  - README.md
  - openspec/specs/mcp-server/spec.md
verifications:
  - id: mcp-schema-discovery
    requirement: MCP discovery publishes behavioral descriptions for all public arguments and a structured run request schema
    phase: pre-integration
    owner: conflux-acceptance
    trigger: pull-request-validation
    automation: Makefile
    evidence: make test exercises list_tools through the MCP SDK client and asserts the published schemas
    rerun: make test
    prerequisites: []
    execution_class: repository-local
    completion_role: change-blocking
  - id: mcp-run-schema
    requirement: A valid typed multi-question request reaches the provider boundary without field loss
    phase: pre-integration
    owner: conflux-acceptance
    trigger: pull-request-validation
    automation: Makefile
    evidence: make test invokes run through the MCP SDK client with the provider boundary mocked
    rerun: make test
    prerequisites: []
    execution_class: repository-local
    completion_role: change-blocking
  - id: mcp-schema-docs
    requirement: README documents one run request matching the published schema
    phase: pre-integration
    owner: conflux-acceptance
    trigger: pull-request-validation
    automation: Makefile
    evidence: make test verifies the README run example fields against the MCP request schema published from tests/test_mcp_server.py
    rerun: make test
    prerequisites: []
    execution_class: repository-local
    completion_role: change-blocking
rollback: Revert the schema-description commit; runtime provider behavior and stored credentials are unchanged.
---

# Describe MCP inputs and batch request schema

**Change Type**: implementation

## Why

The four tools are discoverable, but their generated input schemas mostly expose only automatic titles such as `State` and `Question`. Agents cannot reliably infer that option keys become outputs, score levels are ordered from low to high, provider overrides are normally omitted, or how to construct a complete `run.request`.

## What Changes

- Add concise JSON Schema descriptions for every public MCP argument: `state`, `question`, `options`, `levels`, `request`, `provider`, `model`, and `endpoint`.
- Describe choice option keys as returned stable values and score levels as ordered from lowest to highest, with zero-based output positions.
- Replace `run.request`'s opaque free-form object schema with a typed System One request schema containing required `state` and `questions`, optional `model`, and typed question specifications for `noul`, `choice`, and `score`.
- Keep the wire payload unchanged: `run` forwards the complete request after existing model/provider selection, preserves unknown request fields for forward compatibility, and does not reinterpret state values.
- Add MCP SDK discovery tests that inspect the actual published schemas and an invocation test proving a valid typed multi-question request is forwarded unchanged except for the existing model-default behavior.
- Update README MCP documentation with one compact `run` request example.

## Out of Scope

- Provider, credential, endpoint, normalization, and response changes.
- CLI parsing or CLI request validation changes.
- New tools or changes to stdio framing.
- Restricting future System One request fields not known by this client.

## Acceptance

- MCP discovery exposes meaningful descriptions for every public argument.
- `run.request` schema requires `state` and `questions`; each question requires `type` and `instructions` and describes type-specific `criteria`.
- A valid multi-question request remains accepted and reaches the provider boundary without losing fields.
- Existing four tool names, response format, provider behavior, cardinality checks, and framing tests remain unchanged.
- `make test`, `make build`, and the OpenSpec archive gate pass.
