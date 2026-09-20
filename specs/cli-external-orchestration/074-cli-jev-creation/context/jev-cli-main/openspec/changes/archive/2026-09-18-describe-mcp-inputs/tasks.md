## Implementation Tasks

- [x] Add MCP SDK discovery tests that require descriptions on every public argument and inspect the structured `run.request` schema. (verification: integration - `make test`; verification-id: mcp-schema-discovery)
- [x] Add typed metadata for simple-tool arguments and a forward-compatible typed System One request for `run`; keep runtime values as ordinary dictionaries and preserve unknown fields. (verification: integration - `make test`; verification-id: mcp-schema-discovery)
- [x] Add MCP transport invocation tests proving a valid typed multi-question request retains unknown fields and that the existing empty `questions` map remains accepted at the MCP layer. (verification: integration - `make test`; verification-id: mcp-run-schema)
- [x] Add a compact README example matching the published `run.request` schema and verify its required fields in `tests/test_mcp_server.py`. (verification: integration - `make test`; verification-id: mcp-schema-docs)

## Final Validation

- `make test`
- `make build`
- `cflx openspec validate describe-mcp-inputs --archive-gate`
- Inspect `list_tools()` output and confirm all argument descriptions and structured `run.request` schema are present.
