# Deep Review Strategy

## Binding

- Session: `fanout-codex-2-1780592962035-w7xlfk`
- Artifact dir: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/review/lineages/codex-2`
- Artifact root resolution: bound directly from `config.fanout_lineage_artifact_dir`
- `resolveArtifactRoot` command: not run

## Target

Review slice: MCP session lifecycle, memory index/ingest, embedders, context-server entrypoint and tool schema layer.

Primary optimization: schema-to-handler parity and drift detection for advertised options, ignored options, shape mismatches and stale docs/install-guide call shapes.

## Passes

1. Correctness: compare public tool definitions, Zod validation and handler behavior.
2. Security: inspect governed ingest and session isolation boundaries.
3. Traceability: map caller-facing schemas to dispatch and handler implementation.
4. Maintainability: check alias/discovery/embedder/session surfaces for drift-prone seams.
5. Stabilization: re-read affected edges and verify no new independent findings appear.

## Convergence Decision

Converged after five iterations. P0 count is zero. One P1 remains open, so the final verdict is `CONDITIONAL`.
