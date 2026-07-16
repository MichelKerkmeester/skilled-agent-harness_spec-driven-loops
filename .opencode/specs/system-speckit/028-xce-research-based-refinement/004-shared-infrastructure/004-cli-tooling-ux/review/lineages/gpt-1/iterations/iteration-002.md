# Iteration 2: Security

## Focus
Security review of prompt-time warm fallback paths, mutation blocking, retryability normalization, and stderr sanitization.

## Scorecard
- Dimensions covered: security
- Files reviewed: 5
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings

No security findings. The spec-memory bridge allowlist accepts only `brief/status` requests and `session_resume/memory_health` tools before warm probing, and the bridge response sanitizes stderr to `[stderr-present]`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:18-19] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:224-235] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:320-323] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:347-356]

The shared envelope exposes `status`, `reason`, `exitCode`, and `retryable`, with retryability gated to timeout, exit 75, and known warm-probe reasons. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/warm-cli-fallback-envelope.ts:5-12] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/warm-cli-fallback-envelope.ts:21-51]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:347-356` | Prompt-time allowlist requirement has direct source support. |
| feature_catalog_code | pass | advisory | `.opencode/skills/system-spec-kit/mcp_server/hooks/warm-cli-fallback-envelope.ts:43-51` | Envelope retryability behavior is implemented in the shared helper. |

## Assessment
- New findings ratio: 0.0
- Dimensions addressed: security
- Novelty justification: No unsafe mutation path or stderr exposure found in reviewed prompt-time bridge paths.

## Ruled Out
- Arbitrary prompt-time memory tool dispatch: rejected before warm probing by `promptSafeSpecMemoryBridgePolicy`.

## Dead Ends
- None.

## Recommended Next Focus
Traceability review of parent and child phase status, task completion, and graph metadata freshness.
Review verdict: PASS
