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
  - id: mcp-cardinality-tests
    requirement: MCP choice and score tools reject fewer than two entries before provider access and preserve valid two-entry payloads
    phase: pre-integration
    owner: conflux-acceptance
    trigger: pull-request-validation
    automation: Makefile
    evidence: make test executes the focused cardinality cases in tests/test_mcp_server.py and the complete repository suite
    rerun: make test
    prerequisites: []
    execution_class: repository-local
    completion_role: change-blocking
---

# Enforce MCP choice and score cardinality

**Change Type**: implementation

## Why

The reviewed MCP contract required at least two `choice.options` entries and at least two `score.levels` entries. The archived implementation validates only non-empty collections, so a one-option choice and one-level score reach the provider even though neither represents a meaningful choice or scale.

## What Changes

- Reject `choice` calls with fewer than two options before provider access.
- Reject `score` calls with fewer than two levels before provider access.
- Add boundary tests proving zero and one entries fail while two entries reach the shared provider boundary.
- Align the canonical MCP specification and user-facing tool descriptions with the minimum cardinality.

## Scope

The change is limited to MCP validation, focused tests, documentation, and the MCP canonical specification. CLI behavior, request translation, provider configuration, credentials, and response normalization remain unchanged.

## Acceptance

- A one-option MCP `choice` returns a bounded tool error and makes no provider call.
- A one-level MCP `score` returns a bounded tool error and makes no provider call.
- Two-option `choice` and two-level `score` requests retain their current payload behavior.
- `make test`, `make build`, and archive validation pass.
