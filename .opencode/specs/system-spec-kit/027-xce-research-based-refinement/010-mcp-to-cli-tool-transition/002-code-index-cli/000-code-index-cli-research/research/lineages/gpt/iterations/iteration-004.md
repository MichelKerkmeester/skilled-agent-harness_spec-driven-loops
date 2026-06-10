# Iteration 4: MCP Affordance Replacement Design

## Focus

Decide which spec-memory CLI decisions transfer and where `mk_code_index` differs.

## Findings

1. The spec-memory research verdict transfers at the architecture level: CLI-over-daemon with auto-spawn is the zero-loss pattern. [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/research.md:12]
2. The spec-memory CLI design generated subcommands from canonical `TOOL_DEFINITIONS` and reused Zod validation; code-index can generate from `CODE_GRAPH_TOOL_SCHEMAS` but cannot reuse the Zod path verbatim. [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/research.md:150] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:200]
3. Code-index's `validateToolArgs()` currently enforces unknown keys, enum membership, and string minLength; required fields remain per-dispatch and numeric ranges are handler-clamped. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:213]
4. Required field checks occur in the dispatcher for `code_graph_query`, `code_graph_classify_query_intent`, and `detect_changes`, so the CLI should call the dispatcher/handler boundary or preserve the same split. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:84]
5. Exit taxonomy transfers: success 0, usage 64, non-retryable protocol/service 69, retryable socket/backend recycled 75. The `-32001` retryable precedent comes from the spec-memory session proxy design. [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/research.md:165]

## Sources Consulted

- Spec-memory merged research
- Spec-memory CLI back-end design
- Code-index schema and dispatcher

## Assessment

`newInfoRatio`: 0.78. Most architecture was inherited, but validation and dispatcher details are code-index-specific.

Confidence: high.

## Reflection

Worked: prior art accelerated architecture, but source reads prevented an invalid Zod assumption.

Failed/ruled out: schema generation that assumes Zod.

## Recommended Next Focus

Long-running scan/apply/verify semantics.
