# Iteration 9: Risk Register and Design Deltas

## Focus

Turn the evidence into implementation deltas and acceptance tests.

## Findings

1. `D1` CLI shim: add `.opencode/bin/code-index.cjs` or `.opencode/bin/mk-code-index.cjs` as the stable user-facing entrypoint; it should reuse the existing launcher and bridge path.
2. `D2` compiled CLI: add `mcp_server/code-index-cli.ts` or equivalent compiled command runner that calls the existing JSON-RPC/handler surface.
3. `D3` manifest generation: derive subcommands from `CODE_GRAPH_TOOL_SCHEMAS`, but preserve code-index's hand-coded validator semantics and per-dispatch required-field checks. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:213]
4. `D4` exit taxonomy: map usage to 64, non-retryable protocol/service failure to 69, retryable socket/backend recycled/temporary daemon failure to 75, mirroring spec-memory closure. [SOURCE: file:.opencode/specs/system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/research.md:165]
5. `D5` warm-only hook policy: `status`/read fallback may be prompt-time; scan/apply/verify require explicit/maintenance contexts and `--timeout-ms`.
6. `D6` dual-client tests: one daemon, existing MCP route plus CLI route, same DB/socket; cover at least `status`, `query` blocked path, and `detect_changes` blocked path.
7. `D7` dual-spawn/respawn tests: simultaneous CLI starts should settle on one owner or bridge; dead socket should respawn without deleting a successor lease. [SOURCE: file:.opencode/bin/mk-code-index-launcher.cjs:550]

## Sources Consulted

- Code-index launcher/bridge/proxy/owner lease
- Code-index schema/dispatcher
- Spec-memory risk closure research

## Assessment

`newInfoRatio`: 0.36. Mostly synthesis; novelty is the code-index-specific delta set.

Confidence: medium-high. Implementation packet should validate naming and exact file placement.

## Reflection

Worked: deltas map one-to-one to evidence.

Failed/ruled out: shipping only a thin wrapper without drift and race tests.

## Recommended Next Focus

Final verdict, effort, and report synthesis.
