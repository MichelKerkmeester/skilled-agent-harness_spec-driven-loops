## Implementation Tasks

- [x] Add focused MCP tests that reject zero- and one-entry `choice.options` and `score.levels` before provider access, while preserving successful two-entry payload forwarding. (verification: integration - `make test`; verification-id: mcp-cardinality-tests)
- [x] Tighten MCP tool validation to require at least two choice options and at least two score levels, without changing CLI or provider behavior. (verification: integration - `make test`; verification-id: mcp-cardinality-tests)
- [x] Update MCP-facing documentation and tool descriptions to state the two-entry minimum. (verification: integration - `make test`; verification-id: mcp-cardinality-tests)

## Final Validation

- `make test`
- `make build`
- `cflx openspec validate enforce-mcp-cardinality --archive-gate`
