# Iteration 2: Read-Path Readiness and False-Safe Behavior

## Focus

Trace how read-path tools behave when the graph is stale, empty, or unavailable.

## Findings

1. `code_graph_query` runs `ensureCodeGraphReady()` before answering and blocks on non-fresh readiness via `shouldBlockReadPath()`. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1206] [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1263]
2. `code_graph_context` mirrors the same rule: non-fresh or failed verification returns a blocked/degraded envelope with required action rather than graph answers. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:58]
3. `detect_changes` explicitly disables inline indexing and blocks before diff parsing when readiness is not fresh, preventing false-safe empty impact reports. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:241]
4. `detect_changes` also performs diff-path containment and byte-safety checks, so the CLI must pass raw diff input through the existing handler rather than reimplement path parsing casually. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:137]
5. Readiness vocabulary maps `fresh/stale/empty/error` into canonical trust states; CLI text rendering must not collapse `blocked` into success. [SOURCE: file:.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:100]

## Sources Consulted

- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts`

## Assessment

`newInfoRatio`: 0.92. This pass added read-path-specific CLI constraints.

Confidence: high. The blocking behavior is explicit in three handlers.

## Reflection

Worked: comparing all three read handlers exposed a shared CLI invariant.

Failed/ruled out: returning `[]` or exit 0 with "no impact" on stale graph.

## Recommended Next Focus

Daemon dependencies and lease/IPC architecture.
