# Iteration 001 Prompt

Review scope `C-rest-of-server` for MCP server infrastructure outside search pipeline and store/index/lifecycle surfaces. Focus on daemon lifecycle races, IPC trust boundaries, socket/path handling, reconnect/replay, provider/handler fail-closed behavior, and spec-vs-code drift.

Constraints honored:
- `maxIterations: 1`.
- Artifact root bound directly to `review-r2/lineages/gpt55r2-c-6`.
- `resolveArtifactRoot` not invoked.
- Review-only; target code left unchanged.
